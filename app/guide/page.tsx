'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Target, Shield, Ruler, Activity, Layers } from 'lucide-react';
import BackButton from '@/components/BackButton';

const GUIDE_CATEGORIES = [
  {
    title: 'CURVE',
    slug: 'curve',
    description: 'Find the perfect blade pattern for your shooting style.',
    icon: <Activity className="w-8 h-8 text-soyuz" />,
    details: 'Our hockey curve chart will help you compare popular brands to SOYUZ equivalent patterns.'
  },
  {
    title: 'KICK POINT',
    slug: 'kick-point',
    description: 'Optimize your release for power or speed.',
    icon: <Zap className="w-8 h-8 text-soyuz" />,
    details: 'Choose where you want the focus of the bend of your stick to be located for maximum efficiency.'
  },
  {
    title: 'HEIGHT',
    slug: 'height',
    description: 'Get the exact measurement for your stance.',
    icon: <Ruler className="w-8 h-8 text-soyuz" />,
    details: 'Learn how to measure your stick and get the perfect fit for your next order.'
  },
  {
    title: 'LIE',
    slug: 'lie',
    description: 'Perfect the angle of your blade on the ice.',
    icon: <Target className="w-8 h-8 text-soyuz" />,
    details: 'Understand how your blade sits on the ice in your natural skating or shooting stance.'
  },
  {
    title: 'FLEX',
    slug: 'flex',
    description: 'Choose the right stiffness for your strength.',
    icon: <Layers className="w-8 h-8 text-soyuz" />,
    details: 'Understand what stick flex is best suited for your weight and playing style.'
  },
  {
    title: 'PLAYER SIDE',
    slug: 'player-side',
    description: 'Left or Right? Find your natural side.',
    icon: <Shield className="w-8 h-8 text-soyuz" />,
    details: 'Establish what side feels more natural to your playing style: Left or Right handed.'
  }
];

export default function GuidePage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24 selection:bg-soyuz selection:text-white">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      
      <div className="soyuz-container relative z-10">
        <BackButton variant="relative" className="mb-12" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl"
        >
          <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
            SOYUZ TECHNICAL ACADEMY
          </span>
          <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-8">
            STICK <br /><span className="outline-text-white">GUIDE</span>
          </h1>
          <p className="text-[#888888] font-bold uppercase tracking-widest text-sm mb-16 max-w-2xl leading-relaxed">
            Master the art of selection. Our technical guide provides everything you need to know to optimize your performance with professional grade equipment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDE_CATEGORIES.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                href={`/guide/${cat.slug}`}
                className="group block p-10 bg-white/[0.02] border border-white/5 hover:border-soyuz/30 transition-all duration-500 relative overflow-hidden h-full"
              >
                <div className="absolute inset-0 carbon-texture opacity-0 group-hover:opacity-5 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-8 w-16 h-16 bg-white/[0.03] border border-white/5 flex items-center justify-center rounded-2xl group-hover:scale-110 group-hover:bg-soyuz/10 transition-transform duration-500">
                    {cat.icon}
                  </div>
                  <h3 className="text-xl font-display mb-3 group-hover:text-soyuz transition-colors italic">
                    {cat.title}
                  </h3>
                  <p className="text-[#666666] text-xs font-bold uppercase tracking-widest mb-6 leading-relaxed group-hover:text-[#888888] transition-colors">
                    {cat.description}
                  </p>
                  <p className="text-[#444444] text-[10px] leading-relaxed mb-8 group-hover:text-[#666666] transition-colors">
                    {cat.details}
                  </p>
                  <div className="flex items-center gap-2 text-soyuz font-black text-[10px] uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity">
                    Explore Guide <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
