'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Info, Table, CheckCircle2, Target, Eye } from 'lucide-react';
import { useState } from 'react';
import BackButton from '@/components/BackButton';

const CURVE_DATA = [
  { 
    id: 's29',
    pattern: 'S29', 
    subtitle: 'All-Around Performance',
    description: 'Most popular all-around curve. Great for snappers and stick handling.', 
    brandEquiv: 'P92 / P29 / TC2',
    // SVG Path for the blade curve
    // Baseline: M 50 300 L 250 300 Q 350 300 380 250
    path: "M 50 300 L 220 300 Q 320 300 360 220",
    color: "#CC0000"
  },
  { 
    id: 's28',
    pattern: 'S28', 
    subtitle: 'Elite Toe Release',
    description: 'Toe curve for quick release and high shots. Elite choice.', 
    brandEquiv: 'P28 / TC4',
    path: "M 50 300 L 200 300 Q 350 290 380 180",
    color: "#FF3333"
  },
  { 
    id: 's88',
    pattern: 'S88', 
    subtitle: 'Precision Master',
    description: 'Mid-curve with closed face. Excellent for backhands and precision.', 
    brandEquiv: 'P88 / MC',
    path: "M 50 300 L 240 300 Q 330 295 350 260",
    color: "#AA0000"
  },
  { 
    id: 's90tm',
    pattern: 'S90TM', 
    subtitle: 'Defensive Power',
    description: 'Heel curve, open face. Best for defensemen and hard slap shots.', 
    brandEquiv: 'P91',
    path: "M 50 300 Q 150 295 280 280 L 370 240",
    color: "#660000"
  },
];

export default function CurveGuide() {
  const [activeCurve, setActiveCurve] = useState(CURVE_DATA[0]);

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
              BLADE GEOMETRY ANALYZER
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              CURVE <br /><span className="outline-text-white">GUIDE</span>
            </h1>
            
            <div className="space-y-4 mb-12">
              {CURVE_DATA.map((curve) => (
                <div 
                  key={curve.id} 
                  onMouseEnter={() => setActiveCurve(curve)}
                  onClick={() => setActiveCurve(curve)}
                  className={`p-6 border transition-all duration-500 cursor-pointer relative overflow-hidden ${
                    activeCurve.id === curve.id 
                    ? 'bg-white/[0.04] border-soyuz/50 shadow-[0_0_30px_rgba(204,0,0,0.1)]' 
                    : 'bg-white/[0.01] border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <div>
                       <h3 className={`text-3xl font-display italic transition-colors ${activeCurve.id === curve.id ? 'text-soyuz' : 'text-white/40'}`}>
                         {curve.pattern}
                       </h3>
                       <p className={`text-[9px] font-black uppercase tracking-[0.2em] ${activeCurve.id === curve.id ? 'text-white' : 'text-[#444]'}`}>
                         {curve.subtitle}
                       </p>
                    </div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] bg-white/5 px-3 py-1 rounded border border-white/5">
                      Equiv: {curve.brandEquiv}
                    </span>
                  </div>
                  
                  <AnimatePresence mode="wait">
                    {activeCurve.id === curve.id && (
                      <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-[#AAAAAA] text-xs font-medium uppercase tracking-wider leading-relaxed"
                      >
                        {curve.description}
                      </motion.p>
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
            className="sticky top-32"
          >
            <div className="aspect-video bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute inset-0 carbon-texture opacity-10" />
              <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
              
              <div className="absolute top-6 left-6 flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-soyuz animate-ping" />
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-white/40">Pattern Analysis: {activeCurve.pattern}</span>
              </div>

              {/* BLADE SVG */}
              <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-[0_0_15px_rgba(204,0,0,0.2)]">
                <defs>
                   <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                         <feMergeNode in="coloredBlur"/>
                         <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                   </filter>
                </defs>

                {/* Grid Labels */}
                <line x1="50" y1="300" x2="380" y2="300" stroke="white" strokeWidth="1" strokeOpacity="0.05" />
                <text x="50" y="320" fill="white" fillOpacity="0.2" fontSize="8" className="font-black uppercase tracking-[0.2em]">Heel Zone</text>
                <text x="320" y="320" fill="white" fillOpacity="0.2" fontSize="8" className="font-black uppercase tracking-[0.2em]">Toe Zone</text>

                {/* Animated Path */}
                <motion.path 
                  d={activeCurve.path}
                  fill="none"
                  stroke={activeCurve.color}
                  strokeWidth="6"
                  strokeLinecap="round"
                  animate={{ d: activeCurve.path, stroke: activeCurve.color }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  filter="url(#glow)"
                />
                
                {/* Visual Points */}
                <motion.circle 
                  cx="50" cy="300" r="4" fill="white" fillOpacity="0.4"
                />
                <motion.circle 
                  animate={{ 
                    cx: activeCurve.id === 's28' ? 380 : 360, 
                    cy: activeCurve.id === 's28' ? 180 : 220,
                    opacity: [0.4, 0.8, 0.4]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  r="4" fill={activeCurve.color}
                />
              </svg>

              <div className="absolute bottom-6 inset-x-6 flex justify-between items-end">
                 <div className="space-y-1">
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={10} className="text-soyuz" />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Carbon Consistency</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <CheckCircle2 size={10} className="text-soyuz" />
                       <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/40">Reinforced Heel</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[20px] font-display italic text-white/10 uppercase select-none">SOYUZ TECHNICAL</span>
                 </div>
              </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                  If you're unsure, the S29 is the safest choice for most players, offering a balance of all performance aspects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
