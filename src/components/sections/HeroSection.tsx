'use client';

import { ArrowUpRight, Sparkles, Star, CheckCircle2, Play, BarChart2, Target, Zap } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PulsatingButton } from '@/components/ui/pulsating-button';

const HeroSection = () => {
  // Client-side only state to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="relative min-h-[85vh] overflow-hidden pt-32 bg-slate-950">
      {/* Animated Background with Multiple Effects */}
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

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Enhanced Trust Signals */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-500 hover:bg-white/20 hover:scale-105">
            <div className="relative">
              {isClient && (
                <div className="absolute inset-0 animate-ping rounded-full bg-yellow-400/20" />
              )}
              <Star className="h-4 w-4 text-yellow-500 relative" fill="currentColor" />
            </div>
            <span className="text-sm font-medium text-white/90">
              Trusted by 10,000+ professionals • 85% Success Rate
            </span>
          </div>

          {/* Enhanced Main Heading with Animation */}
          <div className="relative group">
            {isClient && (
              <>
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-blue-600/20 to-violet-600/20 opacity-20 blur-lg group-hover:opacity-30 animate-pulse" />
                <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-violet-600/10 via-blue-600/10 to-violet-600/10 opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-500" />
              </>
            )}
            <h1 className="relative text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-100 via-violet-200 to-white sm:text-7xl [text-wrap:balance]">
              Elevate Your Resume{' '}
              <span className="relative inline-block">
                with AI-Powered
                {isClient && (
                  <div className="absolute -top-1 -right-8 animate-bounce">
                    <ArrowUpRight className="h-8 w-8 text-violet-400" />
                  </div>
                )}
                <div className="absolute inset-0 border-b-2 border-violet-400/30" />
              </span>
              {' '}Insights
            </h1>
          </div>

          {/* Enhanced Subheading */}
          <p className="mt-8 text-xl leading-8 text-white/80 font-medium relative">
            <span className="relative">
              Transform your resume from ordinary to exceptional. Our AI-powered platform analyzes, optimizes, and elevates your resume to help you land your dream job.
              <span className="absolute inset-0 border-b border-violet-400/20" />
            </span>
          </p>

          {/* Visual Stats Section */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { icon: BarChart2, stat: '85%', label: 'ATS Score Improvement' },
              { icon: Target, stat: '3x', label: 'More Interview Chances' },
              { icon: Zap, stat: '24h', label: 'Faster Response Time' }
            ].map((item, index) => (
              <div 
                key={index}
                className="group relative p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                {isClient && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-blue-600/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <item.icon className="h-6 w-6 mx-auto mb-2 text-violet-400" />
                <div className="text-2xl font-bold text-white mb-1">{item.stat}</div>
                <div className="text-sm text-white/70">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Feature Highlights */}
          <div className="mt-12 flex justify-center gap-6 text-white/90">
            {[
              'ATS-Optimized',
              'Smart Analysis',
              'Instant Feedback'
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-default border border-white/5 hover:border-white/10"
              >
                <CheckCircle2 className="h-5 w-5 text-violet-400 group-hover:text-violet-300 transition-colors" />
                <span className="font-medium relative">
                  {feature}
                  {isClient && (
                    <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* Enhanced CTA Section */}
          <div className="mt-10 flex items-center justify-center gap-6">
            <Link href="/analyze">
              <PulsatingButton
                variant="primary"
                size="lg"
                icon={<Sparkles className="h-5 w-5" />}
                pulseColor="#4461F2"
                className="w-[200px]"
              >
                Analyze Your Resume
              </PulsatingButton>
            </Link>
            
            <Link href="#how-it-works">
              <button className="group relative overflow-hidden rounded-full bg-white/5 px-6 py-3 text-white hover:bg-white/10 transition-all duration-300 flex items-center gap-2 font-medium border border-white/10 hover:border-white/20">
                <Play className="h-5 w-5" />
                See how it works
                {isClient && (
                  <div className="absolute inset-0 bg-gradient-to-r from-violet-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-full" />
                )}
              </button>
            </Link>
          </div>

          {/* Enhanced Trust Signals */}
          <div className="mt-16">
            <p className="text-sm text-white/60 mb-4">Trusted by leading companies</p>
            <div className="flex justify-center items-center gap-8">
              <div className="flex -space-x-3">
                {[
                  { gradient: 'from-blue-400 to-violet-400', initial: 'JD' },
                  { gradient: 'from-violet-400 to-fuchsia-400', initial: 'AS' },
                  { gradient: 'from-fuchsia-400 to-pink-400', initial: 'MK' },
                  { gradient: 'from-pink-400 to-rose-400', initial: 'RW' }
                ].map((avatar, i) => (
                  <div
                    key={i}
                    className={`relative h-10 w-10 rounded-full bg-gradient-to-br ${avatar.gradient} border-2 border-slate-950 ring-2 ring-violet-500/10 transition-all duration-300 hover:scale-110 hover:z-10 flex items-center justify-center overflow-hidden group`}
                  >
                    {/* Animated gradient overlay */}
                    {isClient && (
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,white/5,transparent_50%)]" />
                    
                    {/* Initial text */}
                    <span className="relative text-xs font-semibold text-white/90">
                      {avatar.initial}
                    </span>
                    
                    {/* Bottom highlight */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>
                ))}
              </div>
              <div className="text-sm text-white/80 font-medium">
                <span className="font-bold text-white relative inline-block">
                  500+
                  <div className="absolute -inset-1 rounded-lg bg-white/5 -z-10" />
                </span>
                {' '}resumes analyzed today
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection; 