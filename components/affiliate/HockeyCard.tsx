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
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const theme = {
    isAdmin: user.role === 'admin' || rank === 'mvp',
    border: rank === 'legend' ? 'border-red-600' : (rank === 'elite' ? 'border-zinc-300' : (user.role === 'admin' ? 'border-yellow-500' : 'border-zinc-800')),
    glow: rank === 'legend' ? 'shadow-red-500/20' : (rank === 'elite' ? 'shadow-white/20' : (user.role === 'admin' ? 'shadow-yellow-500/20' : '')),
    holographic: rank !== 'agent',
    banner: rank === 'mvp' || user.role === 'admin' ? 'bg-yellow-500' : (rank === 'legend' ? 'bg-red-600' : (rank === 'elite' ? 'bg-zinc-200' : 'bg-zinc-800')),
    textColor: rank === 'elite' ? 'text-black' : 'text-white'
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="relative w-[340px] h-[480px] perspective-2000 cursor-pointer group"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
          className="w-full h-full relative preserve-3d"
          animate={{ rotateY: isFlipped ? 180 : rotateY.get(), rotateX: isFlipped ? 0 : rotateX.get() }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* OPAQUE CENTER CORE (Preventing See-Through) */}
          <div className="absolute inset-0.5 bg-black z-0 rounded-[2.2rem]" />

          {/* FRONT SIDE (Young Guns Inspired) */}
          <div className={`absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[6px] ${theme.border} bg-[#050505] flex flex-col z-10 shadow-2xl ${theme.glow}`}>
            {/* 1. Header Branding */}
            <div className="relative z-30 p-8 flex justify-between items-start">
               <div className="flex flex-col gap-0.5 opacity-80">
                  <img src="/assets/logo-short.png" alt="SOX" className="h-6 invert" />
                  <div className="h-[1px] w-full bg-white/30" />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black italic tracking-tighter text-white/40">NODE CLASSIFICATION</p>
                  <p className={`text-[11px] font-black uppercase tracking-widest ${theme.isAdmin ? 'text-yellow-500' : 'text-soyuz'}`}>{rank}</p>
               </div>
            </div>

            {/* 2. Main Subject Image */}
            <div className="absolute inset-0 z-10">
               {user.avatar_url ? (
                 <img src={user.avatar_url} className="w-full h-full object-cover grayscale-[0.1] contrast-[1.1]" />
               ) : (
                 <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={100} className="text-white/5" /></div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
               <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* 3. Nameplate Overlay (Footer) */}
            <div className="absolute inset-x-2 bottom-8 z-40">
               <div className={`w-full ${theme.banner} h-20 rounded-2xl flex flex-col justify-center px-6 relative overflow-hidden shadow-2xl skew-x-[-4deg]`}>
                  <div className="absolute top-0 right-0 w-24 h-full bg-black/10 skew-x-[15deg] translate-x-12" />
                  <div className="flex items-center gap-3">
                     <div className="h-5 w-1 bg-black/20" />
                     <h2 className={`text-3xl font-display italic uppercase leading-none tracking-tighter ${theme.textColor}`}>
                        {user.full_name}
                     </h2>
                  </div>
                  <p className={`text-[9px] font-black uppercase tracking-[0.4em] mt-1 opacity-60 ${theme.textColor}`}>YOUNG NODES // SERIES 2</p>
               </div>
            </div>

            {/* 4. Holographic Foil Finishing */}
            {theme.holographic && (
              <div className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge opacity-50">
                <motion.div 
                  className="absolute inset-[-100%] bg-[linear-gradient(135deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)]"
                  animate={{ x: ['-100%', '100%'], y: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />
              </div>
            )}
          </div>

          {/* BACK SIDE (Updated Pettersson Layout) */}
          <div className="absolute inset-0 backface-hidden rounded-[2.5rem] overflow-hidden border-[6px] border-white/5 bg-white rotate-y-180 flex flex-col z-20">
             <div className="h-full flex flex-col p-6 text-black relative z-10">
                {/* 1. Header: Small Photo & Logo */}
                <div className="flex justify-between items-start mb-4">
                   <p className="text-xs font-black tracking-tighter opacity-20"># {user.affiliate_code?.slice(-3) || '001'}</p>
                   <div className="w-16 h-16 rounded-xl overflow-hidden border border-black/10 shadow-sm relative">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-blue-500/10 mix-blend-overlay" />
                   </div>
                   <img src="/assets/logo-short.png" alt="SOX" className="h-5 grayscale" />
                </div>

                {/* 2. Nameplate Bannier (Accurate Pettersson Style) */}
                <div className="bg-black text-white p-2 px-6 flex justify-between items-center skew-x-[-10deg] mb-6">
                   <h3 className="text-lg font-black italic uppercase tracking-tighter">{user.full_name}</h3>
                   <span className="text-[10px] font-bold opacity-50">{user.role.toUpperCase()}</span>
                </div>

                {/* 3. Bio Information */}
                <div className="grid grid-cols-2 gap-y-1 gap-x-4 mb-6 text-[9px] font-bold uppercase border-b border-black/10 pb-4">
                  <div className="flex justify-between">
                    <span className="opacity-40">CREATED:</span>
                    <span>{new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-40">ORIGIN:</span>
                    <span>SOYUZ NODE</span>
                  </div>
                  <div className="flex justify-between col-span-2">
                    <span className="opacity-40">ID:</span>
                    <span className="font-mono tracking-widest">{user.affiliate_code}</span>
                  </div>
                </div>

                {/* 4. Stat Table (MLB/NHL Grid Style) */}
                <div className="flex-1">
                   <table className="w-full text-[9px] border-collapse">
                      <thead>
                         <tr className="border-b-2 border-black font-black italic">
                            <th className="text-left py-1">YEAR</th>
                            <th className="text-center">NODE</th>
                            <th className="text-center">SALES</th>
                            <th className="text-center">POINTS</th>
                            <th className="text-center">COMM.</th>
                         </tr>
                      </thead>
                      <tbody className="font-bold">
                         <tr className="border-b border-black/5">
                            <td className="py-2">2023-24</td>
                            <td className="text-center">SOX-D</td>
                            <td className="text-center text-blue-600">${(stats.total_sales || stats.total_spent || 0).toLocaleString()}</td>
                            <td className="text-center">{stats.points || stats.purchase_count || 0}</td>
                            <td className="text-center">${(stats.commissions || 0).toLocaleString()}</td>
                         </tr>
                         <tr className="bg-zinc-100 font-black italic">
                            <td className="py-2">TOTAL</td>
                            <td className="text-center">---</td>
                            <td className="text-center">${(stats.total_sales || stats.total_spent || 0).toLocaleString()}</td>
                            <td className="text-center">{stats.points || stats.purchase_count || 0}</td>
                            <td className="text-center">${(stats.commissions || 0).toLocaleString()}</td>
                         </tr>
                      </tbody>
                   </table>

                   {/* Bio Narrative Section */}
                   <div className="mt-8 text-[11px] leading-relaxed italic text-zinc-600">
                      On {new Date(user.created_at).toLocaleDateString()}, {user.full_name.split(' ')[0]} was activated into the SOYUZ network. 
                      Since then, the node has demonstrated exceptional performance as a {rank.toUpperCase()}, 
                      securing significant nodal flow and maintaining a consistent presence in Series 2.
                   </div>
                </div>

                {/* 5. Footer Branding */}
                <div className="mt-auto pt-6 flex justify-between items-end border-t border-zinc-200">
                   <div className="flex gap-4">
                      <img src="/assets/logo-short.png" className="h-4 opacity-50 grayscale" />
                      <div className="text-[7px] text-zinc-400 font-bold uppercase leading-tight">
                         ©2026 SOYUZ NETWORKS ANALYTICS.<br />ALL RIGHTS RESERVED. PRINTED IN MATRICE.
                      </div>
                   </div>
                   <div className="w-8 h-8 rounded-full border-2 border-soyuz/20 flex items-center justify-center opacity-40">
                      <Zap size={14} className="text-soyuz" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Control Buttons (Unchanged Logic) */}
      <div className="flex gap-4 relative z-50">
        <button onClick={(e) => { e.stopPropagation(); onEditPhoto?.(); }} className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#666] hover:text-white transition-all">
          <Camera size={14} /> PHOTO
        </button>
        <button onClick={(e) => { e.stopPropagation(); onDownload?.(); }} className="flex items-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#666] hover:text-white transition-all">
          <Download size={14} /> DOWNLOAD
        </button>
      </div>
    </div>
  );
}
