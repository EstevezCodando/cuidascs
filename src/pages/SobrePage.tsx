import React from 'react';
import { motion } from 'framer-motion';
import { 
  Info, 
  Shield, 
  Eye, 
  Recycle, 
  Users, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Leaf,
  Building2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';

const SobrePage: React.FC = () => {
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

  const cycleSteps = [
    { icon: Eye, title: 'Detecção', desc: 'Câmeras e cidadãos identificam resíduos' },
    { icon: BarChart3, title: 'Priorização', desc: 'Score inteligente rankeia hotspots' },
    { icon: Recycle, title: 'Limpeza', desc: 'Equipes executam roteiros otimizados' },
    { icon: Building2, title: 'Cooperativas', desc: 'Material reciclável é encaminhado' },
  ];

  return (
    <div className="container py-6 space-y-8">
      {/* Hero */}
      <motion.div
        className="text-center space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-4">
          <Logo size="lg" />
        </div>
        <h1 className="text-3xl font-bold">
          Sobre & Governança
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Uma plataforma transparente para coordenação de limpeza urbana, 
          conectando cidadãos, operadores e cooperativas em um ciclo sustentável.
        </p>
      </motion.div>

      {/* Cycle Flow */}
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <h2 className="text-xl font-semibold text-center">O Ciclo Completo</h2>
        <div className="flex flex-wrap justify-center items-center gap-4">
          {cycleSteps.map((step, index) => (
            <React.Fragment key={step.title}>
              <motion.div
                variants={itemVariants}
                className="flex flex-col items-center gap-2 p-4"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground text-center max-w-[150px]">
                  {step.desc}
                </p>
              </motion.div>
              {index < cycleSteps.length - 1 && (
                <ArrowRight className="w-6 h-6 text-muted-foreground hidden md:block" />
              )}
            </React.Fragment>
          ))}
        </div>
      </motion.div>

      {/* Score Explanation */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Como Calculamos o Score
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              O score de cada hotspot é calculado de forma transparente, 
              combinando múltiplos fatores com pesos definidos:
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Recorrência</span>
                  <Badge variant="secondary">30%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Número de ocorrências abertas no local
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Detecções de Câmera</span>
                  <Badge variant="secondary">25%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Soma das confianças das detecções automáticas
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Tempo sem Limpeza</span>
                  <Badge variant="secondary">20%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Dias desde a última limpeza no local
                </p>
              </div>
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium">Volume Estimado</span>
                  <Badge variant="secondary">25%</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Estimativa de volume total de resíduos
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              O score final varia de 0 a 100 e é categorizado em: 
              <Badge variant="outline" className="ml-2 mr-1">Baixo</Badge>
              <Badge variant="outline" className="mr-1">Médio</Badge>
              <Badge variant="outline" className="mr-1">Alto</Badge>
              <Badge variant="outline">Crítico</Badge>
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy & Data */}
      <motion.div
        className="grid gap-6 md:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-success" />
                Privacidade e Dados
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Sem armazenamento de vídeo:</strong> Não processamos nem 
                  armazenamos feeds de câmeras, apenas metadados de detecção.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Dados simulados:</strong> No MVP, detecções de câmera são 
                  simuladas para demonstração do fluxo.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Minimização de dados:</strong> Coletamos apenas informações 
                  essenciais para o funcionamento do sistema.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-success mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  <strong>Sem dados sensíveis:</strong> Não coletamos dados pessoais 
                  sensíveis ou identificadores únicos.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-info" />
                Rastreabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                Todas as métricas do dashboard são derivadas de dados rastreáveis:
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Ocorrências têm timestamp e origem (cidadão/sistema)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Hotspots são recalculados com componentes visíveis</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Roteiros registram criador, horários e status</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Alertas para cooperativas têm janela e aceite</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span>Pesos estimados são intervalos, não valores exatos</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        className="text-center py-8 border-t"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 text-muted-foreground">
          <Leaf className="w-4 h-4 text-success" />
          <span className="text-sm">
            SCS Limpo & Circular • MVP para Hackathon • 2024
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Construindo cidades mais limpas e sustentáveis através da tecnologia.
        </p>
      </motion.div>
    </div>
  );
};

export default SobrePage;
