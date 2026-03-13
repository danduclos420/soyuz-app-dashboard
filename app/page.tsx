'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, ChevronDown, Zap, Shield, Trophy, Target } from 'lucide-react';
import { useRef, Fragment } from "react";

// COLLECTIONS
const COLLECTIONS = [
  { name: 'HIT ULTRA Series', image: '/assets/products/hit-ultra.png', count: 'Pro Level Flex', slug: 'hit-ultra', color: 'from-soyuz/20' },
  { name: 'MASTER FRST Pro', image: '/assets/products/master-frst.png', count: 'Elite Power', slug: 'master-frst', color: 'from-blue-500/10' },
  { name: 'LORD Goalie', image: '/assets/products/lord-goalie.png', count: 'Ultimate Defense', slug: 'lord-goalie', color: 'from-amber-500/10' },
  { name: 'CLASSIC Legacy', image: '/assets/products/classic.png', count: 'Heritage Feel', slug: 'classic', color: 'from-white/10' },
];

// FEATURED PRODUCTS
const FEATURED = [
  { id: 1, name: 'HIT ULTRA Flex 75', price: 184.00, image: '/assets/products/hit-ultra.png', slug: 'hit-ultra-75', badge: 'Best Seller' },
  { id: 2, name: 'MASTER FRST Pro', price: 199.00, image: '/assets/products/master-frst.png', slug: 'master-frst-pro', badge: 'Elite Choice' },
  { id: 3, name: 'LORD Goalie Stick', price: 224.00, image: '/assets/products/lord-goalie.png', slug: 'lord-goalie', badge: 'New' },
];

export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToCollections = () => {
    const nextSection = document.getElementById('collections-top');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col w-full bg-background selection:bg-soyuz selection:text-white">
      {/* 1. HERO SECTION (RESET) */}
      <section 
        ref={heroRef}
        className="relative min-h-[calc(100dvh-150px)] w-full flex items-center justify-center overflow-hidden border-b border-white/5"
      >
        <motion.div style={{ y, opacity }} className="absolute inset-0 z-0 h-full w-full bg-[#111111]">
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-background" />
          <div className="absolute inset-0 carbon-texture opacity-10" />
          <Image 
            src="/assets/hero-bg.png"
            alt="SOYUZ Background"
            fill
            className="object-cover opacity-40 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0D0D] via-[#111] to-[#CC0000]/20" />
        </motion.div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto -mt-32 md:-mt-40">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-soyuz font-label text-[10px] mb-4 backdrop-blur-md">
              DESIGNED FOR ELITE ATHLETES
            </span>
            
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl mb-8 leading-[0.9] tracking-tighter italic">
              ENGINEERED <br />
              <span className="outline-text-white block mt-2">FOR POWER</span>
            </h1>

            <p className="text-[#AAAAAA] text-sm md:text-lg mb-12 uppercase tracking-[0.3em] font-medium max-w-2xl mx-auto leading-relaxed">
              SOYUZ BC North America — The standard in <br className="hidden md:block" /> professional performance hockey.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link href="/products" className="btn-primary group min-w-[200px] h-14 flex items-center justify-center text-sm font-black">
                SHOP COLLECTION <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/affiliate/register" className="btn-outline h-14 flex items-center justify-center min-w-[200px] text-sm font-black bg-white/5 backdrop-blur-sm">
                JOIN THE TEAM
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.button
          onClick={scrollToCollections}
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 group cursor-pointer"
        >
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40 font-bold group-hover:text-soyuz transition-colors">Discover</span>
          <ChevronDown size={20} className="text-white/40 group-hover:text-soyuz transition-colors" />
        </motion.button>
      </section>

      {/* 2. INFINITE TICKER (RED) */}
      <div id="collections-top" className="bg-soyuz py-2 overflow-hidden relative z-20 shadow-[0_0_50px_rgba(204,0,0,0.2)] scroll-mt-[92px]">
        <div className="ticker-wrap flex items-center h-14 md:h-16">
          <div className="ticker-inner gap-24">
            {[...Array(4)].map((_, i) => (
              <Fragment key={i}>
                <span className="text-white font-black uppercase tracking-[0.1em] text-2xl md:text-3xl flex-shrink-0 leading-none">STRENGTH IN UNITY</span>
                <img src="/assets/player-banner.webp" alt="" className="h-10 md:h-12 w-auto grayscale brightness-150 block object-contain flex-shrink-0" />
                <span className="text-white font-black uppercase tracking-[0.1em] text-2xl md:text-3xl flex-shrink-0 leading-none">POWER WITH SOYUZ</span>
                <img src="/assets/logo-banner.png" alt="" className="h-8 md:h-10 w-auto brightness-0 invert opacity-100 block object-contain flex-shrink-0" />
                <span className="text-white font-black uppercase tracking-[0.1em] text-2xl md:text-3xl flex-shrink-0 leading-none">BREAK EVERY LIMIT</span>
                <img src="/assets/player-banner.webp" alt="" className="h-10 md:h-12 w-auto grayscale brightness-150 block object-contain flex-shrink-0" />
                <span className="text-white font-black uppercase tracking-[0.1em] text-2xl md:text-3xl flex-shrink-0 leading-none">SOYUZ NORTH AMERICA</span>
                <img src="/assets/logo-banner.png" alt="" className="h-8 md:h-10 w-auto brightness-0 invert opacity-100 block object-contain flex-shrink-0" />
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 3. COLLECTIONS GRID */}
      <section className="section-padding carbon-bg relative overflow-hidden" id="collections">
        <div className="absolute top-0 left-0 w-full h-px bg-white/5" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-xl">
              <p className="text-soyuz font-label mb-3">Elite Tier Gear</p>
              <h2 className="font-display text-5xl md:text-7xl italic leading-none">CRAFTED FOR <br /><span className="outline-text-white">LEGENDS</span></h2>
            </div>
            <Link href="/products" className="text-xs font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors flex items-center gap-2 group">
              View all series <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {COLLECTIONS.map((col, i) => (
              <motion.div
                key={col.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link
                  href={`/products?category=${col.slug}`}
                  className="group relative flex flex-col h-[500px] overflow-hidden bg-[#151515] border border-white/5 hover:border-soyuz/40 transition-all duration-500"
                >
                  <div className={`absolute inset-0 bg-gradient-to-t ${col.color} to-transparent opacity-40 group-hover:opacity-60 transition-opacity`} />
                  <div className="relative w-full h-full p-12">
                    <Image
                      src={col.image}
                      alt={col.name}
                      fill
                      className="object-contain object-center p-12 group-hover:scale-105 transition-transform duration-700 brightness-75 group-hover:brightness-100"
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-8 pt-20 bg-gradient-to-t from-black via-black/40 to-transparent">
                    <h3 className="font-display text-2xl mb-2">{col.name}</h3>
                    <p className="text-soyuz font-label text-[9px]">{col.count}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PERFORMANCE HIGHLIGHTS */}
      <section className="py-32 bg-[#0D0D0D] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { icon: Zap, title: "Lethal Release", desc: "Proprietary taper design for instant power transfer." },
              { icon: Shield, title: "Carbon Shield", desc: "Aerospace grade fiber for maximum shaft durability." },
              { icon: Target, title: "Precision Control", desc: "Refined blade stiffness for pin-point accuracy." },
              { icon: Trophy, title: "Pro Proven", desc: "Trusted by athletes in the highest professional leagues." },
            ].map((feature, i) => (
              <div key={i} className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-soyuz/10 border border-soyuz/20 flex items-center justify-center">
                  <feature.icon className="text-soyuz" size={24} />
                </div>
                <h4 className="text-white font-black uppercase text-sm tracking-wider">{feature.title}</h4>
                <p className="text-[#888888] text-xs leading-relaxed uppercase font-bold tracking-tight">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. B2B / REP CTA */}
      <section className="relative py-32 overflow-hidden bg-black">
        <div className="absolute inset-0 carbon-texture opacity-5 animate-shimmer" />
        <div className="max-w-5xl mx-auto text-center px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="font-display text-5xl md:text-8xl italic uppercase text-white leading-none">
              BATTLE <br />
              <span className="outline-text-white">TOGETHER</span>
            </h2>
            <p className="text-[#AAAAAA] text-lg max-w-2xl mx-auto uppercase font-bold tracking-widest leading-relaxed">
              Join the official SOYUZ North America rep network. Access exclusive B2B portals and dominate your local market.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/affiliate/register" className="btn-primary h-16 px-12 text-sm">
                JOIN THE AFFILIATES <Zap size={16} fill="white" />
              </Link>
              <a href="https://soyuz-hockey.erplain.app/b2b/login" target="_blank" className="btn-outline h-16 px-12 text-sm border-white/20">
                B2B LOGIN
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
