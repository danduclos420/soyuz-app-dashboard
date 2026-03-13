'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Info, Shield, CheckCircle2, Target } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const KICK_POINTS = [
  {
    id: 'ultra-low',
    title: 'ULTRA-LOW KICK POINT',
    subtitle: 'Lightning Release',
    description: 'Designed for the ultimate deceptive release. The flex occurs at the absolute bottom of the shaft.',
    bestFor: 'Deceptive release, lightning-fast snapshots, and maximum feeling.',
    bendY: 420, // Point near the blade
    glowColor: 'rgba(204, 0, 0, 0.8)'
  },
  {
    id: 'low',
    title: 'LOW KICK POINT',
    subtitle: 'Quick Release',
    description: 'Designed for players who need the puck off the blade as fast as possible. The shaft flexes at the bottom, near the hosel.',
    bestFor: 'Quick snapshots, tight-space plays, and instant release.',
    bendY: 340, // Slightly higher
    glowColor: 'rgba(204, 0, 0, 0.5)'
  },
  {
    id: 'mid',
    title: 'MID KICK POINT',
    subtitle: 'Pure Power',
    description: 'The classic choice for pure power. The shaft flexes in the middle, allowing the player to load more weight.',
    bestFor: 'Power shooters, heavy slap shots, and maximal energy load.',
    bendY: 250, // Center of shaft
    glowColor: 'rgba(255, 255, 255, 0.3)'
  },
  {
    id: 'hybrid',
    title: 'HYBRID KICK POINT',
    subtitle: 'Versatile Load',
    description: 'Adjusts to your hand position. Closer together for quick release, further apart for a mid-kick feel.',
    bestFor: 'Versatile players who need both power and speed.',
    bendY: 300, // Balanced
    glowColor: 'rgba(204, 0, 0, 0.3)'
  }
];

export default function KickPointGuide() {
  const [activeKP, setActiveKP] = useState(KICK_POINTS[0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // SVG Path generation for the flex simulation
  // We'll use a quadratic bezier: M x1 y1 Q cx cy x2 y2
  // Straight: M 200 50 Q 200 250 200 450
  // Bent: M 200 50 Q (200 + deflection) bendY 200 450
  
  const getPath = (deflection: number, bendY: number) => {
    return `M 200 50 Q ${200 + deflection} ${bendY} 200 450`;
  };

  if (!mounted) return <div className="bg-background min-h-screen pt-32 pb-24" />;

  return (
    <div className="bg-background min-h-screen pt-32 pb-24 selection:bg-soyuz selection:text-white overflow-x-hidden">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      
      <div className="soyuz-container relative z-10">
        <BackButton href="/guide" label="BACK TO GUIDES" variant="relative" className="mb-8" />
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* CONTENT SIDE */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
              ENERGY TRANSFER SIMULATOR
            </span>
            <h1 className="text-5xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              KICK <br /><span className="outline-text-white">POINT</span>
            </h1>
            
            <div className="space-y-3 mb-8 lg:mb-12">
              {KICK_POINTS.map((kp) => (
                <motion.div 
                  key={kp.id}
                  onClick={() => setActiveKP(kp)}
                  onMouseEnter={() => setActiveKP(kp)}
                  className={`cursor-pointer p-4 lg:p-6 border-l-2 transition-all duration-500 group relative overflow-hidden ${
                    activeKP.id === kp.id 
                    ? 'bg-white/[0.03] border-soyuz' 
                    : 'bg-transparent border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                       <h3 className={`text-lg lg:text-xl font-display italic tracking-wider transition-colors ${activeKP.id === kp.id ? 'text-white' : 'text-[#444] group-hover:text-[#888]'}`}>
                         {kp.title}
                       </h3>
                       {activeKP.id === kp.id && <Zap size={14} className="text-soyuz animate-pulse" />}
                    </div>
                    <p className={`text-[8px] lg:text-[9px] font-black uppercase tracking-[0.2em] mb-2 transition-colors ${activeKP.id === kp.id ? 'text-soyuz' : 'text-[#333]'}`}>
                      {kp.subtitle}
                    </p>
                    <AnimatePresence mode="wait">
                      {activeKP.id === kp.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-3"
                        >
                          <p className="text-[#AAAAAA] text-[10px] font-medium uppercase tracking-wider leading-relaxed">
                            {kp.description}
                          </p>
                          <div className="pt-3 border-t border-white/5">
                             <span className="text-[7px] font-black text-[#666] uppercase tracking-[0.3em] block mb-1">Performance:</span>
                             <p className="text-white/60 text-[9px] uppercase font-bold tracking-tight">
                               {kp.bestFor}
                             </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* SIMULATOR VISUAL SIDE */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:sticky lg:top-32"
          >
            <div className="bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden aspect-[4/5] flex flex-col items-center justify-center">
               {/* ... (SVG content) ... */}
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
               
               <div className="absolute top-6 left-6 text-[7px] font-black uppercase tracking-[0.4em] text-white/20">
                  Simulation Stage: Active<br />
                  Carbon-X Loading... OK
               </div>
               <div className="absolute bottom-6 right-6 text-right text-[7px] font-black uppercase tracking-[0.4em] text-white/20">
                  Model: SOYUZ PRO ALPHA<br />
                  Efficiency: 98.4%
               </div>

               <div className="relative w-full h-full flex items-center justify-center cursor-pointer"
                    onMouseDown={() => setIsLoaded(true)}
                    onMouseUp={() => setIsLoaded(false)}
                    onTouchStart={() => setIsLoaded(true)}
                    onTouchEnd={() => setIsLoaded(false)}>
                  
                  <svg viewBox="0 0 400 500" className="w-full h-full">
                    <motion.circle 
                      cx="200" 
                      cy={activeKP.bendY} 
                      r="120" 
                      fill={activeKP.glowColor || 'rgba(204, 0, 0, 0.2)'} 
                      className="blur-[60px]"
                      animate={{ 
                        opacity: isLoaded ? 0.6 : 0.2,
                        scale: isLoaded ? 1.2 : 0.8
                      }}
                    />

                    <path 
                      d={getPath(0, activeKP.bendY)}
                      fill="none"
                      stroke="#111"
                      strokeWidth="12"
                      strokeLinecap="round"
                    />
                    <motion.path 
                      initial={{ d: getPath(0, activeKP.bendY) }}
                      d={getPath(isLoaded ? 60 : 0, activeKP.bendY)}
                      fill="none"
                      stroke="url(#stickGradientKP)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      animate={{ 
                        d: getPath(isLoaded ? 60 : 0, activeKP.bendY)
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                    
                    <AnimatePresence>
                      {isLoaded && (
                        <motion.circle 
                          initial={{ opacity: 0, r: 0 }}
                          animate={{ opacity: 1, r: 8 }}
                          exit={{ opacity: 0, r: 0 }}
                          cx={240} 
                          cy={activeKP.bendY} 
                          fill="#CC0000"
                          className="blur-[4px]"
                        />
                      )}
                    </AnimatePresence>

                    <defs>
                      <linearGradient id="stickGradientKP" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#333" />
                        <stop offset="50%" stopColor="#CC0000" />
                        <stop offset="100%" stopColor="#333" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     {!isLoaded && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="bg-black/80 backdrop-blur-md px-4 lg:py-3 py-2 border border-white/10 rounded-full flex items-center gap-3"
                        >
                          <Target size={12} className="text-soyuz" />
                          <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Press to Test Flex</span>
                        </motion.div>
                     )}
                  </div>
               </div>
            </div>

            <div className="mt-8 p-4 lg:p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={18} />
              <div>
                <h4 className="text-[9px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[9px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                   Modern "Liquid Carbon" tech allows SOYUZ sticks to recover faster from flex load, giving you that snappier feel regardless of kick point.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
