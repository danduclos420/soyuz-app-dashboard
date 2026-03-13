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

  const firstName = (user.role === 'admin' || rank === 'mvp') ? 'Dany' : user.full_name.split(' ')[0];
  const lastName = (user.role === 'admin' || rank === 'mvp') ? 'Lacoursière' : user.full_name.split(' ').slice(1).join(' ');

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
      {/* Google Fonts Import for Scripts */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Playball&display=swap');
      `}</style>

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
            {/* Header: Branding */}
            <div className="relative z-30 p-8 flex justify-between items-start">
               <div className="flex flex-col gap-1 items-start">
                  <img src="/assets/logo-short.png" alt="SOX" className="h-10 invert brightness-150 drop-shadow-[0_0_15px_rgba(255,215,0,0.3)]" />
                  <p className="text-[10px] font-black italic tracking-[0.2em] text-white/40 border-t border-white/20 pt-1">SERIES 2 // SOYUZ-NODES</p>
               </div>
            </div>

            {/* Photo Layer */}
            <div className="absolute inset-0 z-10">
               {user.avatar_url ? (
                 <img src={user.avatar_url} className="w-full h-full object-cover contrast-[1.1] brightness-[1.1]" />
               ) : (
                 <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={120} className="text-white/5" /></div>
               )}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
               <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Metallic Footer with Separator */}
            <div className="absolute inset-x-0 bottom-0 z-40 h-32 flex flex-col justify-end">
               {/* Explicit White Line Separator */}
               <div className="w-full h-[1.5px] bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)] z-50 mb-[-1px]" />
               
               {/* Metallic Nameplate */}
               <div className="w-full h-24 bg-[url('https://www.transparenttextures.com/patterns/brushed-alum.png')] bg-neutral-900 flex items-center px-8 relative shadow-[0_-15px_40px_rgba(0,0,0,0.9)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-[-30deg]" />
                  
                  <div className="flex flex-col relative z-10 w-full group">
                     <div className="flex justify-between items-end mb-1">
                        <p className={`text-[10px] font-black italic tracking-[0.4em] uppercase ${theme.accent} opacity-80`}>YOUNG-NODES</p>
                        <div className="flex flex-col items-end">
                           <span className="text-[12px] font-black italic text-white/40 leading-none">{rank.toUpperCase()}</span>
                           <div className="h-[1px] w-6 bg-white/20 mt-1" />
                        </div>
                     </div>
                     
                     {/* Mixed Script Typography */}
                     <div className="flex items-baseline gap-2 overflow-hidden">
                        <span className="text-2xl text-white/90" style={{ fontFamily: '"Dancing Script", cursive', fontWeight: 700 }}>
                           {firstName}
                        </span>
                        <h2 className="text-4xl text-white leading-none tracking-tighter drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]" 
                            style={{ fontFamily: '"Playball", cursive', letterSpacing: '-0.02em' }}>
                           {lastName}
                        </h2>
                     </div>
                  </div>
               </div>
            </div>

            {/* Holographic Layer */}
            {rank !== 'agent' && (
              <div className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge opacity-30 overflow-hidden">
                <motion.div 
                  className="absolute inset-[-150%] bg-[linear-gradient(45deg,transparent_45%,rgba(255,255,255,0.5)_50%,transparent_55%)]"
                  animate={{ x: ['-100%', '100%'], y: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>

          {/* BACK SIDE (Advanced Nodal Report - SCALED FOR FIT) */}
          <div 
            className="absolute inset-0 rounded-[4px] overflow-hidden border-[1px] border-white/5 bg-[#080808] rotate-y-180 flex flex-col shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
          >
             <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/subtle-carbon.png')] pointer-events-none" />
             
             <div className="h-full flex flex-col p-6 text-white relative z-10">
                {/* Header SCALED */}
                <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-4 uppercase">
                   <div className="flex items-center gap-3">
                      <p className="text-2xl font-black text-soyuz italic tracking-tighter">#001</p>
                      <div className="h-8 w-[1px] bg-white/10" />
                      <div>
                         <p className="text-[8px] font-black tracking-[0.4em] text-white/40">NODE-ID</p>
                         <p className="text-[10px] font-mono text-white/80">{user.affiliate_code || 'UNASSIGNED'}</p>
                      </div>
                   </div>
                   <img src="/assets/logo-short.png" alt="SOX" className="h-5 opacity-30 invert" />
                </div>

                {/* Identity Strip SCALED */}
                <div className="flex gap-6 items-center mb-6">
                   <div className="w-16 h-16 rounded-lg overflow-hidden border border-white/5 shadow-xl shrink-0">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover grayscale-[0.5]" />
                   </div>
                   <div className="flex flex-col gap-0.5">
                      <h3 className="text-2xl font-display italic font-black uppercase text-white leading-none">{firstName} {lastName}</h3>
                      <p className="text-[9px] font-bold text-soyuz tracking-widest uppercase italic opacity-80">SOYUZ ANALYTICS COMMANDER</p>
                      <div className="mt-1 flex gap-1">
                         {[...Array(5)].map((_, i) => <div key={i} className="w-1 h-1 bg-soyuz/60 rounded-full" />)}
                      </div>
                   </div>
                </div>

                {/* Advanced Stats Grid SCALED */}
                <div className="flex-1 overflow-hidden">
                   <div className="text-[9px] font-black text-white/10 tracking-[0.4em] mb-3">MATRICE PERFORMANCE DATA</div>
                   
                   <div className="grid grid-cols-2 gap-3 mb-6">
                      <StatBlock label="LIQUIDITÉ" value={`$${(stats.network_revenue || stats.total_sales || 0).toLocaleString()}`} icon={<DollarSign size={10} />} />
                      <StatBlock label="NODES" value={stats.active_affiliates || stats.points || 0} icon={<Zap size={10} />} />
                      <StatBlock label="SCORE" value={rank.toUpperCase()} icon={<Crown size={10} />} />
                      <StatBlock label="SYNC" value={`${new Date(user.created_at).getFullYear()}-PR`} icon={<Target size={10} />} />
                   </div>

                   {/* Narrative Bio SCALED */}
                   <div className="p-4 bg-white/[0.02] rounded-lg border border-white/5 italic text-[10px] leading-relaxed text-zinc-500 text-justify">
                      Nodal activation recorded {new Date(user.created_at).toLocaleDateString()}. Lacoursière has maintained peak flow efficiency across all Series 2 parameters. Matrice sync confirmed at 99.8%.
                   </div>
                </div>

                {/* Footer SCALED */}
                <div className="mt-auto pt-6 flex justify-between items-center border-t border-white/10">
                   <div className="flex flex-col gap-0.5">
                      <p className="text-[7px] font-bold text-white/5 tracking-widest uppercase italic">ENCRYPTED 2026 // NODE DATA SECURE</p>
                      <img src="/assets/logo-short.png" alt="SOX" className="h-3 opacity-5 invert grayscale" />
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-soyuz/5 border border-white/5 flex items-center justify-center">
                      <Trophy size={16} className="text-soyuz opacity-30" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Action Hub */}
      <div className="flex gap-4 relative z-50">
        <button onClick={(e) => { e.stopPropagation(); onEditPhoto?.(); }} className="flex items-center gap-2 px-6 py-4 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all">
          <Camera size={14} className="text-soyuz/50" /> PHOTO
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDownload?.(); }} className="flex items-center gap-2 px-6 py-4 bg-white/[0.01] border border-white/5 rounded-lg text-[9px] font-black uppercase tracking-[0.2em] text-white/20 hover:text-white transition-all">
          <Download size={14} className="text-soyuz/50" /> SYNC
        </button>
      </div>
    </div>
  );
}

function StatBlock({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-white/[0.03] p-4 rounded-lg border border-white/5 flex flex-col justify-center">
       <div className="flex items-center gap-1.5 mb-1 text-soyuz/40">
          {icon}
          <span className="text-[7px] font-black tracking-widest uppercase opacity-30">{label}</span>
       </div>
       <div className="text-lg font-display italic font-black text-white leading-none tracking-tighter">{value}</div>
    </div>
  );
}
