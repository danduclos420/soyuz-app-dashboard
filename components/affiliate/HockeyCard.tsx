'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, Download, Camera, Check, X, RotateCcw, Maximize2 } from 'lucide-react';
import { toPng } from 'html-to-image';

interface PhotoSettings {
  x: number;
  y: number;
  scale: number;
}

interface HockeyCardProps {
  user: {
    full_name: string;
    avatar_url?: string;
    role: 'admin' | 'affiliate' | 'customer';
    affiliate_code?: string;
    created_at: string;
  };
  stats: {
    total_sales?: number;
    monthly_sales?: number;
    points?: number;
    commissions?: number;
    purchase_count?: number;
    total_spent?: number;
    favorite_product?: string;
    network_revenue?: number;
    active_affiliates?: number;
  };
  rank?: 'agent' | 'pro' | 'elite' | 'legend' | 'mvp';
  editMode?: boolean;
  tempPhotoUrl?: string | null;
  onDownload?: () => void;
  onPhotoSelected?: (dataUrl: string) => void;
  onSaveEdit?: (settings: PhotoSettings) => void;
  onCancelEdit?: () => void;
}

export default function HockeyCard({ 
  user, 
  stats, 
  rank = 'agent', 
  editMode = false,
  tempPhotoUrl,
  onDownload, 
  onPhotoSelected,
  onSaveEdit,
  onCancelEdit
}: HockeyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Photo Edit State - Initialized from props or default
  const [zoom, setZoom] = useState(1);
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);

  // Motion Values for Mouse Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  // Smooth springs for tilt
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);
  
  // Tilt Transform (Recto only)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  // Holographic Shine Transform
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const shineOpacity = useTransform(mouseXSpring, (v) => Math.abs(v) * 2 + 0.1);

  // Reset to front and clear tilt when entering edit mode
  useEffect(() => {
    if (editMode) {
      setIsFlipped(false);
      x.set(0);
      y.set(0);
    }
  }, [editMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Disable tilt during edit, flip or download for precision
    if (editMode || isFlipped || isDownloading || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleInternalDownload = async () => {
    if (!photoRef.current) return;
    setIsDownloading(true);
    // Force reset tilt for clean capture
    x.set(0);
    y.set(0);
    
    try {
      if (onDownload) {
        onDownload();
      } else {
        const dataUrl = await toPng(photoRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `SOYUZ_CARD_${user.full_name.toUpperCase().replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentRankLabel = () => {
    if (rank === 'mvp' || user.role === 'admin') return 'SOYUZ AMBASSADOR';
    if (user.role === 'affiliate') return 'SOYUZ AFFILIATE';
    return 'SOYUZ CUSTOMER';
  };

  const firstName = user.full_name.split(' ')[0] || 'Dany';
  const lastName = user.full_name.split(' ').slice(1).join(' ') || 'Lacoursière';

  return (
    <div className={`flex flex-col items-center gap-12 transition-all duration-700 ${editMode ? 'scale-105' : ''}`}>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Playball&display=swap');
      `}</style>

      {/* BACKDROP FOR EDIT MODE */}
      <AnimatePresence>
        {editMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-3xl z-[80]"
          />
        )}
      </AnimatePresence>

      {/* PERSPECTIVE WRAPPER (Critical for 3D) */}
      <div 
        className={`relative w-[340px] h-[470px] ${editMode ? 'z-[100]' : 'z-0'}`}
        style={{ perspective: '2000px' }}
      >
        {/* MASTER FLIP ELEMENT (Handles the 180 flip state) */}
        <motion.div
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "spring", stiffness: 80, damping: 18 }}
           className="w-full h-full relative pointer-events-auto"
           style={{ transformStyle: 'preserve-3d' }}
        >
           {/* RECTO CONTAINER (Front face - also handles mouse tilt) */}
           <motion.div 
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => { x.set(0); y.set(0); }}
              onClick={(e) => {
                if (!editMode && !isDownloading) {
                  e.stopPropagation();
                  setIsFlipped(true);
                }
              }}
              className="absolute inset-0 w-full h-full rounded-[4px] shadow-2xl cursor-pointer"
              style={{ 
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d',
                rotateX: editMode ? 0 : rotateX,
                rotateY: editMode ? 0 : rotateY
              }}
           >
              {/* PHOTO BOX (Actual card visual) */}
              <div 
                ref={photoRef}
                className="absolute inset-0 w-full h-full rounded-[4px] overflow-hidden bg-black"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* 1. BACKGROUND LAYER (Beneath user photo) */}
                <img 
                  src="/assets/hockey-card/Bottom_underimage_soyuztopdeck.png" 
                  className="absolute inset-0 w-full h-full object-fill z-0" 
                  alt="Backdrop"
                />

                {/* 2. USER PHOTO LAYER */}
                <div className="absolute inset-0 z-10 flex items-center justify-center overflow-hidden">
                  {(tempPhotoUrl || user.avatar_url) ? (
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
                        src={tempPhotoUrl || user.avatar_url} 
                        className="w-full h-full object-cover p-2" 
                        draggable={false}
                      />
                    </motion.div>
                  ) : (
                    <div className="opacity-10 grayscale">
                      <Star size={140} className="text-white" />
                    </div>
                  )}
                </div>

                {/* 3. FOREGROUND LAYER (Frame with transparency for photo) */}
                <img 
                  src="/assets/hockey-card/Top_overimage_soyuztopdeck.png" 
                  className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
                  alt="Card Frame"
                />

                {/* 4. TEXT CONTENT OVERLAYS */}
                <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 pointer-events-none pb-14">
                   <div className="flex flex-col drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black italic tracking-[0.4em] text-soyuz uppercase">
                           {currentRankLabel()}
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

                {/* 5. VFX: HOLOGRAPHIC GLITTER SHINE */}
                <motion.div 
                   className="absolute inset-0 z-40 pointer-events-none mix-blend-color-dodge transition-opacity duration-300"
                   style={{
                     opacity: shineOpacity,
                     background: useTransform(
                       [shineX, shineY],
                       ([sx, sy]) => `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.7) 0%, transparent 45%), 
                                   linear-gradient(${sx}deg, transparent 20%, rgba(255,255,255,0.1) 48%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.1) 52%, transparent 80%)`
                     )
                   }}
                />
                {/* 6. VFX: GLITTER NOISE */}
                <div className="absolute inset-0 z-41 pointer-events-none opacity-[0.04] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
              </div>

              {/* EDIT TOOLS (Appears ONLY in editMode) */}
              <AnimatePresence>
                {editMode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="absolute inset-x-4 -top-32 z-[100] bg-[#0A0A0A] border border-soyuz/30 p-8 flex flex-col items-center gap-6 rounded-3xl shadow-[0_40px_100px_rgba(255,0,0,0.3)] pointer-events-auto"
                    style={{ transform: 'translateZ(120px)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-1">
                        <div className="flex items-center gap-2">
                           <Camera size={18} className="text-soyuz animate-pulse" />
                           <p className="text-[14px] font-black italic text-white tracking-[0.5em] uppercase">POSITIONNEMENT</p>
                        </div>
                        <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">DÉPLACEZ ET ZOOMEZ VOTRE IMAGE</p>
                    </div>
                    
                    <div className="flex items-center gap-4 w-full px-2">
                       <Maximize2 size={12} className="text-white/20" />
                       <input 
                          type="range" 
                          min="0.5" 
                          max="3" 
                          step="0.01" 
                          value={zoom} 
                          onChange={(e) => setZoom(parseFloat(e.target.value))}
                          className="flex-1 accent-soyuz h-1 bg-white/5 rounded-full"
                       />
                       <span className="text-[10px] font-mono text-soyuz w-8">{zoom.toFixed(1)}x</span>
                    </div>

                    <div className="flex gap-4 w-full">
                       <button 
                          onClick={(e) => { e.stopPropagation(); onCancelEdit?.(); }}
                          className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all underline underline-offset-4"
                       >
                          ANNULER
                       </button>
                       <button 
                          onClick={(e) => { 
                             e.stopPropagation(); 
                             onSaveEdit?.({ x: photoX.get(), y: photoY.get(), scale: zoom }); 
                          }}
                          className="flex-3 flex items-center justify-center gap-3 px-10 py-5 bg-soyuz text-black rounded-full text-[12px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,0,0,0.5)]"
                       >
                          <Check size={18} /> CONFIRMER
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
           </motion.div>

           {/* VERSO CONTAINER (Back face) */}
           <motion.div 
              onClick={(e) => {
                if (!isDownloading) {
                  e.stopPropagation();
                  setIsFlipped(false);
                }
              }}
              className="absolute inset-0 w-full h-full rounded-[4px] bg-[#0A0A0A] border border-white/5 shadow-2xl overflow-hidden flex flex-col p-6 text-white cursor-pointer"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                transformStyle: 'preserve-3d'
              }}
           >
              {/* Back side content... (Simplified for stability) */}
              <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-soyuz/10 border border-soyuz/20 rounded-full flex items-center justify-center p-2">
                        <img src="/logo.png" className="w-full h-full object-contain invert opacity-60" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-tight text-white">SOYUZ CARD</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">CERTIFIED ANALYTICS</p>
                     </div>
                  </div>
                  <div className="px-3 py-1 bg-soyuz/10 border border-soyuz/20 rounded-full text-[8px] font-mono text-soyuz">
                     ID: {user.affiliate_code || 'UNASSIGNED'}
                  </div>
              </div>

              <div className="space-y-8 flex-1">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center">
                       <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-1">TOTAL SALES</p>
                       <p className="text-xl font-display italic font-black text-white">${(stats.total_sales || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-center">
                       <p className="text-[8px] font-black text-white/20 tracking-widest uppercase mb-1">POINTS</p>
                       <p className="text-xl font-display italic font-black text-soyuz">{stats.points || 0}</p>
                    </div>
                 </div>

                 <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                       <p className="text-[8px] font-black text-white/20 tracking-widest uppercase">DEPLOYMENT SYNC</p>
                       <span className="text-[8px] text-soyuz font-black">STABLE</span>
                    </div>
                    <div className="h-1 w-full bg-black/50 rounded-full overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '85%' }}
                         className="h-full bg-soyuz shadow-[0_0_10px_rgba(255,0,0,0.5)]"
                       />
                    </div>
                 </div>
              </div>

              <div className="mt-auto border-t border-white/10 pt-6 flex justify-between items-center opacity-40 grayscale">
                  <div>
                     <p className="text-[7px] font-black tracking-[0.4em] uppercase mb-1">ENCRYPTED // COMMAND</p>
                     <p className="text-[10px] font-mono">{user.full_name.toUpperCase()}</p>
                  </div>
                  <div className="flex gap-2">
                     <Target size={14} />
                     <Trophy size={14} className="text-soyuz" />
                  </div>
              </div>
           </motion.div>
        </motion.div>
      </div>

      {/* EXTERNAL ACTION BUTTONS */}
      <div className="flex flex-col items-center gap-4 relative z-50">
        <div className="flex gap-4">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              fileInputRef.current?.click();
            }} 
            className="flex items-center gap-3 px-10 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:border-soyuz/60 transition-all group"
            disabled={isDownloading}
          >
            <Camera size={18} className="text-soyuz group-hover:scale-110 transition-transform" /> PHOTO
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleInternalDownload(); }} 
            className={`flex items-center gap-3 px-10 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/30 hover:text-white hover:border-soyuz/60 transition-all ${isDownloading ? 'animate-pulse text-soyuz' : ''}`}
            disabled={isDownloading}
          >
            <Download size={18} className={isDownloading ? 'animate-bounce' : 'text-soyuz'} /> 
            {isDownloading ? 'PROCESSING...' : 'TÉLÉCHARGER'}
          </button>
        </div>
        <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] italic text-center max-w-[320px]">
          TAP TO FLIP • HOVER TO TILT • PHOTO TO EDIT
        </p>

        {/* HIDDEN FILE INPUT */}
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = () => {
                if (onPhotoSelected) {
                  onPhotoSelected(reader.result as string);
                }
              };
              reader.readAsDataURL(file);
              e.target.value = ''; // Reset for re-selection
            }
          }}
        />
      </div>
    </div>
  );
}
