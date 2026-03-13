'use client';

import { motion } from 'framer-motion';
import { Ruler, Info, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function HeightGuide() {
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
              FITMENT & MEASUREMENT
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              STICK <br /><span className="outline-text-white">HEIGHT</span>
            </h1>
            
            <div className="space-y-12">
              <section className="p-8 bg-white/[0.02] border-l-2 border-soyuz">
                <h3 className="text-xl font-display text-white italic mb-4 uppercase">The Golden Rule</h3>
                <p className="text-[#AAAAAA] text-xs font-medium uppercase tracking-widest leading-relaxed">
                  With your skates on, the stick should reach anywhere from your lip to your chin. Without skates, it should be at your nose.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-[#0A0A0A] border border-white/5 group hover:border-white/20 transition-all">
                  <h4 className="text-soyuz font-display text-lg mb-2 italic">SHORT STICK</h4>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider leading-relaxed">
                    Better for stick handling, quick moves in tight spaces, and protection. Usually preferred by forwards.
                  </p>
                </div>
                <div className="p-6 bg-[#0A0A0A] border border-white/5 group hover:border-white/20 transition-all">
                  <h4 className="text-soyuz font-display text-lg mb-2 italic">LONG STICK</h4>
                  <p className="text-[10px] text-white/60 uppercase tracking-wider leading-relaxed">
                    Provides more reach, better leverage for slap shots, and poke-checking ability. Usually preferred by defenders.
                  </p>
                </div>
              </div>

              <section className="space-y-6">
                <h3 className="text-2xl font-display text-white italic">FLEX ADJUSTMENT</h3>
                <p className="text-[#888888] font-bold uppercase tracking-widest text-[11px] leading-relaxed">
                  Remember: Cutting your stick will increase its stiffness (Flex). For every inch cut, expect an increase of roughly 3-5 flex points.
                </p>
              </section>
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
                  <Ruler className="w-24 h-24 text-soyuz/40 mb-12" />
                  
                  <div className="w-full flex justify-between items-end h-64 gap-8">
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-4 bg-soyuz h-3/4 group-hover:h-full transition-all duration-700 rounded-t-lg" />
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Lip (Standard)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-4 bg-white/10 h-1/2 group-hover:h-2/3 transition-all duration-700 rounded-t-lg" />
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Nose (No Skates)</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-4">
                      <div className="w-4 bg-white/20 h-full rounded-t-lg" />
                      <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Max Reach</span>
                    </div>
                  </div>

                  <div className="mt-12 w-full pt-8 border-t border-white/5 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Customizable Length</span>
                      <span className="text-xs font-display italic text-soyuz">YES</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">Extensions Support</span>
                      <span className="text-xs font-display italic text-white">UP TO 6"</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                  Always start slightly longer if you're unsure. You can always cut it down, but adding an extension changes the balance and flex profile.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
