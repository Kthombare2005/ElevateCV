'use client';

import { useRef } from 'react';
import { motion, useInView, useAnimationFrame, useMotionValue, useTransform } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useState, useEffect } from 'react';

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "TechCorp",
    image: "/testimonials/sarah.jpg",
    quote: "ElevateCV transformed my resume completely. I received 3x more interview calls after using their AI-powered optimization.",
    rating: 5,
    highlight: "3x more interviews"
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "InnovateTech",
    image: "/testimonials/michael.jpg",
    quote: "The AI suggestions were spot-on. My resume now perfectly aligns with ATS requirements, and I landed my dream job!",
    rating: 5,
    highlight: "Landed dream job"
  },
  {
    name: "Emily Rodriguez",
    role: "Marketing Director",
    company: "CreativeMinds",
    image: "/testimonials/emily.jpg",
    quote: "The instant feedback and optimization suggestions helped me highlight my achievements more effectively. Highly recommended!",
    rating: 5,
    highlight: "Better achievement highlights"
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "DataFlow",
    image: "/testimonials/david.jpg",
    quote: "The AI analysis caught details I would have missed. My resume now stands out with clear, impactful metrics.",
    rating: 5,
    highlight: "Impactful metrics"
  }
];

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0]; index: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.6 + (index * 0.1),
        ease: "easeOut"
      }}
      className="group relative w-[450px] shrink-0"
    >
      <div className="relative rounded-xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-sm">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="h-6 w-6 text-violet-500/50" />
        </div>

        {/* Testimonial Text */}
        <blockquote className="mb-4">
          <p className="text-base text-slate-300 leading-relaxed">
            &ldquo;{testimonial.quote}&rdquo;
          </p>
        </blockquote>

        {/* Highlight Tag */}
        <div className="mb-4">
          <span className="inline-flex items-center rounded-full bg-violet-500/10 px-2.5 py-0.5 text-xs text-violet-400 ring-1 ring-violet-500/20">
            {testimonial.highlight}
          </span>
        </div>

        {/* Author Info */}
        <div className="flex items-center gap-3">
          <div className="relative h-10 w-10 overflow-hidden rounded-full bg-slate-800 ring-2 ring-slate-700/50">
            <span className="absolute inset-0 flex items-center justify-center text-base font-medium text-slate-300">
              {testimonial.name[0]}
            </span>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">
              {testimonial.name}
            </div>
            <div className="text-xs text-slate-400">
              {testimonial.role} • {testimonial.company}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="absolute top-6 right-6 flex">
          {[...Array(testimonial.rating)].map((_, i) => (
            <Star
              key={i}
              className="h-3.5 w-3.5 text-amber-400"
              fill="currentColor"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const InfiniteCarousel = ({ items }: { items: typeof testimonials }) => {
  const baseVelocity = -2;
  const baseX = useMotionValue(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 400); // Start after header animation

    return () => clearTimeout(timer);
  }, []);

  useAnimationFrame((time, delta) => {
    if (hovering || !isVisible) return;
    
    const moveBy = baseVelocity * (delta / 16);
    
    if (scrollRef.current) {
      const containerWidth = scrollRef.current.scrollWidth / 2;
      baseX.set((baseX.get() + moveBy) % containerWidth);
    }
  });

  const x = useTransform(baseX, (value) => {
    return `${value}px`;
  });

  return (
    <div 
      className="relative overflow-hidden"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <motion.div
        ref={scrollRef}
        style={{ x }}
        className="flex gap-6"
      >
        {[...items, ...items].map((testimonial, idx) => (
          <TestimonialCard
            key={`${idx}-${testimonial.name}`}
            testimonial={testimonial}
            index={idx % items.length}
          />
        ))}
      </motion.div>
    </div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    margin: "0px",
    amount: 0.2
  });

  return (
    <section ref={sectionRef} className="relative py-20 overflow-hidden bg-slate-950">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        {/* Extended gradients for smoother transitions */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#3b82f6,transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#8b5cf6,transparent_70%)] opacity-70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#1e1b4b,transparent_100%)] opacity-30" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#80808015_1px,transparent_1px),linear-gradient(to_bottom,#80808015_1px,transparent_1px)] bg-[size:24px_24px]"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)'
          }}
        />
      </div>

      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto text-center mb-16 px-4"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="text-4xl font-bold tracking-tight text-white mb-6"
        >
          Trusted by{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-violet-500">
            Professionals
          </span>
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-lg text-white/70"
        >
          See what our users say about their experience with ElevateCV
        </motion.p>
      </motion.div>

      {/* Infinite Carousel */}
      <div className="relative w-[100vw] left-[calc(-50vw+50%)] right-[calc(-50vw+50%)]">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <InfiniteCarousel items={testimonials} />
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 