'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ShoppingBag
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function RepDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        setProfile(data);
      }
      setLoading(false);
    }
    getProfile();
  }, []);

  const copyRefLink = () => {
    const link = `${window.location.origin}?ref=${profile?.affiliate_code || 'PROMO'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-soyuz">Loading...</div>;

  return (
    <div className="bg-black min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Header Section */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-2 text-glow-cyan">Mission Control</h1>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
              Welcome, <span className="outline-text-cyan">{profile?.first_name || 'Representative'}</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="border-white/10 text-white rounded-none">
              <Calendar size={16} className="mr-2" /> Last 30 Days
            </Button>
            <Button variant="primary" className="bg-soyuz text-black font-black rounded-none shadow-[0_0_20px_rgba(0,229,255,0.3)]">
              Request Payout
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Sales', value: '$12,450', icon: <TrendingUp className="text-soyuz" />, trend: '+12%' },
          { label: 'Commissions', value: '$1,867', icon: <DollarSign className="text-soyuz" />, trend: '+8%' },
          { label: 'Active Refs', value: '42', icon: <Users className="text-soyuz" />, trend: '+5' },
          { label: 'Current Rank', value: '#4', icon: <Award className="text-soyuz" />, trend: 'Pro Tier' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-carbon-surface border border-white/5 p-8 rounded-3xl relative overflow-hidden group hover:border-soyuz/30 transition-all"
          >
            <div className="absolute inset-0 carbon-texture opacity-5" />
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div className="p-3 bg-black rounded-2xl border border-white/5">{stat.icon}</div>
              <span className="text-[10px] text-soyuz font-black uppercase tracking-widest">{stat.trend}</span>
            </div>
            <div className="relative z-10">
              <p className="text-muted text-[10px] uppercase font-black tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 3. Referral Management */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-carbon-surface border border-white/5 p-10 rounded-3xl relative overflow-hidden">
             <div className="absolute inset-0 carbon-texture opacity-5" />
             <div className="relative z-10">
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-6 italic">Referral Control</h3>
               <p className="text-muted text-sm mb-8 max-w-xl leading-relaxed">
                 Use your unique affiliate code to track sales. Shared this link with your network to earn 15% commission on every eligible purchase.
               </p>
               
               <div className="flex flex-col sm:flex-row gap-4">
                 <div className="flex-1 bg-black border border-white/10 px-6 py-4 flex items-center justify-between group-hover:border-soyuz transition-all">
                   <span className="text-white font-mono text-sm tracking-tight overflow-hidden text-ellipsis whitespace-nowrap">
                     {typeof window !== 'undefined' ? `${window.location.origin}?ref=${profile?.affiliate_code || '...'}` : 'Loading...'}
                   </span>
                   <button onClick={copyRefLink} className="text-muted hover:text-soyuz transition-colors p-2">
                     {copied ? <CheckCircle2 size={18} className="text-soyuz" /> : <Copy size={18} />}
                   </button>
                 </div>
                 <Button variant="primary" className="bg-white text-black font-black uppercase tracking-widest px-8 rounded-none">
                   Social Assets
                 </Button>
               </div>
             </div>
          </div>

          {/* Recent Sales Placeholder */}
          <div className="bg-carbon-surface border border-white/5 p-10 rounded-3xl relative overflow-hidden">
             <div className="absolute inset-0 carbon-texture opacity-5" />
             <div className="relative z-10">
               <div className="flex justify-between items-center mb-8">
                 <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Recent Activity</h3>
                 <button className="text-[10px] text-soyuz font-black uppercase tracking-widest hover:underline">View All</button>
               </div>
               
               <div className="space-y-4">
                 {[1, 2, 3].map((_, i) => (
                   <div key={i} className="flex items-center justify-between p-4 bg-black/40 border border-white/5 rounded-2xl hover:border-white/10 transition-all cursor-pointer group">
                     <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-soyuz/10 rounded-full flex items-center justify-center">
                         <ShoppingBag size={18} className="text-soyuz" />
                       </div>
                       <div>
                         <p className="text-white font-bold text-sm">Order #892{i}</p>
                         <p className="text-muted text-[10px] uppercase">2 hours ago</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <p className="text-white font-black text-sm">+$45.00</p>
                       <p className="text-soyuz text-[10px] font-bold uppercase">Pending</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>
          </div>
        </div>

        {/* 4. Leaderboard / Ranking */}
        <div className="divide-y divide-white/5 space-y-8">
          <div className="bg-carbon-surface border border-white/5 p-10 rounded-3xl relative overflow-hidden h-full">
            <div className="absolute inset-0 carbon-texture opacity-5" />
            <div className="relative z-10">
              <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-8 italic flex items-center gap-3">
                <BarChart3 size={24} className="text-soyuz" /> Elite Ranking
              </h3>

              <div className="space-y-6">
                {[
                  { name: 'Alex Thompson', sales: '$24.5k', change: 'up' },
                  { name: 'David Miller', sales: '$18.2k', change: 'up' },
                  { name: 'Sarah Connor', sales: '$15.9k', change: 'down' },
                  { name: 'You', sales: '$12.4k', isYou: true },
                  { name: 'Mike Ross', sales: '$9.1k', change: 'up' },
                ].map((rep, i) => (
                  <div key={i} className={`flex items-center justify-between p-4 rounded-2xl ${rep.isYou ? 'bg-soyuz/10 border border-soyuz/20' : 'bg-black/20 border border-white/5'}`}>
                    <div className="flex items-center gap-4">
                      <span className={`text-[10px] font-black ${i < 3 ? 'text-soyuz' : 'text-muted'}`}>0{i + 1}</span>
                      <p className={`text-sm font-bold ${rep.isYou ? 'text-white' : 'text-muted'}`}>{rep.name}</p>
                    </div>
                    <p className="text-white font-black text-xs">{rep.sales}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-soyuz rounded-2xl border border-white/10 text-center shadow-[0_0_40px_rgba(0,229,255,0.2)]">
                <p className="text-black font-black uppercase text-xs mb-1 italic">Pro Challenge</p>
                <p className="text-black text-[10px] font-bold uppercase mb-4 opacity-80">Sell 5 more sticks for Silver Tier</p>
                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-black h-full w-[80%]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
