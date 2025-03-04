'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Marquee } from '../ui/Marquee';

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

const TestimonialCard = ({ testimonial, index }: { testimonial: typeof testimonials[0], index: number }) => {
  return (
    <div className="group relative w-[450px] mx-4">
      <div className="relative rounded-xl bg-slate-900/80 border border-slate-800 p-6 backdrop-blur-sm">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="h-6 w-6 text-violet-500/50" />
        </div>

        {/* Testimonial Text */}
        <blockquote className="mb-4">
          <p className="text-base text-slate-300 leading-relaxed">
            "{testimonial.quote}"
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
    </div>
  );
};

const TestimonialsSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { 
    margin: "-100px",
    amount: 0.3 // Trigger when 30% of the section is visible
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        staggerChildren: 0.2,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 10,
        duration: 0.6
      }
    }
  };

  const marqueeVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { 
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8
      }
    }
  };

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden bg-slate-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="max-w-2xl mx-auto text-center mb-16"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-4"
          >
            Trusted by{' '}
            <span className="text-violet-500">
              Professionals
            </span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-slate-400"
          >
            See what our users say about their experience with ElevateCV
          </motion.p>
        </motion.div>

        {/* Testimonials Marquee */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="space-y-16"
        >
          {/* First row - right to left */}
          <motion.div 
            variants={marqueeVariants}
            className="relative w-full"
          >
            <Marquee 
              className="py-4" 
              pauseOnHover 
              reverse 
              speed={30}
            >
              {testimonials.map((testimonial, index) => (
                <TestimonialCard key={`top-${index}`} testimonial={testimonial} index={index} />
              ))}
            </Marquee>
          </motion.div>

          {/* Second row - left to right */}
          <motion.div 
            variants={marqueeVariants}
            className="relative w-full"
          >
            <Marquee 
              className="py-4" 
              pauseOnHover 
              speed={35}
            >
              {[...testimonials].reverse().map((testimonial, index) => (
                <TestimonialCard key={`bottom-${index}`} testimonial={testimonial} index={index} />
              ))}
            </Marquee>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 