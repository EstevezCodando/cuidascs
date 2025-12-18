import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, Recycle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const sizeClasses = {
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
};

const textSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
};

export const Logo: React.FC<LogoProps> = ({ size = 'md', showText = true }) => {
  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`relative ${sizeClasses[size]} bg-gradient-primary rounded-xl flex items-center justify-center`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 400 }}
      >
        <Recycle className="text-primary-foreground w-5 h-5" />
        <motion.div
          className="absolute -top-1 -right-1 bg-success rounded-full p-0.5"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <Leaf className="w-2.5 h-2.5 text-success-foreground" />
        </motion.div>
      </motion.div>
      {showText && (
        <span className={`font-bold ${textSizes[size]} leading-tight tracking-tight text-primary`}>
          Cuida SCS
        </span>
      )}
    </div>
  );
};
