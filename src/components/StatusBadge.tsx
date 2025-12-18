import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { StatusOcorrencia, StatusAlerta, StatusRoteiro, STATUS_LABELS } from '@/types';

type StatusType = StatusOcorrencia | StatusAlerta | StatusRoteiro;

const STATUS_CONFIG: Record<string, { bgClass: string; textClass: string; label: string }> = {
  // Ocorrencia
  aberto: { bgClass: 'bg-warning/15', textClass: 'text-warning', label: 'Aberto' },
  prioritario: { bgClass: 'bg-status-priority/15', textClass: 'text-status-priority', label: 'Prioritário' },
  em_atendimento: { bgClass: 'bg-info/15', textClass: 'text-info', label: 'Em Atendimento' },
  resolvido: { bgClass: 'bg-success/15', textClass: 'text-success', label: 'Resolvido' },
  // Alerta
  novo: { bgClass: 'bg-status-alert/15', textClass: 'text-status-alert', label: 'Novo' },
  aceito: { bgClass: 'bg-success/15', textClass: 'text-success', label: 'Aceito' },
  recusado: { bgClass: 'bg-destructive/15', textClass: 'text-destructive', label: 'Recusado' },
  concluido: { bgClass: 'bg-muted', textClass: 'text-muted-foreground', label: 'Concluído' },
  // Roteiro
  planejado: { bgClass: 'bg-secondary', textClass: 'text-secondary-foreground', label: 'Planejado' },
  em_execucao: { bgClass: 'bg-info/15', textClass: 'text-info', label: 'Em Execução' },
  cancelado: { bgClass: 'bg-destructive/15', textClass: 'text-destructive', label: 'Cancelado' },
};

interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md';
  animated?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  animated = true,
}) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.aberto;
  
  return (
    <motion.span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        config.bgClass,
        config.textClass,
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
      )}
      initial={animated ? { scale: 0.8, opacity: 0 } : undefined}
      animate={animated ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: 'spring', stiffness: 500 }}
    >
      <span className={cn(
        'rounded-full mr-1.5',
        size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
        config.textClass.replace('text-', 'bg-')
      )} />
      {config.label}
    </motion.span>
  );
};
