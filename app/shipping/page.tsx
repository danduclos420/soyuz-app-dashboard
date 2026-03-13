'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Truck } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-black pt-40 pb-20 px-6 selection:bg-soyuz selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl aspect-square bg-soyuz/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="soyuz-container relative z-10">
        <BackButton variant="relative" className="mb-12" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          <div className="space-y-4">
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] uppercase tracking-[0.2em] rounded-full">
              LOGISTIC NODE 03
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              SHIPPING <br /><span className="outline-text-white">LOGISTICS</span>
            </h1>
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-8 text-[#888888] text-sm leading-relaxed uppercase font-bold tracking-wider">
            <p>
              WE DEPLOY HARDWARE ACROSS NORTH AMERICA VIA EXPEDITED PIPELINES. MOST DEPLOYMENTS ARRIVE WITHIN 3-5 BUSINESS DAYS.
            </p>
            <p>
              RETURNS ARE ACCEPTED FOR UNUSED HARDWARE WITHIN 14 DAYS OF DELIVERY. DEFECTIVE STICKS UNDER WARRANTY ARE ELIGIBLE FOR IMMEDIATE REPLACEMENT VIA OUR RAPID RESPONSE UNIT.
            </p>
            <div className="pt-8 border-t border-white/5 flex items-center gap-4 text-white">
              <Truck className="text-soyuz" size={24} />
              <p className="text-[10px] font-black tracking-[0.2em]">LOGISTICS STATUS: DEPLOYING NATIONWIDE</p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
