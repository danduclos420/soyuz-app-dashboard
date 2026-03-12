'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import BackButton from '@/components/BackButton';

export default function AdminPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: oData } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
    
    const { data: pData } = await supabase
      .from('products')
      .select('*, product_variants(*)');

    setOrders(oData || []);
    setProducts(pData || []);
    setLoading(false);
  }

  const handleSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/admin/sync', { method: 'POST' });
      const data = await res.json();
      if (data.error) alert(`Sync Error: ${data.error}`);
      else {
        alert('Sync completed successfully!');
        fetchData();
      }
    } catch (err) {
      alert('Sync failed. Check console.');
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-black flex items-center justify-center text-white italic">Loading Command Center...</div>;

  const totalRevenue = orders?.reduce((sum, o) => sum + o.total_amount, 0) || 0;
  const totalOrders = orders?.length || 0;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-8">
      <BackButton />
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-widest">ADMIN DASHBOARD</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-gray-200 transition-colors disabled:opacity-50"
        >
          {syncing ? 'SYNCING CATALOG...' : 'SYNC INVENTORY (ERPLAIN)'}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-[#0D0D0D] border border-white/10 p-6">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Total Revenue</p>
          <p className="text-3xl font-bold">CAD ${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-[#0D0D0D] border border-white/10 p-6">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Total Orders</p>
          <p className="text-3xl font-bold">{totalOrders}</p>
        </div>
        <div className="bg-[#0D0D0D] border border-white/10 p-6">
          <p className="text-gray-400 uppercase tracking-widest text-xs mb-2">Products</p>
          <p className="text-3xl font-bold">{products?.length || 0}</p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#0D0D0D] border border-white/10 p-6 mb-8">
        <h2 className="text-xl font-bold uppercase tracking-widest mb-6">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 uppercase tracking-widest text-xs border-b border-white/10">
                <th className="text-left pb-3">Order #</th>
                <th className="text-left pb-3">Customer</th>
                <th className="text-left pb-3">Total</th>
                <th className="text-left pb-3">Status</th>
                <th className="text-left pb-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3 font-mono">{order.order_number}</td>
                  <td className="py-3">{order.customer_email}</td>
                  <td className="py-3">CAD ${order.total_amount}</td>
                  <td className="py-3">
                    <span className="bg-white/10 text-white px-2 py-1 text-xs uppercase tracking-wider">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('fr-CA')}
                  </td>
                </tr>
              ))}
              {(!orders || orders.length === 0) && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-600">No orders yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
