'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { Search, SlidersHorizontal, ChevronDown, ShoppingBag, ArrowRight, Zap, Target, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCartStore } from '@/lib/store/cart';
import SoyuzButton from '@/components/ui/SoyuzButton';

// TYPES
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  stock_qty: number;
  description?: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  const { addItem } = useCartStore();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(data);
      }
      setLoading(false);
    }
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
      const hasImage = p.images && p.images.length > 0 && p.images[0];
      return matchesSearch && matchesCategory && hasImage;
    })
    .sort((a, b) => {
      // Products with stock ( > 0) come first
      if (a.stock_qty > 0 && b.stock_qty <= 0) return -1;
      if (a.stock_qty <= 0 && b.stock_qty > 0) return 1;
      return 0; // Maintain relative order (by created_at from Supabase)
    });

  const CATEGORIES = ['ALL', ...Array.from(new Set(products.map(p => p.category)))];

  return (
    <div className="bg-background min-h-screen selection:bg-soyuz selection:text-white">
      {/* 1. HEADER AREA */}
      <section className="relative pt-40 pb-20 border-b border-white/5 overflow-hidden">
        <div className="absolute inset-0 carbon-texture opacity-5" />
        <div className="soyuz-container relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
                SOYUZ BC NORTH AMERICA
              </span>
              <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-6">
                ELITE <br /><span className="outline-text-white">CATALOG</span>
              </h1>
              <p className="text-[#888888] font-bold uppercase tracking-widest text-xs">
                Professional grade equipment for elite level competition.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full md:w-96"
            >
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#444444] group-focus-within:text-soyuz transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="SEARCH MODEL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-0 pl-12 pr-4 py-4 text-xs font-bold uppercase tracking-widest text-white focus:outline-none focus:border-soyuz transition-all"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="soyuz-container py-16">
        <div className="flex flex-col lg:flex-row gap-16">
          {/* 2. SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-64 space-y-12 shrink-0 sticky top-32 h-fit">
            <div>
              <h4 className="text-white font-label text-[10px] mb-8 pb-3 border-b border-white/10 flex items-center justify-between">
                <span>SERIES</span>
                <ChevronDown size={12} />
              </h4>
              <div className="space-y-4">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`flex items-center gap-3 w-full text-left group transition-all ${
                      selectedCategory === cat ? 'text-soyuz' : 'text-[#555555] hover:text-white'
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rotate-45 border border-current transition-all ${
                      selectedCategory === cat ? 'bg-soyuz scale-125' : 'bg-transparent'
                    }`} />
                    <span className="text-[11px] font-black uppercase tracking-widest">{cat}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 carbon-texture opacity-10" />
              <div className="relative z-10">
                <p className="text-[9px] font-bold text-soyuz uppercase tracking-widest mb-2">PRO TIP</p>
                <p className="text-[10px] text-white/60 leading-relaxed uppercase font-black tracking-tight">
                  High flex (85+) is recommended for heavy shooters. Low flex (65-75) for quick release specialists.
                </p>
              </div>
            </div>
          </aside>

          {/* 3. PRODUCT GRID */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-12">
              <p className="text-[10px] text-white/40 font-black tracking-[0.2em] uppercase">
                {loading ? 'STATUS: FETCHING...' : `INVENTORY: ${filteredProducts.length} UNITS`}
              </p>
              <div className="flex items-center gap-6">
                <button className="flex items-center gap-2 text-[10px] text-white uppercase font-black tracking-widest hover:text-soyuz transition-colors">
                  SORT: NEWEST <ChevronDown size={14} />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-6">
                    <div className="aspect-[3/4] bg-white/5 border border-white/5 rounded-0" />
                    <div className="h-4 w-2/3 bg-white/5" />
                    <div className="h-4 w-1/3 bg-white/5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                <AnimatePresence>
                  {filteredProducts.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      layout
                      className="group flex flex-col h-full"
                    >
                      <Link href={`/products/${product.slug}`} className="relative aspect-[3/4] bg-[#0A0A0A] mb-8 overflow-hidden border border-white/5 group-hover:border-soyuz/30 transition-all duration-500">
                        {product.images && product.images[0] ? (
                          <Image
                            src={product.images[0]} 
                            alt={product.name}
                            fill
                            className="object-contain p-8 grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-white/20 uppercase tracking-widest">
                            No Preview
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 p-4">
                          <SoyuzButton 
                            variant="primary" 
                            size="sm" 
                            icon={ArrowRight}
                            className="w-full h-10"
                          >
                            VIEW DETAILS
                          </SoyuzButton>
                        </div>
                        {product.stock_qty <= 0 && (
                          <div className="absolute top-4 right-4 bg-soyuz text-white text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1">
                            BACK-ORDER
                          </div>
                        )}
                      </Link>
                      
                      <div className="mt-auto space-y-2">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <p className="text-[9px] text-soyuz font-black tracking-[0.2em] uppercase">{product.category}</p>
                            <Link href={`/products/${product.slug}`}>
                              <h4 className="text-white text-sm font-black uppercase tracking-tight group-hover:text-soyuz transition-colors leading-tight italic">
                                {product.name}
                              </h4>
                            </Link>
                          </div>
                          <p className="text-lg font-display text-white italic">${product.price}</p>
                        </div>
                        <div className="pt-4 flex items-center gap-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button 
                            onClick={() => addItem({ ...product, quantity: 1 } as any)}
                            className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-soyuz flex items-center gap-2 transition-colors disabled:opacity-30"
                           >
                            <ShoppingBag size={14} /> QUICK ADD
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-32 text-center border border-dashed border-white/5">
                    <p className="text-[#444444] font-label text-xs">NO PRODUCTS FOUND MATCHING YOUR CRITERIA</p>
                    <button 
                      onClick={() => { setSearch(''); setSelectedCategory('ALL'); }}
                      className="mt-6 text-soyuz font-black uppercase tracking-widest text-[10px] hover:underline"
                    >
                      CLEAR ALL FILTERS
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
