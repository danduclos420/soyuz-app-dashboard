'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Info, CheckCircle2, Zap, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const FLEX_DATA = [
  { id: 65, label: '65 FLEX', category: 'INTERMEDIATE', desc: 'Whippy and reactive. Perfect for quick shots.', deflection: 60 },
  { id: 75, label: '75 FLEX', category: 'STANDARD', desc: 'The pro standard. Balanced release and power.', deflection: 45 },
  { id: 85, label: '85 FLEX', category: 'STIFF', desc: 'Maximum energy transfer for heavy hitters.', deflection: 30 },
  { id: 95, label: '95+ FLEX', category: 'PRO STIFF', desc: 'Elite force required. Explosive slap shots.', deflection: 15 },
];

export default function FlexGuide() {
  const [activeFlex, setActiveFlex] = useState(FLEX_DATA[1]);
  const [testActive, setTestActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-background min-h-screen pt-32 pb-24" />;

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
              STRUCTURAL STIFFNESS TESTER
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              STICK <br /><span className="outline-text-white">FLEX</span>
            </h1>
            
            <div className="grid grid-cols-1 gap-3 mb-8 lg:mb-12">
              {FLEX_DATA.map((flex) => (
                <div 
                  key={flex.id}
                  onClick={() => setActiveFlex(flex)}
                  onMouseEnter={() => setActiveFlex(flex)}
                  className={`p-4 lg:p-6 border transition-all duration-500 cursor-pointer group ${
                    activeFlex.id === flex.id ? 'bg-white/[0.04] border-soyuz' : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                     <h3 className={`text-xl lg:text-3xl font-display italic ${activeFlex.id === flex.id ? 'text-white' : 'text-[#444] group-hover:text-[#888]'}`}>
                        FLEX {flex.flex}
                     </h3>
                     {activeFlex.id === flex.id && <Zap size={14} className="text-soyuz" />}
                  </div>
                  <p className={`text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${activeFlex.id === flex.id ? 'text-soyuz' : 'text-[#222]'}`}>
                    {flex.label}
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {activeFlex.id === flex.id && (
                      <motion.p 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-[#AAAAAA] text-[10px] font-medium uppercase tracking-wider leading-relaxed pt-4 border-t border-white/5"
                      >
                        {flex.description}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SIMULATOR VISUAL SIDE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="aspect-[4/5] bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               
               {/* Technical HUD */}
               <div className="absolute top-8 inset-x-8 flex justify-between">
                  <div className="space-y-1">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block">Load Test: Status</span>
                     <span className="text-xs font-display italic text-soyuz uppercase">{testActive ? 'STRESSING' : 'READY'}</span>
                  </div>
                  <div className="text-right space-y-1">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block">Deflection Index</span>
                     <span className="text-xs font-display italic text-white uppercase">{testActive ? `-${activeFlex.deflection}%` : '0.00' }</span>
                  </div>
               </div>

               {/* COMPRESSION SVG */}
               <div className="relative w-full h-2/3 flex items-center justify-center cursor-pointer"
                    onMouseDown={() => setTestActive(true)}
                    onMouseUp={() => setTestActive(false)}
                    onTouchStart={() => setTestActive(true)}
                    onTouchEnd={() => setTestActive(false)}>
                  
                  <svg viewBox="0 0 200 600" className="h-full">
                     {/* Static Guides */}
                     <line x1="50" y1="100" x2="150" y2="100" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                     <line x1="50" y1="500" x2="150" y2="500" stroke="white" strokeWidth="1" strokeOpacity="0.05" />

                     {/* The Stick Under Load */}
                     <motion.path 
                        initial={{ d: `M 100 100 Q 100 300 100 500` }}
                        animate={{ 
                          d: testActive 
                             ? `M 100 100 Q ${100 + activeFlex.deflection} 300 100 500` 
                             : `M 100 100 Q 100 300 100 500` 
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        fill="none" stroke="#222" strokeWidth="14" strokeLinecap="round"
                     />
                     <motion.path 
                        initial={{ d: `M 100 100 Q 100 300 100 500` }}
                        animate={{ 
                          d: testActive 
                             ? `M 100 100 Q ${100 + activeFlex.deflection} 300 100 500` 
                             : `M 100 100 Q 100 300 100 500` 
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        fill="none" stroke="#CC0000" strokeWidth="6" strokeLinecap="round"
                        className="shadow-[0_0_20px_#CC0000]"
                     />

                     {/* Energy Indicator */}
                     <AnimatePresence>
                        {testActive && (
                          <motion.circle 
                            initial={{ opacity: 0, scale: 0, cx: 100 + activeFlex.deflection }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            cx={100 + activeFlex.deflection} cy="300" r="10" fill="#CC0000" className="blur-[8px]"
                          />
                        )}
                     </AnimatePresence>
                  </svg>

                  {/* CTAs */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {!testActive && (
                        <div className="bg-black/60 backdrop-blur-xl border border-white/5 px-8 py-4 rounded-full flex items-center gap-4">
                           <Target size={16} className="text-soyuz" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Press to apply 100lb load</span>
                        </div>
                     )}
                  </div>
               </div>

               <div className="absolute bottom-8 inset-x-8">
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: testActive ? '100%' : '0%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-soyuz shadow-[0_0_10px_#CC0000]"
                     />
                  </div>
                  <div className="flex justify-between mt-4">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.2em]">Kevlar Core Integrity</span>
                     <span className="text-[8px] font-black text-soyuz uppercase tracking-[0.2em]">Stable</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl">
              <div className="flex gap-4 items-start mb-6">
                <Info className="text-soyuz flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                    Younger players often use flexes that are too high. Your stick should flex slightly even on a simple wrist shot to maximize energy transfer.
                  </p>
                </div>
              </div>
              <section className="p-6 bg-white/[0.02] border-l border-soyuz/30 rounded-r-xl">
                <h3 className="text-sm font-display text-white italic mb-2 uppercase tracking-wide">Cutting vs Stiffness</h3>
                <p className="text-[#888888] text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                  Remember: for every inch you cut, flex increases by ~3-5 points. A 75 cut by 2" becomes ~85.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
