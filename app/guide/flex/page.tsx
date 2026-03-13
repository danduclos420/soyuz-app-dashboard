'use client';

import { motion } from 'framer-motion';
import { Layers, Info, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function FlexGuide() {
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
              STIFFNESS & POWER
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              STICK <br /><span className="outline-text-white">FLEX</span>
            </h1>
            
            <div className="space-y-12">
              <p className="text-[#888888] font-bold uppercase tracking-widest text-sm leading-relaxed">
                Flex is the amount of force (in pounds) required to bend the stick one inch. The right flex allows you to load energy efficiently.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                   { flex: '65 - 75', label: 'INTERMEDIATE / SOFT', desc: 'Ideal for younger players or those who prioritize a quick release over raw power.' },
                   { flex: '75', label: 'STANDARD', desc: 'The average choice for most adult players. Versatile and reliable.' },
                   { flex: '85', label: 'STIFF', desc: 'For stronger players or those who use a lot of body weight in their shots.' },
                   { flex: '95+', label: 'PRO-STIFF', desc: 'Reserved for elite level power shooters. Requires significant force to load.' }
                ].map((item) => (
                  <div key={item.flex} className="p-6 bg-white/[0.02] border border-white/5 hover:border-soyuz/40 transition-all">
                    <h3 className="text-xl font-display text-soyuz mb-1 italic">{item.flex}</h3>
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em] mb-4">{item.label}</p>
                    <p className="text-[#666666] text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>

              <section className="p-8 bg-soyuz/5 border border-soyuz/20 rounded-3xl">
                <h4 className="text-white font-display text-xl mb-4 italic uppercase">The Flex Formula</h4>
                <p className="text-[#AAAAAA] text-xs font-bold uppercase tracking-widest leading-relaxed mb-6">
                  A common starting point is the "Half your body weight" rule. If you weigh 160 lbs, start with an 80 flex and adjust based on preference.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1 p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[8px] text-[#444] block mb-1 font-black">STIFFNESS</span>
                    <span className="text-soyuz font-display text-lg">INCREASES</span>
                    <span className="text-[8px] text-[#444] block mt-1 font-black">AS YOU CUT</span>
                  </div>
                  <div className="flex-1 p-4 bg-black/40 border border-white/5 rounded-xl text-center">
                    <span className="text-[8px] text-[#444] block mb-1 font-black">LEVERAGE</span>
                    <span className="text-soyuz font-display text-lg">DECREASES</span>
                    <span className="text-[8px] text-[#444] block mt-1 font-black">AS YOU CUT</span>
                  </div>
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
                  <Layers className="w-24 h-24 text-soyuz mb-12" />
                  
                  <div className="w-full space-y-2">
                    {[
                      { l: 'Whippy', v: 65, c: 'bg-soyuz/20' },
                      { l: 'Standard', v: 75, c: 'bg-soyuz/40' },
                      { l: 'Stiff', v: 85, c: 'bg-soyuz/60' },
                      { l: 'Extra Stiff', v: 95, c: 'bg-soyuz' },
                    ].map((row) => (
                      <div key={row.v} className="flex items-center gap-4">
                        <span className="w-20 text-[9px] font-black text-[#555] uppercase tracking-widest text-right">{row.l}</span>
                        <div className="flex-1 h-3 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(row.v / 105) * 100}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`${row.c} h-full`}
                          />
                        </div>
                        <span className="w-8 text-[9px] font-black text-white tracking-widest">{row.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-12 text-center text-[#444] text-[9px] font-black uppercase tracking-[0.2em] leading-relaxed">
                    Soyuz Carbon-X fibers are engineered to maintain flex consistency throughout the entire lifespan of the stick.
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                   If you find it difficult to bend the stick during a shot, your flex is too high. You are losing power by not utilizing the stick's natural energy storage.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
