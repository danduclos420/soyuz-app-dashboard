'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const DATA = [
  { id: 1, label: 'SR 102', flex: 102, category: 'EXTRA STIFF', description: 'Built for heavy-duty shooters who put maximum weight into every shot.', deflection: 15 },
  { id: 2, label: 'SR 95', flex: 95, category: 'STIFF', description: 'Provides a firm feel with elite-level energy return for strong athletes.', deflection: 20 },
  { id: 3, label: 'SR 85', flex: 85, category: 'PRO STIFF', description: 'The gold standard for adult players, balancing power and release speed.', deflection: 25 },
  { id: 4, label: 'SR 75', flex: 75, category: 'REGULAR', description: 'Versatile flex that allows for quick loading and snappy releases.', deflection: 30 },
  { id: 5, label: 'SR 70', flex: 70, category: 'LIGHT', description: 'Perfect for players who prefer a whippier stick for faster puck release.', deflection: 35 },
  { id: 6, label: 'INT 65', flex: 65, category: 'INTERMEDIATE', description: 'Designed for high-performance intermediate players growing their power.', deflection: 40 },
  { id: 7, label: 'INT 55', flex: 55, category: 'ELITE YOUTH', description: 'Lightweight construction for maximum feel and control for young athletes.', deflection: 45 },
];

export default function FlexGuide() {
  const [selectedId, setSelectedId] = useState(DATA[3].id);
  const activeFlex = DATA.find((item) => item.id === selectedId) || DATA[3];
  const [testActive, setTestActive] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="bg-background min-h-screen pt-32 pb-24" />;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 selection:bg-soyuz selection:text-white">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      
      <div className="soyuz-container relative z-10 px-4">
        <BackButton href="/guide" label="BACK TO GUIDES" variant="relative" className="mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT: CONTENT & CHOICES */}
          <div className="space-y-8 lg:space-y-12">
            <div>
              <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
                STIFFNESS TESTER
              </span>
              <h1 className="font-display text-4xl sm:text-6xl md:text-8xl italic leading-none mb-4">
                STICK <br />
                <span className="outline-text-white">FLEX</span>
              </h1>
              <p className="text-[#888888] text-xs sm:text-sm uppercase tracking-widest font-bold max-w-md">
                Master the whip. Select a flex rating that matches your weight and strength.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
              {DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`relative p-4 sm:p-6 text-left transition-all duration-300 border ${
                    selectedId === item.id 
                      ? 'bg-soyuz/10 border-soyuz shadow-[0_0_30px_rgba(204,0,0,0.2)]' 
                      : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1 sm:mb-2">
                    <span className="text-xl sm:text-2xl font-black italic">{item.label}</span>
                    <Zap size={14} className={selectedId === item.id ? 'text-soyuz' : 'text-white/10'} />
                  </div>
                  <p className="text-white/40 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest leading-tight">{item.category}</p>
                </button>
              ))}
            </div>
          </div>

          {/* VISUALIZER SIDE */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="aspect-[4/5] bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               
               <div className="absolute top-8 inset-x-8 flex justify-between">
                  <div className="space-y-1">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block">Load Test</span>
                     <span className="text-xs font-display italic text-soyuz uppercase">{testActive ? 'STRESSING' : 'READY'}</span>
                  </div>
                  <div className="text-right space-y-1">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block">Deflection</span>
                     <span className="text-xs font-display italic text-white uppercase">{testActive ? `-${activeFlex.deflection}%` : '0.00' }</span>
                  </div>
               </div>

               <div className="relative w-full h-2/3 flex items-center justify-center cursor-pointer"
                    onMouseDown={() => setTestActive(true)}
                    onMouseUp={() => setTestActive(false)}
                    onTouchStart={() => setTestActive(true)}
                    onTouchEnd={() => setTestActive(false)}>
                  
                  <svg viewBox="0 0 200 600" className="h-full">
                     <line x1="50" y1="100" x2="150" y2="100" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                     <line x1="50" y1="500" x2="150" y2="500" stroke="white" strokeWidth="1" strokeOpacity="0.05" />

                     <motion.path 
                        animate={{ 
                          d: testActive 
                             ? `M 100 100 Q ${100 + activeFlex.deflection} 300 100 500` 
                             : `M 100 100 Q 100 300 100 500` 
                        }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        fill="none" stroke="#CC0000" strokeWidth="6" strokeLinecap="round"
                        className="shadow-[0_0_20px_#CC0000]"
                     />
                  </svg>

                  {!testActive && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-full flex items-center gap-3">
                       <Target size={14} className="text-soyuz" />
                       <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white">Press to Test</span>
                    </div>
                  )}
               </div>

               <div className="absolute bottom-8 inset-x-8">
                  <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                     <motion.div 
                        animate={{ width: testActive ? '100%' : '0%' }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-soyuz shadow-[0_0_10px_#CC0000]"
                     />
                  </div>
               </div>
            </div>

            <div className="p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl">
              <div className="flex gap-4 items-start mb-6">
                <Info className="text-soyuz flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                    {activeFlex.description}
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
          </div>
        </div>
      </div>
    </div>
  );
}
