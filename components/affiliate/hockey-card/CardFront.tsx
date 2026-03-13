import { motion } from 'framer-motion';
import { useMemo } from 'react';

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
  role: string;
  lotNumber?: number; // Real lot number from DB
  children?: React.ReactNode; // For HolographicOverlay
  studioMode?: boolean; // NEW: Enable dragging for all elements
  positions?: Record<string, { x: number; y: number }>; // NEW: Manual overrides
  styles?: Record<string, any>; // NEW: Scale, font size, etc.
  textOverrides?: Record<string, string>; // NEW: Content overrides
  onPositionChange?: (id: string, pos: { x: number; y: number }) => void; // NEW: Callback
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
  role,
  lotNumber,
  children,
  studioMode = false,
  positions = {},
  styles = {},
  textOverrides = {},
  onPositionChange
}: CardFrontProps) {
  const displaySerial = lotNumber ? lotNumber.toString().padStart(4, '0') : '0000';

  return (
    <div 
      style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
      className="absolute inset-0 w-full h-full rounded-[4px] shadow-2xl overflow-hidden bg-black"
    >
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Dancing+Script:wght@700&family=Great+Vibes&family=Playball&display=swap');
      `}</style>
      {/* 1. BOTTOM LAYER (z-0) */}
      <img 
        src="/assets/hockey-card/Bottom_underimage_soyuztopdeck.png" 
        className="absolute inset-0 w-full h-full object-fill z-0" 
        alt="Bottom frame"
      />

      {/* 2. PHOTO LAYER SANDWICH (z-10) */}
      <div className={`absolute inset-0 z-10 flex items-center justify-center overflow-hidden ${studioMode ? 'pointer-events-none' : ''}`}>
        {(tempPhotoUrl || avatarUrl) ? (
          <motion.div
            drag={editMode || (studioMode && !positions.photo)} // Base drag if no manual pos
            dragMomentum={false}
            style={{ 
              x: positions.photo?.x || photoX, 
              y: positions.photo?.y || photoY, 
              scale: styles.photo?.scale || zoom,
              rotate: styles.photo?.rotate || 0
            }}
            className={`w-full h-full flex items-center justify-center ${studioMode ? 'pointer-events-auto cursor-move' : ''}`}
            onDragEnd={(_, info) => onPositionChange?.('photo', { x: info.offset.x, y: info.offset.y })}
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


      {/* 4. TEXT OVERLAYS - Dan's Design Choice (z-30) */}
      <div className={`absolute inset-0 z-30 ${studioMode ? '' : 'pointer-events-none'} p-6`}>
        
        {/* Top Left: Gold MVP Badge */}
        <motion.div 
          drag={studioMode}
          dragMomentum={false}
          style={{
            scale: styles.mvp?.scale || 1,
            rotate: styles.mvp?.rotate || 0,
            x: positions.mvp?.x || 0,
            y: positions.mvp?.y || 0
          }}
          onDragEnd={(_, info) => onPositionChange?.('mvp', { x: info.offset.x, y: info.offset.y })}
          className={`absolute top-8 left-8 ${studioMode ? 'pointer-events-auto cursor-move border border-dashed border-soyuz/30' : ''}`}
        >
           <span className="text-[12px] font-black italic text-[#FFD700] tracking-widest drop-shadow-[0_2px_5px_rgba(0,0,0,1)]">
              {textOverrides.mvp || 'MVP'}
           </span>
        </motion.div>

        {/* Bottom Area: Name & Rank (Aligned with the 'picot' texture section) */}
        {!studioMode ? (
          <div className="absolute inset-x-0 bottom-4 flex flex-col items-center">
             {/* First Name (Red Signature) */}
             <span 
               className="text-[42px] text-[#FF0000] rotate-[-5deg] translate-y-7 translate-x-[-20px] z-10" 
               style={{ fontFamily: '"Great Vibes", cursive', fontWeight: 900 }}
             >
               {firstName}
             </span>

             {/* Last Name (Bold White Shadowed) */}
             <h2 
               className="text-[46px] text-white font-black uppercase leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,1)]"
               style={{ fontFamily: '"Archivo Black", sans-serif' }}
             >
               {lastName}
             </h2>

             {/* Dynamic Sub-items inside the centered container */}
             <div className="absolute bottom-[2px] left-[6px] z-30 pointer-events-none opacity-100">
                <p className="text-[8px] font-mono font-black text-white tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                   LOT NO. {displaySerial}
                </p>
             </div>

             <div className="absolute bottom-[2px] right-[6px] z-30 pointer-events-none opacity-40">
                <p className="text-[6px] font-black italic text-white tracking-[0.2em] uppercase">
                   AMBASSADOR
                </p>
             </div>
          </div>
        ) : (
          /* STUDIO MODE: Individual absolute items for full dragging freedom */
          <>
            <motion.span 
              drag={studioMode}
              dragMomentum={false}
              style={{
                fontSize: `${styles.firstName?.fontSize || 42}px`,
                scale: styles.firstName?.scale || 1,
                rotate: styles.firstName?.rotate || -5,
                fontFamily: styles.firstName?.fontFamily || '"Great Vibes", cursive', 
                fontWeight: 900,
                x: positions.firstName?.x || 0,
                y: positions.firstName?.y || 0
              }}
              onDragEnd={(_, info) => onPositionChange?.('firstName', { x: info.offset.x, y: info.offset.y })}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[#FF0000] z-10 pointer-events-auto cursor-move border border-dashed border-soyuz/30 select-none" 
            >
              {textOverrides.firstName || firstName}
            </motion.span>

            <motion.h2 
              drag={studioMode}
              dragMomentum={false}
              style={{
                fontSize: `${styles.lastName?.fontSize || 46}px`,
                scale: styles.lastName?.scale || 1,
                rotate: styles.lastName?.rotate || 0,
                fontFamily: styles.lastName?.fontFamily || '"Archivo Black", sans-serif',
                x: positions.lastName?.x || 0,
                y: positions.lastName?.y || 0
              }}
              onDragEnd={(_, info) => onPositionChange?.('lastName', { x: info.offset.x, y: info.offset.y })}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white font-black uppercase leading-none tracking-tighter drop-shadow-[0_4px_12px_rgba(0,0,0,1)] pointer-events-auto cursor-move border border-dashed border-soyuz/30 select-none"
            >
              {textOverrides.lastName || lastName}
            </motion.h2>

            <motion.div 
              drag={studioMode}
              dragMomentum={false}
              style={{
                scale: styles.lotNo?.scale || 1,
                rotate: styles.lotNo?.rotate || 0,
                x: positions.lotNo?.x || 0,
                y: positions.lotNo?.y || 0
              }}
              onDragEnd={(_, info) => onPositionChange?.('lotNo', { x: info.offset.x, y: info.offset.y })}
              className="absolute bottom-2 left-2 z-30 opacity-100 pointer-events-auto cursor-move border border-dashed border-soyuz/30 select-none"
            >
               <p className="text-[8px] font-mono font-black text-white tracking-widest drop-shadow-[0_1px_4px_rgba(0,0,0,1)]">
                  LOT NO. {displaySerial}
               </p>
            </motion.div>

            <motion.div 
              drag={studioMode}
              dragMomentum={false}
              style={{
                scale: styles.ambassador?.scale || 1,
                rotate: styles.ambassador?.rotate || 0,
                x: positions.ambassador?.x || 0,
                y: positions.ambassador?.y || 0
              }}
              onDragEnd={(_, info) => onPositionChange?.('ambassador', { x: info.offset.x, y: info.offset.y })}
              className="absolute bottom-2 right-2 z-30 opacity-40 pointer-events-auto cursor-move border border-dashed border-soyuz/30 select-none"
            >
               <p className="text-[6px] font-black italic text-white tracking-[0.2em] uppercase">
                  {textOverrides.ambassador || 'AMBASSADOR'}
               </p>
            </motion.div>
          </>
        )}
      </div>

      {/* 5. VFX & OTHER OVERLAYS (z-40+) */}
      {children}
    </div>
  );
}
