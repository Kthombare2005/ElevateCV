"use client";

import { Meteors } from "@/components/ui/meteors";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-[#0A0118] antialiased selection:bg-blue-600/10 selection:text-blue-100">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden">
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#1E1270,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#120D42,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#1F0C38,transparent_50%)]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Glow effects */}
        <div className="absolute left-[20%] top-[20%] -z-10 h-96 w-96 animate-pulse [filter:blur(100px)]" 
             style={{ background: "linear-gradient(180deg, #60A5FA44 0%, #A855F744 100%)" }} />
        <div className="absolute right-[20%] bottom-[20%] -z-10 h-96 w-96 animate-pulse [filter:blur(100px)]" 
             style={{ background: "linear-gradient(180deg, #60A5FA44 0%, #A855F744 100%)" }} />
      </div>

      {/* Meteor effects */}
      <div className="absolute inset-0">
        <Meteors number={20} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          {/* Glass reflection effect */}
          <div
            className="absolute -top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/20"
            style={{
              filter: "blur(100px)",
              animation: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
            }}
          />
          {children}
        </div>
      </div>
    </div>
  );
} 