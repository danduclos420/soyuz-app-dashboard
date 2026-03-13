'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, ShoppingBag, Calendar, Download, Crown } from 'lucide-react';

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
}

export default function HockeyCard({ user, stats, rank = 'agent', onDownload }: HockeyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getRankColor = () => {
    if (user.role === 'admin') return 'from-yellow-400 via-white to-yellow-600';
    switch (rank) {
      case 'legend': return 'from-red-600 via-white to-red-600';
      case 'elite': return 'from-yellow-400 via-yellow-200 to-yellow-600';
      case 'pro': return 'from-gray-300 via-white to-gray-500';
      default: return 'from-red-900 to-red-600';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div 
        className="relative w-[320px] h-[480px] perspective-1000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d transition-all duration-700"
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          {/* FRONT SIDE */}
          <div className={`absolute inset-0 backface-hidden rounded-3xl overflow-hidden border-4 ${user.role === 'admin' ? 'border-yellow-500/50 shadow-[0_0_50px_rgba(255,215,0,0.2)]' : 'border-white/10 shadow-2xl'} bg-[#0a0a0a]`}>
            {/* Holographic effect for Dany */}
            {user.role === 'admin' && (
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-transparent to-white/5 animate-pulse pointer-events-none" />
            )}
            
            {/* Card Content */}
            <div className="h-full flex flex-col p-6 relative z-10">
              {/* Header: Rank / Logo */}
              <div className="flex justify-between items-start mb-6">
                <div className={`px-3 py-1 bg-gradient-to-r ${getRankColor()} rounded-full`}>
                  <p className="text-[10px] font-black text-black uppercase tracking-widest">
                    {user.role === 'admin' ? 'MVP SPECIAL EDITION' : rank === 'agent' ? 'AGENT' : rank.toUpperCase()}
                  </p>
                </div>
                <img src="/assets/logo-short.png" alt="SOYUZ" className="h-8 w-auto opacity-40" />
              </div>

              {/* Photo Area */}
              <div className="flex-1 relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10" />
                <div className={`w-full h-full rounded-2xl overflow-hidden border ${user.role === 'admin' ? 'border-yellow-500/30' : 'border-white/5'}`}>
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-white/5 flex items-center justify-center">
                      <Star size={60} className="text-white/10" />
                    </div>
                  )}
                </div>
              </div>

              {/* Footer: Name & Code */}
              <div className="space-y-2 mt-auto">
                <h3 className={`text-3xl font-display italic uppercase leading-none ${user.role === 'admin' ? 'text-yellow-400' : 'text-white'}`}>
                  {user.full_name}
                </h3>
                <div className="flex justify-between items-end">
                  {user.role !== 'customer' && (
                    <p className="text-soyuz font-mono text-sm tracking-[0.2em]">{user.affiliate_code}</p>
                  )}
                  {user.role === 'admin' && (
                    <div className="flex gap-1">
                      <Crown size={18} className="text-yellow-500 drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]" />
                      <Trophy size={18} className="text-yellow-500" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 0)', backgroundSize: '20px 20px' }} />
          </div>

          {/* BACK SIDE */}
          <div className={`absolute inset-0 backface-hidden rounded-3xl overflow-hidden border-4 ${user.role === 'admin' ? 'border-yellow-500/50' : 'border-white/10'} bg-[#0D0D0D] rotate-y-180`}>
             <div className="h-full flex flex-col p-8 relatives z-10">
                <div className="flex justify-between items-center mb-10 border-b border-white/5 pb-4">
                  <p className="text-[10px] font-black text-[#444444] uppercase tracking-widest">DOSSIER OPÉRATIONNEL</p>
                  <img src="/assets/logo-short.png" alt="SOYUZ" className="h-4 w-auto grayscale opacity-20" />
                </div>

                <div className="grid grid-cols-2 gap-8 flex-1">
                  {user.role === 'admin' ? (
                    <>
                      <StatItem label="RÉSEAU GLOBAL" value={`$${(stats.network_revenue || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-yellow-500" />} />
                      <StatItem label="AFFILIÉS ACTIFS" value={stats.active_affiliates || 0} icon={<Star size={14} className="text-yellow-500" />} />
                      <StatItem label="VENTES TOTALES" value={stats.total_sales || 0} icon={<Target size={14} className="text-yellow-500" />} />
                      <StatItem label="CONTRÔLE" value="MASTER" icon={<Crown size={14} className="text-yellow-500" />} />
                    </>
                  ) : user.role === 'affiliate' ? (
                    <>
                      <StatItem label="VENTES TOTALES" value={`$${(stats.total_sales || 0).toLocaleString()}`} icon={<Target size={14} className="text-soyuz" />} />
                      <StatItem label="POINTS" value={stats.points || 0} icon={<Star size={14} className="text-yellow-500" />} />
                      <StatItem label="COMMISSIONS" value={`$${(stats.commissions || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-green-500" />} />
                      <StatItem label="MEMBRE DEPUIS" value={new Date(user.created_at).getFullYear()} icon={<Calendar size={14} className="text-white/20" />} />
                    </>
                  ) : (
                    <>
                      <StatItem label="COMMANDES" value={stats.purchase_count || 0} icon={<ShoppingBag size={14} className="text-soyuz" />} />
                      <StatItem label="DÉPENSES" value={`$${(stats.total_spent || 0).toLocaleString()}`} icon={<DollarSign size={14} className="text-green-500" />} />
                      <StatItem label="MVP PRODUIT" value={stats.favorite_product || '---'} icon={<Star size={14} className="text-yellow-500" />} />
                      <StatItem label="CLIENT DEPUIS" value={new Date(user.created_at).getFullYear()} icon={<Calendar size={14} className="text-white/20" />} />
                    </>
                  )}
                </div>

                <div className="mt-auto pt-8 border-t border-white/5">
                  <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest mb-2 text-center">AUTORISATION SOYUZ RÉSEAU</p>
                  <div className="flex justify-center gap-1 opacity-20">
                    {[...Array(20)].map((_, i) => <div key={i} className="w-1 h-3 bg-white" />)}
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {onDownload && (
        <button 
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-[#888888] hover:text-white hover:border-white/20 transition-all group"
        >
          <Download size={14} className="group-hover:translate-y-0.5 transition-transform" /> TÉLÉCHARGER LA CARTE
        </button>
      )}
    </div>
  );
}

function StatItem({ label, value, icon }: { label: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 opacity-50">
        {icon}
        <p className="text-[9px] font-black uppercase tracking-widest">{label}</p>
      </div>
      <p className="text-xl font-display italic text-white leading-none whitespace-nowrap overflow-hidden text-ellipsis">{value}</p>
    </div>
  );
}
