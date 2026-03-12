'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const collections = [
  {
    id: 'pro',
    title: 'SOYUZ PRO',
    description: 'Developed for professional league requirements. Maximum stiffness and power.',
    image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=2000&auto=format&fit=crop',
    color: 'from-soyuz/40 to-black/80'
  },
  {
    id: 'elite',
    title: 'SOYUZ ELITE',
    description: 'Lightweight performance. Perfect balance for competitive athletes.',
    image: 'https://images.unsplash.com/photo-1547053501-bc8497672af6?q=80&w=2000&auto=format&fit=crop',
    color: 'from-white/20 to-black/80'
  },
  {
    id: 'core',
    title: 'SOYUZ CORE',
    description: 'Durability meets precision. The ideal choice for rising talents.',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=2000&auto=format&fit=crop',
    color: 'from-gray-600/40 to-black/80'
  }
];

export default function CollectionsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section id="collections" className="py-24 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-soyuz font-bold uppercase tracking-[0.3em] text-sm mb-4">Discover</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Nos Collections</h3>
          </div>
          <div className="hidden md:flex gap-4">
            <button 
              onClick={() => scroll('left')}
              className="p-4 border border-white/10 hover:border-white/30 text-white transition-all rounded-full"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="p-4 border border-white/10 hover:border-white/30 text-white transition-all rounded-full"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {collections.map((col) => (
            <motion.div 
              key={col.id}
              whileHover={{ y: -10 }}
              className="min-w-[85vw] sm:min-w-[450px] aspect-[4/5] relative rounded-2xl overflow-hidden snap-start group border border-white/5"
            >
              {/* Image Background */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${col.image})` }}
              />
              
              {/* Overlay / Glassmorphism */}
              <div className={`absolute inset-0 bg-gradient-to-t ${col.color} backdrop-blur-[2px]`} />
              
              {/* Content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <h4 className="text-3xl font-black text-white uppercase mb-4 leading-none">
                  {col.title}
                </h4>
                <p className="text-white/70 text-sm mb-8 max-w-xs transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  {col.description}
                </p>
                <div className="pt-4 border-t border-white/10">
                  <span className="text-white font-bold uppercase tracking-widest text-xs group-hover:text-soyuz transition-colors">
                    Explorer la collection →
                  </span>
                </div>
              </div>
              
              {/* Holographic detail on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 holographic pointer-events-none transition-opacity duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
