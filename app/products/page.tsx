'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Filter, Search, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mockProducts = [
  { id: 1, name: 'SOYUZ PRO V1', category: 'PRO', flex: 85, curve: 'P92', price: 299, image: 'https://images.unsplash.com/photo-1547053501-bc8497672af6?q=80&w=800&auto=format&fit=crop' },
  { id: 2, name: 'SOYUZ ELITE 85', category: 'ELITE', flex: 75, curve: 'P28', price: 249, image: 'https://images.unsplash.com/photo-1580748141549-716500ca23ae?q=80&w=800&auto=format&fit=crop' },
  { id: 3, name: 'SOYUZ CORE 20', category: 'CORE', flex: 85, curve: 'P88', price: 199, image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800&auto=format&fit=crop' },
  { id: 4, name: 'SOYUZ PRO V1 (LEFT)', category: 'PRO', flex: 100, curve: 'P92', price: 299, image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop' },
  // More products could go here...
];

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="bg-background min-h-screen">
      {/* Header / Search Area */}
      <section className="pt-32 pb-12 border-b border-white/5 bg-carbon-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white">Le Catalogue</h1>
              <p className="text-muted uppercase tracking-[0.2em] text-xs font-bold">Elite Performance Hockey Sticks</p>
            </div>
            
            <div className="w-full md:w-96 flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
                <input 
                  type="text"
                  placeholder="Rechercher un modèle..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-carbon-surface border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:border-soyuz transition-all"
                />
              </div>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden p-3 bg-white text-black rounded-xl"
              >
                <SlidersHorizontal size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block w-64 space-y-10 shrink-0 sticky top-32 h-fit">
            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/10">Catégories</h4>
              <div className="space-y-3">
                {['PRO SERIES', 'ELITE SERIES', 'CORE SERIES', 'GOALIE'].map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-4 h-4 border border-white/20 rounded-sm group-hover:border-soyuz transition-colors" />
                    <span className="text-muted text-sm group-hover:text-white transition-colors">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/10">Flex</h4>
              <div className="grid grid-cols-2 gap-2">
                {[75, 85, 95, 100].map((f) => (
                  <button key={f} className="py-2 px-4 border border-white/5 text-xs text-muted hover:border-soyuz hover:text-white transition-all">
                    {f}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-bold uppercase tracking-widest text-xs mb-6 pb-2 border-b border-white/10">Courbe</h4>
              <div className="grid grid-cols-2 gap-2">
                {['P92', 'P28', 'P88', 'P02'].map((c) => (
                  <button key={c} className="py-2 px-4 border border-white/5 text-xs text-muted hover:border-soyuz hover:text-white transition-all">
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-xs text-muted font-bold tracking-widest">AFFICHE {mockProducts.length} PRODUITS</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Trier par:</span>
                <button className="flex items-center gap-2 text-xs text-white uppercase font-bold tracking-widest">
                  Nouveautés <ChevronDown size={14} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {mockProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] bg-carbon-surface mb-6 overflow-hidden rounded-2xl border border-white/5">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 holographic opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-soyuz font-bold tracking-widest uppercase">{product.category} SERIES</p>
                    <h4 className="text-white font-bold uppercase tracking-tight group-hover:text-soyuz transition-colors leading-tight">
                      {product.name}
                    </h4>
                    <p className="text-sm text-muted font-black tracking-widest">{product.price},00 $</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
