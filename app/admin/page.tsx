'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  RefreshCw, 
  Check, 
  X, 
  ShieldAlert,
  BarChart3,
  Box,
  Settings as SettingsIcon,
  ChevronRight,
  Database,
  ArrowUpRight,
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reps' | 'products'>('overview');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, reps: 0 });
  const [reps, setReps] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: pData } = await supabase.from('products').select('id');
    const { data: rData } = await supabase.from('profiles').select('*').in('role', ['affiliate', 'rep']).order('status', { ascending: false });

    setOrders(oData || []);
    setReps(rData || []);
    
    setStats({
      revenue: oData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
      orders: oData?.length || 0,
      products: pData?.length || 0,
      reps: rData?.length || 0
    });

    setLoading(false);
  }

  const handleSync = async () => {
    setSyncing(true);
    try {
      const resp = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await resp.json();
      if (resp.ok && data.message) {
        alert(`SUCCESS: ${data.message} (${data.count} items)`);
        fetchData();
      } else {
        const errMsg = data.error || 'Unknown sync error';
        alert(`SYNC FAILED: ${errMsg}`);
        console.error('Sync error:', errMsg);
      }
    } catch (err) {
      alert('Network error during sync');
      console.error('Sync failed', err);
    } finally {
      setSyncing(false);
    }
  };

  const updateRepStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status, role: status === 'approved' ? 'rep' : 'customer' })
      .eq('id', id);

    if (!error) fetchData();
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">ACCÈS AU CENTRE DE COMMANDEMENT...</p>
    </div>
  );

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 selection:bg-soyuz selection:text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
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
              NŒUD ADMINISTRATIF
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              BONJOUR <br /><span className="outline-text-white">DANY</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={() => window.location.href = '/api/auth/quickbooks'}
              className="px-6 py-4 bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-[#888888] hover:text-white hover:border-white/20 transition-all flex items-center gap-2"
            >
              <Database size={14} /> CONNECTER QBO
            </button>
            <button 
              onClick={handleSync}
              disabled={syncing}
              className="px-6 py-4 bg-soyuz/10 border border-soyuz/20 text-[10px] font-black uppercase tracking-widest text-soyuz hover:bg-soyuz hover:text-white transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.1)] group disabled:opacity-30"
            >
              <RefreshCw size={14} className={syncing ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'} /> 
              {syncing ? 'SYNCHRONISATION...' : 'SYNCHRONISER L\'INVENTAIRE'}
            </button>
            <Link href="/" className="px-6 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all flex items-center gap-2">
              <ArrowUpRight size={14} /> BOUTIQUE
            </Link>
          </motion.div>
        </div>

        {/* 2. NAVIGATION NODES */}
        <div className="flex gap-12 mb-16 overflow-x-auto pb-4 scrollbar-hide">
          {[
            { id: 'overview', label: 'STATUT DU RÉSEAU', icon: <BarChart3 size={18} /> },
            { id: 'reps', label: 'REPRÉSENTANTS', icon: <Users size={18} /> },
            { id: 'products', label: 'CATALOGUE D\'ACTIFS', icon: <Box size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 shrink-0 py-2 border-b-2 transition-all group ${
                activeTab === tab.id 
                  ? 'border-soyuz text-white' 
                  : 'border-transparent text-[#444444] hover:text-white'
              }`}
            >
              <div className={`p-1.5 transition-colors ${activeTab === tab.id ? 'text-soyuz' : 'group-hover:text-soyuz'}`}>
                {tab.icon}
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* 3. CORE DISPLAY */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-16"
            >
              {/* Primary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                  { label: 'CHIFFRE D\'AFFAIRES BRUT', value: `$${stats.revenue.toFixed(2)}`, icon: <TrendingUp size={20} /> },
                  { label: 'TRANSACTIONS ACTIVES', value: stats.orders, icon: <ShoppingBag size={20} /> },
                  { label: 'INTÉGRATION QBO', value: 'OPÉRATIONNELLE', icon: <Zap size={20} /> },
                  { label: 'AGENTS EN ATTENTE', value: reps.filter(r => r.status === 'pending').length, icon: <Users size={20} /> },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 text-white/5 group-hover:text-soyuz/10 transition-colors">
                      {stat.icon}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-display italic text-white leading-none">{stat.value}</p>
                    </div>
                    <div className="h-1 w-12 bg-white/5 group-hover:w-full group-hover:bg-soyuz/30 transition-all duration-700" />
                  </div>
                ))}
              </div>

              {/* Data Grid */}
              <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <div className="flex justify-between items-end mb-12">
                  <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">RÉCAPITULATIF <span className="outline-text-white">DES TRANSACTIONS</span></h3>
                  <p className="text-[9px] text-[#444444] font-black uppercase tracking-[0.3em]">CHIFFREMENT EN DIRECT ACTIF</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-[#444444] font-black uppercase tracking-widest">
                        <th className="pb-6 px-4">IDENTIFIANT</th>
                        <th className="pb-6 px-4">OPÉRATEUR</th>
                        <th className="pb-6 px-4">TOTAL CAD</th>
                        <th className="pb-6 px-4">STATUT</th>
                        <th className="pb-6 px-4">AGENT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
                          <td className="py-8 px-4 font-mono text-[10px] text-white">#{(order.id || '').slice(-8).toUpperCase()}</td>
                          <td className="py-8 px-4 text-[10px] font-black uppercase text-[#888888]">{order.customer_email}</td>
                          <td className="py-8 px-4 text-lg font-display italic text-white">${order.total}</td>
                          <td className="py-8 px-4">
                            <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-[8px] font-black uppercase tracking-widest text-white">
                              {order.status}
                            </span>
                          </td>
                          <td className="py-8 px-4 text-[10px] font-black uppercase text-soyuz tracking-widest">{order.rep_code || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'reps' && (
            <motion.div 
              key="reps"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Pending */}
                <div className="bg-[#0A0A0A] border border-white/5 p-12">
                  <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12">CANDIDATURES <span className="outline-text-white">EN ATTENTE</span></h3>
                  <div className="space-y-6">
                    {reps.filter(r => r.status === 'pending').map((rep) => (
                      <div key={rep.id} className="p-8 bg-black border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 group hover:border-soyuz/30 transition-all">
                        <div className="space-y-2">
                          <p className="text-lg font-display italic text-white uppercase leading-none">{rep.first_name} {rep.last_name}</p>
                          <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest">{rep.email}</p>
                        </div>
                        <div className="flex gap-4">
                          <button 
                            onClick={() => updateRepStatus(rep.id, 'rejected')}
                            className="p-3 bg-white/5 border border-white/10 text-[#CC0000] hover:bg-[#CC0000] hover:text-white transition-all"
                          >
                            <X size={16} />
                          </button>
                          <button 
                            onClick={() => updateRepStatus(rep.id, 'approved')}
                            className="p-3 bg-soyuz/20 border border-soyuz/40 text-soyuz hover:bg-soyuz hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.1)]"
                          >
                            <Check size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {reps.filter(r => r.status === 'pending').length === 0 && (
                      <div className="py-20 text-center border border-dashed border-white/5">
                        <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">AUCUNE DEMANDE EN ATTENTE</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Approved */}
                <div className="bg-[#0A0A0A] border border-white/5 p-12">
                  <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12">AGENTS <span className="outline-text-white">ACTIFS</span></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {reps.filter(r => r.status === 'approved').map((rep) => (
                      <div key={rep.id} className="p-6 bg-black border border-white/5 flex items-center justify-between group hover:border-soyuz/20 transition-all">
                        <div className="space-y-2">
                          <p className="text-xs font-black text-white uppercase tracking-tight">{rep.first_name} {rep.last_name}</p>
                          <p className="text-[9px] text-soyuz font-black uppercase tracking-widest leading-none">CODE: {rep.affiliate_code}</p>
                        </div>
                        <ChevronRight size={14} className="text-[#333333] group-hover:text-soyuz transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'products' && (
            <motion.div 
               key="products"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="bg-[#0A0A0A] border border-white/5 p-20 text-center"
            >
               <ShieldAlert className="text-soyuz mx-auto mb-12" size={60} />
               <h3 className="text-3xl font-display italic text-white uppercase tracking-tighter mb-6">CŒUR DES ACTIFS <span className="outline-text-white">PROTÉGÉ</span></h3>
               <p className="text-[#888888] text-xs uppercase font-bold tracking-[0.2em] max-w-xl mx-auto mb-12 leading-loose">
                 LA MODIFICATION LOCALE DIRECTE EST DÉSACTIVÉE. QUICKBOOKS ONLINE EST LA SEULE SOURCE DE VÉRITÉ POUR LES DONNÉES D'INVENTAIRE ET DE PRIX. UTILISEZ LE NŒUD DE SYNCHRONISATION GLOBAL CI-DESSUS POUR RAFRAÎCHIR L'ÉTAT LOCAL.
               </p>
               <div className="flex justify-center gap-8">
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[9px] text-[#444444] font-black">ACTIFS LOCAUX</p>
                    <p className="text-2xl font-display italic text-white">{stats.products}</p>
                  </div>
                  <div className="w-[1px] h-12 bg-white/5" />
                  <div className="flex flex-col items-center gap-2">
                    <p className="text-[9px] text-[#444444] font-black">STATUT SYNC</p>
                    <p className="text-2xl font-display italic text-soyuz">CHIFFRÉ</p>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
