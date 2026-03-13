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
  
  // Mouse tracking for dynamic holographic shine
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);
  
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
    const isAdmin = user.role === 'admin' || rank === 'mvp';
    
    if (isAdmin) return {
      border: 'border-[#FFD700]',
      footerBg: 'bg-gradient-to-r from-[#FFD700] via-[#FDB931] to-[#FFD700]',
      accent: 'text-yellow-400',
      label: 'MVP SPECIAL EDITION',
      holographic: true,
      intensity: 1,
      glow: 'shadow-[0_0_60px_rgba(255,215,0,0.4)]',
      footerText: 'text-black',
      particleColor: 'bg-yellow-400'
    };
    
    switch (rank) {
      case 'legend': return {
        border: 'border-[#C41E3A]',
        footerBg: 'bg-gradient-to-r from-[#C41E3A] via-[#8B0000] to-[#C41E3A]',
        accent: 'text-white',
        label: 'LEGENDARY NODE',
        holographic: true,
        intensity: 0.8,
        glow: 'shadow-[0_0_50px_rgba(196,30,58,0.4)]',
        footerText: 'text-white',
        particleColor: 'bg-red-500'
      };
      case 'elite': return {
        border: 'border-[#E5E4E2]',
        footerBg: 'bg-gradient-to-r from-[#E5E4E2] via-[#A9A9A9] to-[#E5E4E2]',
        accent: 'text-white',
        label: 'ELITE STATUS',
        holographic: true,
        intensity: 0.5,
        glow: 'shadow-[0_0_40px_rgba(229,228,226,0.3)]',
        footerText: 'text-black',
        particleColor: 'bg-white'
      };
      case 'pro': return {
        border: 'border-[#CD7F32]',
        footerBg: 'bg-gradient-to-r from-[#CD7F32] via-[#8B4513] to-[#CD7F32]',
        accent: 'text-white',
        label: 'PRO NODE',
        holographic: true,
        intensity: 0.3,
        glow: 'shadow-[0_0_30px_rgba(205,127,50,0.2)]',
        footerText: 'text-white',
        particleColor: 'bg-orange-400'
      };
      default: return {
        border: 'border-white/20',
        footerBg: 'bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800',
        accent: 'text-white/60',
        label: 'ENTRY LEVEL',
        holographic: false,
        intensity: 0,
        glow: 'shadow-2xl',
        footerText: 'text-white',
        particleColor: 'bg-gray-400'
      };
    }
  };

  const theme = getRankTheme();

  return (
    <div className="flex flex-col items-center gap-12 py-10 scale-90 sm:scale-100">
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
            rotateY: isFlipped ? 180 : rotateY.get(),
            rotateX: rotateX.get(),
          }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* SOLID CORE (Separator) */}
          <div className="absolute inset-2 bg-black z-0 rounded-[2rem]" />

          {/* FRONT SIDE (Young Guns Style) */}
          <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[8px] ${theme.border} bg-[#050505] flex flex-col z-10 ${theme.glow}`}>
            
            {/* 1. Background Content Layer */}
            <div className="absolute inset-0 z-0">
               {/* Radial Ray Lights (Young Guns Signature) */}
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,transparent_70%)] opacity-50" />
               <div className="absolute inset-0 flex items-center justify-center opacity-5">
                  <div className="w-[150%] h-[10px] bg-white blur-[100px] rotate-45" />
                  <div className="w-[150%] h-[10px] bg-white blur-[100px] -rotate-45" />
               </div>
            </div>

            {/* 2. Main Subject Image Layer */}
            <div className="absolute inset-4 bottom-24 z-10 rounded-[1.5rem] overflow-hidden">
                {user.avatar_url ? (
                  <img src={user.avatar_url} className="w-full h-full object-cover grayscale-[0.1] contrast-[1.2] brightness-[1.1]" />
                ) : (
                  <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={120} className="text-white/5" /></div>
                )}
                {/* Subject Gradient Shadow */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
            </div>

            {/* 3. Top Branding Layer */}
            <div className="relative z-30 p-8 flex justify-between items-start">
               <div className="flex flex-col gap-1">
                  <img src="/assets/logo-short.png" alt="SOX" className="h-8 invert drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]" />
                  <div className="h-[2px] w-full bg-white opacity-20" />
               </div>
               <div className="flex flex-col items-end">
                  <span className={`text-[10px] font-black italic tracking-widest ${theme.accent} drop-shadow-lg`}>{theme.label}</span>
                  <div className="flex gap-1 mt-1">
                     {[...Array(3)].map((_, i) => <Star key={i} size={8} className={theme.accent} fill="currentColor" />)}
                  </div>
               </div>
            </div>

            {/* 4. Footer Nameplate Overlay (Young Guns Style) */}
            <div className="absolute inset-x-0 bottom-0 z-40 h-32 flex flex-col justify-end p-2">
               <div className={`w-full h-24 ${theme.footerBg} rounded-[1.5rem] flex items-center px-8 relative overflow-hidden shadow-2xl`}>
                  {/* Footer Decoration */}
                  <div className="absolute top-0 right-0 p-4 opacity-20"><Zap size={40} className={theme.footerText} /></div>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white/20" />
                  
                  <div className="flex flex-col">
                     <p className={`text-[9px] font-bold tracking-[0.4em] uppercase opacity-60 ${theme.footerText}`}>{user.role.toUpperCase()} // GRADE {rank.toUpperCase()}</p>
                     <h2 className={`text-4xl font-display italic uppercase leading-none mt-1 tracking-tighter ${theme.footerText} drop-shadow-sm`}>
                        {user.full_name}
                     </h2>
                  </div>
                  
                  {/* Subtle Front Stats */}
                  <div className="ml-auto text-right border-l border-black/10 pl-6 flex flex-col justify-center h-12">
                     <p className={`text-[8px] font-black uppercase opacity-50 ${theme.footerText}`}>ACTIVÉ</p>
                     <p className={`text-xl font-display italic leading-none ${theme.footerText}`}>
                        ${((stats.total_sales || stats.total_spent || 0) / 1000).toFixed(1)}K
                     </p>
                  </div>
               </div>
            </div>

            {/* 5. Holographic Foil Finishing Layer */}
            {theme.holographic && (
              <div className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge overflow-hidden opacity-60">
                 {/* Main Iridescent Sweep */}
                 <motion.div 
                   className="absolute inset-[-150%] bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)]"
                   animate={{ 
                      x: ['-100%', '100%'],
                      y: ['-100%', '100%']
                   }}
                   transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                 />
                 {/* Rainbow Prismatic Edge Glow */}
                 <div className="absolute inset-0 border-[10px] border-transparent mask-image-[linear-gradient(white,white)]" style={{
                    backgroundImage: 'conic-gradient(from 0deg, oklch(70% 0.3 20), oklch(70% 0.3 140), oklch(70% 0.3 260), oklch(70% 0.3 20))',
                    backgroundSize: '100% 100%',
                    opacity: 0.4
                 }} />
              </div>
            )}
            
            {/* Screen Reflective Texture */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          </div>

          {/* BACK SIDE (Detailed Table) */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[8px] border-white/5 bg-[#080808] rotate-y-180 flex flex-col z-20">
            <div className="h-full flex flex-col p-8 relative">
              {/* Back Header Branding */}
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6 uppercase">
                 <div>
                    <p className="text-sm font-black text-soyuz tracking-[0.5em] italic">SOYUZ // NODAL REPORT</p>
                    <p className="text-[9px] text-white/30 font-bold tracking-widest mt-1">ISSUED ON: {new Date(user.created_at).toLocaleDateString()}</p>
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                    <Zap size={20} className="text-soyuz" />
                 </div>
              </div>

              {/* Identity & Bio Strip */}
              <div className="flex gap-6 items-center mb-10 bg-white/[0.02] p-5 rounded-3xl border border-white/5">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white/10 shrink-0">
                   <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                   <p className="text-xl font-display italic text-white uppercase leading-none">{user.full_name}</p>
                   <p className="text-[9px] text-white/40 leading-relaxed font-bold">NODE ID: {user.affiliate_code || '---'}</p>
                   <p className="text-[9px] text-[#444] italic">MEMBRE DU RÉSEAU DEPUIS LE {new Date(user.created_at).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Full Performance Statistics Table */}
              <div className="flex-1 space-y-4">
                 <p className="text-[10px] font-black text-soyuz/60 tracking-widest uppercase mb-4">MÉTRIQUES DE RÉSEAU</p>
                 <div className="grid grid-cols-1 gap-3">
                   {user.role === 'admin' ? (
                     <>
                       <TableStat label="CAPITAL RÉSEAU GLOBAL" value={`$${(stats.network_revenue || 0).toLocaleString()}`} />
                       <TableStat label="UNITÉS ACTIVES DANS LA MATRICE" value={stats.active_affiliates || 0} />
                       <TableStat label="VOLUME DE TRANSACTIONS TOTAL" value={stats.total_sales || 0} />
                       <TableStat label="NIVEAU D'AUTORITÉ" value="COMMANDER-IN-CHIEF" />
                     </>
                   ) : user.role === 'affiliate' ? (
                     <>
                       <TableStat label="VALEUR MARCHANDE ACTIVÉE" value={`$${(stats.total_sales || 0).toLocaleString()}`} />
                       <TableStat label="POINTS DE RÉSEAU ACCUMULÉS" value={stats.points || 0} />
                       <TableStat label="RÉTRIBUTIONS À PAYER" value={`$${(stats.commissions || 0).toLocaleString()}`} />
                       <TableStat label="RANG ACTUEL DU NODE" value={rank.toUpperCase()} />
                     </>
                   ) : (
                     <>
                       <TableStat label="ACQUISITIONS TOTALES" value={stats.purchase_count || 0} />
                       <TableStat label="INVESTISSEMENT CUMULÉ" value={`$${(stats.total_spent || 0).toLocaleString()}`} />
                       <TableStat label="PRODUIT D'INTÉRÊT MAJEUR" value={stats.favorite_product || '---'} />
                       <TableStat label="STATUT DU STAKEHOLDER" value="SOYUZ CUSTOMER NODE" />
                     </>
                   )}
                 </div>
              </div>

              {/* Security Strip & Logo */}
              <div className="mt-10 flex justify-between items-end border-t border-white/5 pt-8">
                 <div className="flex flex-col gap-1">
                    <p className="text-[8px] font-bold text-white/10 uppercase tracking-[0.2em]">PROTECTION DE DONNÉES SOYUZ</p>
                    <div className="flex gap-1">
                       {[...Array(12)].map((_, i) => <div key={i} className="w-1 h-4 bg-soyuz/10 rounded-full" />)}
                    </div>
                 </div>
                 <img src="/assets/logo-short.png" alt="SOX" className="h-5 opacity-5 grayscale" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* External Action Hub */}
      <div className="flex flex-wrap justify-center gap-4 relative z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); onEditPhoto?.(); }}
          className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[#666] hover:text-white hover:border-soyuz/50 hover:bg-soyuz/10 transition-all hover:scale-105 active:scale-95 group shadow-xl"
        >
          <Camera size={16} className="text-soyuz group-hover:scale-110 transition-transform" /> 
          MODIFIER LA PHOTO
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
          className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-[#666] hover:text-white hover:border-soyuz/50 hover:bg-soyuz/10 transition-all hover:scale-105 active:scale-95 group shadow-xl"
        >
          <Download size={16} className="text-soyuz group-hover:translate-y-0.5 transition-transform" /> 
          GÉNÉRER LE DOSSIER
        </button>
      </div>
    </div>
  );
}

function TableStat({ label, value }: { label: string, value: string | number }) {
  return (
    <div className="flex justify-between items-center p-4 bg-white/[0.03] border-l-2 border-soyuz/40 rounded-r-xl hover:bg-white/[0.05] transition-colors group">
       <span className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{label}</span>
       <span className="text-lg font-display italic text-white group-hover:text-soyuz transition-colors">{value}</span>
    </div>
  );
}
