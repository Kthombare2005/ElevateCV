'use client';

import React from "react";
import { cn } from "@/lib/utils";

interface PulsatingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  pulseColor?: string;
  duration?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const PulsatingButton = React.forwardRef<
  HTMLButtonElement,
  PulsatingButtonProps
>(
  (
    {
      className,
      children,
      pulseColor = "#0096ff",
      duration = "1.5s",
      variant = 'primary',
      size = 'md',
      icon,
      ...props
    },
    ref,
  ) => {
    const variants = {
      primary: "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 hover:shadow-[0_0_25px_2px_rgba(147,51,234,0.3)]",
      secondary: "bg-white/5 text-white hover:bg-white/10 border border-white/10 hover:border-white/20",
      outline: "bg-transparent text-white border border-white/10 hover:border-white/20 hover:bg-white/5"
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-6 py-3 text-base"
    };

    return (
      <button
        ref={ref}
        className={cn(
          "relative flex cursor-pointer items-center justify-center rounded-full font-medium transition-all duration-300",
          "shadow-[0_0_15px_rgba(147,51,234,0.2)]",
          variants[variant],
          sizes[size],
          className,
        )}
        style={
          {
            "--pulse-color": pulseColor,
            "--duration": duration,
          } as React.CSSProperties
        }
        {...props}
      >
        <div className="relative z-10 flex items-center gap-2">
          {icon && (
            <span className="relative text-white/90">
              {icon}
            </span>
          )}
          <span className="font-medium">{children}</span>
        </div>
        <div 
          className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 opacity-20 blur-md transition-opacity"
          style={{
            animation: `pulse ${duration} cubic-bezier(0.4, 0, 0.6, 1) infinite`
          }}
        />
      </button>
    );
  },
);

PulsatingButton.displayName = "PulsatingButton"; 