'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Info, Hand } from 'lucide-react';
import { useState, useEffect } from 'react';
import BackButton from '@/components/BackButton';

const DATA = [
  { 
    id: 'left', 
    label: 'LEFT', 
    subtitle: 'Right Hand Top', 
    description: 'Commonly used when your dominant hand is your right hand. Your right hand stays on top for maximum control.' 
  },
  { 
    id: 'right', 
    label: 'RIGHT', 
    subtitle: 'Left Hand Top', 
    description: 'Commonly used when your dominant hand is your left hand. Your left hand stays on top for maximum control.' 
  },
];

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
      
      <div className="soyuz-container relative z-10 px-4">
        <BackButton href="/guide" label="BACK TO GUIDES" variant="relative" className="mb-8" />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* LEFT: CONTENT & CHOICES */}
          <div className="space-y-8 lg:space-y-12">
            <div>
              <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
                ERGONOMIC ORIENTATION
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
                PLAYER <br /><span className="outline-text-white">SIDE</span>
              </h1>
              <p className="text-[#888888] text-xs sm:text-sm uppercase tracking-widest font-bold max-w-md">
                Left or Right? Find your natural dominant hand and shooting orientation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {DATA.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSide(item.id as 'left' | 'right')}
                  className={`relative p-6 text-left transition-all duration-300 border ${
                    side === item.id 
                      ? 'bg-soyuz/10 border-soyuz shadow-[0_0_30px_rgba(204,0,0,0.2)]' 
                      : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-2xl font-black italic">{item.label}</span>
                    <div className={`p-2 rounded-lg ${side === item.id ? 'bg-soyuz/20 text-soyuz' : 'bg-white/5 text-white/20'}`}>
                      <Hand size={18} className={item.id === 'right' ? 'scale-x-[-1]' : ''} />
                    </div>
                  </div>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest">{item.subtitle}</p>
                </button>
              ))}
            </div>
          </div>

          {/* VISUALIZER SIDE */}
          <div className="lg:sticky lg:top-32 space-y-8">
            <div className="aspect-[4/5] bg-[#050505] border border-white/5 rounded-3xl p-1 relative overflow-hidden flex flex-col items-center justify-center">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
               
               <svg viewBox="0 0 400 600" className="w-full h-full">
                  <defs>
                    <radialGradient id="handGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#CC0000" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#CC0000" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect x="195" y="50" width="10" height="500" fill="#111" rx="2" />
                  <rect x="198" y="50" width="4" height="500" fill="#222" rx="1" />

                  <motion.g
                    animate={{ x: side === 'left' ? -20 : 20 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  >
                    <circle cx="200" cy="80" r="30" fill="url(#handGlow)" className="blur-[10px]" />
                    <rect x="180" y="65" width="40" height="30" fill="#222" rx="15" />
                    <text x="200" y="82" fill="#CC0000" fontSize="8" textAnchor="middle" className="font-black uppercase tracking-widest">TOP</text>
                  </motion.g>

                  <motion.g
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

                  <motion.path 
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
               </div>
            </div>

            <div className="p-6 bg-soyuz/5 border border-soyuz/10 rounded-2xl">
              <div className="flex gap-4 items-start mb-6">
                <Info className="text-soyuz flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">PRO ADVICE</h4>
                  <p className="text-[10px] text-white/60 leading-relaxed uppercase font-bold tracking-tight">
                    {DATA.find(d => d.id === side)?.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
