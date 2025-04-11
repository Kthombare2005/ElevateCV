'use client';

import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface BackButtonProps {
  href: string;
}

export const BackButton = ({ href }: BackButtonProps) => {
  return (
    <Link href={href}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05 }}
        className="fixed top-8 left-8 z-50"
      >
        <div className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
          <ArrowLeft className="w-5 h-5 text-white group-hover:transform group-hover:-translate-x-1 transition-transform duration-300" />
          <span className="text-white text-sm font-medium">Back</span>
        </div>
      </motion.div>
    </Link>
  );
}; 