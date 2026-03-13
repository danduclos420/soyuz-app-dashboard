'use client';

import { motion } from 'framer-motion';
import { Shield, Info, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function PlayerSideGuide() {
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
              ORIENTATION & HANDEDNESS
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              PLAYER <br /><span className="outline-text-white">SIDE</span>
            </h1>
            
            <div className="space-y-12">
              <p className="text-[#888888] font-bold uppercase tracking-widest text-sm leading-relaxed">
                Choosing your side is the most fundamental decision. It's not always as simple as being right or left-handed in daily life.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-soyuz/40 transition-all text-center group">
                   <h3 className="text-4xl font-display text-white italic mb-4 group-hover:text-soyuz transition-colors">LEFT</h3>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-6">Right hand at the top</p>
                   <p className="text-[#666] text-xs font-medium uppercase tracking-widest leading-relaxed">
                     Usually preferred by players who are and right-hand dominant, as the dominant hand provides control at the top of the shaft.
                   </p>
                </div>

                <div className="p-10 bg-white/[0.02] border border-white/5 hover:border-soyuz/40 transition-all text-center group">
                   <h3 className="text-4xl font-display text-white italic mb-4 group-hover:text-soyuz transition-colors">RIGHT</h3>
                   <p className="text-[10px] text-white/40 uppercase tracking-widest font-black mb-6">Left hand at the top</p>
                   <p className="text-[#666] text-xs font-medium uppercase tracking-widest leading-relaxed">
                     Usually preferred by players who are left-hand dominant, or those who naturally feel more comfortable with their right hand lower on the stick.
                   </p>
                </div>
              </div>

              <section className="p-8 bg-[#0D0D0D] border border-white/5">
                <h4 className="text-white font-display text-xl mb-4 italic uppercase">The Dominant Hand Theory</h4>
                <p className="text-[#AAAAAA] text-xs font-bold uppercase tracking-widest leading-relaxed">
                   Many elite coaches recommend placing your dominant hand at the top of the stick for better puck control and one-handed stick handling, but comfort remains the ultimate guide.
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
                  <Shield className="w-24 h-24 text-soyuz/20 mb-12" />
                  
                  <div className="flex gap-4 w-full h-48">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-soyuz/5 transition-colors"
                    >
                      <span className="text-2xl font-display italic text-white/40">L</span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-2">LEFTIE</span>
                    </motion.div>
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex-1 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-soyuz/5 transition-colors"
                    >
                      <span className="text-2xl font-display italic text-white/40">R</span>
                      <span className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-2">RIGHTIE</span>
                    </motion.div>
                  </div>

                  <div className="mt-12 text-center">
                    <p className="text-[#666666] text-[9px] font-black uppercase tracking-[0.3em] mb-4">Finding your balance</p>
                    <div className="h-1 w-full bg-white/5 rounded-full">
                       <div className="h-full w-1/2 bg-soyuz mx-auto" />
                    </div>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                   Try picking up a broom or a shovel. Whichever hand naturally goes to the top is likely the hand that should be at the top of your hockey stick.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
