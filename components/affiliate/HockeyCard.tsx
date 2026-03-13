'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, ShoppingBag, Calendar, Download, Crown, Camera } from 'lucide-react';

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
    network_revenue?: number; // for admin
    active_affiliates?: number; // for admin
  };
  rank?: 'agent' | 'pro' | 'elite' | 'legend' | 'mvp';
  onDownload?: () => void;
  onEditPhoto?: () => void;
}

export default function HockeyCard({ user, stats, rank = 'agent', onDownload, onEditPhoto }: HockeyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getRankTheme = () => {
    if (user.role === 'admin') return {
      border: 'border-[#FFD700]',
      gradient: 'from-[#FFD700] via-[#FFFACD] to-[#DAA520]',
      shimmer: 'opacity-100',
      label: 'MVP SPECIAL EDITION'
    };
    switch (rank) {
      case 'legend': return {
        border: 'border-[#C41E3A]',
        gradient: 'from-[#C41E3A] via-[#FFD700] to-[#C41E3A]',
        shimmer: 'opacity-70',
        label: 'LEGEND'
      };
      case 'elite': return {
        border: 'border-[#E5E4E2]',
        gradient: 'from-[#E5E4E2] via-[#FFFFFF] to-[#E5E4E2]',
        shimmer: 'opacity-40',
        label: 'ELITE'
      };
      case 'pro': return {
        border: 'border-[#CD7F32]',
        gradient: 'from-[#CD7F32] via-[#E6BE8A] to-[#CD7F32]',
        shimmer: 'opacity-20',
        label: 'PRO'
      };
      default: return {
        border: 'border-white/20',
        gradient: 'from-gray-800 to-gray-900',
        shimmer: 'opacity-0',
        label: 'AGENT'
      };
    }
  };

  const theme = getRankTheme();

  return (
    <div className="flex flex-col items-center gap-8">
      <div 
        className="relative w-[320px] h-[480px] perspective-2000 cursor-pointer group select-none"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
        >
          {/* FRONT SIDE */}
          <div className={`absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden border-4 shadow-2xl bg-[#080808] ${theme.border} z-10`}>
             {/* Holographic Shimmer Effect */}
             <div className={`absolute inset-0 pointer-events-none z-20 overflow-hidden ${theme.shimmer}`}>
                <motion.div 
                  animate={{ 
                    x: ['-100%', '100%'],
                    y: ['-100%', '100%']
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear" 
                  }}
                  className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent skew-x-12 blur-xl"
                  style={{ mixBlendMode: 'overlay' }}
                />
             </div>

             {/* Header */}
             <div className="p-6 relative z-10 flex justify-between items-center">
                <div className={`px-4 py-1.5 rounded-full bg-gradient-to-r ${theme.gradient} animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.1)]`}>
                  <p className="text-[9px] font-black text-black uppercase tracking-[0.2em]">{theme.label}</p>
                </div>
                <img src="/assets/logo-short.png" alt="SOYUZ" className="h-6 opacity-30 invert" />
             </div>

             {/* Main Image */}
             <div className="absolute inset-0 z-0">
               {user.avatar_url ? (
                 <img 
                   src={user.avatar_url} 
                   alt={user.full_name} 
                   className="w-full h-full object-cover grayscale-[0.2] contrast-[1.1]"
                 />
               ) : (
                 <div className="w-full h-full bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
                    <Star size={80} className="text-white/5" />
                 </div>
               )}
               {/* Vignette & Gradient Overlays */}
               <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent" />
               <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
             </div>

             {/* Footer Content */}
             <div className="absolute inset-x-0 bottom-0 p-8 z-10">
                <div className="space-y-1">
                  <motion.h3 
                    layoutId="name"
                    className={`text-4xl font-display italic uppercase leading-none tracking-tight ${user.role === 'admin' ? 'text-yellow-400' : 'text-white'}`}
                  >
                    {user.full_name.split(' ')[0]}
                    <br />
                    <span className="outline-text-white opacity-80">{user.full_name.split(' ').slice(1).join(' ')}</span>
                  </motion.h3>
                  
                  <div className="flex justify-between items-end pt-4 border-t border-white/10 mt-4">
                    <div className="space-y-1">
                      <p className="text-[8px] text-[#555] font-black uppercase tracking-[0.3em]">IDENTIFICATION</p>
                      <p className="text-xs font-mono text-white/60 tracking-widest">{user.affiliate_code || '---'}</p>
                    </div>
                    <div className="flex gap-2 opacity-50">
                      {user.role === 'admin' ? <Crown size={20} className="text-yellow-500" /> : <Trophy size={20} className="text-soyuz" />}
                    </div>
                  </div>
                </div>
             </div>
          </div>

          {/* BACK SIDE */}
          <div className="absolute inset-0 backface-hidden rounded-[2rem] overflow-hidden border-4 border-white/10 bg-[#0D0D0D] rotate-y-180 z-20">
             <div className="h-full flex flex-col p-8 relative z-10">
                {/* Back Header */}
                <div className="flex justify-between items-start mb-8">
                   <div className="space-y-1">
                      <p className="text-[10px] font-black text-soyuz uppercase tracking-[0.3em]">SOYUZ AUTHENTIC</p>
                      <p className="text-[8px] text-[#444] font-bold italic uppercase">{new Date(user.created_at).toLocaleDateString()}</p>
                   </div>
                   <img src="/assets/logo-short.png" alt="SOYUZ" className="h-4 grayscale opacity-20" />
                </div>

                {/* Miniature & Identity */}
                <div className="flex gap-6 mb-10 items-center bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                   <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-white/10 shrink-0">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-lg font-display italic text-white uppercase leading-none">{user.full_name}</p>
                      <p className="text-[9px] text-[#666] font-black uppercase tracking-widest">{user.role.toUpperCase()} NODE</p>
                   </div>
                </div>

                {/* Detailed Stats Grid */}
                <div className="grid grid-cols-2 gap-y-10 gap-x-6 flex-1">
                  {user.role === 'admin' ? (
                    <>
                      <StatItem label="FLUX GLOBAL" value={`$${(stats.network_revenue || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-yellow-500" />} />
                      <StatItem label="UNITÉS ACTIVES" value={stats.active_affiliates || 0} icon={<Star size={14} className="text-yellow-500" />} />
                      <StatItem label="VOLUME VENTES" value={stats.total_sales || 0} icon={<Target size={14} className="text-yellow-500" />} />
                      <StatItem label="TYPE ACCÈS" value="MASTER" icon={<Crown size={14} className="text-yellow-500" />} />
                    </>
                  ) : user.role === 'affiliate' ? (
                    <>
                      <StatItem label="VENTES" value={`$${(stats.total_sales || 0).toLocaleString()}`} icon={<Target size={14} className="text-soyuz" />} />
                      <StatItem label="POINTS" value={stats.points || 0} icon={<Star size={14} className="text-yellow-400" />} />
                      <StatItem label="COMMISSIONS" value={`$${(stats.commissions || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-green-500" />} />
                      <StatItem label="GRADE" value={rank.toUpperCase()} icon={<Trophy size={14} className="text-white/20" />} />
                    </>
                  ) : (
                    <>
                      <StatItem label="COMMANDES" value={stats.purchase_count || 0} icon={<ShoppingBag size={14} className="text-soyuz" />} />
                      <StatItem label="DÉPENSES" value={`$${(stats.total_spent || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-green-500" />} />
                      <StatItem label="MVP" value={stats.favorite_product || '---'} icon={<Star size={14} className="text-yellow-500" />} />
                      <StatItem label="CLIENT DEPUIS" value={new Date(user.created_at).getFullYear()} icon={<Calendar size={14} className="text-white/20" />} />
                    </>
                  )}
                </div>

                {/* Holographic Security Thread */}
                <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                  <div className="flex gap-0.5">
                    {[...Array(15)].map((_, i) => <div key={i} className="w-0.5 h-4 bg-white/[0.05]" />)}
                  </div>
                  <p className="text-[8px] text-[#333] font-black uppercase tracking-[0.5em]">SOYUZ NETWORKS PROPRIETARY</p>
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
            className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all group"
          >
            <Camera size={14} className="group-hover:scale-110 transition-transform" /> MODIFIER LA PHOTO
          </button>
        )}
        
        {onDownload && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDownload(); }}
            className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#888] hover:text-white hover:border-white/20 hover:bg-white/[0.08] transition-all group"
          >
            <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> TÉLÉCHARGER (.PNG)
          </button>
        )}
      </div>
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="space-y-1.5 p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl hover:border-white/10 transition-colors">
      <div className="flex items-center gap-2 opacity-30">
        {icon}
        <p className="text-[8px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-xl font-display italic text-white leading-none truncate">{value}</p>
    </div>
  );
}
