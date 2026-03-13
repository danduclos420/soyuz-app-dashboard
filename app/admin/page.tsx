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
  Zap,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PageLayout } from '@/components/layout/PageLayout';
import { FormLayout } from '@/components/layout/FormLayout';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliates' | 'products' | 'invites' | 'settings'>('overview');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [stats, setStats] = useState({ revenue: 0, orders: 0, products: 0, affiliates: 0 });
  const [affiliates, setAffiliates] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [inviteCodes, setInviteCodes] = useState<any[]>([]);
  const [objectives, setObjectives] = useState<any[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<any>(null);
  
  // Settings State
  const [pointsConfig, setPointsConfig] = useState({ dollars_per_point: 1000 });
  const [editingObjective, setEditingObjective] = useState<any>(null);
  const [isSavingObjective, setIsSavingObjective] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: pData } = await supabase.from('products').select('id');
    const { data: aData } = await supabase.from('profiles').select('*').in('role', ['affiliate']).order('status', { ascending: false });
    const { data: iData } = await supabase.from('invite_codes').select('*').order('created_at', { ascending: false });
    const { data: objData } = await supabase.from('affiliate_objectives').select('*, objective_assignments(affiliate_id)').order('created_at', { ascending: true });

    const { data: sData } = await supabase.from('app_settings').select('*');
    
    if (sData) {
      const pCfg = sData.find(s => s.key === 'points_config')?.value;
      if (pCfg) setPointsConfig(pCfg);
    }

    setOrders(oData || []);
    setAffiliates(aData || []);
    setInviteCodes(iData || []);
    setObjectives(objData || []);
    
    setStats({
      revenue: oData?.reduce((sum, o) => sum + (o.total || 0), 0) || 0,
      orders: oData?.length || 0,
      products: pData?.length || 0,
      affiliates: aData?.length || 0
    });

    setLoading(false);
  }

  const updateGlobalSettings = async (key: string, value: any) => {
    setUpdatingSettings(true);
    const { error } = await supabase
      .from('app_settings')
      .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
    
    if (!error) {
      if (key === 'points_config') setPointsConfig(value);
      alert('Paramètres mis à jour');
    } else {
      alert('Erreur lors de la mise à jour');
    }
    setUpdatingSettings(false);
  };

  const saveObjective = async () => {
    if (!editingObjective.title || !editingObjective.target_amount) return;
    setIsSavingObjective(true);

    const { data, error } = await supabase
      .from('affiliate_objectives')
      .upsert({
        id: editingObjective.id || undefined,
        title: editingObjective.title,
        description: editingObjective.description,
        target_amount: editingObjective.target_amount,
        is_global: editingObjective.is_global
      })
      .select()
      .single();

    if (!error && data) {
      // Clear and re-sync assignments if not global
      if (!editingObjective.is_global && editingObjective.assigned_affiliates?.length > 0) {
        await supabase.from('objective_assignments').delete().eq('objective_id', data.id);
        const assignments = editingObjective.assigned_affiliates.map((aid: string) => ({
          objective_id: data.id,
          affiliate_id: aid
        }));
        await supabase.from('objective_assignments').insert(assignments);
      } else if (editingObjective.is_global) {
        await supabase.from('objective_assignments').delete().eq('objective_id', data.id);
      }
      
      fetchData();
      setEditingObjective(null);
    } else {
      alert('Erreur lors de la sauvegarde de l\'objectif');
    }
    setIsSavingObjective(false);
  };

  const deleteObjective = async (id: string) => {
    if (!confirm('Supprimer cet objectif définitivement ?')) return;
    const { error } = await supabase.from('affiliate_objectives').delete().eq('id', id);
    if (!error) fetchData();
  };

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

  const updateAffiliateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('profiles')
      .update({ status, role: status === 'approved' ? 'affiliate' : 'customer' })
      .eq('id', id);

    if (!error) {
      fetchData();
      setSelectedAffiliate(null);
    }
  };

  const generateInviteCode = async () => {
    setGeneratingCode(true);
    const newCode = `SOYUZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const { error } = await supabase.from('invite_codes').insert({ code: newCode });
    if (!error) fetchData();
    setGeneratingCode(false);
  };

  const deleteInviteCode = async (id: string) => {
    if (!confirm('Supprimer ce code d\'invitation ?')) return;
    const { error } = await supabase.from('invite_codes').delete().eq('id', id);
    if (!error) fetchData();
  };

  if (loading) return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
      <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
      <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">ACCÈS AU CENTRE DE COMMANDEMENT...</p>
    </div>
  );

  return (
    <PageLayout
      title="BONJOUR DANY"
      subtitle="NŒUD ADMINISTRATIF"
      actions={
        <>
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
        </>
      }
    >
      {/* 2. NAVIGATION NODES */}
      <div className="flex gap-12 mb-16 overflow-x-auto pb-4 scrollbar-hide">
        {[
          { id: 'overview', label: 'STATUT DU RÉSEAU', icon: <BarChart3 size={18} /> },
          { id: 'affiliates', label: 'AFFILIÉS', icon: <Users size={18} /> },
          { id: 'products', label: 'CATALOGUE D\'ACTIFS', icon: <Box size={18} /> },
          { id: 'invites', label: 'CODES D\'INVITATION', icon: <ShieldAlert size={18} /> },
          { id: 'settings', label: 'PARAMÈTRES', icon: <SettingsIcon size={18} /> },
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
                { label: "CHIFFRE D'AFFAIRES BRUT", value: `$${stats.revenue.toFixed(2)}`, icon: <TrendingUp size={20} /> },
                { label: "TRANSACTIONS ACTIVES", value: stats.orders, icon: <ShoppingBag size={20} /> },
                { label: "INTÉGRATION QBO", value: "OPÉRATIONNELLE", icon: <Zap size={20} /> },
                { label: "AFFILIÉS EN ATTENTE", value: affiliates.filter(a => a.status === 'pending').length, icon: <Users size={20} /> },
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
                        <td className="py-8 px-4 text-[10px] font-black uppercase text-soyuz tracking-widest">{order.affiliate_code || '---'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
            className="space-y-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Pending */}
              <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12">CANDIDATURES <span className="outline-text-white">EN ATTENTE</span></h3>
                <div className="space-y-6">
                  {affiliates.filter(a => a.status === 'pending').map((affiliate) => (
                    <div 
                      key={affiliate.id} 
                      onClick={() => setSelectedAffiliate(affiliate)}
                      className="p-8 bg-black border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-8 group hover:border-soyuz/30 transition-all cursor-pointer"
                    >
                      <div className="space-y-2">
                        <p className="text-lg font-display italic text-white uppercase leading-none">{affiliate.full_name || `${affiliate.first_name || ''} ${affiliate.last_name || ''}`}</p>
                        <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest">{affiliate.email || 'NO EMAIL'}</p>
                      </div>
                      <div className="flex gap-4">
                        <Button variant="ghost" size="sm" className="text-soyuz border-soyuz/20 hover:bg-soyuz hover:text-white uppercase text-[9px] font-black tracking-widest">
                          VOIR DÉTAILS
                        </Button>
                      </div>
                    </div>
                  ))}
                  {affiliates.filter(a => a.status === 'pending').length === 0 && (
                    <div className="py-20 text-center border border-dashed border-white/5">
                      <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">AUCUNE DEMANDE EN ATTENTE</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Approved */}
              <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12">AFFILIÉS <span className="outline-text-white">ACTIFS</span></h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {affiliates.filter(a => a.status === 'approved').map((affiliate) => (
                    <div key={affiliate.id} className="p-6 bg-black border border-white/5 flex items-center justify-between group hover:border-soyuz/20 transition-all">
                      <div className="space-y-2">
                        <p className="text-xs font-black text-white uppercase tracking-tight">{affiliate.full_name || `${affiliate.first_name || ''} ${affiliate.last_name || ''}`}</p>
                        <p className="text-[9px] text-soyuz font-black uppercase tracking-widest leading-none">CODE: {affiliate.affiliate_code}</p>
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

        {activeTab === 'invites' && (
          <motion.div 
             key="invites"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="space-y-12"
          >
             <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <div className="flex justify-between items-center mb-12">
                   <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">GÉNÉRATEUR <span className="outline-text-white">D'INVITATIONS</span></h3>
                   <button 
                      onClick={generateInviteCode}
                      disabled={generatingCode}
                      className="px-8 py-4 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all disabled:opacity-30"
                   >
                      {generatingCode ? 'GÉNÉRATION...' : 'GÉNÉRER UN CODE UNIQUE'}
                   </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                   {inviteCodes.map((invite) => (
                      <div key={invite.id} className={`p-6 border border-white/5 relative group transition-all ${invite.is_used ? 'opacity-30' : 'bg-[#0D0D0D] hover:border-soyuz/30'}`}>
                         <p className={`text-xl font-display italic tracking-[0.2em] ${invite.is_used ? 'text-white/20 line-through' : 'text-white'}`}>
                            {invite.code}
                         </p>
                         <div className="flex justify-between items-center mt-4">
                            <span className={`text-[8px] font-black uppercase tracking-widest ${invite.is_used ? 'text-[#444444]' : 'text-soyuz'}`}>
                               {invite.is_used ? 'UTILISÉ' : 'VALIDE'}
                            </span>
                            <div className="flex gap-4">
                              {!invite.is_used && (
                                <button 
                                  onClick={() => navigator.clipboard.writeText(invite.code)}
                                  className="text-[8px] text-white/20 hover:text-white transition-colors uppercase font-black tracking-widest"
                                >
                                  COPIER
                                </button>
                              )}
                              <button 
                                onClick={() => deleteInviteCode(invite.id)}
                                className="text-[8px] text-white/10 hover:text-soyuz transition-colors uppercase font-black tracking-widest"
                              >
                                SUPPRIMER
                              </button>
                            </div>
                         </div>
                      </div>
                   ))}
                   {inviteCodes.length === 0 && (
                      <div className="col-span-full py-20 text-center border border-dashed border-white/5">
                         <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">AUCUN CODE GÉNÉRÉ</p>
                      </div>
                   )}
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div 
             key="settings"
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -20 }}
             className="space-y-12"
          >
             {/* 1. Global Points Config */}
             <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <h3 className="text-2xl font-display italic text-white uppercase tracking-tight mb-12">VALEUR DES <span className="outline-text-white">POINTS</span></h3>
                <div className="max-w-xl space-y-4">
                  <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Ratio de Points ($/pt)</label>
                  <div className="flex gap-4">
                    <input 
                       type="number" 
                       value={pointsConfig.dollars_per_point}
                       onChange={(e) => setPointsConfig({ ...pointsConfig, dollars_per_point: parseInt(e.target.value) })}
                       className="bg-black border border-white/10 p-4 text-white font-display italic text-xl flex-1 focus:border-soyuz outline-none transition-colors"
                    />
                    <button 
                       onClick={() => updateGlobalSettings('points_config', pointsConfig)}
                       disabled={updatingSettings}
                       className="px-8 py-4 bg-soyuz/10 border border-soyuz/20 text-soyuz text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all disabled:opacity-30"
                    >
                       {updatingSettings ? '...' : 'ENREGISTRER'}
                    </button>
                  </div>
                  <p className="text-[9px] text-white/20 italic">Définit combien de dollars de ventes valent 1 point dashboard.</p>
                </div>
             </div>

             {/* 2. Dynamic Objectives Grid */}
             <div className="bg-[#0A0A0A] border border-white/5 p-12">
                <div className="flex justify-between items-end mb-12">
                  <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">OBJECTIFS <span className="outline-text-white">DE VENTE</span></h3>
                  <button 
                    onClick={() => setEditingObjective({ title: '', description: '', target_amount: 0, is_global: true, assigned_affiliates: [] })}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all"
                  >
                    <Plus size={14} /> AJOUTER UN OBJECTIF
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {objectives.map((obj) => (
                    <div key={obj.id} className="bg-black border border-white/5 p-10 flex flex-col justify-between group hover:border-white/10 transition-all relative">
                      <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => setEditingObjective({ 
                            ...obj, 
                            assigned_affiliates: obj.objective_assignments?.map((a: any) => a.affiliate_id) || [] 
                          })}
                          className="p-2 bg-white/5 text-[#888888] hover:text-white transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => deleteObjective(obj.id)}
                          className="p-2 bg-white/5 text-[#888888] hover:text-soyuz transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <p className="text-xl font-display italic text-white uppercase">{obj.title}</p>
                          <Badge variant="outline" className={`text-[8px] h-4 ${obj.is_global ? 'border-soyuz/20 text-soyuz' : 'border-white/10 text-[#444444]'}`}>
                            {obj.is_global ? 'GLOBAL' : 'CIBLÉ'}
                          </Badge>
                        </div>
                        <p className="text-xs text-[#666666] italic line-clamp-2">{obj.description}</p>
                      </div>

                      <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-end">
                        <div className="space-y-1">
                          <p className="text-[9px] text-[#444444] font-black uppercase">MONTANT CIBLE</p>
                          <p className="text-2xl font-display italic text-white">${obj.target_amount}</p>
                        </div>
                        {!obj.is_global && (
                          <div className="text-right">
                             <p className="text-[9px] text-[#444444] font-black uppercase">AUDIENCE</p>
                             <p className="text-[10px] font-bold text-soyuz">{obj.objective_assignments?.length || 0} AFFILIÉS</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {objectives.length === 0 && (
                    <div className="col-span-full py-20 text-center border border-dashed border-white/5">
                      <p className="text-[10px] font-black text-[#222222] uppercase tracking-[0.4em]">AUCUN OBJECTIF CONFIGURÉ</p>
                    </div>
                  )}
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MODALS */}
      <AnimatePresence>
        {/* Affiliate Details Modal */}
        {selectedAffiliate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedAffiliate(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#0A0A0A] border border-white/10 w-full max-w-2xl relative z-10 overflow-hidden rounded-3xl"
            >
              <div className="p-10 sm:p-16 space-y-12">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <span className="text-soyuz text-[10px] font-black uppercase tracking-[0.3em]">CANDIDATURE AFFILIÉ</span>
                    <h2 className="text-4xl font-display italic text-white uppercase tracking-tighter">
                      {selectedAffiliate.full_name || `${selectedAffiliate.first_name || ''} ${selectedAffiliate.last_name || ''}`}
                    </h2>
                  </div>
                  <button onClick={() => setSelectedAffiliate(null)} className="p-4 bg-white/5 border border-white/10 text-white hover:bg-soyuz hover:text-white transition-all rounded-full">
                    <X size={20} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-[11px] uppercase tracking-widest">
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[#444444] font-black">EMAIL</p>
                      <p className="text-white font-bold">{selectedAffiliate.email || 'N/A'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#444444] font-black">TÉLÉPHONE</p>
                      <p className="text-white font-bold">{selectedAffiliate.phone || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <p className="text-[#444444] font-black">DATE D'INSCRIPTION</p>
                      <p className="text-white font-bold">{new Date(selectedAffiliate.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[#444444] font-black">STATUT ACTUEL</p>
                      <p className="text-soyuz font-bold">{selectedAffiliate.status}</p>
                    </div>
                  </div>
                </div>
                {selectedAffiliate.bio && (
                  <div className="space-y-4 pt-8 border-t border-white/5">
                    <p className="text-[#444444] text-[9px] font-black uppercase tracking-widest">MOTIVATIONS / BIO</p>
                    <p className="text-white/60 text-xs leading-relaxed italic">"{selectedAffiliate.bio}"</p>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-4 pt-8">
                  <button onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'rejected')} className="flex-1 py-5 bg-white/5 border border-white/10 text-[#CC0000] text-[10px] font-black uppercase tracking-widest hover:bg-[#CC0000] hover:text-white transition-all">REFUSER LA DEMANDE</button>
                  <button onClick={() => updateAffiliateStatus(selectedAffiliate.id, 'approved')} className="flex-1 py-5 bg-soyuz text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_40px_rgba(255,0,0,0.2)]">APPROUVER L'AFFILIÉ</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Dynamic Objective Modal */}
        {editingObjective && (
          <FormLayout
            title={editingObjective.id ? "MODIFIER L'OBJECTIF" : "NOUVEL OBJECTIF"}
            onClose={() => setEditingObjective(null)}
          >
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Titre de l'objectif</label>
                <input 
                  type="text" 
                  value={editingObjective.title}
                  onChange={(e) => setEditingObjective({ ...editingObjective, title: e.target.value })}
                  className="w-full bg-black border border-white/10 p-4 text-white font-display italic text-lg outline-none focus:border-soyuz"
                  placeholder="Ex: Prime de Noël"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Description</label>
                <textarea 
                  value={editingObjective.description}
                  onChange={(e) => setEditingObjective({ ...editingObjective, description: e.target.value })}
                  className="w-full bg-black border border-white/10 p-4 text-white text-xs outline-none focus:border-soyuz h-24 resize-none"
                  placeholder="Détails sur l'objectif..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Montant cible ($)</label>
                <input 
                  type="number" 
                  value={editingObjective.target_amount}
                  onChange={(e) => setEditingObjective({ ...editingObjective, target_amount: parseFloat(e.target.value) })}
                  className="w-full bg-black border border-white/10 p-4 text-white font-display italic text-2xl outline-none focus:border-soyuz"
                  placeholder="0.00"
                />
              </div>

              <div className="pt-8 border-t border-white/5 space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                       <p className="text-[10px] text-white uppercase font-black">Audience Globale</p>
                       <p className="text-[9px] text-[#444444] font-bold">L'objectif est-il visible par tous les affiliés ?</p>
                    </div>
                    <button 
                      onClick={() => setEditingObjective({ ...editingObjective, is_global: !editingObjective.is_global })}
                      className={`w-12 h-6 rounded-full transition-all relative ${editingObjective.is_global ? 'bg-soyuz' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingObjective.is_global ? 'left-7' : 'left-1'}`} />
                    </button>
                 </div>

                 {!editingObjective.is_global && (
                   <div className="space-y-4">
                      <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Assigner à des affiliés spécifiques</p>
                      <div className="flex flex-wrap gap-2">
                        {affiliates.filter(a => a.status === 'approved').map((aff) => (
                          <button
                            key={aff.id}
                            onClick={() => {
                              const current = editingObjective.assigned_affiliates || [];
                              const exists = current.includes(aff.id);
                              setEditingObjective({
                                ...editingObjective,
                                assigned_affiliates: exists 
                                  ? current.filter((id: string) => id !== aff.id)
                                  : [...current, aff.id]
                              });
                            }}
                            className={`px-4 py-2 text-[8px] font-black uppercase border transition-all ${
                              editingObjective.assigned_affiliates?.includes(aff.id)
                                ? 'bg-soyuz border-soyuz text-black'
                                : 'bg-white/5 border-white/10 text-[#666666] hover:border-white/20'
                            }`}
                          >
                            {aff.full_name || aff.email}
                          </button>
                        ))}
                      </div>
                   </div>
                 )}
              </div>

              <button 
                onClick={saveObjective}
                disabled={isSavingObjective}
                className="w-full py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-soyuz hover:text-white transition-all shadow-xl disabled:opacity-30"
              >
                {isSavingObjective ? 'SAUVEGARDE...' : 'ENREGISTRER L\'OBJECTIF'}
              </button>
            </div>
          </FormLayout>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}

// Simple internal Badge component
function Badge({ variant = 'default', children, className = '' }: any) {
  return (
    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}
