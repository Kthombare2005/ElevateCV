'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface MagicButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const MagicButton = ({ 
  children, 
  onClick, 
  type = 'button',
  className = '',
  fullWidth = false,
  disabled = false
}: MagicButtonProps) => {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`
        relative group
        inline-flex items-center justify-center
        px-6 py-3 rounded-lg
        bg-gradient-to-r from-blue-600 to-blue-700
        text-white font-medium
        overflow-hidden
        transition-all duration-300
        hover:from-blue-700 hover:to-blue-800
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 to-purple-400/30 blur-lg" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-2">
        {children}
      </div>

      {/* Shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000">
        <div className="absolute h-full w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-[shine_2s_infinite]" />
      </div>
    </motion.button>
  );
}; 