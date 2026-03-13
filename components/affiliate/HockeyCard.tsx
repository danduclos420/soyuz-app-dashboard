'use client';

import { useState, useRef } from 'react';
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
  
  // Interactive mouse tracking
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-10, 10]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const displayName = (user.role === 'admin' || rank === 'mvp') ? 'Dany Lacoursière' : user.full_name;

  const getRankTheme = () => {
    const isAdmin = user.role === 'admin' || rank === 'mvp';
    if (isAdmin) return { border: 'border-yellow-500/50', accent: 'text-yellow-500', label: 'MVP EDITION' };
    if (rank === 'legend') return { border: 'border-red-600/50', accent: 'text-red-500', label: 'LEGEND' };
    if (rank === 'elite') return { border: 'border-zinc-300/50', accent: 'text-zinc-200', label: 'ELITE' };
    return { border: 'border-white/10', accent: 'text-white/40', label: 'AGENT' };
  };

  const theme = getRankTheme();

  return (
    <div className="flex flex-col items-center gap-12">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="relative w-[340px] h-[480px] perspective-2000 cursor-pointer group select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
           className="w-full h-full relative"
           animate={{ rotateY: isFlipped ? 180 : rotateY.get(), rotateX: isFlipped ? 0 : rotateX.get() }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
           style={{ transformStyle: 'preserve-3d' }}
        >
          {/* OPAQUE CORE SANDWICH */}
          <div className="absolute inset-0 bg-black z-0 rounded-[4px]" style={{ transform: 'translateZ(-1px)' }} />

          {/* FRONT SIDE (Recto - Young Guns Edition) */}
          <div 
            className={`absolute inset-0 rounded-[4px] overflow-hidden border-[1px] ${theme.border} bg-[#050505] flex flex-col shadow-2xl`}
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
          >
            {/* 1. Large Header Branding */}
            <div className="relative z-30 p-8 flex justify-between items-start">
               <div className="flex flex-col gap-1 items-start">
                  <img src="/assets/logo-short.png" alt="SOX" className="h-10 invert brightness-150 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
                  <p className="text-[10px] font-black italic tracking-[0.2em] text-white/40 border-t border-white/20 pt-1">SERIES 2 // SOYUZ-NODES</p>
               </div>
            </div>

            {/* 2. Main Subject Photo */}
            <div className="absolute inset-0 z-10">
               {user.avatar_url ? (
                 <img src={user.avatar_url} className="w-full h-full object-cover contrast-[1.1] brightness-[1.1]" />
               ) : (
                 <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={120} className="text-white/5" /></div>
               )}
               {/* Vignette Shadow */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* 3. Metallic Footer (The "Young Guns" Blade) */}
            <div className="absolute inset-x-0 bottom-0 z-40 h-32 flex flex-col justify-end">
               {/* Separator Line */}
               <div className="w-full h-[1px] bg-white opacity-40 blur-[0.5px] mb-[-2px]" />
               
               {/* Metallic Nameplate */}
               <div className="w-full h-24 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] bg-neutral-900 flex items-center px-10 relative shadow-[0_-15px_30px_rgba(0,0,0,0.8)] overflow-hidden">
                  {/* Metal Sheen Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg]" />
                  
                  {/* Info Section */}
                  <div className="flex flex-col relative z-10 w-full">
                     <div className="flex justify-between items-end mb-1">
                        <p className={`text-[11px] font-black italic tracking-[0.3em] uppercase ${theme.accent}`}>YOUNG-NODES</p>
                        {/* Position Slot "C" */}
                        <div className="flex flex-col items-end">
                           <span className="text-[14px] font-black italic text-white/50 leading-none">{rank.toUpperCase()}</span>
                           <div className="h-[1px] w-8 bg-white/20 mt-1" />
                        </div>
                     </div>
                     
                     {/* Script Baseball Typography */}
                     <h2 className="text-5xl font-serif italic font-black text-white leading-none tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,1)] -skew-x-3 pr-4" style={{ fontFamily: 'serif', letterSpacing: '-0.05em' }}>
                        {displayName}
                     </h2>
                  </div>
               </div>
            </div>

            {/* 4. Holographic Foil Layers */}
            {rank !== 'agent' && (
              <div className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge opacity-40">
                <motion.div 
                  className="absolute inset-[-150%] bg-[linear-gradient(45deg,transparent_40%,rgba(255,255,255,0.6)_50%,transparent_60%)]"
                  animate={{ x: ['-100%', '100%'], y: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>

          {/* BACK SIDE (Verso - Advanced Nodal Report) */}
          <div 
            className="absolute inset-0 rounded-[4px] overflow-hidden border-[1px] border-white/5 bg-[#080808] rotate-y-180 flex flex-col shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
          >
             {/* Tech Background */}
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] pointer-events-none" />
             
             <div className="h-full flex flex-col p-8 text-white relative z-10">
                {/* Header: ID & Logo */}
                <div className="flex justify-between items-start mb-10 border-b border-white/10 pb-6 uppercase">
                   <div className="flex items-center gap-4">
                      <p className="text-3xl font-black text-soyuz italic tracking-tighter">#001</p>
                      <div className="h-10 w-[1px] bg-white/10" />
                      <div>
                         <p className="text-[10px] font-black tracking-[0.5em] text-white/40">NODE-ID</p>
                         <p className="text-xs font-mono text-white/80">{user.affiliate_code || 'UNASSIGNED'}</p>
                      </div>
                   </div>
                   <img src="/assets/logo-short.png" alt="SOX" className="h-6 opacity-30 invert" />
                </div>

                {/* Identity Strip */}
                <div className="flex gap-8 items-center mb-10">
                   <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-white/5 shadow-2xl ring-4 ring-white/5">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover grayscale-[0.5]" />
                   </div>
                   <div className="flex flex-col gap-1">
                      <h3 className="text-3xl font-display italic font-black uppercase text-white drop-shadow-lg">{displayName}</h3>
                      <p className="text-[11px] font-bold text-soyuz tracking-widest uppercase italic">SOYUZ ANALYTICS COMMANDER</p>
                      <div className="mt-2 flex gap-1">
                         {[...Array(5)].map((_, i) => <div key={i} className="w-1.5 h-1.5 bg-soyuz/60 rounded-full" />)}
                      </div>
                   </div>
                </div>

                {/* Advanced Stats Grid */}
                <div className="flex-1 grid grid-cols-1 gap-4">
                   <div className="text-[11px] font-black text-white/20 tracking-[0.6em] mb-2">NETWORK PERFORMANCE DATA</div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <StatBlock label="LIQUIDITÉ RÉSEAU" value={`$${(stats.network_revenue || stats.total_sales || 0).toLocaleString()}`} icon={<DollarSign size={14} />} />
                      <StatBlock label="NODES ACTIFS" value={stats.active_affiliates || stats.points || 0} icon={<Zap size={14} />} />
                      <StatBlock label="SCORE D'AUTORITÉ" value={rank.toUpperCase()} icon={<Crown size={14} />} />
                      <StatBlock label="NODAL SYNC" value={`${new Date(user.created_at).getFullYear()}-PRO`} icon={<Target size={14} />} />
                   </div>

                   {/* Bio Narrative (MLB Style) */}
                   <div className="mt-8 p-6 bg-white/[0.03] rounded-xl border border-white/5 italic text-[12px] leading-relaxed text-zinc-400 text-justify">
                      Node activated on {new Date(user.created_at).toLocaleDateString()}. Lacoursière has consistently broken nodal capacity thresholds, establishing a legend-grade precedent for the entire soyuz network. Series 2 deployment confirmed.
                   </div>
                </div>

                {/* Footer Security */}
                <div className="mt-auto pt-8 flex justify-between items-center border-t border-white/10">
                   <div className="flex flex-col gap-1">
                      <p className="text-[8px] font-bold text-white/10 tracking-widest uppercase">ENCRYPTED SOYUZ REPORT // 2026</p>
                      <img src="/assets/logo-short.png" alt="SOX" className="h-4 opacity-5 grayscale invert" />
                   </div>
                   <div className="w-10 h-10 rounded-lg bg-soyuz/10 border border-soyuz/20 flex items-center justify-center">
                      <Trophy size={20} className="text-soyuz opacity-50" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Action Hub */}
      <div className="flex gap-6 relative z-50">
        <button onClick={(e) => { e.stopPropagation(); onEditPhoto?.(); }} className="flex items-center gap-3 px-10 py-6 bg-white/[0.02] border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz hover:bg-soyuz/5 transition-all">
          <Camera size={16} className="text-soyuz" /> PHOTO-EDIT
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDownload?.(); }} className="flex items-center gap-3 px-10 py-6 bg-white/[0.02] border border-white/10 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz hover:bg-soyuz/5 transition-all">
          <Download size={16} className="text-soyuz" /> SYNC-DATA
        </button>
      </div>
    </div>
  );
}

function StatBlock({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.04] p-5 rounded-xl border border-white/5 hover:bg-white/[0.08] transition-all group">
       <div className="flex items-center gap-2 mb-2 text-soyuz/50 group-hover:text-soyuz transition-colors">
          {icon}
          <span className="text-[9px] font-black tracking-widest uppercase opacity-40">{label}</span>
       </div>
       <div className="text-2xl font-display italic font-black text-white">{value}</div>
    </div>
  );
}
