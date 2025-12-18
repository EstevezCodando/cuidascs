import React from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
}

export const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, badge }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterNavLink to={to} className="relative">
      {({ isActive }) => (
        <motion.div
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden md:inline">{label}</span>
          {badge !== undefined && badge > 0 && (
            <motion.span
              className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full px-1.5 py-0.5 min-w-[1.25rem] text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              {badge}
            </motion.span>
          )}
          {isActive && (
            <motion.div
              className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full"
              layoutId="nav-indicator"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </motion.div>
      )}
    </RouterNavLink>
  );
};
