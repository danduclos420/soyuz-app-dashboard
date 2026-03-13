'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Ruler, Info, CheckCircle2, User, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import BackButton from '@/components/BackButton';

export default function HeightGuide() {
  const [onIce, setOnIce] = useState(true);
  const [activeZone, setActiveZone] = useState('chin'); // nose, lip, chin

  const ZONES = {
    nose: { label: 'NOSE', desc: 'Maximum length. Best for reach.', y: 150 },
    lip: { label: 'LIP', desc: 'The standard pro choice.', y: 180 },
    chin: { label: 'CHIN', desc: 'Short for better handling.', y: 210 }
  };

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
              ERGONOMIC CALIBRATION
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              STICK <br /><span className="outline-text-white">HEIGHT</span>
            </h1>
            
            <div className="space-y-12">
              <div className="flex gap-4">
                 <button 
                  onClick={() => setOnIce(true)}
                  className={`px-6 py-3 border transition-all font-black text-[10px] uppercase tracking-[0.2em] ${onIce ? 'bg-soyuz border-soyuz text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                 >
                   ON ICE (WITH SKATES)
                 </button>
                 <button 
                  onClick={() => setOnIce(false)}
                  className={`px-6 py-3 border transition-all font-black text-[10px] uppercase tracking-[0.2em] ${!onIce ? 'bg-soyuz border-soyuz text-white' : 'bg-white/5 border-white/10 text-white/40 hover:text-white'}`}
                 >
                   OFF ICE (NO SKATES)
                 </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {Object.entries(ZONES).map(([key, zone]) => (
                  <div 
                    key={key}
                    onMouseEnter={() => setActiveZone(key)}
                    className={`p-6 border transition-all duration-500 cursor-pointer ${
                      activeZone === key ? 'bg-white/[0.05] border-soyuz/50' : 'bg-white/[0.01] border-white/5'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                       <div>
                          <h3 className={`text-xl font-display italic mb-1 ${activeZone === key ? 'text-white' : 'text-white/20'}`}>
                             {zone.label} MEASUREMENT
                          </h3>
                          <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeZone === key ? 'text-soyuz' : 'text-[#333]'}`}>
                             {zone.desc}
                          </p>
                       </div>
                       <ChevronRight size={16} className={activeZone === key ? 'text-soyuz' : 'text-[#222]'} />
                    </div>
                  </div>
                ))}
              </div>

              <section className="p-8 bg-white/[0.02] border-l-2 border-soyuz">
                <h3 className="text-xl font-display text-white italic mb-4 uppercase">The Pro Selection</h3>
                <p className="text-[#AAAAAA] text-xs font-medium uppercase tracking-widest leading-relaxed">
                  Most modern players cut their sticks to the {onIce ? 'chin/lip' : 'nose'} area to maximize the flex efficiency and puck control.
                </p>
              </section>
            </div>
          </motion.div>

          {/* VISUALIZER SIDE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-32"
          >
            <div className="aspect-[4/5] bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               
               {/* Measurement Lines */}
               <div className="absolute inset-y-0 right-12 w-20 border-l border-white/5 flex flex-col justify-between py-12">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className={`h-[1px] bg-white/10 ${i % 5 === 0 ? 'w-full scale-x-150 origin-right' : 'w-1/2 ml-auto'}`} />
                  ))}
               </div>

               {/* SILHOUETTE SVG */}
               <svg viewBox="0 0 400 600" className="w-full h-full">
                  <defs>
                     <linearGradient id="userGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#222" />
                        <stop offset="100%" stopColor="#0a0a0a" />
                     </linearGradient>
                  </defs>

                  {/* Skates Base (If on ice) */}
                  <AnimatePresence>
                    {onIce && (
                      <motion.rect 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        x="100" y="550" width="200" height="20"
                        fill="#CC0000" fillOpacity="0.2" rx="4"
                      />
                    )}
                  </AnimatePresence>

                  {/* Character Body (Simplified Silhouette) */}
                  <rect x="150" y="100" width="100" height="450" fill="url(#userGrad)" rx="50" />
                  <circle cx="200" cy="80" r="40" fill="url(#userGrad)" />

                  {/* THE STICK */}
                  <motion.rect 
                    animate={{ 
                      y: onIce ? ZONES[activeZone as keyof typeof ZONES].y : ZONES[activeZone as keyof typeof ZONES].y - 30,
                      height: onIce ? 600 - ZONES[activeZone as keyof typeof ZONES].y : 630 - ZONES[activeZone as keyof typeof ZONES].y
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    x="280" width="12" fill="#CC0000" rx="4"
                    className="shadow-[0_0_20px_rgba(204,0,0,0.4)]"
                  />
                  
                  {/* Indicator Line */}
                  <motion.line 
                    animate={{ 
                      y1: onIce ? ZONES[activeZone as keyof typeof ZONES].y : ZONES[activeZone as keyof typeof ZONES].y - 30,
                      y2: onIce ? ZONES[activeZone as keyof typeof ZONES].y - 0 : ZONES[activeZone as keyof typeof ZONES].y - 30
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    x1="200" x2="280" stroke="#CC0000" strokeWidth="1" strokeDasharray="4 4" 
                  />

                  {/* Target Point */}
                  <motion.circle 
                    animate={{ 
                      cy: onIce ? ZONES[activeZone as keyof typeof ZONES].y : ZONES[activeZone as keyof typeof ZONES].y - 30
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    cx="200" r="4" fill="#CC0000"
                  />
               </svg>

               <div className="absolute top-8 left-8">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-soyuz" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Target: {onIce ? 'Skates-On' : 'Skates-Off'} Profile</span>
                  </div>
                  <div className="text-[20px] font-display italic text-white/5 uppercase select-none leading-none">
                     Measurement <br />Accuracy 99%
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                   If you cut your stick, don't forget it gets stiffer. We recommend starting with a lower flex if you plan on a shorter-than-average height.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
