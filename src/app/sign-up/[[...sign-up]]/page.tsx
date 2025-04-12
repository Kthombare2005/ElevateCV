'use client';

import { SignUp } from "@clerk/nextjs";
import { ParticleBackground } from "@/components/magicui/ParticleBackground";
import { FloatingElement } from "@/components/magicui/FloatingElement";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0118]">
      {/* Back Button */}
      <Link 
        href="/"
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-purple-300 hover:text-white transition-colors duration-200 group bg-white/5 px-4 py-2 rounded-full backdrop-blur-sm border border-white/10 hover:bg-white/10 hover:border-white/20"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="font-medium">Back to Home</span>
      </Link>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-950/50 via-slate-950 to-slate-950" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-2xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent blur-2xl transform translate-y-1/2" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:radial-gradient(white,transparent_85%)] pointer-events-none opacity-20" />
      </div>
      <ParticleBackground className="!absolute !inset-0 !z-0 opacity-40" />
      
      {/* Floating Elements */}
      <FloatingElement
        delay={0}
        className="hidden lg:block absolute -right-16 top-1/4 z-0"
      >
        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </FloatingElement>
      <FloatingElement
        delay={2}
        className="hidden lg:block absolute -left-16 bottom-1/4 z-0"
      >
        <div className="w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse-slow" />
      </FloatingElement>

      {/* Animated Rings */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full border border-purple-500/20 rounded-full animate-spin-slow" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full border border-purple-500/20 rounded-full animate-spin-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] border border-purple-500/20 rounded-full animate-spin-slower" />
      </div>

      {/* Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/90 to-purple-900/20 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/10" />
        <div className="relative flex items-center justify-center py-6">
          <SignUp 
            appearance={{
              elements: {
                formButtonPrimary: 'bg-purple-600 hover:bg-purple-500 transition-all duration-200 hover:scale-[1.02] text-base font-medium shadow-lg shadow-purple-500/30 h-8',
                footerActionLink: 'text-purple-300 hover:text-purple-200',
                card: 'bg-transparent shadow-2xl rounded-3xl px-6',
                headerTitle: 'text-lg font-bold bg-gradient-to-br from-white to-purple-200 bg-clip-text text-transparent mb-0.5',
                headerSubtitle: 'text-purple-200/80 text-xs mb-3',
                socialButtonsBlockButton: 'hover:scale-[1.02] transition-all duration-200 bg-white/5 hover:bg-white/10 backdrop-blur-sm border border-white/10 h-8',
                socialButtonsBlockButtonText: 'font-medium text-white text-sm',
                formFieldLabel: 'font-medium text-purple-200/90 text-xs mb-0.5',
                formFieldInput: 'rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-purple-200/40 focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm h-8 px-2.5 py-1 text-sm',
                dividerLine: 'bg-white/10',
                dividerText: 'text-purple-200/40 text-xs px-2',
                formFieldInputShowPasswordButton: 'hover:text-purple-300 focus:text-purple-300 transition-colors duration-200',
                formFieldInputPhoneNumberInput: 'rounded-lg border border-white/10 bg-white/5 text-white placeholder:text-purple-200/40 focus:ring-1 focus:ring-purple-500/40 focus:border-purple-500 transition-all duration-200 backdrop-blur-sm h-8 px-2.5 py-1 text-sm',
                rootBox: 'py-0',
                main: 'space-y-2',
                form: 'space-y-2',
                formFieldLabelRow: 'mb-0.5',
                socialButtonsIconButton: 'hover:scale-[1.02] transition-all duration-200 h-8 border border-white/10',
                socialButtonsProviderIcon: 'w-4 h-4',
                otherLoginLink: 'text-xs',
                footer: 'pb-0'
              },
              layout: {
                socialButtonsPlacement: "bottom",
                showOptionalFields: false
              }
            }}
          />
        </div>
      </motion.div>
    </div>
  );
} 