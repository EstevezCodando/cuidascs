import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { Logo } from './Logo';
import { ProfileSelector } from './ProfileSelector';
import { NavItem } from './NavItem';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Flame, 
  Route, 
  Building2, 
  BarChart3, 
  Info,
  Play,
  Sparkles 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const Header: React.FC = () => {
  const { usuario, executarModoDemo, alertas } = useApp();
  const { toast } = useToast();
  
  const alertasNovos = alertas.filter(a => a.status === 'novo').length;

  const handleDemo = () => {
    executarModoDemo();
    toast({
      title: "Modo Demo Ativado",
      description: "5 detecções e 3 ocorrências injetadas. Observe as mudanças no mapa!",
    });
  };

  return (
    <motion.header
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container flex h-14 items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Logo size="sm" />
          
          <nav className="hidden sm:flex items-center gap-1">
            <NavItem to="/" icon={Map} label="Mapa" />
            <NavItem to="/hotspots" icon={Flame} label="Hotspots" />
            <NavItem to="/roteiros" icon={Route} label="Roteiros" />
            <NavItem 
              to="/cooperativas" 
              icon={Building2} 
              label="Cooperativas"
              badge={usuario.perfil === 'cooperativa' ? alertasNovos : undefined}
            />
            <NavItem to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavItem to="/sobre" icon={Info} label="Sobre" />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {usuario.perfil === 'operador' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Button
                variant="outline"
                size="sm"
                onClick={handleDemo}
                className="gap-2 border-primary/30 hover:border-primary hover:bg-primary/5"
              >
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="hidden sm:inline">Modo Demo</span>
                <Play className="w-3 h-3" />
              </Button>
            </motion.div>
          )}
          <ProfileSelector />
        </div>
      </div>
    </motion.header>
  );
};
