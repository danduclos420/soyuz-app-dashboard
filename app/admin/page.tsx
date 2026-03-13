'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  RefreshCw, 
  ShieldAlert,
  BarChart3,
  Box,
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  ArrowUpRight,
  Zap,
  Mail,
  PieChart,
  Layout
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { PageLayout } from '@/components/layout/PageLayout';
import { toast } from 'react-hot-toast';
import SoyuzButton from '@/components/ui/SoyuzButton';

// Admin Components
import MessagePortal from '@/components/admin/MessagePortal';
import AffiliateManager from '@/components/admin/AffiliateManager';
import InventorySync from '@/components/admin/InventorySync';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliates' | 'orders' | 'products' | 'messages' | 'inventory'>('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, affiliates: 0, commissions_pending: 0 });
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [recentCommissions, setRecentCommissions] = useState<any[]>([]);

  useEffect(() => {
    // Handle URL parameters for tabs and success/error messages
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab');
    const success = params.get('success');
    const error = params.get('error');

    if (tab && ['overview', 'affiliates', 'orders', 'products', 'messages', 'inventory'].includes(tab)) {
      setActiveTab(tab as any);
    }

    if (success) {
      toast.success('Opération réussie !');
    }
    if (error) {
      toast.error(`Erreur: ${decodeURIComponent(error)}`);
    }

    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // 1. Stats & Orders
      const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      const { data: pData } = await supabase.from('products').select('id');
      const { data: aData } = await supabase.from('profiles').select('*').in('role', ['affiliate']).order('created_at', { ascending: false });
      const { data: cData } = await supabase.from('commissions').select('*').eq('status', 'pending');

      setOrders(oData || []);
      setAffiliates(aData || []);
      
      setStats({
        revenue: oData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
        orders: oData?.length || 0,
        products: pData?.length || 0,
        affiliates: aData?.length || 0,
        commissions_pending: cData?.reduce((sum, c) => sum + (c.amount || 0), 0) || 0
      });

      // 2. Recent Commissions
      const { data: recentComms } = await supabase
        .from('commissions')
        .select('*, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentCommissions(recentComms || []);

    } catch (err) {
      console.error('Fetch Error:', err);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-16 h-16 border-4 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_50px_rgba(255,0,0,0.3)]" />
      <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.8em] animate-pulse">SÉCURISATION DU PÉRIMÈTRE...</p>
    </div>
  );

  return (
    <PageLayout
      title="CENTRE DE COMMANDE"
      subtitle="ADMINISTRATEUR SYSTÈME ALPHA"
      actions={
        <div className="flex gap-4">
           <SoyuzButton onClick={fetchData} variant="outline" icon={RefreshCw} size="md">
              ACTUALISER
           </SoyuzButton>
           <SoyuzButton href="/" variant="primary" icon={ArrowUpRight} size="md">
              VOIR LE SITE
           </SoyuzButton>
        </div>
      }
    >
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-white/5 mb-16 overflow-x-auto no-scrollbar scroll-smooth">
        {[
          { id: 'overview', label: 'VUE D\'ENSEMBLE', icon: Layout },
          { id: 'affiliates', label: 'AMBASSADEURS', icon: Users },
          { id: 'orders', label: 'COMMANDES', icon: ShoppingBag },
          { id: 'products', label: 'PRODUITS', icon: Box },
          { id: 'messages', label: 'MESSAGERIE', icon: Mail },
          { id: 'inventory', label: 'INVENTAIRE', icon: Database }
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
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            {/* KPI GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {[
                 { label: 'CHIFFRE D\'AFFAIRES', value: `$${stats.revenue.toLocaleString()}`, icon: TrendingUp, sub: '+12% ce mois', color: 'text-green-500' },
                 { label: 'COMMANDES TOTALES', value: stats.orders, icon: ShoppingBag, sub: 'Volume de vente', color: 'text-white' },
                 { label: 'AMBASSADEURS', value: stats.affiliates, icon: Users, sub: 'Membres actifs', color: 'text-soyuz' },
                 { label: 'COMMISSIONS À PAYER', value: `$${stats.commissions_pending.toLocaleString()}`, icon: DollarSign, sub: 'Paiements en attente', color: 'text-soyuz' }
               ].map((kpi, i) => (
                 <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 space-y-4 group hover:border-white/10 transition-all shadow-2xl">
                    <div className="flex justify-between items-start">
                       <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">{kpi.label}</p>
                       <kpi.icon size={20} className="text-white/5 group-hover:text-soyuz/40 transition-colors" />
                    </div>
                    <div>
                       <p className={`text-4xl font-display italic leading-none ${kpi.color}`}>{kpi.value}</p>
                       <p className="text-[8px] text-[#222222] font-black uppercase tracking-widest mt-2">{kpi.sub}</p>
                    </div>
                 </div>
               ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
               {/* PERFORMANCE GRAPH TEASER */}
               <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/5 p-12 space-y-12">
                  <div className="flex justify-between items-end">
                     <h3 className="text-2xl font-display italic text-white uppercase tracking-tighter">ANALYTIQUE <span className="text-soyuz">TEMPS RÉEL</span></h3>
                     <div className="flex gap-4">
                        <div className="w-3 h-3 rounded-full bg-soyuz animate-pulse" />
                        <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Live Feed</span>
                     </div>
                  </div>
                  <div className="h-64 flex items-end gap-2 px-4 border-b border-white/5">
                     {[40, 70, 45, 90, 65, 80, 50, 95, 100, 85, 60, 75].map((h, i) => (
                       <motion.div 
                         key={i} 
                         initial={{ height: 0 }}
                         animate={{ height: `${h}%` }}
                         transition={{ delay: i * 0.05, type: 'spring' }}
                         className="flex-1 bg-gradient-to-t from-soyuz/20 to-soyuz/60 group relative"
                       >
                         <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                            <p className="text-[8px] text-white font-black uppercase">J-{12-i}</p>
                         </div>
                       </motion.div>
                     ))}
                  </div>
               </div>

               {/* RECENT COMMISSIONS LIST */}
               <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-10">
                  <h3 className="text-xl font-display italic text-white uppercase tracking-tighter">FLUX <span className="outline-text-white">COMMISSIONS</span></h3>
                  <div className="space-y-6">
                     {recentCommissions.map((comm) => (
                       <div key={comm.id} className="flex items-center justify-between group">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-soyuz">
                                <Zap size={16} />
                             </div>
                             <div>
                                <p className="text-[10px] text-white font-black uppercase tracking-tight">{comm.profiles?.full_name || 'ANONYME'}</p>
                                <p className="text-[8px] text-white/20 font-black uppercase tracking-widest">ID: {comm.id.slice(0, 6)}</p>
                             </div>
                          </div>
                          <p className="text-lg font-display italic text-white group-hover:text-soyuz transition-colors">${comm.amount.toFixed(2)}</p>
                       </div>
                     ))}
                  </div>
                  <SoyuzButton variant="outline" size="sm" className="w-full">VOIR TOUTES LES COMMISSIONS</SoyuzButton>
               </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'affiliates' && (
          <motion.div
            key="affiliates"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AffiliateManager affiliates={affiliates} onUpdate={fetchData} />
          </motion.div>
        )}

        {activeTab === 'messages' && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <MessagePortal affiliates={affiliates} />
          </motion.div>
        )}

        {activeTab === 'inventory' && (
          <motion.div
            key="inventory"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <InventorySync />
          </motion.div>
        )}

        {/* OTHER TABS (Simplified for now) */}
        {(activeTab === 'orders' || activeTab === 'products') && (
          <motion.div
            className="py-32 border border-dashed border-white/5 flex flex-col items-center justify-center text-center space-y-6"
          >
             <Box size={48} className="text-[#111111]" />
             <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.4em]">MODULE {activeTab.toUpperCase()} EN DÉVELOPPEMENT FINAL</p>
             <SoyuzButton variant="outline" onClick={() => setActiveTab('overview')}>RETOUR AU CENTRE</SoyuzButton>
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

// Inline fallback components if they failed to load or for simplicity in this turn
// (Already created them as separate files, so they should be fine)
function DollarSign(props: any) { return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>; }
