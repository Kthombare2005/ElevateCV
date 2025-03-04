'use client';

import { cn } from "@/lib/utils";
import { ComponentPropsWithoutRef, useEffect, useState, useRef } from "react";

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
   * Whether to animate vertically instead of horizontally
   * @default false
   */
  vertical?: boolean;
  /**
   * Speed of the animation in seconds
   * @default 40
   */
  speed?: number;
}

export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  speed = 40,
  ...props
}: MarqueeProps) {
  const [isClient, setIsClient] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      {...props}
      className={cn(
        "group relative flex w-full overflow-hidden",
        className
      )}
      style={{ 
        "--duration": `${speed}s`,
        opacity: shouldAnimate ? 1 : 0,
        transition: "opacity 0.5s ease-in"
      } as any}
    >
      <div
        className={cn(
          "flex shrink-0 items-center gap-4",
          shouldAnimate && {
            "animate-marquee": !vertical,
            "animate-marquee-vertical": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          }
        )}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={cn(
          "flex shrink-0 items-center gap-4",
          shouldAnimate && {
            "animate-marquee": !vertical,
            "animate-marquee-vertical": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}
