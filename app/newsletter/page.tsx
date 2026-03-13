'use client';

import BackButton from '@/components/BackButton';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NewsletterPage() {
  return (
    <main className="min-h-screen bg-black pt-40 pb-20 px-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-soyuz/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <BackButton />
        
        <div className="mt-20 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-6 uppercase tracking-[0.2em] rounded-full">
              COMMUNICATION HUB
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              SOYUZ <br /><span className="outline-text-white">NEWSLETTER</span>
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-[#888888] text-lg font-bold uppercase tracking-widest leading-relaxed">
                Stay updated with elite performance equipment drops, pro-team insights, and localized event data.
              </p>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[#444444] mb-2">EMAIL ADDRESS</label>
                  <input 
                    type="email" 
                    placeholder="ENTER YOUR COORDINATES"
                    className="w-full bg-black border border-white/10 px-6 py-4 text-xs text-white uppercase font-bold focus:outline-none focus:border-soyuz transition-all"
                  />
                </div>
                <button className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  INITIALIZE SUBSCRIPTION
                </button>
              </form>
            </div>

            <div className="bg-[#0A0A0A] border border-white/5 p-12 text-center space-y-8 group">
              <div className="w-20 h-20 bg-soyuz/10 border border-soyuz/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(255,0,0,0.1)] transition-transform group-hover:scale-110">
                <Mail className="text-soyuz" size={32} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-display italic text-white uppercase">ZERO SPAM</h3>
                <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest leading-relaxed">Only critical missions and exclusive equipment briefs.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
