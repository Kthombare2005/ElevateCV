'use client';

import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ComponentPropsWithoutRef } from "react";

interface MarqueeProps extends ComponentPropsWithoutRef<"div"> {
  /**
   * Optional CSS class name to apply custom styles
   */
  className?: string;
  /**
   * Whether to reverse the animation direction
   * @default false
   */
  reverse?: boolean;
  /**
   * Whether to pause the animation on hover
   * @default false
   */
  pauseOnHover?: boolean;
  /**
   * Content to be displayed in the marquee
   */
  children: React.ReactNode;
  /**
   * Speed of the animation in seconds
   * @default 20
   */
  speed?: number;
}

export const Marquee = ({
  children,
  className = '',
  reverse = false,
  pauseOnHover = false,
  speed = 20,
}: MarqueeProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !scrollerRef.current) return;

    const scrollerContent = Array.from(scrollerRef.current.children);
    scrollerContent.forEach((item) => {
      const duplicatedItem = item.cloneNode(true);
      if (scrollerRef.current) {
        scrollerRef.current.appendChild(duplicatedItem);
      }
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`scroller relative max-w-7xl overflow-hidden ${className}`}
    >
      <motion.div
        ref={scrollerRef}
        className="flex min-w-full shrink-0 gap-4 py-4"
        initial={{ x: 0 }}
        animate={{ x: reverse ? '50%' : '-50%' }}
        transition={{
          duration: 100 / speed,
          repeat: Infinity,
          ease: 'linear',
          ...(pauseOnHover && { pauseValues: { x: ['0%'] } as Record<string, string[]> })
        }}
      >
        {children}
      </motion.div>
    </div>
  );
};
