import React from 'react';
import { motion } from 'framer-motion';
import { 
  Route, 
  Clock, 
  MapPin, 
  Play, 
  CheckCircle, 
  XCircle,
  Loader2,
  Calendar,
  Trash2,
  FileText
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { StatusBadge } from '@/components/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { RouteMapPreview } from '@/components/RouteMapPreview';

const RoteirosPage: React.FC = () => {
  const { roteiros, hotspots, atualizarStatusRoteiro, usuario } = useApp();
  const navigate = useNavigate();

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

  const roteirosOrdenados = [...roteiros].sort(
    (a, b) => b.criadoEm.getTime() - a.criadoEm.getTime()
  );

  // Featured route data (Roteiro do Papel)
  const roteiroPapel = {
    nome: 'Roteiro do Papel',
    horario: '08:00 - 10:30',
    pontos: [
      { lat: -15.7965, lng: -47.8875, label: 'Ponto 1' },
      { lat: -15.7970, lng: -47.8868, label: 'Ponto 2' },
      { lat: -15.7975, lng: -47.8862, label: 'Ponto 3' },
      { lat: -15.7968, lng: -47.8855, label: 'Ponto 4' },
    ],
    container: { lat: -15.7980, lng: -47.8850, label: 'Caçamba' },
    materiais: ['Papelão', 'Papel branco', 'Jornais', 'Revistas'],
    cooperativa: 'CENTCOOP',
  };

  return (
    <div className="container py-6 space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Route className="w-6 h-6 text-info" />
            Roteiros de Limpeza
          </h1>
          <p className="text-muted-foreground">
            {roteiros.length} roteiros criados
          </p>
        </div>

        <Button
          variant="outline"
          onClick={() => navigate('/hotspots')}
        >
          Criar Novo Roteiro
        </Button>
      </motion.div>

      {/* Featured Route - Roteiro do Papel */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden border-2 border-primary/20">
          <CardHeader className="bg-primary/5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">{roteiroPapel.nome}</CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4" />
                    Horário: {roteiroPapel.horario}
                  </CardDescription>
                </div>
              </div>
              <Badge className="bg-primary text-primary-foreground">
                Em Destaque
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid lg:grid-cols-2">
              {/* Map */}
              <div className="h-64 lg:h-80">
                <RouteMapPreview 
                  points={roteiroPapel.pontos}
                  containerPoint={roteiroPapel.container}
                  className="h-full"
                />
              </div>
              
              {/* Route Details */}
              <div className="p-4 space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Pontos de Coleta
                  </h4>
                  <div className="space-y-2">
                    {roteiroPapel.pontos.map((ponto, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                          {idx + 1}
                        </div>
                        <span>Ponto de coleta {idx + 1}</span>
                        <span className="text-muted-foreground text-xs">
                          ({ponto.lat.toFixed(4)}, {ponto.lng.toFixed(4)})
                        </span>
                      </div>
                    ))}
                    <div className="flex items-center gap-2 text-sm border-t pt-2 mt-2">
                      <div className="w-6 h-6 rounded bg-green-600 text-white flex items-center justify-center">
                        <Trash2 className="w-3 h-3" />
                      </div>
                      <span className="font-medium">Caçamba de destino</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">
                    Materiais Coletados
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {roteiroPapel.materiais.map((material, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Cooperativa Responsável</p>
                    <p className="text-xs text-muted-foreground">{roteiroPapel.cooperativa}</p>
                  </div>
                  <Badge className="bg-success text-success-foreground">Ativo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Routes List */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {roteirosOrdenados.map((roteiro) => (
          <motion.div key={roteiro.id} variants={itemVariants}>
            <Card className="card-hover">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-info/10 flex items-center justify-center">
                      <Route className="w-5 h-5 text-info" />
                    </div>
                    <div>
                      <CardTitle className="text-base">
                        Roteiro #{roteiro.id.slice(0, 8)}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {roteiro.criadoEm.toLocaleDateString('pt-BR')}
                        <Clock className="w-3 h-3 ml-2" />
                        {roteiro.criadoEm.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </div>
                    </div>
                  </div>
                  <StatusBadge status={roteiro.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Hotspots sequence */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Sequência de Pontos ({roteiro.listaHotspots.length})
                  </p>
                  <div className="space-y-2">
                    {roteiro.listaHotspots.map((item, idx) => {
                      const hotspot = getHotspotInfo(item.hotspotId);
                      return (
                        <div
                          key={item.hotspotId}
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                        >
                          <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            {item.ordem}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="w-3 h-3 text-muted-foreground" />
                              <span className="truncate">
                                {hotspot 
                                  ? `${hotspot.latitudeCentro.toFixed(4)}, ${hotspot.longitudeCentro.toFixed(4)}`
                                  : 'Localização não encontrada'
                                }
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            <Clock className="w-3 h-3 mr-1" />
                            {item.etaMinutos}min
                          </Badge>
                          {hotspot && (
                            <Badge 
                              variant="outline" 
                              className="text-xs"
                            >
                              Score: {hotspot.score}
                            </Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                {usuario.perfil === 'operador' && (
                  <div className="flex gap-2 pt-2 border-t">
                    {roteiro.status === 'planejado' && (
                      <Button
                        size="sm"
                        onClick={() => atualizarStatusRoteiro(roteiro.id, 'em_execucao')}
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Iniciar
                      </Button>
                    )}
                    {roteiro.status === 'em_execucao' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => atualizarStatusRoteiro(roteiro.id, 'concluido')}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Concluir
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => atualizarStatusRoteiro(roteiro.id, 'cancelado')}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Cancelar
                        </Button>
                      </>
                    )}
                    {(roteiro.status === 'concluido' || roteiro.status === 'cancelado') && (
                      <p className="text-sm text-muted-foreground">
                        {roteiro.status === 'concluido' 
                          ? `Concluído em ${roteiro.concluidoEm?.toLocaleString('pt-BR')}`
                          : 'Roteiro cancelado'
                        }
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {roteiros.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Route className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
          <h3 className="font-medium text-lg mb-2">Nenhum roteiro criado</h3>
          <p className="text-muted-foreground mb-4">
            Crie roteiros a partir da página de Hotspots.
          </p>
          <Button onClick={() => navigate('/hotspots')}>
            Ver Hotspots
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default RoteirosPage;
