'use client';

import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="w-full bg-slate-950">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="text-white font-semibold text-xl">ElevateCV</span>
            </div>
            <p className="text-slate-400 text-sm">
              Transform your career prospects with AI-powered resume optimization and professional guidance.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="https://github.com/Kthombare2005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/in/ketanthombare-tech/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/ThombareKetan"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:contact@elevatecv.com"
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li><Link href="/features" className="text-slate-400 hover:text-slate-200 transition-colors">Features</Link></li>
              <li><Link href="/how-it-works" className="text-slate-400 hover:text-slate-200 transition-colors">How it Works</Link></li>
              <li><Link href="/pricing" className="text-slate-400 hover:text-slate-200 transition-colors">Pricing</Link></li>
              <li><Link href="/testimonials" className="text-slate-400 hover:text-slate-200 transition-colors">Testimonials</Link></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/templates" className="text-slate-400 hover:text-slate-200 transition-colors">Resume Templates</Link></li>
              <li><Link href="/career-tips" className="text-slate-400 hover:text-slate-200 transition-colors">Career Tips</Link></li>
              <li><Link href="/ats-guide" className="text-slate-400 hover:text-slate-200 transition-colors">ATS Guide</Link></li>
              <li><Link href="/faq" className="text-slate-400 hover:text-slate-200 transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="text-slate-400 hover:text-slate-200 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-slate-400 hover:text-slate-200 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="text-slate-400 hover:text-slate-200 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-slate-400">
            <p>© {new Date().getFullYear()} ElevateCV. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Designed & Developed by{' '}
              <Link 
                href="https://github.com/Kthombare2005"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-200 hover:text-white transition-colors"
              >
                Ketan Thombare
              </Link>
              {/* {' • '} */}
              {/* <span>Built with Next.js & Tailwind CSS</span> */}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 