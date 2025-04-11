'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Upload, Cpu, Settings, Download } from 'lucide-react';

const steps = [
  {
    number: '1',
    icon: Upload,
    title: 'Upload Your Resume',
    description: 'Simply upload your existing resume in any format (PDF, DOCX, or TXT).',
    gradient: 'from-blue-500 to-violet-500',
    iconColor: 'text-blue-500',
    bgColor: 'bg-blue-500/5',
    borderColor: 'group-hover:border-blue-500/20'
  },
  {
    number: '2',
    icon: Cpu,
    title: 'AI Analyzes & Suggests Improvements',
    description: 'Our AI engine analyzes your resume and provides detailed improvement suggestions.',
    gradient: 'from-violet-500 to-purple-500',
    iconColor: 'text-violet-500',
    bgColor: 'bg-violet-500/5',
    borderColor: 'group-hover:border-violet-500/20'
  },
  {
    number: '3',
    icon: Settings,
    title: 'Customize & Optimize',
    description: 'Fine-tune your resume with AI-powered suggestions and ATS optimization.',
    gradient: 'from-purple-500 to-fuchsia-500',
    iconColor: 'text-purple-500',
    bgColor: 'bg-purple-500/5',
    borderColor: 'group-hover:border-purple-500/20'
  },
  {
    number: '4',
    icon: Download,
    title: 'Download & Apply',
    description: 'Download your optimized resume and start applying with confidence.',
    gradient: 'from-fuchsia-500 to-pink-500',
    iconColor: 'text-fuchsia-500',
    bgColor: 'bg-fuchsia-500/5',
    borderColor: 'group-hover:border-fuchsia-500/20'
  }
];

const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    margin: "50% 0px -10% 0px",
    amount: 0.2
  });

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#4f46e5,transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,#7c3aed,transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" 
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />
      </div>

      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight text-white mb-4"
          >
            How It{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-violet-500 to-purple-500">
              Works
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-lg text-white/60"
          >
            Four simple steps to transform your resume and boost your job search success
          </motion.p>
        </motion.div>

        {/* Steps Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-3xl mx-auto space-y-8"
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50, y: 20 }}
              animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: -50, y: 20 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1 + 0.5,
                type: "spring",
                stiffness: 100,
                damping: 15
              }}
              className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-500 hover:scale-[1.02] p-6"
            >
              {/* Content Container */}
              <div className="flex items-start gap-6">
                {/* Step Number with Background */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-900/50 ring-1 ring-white/10 transition-all duration-500 group-hover:ring-white/20">
                  <div className={`text-2xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}>
                    {step.number}
                  </div>
                </div>

                {/* Text Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon className={`h-5 w-5 ${step.iconColor} transition-colors duration-500`} />
                    <h3 className="text-xl font-semibold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-base text-white/60 group-hover:text-white/80 transition-colors duration-500">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={isInView ? { height: "100%" } : { height: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.5 }}
                  className="absolute left-[2.2rem] top-24 bottom-[-2rem] w-[2px]"
                >
                  <div className="h-full w-full bg-gradient-to-b from-white/20 to-transparent" />
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection; 