'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Info, CheckCircle2, Target, Zap, Hand } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

export default function PlayerSideGuide() {
  const [side, setSide] = useState<'left' | 'right'>('left');
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
              ERGONOMIC ORIENTATION
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              PLAYER <br /><span className="outline-text-white">SIDE</span>
            </h1>
            
            <div className="space-y-12">
              <div className="flex gap-4">
                 <button 
                  onClick={() => setSide('left')}
                  className={`flex-1 py-8 border transition-all flex flex-col items-center justify-center gap-4 ${side === 'left' ? 'bg-white/[0.05] border-soyuz' : 'bg-transparent border-white/5 hover:border-white/20'}`}
                 >
                   <span className={`text-4xl font-display italic ${side === 'left' ? 'text-white' : 'text-white/20'}`}>LEFT</span>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${side === 'left' ? 'text-soyuz' : 'text-[#333]'}`}>Right Hand Top</span>
                 </button>
                 <button 
                  onClick={() => setSide('right')}
                  className={`flex-1 py-8 border transition-all flex flex-col items-center justify-center gap-4 ${side === 'right' ? 'bg-white/[0.05] border-soyuz' : 'bg-transparent border-white/5 hover:border-white/20'}`}
                 >
                   <span className={`text-4xl font-display italic ${side === 'right' ? 'text-white' : 'text-white/20'}`}>RIGHT</span>
                   <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${side === 'right' ? 'text-soyuz' : 'text-[#333]'}`}>Left Hand Top</span>
                 </button>
              </div>

              <div className="space-y-6">
                <div className={`p-8 border-l-2 transition-colors duration-500 ${side === 'left' ? 'bg-white/[0.02] border-soyuz' : 'bg-transparent border-white/5'}`}>
                  <h3 className="text-xl font-display text-white italic mb-2 uppercase">CONTROL HAND</h3>
                  <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Whichever hand is at the <span className="text-soyuz">TOP</span> of the stick provides 90% of your puck handling control. It's usually best to place your <span className="text-white">dominant hand</span> here.
                  </p>
                </div>
                <div className={`p-8 border-l-2 transition-colors duration-500 ${side === 'right' ? 'bg-white/[0.02] border-soyuz' : 'bg-transparent border-white/5'}`}>
                  <h3 className="text-xl font-display text-white italic mb-2 uppercase">POWER HAND</h3>
                  <p className="text-[#888888] text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                    Whichever hand is in the <span className="text-soyuz">MIDDLE</span> of the shaft provides the leverage for power and stability during shots.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* VISUALIZER SIDE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="aspect-[4/5] bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
               
               {/* THE VISUAL STICK & HANDS */}
               <svg viewBox="0 0 400 600" className="w-full h-full">
                  <defs>
                    <radialGradient id="handGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#CC0000" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#CC0000" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* The Stick */}
                  <rect x="195" y="50" width="10" height="500" fill="#111" rx="2" />
                  <rect x="198" y="50" width="4" height="500" fill="#222" rx="1" />

                  {/* Top Hand (Control) */}
                  <motion.g
                    initial={{ x: -20 }}
                    animate={{ x: side === 'left' ? -20 : 20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <circle cx="200" cy="80" r="30" fill="url(#handGlow)" className="blur-[10px]" />
                    <rect x="180" y="65" width="40" height="30" fill="#222" rx="15" className="shadow-2xl" />
                    <text x="200" y="82" fill="#CC0000" fontSize="8" textAnchor="middle" className="font-black uppercase tracking-widest">TOP</text>
                  </motion.g>

                  {/* Bottom Hand (Power) */}
                  <motion.g
                    initial={{ x: -20, y: 200 }}
                    animate={{ 
                      x: side === 'left' ? -20 : 20,
                      y: 200
                    }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <circle cx="200" cy="80" r="25" fill="url(#handGlow)" className="blur-[10px]" strokeOpacity="0.2" />
                    <rect x="180" y="65" width="40" height="30" fill="#222" rx="15" />
                    <text x="200" y="82" fill="white" fillOpacity="0.2" fontSize="8" textAnchor="middle" className="font-black uppercase tracking-widest">MID</text>
                  </motion.g>

                  {/* Blade (Perspective shift) */}
                  <motion.path 
                    initial={{ d: "M 195 550 L 150 580" }}
                    animate={{ d: side === 'left' ? "M 195 550 L 150 580" : "M 205 550 L 250 580" }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    stroke="#CC0000" strokeWidth="12" strokeLinecap="round"
                  />
               </svg>

               <div className="absolute top-8 left-8">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-soyuz shadow-[0_0_10px_red]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Kinematic Mapping</span>
                  </div>
                  <div className="text-[20px] font-display italic text-white/5 uppercase select-none leading-none">
                     Hand Placement <br />Calibration {side.toUpperCase()}
                  </div>
               </div>

               <div className="absolute bottom-8 right-8 text-right">
                  <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block">Dominant Hand</span>
                  <span className="text-xl font-display italic text-soyuz leading-none">{side === 'left' ? 'RIGHT' : 'LEFT'}</span>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl">
              <div className="flex gap-4 items-start mb-8">
                <Info className="text-soyuz flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                    The top hand is responsible for 90% of puck handling. Keep a relaxed but firm grip to allow the shaft to rotate naturally within your bottom hand for shots.
                  </p>
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={side}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-6 bg-white/[0.02] border-l border-soyuz/30 rounded-r-xl"
                >
                  <h3 className="text-sm font-display text-white italic mb-2 uppercase tracking-wide">
                    {side === 'left' ? 'Left' : 'Right'}-Handed Mechanics
                  </h3>
                  <p className="text-[#888888] text-[9px] font-bold uppercase tracking-widest leading-relaxed mb-4">
                    {side === 'left' 
                      ? "Commonly used when your dominant hand is your right hand. Your right hand stays on top for maximum control."
                      : "Commonly used when your dominant hand is your left hand. Your left hand stays on top for maximum control."
                    }
                  </p>
                  <div className="flex gap-3">
                    <div className="flex-1 p-3 bg-white/[0.03] rounded border border-white/5">
                       <span className="text-[7px] font-black text-soyuz block mb-1">TOP HAND</span>
                       <p className="text-white font-black text-[8px] uppercase">Control & Feel</p>
                    </div>
                    <div className="flex-1 p-3 bg-white/[0.03] rounded border border-white/5">
                       <span className="text-[7px] font-black text-soyuz block mb-1">MID HAND</span>
                       <p className="text-white font-black text-[8px] uppercase">Power & Torque</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
