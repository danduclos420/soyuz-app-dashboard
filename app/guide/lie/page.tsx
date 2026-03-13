'use client';

import { motion } from 'framer-motion';
import { Target, Info, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function LieGuide() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 selection:bg-soyuz selection:text-white">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      
      <div className="soyuz-container relative z-10">
        <BackButton href="/guide" label="BACK TO GUIDES" variant="relative" className="mb-12" />
        
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
              GEOMETRY & STANCE
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              BLADE <br /><span className="outline-text-white">LIE</span>
            </h1>
            
            <div className="space-y-12">
              <p className="text-[#888888] font-bold uppercase tracking-widest text-sm leading-relaxed">
                The Lie is the angle between the shaft and the blade. It determines how your stick sits on the ice based on your height and skating stance.
              </p>

              <div className="space-y-6">
                <div className="p-8 bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display text-white italic mb-4 uppercase">LIE 4 - 5 (Low)</h3>
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-widest leading-relaxed">
                    Designed for players who skate low to the ice or carry the puck far from their body. Large guys or those with longer sticks often prefer a lower lie.
                  </p>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display text-white italic mb-4 uppercase">LIE 6 (Standard)</h3>
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-widest leading-relaxed">
                    The gold standard. Fits most heights and stances. If you're unsure, this is the most versatile option.
                  </p>
                </div>

                <div className="p-8 bg-white/[0.02] border border-white/5">
                  <h3 className="text-xl font-display text-white italic mb-4 uppercase">LIE 7+ (High)</h3>
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-widest leading-relaxed">
                    Perfect for players who stand more upright or carry the puck very close to their body. Often preferred for tight stick handling.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-32"
          >
            <div className="bg-[#0A0A0A] border border-white/5 rounded-3xl p-12 relative overflow-hidden">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <div className="relative z-10 flex flex-col items-center">
                  <div className="relative w-full h-64 flex items-end justify-center">
                    <motion.div 
                      animate={{ rotate: [-20, 20, -20] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="w-1 h-full bg-soyuz origin-bottom rounded-full"
                    />
                    <div className="absolute bottom-0 w-3/4 h-1 bg-white/20 rounded-full" />
                  </div>
                  <Target className="w-16 h-16 text-white/5 mt-8" />
                  
                  <div className="mt-12 w-full space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest border-b border-white/5 pb-2">
                       <span className="text-[#444]">Ideal Contact</span>
                       <span className="text-soyuz">Centered</span>
                    </div>
                    <p className="text-[9px] text-[#666] uppercase font-bold tracking-tight text-center mt-4">
                      Check your tape wear: If it's worn at the toe, you need a higher lie. If it's worn at the heel, you need a lower lie.
                    </p>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                   The height of your stick affects your lie. If you cut your stick, the effective lie increases (blade toe will lift).
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
