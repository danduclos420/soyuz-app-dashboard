'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, ShoppingBag, Calendar, Download, Crown, Camera, Zap, Check, X, RotateCcw, Maximize2, TrendingUp } from 'lucide-react';
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
  
  // Photo Edit State
  const [zoom, setZoom] = useState(1);
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);

  // Mouse Tracking for Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });
  
  // Tilt Transform
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  // Holographic Shine Transform
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);

  // Reset tilt on exit or flip
  useEffect(() => {
    if (isFlipped || editMode) {
      x.set(0);
      y.set(0);
    }
  }, [isFlipped, editMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || isFlipped || editMode || isDownloading) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleInternalDownload = async () => {
    if (!photoRef.current) return;
    setIsDownloading(true);
    try {
      if (onDownload) {
        onDownload();
      } else {
        const dataUrl = await toPng(photoRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `soyuz-card-${user.full_name.toLowerCase().replace(/\s+/g, '-')}.png`;
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
    if (rank === 'mvp') return 'SOYUZ AMBASSADOR';
    if (user.role === 'admin') return 'SOYUZ AMBASSADOR';
    if (user.role === 'affiliate') return 'SOYUZ AFFILIATE';
    return 'SOYUZ CUSTOMER';
  };

  const firstName = user.full_name.split(' ')[0] || 'Dany';
  const lastName = user.full_name.split(' ').slice(1).join(' ') || 'Lacoursière';

  return (
    <div className={`relative flex flex-col items-center justify-center p-4 transition-all duration-700 ${editMode ? 'scale-110' : ''}`}>
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
            className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[80]"
          />
        )}
      </AnimatePresence>

      {/* PERSPECTIVE WRAPPER */}
      <div 
        style={{ perspective: '2000px' }}
        className={`relative w-[340px] h-[470px] ${editMode ? 'z-[100]' : 'z-0'}`}
      >
        {/* FLIP CONTAINER (Handles the 180-deg flip) */}
        <motion.div
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
           className="w-full h-full relative"
           style={{ transformStyle: 'preserve-3d' }}
        >
          {/* TILT CONTAINER (Handles the mouse hover tilt) */}
          <motion.div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={() => !editMode && !isDownloading && setIsFlipped(!isFlipped)}
            style={{ 
              transformStyle: 'preserve-3d',
              rotateX: editMode ? 0 : rotateX,
              rotateY: editMode ? 0 : rotateY
            }}
            className="w-full h-full relative"
          >
            {/* FRONT FACE (Recto) */}
            <div 
              style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
              className="absolute inset-0 w-full h-full rounded-[4px] shadow-2xl overflow-hidden bg-black"
            >
              {/* PHOTO BOX (Ref for download) */}
              <div 
                ref={photoRef}
                className="absolute inset-0 w-full h-full overflow-hidden"
              >
                {/* BOTTOM LAYER */}
                <img 
                  src="/assets/hockey-card/Bottom_underimage_soyuztopdeck.png" 
                  className="absolute inset-0 w-full h-full object-fill z-0" 
                  alt="Bottom frame"
                />

                {/* USER IMAGE */}
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
                      <Star size={160} className="text-white" />
                    </div>
                  )}
                </div>

                {/* TOP LAYER (Frame with hole) */}
                <img 
                  src="/assets/hockey-card/Top_overimage_soyuztopdeck.png" 
                  className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
                  alt="Top frame"
                />

                {/* TEXT CONTENT */}
                <div className="absolute inset-0 z-30 flex flex-col justify-end p-8 pointer-events-none pb-12">
                   <div className="flex flex-col drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
                      <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-black italic tracking-[0.4em] text-soyuz uppercase italic">
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

                {/* HOLOGRAPHIC GLITTER VFX */}
                <motion.div 
                   className="absolute inset-0 z-40 pointer-events-none opacity-30 mix-blend-color-dodge transition-opacity duration-500"
                   style={{
                     background: useTransform(
                       [shineX, shineY],
                       ([sx, sy]) => `radial-gradient(circle at ${sx}% ${sy}%, rgba(255,255,255,0.6) 0%, transparent 50%), 
                                   linear-gradient(${sx}deg, transparent 20%, rgba(255,255,255,0.2) 50%, transparent 80%)`
                     )
                   }}
                />
                <div className="absolute inset-0 z-41 pointer-events-none opacity-[0.05] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay" />
              </div>

              {/* EDIT MODE TOOLS (Z-100) */}
              <AnimatePresence>
                {editMode && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute inset-x-0 -top-24 z-[100] bg-[#0A0A0A] border border-soyuz/20 p-8 flex flex-col items-center gap-6 rounded-2xl shadow-[0_30px_100px_rgba(255,0,0,0.2)]"
                    style={{ transform: 'translateZ(100px)' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex flex-col items-center gap-2">
                       <div className="flex items-center gap-2">
                          <Camera size={16} className="text-soyuz" />
                          <p className="text-[12px] font-black italic text-white tracking-[0.4em] uppercase">OPTIMISATION LOOK</p>
                       </div>
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
                          className="flex-1 accent-soyuz h-1"
                       />
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
                          className="flex-3 flex items-center justify-center gap-3 px-10 py-4 bg-soyuz text-black rounded-full text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white transition-all shadow-[0_0_40px_rgba(255,0,0,0.4)]"
                       >
                          <Check size={16} /> CONFIRMER
                       </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* BACK FACE (Verso) */}
            <div 
              style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
              className="absolute inset-0 w-full h-full rounded-[4px] bg-[#0A0A0A] border border-white/5 shadow-2xl overflow-hidden flex flex-col p-6 text-white"
            >
               <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-soyuz/10 border border-soyuz/20 rounded-full flex items-center justify-center p-2">
                        <img src="/logo.png" className="w-full h-full object-contain invert opacity-60" />
                     </div>
                     <div>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-tight text-white">SOYUZ CARD</p>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">ANALYTICS COMMANDER</p>
                     </div>
                  </div>
                  <div className="px-3 py-1 bg-soyuz/10 border border-soyuz/20 rounded-full text-[8px] font-mono text-soyuz">
                     ID: {user.affiliate_code || 'UNSYNCED'}
                  </div>
               </div>

               <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-white/5 border border-white/5 rounded-lg flex flex-col justify-center">
                        <p className="text-[8px] font-black text-white/30 tracking-widest uppercase mb-1">VENTES</p>
                        <p className="text-xl font-display italic font-black">${(stats.total_sales || 0).toLocaleString()}</p>
                     </div>
                     <div className="p-4 bg-white/5 border border-white/5 rounded-lg flex flex-col justify-center">
                        <p className="text-[8px] font-black text-white/30 tracking-widest uppercase mb-1">POINTS</p>
                        <p className="text-xl font-display italic font-black text-soyuz">{stats.points || 0}</p>
                     </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-lg">
                     <div className="flex justify-between items-center mb-2">
                        <p className="text-[8px] font-black text-white/30 tracking-widest uppercase">NODE SYNC PROGRESS</p>
                        <span className="text-[8px] text-soyuz font-black">LEGENDARY TIER</span>
                     </div>
                     <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '75%' }}
                          className="h-full bg-soyuz shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                        />
                     </div>
                  </div>
               </div>

               <div className="mt-auto border-t border-white/10 pt-6 flex justify-between items-center">
                  <div>
                     <p className="text-[8px] font-black text-white/20 tracking-[0.4em] uppercase mb-1">ENCRYPTED DATA 2026</p>
                     <p className="text-[12px] font-mono text-white/40">{lastName.toUpperCase()} // NODE-01</p>
                  </div>
                  <div className="flex gap-2">
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-40"><Target size={14} /></div>
                     <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center opacity-40 text-soyuz"><Trophy size={14} /></div>
                  </div>
               </div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* FOOTER CONTROLS */}
      <div className="flex flex-col items-center gap-4 relative z-[50]">
        <div className="flex gap-4">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              fileInputRef.current?.click();
            }} 
            className="flex items-center gap-3 px-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz/60 transition-all group"
            disabled={isDownloading}
          >
            <Camera size={18} className="text-soyuz/40 group-hover:text-soyuz transition-colors" /> PHOTO
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleInternalDownload(); }} 
            className={`flex items-center gap-3 px-8 py-5 bg-white/[0.02] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz/60 transition-all ${isDownloading ? 'animate-pulse text-soyuz' : ''}`}
            disabled={isDownloading}
          >
            <Download size={18} className={isDownloading ? 'animate-bounce' : 'text-soyuz/40'} /> 
            {isDownloading ? 'EXPORTATION...' : 'TÉLÉCHARGER'}
          </button>
        </div>
        <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] italic text-center max-w-[320px]">
          <span className="text-soyuz/40">PRO-TIP:</span> UTILISEZ UN PNG TRANSPARENT POUR LE MEILLEUR RENDU.
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
              e.target.value = ''; // Reset for same file selection
            }
          }}
        />
      </div>
    </div>
  );
}

function StatBlock({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] p-3 rounded-lg border border-white/5 flex flex-col justify-center min-h-[50px]">
       <div className="flex items-center gap-1.5 mb-1 text-soyuz/40 min-w-0">
          <span className="shrink-0">{icon}</span>
          <span className="text-[6px] font-black tracking-widest uppercase opacity-30 truncate">{label}</span>
       </div>
       <div className="text-sm font-display italic font-black text-white leading-none tracking-tighter truncate">{value}</div>
    </div>
  );
}
