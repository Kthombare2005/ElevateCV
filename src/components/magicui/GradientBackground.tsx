'use client';

import { useEffect, useState } from 'react';

export const GradientBackground = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Primary gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_center,#3b82f6,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf6,transparent_50%)]" />
      
      {/* Animated gradient orbs - Only render on client side */}
      {isClient && (
        <>
          <div className="absolute top-0 left-1/4 h-96 w-96 bg-gradient-to-r from-violet-500/30 to-purple-500/30 blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 h-96 w-96 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-3xl animate-pulse delay-700" />
        </>
      )}
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      
      {/* Radial glow effects - Only render on client side */}
      {isClient && (
        <>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-fuchsia-400/20 blur-[100px]" />
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[320px] w-[320px] rounded-full bg-indigo-400/20 blur-[100px] delay-200" />
        </>
      )}
    </div>
  );
}; 