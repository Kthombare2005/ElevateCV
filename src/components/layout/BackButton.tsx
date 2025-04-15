'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href: string;
}

export const BackButton = ({ href }: BackButtonProps) => {
  return (
    <Link
      href={href}
      className="absolute top-6 left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      <span>Back</span>
    </Link>
  );
}; 