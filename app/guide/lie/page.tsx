'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Target, Info, CheckCircle2, ChevronDown, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const LIE_OPTIONS = [
  { 
    id: 'lie-4-5', 
    label: 'LIE 4 - 5', 
    subtitle: 'Low Stance',
    description: 'Designed for players who skate low to the ice or carry the puck far from their body.',
    angle: 42, // Visual angle in SVG
    indicator: 'heel' // Where tape wears if lie is wrong
  },
  { 
    id: 'lie-6', 
    label: 'LIE 6', 
    subtitle: 'Standard Stance',
    description: 'The gold standard. Fits most heights and stances. Versatile and reliable.',
    angle: 45,
    indicator: 'center'
  },
  { 
    id: 'lie-7', 
    label: 'LIE 7', 
    subtitle: 'Upright Stance',
    description: 'Perfect for players who stand more upright or carry the puck very close to their body.',
    angle: 48,
    indicator: 'toe'
  }
];

export default function LieGuide() {
  const [activeLie, setActiveLie] = useState(LIE_OPTIONS[1]);
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
              BLADE ANGLE CALIBRATOR
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              BLADE <br /><span className="outline-text-white">LIE</span>
            </h1>
            
            <div className="grid grid-cols-1 gap-3 mb-8 lg:mb-12">
              {LIE_OPTIONS.map((lie) => (
                <div 
                  key={lie.id}
                  onClick={() => setActiveLie(lie)}
                  onMouseEnter={() => setActiveLie(lie)}
                  className={`p-4 lg:p-6 border transition-all duration-500 cursor-pointer ${
                    activeLie.id === lie.id ? 'bg-white/[0.04] border-soyuz' : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                     <h3 className={`text-xl lg:text-2xl font-display italic ${activeLie.id === lie.id ? 'text-white' : 'text-white/20'}`}>
                        LIE {lie.label.split(' ')[1]}
                     </h3>
                     {activeLie.id === lie.id && <Target size={14} className="text-soyuz pulse-slow" />}
                  </div>
                  <p className={`text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] mb-4 ${activeLie.id === lie.id ? 'text-soyuz' : 'text-[#333]'}`}>
                    {lie.subtitle}
                  </p>
                  
                  <AnimatePresence mode="wait">
                    {activeLie.id === lie.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="pt-4 border-t border-white/5"
                      >
                         <span className="text-[7px] font-black text-[#555] uppercase tracking-widest block mb-2">Ideal for:</span>
                         <p className="text-[#888888] text-[9px] uppercase font-bold tracking-tight leading-relaxed">
                           {lie.idealFor}
                         </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* VISUALIZER SIDE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="aspect-square bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} />
               
               <div className="absolute top-8 left-8">
                  <div className="flex items-center gap-2 mb-2">
                     <span className="w-2 h-2 rounded-full bg-soyuz shadow-[0_0_10px_#CC0000]" />
                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Contact Surface Optimizer</span>
                  </div>
                  <div className="text-[24px] font-display italic text-white/5 uppercase select-none leading-none">
                     Stance Angle <br />Calibration
                  </div>
               </div>

               {/* BLADE SVG */}
               <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Ice Surface */}
                  <line x1="50" y1="350" x2="350" y2="350" stroke="white" strokeWidth="1" strokeOpacity="0.1" strokeDasharray="4 4" />
                  
                  {/* THE BLADE & SHAFT */}
                  <motion.g 
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 45 - activeLie.angle }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                    style={{ originX: '200px', originY: '350px' }}
                  >
                     {/* Shaft */}
                     <rect x="195" y="50" width="10" height="300" fill="#222" rx="2" />
                     {/* Blade */}
                     <path d="M 200 350 L 320 350 Q 360 350 365 310" fill="none" stroke="#CC0000" strokeWidth="8" strokeLinecap="round" />
                     
                     {/* Tape Glow Indicator */}
                     <motion.circle 
                        initial={{ cx: 260, opacity: 0.2 }}
                        animate={{ 
                          opacity: [0.2, 0.6, 0.2],
                          cx: activeLie.indicator === 'heel' ? 210 : activeLie.indicator === 'center' ? 260 : 310
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        cy="350" r="15" fill="#CC0000" className="blur-[10px]"
                     />
                  </motion.g>

                  {/* Absolute Floor */}
                  <rect x="50" y="350" width="300" height="4" fill="white" fillOpacity="0.05" rx="2" />
               </svg>

               <div className="absolute bottom-8 inset-x-8 flex justify-between">
                  <div>
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block mb-1">Lie Value</span>
                     <span className="text-xl font-display italic text-soyuz leading-none">{activeLie.label.split(' ')[1]}</span>
                  </div>
                  <div className="text-right">
                     <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] block mb-1">Diagnostics</span>
                     <span className="text-xl font-display italic text-white leading-none uppercase">LOCKED</span>
                  </div>
               </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl">
              <div className="flex gap-4 items-start mb-6">
                <Info className="text-soyuz flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                    The lie isn't about quality, it's about matching your skating posture. Lower lies (5) are for speed/lean, higher (6) for upright control.
                  </p>
                </div>
              </div>
              
              <section className="p-6 bg-white/[0.02] border-l border-soyuz/30 rounded-r-xl">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-soyuz shadow-[0_0_10px_#CC0000]" />
                    <h3 className="text-sm font-display text-white italic uppercase tracking-wide">Tape Wear Diagnostic</h3>
                 </div>
                 <p className="text-[#888888] text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                    Wear at the HEEL = lie too LOW. Wear at the TOE = lie too HIGH. Your goal is even wear in the CENTER.
                 </p>
              </section>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
