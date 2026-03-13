'use client';

import { motion, useTransform } from 'framer-motion';

interface HolographicOverlayProps {
  shineOpacity: any;
  shineX: any;
  shineY: any;
}

export default function HolographicOverlay({
  shineOpacity,
  shineX,
  shineY
}: HolographicOverlayProps) {
  return (
    <>
      {/* 5. VFX: PRISMATIC FOIL SWEEP (z-40) */}
      <motion.div 
        className="absolute inset-0 z-40 pointer-events-none mix-blend-color-dodge transition-opacity duration-700"
        style={{
          opacity: shineOpacity,
          background: useTransform(
            [shineX, shineY],
            ([sx, sy]) => `
              radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.8) 0%, rgba(200,220,255,0.2) 30%, transparent 60%),
              linear-gradient(${sx}deg, transparent 20%, rgba(255,0,255,0.1) 40%, rgba(0,255,255,0.15) 50%, rgba(255,255,0,0.1) 60%, transparent 80%)
            `
          )
        }}
      />
      
      {/* 6. VFX: ELITE GLITTER SPARKLE (z-41) */}
      <motion.div 
        className="absolute inset-0 z-41 pointer-events-none mix-blend-screen opacity-[0.1]"
        style={{
          background: "url('https://www.transparenttextures.com/patterns/stardust.png')",
          backgroundSize: "200px 200px",
          maskImage: useTransform(shineOpacity, [0, 1], ["radial-gradient(circle, transparent, transparent)", "radial-gradient(circle, black, transparent)"])
        }}
      />
    </>
  );
}
