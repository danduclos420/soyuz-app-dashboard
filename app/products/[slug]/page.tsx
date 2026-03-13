'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase-client';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Maximize2,
  Activity,
  Zap,
  Layers,
  ShoppingBag,
  ArrowRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/lib/store/cart';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';
import AnimatedKickPoint from '@/components/tech-guide/AnimatedKickPoint';
import CurveProfile from '@/components/tech-guide/CurveProfile';

// TYPES
interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  stock_qty: number;
  description: string;
  tech?: {
    flex: number[];
    curves: string[];
    kickPoint: 'low' | 'mid' | 'high';
    weight: string;
    construction: string;
  };
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [selectedHand, setSelectedHand] = useState('LEFT');
  const [selectedFlex, setSelectedFlex] = useState<number | null>(null);
  const [selectedCurve, setSelectedCurve] = useState<string | null>(null);

  const { addItem, toggleCart } = useCartStore();

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (data) {
        setProduct(data);
        // Set defaults if tech data exists
        if (data.tech) {
          if (data.tech.flex?.length > 0) setSelectedFlex(data.tech.flex[0]);
          if (data.tech.curves?.length > 0) setSelectedCurve(data.tech.curves[0]);
        }
      } else {
        // Fallback or 404
        console.error("Product not found", error);
      }
      setLoading(false);
    }
    if (slug) fetchProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
      variantId: `${selectedHand}-${selectedFlex}-${selectedCurve}`,
      flex: selectedFlex?.toString() || 'Standard',
      side: selectedHand.toLowerCase() as 'left' | 'right',
      sku: (product as any).sku || `SOYUZ-${product.id}`,
    });
    
    toast.success(`${product.name} ADDED TO LOCKER`, {
      style: {
        background: '#111111',
        color: '#fff',
        border: '1px solid rgba(255,0,0,0.1)',
        fontSize: '10px',
        fontWeight: '900',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
      },
    });
    
    toggleCart(true);
  };

  if (loading) {
    return (
      <div className="bg-black min-h-screen pt-40 flex flex-col items-center justify-center space-y-8">
        <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin" />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">INITIALIZING ASSET...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-black min-h-screen pt-40 flex flex-col items-center justify-center space-y-8">
        <p className="text-white font-display italic text-4xl">404: ASSET NOT FOUND</p>
        <Link href="/products" className="btn-primary py-3 px-8 text-xs font-black uppercase tracking-widest">
          RETURN TO CATALOG
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-32 overflow-hidden selection:bg-soyuz selection:text-white">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* BREADCRUMBS */}
        <nav className="flex items-center gap-3 text-[9px] text-[#444444] font-black uppercase tracking-[0.3em] mb-16">
          <Link href="/" className="hover:text-white transition-colors">HOME</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-white transition-colors">ELITE GEAR</Link>
          <ChevronRight size={10} />
          <span className="text-soyuz">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 xl:gap-32">
          {/* GALLERY */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              key={selectedMainImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="aspect-[4/5] bg-[#0A0A0A] border border-white/5 relative group overflow-hidden"
            >
              <Image 
                src={product.images[selectedMainImage]} 
                alt={product.name}
                fill
                className="object-contain p-12 transition-transform duration-[2s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button className="absolute bottom-8 right-8 p-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-soyuz hover:text-black transition-all">
                <Maximize2 size={20} />
              </button>
            </motion.div>
            
            <div className="flex gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedMainImage(idx)}
                  className={`relative w-24 h-24 border transition-all duration-300 ${selectedMainImage === idx ? 'border-soyuz scale-105' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <Image src={img} alt="Thumb" fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* CONFIGURATION */}
          <div className="lg:col-span-5 space-y-16">
            <div>
              <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-6 uppercase tracking-[0.2em] rounded-full">
                {product.category} SERIES
              </span>
              <h1 className="text-5xl md:text-7xl font-display italic tracking-tighter leading-[0.85] mb-8 uppercase">
                {product.name.split(' ').slice(0, -1).join(' ')} <br />
                <span className="outline-text-white">{product.name.split(' ').pop()}</span>
              </h1>
              <div className="flex items-center gap-8">
                <p className="text-4xl font-display text-white italic">${product.price}</p>
                <div className="h-6 w-[1px] bg-white/10" />
                <p className="text-[10px] text-soyuz font-black uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} /> READY FOR DEPLOYMENT
                </p>
              </div>
            </div>

            <p className="text-[#888888] text-xs leading-relaxed uppercase font-bold tracking-widest max-w-md">
              {product.description}
            </p>

            {/* SELECTORS */}
            <div className="space-y-12">
              {/* Hand */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-[#444444]">HAND ORIENTATION</span>
                  <span className="text-soyuz">{selectedHand}</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {['LEFT', 'RIGHT'].map((h) => (
                    <button 
                      key={h}
                      onClick={() => setSelectedHand(h)}
                      className={`py-4 border text-[10px] font-black tracking-[0.2em] transition-all ${selectedHand === h ? 'bg-white text-black border-white' : 'border-white/5 text-[#555555] hover:border-white/20'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flex */}
              {product.tech?.flex && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#444444]">FLEX MAGNITUDE</span>
                    <span className="text-soyuz">{selectedFlex} FLEX</span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {product.tech.flex.map((f) => (
                      <button 
                        key={f}
                        onClick={() => setSelectedFlex(f)}
                        className={`py-4 border text-[11px] font-black transition-all ${selectedFlex === f ? 'bg-soyuz text-white border-soyuz' : 'border-white/5 text-[#555555] hover:border-white/20'}`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Curve */}
              {product.tech?.curves && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                    <span className="text-[#444444]">BLADE GEOMETRY</span>
                    <span className="text-soyuz">{selectedCurve} PROFILE</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {product.tech.curves.map((c) => (
                      <div key={c} onClick={() => setSelectedCurve(c)} className="cursor-pointer">
                        <CurveProfile curveId={c} active={selectedCurve === c} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ACTION */}
            <div className="pt-12 flex gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={product.stock_qty <= 0}
                className="flex-1 bg-soyuz text-white py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  ACQUIRE ASSET <ShoppingBag size={18} />
                </span>
                <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              </button>
              <button className="px-8 border border-white/5 hover:border-soyuz hover:text-soyuz transition-all">
                <Heart size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* TECHNICAL SPECS */}
        {product.tech && (
          <section className="mt-60">
            <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-24 border-b border-white/5 pb-10">
              <div className="max-w-xl">
                <span className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">ENGINEERING DATA</span>
                <h2 className="text-5xl md:text-8xl font-display italic tracking-tighter text-white leading-none uppercase">
                  TECHNICAL <br /><span className="outline-text-white">SPECS</span>
                </h2>
              </div>
              <p className="text-[#444444] text-[10px] uppercase font-bold tracking-[0.2em] max-w-xs text-right leading-relaxed mb-4">
                Laboratory tested parameters for professional-grade reliability in high-intensity environments.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* KICK POINT VISUALIZER */}
              <div className="bg-[#0A0A0A] border border-white/5 p-16 flex flex-col items-center text-center group">
                <div className="mb-16">
                  <AnimatedKickPoint type={product.tech.kickPoint} active={true} />
                </div>
                <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4 flex items-center gap-3 italic">
                  <Activity size={18} className="text-soyuz" /> KICK POINT SYSTEM
                </h4>
                <p className="text-[#555555] text-[10px] uppercase tracking-widest leading-loose max-w-[220px]">
                   Optimized {product.tech.kickPoint}-kick geometry for {product.tech.kickPoint === 'low' ? 'maximum speed' : 'unrivaled power'}.
                </p>
              </div>

              {/* SPECS LIST */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { label: 'GEOMETRY', value: 'DOUBLE-CONCAVE', icon: <Maximize2 size={24} /> },
                  { label: 'CONSTRUCTION', value: product.tech.construction, icon: <Layers size={24} /> },
                  { label: 'MASS WEIGHT', value: product.tech.weight, icon: <Zap size={24} /> },
                  { label: 'STATUS', value: 'ELITE STANDARD', icon: <ShieldCheck size={24} /> },
                ].map((spec, i) => (
                  <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 flex items-start gap-8 hover:border-soyuz/30 transition-all group">
                    <div className="p-4 bg-black border border-white/5 text-soyuz transition-transform group-hover:scale-110">
                      {spec.icon}
                    </div>
                    <div>
                      <h5 className="text-[#444444] text-[9px] uppercase tracking-[0.3em] font-black mb-3">{spec.label}</h5>
                      <p className="text-white font-black uppercase tracking-tight italic text-xl group-hover:text-soyuz transition-colors">{spec.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
