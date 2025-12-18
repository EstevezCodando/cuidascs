import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Bell, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { WasteTypeBadge } from '@/components/WasteTypeBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CooperativasPage: React.FC = () => {
  const { 
    alertas, 
    cooperativas, 
    hotspots, 
    atualizarStatusAlerta, 
    usuario 
  } = useApp();

  const alertasNovos = alertas.filter(a => a.status === 'novo');
  const alertasAtivos = alertas.filter(a => ['aceito'].includes(a.status));
  const alertasHistorico = alertas.filter(a => ['recusado', 'concluido'].includes(a.status));

  const getHotspotInfo = (hotspotId: string) => {
    return hotspots.find(h => h.id === hotspotId);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  const renderAlertCard = (alerta: typeof alertas[0]) => {
    const hotspot = getHotspotInfo(alerta.hotspotId);
    const cooperativa = cooperativas.find(c => c.id === alerta.cooperativaId);

    return (
      <motion.div key={alerta.id} variants={itemVariants}>
        <Card className="card-hover">
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-status-alert/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-status-alert" />
                </div>
                <div>
                  <CardTitle className="text-base">
                    Alerta de Coleta
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {alerta.criadoEm.toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
              <StatusBadge status={alerta.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Materials */}
            <div className="flex flex-wrap gap-2">
              {alerta.materialSugerido.map((mat) => (
                <WasteTypeBadge key={mat} tipo={mat} />
              ))}
            </div>

            {/* Location */}
            {hotspot && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>
                  {hotspot.latitudeCentro.toFixed(4)}, {hotspot.longitudeCentro.toFixed(4)}
                </span>
              </div>
            )}

            {/* Time window */}
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>
                Janela: {alerta.janelaColetaInicio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                {' - '}
                {alerta.janelaColetaFim.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            {/* Weight estimate */}
            {alerta.pesoEstimadoKg && (
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-muted-foreground" />
                <span>Peso estimado: ~{alerta.pesoEstimadoKg}kg</span>
              </div>
            )}

            {/* Cooperativa info */}
            {cooperativa && (
              <div className="p-2 bg-success/10 rounded-lg text-sm">
                <p className="font-medium text-success">{cooperativa.nome}</p>
              </div>
            )}

            {/* Actions for cooperativa profile */}
            {usuario.perfil === 'cooperativa' && alerta.status === 'novo' && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() => atualizarStatusAlerta(alerta.id, 'aceito', cooperativas[0]?.id)}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Aceitar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => atualizarStatusAlerta(alerta.id, 'recusado')}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Recusar
                </Button>
              </div>
            )}

            {usuario.perfil === 'cooperativa' && alerta.status === 'aceito' && (
              <div className="flex gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  onClick={() => atualizarStatusAlerta(alerta.id, 'concluido')}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Marcar como Concluído
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="w-6 h-6 text-success" />
          Cooperativas
        </h1>
        <p className="text-muted-foreground">
          Alertas de coleta e parceiros cadastrados
        </p>
      </motion.div>

      <Tabs defaultValue="alertas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alertas" className="relative">
            Alertas
            {alertasNovos.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center">
                {alertasNovos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="parceiros">Parceiros</TabsTrigger>
        </TabsList>

        <TabsContent value="alertas" className="space-y-6">
          {/* New alerts */}
          {alertasNovos.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Bell className="w-4 h-4 text-status-alert" />
                Novos Alertas ({alertasNovos.length})
              </h2>
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {alertasNovos.map(renderAlertCard)}
              </motion.div>
            </div>
          )}

          {/* Active alerts */}
          {alertasAtivos.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold">Em Andamento ({alertasAtivos.length})</h2>
              <motion.div
                className="grid gap-4 md:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {alertasAtivos.map(renderAlertCard)}
              </motion.div>
            </div>
          )}

          {/* History */}
          {alertasHistorico.length > 0 && (
            <div className="space-y-3">
              <h2 className="font-semibold text-muted-foreground">
                Histórico ({alertasHistorico.length})
              </h2>
              <motion.div
                className="grid gap-4 md:grid-cols-2 opacity-70"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {alertasHistorico.map(renderAlertCard)}
              </motion.div>
            </div>
          )}

          {alertas.length === 0 && (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <h3 className="font-medium text-lg mb-2">Nenhum alerta</h3>
              <p className="text-muted-foreground">
                Alertas de coleta aparecerão aqui quando ocorrências forem resolvidas.
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="parceiros">
          <motion.div
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {cooperativas.map((coop) => (
              <motion.div key={coop.id} variants={itemVariants}>
                <Card className="card-hover">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{coop.nome}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {coop.areasAtendidas.length} áreas
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap gap-1">
                      {coop.materiaisAceitos.map((mat) => (
                        <WasteTypeBadge key={mat} tipo={mat} size="sm" />
                      ))}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{coop.contato}</span>
                      </div>
                      {coop.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span>{coop.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Áreas atendidas:</p>
                      <div className="flex flex-wrap gap-1">
                        {coop.areasAtendidas.map((area) => (
                          <Badge key={area} variant="secondary" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CooperativasPage;
