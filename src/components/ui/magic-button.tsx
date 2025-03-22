'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MagicButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  icon?: ReactNode;
}

export function MagicButton({ children, isLoading, icon, className = '', ...props }: MagicButtonProps) {
  return (
    <motion.button
      {...props}
      className={`
        relative group overflow-hidden px-4 py-3 
        bg-gradient-to-r from-blue-500 to-violet-500 
        hover:from-blue-600 hover:to-violet-600
        disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
        rounded-lg transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 
        focus:ring-offset-slate-950 ${className}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 animate-shine pointer-events-none" />

      {/* Meteor effect */}
      <div className="absolute inset-0 overflow-hidden rounded-lg pointer-events-none">
        <div className="meteor-container">
          {[...Array(5)].map((_, index) => (
            <span
              key={index}
              className={`
                absolute top-1/2 left-1/2 h-0.5 w-0.5 rounded-full bg-white
                shadow-[0_0_0_1px_#ffffff10] rotate-[215deg]
                animate-meteor-effect
              `}
              style={{
                top: '50%',
                left: '50%',
                animationDelay: `${index * 0.3}s`,
                animationDuration: '5s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Button content */}
      <div className="relative flex items-center justify-center gap-2 text-white font-medium">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </>
        ) : (
          <>
            {children}
            {icon && <span className="transition-transform group-hover:translate-x-1">{icon}</span>}
          </>
        )}
      </div>
    </motion.button>
  );
} 