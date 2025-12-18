import React from 'react';
import { motion } from 'framer-motion';
import { TIPO_RESIDUO_LABELS, TIPO_RESIDUO_COLORS, TIPO_RESIDUO_ICONS, TipoResiduo } from '@/types';
import { cn } from '@/lib/utils';

interface WasteTypeBadgeProps {
  tipo: TipoResiduo;
  showIcon?: boolean;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export const WasteTypeBadge: React.FC<WasteTypeBadgeProps> = ({
  tipo,
  showIcon = true,
  showLabel = true,
  size = 'sm',
}) => {
  const color = TIPO_RESIDUO_COLORS[tipo];
  const label = TIPO_RESIDUO_LABELS[tipo];
  const icon = TIPO_RESIDUO_ICONS[tipo];

  return (
    <motion.span
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs gap-1' : 'px-3 py-1 text-sm gap-1.5'
      )}
      style={{
        backgroundColor: `${color}20`,
        color: color,
      }}
      whileHover={{ scale: 1.05 }}
    >
      {showIcon && <span>{icon}</span>}
      {showLabel && <span>{label}</span>}
    </motion.span>
  );
};
