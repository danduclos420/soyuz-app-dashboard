'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/BackButton';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

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
    
    // Fetch stats & data
    const { data: oData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { data: pData } = await supabase.from('products').select('id');
    const { data: rData } = await supabase.from('profiles').select('*').in('role', ['affiliate', 'rep']).order('status', { ascending: false });

    setOrders(oData || []);
    setReps(rData || []);
    
    setStats({
      revenue: oData?.reduce((sum, o) => sum + o.total_amount, 0) || 0,
      orders: oData?.length || 0,
      products: pData?.length || 0,
      reps: rData?.length || 0
    });

    setLoading(false);
  }

  const handleSync = async () => {
    setSyncing(true);
    try {
      await fetch('/api/admin/sync', { method: 'POST' });
      fetchData();
    } catch (err) {
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

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-soyuz font-black italic">COMMAND CENTER INITIALIZING...</div>;

  return (
    <div className="bg-black min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <BackButton href="/" label="Back to Storefront" />

      {/* 1. Header Area */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-12">
          <div>
            <h1 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-2 text-glow-cyan">System Administration</h1>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
              Global <span className="outline-text-cyan">Control</span>
            </h2>
          </div>
          <div className="flex gap-4">
            <Button 
              onClick={handleSync}
              disabled={syncing}
              variant="outline" 
              className="border-soyuz text-soyuz hover:bg-soyuz hover:text-black rounded-none shadow-[0_0_15px_rgba(0,229,255,0.15)]"
            >
              <RefreshCw size={16} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Inventory'}
            </Button>
            <Button variant="primary" className="bg-white text-black font-black rounded-none shadow-lg">
              System Settings
            </Button>
          </div>
        </div>

        {/* 2. Tabs */}
        <div className="flex gap-8 mt-8">
          {[
            { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
            { id: 'reps', label: 'Representatives', icon: <Users size={18} /> },
            { id: 'products', label: 'Product Catalog', icon: <Box size={18} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'border-soyuz text-white' 
                  : 'border-transparent text-muted hover:text-white'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Content Area */}
      <div className="max-w-7xl mx-auto">
        {activeTab === 'overview' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-12"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Revenue', value: `CAD $${stats.revenue.toFixed(2)}`, icon: <TrendingUp className="text-soyuz" /> },
                { label: 'Active Orders', value: stats.orders, icon: <ShoppingBag className="text-soyuz" /> },
                { label: 'Sync Status', value: 'Healthy', icon: <RefreshCw className="text-soyuz" /> },
                { label: 'New Apps', value: reps.filter(r => r.status === 'pending').length, icon: <Users className="text-soyuz" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-carbon-surface border border-white/5 p-8 rounded-3xl relative overflow-hidden shadow-2xl">
                  <div className="absolute inset-0 carbon-texture opacity-5" />
                  <div className="relative z-10 space-y-4">
                    <div className="w-10 h-10 bg-black rounded-xl border border-white/5 flex items-center justify-center">{stat.icon}</div>
                    <div>
                      <p className="text-muted text-[10px] uppercase font-black tracking-widest">{stat.label}</p>
                      <p className="text-2xl font-black text-white">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Section */}
            <div className="bg-carbon-surface border border-white/5 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Recent Sales Data</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/5 text-[10px] text-muted font-black uppercase tracking-widest">
                        <th className="pb-4 px-4">Order ID</th>
                        <th className="pb-4 px-4">Customer</th>
                        <th className="pb-4 px-4">Total</th>
                        <th className="pb-4 px-4">Status</th>
                        <th className="pb-4 px-4">Affiliate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                          <td className="py-6 px-4 font-mono text-xs text-white">#{order.order_number}</td>
                          <td className="py-6 px-4 text-sm text-muted">{order.customer_email}</td>
                          <td className="py-6 px-4 text-sm font-black text-white">${order.total_amount}</td>
                          <td className="py-6 px-4">
                            <Badge variant="outline" className="text-[10px] border-white/10 uppercase tracking-widest">{order.status}</Badge>
                          </td>
                          <td className="py-6 px-4 text-[10px] font-black uppercase text-soyuz">{order.affiliate_code || '--'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'reps' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-carbon-surface border border-white/5 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Pending Applications</h3>
                <div className="space-y-4">
                  {reps.filter(r => r.status === 'pending').map((rep) => (
                    <div key={rep.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-black/40 border border-white/5 rounded-2xl hover:border-soyuz/30 transition-all gap-6">
                      <div className="flex gap-4 items-center">
                        <div className="w-12 h-12 bg-soyuz/10 rounded-full flex items-center justify-center font-black text-soyuz">
                          {rep.first_name?.[0]}{rep.last_name?.[0]}
                        </div>
                        <div>
                          <p className="text-white font-black uppercase tracking-tight italic">{rep.first_name} {rep.last_name}</p>
                          <p className="text-muted text-xs font-mono">{rep.email} | ID: {rep.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => updateRepStatus(rep.id, 'rejected')}
                          variant="outline" 
                          className="border-white/10 text-white rounded-none flex-1 md:flex-none"
                        >
                          <X size={16} className="mr-2" /> Reject
                        </Button>
                        <Button 
                          onClick={() => updateRepStatus(rep.id, 'approved')}
                          variant="primary" 
                          className="bg-soyuz text-black font-black rounded-none flex-1 md:flex-none"
                        >
                          <Check size={16} className="mr-2" /> Approve
                        </Button>
                      </div>
                    </div>
                  ))}
                  {reps.filter(r => r.status === 'pending').length === 0 && (
                    <p className="text-center py-12 text-muted uppercase tracking-widest text-xs font-black">No pending applications</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-carbon-surface border border-white/5 rounded-3xl p-10 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic mb-8">Active Reps</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reps.filter(r => r.status === 'approved').map((rep) => (
                    <div key={rep.id} className="p-6 bg-black/20 border border-white/5 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge variant="outline" className="bg-soyuz/10 text-soyuz border-soyuz/20 font-black">{rep.affiliate_code}</Badge>
                        <p className="text-white font-black text-sm uppercase tracking-tight italic">{rep.first_name} {rep.last_name}</p>
                      </div>
                      <ChevronRight size={16} className="text-muted" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'products' && (
          <div className="bg-carbon-surface border border-white/5 rounded-3xl p-10 relative overflow-hidden">
             <div className="absolute inset-0 carbon-texture opacity-5" />
             <div className="relative z-10 text-center py-20">
               <ShieldAlert className="text-soyuz mx-auto mb-6" size={48} />
               <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4 italic">Product Engine Access</h3>
               <p className="text-muted text-sm max-w-md mx-auto mb-8 font-medium">
                 Individual product editing is disabled because Erplain is the single source of truth for stock and base pricing. Use the Sync button above to update from center.
               </p>
               <Button variant="outline" className="border-soyuz text-soyuz hover:bg-soyuz hover:text-black">
                 Manage Local Overrides
               </Button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
