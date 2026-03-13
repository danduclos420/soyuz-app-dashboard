'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, ArrowRight, Package, Truck, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
  const { clearCart } = useCartStore();
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session_id');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    clearCart();
  }, [clearCart]);

  if (!isHydrated) return null;

  return (
    <main className="min-h-screen bg-[#0D0D0D] pt-32 pb-20 px-4 flex flex-col items-center relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-soyuz/50 to-transparent" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-soyuz/5 blur-[120px] rounded-full" />

      <div className="max-w-xl w-full text-center relative z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 12, stiffness: 200 }}
          className="w-24 h-24 bg-soyuz/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-soyuz/20 shadow-[0_0_50px_rgba(0,229,255,0.15)]"
        >
          <CheckCircle2 size={48} className="text-soyuz" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4">Transmission Successful</h1>
          <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white italic mb-6">
            Gear <span className="outline-text-white">Confirmed</span>
          </h2>
          
          <p className="text-[#888888] text-sm uppercase font-bold tracking-widest leading-relaxed mb-12 max-w-md mx-auto">
            Your elite performance hardware has been secured. Our technicians are preparing your shipment for priority dispatch.
          </p>
        </motion.div>

        {/* Order Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-carbon-surface border border-white/5 rounded-3xl p-8 mb-12 text-left relative overflow-hidden"
        >
          <div className="absolute inset-0 carbon-texture opacity-5" />
          <div className="relative z-10">
            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-6 flex items-center gap-2">
              <Package size={14} className="text-soyuz" /> Shipment Details
            </h3>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider">
                <span className="text-[#888888]">Order ID</span>
                <span className="text-white font-mono">{sessionId?.slice(-12).toUpperCase() || 'SOYUZ-ONLINE'}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider">
                <span className="text-[#888888]">Status</span>
                <span className="text-soyuz">Paid & Processing</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-wider">
                <span className="text-[#888888]">Shipping Method</span>
                <span className="text-white">SOYUZ Priority Ground</span>
              </div>
            </div>

            <div className="p-4 bg-black/40 rounded-2xl border border-white/5 flex items-start gap-4">
              <div className="text-soyuz mt-1">
                <Truck size={16} />
              </div>
              <div>
                <p className="text-[10px] text-white font-black uppercase tracking-widest mb-1">Tracking Info</p>
                <p className="text-[10px] text-[#888888] uppercase font-bold">You will receive an automated transmission via email once your gear leaves the locker.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/products" className="btn-primary flex-1 py-5 text-sm">
            BACK TO CATALOG <ShoppingBag size={18} className="ml-3" />
          </Link>
          <Link href="/" className="inline-flex items-center justify-center border border-white/10 hover:border-white/30 text-white font-black uppercase tracking-widest text-[10px] px-8 py-5 transition-all">
            HOME <ArrowRight size={16} className="ml-3" />
          </Link>
        </motion.div>

        <div className="mt-20 flex items-center justify-center gap-8 opacity-30 grayscale contrast-125">
          <ShieldCheck size={24} className="text-white" />
          {/* Add small brand emblems if available */}
          <span className="text-white font-black italic tracking-widest text-[10px]">SOYUZ BC NORTH AMERICA</span>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center">
        <div className="text-soyuz animate-pulse uppercase tracking-[0.4em] text-[10px] font-black">
          Authenticating Transaction...
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
