'use client';

import { motion } from 'framer-motion';

interface CardFrontProps {
  firstName: string;
  lastName: string;
  rankLabel: string;
  avatarUrl?: string;
  tempPhotoUrl?: string | null;
  photoX: any;
  photoY: any;
  zoom: number;
  editMode: boolean;
  children?: React.ReactNode; // For HolographicOverlay
}

export default function CardFront({
  firstName,
  lastName,
  rankLabel,
  avatarUrl,
  tempPhotoUrl,
  photoX,
  photoY,
  zoom,
  editMode,
  children
}: CardFrontProps) {
  return (
    <div 
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
      className="absolute inset-0 w-full h-full rounded-[4px] shadow-2xl overflow-hidden bg-black"
    >
      {/* 1. BOTTOM LAYER (z-0) */}
      <img 
        src="/assets/hockey-card/Bottom_underimage_soyuztopdeck.png" 
        className="absolute inset-0 w-full h-full object-fill z-0" 
        alt="Bottom frame"
      />

      {/* 2. PHOTO LAYER SANDWICH (z-10) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
        {(tempPhotoUrl || avatarUrl) ? (
          <motion.div
            drag={editMode}
            dragMomentum={false}
            style={{ 
              x: photoX, 
              y: photoY, 
              scale: zoom,
            }}
            className="w-full h-full flex items-center justify-center"
          >
            <img 
              src={tempPhotoUrl || avatarUrl} 
              className="w-full h-full object-cover p-4" 
              draggable={false}
            />
          </motion.div>
        ) : (
          <div className="opacity-10 grayscale">
            <div className="w-40 h-40 border-2 border-white/20 rounded-full flex items-center justify-center">
              <span className="text-white text-4xl">★</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. TOP LAYER OVERLAY (z-20) */}
      <img 
        src="/assets/hockey-card/Top_overimage_soyuztopdeck.png" 
        className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
        alt="Top frame"
      />

      {/* 4. DATA OVERLAYS (Names, Rank) (z-30) */}
      <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 pointer-events-none pb-14">
        <div className="flex flex-col drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
          <div className="flex justify-between items-center mb-1">
            <p className="text-[10px] font-black italic tracking-[0.4em] text-soyuz uppercase">
              {rankLabel}
            </p>
            <p className="text-[10px] font-black italic text-white/40">MVP</p>
          </div>
          <div className="flex items-baseline gap-2 translate-y-[-5px]">
            <span className="text-3xl text-white font-bold" style={{ fontFamily: '"Dancing Script", cursive' }}>
              {firstName}
            </span>
            <h2 className="text-4xl text-white leading-none tracking-tighter" style={{ fontFamily: '"Playball", cursive' }}>
              {lastName}
            </h2>
          </div>
        </div>
      </div>

      {/* 5. VFX & OTHER OVERLAYS (z-40+) */}
      {children}
    </div>
  );
}
