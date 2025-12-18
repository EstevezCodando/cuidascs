import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Package, 
  Clock, 
  Flame, 
  Route, 
  Bell,
  Recycle,
  Calendar,
  Filter,
  FileText,
  Users,
  DollarSign,
  Building2
} from 'lucide-react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import { TIPO_RESIDUO_LABELS, TIPO_RESIDUO_COLORS, TipoResiduo } from '@/types';

const DashboardPage: React.FC = () => {
  const { calcularMetricas, ocorrencias, hotspots, usuario } = useApp();
  const [periodo, setPeriodo] = useState('7d');
  const [activeTab, setActiveTab] = useState('metricas');
  const isPatrocinador = usuario.perfil === 'patrocinador';

  const metricas = useMemo(() => calcularMetricas(), [calcularMetricas]);

  // Chart data
  const wasteTypeData = useMemo(() => {
    const counts: Record<TipoResiduo, number> = {
      organico: 0,
      reciclavel_seco: 0,
      entulho: 0,
      volumoso: 0,
      misto: 0,
    };
    
    ocorrencias.forEach(o => {
      counts[o.tipoResiduo]++;
    });

    return Object.entries(counts).map(([tipo, count]) => ({
      name: TIPO_RESIDUO_LABELS[tipo as TipoResiduo],
      value: count,
      color: TIPO_RESIDUO_COLORS[tipo as TipoResiduo],
    }));
  }, [ocorrencias]);

  const scoreDistribution = useMemo(() => {
    const ranges = [
      { range: '0-25', count: 0, label: 'Baixo' },
      { range: '26-50', count: 0, label: 'Médio' },
      { range: '51-75', count: 0, label: 'Alto' },
      { range: '76-100', count: 0, label: 'Crítico' },
    ];

    hotspots.forEach(h => {
      if (h.score <= 25) ranges[0].count++;
      else if (h.score <= 50) ranges[1].count++;
      else if (h.score <= 75) ranges[2].count++;
      else ranges[3].count++;
    });

    return ranges;
  }, [hotspots]);

  const dailyData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        ocorrencias: 0,
        resolvidas: 0,
      };
    });

    ocorrencias.forEach(o => {
      const dayIndex = 6 - Math.floor(
        (Date.now() - o.criadoEm.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (dayIndex >= 0 && dayIndex < 7) {
        last7Days[dayIndex].ocorrencias++;
        if (o.status === 'resolvido') {
          last7Days[dayIndex].resolvidas++;
        }
      }
    });

    return last7Days;
  }, [ocorrencias]);

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

  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'primary' 
  }: { 
    title: string; 
    value: string | number; 
    icon: React.ElementType; 
    trend?: string;
    color?: string;
  }) => (
    <Card className="card-hover">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className="text-xs text-success mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {trend}
              </p>
            )}
          </div>
          <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
            <Icon className={`w-5 h-5 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

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
            <BarChart3 className="w-6 h-6 text-accent" />
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Métricas e indicadores de desempenho
          </p>
        </div>

        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-40">
            <Calendar className="w-4 h-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 dias</SelectItem>
            <SelectItem value="30d">Últimos 30 dias</SelectItem>
            <SelectItem value="90d">Últimos 90 dias</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Tabs for Patrocinador */}
      {isPatrocinador ? (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="metricas" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Métricas
            </TabsTrigger>
            <TabsTrigger value="prestacao" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Prestação de Contas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="metricas" className="space-y-6">
            <DashboardContent 
              metricas={metricas} 
              wasteTypeData={wasteTypeData}
              scoreDistribution={scoreDistribution}
              dailyData={dailyData}
              containerVariants={containerVariants}
              itemVariants={itemVariants}
              MetricCard={MetricCard}
            />
          </TabsContent>

          <TabsContent value="prestacao" className="space-y-6">
            <PrestacaoContas />
          </TabsContent>
        </Tabs>
      ) : (
        <DashboardContent 
          metricas={metricas} 
          wasteTypeData={wasteTypeData}
          scoreDistribution={scoreDistribution}
          dailyData={dailyData}
          containerVariants={containerVariants}
          itemVariants={itemVariants}
          MetricCard={MetricCard}
        />
      )}
    </div>
  );
};

// Prestação de Contas Component
const PrestacaoContas: React.FC = () => {
  const custos = [
    { categoria: 'Tecnologia e Infraestrutura', valor: 45000, descricao: 'Servidores, APIs, manutenção' },
    { categoria: 'Equipe Técnica', valor: 85000, descricao: 'Desenvolvedores, analistas, suporte' },
    { categoria: 'Operações de Campo', valor: 35000, descricao: 'Equipamentos, transporte, logística' },
    { categoria: 'Parcerias com Cooperativas', valor: 25000, descricao: 'Capacitação e suporte operacional' },
    { categoria: 'Marketing e Comunicação', valor: 15000, descricao: 'Divulgação e conscientização' },
  ];

  const equipe = [
    { nome: 'Gabriel Malaquias', cargo: 'Desenvolvedor', area: 'Tecnologia' },
    { nome: 'Marco Sabino', cargo: 'Desenvolvedor', area: 'Tecnologia' },
    { nome: 'Jheniffer Meneses', cargo: 'Desenvolvedora', area: 'Tecnologia' },
    { nome: 'João Moreno', cargo: 'Desenvolvedor', area: 'Tecnologia' },
    { nome: 'Shaka Niken', cargo: 'Coordenador do Projeto', area: 'Gestão' },
    { nome: 'Mateus Araújo', cargo: 'Desenvolvedor', area: 'Tecnologia' },
    { nome: 'João Monteiro', cargo: 'Desenvolvedor', area: 'Tecnologia' },
    { nome: 'Jean Alvarez', cargo: 'Analista de Dados', area: 'Tecnologia' },
  ];

  const totalCustos = custos.reduce((acc, item) => acc + item.valor, 0);

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Investimento Total</p>
                <p className="text-2xl font-bold mt-1">
                  R$ {totalCustos.toLocaleString('pt-BR')}
                </p>
                <p className="text-xs text-success mt-1">Período: 2024</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Equipe Envolvida</p>
                <p className="text-2xl font-bold mt-1">{equipe.length} pessoas</p>
                <p className="text-xs text-muted-foreground mt-1">Dedicação integral</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-info" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cooperativas Parceiras</p>
                <p className="text-2xl font-bold mt-1">2 ativas</p>
                <p className="text-xs text-muted-foreground mt-1">CENTCOOP e ACAPAS</p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Custos Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Detalhamento de Custos
          </CardTitle>
          <CardDescription>Distribuição dos recursos por categoria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {custos.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.categoria}</p>
                  <p className="text-xs text-muted-foreground">{item.descricao}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">R$ {item.valor.toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-muted-foreground">
                    {((item.valor / totalCustos) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Equipe */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-info" />
            Equipe do Projeto
          </CardTitle>
          <CardDescription>Profissionais dedicados ao Cuida SCS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {equipe.map((pessoa, index) => (
              <div key={index} className="p-3 bg-muted/50 rounded-lg">
                <p className="font-medium text-sm">{pessoa.nome}</p>
                <p className="text-xs text-muted-foreground">{pessoa.cargo}</p>
                <Badge variant="outline" className="mt-2 text-xs">{pessoa.area}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Foto da Cooperativa */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Building2 className="w-5 h-5 text-success" />
            Cooperativas em Ação
          </CardTitle>
          <CardDescription>Registro do trabalho realizado pelas cooperativas parceiras</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src="/images/centcoop-cooperativa.jpg" 
              alt="Trabalhadores da cooperativa CENTCOOP realizando triagem de materiais recicláveis"
              className="w-full h-auto object-cover rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <p className="text-white text-sm font-medium">
                Triagem de materiais recicláveis
              </p>
              <p className="text-white/80 text-xs mt-1">
                Fonte: CENTCOOP - Cooperativa de Catadores do DF
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            A Central das Cooperativas de Materiais Recicláveis do DF (CENTCOOP) é uma das principais 
            parceiras do projeto Cuida SCS, responsável pela coleta e processamento de materiais 
            recicláveis identificados pela plataforma.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Dashboard Content Component
const DashboardContent: React.FC<{
  metricas: any;
  wasteTypeData: any[];
  scoreDistribution: any[];
  dailyData: any[];
  containerVariants: any;
  itemVariants: any;
  MetricCard: React.FC<any>;
}> = ({ metricas, wasteTypeData, scoreDistribution, dailyData, containerVariants, itemVariants, MetricCard }) => {
  return (
    <>
      {/* KPI Cards */}
      <motion.div
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Total de Ocorrências"
            value={metricas.totalOcorrencias}
            icon={Package}
            color="primary"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Ocorrências Abertas"
            value={metricas.ocorrenciasAbertas}
            icon={Clock}
            color="warning"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Hotspots Ativos"
            value={metricas.hotspotsAtivos}
            icon={Flame}
            color="destructive"
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <MetricCard
            title="Material Recuperado (kg)"
            value={metricas.pesoColetadoKg}
            icon={Recycle}
            trend={`${metricas.materiaisRecuperados} itens reciclados`}
            color="success"
          />
        </motion.div>
      </motion.div>

      {/* Charts Row */}
      <motion.div
        className="grid gap-6 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Daily Activity */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Atividade Diária</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      background: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="ocorrencias" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Novas" />
                  <Bar dataKey="resolvidas" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Resolvidas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Waste Type Distribution */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Tipos de Resíduos</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={wasteTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {wasteTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {wasteTypeData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1 text-xs">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ background: item.color }}
                    />
                    <span>{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Score Distribution & Additional Metrics */}
      <motion.div
        className="grid gap-6 lg:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Score Distribution */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Distribuição de Score dos Hotspots</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={scoreDistribution} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis dataKey="label" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={60} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    <Cell fill="#4ade80" />
                    <Cell fill="#facc15" />
                    <Cell fill="#fb923c" />
                    <Cell fill="#ef4444" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="text-base">Resumo do Período</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Route className="w-4 h-4 text-info" />
                  <span className="text-sm">Roteiros Hoje</span>
                </div>
                <Badge variant="secondary">{metricas.roteirosHoje}</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-status-alert" />
                  <span className="text-sm">Alertas Pendentes</span>
                </div>
                <Badge variant="secondary">{metricas.alertasCooperativas}</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Tempo Médio Resolução</span>
                </div>
                <Badge variant="secondary">{metricas.tempoMedioResolucaoHoras}h</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <Recycle className="w-4 h-4 text-success" />
                  <span className="text-sm">Taxa de Resolução</span>
                </div>
                <Badge className="bg-success text-success-foreground">
                  {metricas.totalOcorrencias > 0 
                    ? Math.round((metricas.ocorrenciasResolvidas / metricas.totalOcorrencias) * 100)
                    : 0
                  }%
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </>
  );
};

export default DashboardPage;
