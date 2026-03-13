'use client';

import { motion } from 'framer-motion';
import { Zap, Info, Shield, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function KickPointGuide() {
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
              ENERGY TRANSFER
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              KICK <br /><span className="outline-text-white">POINT</span>
            </h1>
            
            <div className="space-y-12">
              <section>
                <h3 className="text-2xl font-display text-white italic mb-4">LOW KICK POINT</h3>
                <p className="text-[#888888] font-bold uppercase tracking-widest text-xs mb-6 leading-relaxed">
                  Best for: Quick snapshots, tight-space plays, and instant release.
                </p>
                <div className="p-6 bg-white/[0.02] border border-white/5 group hover:border-soyuz/30 transition-all">
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-wider leading-relaxed">
                    Designed for players who need the puck off the blade as fast as possible. The shaft flexes at the very bottom, near the hosel, creating an ultra-fast energy transfer.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-display text-white italic mb-4">MID KICK POINT</h3>
                <p className="text-[#888888] font-bold uppercase tracking-widest text-xs mb-6 leading-relaxed">
                  Best for: Power shooters, heavy slap shots, and maximal energy load.
                </p>
                <div className="p-6 bg-white/[0.02] border border-white/5 group hover:border-soyuz/30 transition-all">
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-wider leading-relaxed">
                    The classic choice for pure power. The shaft flexes in the middle, allowing the player to load more weight into the stick for a more explosive shot.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-2xl font-display text-white italic mb-4">HYBRID KICK POINT</h3>
                <p className="text-[#888888] font-bold uppercase tracking-widest text-xs mb-6 leading-relaxed">
                  Best for: Versatile players who need both power and speed.
                </p>
                <div className="p-6 bg-white/[0.02] border border-white/5 group hover:border-soyuz/30 transition-all">
                  <p className="text-[#AAAAAA] text-[11px] font-medium uppercase tracking-wider leading-relaxed">
                    Adjusts to your hand position. Closer together for quick release, further apart for a mid-kick feel. The ultimate "all-situations" setup.
                  </p>
                </div>
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
                  <Zap className="w-24 h-24 text-soyuz mb-8 animate-pulse" />
                  <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden mb-12">
                    <motion.div 
                      initial={{ width: "20%" }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                      className="h-full bg-soyuz shadow-[0_0_15px_rgba(204,0,0,0.5)]"
                    />
                  </div>
                  
                  <div className="w-full space-y-6">
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Flex zones</span>
                      <span className="text-xs font-display italic text-soyuz">Dynamic</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-4">
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Energy Return</span>
                      <span className="text-xs font-display italic text-white">+24% Peak</span>
                    </div>
                  </div>

                  <div className="mt-12 text-center">
                    <p className="text-[#666666] text-[9px] font-black uppercase tracking-[0.3em] mb-4">Soyuz proprietary technology</p>
                    <div className="flex justify-center gap-2">
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#888888]">CARBON-X</span>
                      <span className="px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-[#888888]">LETHAL-RELEASE</span>
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                  Low-kick (HIT ULTRA) is dominating the modern game, but defenders still often prefer the Mid-kick for clearing pucks with maximum force.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
