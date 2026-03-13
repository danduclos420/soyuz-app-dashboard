'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
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
  Target,
  Mail,
  Home,
  Star
} from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import HockeyCard from '@/components/affiliate/HockeyCard';
import { toast } from 'react-hot-toast';
import SoyuzButton from '@/components/ui/SoyuzButton';

export default function AffiliateDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [commissions, setCommissions] = useState<any[]>([]);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'home' | 'objectives' | 'messages' | 'leaderboard'>('home');
  const [copied, setCopied] = useState(false);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  // Settings / Config (Defaults as per Master Plan)
  const ptsRatio = 1000;
  const rankThresholds = {
    agent: 0,
    pro: 5000,
    elite: 15000,
    legend: 50000
  };

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      // 1. Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileData?.role !== 'affiliate' && profileData?.role !== 'admin') {
        router.push('/account');
        return;
      }
      setProfile(profileData);

      // 2. Commissions
      const { data: comms } = await supabase
        .from('commissions')
        .select('*, orders(total)')
        .eq('affiliate_id', profileData.id) // Using profile ID if it matches affiliate table ID
        .order('created_at', { ascending: false });
      setCommissions(comms || []);

      // 3. Messages (Step 38)
      const { data: msgData } = await supabase
        .from('messages')
        .select('*')
        .or(`recipient_id.eq.${user.id},is_broadcast.eq.true`)
        .order('created_at', { ascending: false });
      setMessages(msgData || []);

      // 4. Leaderboard (Step 34)
      const { data: leaderData } = await supabase
        .from('affiliates')
        .select('total_sales, profiles(full_name, avatar_url, role)')
        .eq('status', 'approved')
        .order('total_sales', { ascending: false })
        .limit(10);
      setLeaderboard(leaderData || []);

      setLoading(false);
    }
    fetchData();
  }, [router]);

  const copyRefLink = () => {
    const link = `${window.location.host}?ref=${profile?.affiliate_code || 'PROMO'}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié dans le presse-papier !');
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePhotoUpload = async (base64: string) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(base64);
      const blob = await res.blob();
      const fileName = `${user.id}-${Date.now()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
      setIsCropping(false);
      toast.success('Profil mis à jour !');
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error("Échec de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const totalSales = profile?.total_sales || 0;
  const totalCommissions = commissions.reduce((sum, c) => sum + (c.amount || 0), 0);
  const currentPoints = Math.floor(totalSales / ptsRatio);
  const nextPointProgress = ((totalSales % ptsRatio) / ptsRatio) * 100;

  const currentRank = (): 'agent' | 'pro' | 'elite' | 'legend' => {
     if (totalSales >= rankThresholds.legend) return 'legend';
     if (totalSales >= rankThresholds.elite) return 'elite';
     if (totalSales >= rankThresholds.pro) return 'pro';
     return 'agent';
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">SYSTÈME D'AMBASSADEUR ACTIVÉ...</p>
    </div>
  );

  return (
    <PageLayout
      title="CENTRE DE CONTRÔLE"
      subtitle={`AFFILIÉ : ${profile?.affiliate_code || 'PROMO'}`}
      actions={
        <div className="flex gap-4">
          <SoyuzButton onClick={copyRefLink} variant="primary" icon={Share2} size="md">
            {copied ? 'COPIÉ' : 'PARTAGER MON LIEN'}
          </SoyuzButton>
        </div>
      }
    >
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-white/5 mb-16 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'home', label: 'ACCUEIL', icon: Home },
          { id: 'objectives', label: 'OBJECTIFS', icon: Target },
          { id: 'messages', label: 'MESSAGES', icon: Mail, count: messages.filter(m => !m.is_read).length },
          { id: 'leaderboard', label: 'CLASSEMENT', icon: Trophy }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-10 py-6 text-[10px] font-black tracking-[0.2em] transition-all whitespace-nowrap border-b-2 relative ${
              activeTab === tab.id 
              ? 'border-soyuz text-white bg-white/[0.02]' 
              : 'border-transparent text-white/20 hover:text-white hover:bg-white/[0.01]'
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-soyuz' : ''} />
            {tab.label}
            {tab.count ? (
              <span className="absolute top-4 right-4 w-4 h-4 bg-soyuz rounded-full text-[8px] flex items-center justify-center text-black">
                {tab.count}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-20"
          >
            {/* HERO SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
               <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-7xl font-display italic text-white uppercase leading-tight">
                    MAITRISEZ LE <span className="outline-text-white">MARCHÉ</span>
                  </h2>
                  <p className="text-[#888888] text-lg uppercase font-bold tracking-[0.1em] max-w-xl">
                    STATUT ACTUEL : <span className="text-soyuz">{currentRank().toUpperCase()}</span>. 
                    VOTRE RÉSEAU A GÉNÉRÉ <span className="text-white">${totalSales.toLocaleString()}</span> DE CHIFFRE D'AFFAIRES.
                  </p>
                  <div className="flex gap-4 pt-4">
                    <div className="px-8 py-5 bg-white/5 border border-white/10 rounded-3xl">
                       <p className="text-[10px] text-white/20 font-black uppercase mb-1">REVENUS GÉNÉRÉS</p>
                       <p className="text-3xl font-display italic text-white">${totalCommissions.toFixed(2)}</p>
                    </div>
                    <div className="px-8 py-5 bg-soyuz/5 border border-soyuz/20 rounded-3xl">
                       <p className="text-[10px] text-soyuz/40 font-black uppercase mb-1">POINTS DASHBOARD</p>
                       <p className="text-3xl font-display italic text-soyuz">{currentPoints} PTS</p>
                    </div>
                  </div>
               </div>
               <div className="flex justify-center">
                  <HockeyCard 
                    user={{
                      full_name: profile?.full_name || 'PLAYER',
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
                    rank={currentRank()}
                    editMode={isCropping}
                    tempPhotoUrl={tempImage}
                    onPhotoSelected={(dataUrl) => {
                      setTempImage(dataUrl);
                      setIsCropping(true);
                    }}
                    onCancelEdit={() => setIsCropping(false)}
                    onSaveEdit={() => handlePhotoUpload(tempImage!)}
                  />
               </div>
            </div>

            {/* PERFORMANCE BAR */}
            <div className="bg-[#0A0A0A] border border-white/5 p-12">
               <div className="flex justify-between items-end mb-8">
                  <div className="space-y-1">
                     <p className="text-[10px] text-white font-black uppercase tracking-widest">PROGRESSION PROCHAIN PALIER</p>
                     <p className="text-[9px] text-white/20 uppercase font-black tracking-widest">OBJECTIF : {ptsRatio}$ / POINT</p>
                  </div>
                  <p className="text-2xl font-display italic text-soyuz">{nextPointProgress.toFixed(1)}%</p>
               </div>
               <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${nextPointProgress}%` }}
                    className="h-full bg-soyuz shadow-[0_0_30px_rgba(255,0,0,0.3)]"
                  />
               </div>
            </div>

            {/* RECENT SALES */}
            <div className="space-y-8">
               <h3 className="text-2xl font-display italic text-white uppercase">ACTIVITÉ <span className="outline-text-white">RÉCENTE</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {commissions.slice(0, 6).map((comm) => (
                   <div key={comm.id} className="bg-[#0A0A0A] border border-white/5 p-8 flex items-center justify-between group hover:border-soyuz/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-soyuz">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] text-white font-black tracking-widest uppercase">VENTE RÉFÉRÉE</p>
                          <p className="text-[9px] text-white/20 font-black tracking-widest uppercase">{new Date(comm.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-display italic text-white">+${comm.amount.toFixed(2)}</p>
                        <p className="text-[8px] text-soyuz font-black uppercase tracking-widest">{comm.status?.toUpperCase()}</p>
                      </div>
                   </div>
                 ))}
                 {commissions.length === 0 && (
                   <div className="col-span-full py-20 border border-dashed border-white/5 flex flex-col items-center justify-center text-white/10 uppercase font-black text-[10px] tracking-[0.5em]">
                     AUCUNE TRANSMISSION DÉTÉCTÉE
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'objectives' && (
          <motion.div
            key="objectives"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
               {/* Points Status */}
               <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-8">
                  <h3 className="text-3xl font-display italic text-white uppercase tracking-tighter">VOTRE <span className="text-soyuz">ARSENAL</span> DE POINTS</h3>
                  <div className="flex items-center gap-8">
                     <div className="w-32 h-32 rounded-full border-4 border-soyuz/20 border-t-soyuz flex items-center justify-center relative">
                        <div className="text-center">
                           <p className="text-4xl font-display italic text-white leading-none">{currentPoints}</p>
                           <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">TOTAL</p>
                        </div>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[#888888] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                          Chaque tranche de {ptsRatio}$ de ventes cumulées vous rapporte 1 Point Dashboard. Ces points sont réinitialisés le 1er du mois.
                        </p>
                        <div className="flex items-center gap-3">
                           <Zap size={14} className="text-soyuz" />
                           <span className="text-[10px] text-white font-black uppercase tracking-widest">Prochain cadeau à 50 PTS</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Current Rank */}
               <div className="bg-soyuz/5 border border-soyuz/20 p-12 flex flex-col justify-between">
                  <div className="space-y-2">
                    <p className="text-[10px] text-soyuz font-black uppercase tracking-widest">RANG ACTUEL</p>
                    <h3 className="text-5xl font-display italic text-white uppercase tracking-tighter">{currentRank().toUpperCase()}</h3>
                  </div>
                  <div className="flex justify-between items-end border-t border-soyuz/20 pt-8 mt-8">
                     <div className="space-y-1">
                        <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">AVANTAGES RANG {currentRank().toUpperCase()}</p>
                        <p className="text-[10px] text-white font-black uppercase tracking-widest italic">Commission Standard (15%) + Accès Dashboard Pro</p>
                     </div>
                     <Trophy size={48} className="text-soyuz/20" />
                  </div>
               </div>
            </div>

            {/* List of Goals */}
            <div className="space-y-8">
               <h3 className="text-2xl font-display italic text-white uppercase">OBJECTIFS DE <span className="outline-text-white">CAMPAGNE</span></h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    { title: 'PREMIER VOL', target: 1000, reward: 'STICKERS SOYUZ ELITE', desc: 'Générez vos premières ventes.' },
                    { title: 'ORBITE STABLE', target: 5000, reward: 'T-SHIRT AMBASSADEUR', desc: 'Atteignez le volume de croisière.' },
                    { title: 'HYPERESPACE', target: 20000, reward: 'NOUVEAU BÂTON PERSONNALISÉ', desc: 'Performance exceptionnelle.' }
                  ].map((goal, i) => {
                    const progress = Math.min(100, (totalSales / goal.target) * 100);
                    return (
                      <div key={i} className={`bg-[#0A0A0A] border p-10 space-y-8 transition-all relative ${progress >= 100 ? 'border-green-500/40' : 'border-white/5'}`}>
                         <div className="space-y-2">
                           <div className="flex justify-between items-start">
                             <h4 className="text-xl font-display italic text-white uppercase leading-none">{goal.title}</h4>
                             <p className="text-[10px] text-soyuz font-black tracking-widest">${goal.target}</p>
                           </div>
                           <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">{goal.desc}</p>
                         </div>
                         
                         <div className="space-y-3">
                            <div className="h-1 bg-white/5 overflow-hidden">
                               <motion.div 
                                 initial={{ width: 0 }}
                                 animate={{ width: `${progress}%` }}
                                 className={`h-full ${progress >= 100 ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'bg-white/20'}`}
                               />
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-black tracking-widest uppercase">
                               <span className={progress >= 100 ? 'text-green-500' : 'text-[#444444]'}>{progress >= 100 ? 'RÉCOMPENSE DÉBLOQUÉE' : 'EN COURS'}</span>
                               <span className="text-white/10">{progress.toFixed(0)}%</span>
                            </div>
                         </div>

                         <div className="pt-4 border-t border-white/[0.02] flex items-center gap-3">
                            <Star size={12} className={progress >= 100 ? 'text-green-500' : 'text-[#222222]'} />
                            <p className={`text-[10px] font-black uppercase tracking-widest ${progress >= 100 ? 'text-white' : 'text-[#444444]'}`}>{goal.reward}</p>
                         </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-4xl mx-auto space-y-8"
          >
            <div className="flex items-center justify-between">
               <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">CANAL DE <span className="outline-text-white">TRANSMISSION</span></h3>
               <p className="text-[10px] text-white/20 font-black tracking-widest uppercase">SYSTÈME EN SENS UNIQUE UNIQUEMENT</p>
            </div>

            {messages.length === 0 ? (
              <div className="py-32 border border-dashed border-white/5 flex flex-col items-center justify-center space-y-6 text-center">
                 <Mail size={48} className="text-[#111111]" />
                 <div className="space-y-2">
                    <p className="text-[10px] text-white/20 font-black tracking-widest uppercase">AUCUN MESSAGE DANS LE CANAL</p>
                    <p className="text-[9px] text-[#222222] font-black uppercase tracking-widest">VOTRE BOÎTE EST VIDE POUR LE MOMENT.</p>
                 </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`bg-[#0A0A0A] border p-10 group hover:border-white/10 transition-all ${!msg.is_read ? 'border-soyuz/20' : 'border-white/5'}`}>
                      <div className="flex justify-between items-start mb-6">
                        <div className="space-y-1">
                          <div className="flex items-center gap-3">
                             {!msg.is_read && <div className="w-2 h-2 rounded-full bg-soyuz shadow-[0_0_10px_rgba(204,0,0,0.5)]" />}
                             <h4 className="text-xl font-display italic text-white uppercase tracking-tight">{msg.subject}</h4>
                          </div>
                          <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">EXPÉDIÉ LE {new Date(msg.created_at).toLocaleDateString()} PAR ADMIN</p>
                        </div>
                        {msg.is_broadcast ? (
                          <span className="px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-[8px] text-soyuz font-black uppercase tracking-widest rounded-full">BROADCAST</span>
                        ) : (
                          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-[8px] text-blue-500 font-black uppercase tracking-widest rounded-full">PRIVÉ</span>
                        )}
                      </div>
                      <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap font-medium tracking-wide border-l-2 border-white/5 pl-8 py-2">
                        {msg.body}
                      </p>
                      <div className="mt-8 flex justify-end">
                         <p className="text-[8px] text-[#222222] font-black uppercase tracking-widest italic group-hover:text-white/10 transition-colors">
                            {msg.is_perpetual ? 'MESSAGE PERPÉTUEL' : 'AUTO-SUPPRESSION LE 1ER DU MOIS'}
                         </p>
                      </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'leaderboard' && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-12"
          >
            <div className="max-w-5xl mx-auto space-y-12">
               <div className="text-center space-y-4">
                  <h3 className="text-6xl font-display italic text-white uppercase tracking-tighter">LE <span className="outline-text-white text-soyuz">CLASSEMENT</span></h3>
                  <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">LES TOP NODES DU RÉSEAU SOYUZ</p>
               </div>

               <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
                  {/* Table Header */}
                  <div className="grid grid-cols-4 px-12 py-8 bg-white/[0.02] border-b border-white/5 text-[9px] font-black text-[#444444] uppercase tracking-widest">
                    <span className="col-span-2">AMBASSADEUR</span>
                    <span className="text-center">VOLUME</span>
                    <span className="text-right">RANG</span>
                  </div>

                  {/* Top 3 Special Style */}
                  <div className="divide-y divide-white/5">
                    {leaderboard.map((item, i) => {
                      const isMe = item.profiles.full_name === profile.full_name;
                      return (
                        <div key={i} className={`grid grid-cols-4 items-center px-12 py-10 transition-all ${isMe ? 'bg-soyuz/5' : 'hover:bg-white/[0.01]'}`}>
                           <div className="col-span-2 flex items-center gap-8">
                              <span className={`text-2xl font-display italic w-8 ${i === 0 ? 'text-soyuz' : i === 1 ? 'text-blue-400' : i === 2 ? 'text-green-400' : 'text-white/10'}`}>
                                 {i + 1}
                              </span>
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative">
                                    {item.profiles.avatar_url ? (
                                      <img src={item.profiles.avatar_url} className="w-full h-full object-cover" alt="" />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-white/10">
                                         <Users size={24} />
                                      </div>
                                    )}
                                    {isMe && <div className="absolute inset-0 border-2 border-soyuz animate-pulse" />}
                                 </div>
                                 <div>
                                   <p className={`text-lg font-display italic uppercase tracking-tight ${isMe ? 'text-soyuz' : 'text-white'}`}>
                                      {item.profiles.full_name}
                                   </p>
                                   <p className="text-[8px] text-[#444444] font-black uppercase tracking-widest">MÉTROPOLE : QUÉBEC</p>
                                 </div>
                              </div>
                           </div>
                           <div className="text-center">
                              <p className="text-2xl font-display italic text-white tracking-widest">${(item.total_sales / 1000).toFixed(1)}K</p>
                           </div>
                           <div className="text-right">
                              <span className="px-4 py-1.5 border border-white/5 bg-white/[0.02] text-[8px] text-white/40 font-black uppercase tracking-widest rounded-full">
                                 {item.total_sales >= 50000 ? 'LEGEND' : item.total_sales >= 15000 ? 'ELITE' : 'PRO'}
                              </span>
                           </div>
                        </div>
                      );
                    })}
                    {leaderboard.length === 0 && (
                      <div className="py-20 text-center uppercase font-black text-white/10 text-[10px] tracking-widest">
                         EN ATTENTE DE DONNÉES DE SECTEUR...
                      </div>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .outline-text-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </PageLayout>
  );
}
