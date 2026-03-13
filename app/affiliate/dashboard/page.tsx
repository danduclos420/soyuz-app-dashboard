'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award, 
  Copy, 
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Calendar,
  ShoppingBag,
  Zap,
  Share2,
  Trophy
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function RepDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(profileData);

        // Fetch Commissions
        const { data: comms } = await supabase
          .from('commissions')
          .select('*, orders(total, customer_name)')
          .eq('rep_id', user.id)
          .order('created_at', { ascending: false });
        setCommissions(comms || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const copyRefLink = () => {
    const link = `${window.location.host}?ref=${profile?.affiliate_code || 'PROMO'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.amount || 0), 0);

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">INITIALIZING MISSION CONTROL...</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 selection:bg-soyuz selection:text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* 1. HEADER AREA */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 border-b border-white/5 pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-6 uppercase tracking-[0.2em] rounded-full">
              REP PORTAL ACTIVE
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              MISSION <br /><span className="outline-text-white">CONTROL</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={copyRefLink}
              className="px-8 py-5 bg-soyuz text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,0,0,0.2)]"
            >
              {copied ? <CheckCircle2 size={16} /> : <Share2 size={16} />} 
              {copied ? 'LINK COPIED' : 'SHARE REFERRAL LINK'}
            </button>
            <button className="px-8 py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:border-soyuz hover:text-soyuz transition-all flex items-center gap-3">
              <Calendar size={16} /> REPORTING
            </button>
          </motion.div>
        </div>

        {/* 2. STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
          {[
            { label: 'TOTAL EARNINGS', value: `$${totalCommissions.toFixed(2)}`, icon: <DollarSign size={20} />, sub: 'All-time commission' },
            { label: 'PENDING PAYOUT', value: `$${pendingCommissions.toFixed(2)}`, icon: <Zap size={20} />, sub: 'Current cycle balance' },
            { label: 'NETWORK SIZE', value: commissions.length, icon: <Users size={20} />, sub: 'Total successful referrals' },
            { label: 'ELITE STATUS', value: 'PRO TIER', icon: <Trophy size={20} />, sub: 'Top 5% performer' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#0A0A0A] border border-white/5 p-10 group hover:border-soyuz/20 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-soyuz/10 transition-colors">
                {stat.icon}
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest mb-1">{stat.label}</p>
                  <p className="text-3xl font-display italic text-white leading-none">{stat.value}</p>
                </div>
                <p className="text-[9px] text-[#222222] font-black uppercase tracking-widest group-hover:text-soyuz/40 transition-colors">{stat.sub}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Recent Sales / Activity */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-[#0A0A0A] border border-white/5 p-12">
              <div className="flex justify-between items-end mb-12">
                <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">REFERRAL <span className="outline-text-white">FEED</span></h3>
                <p className="text-[9px] text-[#444444] font-black uppercase tracking-[0.3em]">LIVE NETWORK DATA</p>
              </div>
              
              <div className="space-y-4">
                {commissions.length > 0 ? commissions.map((comm, i) => (
                  <div key={comm.id} className="p-8 bg-black border border-white/5 flex items-center justify-between group hover:border-soyuz/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-soyuz">
                        <ShoppingBag size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-black text-white uppercase tracking-tight">ORDER #{(comm.order_id || '').slice(-6).toUpperCase()}</p>
                        <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">
                          {new Date(comm.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-display italic text-white leading-none">+${comm.amount.toFixed(2)}</p>
                      <p className={`text-[8px] font-black uppercase tracking-widest ${comm.status === 'paid' ? 'text-green-500' : 'text-soyuz'}`}>
                        {comm.status}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="py-20 text-center border border-dashed border-white/5">
                    <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">NO TRANSMISSIONS DETECTED</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Leaderboard / Ranking */}
          <div className="space-y-12">
            <div className="bg-[#0A0A0A] border border-white/5 p-12 relative overflow-hidden h-full">
              <div className="absolute top-0 right-0 w-24 h-24 bg-soyuz/5 blur-3xl pointer-events-none" />
              <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12 flex items-center gap-4">
                <BarChart3 size={24} className="text-soyuz" /> TOP <span className="outline-text-white">NODES</span>
              </h3>

              <div className="space-y-8">
                {[
                  { name: 'ALEX T.', sales: '$42.1K', tier: 'LEGEND' },
                  { name: 'SARAH C.', sales: '$38.5K', tier: 'ELITE' },
                  { name: 'DAVID M.', sales: '$12.4K', tier: 'PRO' },
                  { name: 'YOU', sales: `$${totalCommissions > 0 ? (totalCommissions * 6.6).toFixed(1) : '0'}K`, tier: 'AGENT', current: true },
                ].map((rep, i) => (
                  <div key={i} className={`flex items-center justify-between p-5 ${rep.current ? 'bg-soyuz/10 border border-soyuz/20' : 'bg-black border border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black ${i < 3 ? 'text-soyuz' : 'text-[#444444]'}`}>0{i + 1}</span>
                      <div>
                        <p className={`text-[11px] font-black uppercase tracking-tight ${rep.current ? 'text-white' : 'text-[#888888]'}`}>{rep.name}</p>
                        <p className="text-[8px] font-black text-[#444444] tracking-widest">{rep.tier}</p>
                      </div>
                    </div>
                    <p className="text-sm font-display italic text-white">{rep.sales}</p>
                  </div>
                ))}
              </div>

              <div className="mt-20 p-8 border border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent">
                 <p className="text-[9px] text-[#444444] font-black uppercase tracking-[0.4em] mb-6 text-center">NEXT TIER PROGRESS</p>
                 <div className="h-1 text-xs flex mt-2 overflow-hidden bg-white/5 mb-4">
                    <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-soyuz"></div>
                 </div>
                 <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-white/20">
                    <span>AGENT</span>
                    <span className="text-soyuz">PRO</span>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
