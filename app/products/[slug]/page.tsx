'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { 
  ChevronRight, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Info,
  Maximize2,
  Activity,
  Zap,
  Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { dummyProducts } from '@/lib/mock-products';
import AnimatedKickPoint from '@/components/tech-guide/AnimatedKickPoint';
import CurveProfile from '@/components/tech-guide/CurveProfile';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  // Find product or default to first dummy
  const product = useMemo(() => {
    return dummyProducts.find(p => p.slug === slug) || dummyProducts[0];
  }, [slug]);

  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [selectedHand, setSelectedHand] = useState('Gauche');
  const [selectedFlex, setSelectedFlex] = useState(product.tech.flex[0]);
  const [selectedCurve, setSelectedCurve] = useState(product.tech.curves[0]);

  return (
    <div className="bg-black min-h-screen pt-24 pb-24 overflow-x-hidden">
      {/* Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-soyuz/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-soyuz/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[9px] text-muted font-black uppercase tracking-[0.3em] mb-12">
          <Link href="/" className="hover:text-soyuz transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link href="/products" className="hover:text-soyuz transition-colors">Elite Gear</Link>
          <ChevronRight size={10} />
          <span className="text-white opacity-50">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-32">
          {/* 1. Technical Showcase (Gallery) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative group">
              <motion.div 
                key={selectedMainImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="aspect-[4/5] bg-carbon-surface rounded-[40px] overflow-hidden border border-white/5 relative shadow-2xl"
              >
                <img 
                  src={product.images[selectedMainImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                />
                
                {/* Image Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="absolute top-8 left-8 flex flex-col gap-3">
                  <Badge variant="accent" className="bg-soyuz text-black font-black uppercase tracking-widest text-[10px] py-1.5 px-4 shadow-[0_0_20px_rgba(0,229,255,0.4)]">
                    {product.tag}
                  </Badge>
                </div>

                <button className="absolute bottom-8 right-8 p-4 bg-white/10 backdrop-blur-md rounded-full text-white border border-white/10 hover:bg-soyuz hover:text-black transition-all group-hover:translate-y-0 translate-y-4 opacity-0 group-hover:opacity-100 duration-500">
                  <Maximize2 size={20} />
                </button>
              </motion.div>
            </div>
            
            <div className="flex gap-4 sm:gap-6 justify-center">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedMainImage(idx)}
                  className={`relative w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all duration-500 group ${selectedMainImage === idx ? 'border-soyuz scale-105 shadow-[0_0_15px_rgba(0,229,255,0.2)]' : 'border-white/5 opacity-50 hover:opacity-100 hover:border-white/20'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* 2. Configuration Engine */}
          <div className="lg:col-span-5 space-y-12">
            <div>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-6 flex items-center gap-2"
              >
                <span className="w-8 h-[1px] bg-soyuz" /> {product.category}
              </motion.p>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6 italic leading-[0.85] outline-text-cyan">
                {product.name.split(' ').slice(0, -1).join(' ')} <br />
                <span className="text-white not-italic">{product.name.split(' ').pop()}</span>
              </h1>
              <div className="flex items-center gap-6">
                <p className="text-3xl font-black text-white tracking-widest">{product.price}</p>
                <div className="h-4 w-[1px] bg-white/10" />
                <p className="text-[10px] text-muted font-bold uppercase tracking-widest">In Stock & Ready to Ship</p>
              </div>
            </div>

            <p className="text-muted text-sm leading-loose max-w-md font-medium">
              {product.description}
            </p>

            {/* Technical Selectors (Pure & Modern) */}
            <div className="space-y-10">
              {/* Hand Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] italic">Access Hand</h4>
                  <span className="text-soyuz text-[10px] font-black uppercase tracking-widest">{selectedHand}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {['Gauche', 'Droite'].map((h) => (
                    <button 
                      key={h}
                      onClick={() => setSelectedHand(h)}
                      className={`relative py-4 group transition-all duration-500 overflow-hidden rounded-xl border ${selectedHand === h ? 'border-soyuz bg-soyuz/5' : 'border-white/5 hover:border-white/20 bg-white/2'}`}
                    >
                      <span className={`relative z-10 text-[10px] font-black uppercase tracking-[0.2em] ${selectedHand === h ? 'text-soyuz' : 'text-muted group-hover:text-white'}`}>
                        {h}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flex Visual Selector */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] italic">Flex Magnitude</h4>
                  <span className="text-soyuz text-[10px] font-black uppercase tracking-widest">{selectedFlex} Flex</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {product.tech.flex.map((f) => (
                    <button 
                      key={f}
                      onClick={() => setSelectedFlex(f)}
                      className={`py-4 rounded-xl border font-black text-[11px] transition-all duration-300 ${selectedFlex === f ? 'bg-white text-black border-white shadow-xl scale-105' : 'border-white/5 text-muted hover:border-white/30'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curve Interactive Profiles */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-white font-black uppercase tracking-widest text-[10px] italic">Blade Geometry</h4>
                  <span className="text-soyuz text-[10px] font-black uppercase tracking-widest">{selectedCurve} Profile</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {product.tech.curves.map((c) => (
                    <div key={c} onClick={() => setSelectedCurve(c)} className="cursor-pointer">
                      <CurveProfile curveId={c} active={selectedCurve === c} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-10 flex gap-4">
              <Button variant="primary" size="lg" className="flex-1 rounded-none py-8 text-black font-black uppercase tracking-[0.3em] shadow-[0_0_30px_rgba(0,229,255,0.2)]">
                Acquire Now
              </Button>
              <button className="px-8 border border-white/5 bg-white/2 rounded-none text-white hover:text-soyuz hover:border-soyuz transition-all group">
                <Heart size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. High-End Technical Guide Section */}
        <section className="mt-48">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 border-b border-white/5 pb-10">
            <div>
              <h3 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4">Engineering Data</h3>
              <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic leading-none">
                Technical <span className="outline-text-cyan">Specifications</span>
              </h2>
            </div>
            <p className="text-muted text-[10px] uppercase font-bold tracking-widest max-w-xs text-right opacity-40">
              Advanced performance metrics and laboratory tested geometry for professional play.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Kick Point Visualizer */}
            <div className="bg-carbon-surface border border-white/5 rounded-[40px] p-12 relative overflow-hidden group">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-12">
                  <AnimatedKickPoint type={product.tech.kickPoint} active={true} />
                </div>
                <div className="text-center">
                  <h4 className="text-white font-black uppercase tracking-widest text-xs mb-4 italic flex items-center justify-center gap-2">
                    <Activity size={16} className="text-soyuz" /> Kick Point System
                  </h4>
                  <p className="text-muted text-[11px] uppercase tracking-widest leading-relaxed max-w-[200px] mx-auto opacity-70">
                    Proprietary {product.tech.kickPoint}-kick geometry engineered for {product.tech.kickPoint === 'low' ? 'explosive release' : 'maximum loading power'}.
                  </p>
                </div>
              </div>
            </div>

            {/* Specs Grid */}
            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { label: 'Shaft Geometry', value: 'Square Double-Concave', icon: <Maximize2 size={24} /> },
                { label: 'Carbon Weave', value: product.tech.construction, icon: <Layers size={24} /> },
                { label: 'Mass Weight', value: product.tech.weight, icon: <Zap size={24} /> },
                { label: 'Blade Core', value: 'High-Density Aero Foam', icon: <Info size={24} /> },
              ].map((spec, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-carbon-surface border border-white/5 p-10 rounded-[40px] flex items-start gap-8 group hover:border-soyuz/20 transition-all shadow-xl"
                >
                  <div className="p-4 bg-black rounded-2xl border border-white/5 text-soyuz transition-transform group-hover:scale-110">
                    {spec.icon}
                  </div>
                  <div>
                    <h5 className="text-muted text-[10px] uppercase tracking-[0.3em] font-black mb-2">{spec.label}</h5>
                    <p className="text-white font-black uppercase tracking-tight italic text-lg">{spec.value}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Comparison Section (Modern Grid) */}
        <section className="mt-48 pb-24">
          <div className="text-center mb-24">
             <h3 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4">Elite Comparison</h3>
             <h4 className="text-4xl font-black uppercase tracking-tighter text-white italic">Alternative <span className="outline-text-cyan">Arsenal</span></h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dummyProducts.filter(p => p.id !== product.id).map((alt) => (
              <Link href={`/products/${alt.slug}`} key={alt.id} className="group">
                <div className="bg-carbon-surface border border-white/5 p-8 rounded-[40px] transition-all duration-500 hover:border-soyuz/40 hover:shadow-2xl hover:shadow-soyuz/10">
                  <div className="aspect-square rounded-3xl overflow-hidden mb-8 bg-black">
                    <img src={alt.images[0]} alt={alt.name} className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110" />
                  </div>
                  <p className="text-soyuz font-black uppercase tracking-widest text-[9px] mb-2">{alt.category}</p>
                  <h5 className="text-xl font-black uppercase tracking-tighter text-white italic mb-4">{alt.name}</h5>
                  <div className="flex justify-between items-center">
                    <p className="text-white font-mono text-sm">{alt.price}</p>
                    <ArrowRight size={16} className="text-soyuz transform -rotate-45 group-hover:rotate-0 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size: number, className: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
