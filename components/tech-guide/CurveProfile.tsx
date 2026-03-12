'use client';

import { motion } from 'framer-motion';

interface CurveProfileProps {
  curveId: string; // P92, P28, etc.
  active?: boolean;
}

export default function CurveProfile({ curveId, active = false }: CurveProfileProps) {
  // Mock curve paths (top-down view of blade)
  const curves: Record<string, string> = {
    P92: "M 10 50 Q 60 55 110 30",
    P28: "M 10 50 Q 80 60 110 10",
    P88: "M 10 50 Q 60 52 110 45",
    P02: "M 10 50 Q 40 55 110 50",
  };

  return (
    <div className="relative w-full aspect-[2/1] bg-black/20 rounded-2xl border border-white/5 flex flex-col items-center justify-center p-4 overflow-hidden group hover:border-soyuz/30 transition-all">
      <div className="absolute inset-0 carbon-texture opacity-5" />
      
      {/* SVG Container for the curve */}
      <svg viewBox="0 0 120 80" className="w-full h-full drop-shadow-[0_0_8px_rgba(0,225,255,0.2)]">
        {/* Blade Base (Static) */}
        <path 
          d="M 5 50 L 15 50" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="6" 
          strokeLinecap="round" 
        />
        
        {/* The Curve (Dynamic) */}
        <motion.path
          initial={false}
          animate={{ d: curves[curveId] || curves['P92'] }}
          transition={{ type: "spring", stiffness: 80, damping: 15 }}
          fill="none"
          stroke={active ? "#00E5FF" : "rgba(255,255,255,0.4)"}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-colors duration-500"
        />

        {/* Glow Overlay */}
        {active && (
          <motion.path
            initial={false}
            animate={{ d: curves[curveId] || curves['P92'] }}
            fill="none"
            stroke="#00E5FF"
            strokeWidth="8"
            strokeLinecap="round"
            className="opacity-20 blur-sm"
          />
        )}
      </svg>

      <div className="absolute top-3 right-3">
        <span className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-soyuz' : 'text-muted'}`}>
          {curveId} PROFILE
        </span>
      </div>
    </div>
  );
}
