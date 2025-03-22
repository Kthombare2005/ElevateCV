'use client';

import { ReactNode } from 'react';
import { BorderBeam } from './border-beam';

interface MagicContainerProps {
  children: ReactNode;
  className?: string;
}

export function MagicContainer({ children, className = '' }: MagicContainerProps) {
  return (
    <div className="relative group">
      {/* Animated gradient background */}
      <div className="absolute -inset-[2px] rounded-xl bg-gradient-to-r from-violet-500 via-blue-500 to-violet-500 opacity-70 blur group-hover:opacity-100 transition duration-1000" />

      {/* Container */}
      <div className="relative">
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 animate-shimmer" />
        
        {/* Main content */}
        <div className={`relative bg-[#0E0B25]/90 backdrop-blur-xl rounded-lg p-8 ${className}`}>
          {/* Inner glow */}
          <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>

          {/* Border beam effect */}
          <BorderBeam 
            size={400}
            colorFrom="#3b82f6"
            colorTo="#8b5cf6"
            duration={12}
            delay={0}
            className="opacity-60"
            transition={{
              ease: "easeInOut",
              repeat: Infinity
            }}
          />
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute -top-px -left-px w-6 h-6 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
      <div className="absolute -top-px -right-px w-6 h-6 border-t-2 border-r-2 border-violet-500/50 rounded-tr-lg" />
      <div className="absolute -bottom-px -left-px w-6 h-6 border-b-2 border-l-2 border-violet-500/50 rounded-bl-lg" />
      <div className="absolute -bottom-px -right-px w-6 h-6 border-b-2 border-r-2 border-blue-500/50 rounded-br-lg" />
    </div>
  );
} 