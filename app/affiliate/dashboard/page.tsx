'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Award, 
  CheckCircle2,
  ChevronRight,
  BarChart3,
  Calendar,
  ShoppingBag,
  Zap,
  Share2,
  Trophy,
  Target
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import HockeyCard from '@/components/affiliate/HockeyCard';
import { toPng } from 'html-to-image';

export default function AffiliateDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [pointsConfig, setPointsConfig] = useState({ dollars_per_point: 1000 });
  const [rankThresholds, setRankThresholds] = useState({
    agent: 0,
    pro: 5000,
    elite: 15000,
    legend: 50000
  });
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

        // Fetch Commissions & total sales calculation
        const { data: comms } = await supabase
          .from('commissions')
          .select('*, orders(total)')
          .eq('affiliate_id', user.id)
          .order('created_at', { ascending: false });
        setCommissions(comms || []);

        const { data: sData } = await supabase
           .from('app_settings')
           .select('*');
        
        if (sData) {
          const ptCfg = sData.find(s => s.key === 'points_config')?.value;
          if (ptCfg) setPointsConfig(ptCfg);
          
          const rCfg = sData.find(s => s.key === 'rank_thresholds')?.value;
          if (rCfg) setRankThresholds(rCfg);
        }

        // Fetch Targeted Objectives
        const { data: objData } = await supabase
           .from('affiliate_objectives')
           .select('*')
           .or(`is_global.eq.true,id.in.(${
             // This is a bit complex for a single query if objective_assignments is large
             // but we'll use a subquery or join if Supabase client allows easily.
             // For now, let's fetch global + those where user is assigned.
             'SELECT objective_id FROM objective_assignments WHERE affiliate_id = \'' + user.id + '\''
           })`);
        
        // Simpler approach if subquery fails:
        const { data: directObjs } = await supabase
           .from('affiliate_objectives')
           .select('*, objective_assignments!inner(affiliate_id)')
           .eq('objective_assignments.affiliate_id', user.id);
        
        const { data: globalObjs } = await supabase
           .from('affiliate_objectives')
           .select('*')
           .eq('is_global', true);

        const merged = [...(globalObjs || [])];
        directObjs?.forEach(dobj => {
           if (!merged.find(m => m.id === dobj.id)) merged.push(dobj);
        });
        
        setObjectives(merged.sort((a, b) => a.target_amount - b.target_amount));
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

  const totalSales = commissions.reduce((sum, c) => sum + (c.orders?.total || 0), 0);
  const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const pendingCommissions = commissions.filter(c => c.status === 'pending').reduce((sum, c) => sum + (c.amount || 0), 0);

  // Points Logic
  const ptsRatio = pointsConfig.dollars_per_point || 1000;
  const currentPoints = Math.floor(totalSales / ptsRatio);
  const nextPointProgress = ((totalSales % ptsRatio) / ptsRatio) * 100;

  // Rank Logic
  const calculateRank = (): 'agent' | 'pro' | 'elite' | 'legend' => {
     if (totalSales >= rankThresholds.legend) return 'legend';
     if (totalSales >= rankThresholds.elite) return 'elite';
     if (totalSales >= rankThresholds.pro) return 'pro';
     return 'agent';
  };

  const currentRank = calculateRank();

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">INITIALISATION DU CENTRE DE CONTRÔLE...</p>
    </div>
  );

  return (
    <PageLayout
      title="CONTRÔLE MISSION"
      subtitle="PORTAIL AFFILIÉ ACTIF"
      actions={
        <>
          <button 
            onClick={copyRefLink}
            className="px-8 py-5 bg-soyuz text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_40px_rgba(255,0,0,0.2)]"
          >
            {copied ? <CheckCircle2 size={16} /> : <Share2 size={16} />} 
            {copied ? 'LIEN COPIÉ' : 'PARTAGER LIEN AFFILIÉ'}
          </button>
          <button className="px-8 py-5 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white hover:border-soyuz hover:text-soyuz transition-all flex items-center gap-3">
            <Calendar size={16} /> RAPPORTS
          </button>
        </>
      }
    >
      {/* 2. IDENTITY SECTION (HOT HERO) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-20 items-center">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-6xl font-display italic text-white uppercase leading-tight">
              VOTRE AGENT <span className="outline-text-white">EN ACTION</span>
            </h2>
            <p className="text-[#888888] text-lg uppercase font-bold tracking-widest max-w-xl">
              VOUS ÊTES ACTUELLEMENT RANG <span className="text-soyuz">{currentRank.toUpperCase()}</span>. CONTINUEZ À DÉPLOYER VOTRE RÉSEAU POUR ATTEINDRE LE NIVEAU LÉGENDE.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
               <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest mb-1">CODE D'ACTIVATION</p>
                  <p className="text-xl font-mono text-white tracking-[0.2em]">{profile?.affiliate_code}</p>
               </div>
               <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest mb-1">POINTS TOTALS</p>
                  <p className="text-xl font-display italic text-soyuz">{currentPoints} PTS</p>
               </div>
            </div>
         </div>
         <div className="flex justify-center">
            <HockeyCard 
              user={{
                full_name: profile?.full_name || 'INITIALIZING...',
                avatar_url: profile?.avatar_url,
                role: 'affiliate',
                affiliate_code: profile?.affiliate_code,
                created_at: profile?.created_at || new Date().toISOString()
              }}
              stats={{
                total_sales: totalSales,
                points: currentPoints,
                commissions: totalCommissions
              }}
              rank={currentRank}
              onEditPhoto={() => {
                // Trigger the file input or cropper update
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = async (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    // We'll need to properly integrate this with the existing ImageCropper
                    // For now, let's at least trigger the alert or a simple upload logic
                    alert('Ouverture du sélecteur de photo...');
                  }
                };
                input.click();
              }}
              onDownload={() => {
                const el = document.querySelector('.perspective-1000');
                if (el) toPng(el as HTMLElement).then(dataUrl => {
                  const link = document.createElement('a');
                  link.download = `SOYUZ-CARD-${profile?.full_name}.png`;
                  link.href = dataUrl;
                  link.click();
                });
              }}
            />
         </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
        {[
          { label: 'VENTES TOTALES', value: `$${totalSales.toFixed(2)}`, icon: <TrendingUp size={20} />, sub: 'Volume généré' },
          { label: 'REVENUS TOTAUX', value: `$${totalCommissions.toFixed(2)}`, icon: <DollarSign size={20} />, sub: 'Commissions gagnées' },
          { label: 'POINTS DASHBOARD', value: currentPoints, icon: <Award size={20} />, sub: `${ptsRatio}$ = 1pt` },
          { label: 'STATUT ÉLITE', value: 'TIER PRO', icon: <Trophy size={20} />, sub: 'Top 5% performance' },
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

      {/* 3. OBJECTIVES SECTION */}
      <div className="mb-20 bg-[#0A0A0A] border border-white/5 p-12">
        <div className="flex justify-between items-end mb-12">
          <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">OBJECTIFS DE <span className="outline-text-white">VENTE</span></h3>
          <p className="text-[9px] text-soyuz font-black uppercase tracking-[0.3em]">CADEAUX & RÉCOMPENSES</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Accumulation Bar */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <p className="text-[10px] text-white font-black uppercase tracking-widest">PROCHAIN POINT DASHBOARD</p>
                <p className="text-[9px] text-[#444444] font-bold italic">RÈGLE : 1 POINT PAR CHAQUE {ptsRatio}$ VENDU</p>
              </div>
              <p className="text-lg font-display italic text-soyuz">{nextPointProgress.toFixed(0)}%</p>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${nextPointProgress}%` }}
                className="h-full bg-gradient-to-r from-soyuz/40 to-soyuz shadow-[0_0_20px_rgba(255,0,0,0.3)]"
              />
            </div>
            <div className="flex justify-between text-[8px] font-black text-[#262626] uppercase tracking-widest">
              <span>0$</span>
              <span className="text-white/20">PROGRESSION : ${(totalSales % ptsRatio).toFixed(2)} / {ptsRatio}$</span>
              <span>{ptsRatio}$</span>
            </div>
          </div>

          {/* Dynamic Gift Bars */}
          <div className="grid grid-cols-1 gap-12">
            {objectives.map((obj) => {
               const progress = Math.min(100, (totalSales / obj.target_amount) * 100);
               return (
                 <div key={obj.id} className="space-y-4 group">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <p className="text-xs font-black text-white uppercase tracking-tight group-hover:text-soyuz transition-colors">{obj.title}</p>
                          {obj.is_global && (
                             <span className="text-[7px] border border-white/10 px-1.5 py-0.5 text-[#444444]">PASS GLOBAL</span>
                          )}
                        </div>
                        <p className="text-[9px] text-[#666666] italic leading-none">{obj.description}</p>
                      </div>
                      <p className="text-sm font-display italic text-white">${obj.target_amount}</p>
                    </div>
                    <div className="h-1 bg-white/5 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${progress}%` }}
                         className={`h-full ${progress >= 100 ? 'bg-green-500' : 'bg-white/20'}`}
                       />
                    </div>
                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                       <p className={progress >= 100 ? 'text-green-500' : 'text-[#222222]'}>
                         {progress >= 100 ? 'COMPLÉTÉ' : 'EN COURS'}
                       </p>
                       <p className="text-white/10">{progress.toFixed(1)}%</p>
                    </div>
                 </div>
               );
            })}
            {objectives.length === 0 && (
              <p className="text-[10px] text-[#222222] font-black uppercase italic tracking-widest py-8 border border-dashed border-white/5 text-center">
                AUCUN OBJECTIF SPÉCIFIQUE ACTIF
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Sales / Activity */}
        <div className="lg:col-span-2 space-y-12">
          <div className="bg-[#0A0A0A] border border-white/5 p-12">
            <div className="flex justify-between items-end mb-12">
              <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">FLUX DE <span className="outline-text-white">RÉFÉRENCEMENT</span></h3>
              <p className="text-[9px] text-[#444444] font-black uppercase tracking-[0.3em]">DONNÉES RÉSEAU EN DIRECT</p>
            </div>
            
            <div className="space-y-4">
              {commissions.length > 0 ? commissions.map((comm, i) => (
                <div key={comm.id} className="p-8 bg-black border border-white/5 flex items-center justify-between group hover:border-soyuz/20 transition-all">
                  <div className="flex items-center gap-6">
                    <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center text-soyuz">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight">COMMANDE #{(comm.order_id || '').slice(-6).toUpperCase()}</p>
                      <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">
                        {new Date(comm.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <p className="text-lg font-display italic text-white leading-none">+${comm.amount.toFixed(2)}</p>
                    <p className={`text-[8px] font-black uppercase tracking-widest ${comm.status === 'paid' ? 'text-green-500' : 'text-soyuz'}`}>
                      {comm.status === 'paid' ? 'PAYÉ' : 'EN ATTENTE'}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center border border-dashed border-white/5">
                  <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">AUCUNE TRANSMISSION DÉTECTÉE</p>
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
                { name: 'VOUS', sales: `$${totalSales > 0 ? (totalSales / 1000).toFixed(1) : '0'}K`, tier: 'AGENT', current: true },
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
               <p className="text-[9px] text-[#444444] font-black uppercase tracking-[0.4em] mb-6 text-center">PROGRESSION PROCHAIN TIER</p>
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
    </PageLayout>
  );
}
