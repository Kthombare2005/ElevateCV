'use client';

import { Brain, CheckCircle2, BarChart2, RefreshCw, Zap, Target } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { BoxReveal } from '../animations/BoxReveal';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced machine learning algorithms analyze your resume in seconds, providing detailed insights and suggestions.',
    gradient: 'from-violet-500 to-purple-500',
    highlight: 'bg-violet-500/10',
    shadowColor: 'group-hover:shadow-violet-500/20',
    iconColor: 'text-violet-500',
    hoverBg: 'hover:bg-gradient-to-b hover:from-violet-50/10 hover:to-purple-50/5'
  },
  {
    icon: Target,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with our smart keyword optimization and formatting.',
    gradient: 'from-blue-500 to-cyan-500',
    highlight: 'bg-blue-500/10',
    shadowColor: 'group-hover:shadow-blue-500/20',
    iconColor: 'text-blue-500',
    hoverBg: 'hover:bg-gradient-to-b hover:from-blue-50/10 hover:to-cyan-50/5'
  },
  {
    icon: Zap,
    title: 'Instant Feedback',
    description: 'Get real-time suggestions for improvements, from content optimization to formatting enhancements.',
    gradient: 'from-amber-500 to-orange-500',
    highlight: 'bg-amber-500/10',
    shadowColor: 'group-hover:shadow-amber-500/20',
    iconColor: 'text-amber-500',
    hoverBg: 'hover:bg-gradient-to-b hover:from-amber-50/10 hover:to-orange-50/5'
  },
  {
    icon: RefreshCw,
    title: 'Resume Tailoring',
    description: 'Automatically adapt your resume for specific job positions using AI-driven content recommendations.',
    gradient: 'from-emerald-500 to-teal-500',
    highlight: 'bg-emerald-500/10',
    shadowColor: 'group-hover:shadow-emerald-500/20',
    iconColor: 'text-emerald-500',
    hoverBg: 'hover:bg-gradient-to-b hover:from-emerald-50/10 hover:to-teal-50/5'
  }
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0], index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !mounted) return;

    const div = cardRef.current;
    const rect = div.getBoundingClientRect();

    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    if (mounted) {
      setOpacity(1);
    }
  };

  const handleMouseLeave = () => {
    if (mounted) {
      setOpacity(0);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-500 ${feature.hoverBg} hover:border-white/20 ${feature.shadowColor} hover:scale-[1.02]`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-500"
        style={{
          opacity: mounted ? opacity : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,.1), transparent 40%)`,
        }}
      />

      {/* Icon */}
      <div 
        className={`relative inline-flex p-3 rounded-xl ${feature.highlight} mb-4 transition duration-500 group-hover:scale-110 group-hover:shadow-lg ${feature.shadowColor}`}
      >
        <feature.icon className={`h-6 w-6 ${feature.iconColor} transition-colors duration-500`} />
        <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 blur transition duration-500`} />
      </div>

      {/* Text Content with BoxReveal */}
      <BoxReveal width="100%" boxColor={feature.iconColor} duration={0.5}>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold text-white mb-3 leading-relaxed group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all duration-500">
            {feature.title}
          </h3>
          <p className="text-white/70 group-hover:text-white/90 transition-colors duration-500 leading-relaxed pb-1">
            {feature.description}
          </p>
        </div>
      </BoxReveal>

      {/* Hover Indicator */}
      <div className="absolute right-6 top-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <CheckCircle2 className={`h-5 w-5 bg-clip-text text-transparent bg-gradient-to-br ${feature.gradient}`} />
      </div>
    </motion.div>
  );
};

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: true,
    margin: "-100px"
  });

  return (
    <section ref={ref} className="relative py-24 overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Extended gradients for smoother transitions */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#3b82f6,transparent_70%)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf6,transparent_70%)] opacity-60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_100%)] opacity-30" />
        
        {/* Grid pattern with increased opacity for better visibility */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />
      </div>

      <div className="container mx-auto px-4">
        {/* Section Header - No BoxReveal */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4">
            Why Choose{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
              ElevateCV
            </span>
          </h2>
          <p className="text-lg text-white/70">
            Our AI-powered platform provides comprehensive resume analysis and optimization to help you stand out in the job market.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection; 