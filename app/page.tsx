'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronDown } from 'lucide-react';

// FAKE COLLECTIONS - just visuals for now
const COLLECTIONS = [
  { name: 'HIT ULTRA Series', image: '/assets/1.png', count: '3 products', slug: 'hit-ultra' },
  { name: 'CLASSIC Series', image: '/assets/2.png', count: '0 products', slug: 'classic' },
  { name: 'MASTER FRST', image: '/assets/3.png', count: '1 product', slug: 'master-frst' },
  { name: 'LORD Goalie Series', image: '/assets/4.png', count: '1 product', slug: 'lord-goalie' },
];

// FAKE FEATURED PRODUCTS
const FEATURED = [
  {
    id: 1,
    name: 'SOYUZ HIT ULTRA Flex 75',
    price: 184.00,
    image: '/assets/1.png',
    slug: 'hit-ultra-75',
    badge: 'Best Seller',
  },
  {
    id: 2,
    name: 'SOYUZ MASTER FRST Pro',
    price: 199.00,
    image: '/assets/3.png',
    slug: 'master-frst-pro',
    badge: null,
  },
  {
    id: 3,
    name: 'SOYUZ LORD Goalie Stick',
    price: 224.00,
    image: '/assets/4.png',
    slug: 'lord-goalie',
    badge: 'New',
  },
];

export default function HomePage() {
  return (
    <div className="flex flex-col w-full">
      {/* HERO SECTION */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/assets/New arrival.png"
            alt="SOYUZ Hockey Sticks"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="hero-overlay absolute inset-0" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-soyuz font-label text-[11px] mb-4"
          >
            DESIGNED FOR ELITE ATHLETES
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl mb-6 leading-none"
          >
            PROFESSIONAL HOCKEY STICKS
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-[#AAAAAA] text-sm md:text-base mb-10 uppercase tracking-widest max-w-2xl mx-auto"
          >
            SOYUZ BC North America — Engineered for champions
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/products" className="btn-primary">
              SHOP ALL <ArrowRight size={16} />
            </Link>
            <Link href="/rep/register" className="btn-outline">
              BECOME A REP
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown size={24} className="animate-bounce text-white/60" />
        </motion.div>
      </section>

      {/* TICKER BANNER */}
      <div className="bg-soyuz py-3 overflow-hidden">
        <div className="ticker-wrap">
          <div className="ticker-inner">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center whitespace-nowrap px-8">
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm">STRENGTH IN UNITY</span>
                <span className="mx-8 text-white/50">•</span>
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm">POWER WITH SOYUZ</span>
                <span className="mx-8 text-white/50">•</span>
                <span className="text-white font-black uppercase tracking-[0.2em] text-sm">BREAK THE LIMITS</span>
                <span className="mx-8 text-white/50">•</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* COLLECTIONS SECTION */}
      <section className="section-padding carbon-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-soyuz font-label mb-2">Our Collections</p>
            <h2 className="font-display text-4xl md:text-5xl">BUILT FOR CHAMPIONS</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COLLECTIONS.map((col, i) => (
              <Link
                key={col.slug}
                href={`/products?category=${col.slug}`}
                className="group relative overflow-hidden bg-carbon-surface border border-carbon-border hover:border-white/20 transition-all duration-300 aspect-[3/4]"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={col.image}
                    alt={col.name}
                    fill
                    className="object-contain object-center p-8 group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                  <h3 className="font-display text-xl mb-1">{col.name}</h3>
                  <p className="text-[#888888] text-xs uppercase tracking-wider">{col.count}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section-padding bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-soyuz font-label mb-2">Top Picks</p>
            <h2 className="font-display text-4xl md:text-5xl">FEATURED STICKS</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURED.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="product-card group"
              >
                <div className="relative aspect-square bg-[#1A1A1A]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain object-center p-6 group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <div className="absolute top-3 right-3 bg-soyuz text-white text-[9px] font-bold uppercase tracking-widest px-3 py-1.5">
                      {product.badge}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-bold uppercase tracking-wide text-sm mb-2 group-hover:text-soyuz transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-black">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products" className="btn-primary">
              VIEW ALL PRODUCTS <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ABOUT SOYUZ SECTION */}
      <section className="section-padding carbon-bg border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-soyuz font-label mb-3">The SOYUZ Difference</p>
              <h2 className="font-display text-4xl md:text-5xl mb-6">ENGINEERED FOR EXCELLENCE</h2>
              <p className="text-[#AAAAAA] leading-relaxed mb-6">
                SOYUZ BC is the official stick sponsor of the KHL, trusted by professional athletes worldwide.
                Our sticks combine cutting-edge carbon fiber technology with precision engineering.
              </p>
              <p className="text-[#AAAAAA] leading-relaxed mb-8">
                Every SOYUZ stick is designed for elite performance — from quick release to durability,
                we deliver unmatched quality for players who demand the best.
              </p>
              <Link href="/about" className="btn-outline">
                LEARN MORE <ArrowRight size={14} />
              </Link>
            </div>
            <div className="relative aspect-square">
              <Image
                src="/assets/Profil+clear.png"
                alt="SOYUZ Technology"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* B2B CTA SECTION */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0D0D0D] via-[#1A1A1A] to-[#0D0D0D]" />
        <div className="absolute inset-0 carbon-bg opacity-50" />
        
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <p className="text-soyuz font-label mb-4">Business Opportunities</p>
          <h2 className="font-display text-4xl md:text-6xl mb-6">BECOME A SOYUZ REP</h2>
          <p className="text-[#AAAAAA] text-lg max-w-2xl mx-auto mb-10">
            Join our network of authorized reps. Gain access to exclusive B2B pricing,
            real-time inventory, and dedicated support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/rep/register" className="btn-primary text-base px-8 py-4">
              APPLY NOW <ArrowRight size={18} />
            </Link>
            <a
              href="https://soyuz-hockey.erplain.app/b2b/login"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline text-base px-8 py-4"
            >
              B2B PORTAL LOGIN
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
