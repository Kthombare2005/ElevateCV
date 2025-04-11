'use client';

import Link from 'next/link';
import { ArrowUpRight, ChevronRight } from 'lucide-react';

interface NavbarProps {
  hideGetStarted?: boolean;
}

const Navbar = ({ hideGetStarted = false }: NavbarProps) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <nav className="mx-auto max-w-7xl px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="flex items-center">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center transform transition-transform group-hover:scale-105">
                  <span className="text-white font-bold text-xl">E</span>
                  <div className="absolute -top-1 -right-1">
                    <ArrowUpRight className="h-4 w-4 text-pink-500" />
                  </div>
                </div>
              </div>
              <div className="ml-3 flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  ElevateCV
                </span>
                <span className="text-xs text-gray-500 font-medium">AI Resume Analysis</span>
              </div>
            </div>
          </Link>

          {!hideGetStarted && (
            <Link
              href="/get-started"
              className="group relative inline-flex items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 p-[2px] hover:text-white focus:outline-none focus:ring active:text-opacity-75"
            >
              <span className="relative flex items-center gap-1 rounded-full bg-white px-6 py-3 text-sm font-semibold text-purple-600 transition-colors hover:bg-transparent hover:text-white">
                Get started
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar; 