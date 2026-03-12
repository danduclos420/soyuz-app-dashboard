'use client';

import { motion } from 'framer-motion';

interface AnimatedKickPointProps {
  type: 'low' | 'mid' | 'high';
  active?: boolean;
}

export default function AnimatedKickPoint({ type, active = false }: AnimatedKickPointProps) {
  // Define bend profiles based on kick point type
  const bendProfile = {
    low: { bendY: '80%', curvature: 40 },
    mid: { bendY: '50%', curvature: 35 },
    high: { bendY: '20%', curvature: 30 },
  };

  const current = bendProfile[type];

  return (
    <div className="relative w-24 h-64 bg-black/20 rounded-2xl flex items-center justify-center group cursor-pointer overflow-hidden border border-white/5 hover:border-soyuz/30 transition-colors">
      <div className="absolute inset-0 carbon-texture opacity-5" />
      
      {/* Stick Shaft */}
      <motion.div 
        className="w-1.5 h-48 bg-gradient-to-b from-white/20 via-white/40 to-white/20 rounded-full relative"
        animate={active ? {
          rotate: [0, -2, 0],
          transition: { repeat: Infinity, duration: 2 }
        } : {}}
      >
        {/* The Glow Point */}
        <motion.div 
          initial={false}
          animate={{
            top: current.bendY,
            opacity: active ? 1 : 0.4,
            scale: active ? 1.2 : 1,
            boxShadow: active ? '0 0 15px rgba(0, 225, 255, 0.8)' : '0 0 5px rgba(0, 225, 255, 0.3)'
          }}
          className="absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-soyuz rounded-full border-2 border-white shadow-[0_0_10px_rgba(0,225,255,0.5)] z-10"
        />

        {/* Bend Indicator Line (Animated on hover/active) */}
        <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-48 overflow-visible pointer-events-none">
          <motion.path
            initial={{ d: "M 0 0 L 0 192" }}
            animate={active ? {
              d: type === 'low' 
                ? "M 0 0 L 0 150 Q -15 170 0 192" 
                : type === 'mid'
                ? "M 0 0 L 0 80 Q -15 96 0 192"
                : "M 0 0 Q -15 40 0 192"
            } : { d: "M 0 0 L 0 192" }}
            transition={{ type: "spring", stiffness: 100, damping: 10 }}
            fill="none"
            stroke="rgba(0, 225, 255, 0.3)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
        </svg>
      </motion.div>

      {/* Label */}
      <div className="absolute bottom-4 text-[8px] font-black uppercase tracking-widest text-muted group-hover:text-soyuz transition-colors">
        {type} kick
      </div>
    </div>
  );
}
