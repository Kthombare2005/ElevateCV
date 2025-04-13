'use client';

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { Sparkles } from "lucide-react";

type MagicButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
};

const MagicButton = forwardRef<HTMLButtonElement, MagicButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, children, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-lg font-medium transition-all duration-300 overflow-hidden group";
    
    const variants = {
      primary: "bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:from-blue-600 hover:to-violet-600 shadow-lg shadow-blue-500/25",
      secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20",
      outline: "bg-transparent text-white border border-white/10 hover:border-white/20 hover:bg-white/5"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg"
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
        
        {/* Content */}
        <span className="relative flex items-center gap-2">
          {icon && <span className="relative">{icon}</span>}
          {children}
        </span>
      </motion.button>
    );
  }
);

MagicButton.displayName = "MagicButton";

export default MagicButton; 