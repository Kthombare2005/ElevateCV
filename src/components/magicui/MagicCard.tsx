'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MagicCardProps {
  children: ReactNode;
  className?: string;
  disableHover?: boolean;
}

export const MagicCard = ({ children, className = '', disableHover = false }: MagicCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`
        relative group overflow-hidden 
        bg-gradient-to-b from-white/[0.07] to-transparent 
        rounded-2xl border border-white/[0.05] p-8 
        ${!disableHover ? 'hover:border-white/[0.1] transition-colors duration-500' : ''}
        ${className}
      `}
    >
      {/* Glow effect - only show if hover is enabled */}
      {!disableHover && (
        <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Spotlight effect - only show if hover is enabled */}
      {!disableHover && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/25 via-transparent to-transparent" />
        </div>
      )}
    </motion.div>
  );
}; 