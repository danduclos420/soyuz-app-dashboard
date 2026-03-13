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
  
  // Interactive mouse tracking for holographic depth
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  // Hardcode Dany's name for admin/mvp as requested
  const displayName = (user.role === 'admin' || rank === 'mvp') ? 'Dany Lacoursière' : user.full_name;

  const theme = {
    isAdmin: user.role === 'admin' || rank === 'mvp',
    border: rank === 'legend' ? 'border-red-600' : (rank === 'elite' ? 'border-zinc-300' : (user.role === 'admin' ? 'border-yellow-500' : 'border-zinc-800')),
    glow: rank === 'legend' ? 'shadow-red-500/30' : (rank === 'elite' ? 'shadow-white/30' : (user.role === 'admin' ? 'shadow-yellow-500/40' : '')),
    holographic: rank !== 'agent',
    banner: rank === 'mvp' || user.role === 'admin' ? 'bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600' : (rank === 'legend' ? 'bg-gradient-to-r from-red-600 via-red-500 to-red-600' : (rank === 'elite' ? 'bg-gradient-to-r from-zinc-200 via-white to-zinc-200' : 'bg-zinc-800')),
    label: rank === 'mvp' ? 'MVP SPECIAL EDITION' : (rank === 'legend' ? 'LEGEND SERIES' : (rank === 'elite' ? 'ELITE STATUS' : 'YOUNG NODES')),
    textColor: rank === 'elite' ? 'text-black' : 'text-white'
  };

  return (
    <div className="flex flex-col items-center gap-10">
      <div 
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { x.set(0); y.set(0); }}
        className="relative w-[340px] h-[500px] perspective-2000 cursor-pointer group select-none shadow-2xl rounded-[2.5rem]"
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <motion.div
           className="w-full h-full relative"
           initial={false}
           animate={{ rotateY: isFlipped ? 180 : rotateY.get(), rotateX: isFlipped ? 0 : rotateX.get() }}
           transition={{ type: "spring", stiffness: 100, damping: 20 }}
           style={{ transformStyle: 'preserve-3d' }}
        >
          {/* OPAQUE CENTER CORE - The "Sandwich" middle layer */}
          <div 
            className="absolute inset-[1px] bg-black z-10 rounded-[2.4rem] border border-white/5" 
            style={{ transform: 'translateZ(-1px)' }}
          />

          {/* FRONT SIDE (Young Guns Inspired) */}
          <div 
            className={`absolute inset-0 rounded-[2.5rem] overflow-hidden border-[6px] ${theme.border} bg-[#050505] flex flex-col ${theme.glow}`}
            style={{ backfaceVisibility: 'hidden', transform: 'translateZ(1px)' }}
          >
            {/* Header: Logo & Node Class */}
            <div className="relative z-30 p-8 flex justify-between items-start">
               <div className="flex flex-col gap-0.5">
                  <img src="/assets/logo-short.png" alt="SOX" className="h-7 invert drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
                  <div className="h-[2px] w-full bg-white animate-pulse" />
               </div>
               <div className="text-right">
                  <p className="text-[10px] font-black italic tracking-tighter text-soyuz">NODE GRADE //</p>
                  <p className={`text-[12px] font-black uppercase tracking-widest ${theme.isAdmin ? 'text-yellow-500' : 'text-white'}`}>{rank}</p>
               </div>
            </div>

            {/* Main Player Interaction Area (Photo) */}
            <div className="absolute inset-0 z-10">
               {user.avatar_url ? (
                 <img src={user.avatar_url} className="w-full h-full object-cover contrast-[1.1] grayscale-[0.05]" />
               ) : (
                 <div className="w-full h-full bg-neutral-900 flex items-center justify-center"><Star size={100} className="text-white/5" /></div>
               )}
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
               <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
            </div>

            {/* Footer Nameplate (Young Guns Style) */}
            <div className="absolute inset-x-0 bottom-0 z-40 p-4">
               <div className={`w-full ${theme.banner} h-24 rounded-3xl flex flex-col justify-center px-8 relative overflow-hidden shadow-[0_-10px_30px_rgba(0,0,0,0.5)] skew-x-[-2deg]`}>
                  {/* Banner Decoration */}
                  <div className="absolute -right-4 -top-8 w-32 h-32 bg-black/10 rotate-45" />
                  <div className="flex flex-col relative z-10">
                     <p className={`text-[11px] font-black italic tracking-[0.2em] mb-1 ${theme.textColor} opacity-60`}>{theme.label}</p>
                     <h2 className={`text-4xl font-display italic uppercase leading-none tracking-tighter ${theme.textColor} drop-shadow-md`}>
                        {displayName}
                     </h2>
                     <div className="h-1 w-12 bg-black/10 mt-2" />
                  </div>
               </div>
            </div>

            {/* Holographic "WOW" Finishing */}
            {theme.holographic && (
              <div className="absolute inset-0 pointer-events-none z-50 mix-blend-color-dodge opacity-60 overflow-hidden">
                <motion.div 
                   className="absolute inset-[-150%] bg-[linear-gradient(135deg,transparent_20%,rgba(255,255,255,0.4)_50%,transparent_80%)]"
                   animate={{ 
                      x: ['-50%', '50%'],
                      y: ['-50%', '50%']
                   }}
                   transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                />
                {/* Random Sparkles for High Ranks */}
                {(rank === 'legend' || theme.isAdmin) && (
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.8)_0%,transparent_40%)]"
                        style={{ 
                          '--x': `${(mouseXSpring.get() + 0.5) * 100}%`,
                          '--y': `${(mouseYSpring.get() + 0.5) * 100}%`
                        } as any} />
                )}
              </div>
            )}
            
            {/* Glossy Overlay */}
            <div className="absolute inset-0 z-50 pointer-events-none opacity-20 bg-gradient-to-br from-white/20 via-transparent to-black/20" />
          </div>

          {/* BACK SIDE (Pettersson Accurate Layout) */}
          <div 
            className="absolute inset-0 rounded-[2.5rem] overflow-hidden border-[6px] border-white/10 bg-white flex flex-col shadow-2xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
          >
             <div className="h-full flex flex-col p-8 text-black relative z-10">
                {/* Pettersson Header */}
                <div className="flex justify-between items-start mb-6">
                   <p className="text-xl font-black tracking-tighter text-black/10 font-mono italic">#{user.affiliate_code?.slice(-3) || '001'}</p>
                   <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-black/5 shadow-inner bg-zinc-50 relative group">
                      <img src={user.avatar_url || '/assets/logo-short.png'} className="w-full h-full object-cover grayscale-[0.3]" />
                      <div className="absolute inset-0 border border-black/10 rounded-2xl" />
                   </div>
                   <div className="flex flex-col items-end gap-1">
                      <img src="/assets/logo-short.png" alt="SOX" className="h-7 grayscale contrast-200" />
                      <div className="h-1 w-10 bg-black/20" />
                   </div>
                </div>

                {/* Pettersson Middle Nameplate */}
                <div className="bg-black text-white py-3 px-8 flex justify-between items-center skew-x-[-12deg] mb-8 shadow-lg">
                   <h3 className="text-2xl font-black italic uppercase tracking-tighter skew-x-[12deg]">{displayName}</h3>
                   <span className="text-xs font-bold opacity-40 skew-x-[12deg] tracking-widest">{user.role.toUpperCase()}</span>
                </div>

                {/* Bio Grid (MLB/NHL Style) */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-8 mb-8 text-[10px] font-black uppercase text-zinc-400 border-b border-zinc-100 pb-6">
                  <div className="flex justify-between border-b border-zinc-50 pb-1"><span>YEAR JOINED:</span><span className="text-black">{new Date(user.created_at).getFullYear()}</span></div>
                  <div className="flex justify-between border-b border-zinc-50 pb-1"><span>NODE CLASS:</span><span className="text-black">{rank.toUpperCase()}</span></div>
                  <div className="flex justify-between border-b border-zinc-50 pb-1"><span>ID CODE:</span><span className="text-black font-mono">{user.affiliate_code || '---'}</span></div>
                  <div className="flex justify-between border-b border-zinc-50 pb-1"><span>SOURCE:</span><span className="text-black">SOYUZ NODES</span></div>
                </div>

                {/* Stat Table (Accurate Pettersson Stats Grid) */}
                <div className="flex-1">
                   <div className="overflow-hidden border border-black/5 rounded-lg bg-zinc-50/50">
                      <table className="w-full text-[10px] border-collapse">
                         <thead>
                            <tr className="bg-zinc-100/80 border-b border-black/10 font-black italic text-zinc-500">
                               <th className="text-left p-3">YEAR</th>
                               <th className="text-center p-3">NODE</th>
                               <th className="text-center p-3">SALES</th>
                               <th className="text-center p-3">POINTS</th>
                               <th className="text-center p-3">COMM.</th>
                            </tr>
                         </thead>
                         <tbody className="font-bold">
                            <tr className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                               <td className="p-3">2023-24</td>
                               <td className="text-center p-3">SOX-D</td>
                               <td className="text-center p-3 text-soyuz">${(stats.total_sales || 0).toLocaleString()}</td>
                               <td className="text-center p-3">{stats.points || 0}</td>
                               <td className="text-center p-3">${(stats.commissions || 0).toLocaleString()}</td>
                            </tr>
                            <tr className="bg-zinc-200/50 font-black italic text-black">
                               <td className="p-3 uppercase">TOTALS</td>
                               <td className="text-center p-3">---</td>
                               <td className="text-center p-3">${(stats.total_sales || 0).toLocaleString()}</td>
                               <td className="text-center p-3">{stats.points || 0}</td>
                               <td className="text-center p-3">${(stats.commissions || 0).toLocaleString()}</td>
                            </tr>
                         </tbody>
                      </table>
                   </div>

                   {/* Bio Narrative Section (Pettersson Style) */}
                   <div className="mt-8 text-[11px] leading-relaxed italic text-zinc-500 font-medium text-justify">
                      On {new Date(user.created_at).toLocaleDateString()}, {displayName.split(' ')[0]} officially integrated the SOYUZ ecosystem. Since activation, the node has shown remarkable resilience as a {rank.toUpperCase()}, consistently delivering high-volume output within the Series 2 nodal framework. Lacoursière continues to set benchmarks for future node generations.
                   </div>
                </div>

                {/* Footer Branding Area */}
                <div className="mt-auto pt-6 flex justify-between items-end border-t-2 border-zinc-100">
                   <div className="flex items-center gap-4">
                      <img src="/assets/logo-short.png" className="h-5 grayscale contrast-150" />
                      <div className="text-[7px] text-zinc-300 font-black uppercase leading-tight tracking-widest">
                         ©2026 SOYUZ ANALYTICS.<br />PRINTED IN THE MATRICE.
                      </div>
                   </div>
                   <div className="flex gap-1 group">
                      <Zap size={18} className="text-soyuz opacity-20 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      <Trophy size={18} className="text-zinc-200" />
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </div>

      {/* Action Hub (External) */}
      <div className="flex flex-wrap justify-center gap-4 relative z-50">
        <button 
          onClick={(e) => { e.stopPropagation(); onEditPhoto?.(); }}
          className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-soyuz hover:bg-soyuz/10 transition-all active:scale-95 group shadow-2xl"
        >
          <Camera size={16} className="text-soyuz group-hover:scale-110 transition-transform" /> 
          PHOTO COMMAND
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onDownload?.(); }}
          className="flex items-center gap-3 px-8 py-5 bg-white/5 border border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-[0.3em] text-zinc-500 hover:text-white hover:border-soyuz hover:bg-soyuz/10 transition-all active:scale-95 group shadow-2xl"
        >
          <Download size={16} className="text-soyuz group-hover:translate-y-0.5 transition-transform" /> 
          EXTRACT DATA
        </button>
      </div>
    </div>
  );
}
