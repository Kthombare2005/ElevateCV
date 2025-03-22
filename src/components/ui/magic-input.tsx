'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';

interface MagicInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const MagicInput = forwardRef<HTMLInputElement, MagicInputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="relative group">
        <label
          htmlFor={props.id}
          className="block text-sm font-medium text-white/90 mb-2 transition-transform group-focus-within:text-violet-400"
        >
          {label}
        </label>
        
        <div className="relative">
          {/* Animated border */}
          <motion.div
            className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-violet-600 via-blue-600 to-violet-600 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 blur-sm transition duration-1000"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          />

          {/* Input field */}
          <input
            ref={ref}
            {...props}
            className={`
              relative w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg 
              focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent 
              text-white placeholder-white/50 transition-all duration-300
              ${className}
            `}
          />

          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 animate-shine pointer-events-none" />
        </div>

        {/* Error message */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-red-400"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
); 