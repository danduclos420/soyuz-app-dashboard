'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, ShoppingBag, Calendar, Download, Crown, Camera, Zap } from 'lucide-react';

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
  onDownload?: () => void;
  onEditPhoto?: () => void;
}

export default function HockeyCard({ user, stats, rank = 'agent', onDownload, onEditPhoto }: HockeyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Mouse tracking for dynamic shine
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const getRankTheme = () => {
    const isSpecial = rank === 'legend' || rank === 'mvp' || user.role === 'admin';
    
    if (user.role === 'admin' || rank === 'mvp') return {
      border: 'border-[#FFD700]',
      base: 'bg-[#0F0F0F]',
      accent: 'text-yellow-400',
      label: 'MVP SPECIAL EDITION',
      holographic: true,
      intensity: 1,
      glow: 'shadow-[0_0_50px_rgba(255,215,0,0.3)]',
    };
    
    switch (rank) {
      case 'legend': return {
        border: 'border-[#C41E3A]',
        base: 'bg-[#0A0A0A]',
        accent: 'text-[#C41E3A]',
        label: 'LEGEND SERIES',
        holographic: true,
        intensity: 0.8,
        glow: 'shadow-[0_0_40px_rgba(196,30,58,0.3)]',
      };
      case 'elite': return {
        border: 'border-[#E5E4E2]',
        base: 'bg-[#0D0D0D]',
        accent: 'text-white',
        label: 'ELITE PERFORMANCE',
        holographic: true,
        intensity: 0.5,
        glow: 'shadow-[0_0_30px_rgba(229,228,226,0.2)]',
      };
      case 'pro': return {
        border: 'border-[#CD7F32]',
        base: 'bg-[#0D0D0D]',
        accent: 'text-[#CD7F32]',
        label: 'PRO STATUS',
        holographic: true,
        intensity: 0.25,
        glow: 'shadow-[0_0_20px_rgba(205,127,50,0.1)]',
      };
      default: return {
        border: 'border-white/10',
        base: 'bg-[#111111]',
        accent: 'text-white/60',
        label: 'ENTRY AGENT',
        holographic: false,
        intensity: 0,
        glow: '',
      };
    }
  };

  const theme = getRankTheme();

  return (
    <div className="flex flex-col items-center gap-10 py-10">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-[340px] h-[500px] perspective-2000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ 
            rotateY: isFlipped ? 180 : 0,
            rotateX: isFlipped ? 0 : rotateX.get(),
            rotateY: isFlipped ? 180 : rotateY.get()
          }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* FRONT SIDE */}
          <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[6px] ${theme.border} ${theme.base} ${theme.glow} flex flex-col p-1`}>
            
            {/* Holographic Foiling Layers */}
            {theme.holographic && (
              <div className="absolute inset-0 pointer-events-none z-30 mix-blend-color-dodge opacity-60">
                {/* Rainbow Prismatic Layer */}
                <motion.div 
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,oklch(70%_0.3_20),oklch(70%_0.3_140),oklch(70%_0.3_260),oklch(70%_0.3_20))] opacity-20"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  style={{ filter: 'blur(40px)' }}
                />
                {/* Static Shine Follower (CSS will handle dynamic coords better for PNG exports, but for UI we use mouse) */}
                <div 
                  className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.8)_0%,transparent_50%)]"
                  style={{ 
                    '--x': `${(mouseXSpring.get() + 0.5) * 100}%`,
                    '--y': `${(mouseYSpring.get() + 0.5) * 100}%`
                  } as any}
                />
              </div>
            )}

            {/* Frame Background Layer (Upper Deck Texture) */}
            <div className="absolute inset-0 z-0 bg-texture opacity-5" />

            {/* Top Bar: Rank & Logo */}
            <div className="relative z-40 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${theme.border.replace('border-', 'from-')}/40 to-black`}>
                    <Crown size={16} className={theme.accent} />
                 </div>
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/90 drop-shadow-md">
                   {theme.label}
                 </span>
              </div>
              <img src="/assets/logo-short.png" alt="SOX" className="h-6 invert opacity-50" />
            </div>

            {/* Player Image (Large) */}
            <div className="absolute inset-0 z-10">
              <div className="w-full h-full relative">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1] brightness-[1.1]" />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={100} className="text-white/5" /></div>
                )}
                {/* Gradient Shadows for Depth */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
              </div>
            </div>

            {/* Front Overlay Stats (All-Star Style) */}
            <div className="relative z-40 mt-auto p-8 pt-0 space-y-6">
               <div className="space-y-1">
                  <h2 className={`text-5xl font-display italic uppercase leading-[0.85] tracking-tighter ${theme.accent} drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]`}>
                    {user.full_name.split(' ')[0]}
                    <br />
                    <span className="text-white brightness-125">{user.full_name.split(' ').slice(1).join(' ')}</span>
                  </h2>
               </div>

               <div className="grid grid-cols-2 gap-4 border-t border-white/20 pt-6">
                  <div className="space-y-0.5">
                     <p className="text-[8px] text-white/40 font-black uppercase tracking-widest leading-none">TOTAL ACTIVÉ</p>
                     <p className="text-2xl font-display italic text-white leading-none">
                       ${((stats.total_sales || stats.total_spent || 0) / 1000).toFixed(1)}K
                     </p>
                  </div>
                  <div className="space-y-0.5 text-right">
                     <p className="text-[8px] text-white/40 font-black uppercase tracking-widest leading-none">UNITÉS</p>
                     <p className="text-2xl font-display italic text-white leading-none">
                       {stats.purchase_count || stats.active_affiliates || stats.points || 0}
                     </p>
                  </div>
               </div>
            </div>
            
            {/* Texture Foil Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-20 filter grayscale contrast-150" 
                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '4px 4px' }} />
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 bg-[#0A0A0A] rotate-y-180 flex flex-col">
            <div className="h-full flex flex-col p-8 relative">
              {/* Layout Watermark */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/[0.02] font-display italic text-[12rem] pointer-events-none select-none">NHL</div>

              {/* Back Header */}
              <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-6">
                <div className="space-y-1">
                   <p className="text-xs font-black text-soyuz italic tracking-[0.4em]">SOYUZ NETWORKS // AUTHENTIC</p>
                   <p className="text-[9px] text-white/40 font-bold uppercase tracking-widest uppercase">Node ID: {user.affiliate_code || '---'}</p>
                </div>
                <img src="/assets/logo-short.png" alt="SOX" className="h-6 grayscale opacity-20" />
              </div>

              {/* Biography / Timestamp */}
              <div className="flex gap-6 items-center mb-10 bg-white/[0.03] p-5 rounded-3xl border border-white/5 shadow-inner">
                <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg shrink-0">
                   <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2 flex-1">
                   <p className="text-[10px] text-soyuz font-black uppercase tracking-widest leading-none">UNITÉ SYSTÈME ACTIVÉE</p>
                   <p className="text-2xl font-display italic text-white uppercase leading-none">{user.full_name}</p>
                   <p className="text-[9px] text-white/40 leading-relaxed italic">Aligné au réseau SOYUZ depuis {new Date(user.created_at).toLocaleDateString()}. Statut : Opérationnel de Grade {rank.toUpperCase()}.</p>
                </div>
              </div>

              {/* Advanced Stat Grid */}
              <div className="grid grid-cols-2 gap-6 flex-1">
                 {user.role === 'admin' ? (
                   <>
                     <DetailStat label="FLUX GLOBAL" value={`$${(stats.network_revenue || 0).toLocaleString()}`} sub="Revenu total réseau" />
                     <DetailStat label="UNITÉS ACTIVES" value={stats.active_affiliates || 0} sub="Noms de domaines" />
                     <DetailStat label="VOLUME NODES" value={stats.total_sales || 0} sub="Total transactions" />
                     <DetailStat label="NIVEAU ACCÈS" value="COMMANDER" sub="Autorité Master" />
                   </>
                 ) : user.role === 'affiliate' ? (
                   <>
                     <DetailStat label="CAPITAL ACTIVÉ" value={`$${(stats.total_sales || 0).toLocaleString()}`} sub="Valeur marchande brute" />
                     <DetailStat label="POINTS RÉSEAU" value={stats.points || 0} sub="Score de performance" />
                     <DetailStat label="RÉTRIBUTION" value={`$${(stats.commissions || 0).toLocaleString()}`} sub="Commissions validées" />
                     <DetailStat label="CLASSEMENT" value={rank.toUpperCase()} sub="Rang actuel" />
                   </>
                 ) : (
                   <>
                     <DetailStat label="ACQUISITIONS" value={stats.purchase_count || 0} sub="Commandes totales" />
                     <DetailStat label="INVESTISSEMENT" value={`$${(stats.total_spent || 0).toLocaleString()}`} sub="Dépenses cumulées" />
                     <DetailStat label="PRODUIT MVP" value={stats.favorite_product || '---'} sub="Top intérêt" />
                     <DetailStat label="STAKEHOLDER" value="CLIENT" sub="Compte activé" />
                   </>
                 )}
              </div>

              {/* Footer Security */}
              <div className="mt-auto flex justify-between items-end border-t border-white/10 pt-8">
                 <div className="flex gap-1 opacity-20">
                   {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-3 bg-white" />)}
                 </div>
                 <p className="text-[8px] font-black text-[#333] tracking-[0.6em]">SOYUZ // CRYPTED DATA</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Control Actions */}
      <div className="flex flex-wrap justify-center gap-4">
        {onEditPhoto && (
          <button 
            onClick={(e) => { e.stopPropagation(); onEditPhoto(); }}
            className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white hover:border-soyuz hover:bg-soyuz/5 transition-all shadow-xl group"
          >
            <Camera size={14} className="group-hover:scale-110 transition-transform" /> COMMANDER NOUVELLE PHOTO
          </button>
        )}
        
        {onDownload && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white hover:border-soyuz hover:bg-soyuz/5 transition-all shadow-xl group"
          >
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> EXTRAIRE (IMAGE)
          </button>
        )}
      </div>
    </div>
  );
}

function DetailStat({ label, value, sub }: { label: string, value: string | number, sub: string }) {
  return (
    <div className="p-5 bg-white/[0.02] border border-white/[0.05] rounded-3xl hover:bg-white/[0.04] transition-all group">
      <div className="space-y-1">
        <p className="text-[8px] font-black text-soyuz tracking-widest uppercase opacity-60 group-hover:opacity-100 transition-opacity">{label}</p>
        <p className="text-2xl font-display italic text-white leading-none truncate">{value}</p>
        <p className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{sub}</p>
      </div>
    </div>
  );
}
