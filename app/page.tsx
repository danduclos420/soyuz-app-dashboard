'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ChevronDown } from 'lucide-react';
import CollectionsSection from '@/components/storefront/CollectionsSection';
import FeaturedProductsSection from '@/components/storefront/FeaturedProductsSection';
import AboutSection from '@/components/storefront/AboutSection';
import B2BSection from '@/components/storefront/B2BSection';

export default function HomePage() {
  const tickerText = "STRENGTH IN UNITY . POWER WITH SOYUZ . BREAK THE LIMITS . ";

  return (
    <div className="flex flex-col w-full">
      {/* 1. HERO SECTION (README Step 3.1.1) */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 opacity-60">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-10" />
          <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1580748141549-716500ca23ae?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale" />
        </div>

        <div className="relative z-20 text-center px-4 max-w-5xl mx-auto mt-20">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-soyuz font-bold uppercase tracking-[0.5em] text-xs sm:text-sm mb-6"
          >
            Professional Hockey Sticks
          </motion.p>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-4 leading-none"
          >
            Designed for <br />
            <span className="text-white outline-text">Elite Athletes</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-lg md:text-xl uppercase tracking-widest text-muted mb-12 max-w-2xl mx-auto"
          >
            SOYUZ BC NORTH AMERICA — THE GOLDEN SHOT
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button variant="primary" size="lg" className="min-w-[200px]" asChild>
              <a href="/products">Shop All</a>
            </Button>
            <Button variant="outline" size="lg" className="min-w-[200px]" asChild>
              <a href="#b2b">Devenir Revendeur</a>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 text-white opacity-50"
        >
          <ChevronDown size={32} />
        </motion.div>
      </section>

      {/* 2. BANNIERE SCROLLANTE (README Step 3.1.2) */}
      <div className="bg-soyuz py-6 overflow-hidden border-y border-white/10 relative z-20">
        <div className="ticker-track">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="mx-8 text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-white whitespace-nowrap">
              {tickerText}
            </span>
          ))}
        </div>
      </div>

      {/* 3. SECTION COLLECTIONS (README Step 3.1.3) */}
      <CollectionsSection />

      {/* 4. PRODUITS VEDETTES (README Step 3.1.4) */}
      <FeaturedProductsSection />

      {/* 5. SECTION A PROPOS SOYUZ (README Step 3.1.5) */}
      <AboutSection />

      {/* 7. SECTION B2B (README Step 3.1.7) */}
      <B2BSection />
    </div>
  );
}
