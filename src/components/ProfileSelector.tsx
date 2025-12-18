import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/contexts/AppContext';
import { PerfilUsuario } from '@/types';
import { User, Briefcase, Building2, TrendingUp, ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const PERFIL_CONFIG: Record<PerfilUsuario, { label: string; icon: React.ElementType; color: string }> = {
  cidadao: { label: 'Cidadão', icon: User, color: 'text-info' },
  operador: { label: 'Operador', icon: Briefcase, color: 'text-warning' },
  cooperativa: { label: 'Cooperativa', icon: Building2, color: 'text-success' },
  patrocinador: { label: 'Patrocinador', icon: TrendingUp, color: 'text-accent' },
};

export const ProfileSelector: React.FC = () => {
  const { usuario, setPerfilAtivo } = useApp();
  const currentConfig = PERFIL_CONFIG[usuario.perfil];
  const Icon = currentConfig.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          className="profile-pill"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={`w-4 h-4 ${currentConfig.color}`} />
          <span className="hidden sm:inline">{currentConfig.label}</span>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5 text-xs text-muted-foreground font-medium">
          Alternar Perfil (Demo)
        </div>
        {(Object.keys(PERFIL_CONFIG) as PerfilUsuario[]).map((perfil) => {
          const config = PERFIL_CONFIG[perfil];
          const PerfilIcon = config.icon;
          const isActive = usuario.perfil === perfil;
          
          return (
            <DropdownMenuItem
              key={perfil}
              onClick={() => setPerfilAtivo(perfil)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <PerfilIcon className={`w-4 h-4 ${config.color}`} />
              <span className="flex-1">{config.label}</span>
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="w-4 h-4 text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
