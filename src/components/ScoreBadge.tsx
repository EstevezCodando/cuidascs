import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CategoriaScore } from '@/types';
import { getCategoriaLabel, getCategoriaColorClass } from '@/lib/score';

interface ScoreBadgeProps {
  score: number;
  categoria: CategoriaScore;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
};

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({
  score,
  categoria,
  size = 'md',
  showLabel = false,
  animated = false,
}) => {
  const colorClass = getCategoriaColorClass(categoria);
  
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div
        className={cn(
          'score-indicator font-bold rounded-full',
          colorClass,
          sizeClasses[size]
        )}
        initial={animated ? { scale: 0 } : undefined}
        animate={animated ? { scale: 1 } : undefined}
        transition={{ type: 'spring', stiffness: 500 }}
        whileHover={{ scale: 1.1 }}
      >
        {score}
      </motion.div>
      {showLabel && (
        <span className={cn('text-xs font-medium', colorClass)}>
          {getCategoriaLabel(categoria)}
        </span>
      )}
    </div>
  );
};
