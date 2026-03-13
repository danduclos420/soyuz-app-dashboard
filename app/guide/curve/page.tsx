'use client';

import { motion } from 'framer-motion';
import { Activity, Info, Table, CheckCircle2 } from 'lucide-react';
import BackButton from '@/components/BackButton';

const CURVE_DATA = [
  { pattern: 'S92', description: 'Most popular all-around curve. Great for snappers and stick handling.', brandEquiv: 'P92 / P29 / TC2' },
  { pattern: 'S28', description: 'Toe curve for quick release and high shots. Elite choice.', brandEquiv: 'P28 / TC4' },
  { pattern: 'S88', description: 'Mid-curve with closed face. Excellent for backhands and precision.', brandEquiv: 'P88 / MC' },
  { pattern: 'S91', description: 'Heel curve, open face. Best for defensemen and hard slap shots.', brandEquiv: 'P91' },
];

export default function CurveGuide() {
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
              BLADE PATTERNS
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
              CURVE <br /><span className="outline-text-white">GUIDE</span>
            </h1>
            <p className="text-[#888888] font-bold uppercase tracking-widest text-sm mb-12 leading-relaxed">
              The curve of your blade significantly impacts your shot accuracy, power, and puck control. Find the pattern that complements your playstyle.
            </p>

            <div className="space-y-6">
              {CURVE_DATA.map((curve) => (
                <div key={curve.pattern} className="p-6 bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-display text-soyuz italic">{curve.pattern}</h3>
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-widest bg-white/5 px-3 py-1 rounded">Equivalent: {curve.brandEquiv}</span>
                  </div>
                  <p className="text-[#AAAAAA] text-xs font-medium uppercase tracking-wider leading-relaxed">
                    {curve.description}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="sticky top-32"
          >
            <div className="aspect-square bg-white/[0.02] border border-white/5 rounded-3xl p-12 relative overflow-hidden flex flex-col items-center justify-center text-center">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <Activity className="w-32 h-32 text-soyuz/20 mb-8" />
              <h3 className="text-xl font-display mb-4 italic">TECHNICAL VISUALIZER</h3>
              <p className="text-[#666666] text-xs uppercase tracking-[0.2em] font-black mb-8">Coming Soon: Interactive 3D Modeler</p>
              
              <div className="w-full space-y-4 text-left">
                {[
                  "Optimized Carbon Layup",
                  "Double Reinforced Heel",
                  "Vibration Dampening Core",
                  "Micro-Grip Texture Surface"
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-3 py-2 border-b border-white/5">
                    <CheckCircle2 size={14} className="text-soyuz" />
                    <span className="text-[10px] font-black text-white/60 tracking-widest uppercase">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl flex gap-4 items-start">
              <Info className="text-soyuz flex-shrink-0" size={20} />
              <div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                  If you're unsure, the S92 is the safest choice for most players, offering a balance of all performance aspects.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
