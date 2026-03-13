'use client';

import { motion } from 'framer-motion';
import { Trophy, Star, Target, DollarSign, TrendingUp } from 'lucide-react';

interface CardBackProps {
  user: {
    full_name: string;
    avatar_url?: string;
    affiliate_code?: string;
    created_at: string;
  };
  stats: {
    total_sales?: number;
    active_affiliates?: number;
    points?: number;
  };
}

export default function CardBack({ user, stats }: CardBackProps) {
  const lastName = user.full_name.split(' ').slice(1).join(' ') || 'Lacoursière';

  return (
    <div 
      style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
      className="absolute inset-0 w-full h-full rounded-[4px] bg-[#0A0A0A] border border-white/5 shadow-2xl overflow-hidden flex flex-col p-6 text-white"
    >
      {/* Header with ID */}
      <div className="flex justify-between items-start mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-soyuz/10 border border-soyuz/20 rounded-full flex items-center justify-center p-2">
            <img src="/assets/logo-short.png" className="w-full h-full object-contain invert opacity-60" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-tight text-white">SOYUZ</p>
            <p className="text-[8px] font-bold text-white/30 uppercase tracking-[0.2em]">ANALYTICS COMMANDER</p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="px-3 py-1 bg-soyuz/10 border border-soyuz/20 rounded-full text-[8px] font-mono text-soyuz mb-1">
            #001
          </div>
          <p className="text-[6px] font-bold text-white/20 uppercase tracking-widest">NODE-ID: {user.affiliate_code || 'UNSYNCED'}</p>
        </div>
      </div>

      {/* Profile Mini Block */}
      <div className="flex items-center gap-4 mb-8 p-3 bg-white/[0.02] border border-white/5 rounded-xl">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/10 bg-black">
          <img src={user.avatar_url} className="w-full h-full object-cover grayscale opacity-60" />
        </div>
        <div>
          <p className="text-[7px] font-black text-white/20 tracking-widest mb-1">AUTHORIZED PERSONNEL</p>
          <p className="text-sm font-display italic font-black text-white leading-none truncate w-32 uppercase">{lastName}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="flex-1 space-y-4">
        <p className="text-[8px] font-black text-soyuz tracking-[0.4em] uppercase mb-2">MATRICE PERFORMANCE DATA</p>
        <div className="grid grid-cols-2 gap-3">
          <StatBlock label="LIQUIDITÉ" value={`$${(stats.total_sales || 0).toLocaleString()}`} icon={<DollarSign size={8} />} />
          <StatBlock label="NODES" value={stats.active_affiliates || 0} icon={<Star size={8} />} />
          <StatBlock label="SCORE" value={stats.points || 0} icon={<Trophy size={8} />} />
          <StatBlock label="SYNC" value="98.4%" icon={<TrendingUp size={8} />} />
        </div>
        <div className="p-4 bg-soyuz/5 border border-soyuz/10 rounded-xl mt-2">
          <p className="text-[7px] leading-relaxed text-white/40 font-mono italic">
            "Nodal activation recorded at {new Date(user.created_at).toLocaleDateString()}. Matrix integrity stable. Synchronization at maximum efficiency."
          </p>
        </div>
      </div>

      {/* Footer Matrix */}
      <div className="mt-8 border-t border-white/10 pt-6 flex justify-between items-center opacity-40">
        <div>
          <p className="text-[6px] font-black tracking-[0.4em] uppercase mb-1">ENCRYPTED 2026 // NODE DATA SECURE</p>
          <p className="text-[10px] font-mono tracking-tighter text-white/40">SOUYZ-OS_V4.2.0_STABLE</p>
        </div>
        <div className="flex gap-2">
          <div className="w-6 h-6 rounded bg-white/10" />
          <div className="w-6 h-6 rounded bg-soyuz/20" />
        </div>
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
