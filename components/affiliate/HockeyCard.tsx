'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, ShoppingBag, Calendar, Download, Crown, Camera, Zap, Check, X, RotateCcw, Maximize2 } from 'lucide-react';
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
  const [localEditMode, setLocalEditMode] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Sync isFlipped if we enter edit mode
  useEffect(() => {
    if (editMode && isFlipped) {
      setIsFlipped(false);
    }
  }, [editMode, isFlipped]);
  
  // Photo Edit State
  const [zoom, setZoom] = useState(1);
  const photoX = useMotionValue(0);
  const photoY = useMotionValue(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Mouse Tracking State
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || isDownloading || editMode || isFlipped) {
      x.set(0);
      y.set(0);
      return;
    }
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleInternalDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    x.set(0);
    y.set(0);

    try {
      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: 'transparent'
      });
      const link = document.createElement('a');
      link.download = `SOYUZ-${isFlipped ? 'BACK' : 'FRONT'}-${user.full_name.toUpperCase()}.png`;
      link.href = dataUrl;
      link.click();
      onDownload?.();
    } catch (err) {
      console.error('Download failed', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const firstName = (user.role === 'admin' || rank === 'mvp') ? 'Dany' : user.full_name.split(' ')[0];
  const lastName = (user.role === 'admin' || rank === 'mvp') ? 'Lacoursière' : user.full_name.split(' ').slice(1).join(' ');

  const getRankTheme = () => {
    const isAdmin = user.role === 'admin' || rank === 'mvp';
    if (isAdmin) return { accent: 'text-yellow-500' };
    if (rank === 'legend') return { accent: 'text-red-500' };
    if (rank === 'elite') return { accent: 'text-zinc-200' };
    return { accent: 'text-white/40' };
  };

  const theme = getRankTheme();

  return (
    <div className={`flex flex-col items-center transition-all duration-700 ${editMode ? 'gap-24' : 'gap-12'}`}>
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
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[90] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className={`relative w-[340px] h-[470px] perspective-2000 cursor-pointer group select-none transition-all duration-700 ${editMode ? 'z-[100] scale-[1.15]' : 'z-0'}`}
        onClick={() => {
          if (!isDownloading && !editMode) {
            setIsFlipped(!isFlipped);
          }
        }}
      >
        <motion.div
           className="w-full h-full relative"
           initial={false}
           animate={{ 
             rotateY: isFlipped ? 180 : rotateY.get(),
             rotateX: isFlipped ? 0 : rotateX.get()
           }}
           style={{ 
              transformStyle: 'preserve-3d'
           }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          {/* OPAQUE CORE */}
          <div className="absolute inset-0 bg-black z-0 rounded-[4px]" style={{ transform: 'translateZ(-1px)' }} />

          {/* FRONT SIDE (Recto - Soyuz Top Deck Custom Assets) */}
          <div 
            className="absolute inset-0 rounded-[4px] overflow-hidden bg-[#050505] flex flex-col"
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
          >
            {/* LAYER 1: BOTTOM ASSET (Under Photo) */}
            <img 
               src="/assets/hockey-card/Bottom_underimage_soyuztopdeck.png" 
               className="absolute inset-0 w-full h-full object-fill z-0" 
               alt="Background"
            />

            {/* LAYER 2: USER PHOTO (Draggable if editing) */}
            <div className={`absolute inset-0 z-10 flex items-center justify-center ${editMode ? 'cursor-move' : 'pointer-events-none'}`}>
               <motion.div
                 ref={photoRef}
                 drag={editMode}
                 dragMomentum={false}
                 style={{ 
                    x: photoX, 
                    y: photoY, 
                    scale: zoom,
                    touchAction: 'none'
                 }}
                 className="w-full h-full flex items-center justify-center"
               >
                  {tempPhotoUrl || user.avatar_url ? (
                    <img 
                       src={tempPhotoUrl || user.avatar_url} 
                       className="w-full h-full object-cover contrast-[1.1] brightness-[1.1]" 
                       draggable={false}
                    />
                  ) : (
                    <Star size={120} className="text-white/5" />
                  )}
               </motion.div>
            </div>

            {/* LAYER 3: TOP ASSET (Over Photo) */}
            <img 
               src="/assets/hockey-card/Top_overimage_soyuztopdeck.png" 
               className="absolute inset-0 w-full h-full object-fill z-20 pointer-events-none" 
               alt="Overlay"
            />

            {/* EDIT TOOLS OVERLAY */}
            {editMode && (
               <div 
                className="absolute inset-x-0 top-0 z-50 bg-black/95 backdrop-blur-2xl p-6 flex flex-col items-center gap-5 rounded-t-[4px] border-b border-soyuz/20"
                style={{ transform: 'translateZ(60px)' }}
               >
                  <div className="flex flex-col items-center gap-2 mb-2">
                     <p className="text-[10px] font-black italic text-soyuz tracking-[0.4em] uppercase">MODE AJUSTEMENT</p>
                     <p className="text-[8px] text-white/40 uppercase tracking-widest whitespace-nowrap">DÉPLACEZ ET ZOOMEZ VOTRE PHOTO</p>
                  </div>
                  <div className="flex items-center gap-4 w-full px-2">
                     <Maximize2 size={12} className="text-white/40" />
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
                  <div className="flex gap-4">
                     <button 
                        onClick={(e) => { e.stopPropagation(); onCancelEdit?.(); }}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-[8px] font-bold uppercase tracking-widest text-white/60 hover:text-white transition-all"
                     >
                        <X size={12} /> ANNULER
                     </button>
                     <button 
                        onClick={(e) => { 
                           e.stopPropagation(); 
                           onSaveEdit?.({ x: photoX.get(), y: photoY.get(), scale: zoom }); 
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-soyuz border border-soyuz text-black rounded-full text-[9px] font-black uppercase tracking-[0.2em] hover:bg-white hover:border-white transition-all shadow-[0_0_30px_rgba(255,0,0,0.3)]"
                     >
                        <Check size={14} /> ENREGISTRER
                     </button>
                  </div>
               </div>
            )}

            {/* LAYER 4: DYNAMIC TEXT Overlays */}
            <div className="absolute inset-x-0 bottom-0 z-30 h-32 flex flex-col justify-end px-8 pb-6">
                <div className="flex flex-col w-full">
                     {/* Role & Rank */}
                     <div className="flex justify-between items-end mb-1">
                        <p className={`text-[10px] font-black italic tracking-[0.4em] uppercase ${theme.accent} opacity-90 drop-shadow-md`}>
                           {user.role === 'admin' ? 'SOYUZ AMBASSADOR' : 
                            user.role === 'affiliate' ? 'SOYUZ AFFILIATE' : 
                            'SOYUZ CUSTOMER'}
                        </p>
                        <div className="flex flex-col items-end">
                           <span className="text-[12px] font-black italic text-white/60 leading-none drop-shadow-md">{rank.toUpperCase()}</span>
                        </div>
                     </div>
                     
                     {/* Name Script */}
                     <div className="flex items-baseline gap-2 overflow-hidden drop-shadow-[0_2px_10px_rgba(0,0,0,1)]">
                        <span className="text-2xl text-white font-bold" style={{ fontFamily: '"Dancing Script", cursive' }}>
                           {firstName}
                        </span>
                        <h2 className="text-4xl text-white leading-none tracking-tighter" 
                            style={{ fontFamily: '"Playball", cursive' }}>
                           {lastName}
                        </h2>
                     </div>
                </div>
            </div>

            {/* Holographic Layer (Conditional) */}
            {rank !== 'agent' && (
              <div className="absolute inset-0 pointer-events-none z-40 mix-blend-color-dodge opacity-20 overflow-hidden">
                <motion.div 
                  className="absolute inset-[-150%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.4)_50%,transparent_55%)]"
                  animate={{ x: ['-100%', '100%'], y: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>

          {/* BACK SIDE (Advanced Nodal Report) */}
          <div 
            className="absolute inset-0 rounded-[4px] overflow-hidden border-[1px] border-white/5 bg-[#080808] rotate-y-180 flex flex-col shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
          >
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/subtle-carbon.png')] pointer-events-none" />
             
             <div className="h-full flex flex-col p-5 text-white relative z-10">
                <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-3 uppercase overflow-hidden">
                   <div className="flex items-center gap-3">
                      <p className="text-xl font-black text-soyuz italic tracking-tighter">#001</p>
                      <div className="h-6 w-[1px] bg-white/10" />
                      <div className="max-w-[120px]">
                         <p className="text-[7px] font-black tracking-[0.4em] text-white/40 mb-0.5">NODE-ID</p>
                         <p className="text-[9px] font-mono text-white/80 truncate">{user.affiliate_code || 'UNASSIGNED'}</p>
                      </div>
                   </div>
                   <img src="/assets/logo-short.png" alt="SOX" className="h-4 opacity-30 invert shrink-0" />
                </div>

                <div className="flex gap-4 items-center mb-4">
                   <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/5 shadow-xl shrink-0">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover grayscale-[0.5]" />
                   </div>
                   <div className="flex flex-col gap-0.5 min-w-0">
                      <h3 className="text-xl font-display italic font-black uppercase text-white leading-none truncate">{firstName} {lastName}</h3>
                      <p className="text-[8px] font-bold text-soyuz tracking-widest uppercase italic opacity-80">SOYUZ ANALYTICS COMMANDER</p>
                      <div className="mt-1 flex gap-1">
                         {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-soyuz/60 rounded-full" />)}
                      </div>
                   </div>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                   <div className="text-[8px] font-black text-white/10 tracking-[0.4em] mb-2 shrink-0">MATRICE PERFORMANCE DATA</div>
                   <div className="grid grid-cols-2 gap-2 mb-3 shrink-0">
                      <StatBlock label="LIQUIDITÉ" value={`$${(stats.network_revenue || stats.total_sales || 0).toLocaleString()}`} icon={<DollarSign size={8} />} />
                      <StatBlock label="NODES" value={stats.active_affiliates || stats.points || 0} icon={<Zap size={8} />} />
                      <StatBlock label="SCORE" value={rank.toUpperCase()} icon={<Crown size={8} />} />
                      <StatBlock label="SYNC" value={`${new Date(user.created_at).getFullYear()}-PR`} icon={<Target size={8} />} />
                   </div>
                   <div className="p-3 bg-white/[0.02] rounded-lg border border-white/5 italic text-[9px] leading-relaxed text-zinc-500 text-justify overflow-hidden line-clamp-3">
                      Nodal activation recorded {new Date(user.created_at).toLocaleDateString()}. {lastName} has maintained peak flow efficiency across all Series 2 parameters. Matrice sync confirmed at 99.8%.
                   </div>
                </div>

                <div className="mt-auto pt-4 flex justify-between items-center border-t border-white/10 shrink-0">
                   <div className="flex flex-col gap-0.5">
                      <p className="text-[6px] font-bold text-white/5 tracking-widest uppercase italic">ENCRYPTED 2026 // NODE DATA SECURE</p>
                      <img src="/assets/logo-short.png" alt="SOX" className="h-2.5 opacity-5 invert grayscale" />
                   </div>
                   <div className="w-6 h-6 rounded bg-soyuz/5 border border-white/5 flex items-center justify-center">
                      <Trophy size={12} className="text-soyuz opacity-30" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="flex gap-4 relative z-50">
          <button 
            onClick={(e) => { 
              e.stopPropagation(); 
              fileInputRef.current?.click();
            }} 
            className="flex items-center gap-2 px-6 py-4 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all disabled:opacity-50 cursor-pointer group/photo"
            disabled={isDownloading}
          >
            <Camera size={14} className="text-soyuz/50 group-hover/photo:text-soyuz transition-colors" /> PHOTO
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleInternalDownload(); }} 
            className={`flex items-center gap-2 px-6 py-4 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all ${isDownloading ? 'animate-pulse text-soyuz' : ''}`}
            disabled={isDownloading}
          >
            <Download size={14} className={isDownloading ? 'animate-bounce' : 'text-soyuz/50'} /> 
            {isDownloading ? 'EXPORTATION...' : 'TÉLÉCHARGER'}
          </button>
        </div>
        <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em] max-w-[280px] text-center italic">
          <span className="text-soyuz/40">PRO-TIP:</span> UTILISEZ UNE PHOTO SANS FOND (PNG TRANSPARENT) POUR UN RÉSULTAT OPTIMAL.
        </p>

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
              // Clear for next time
              e.target.value = '';
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
