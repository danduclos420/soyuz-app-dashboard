'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-black pt-40 pb-20 px-6 selection:bg-soyuz selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-soyuz/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-3xl mx-auto relative z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#444444] hover:text-white text-[9px] font-black uppercase tracking-[0.4em] mb-12 transition-colors group"
        >
          <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> BACK TO BASE
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] uppercase tracking-[0.2em] rounded-full">
              LEGAL NODE 01
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              PRIVACY <br /><span className="outline-text-white">PROTOCOL</span>
            </h1>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-8 text-[#888888] text-sm leading-relaxed uppercase font-bold tracking-wider">
            <p>
              YOUR DATA IS SECURE WITHIN THE SOYUZ ECOSYSTEM. WE COLLECT MINIMAL INFORMATION REQUIRED TO PROCESS YOUR ELITE HARDWARE ORDERS AND MANIPULATE THE GLOBAL HOCKEY PIPELINE.
            </p>
            <p>
              FULL DATA ENCRYPTION IS ACTIVE. WE DO NOT SELL DATA TO THE COMPETITION. YOUR MISSION DATA IS PROTECTED BY OUR CORE SECURITY CORE.
            </p>
            <div className="pt-8 border-t border-white/5 flex items-center gap-4 text-white">
              <ShieldCheck className="text-soyuz" size={24} />
              <p className="text-[10px] font-black tracking-[0.2em]">SECURITY STATUS: ACTIVE / PROTECTED</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
