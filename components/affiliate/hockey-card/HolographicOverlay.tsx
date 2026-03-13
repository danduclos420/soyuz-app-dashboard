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
      {/* 5. VFX: HOLOGRAPHIC GLITTER (z-40) */}
      <motion.div 
        className="absolute inset-0 z-40 pointer-events-none mix-blend-color-dodge transition-opacity duration-500"
        style={{
          opacity: shineOpacity,
          background: useTransform(
            [shineX, shineY],
            ([sx, sy]) => `
              radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.7) 0%, transparent 50%), 
              linear-gradient(135deg, transparent 25%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.1) 52%, transparent 75%)
            `
          )
        }}
      />
      {/* Dynamic values will be injected via CSS variables for performance if needed, 
          but here we use motion values mapped to style strings in the parent if needed. 
          Actually, let's stick to the cleaner useTransform mapping in the parent and pass them down. */}
      
      {/* 6. VFX: GLITTER NOISE (z-41) */}
      <div className="absolute inset-0 z-41 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
    </>
  );
}
