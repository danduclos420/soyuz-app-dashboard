'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDevStore } from '@/lib/store/dev';
import CardFront from '@/components/affiliate/hockey-card/CardFront';
import CardBack from '@/components/affiliate/hockey-card/CardBack';
import AboutSection from '@/components/storefront/AboutSection';
import B2BSection from '@/components/storefront/B2BSection';
import CollectionsSection from '@/components/storefront/CollectionsSection';
import ProductCard from '@/components/storefront/ProductCard';
import Footer from '@/components/layout/Footer';
import FeaturedProductsSection from '@/components/storefront/FeaturedProductsSection';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Smartphone, Monitor, Info, Zap } from 'lucide-react';

const WORKSHOP_COMPONENTS = [
  { id: 'card-recto', label: 'Card Recto', icon: '🎨' },
  { id: 'card-verso', label: 'Card Verso', icon: '📊' },
  { id: 'about-section', label: 'About', icon: '📖' },
  { id: 'b2b-section', label: 'B2B', icon: '🤝' },
  { id: 'collections', label: 'Collections', icon: '📦' },
  { id: 'product-card', label: 'Product', icon: '🏑' },
  { id: 'hero', label: 'Hero', icon: '⚡' },
  { id: 'footer', label: 'Footer', icon: '⚓' }
];

export default function IsolatedWorkshopPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  const { setDevMode, toggleWixMode, isWixModeActive, isDevMode } = useDevStore();
  const [viewport, setViewport] = useState<'desktop' | 'mobile'>('desktop');

  useEffect(() => {
    if (!isDevMode) {
      router.push('/login');
      return;
    }
    // Auto-enable dev and wix mode for workshop
    setDevMode(true);
    if (!isWixModeActive) toggleWixMode();
  }, [isDevMode, router]);

  if (!isDevMode) return null;

  const renderComponent = () => {
    switch (id) {
      case 'card-recto':
        return (
          <div className="w-[400px] aspect-[2.5/3.5] scale-125 transition-all duration-700">
            <CardFront 
              firstName="SOYUZ"
              lastName="PLAYER"
              rankLabel="MVP"
              role="pro"
              lotNumber={123}
              studioMode={true}
              photoX={0}
              photoY={0}
              zoom={1}
              editMode={false}
              avatarUrl=""
            />
          </div>
        );
      case 'card-verso':
        return (
          <div className="w-[400px] aspect-[2.5/3.5] scale-125 transition-all duration-700">
            <CardBack 
              user={{
                full_name: 'SOYUZ PLAYER',
                avatar_url: '',
                affiliate_code: 'SOYUZ-PRO',
                created_at: new Date().toISOString()
              }}
              stats={{
                total_sales: 150000,
                active_affiliates: 100,
                points: 150
              }}
            />
          </div>
        );
      case 'about-section':
        return <div className="w-full h-full overflow-y-auto overflow-x-hidden"><AboutSection /></div>;
      case 'b2b-section':
        return <div className="w-full h-full flex items-center justify-center p-20"><B2BSection /></div>;
      case 'collections':
        return <div className="w-full h-full overflow-y-auto p-20"><CollectionsSection /></div>;
      case 'product-card':
        return (
          <div className="w-80">
            <ProductCard 
              id="1"
              name="HIT ULTRA PRO"
              price={349}
              image="/SOYUZ-ASSETS/STC-HIT_ULTRA/Side_View.png"
              category="PRO SERIES"
            />
          </div>
        );
      case 'hero':
        return (
          <div className="w-full h-full flex flex-col items-center justify-center space-y-8 p-12 text-center transition-all duration-700">
             <h1 className="text-8xl font-black italic uppercase tracking-tighter">THE SOYUZ ELITE</h1>
             <p className="text-white/40 text-xl max-w-xl underline underline-offset-8">Custom Engineered for Maximum Power Transfer</p>
             <button className="bg-soyuz px-10 py-5 text-black font-black uppercase tracking-widest rounded-full">Explore Sticks</button>
          </div>
        );
      case 'footer':
        return <div className="w-full h-full overflow-y-auto"><Footer /></div>;
      default:
        return (
          <div className="text-center space-y-4">
            <p className="text-4xl text-white/20 font-black italic uppercase">Component "{id}" in development...</p>
            <button onClick={() => router.push('/workshop')} className="text-soyuz underline underline-offset-4 font-black italic">Return to Lab</button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col overflow-hidden font-sans select-none">
      {/* Workshop Header BAR */}
      <div className="h-20 bg-black/80 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-10 z-[200]">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/workshop')}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:bg-soyuz hover:text-black transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 className="text-[10px] font-black italic tracking-[0.4em] text-white/20 uppercase">Workshop / Isolation</h2>
            <h1 className="text-xs font-black italic text-soyuz uppercase tracking-widest">{id?.toString().toUpperCase()} MODULE</h1>
          </div>
        </div>

        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          <button 
            onClick={() => setViewport('desktop')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewport === 'desktop' ? 'bg-white/10 text-white shadow-lg' : 'text-white/20 hover:text-white'}`}
          >
            <Monitor size={14} />
            Desktop
          </button>
          <button 
            onClick={() => setViewport('mobile')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewport === 'mobile' ? 'bg-white/10 text-white shadow-lg' : 'text-white/20 hover:text-white'}`}
          >
            <Smartphone size={14} />
            Mobile
          </button>
        </div>

        <div className="flex items-center gap-4">
           <div className="px-5 py-2.5 bg-soyuz/5 border border-soyuz/20 rounded-full flex items-center gap-2">
             <Zap size={14} className="text-soyuz animate-pulse" />
             <span className="text-[10px] text-soyuz font-black uppercase tracking-widest">WIX MODE ACTIVE</span>
           </div>
        </div>
      </div>

      {/* Main Sandbox */}
      <div className="flex-1 flex items-center justify-center p-20 relative overflow-hidden">
        <div className="absolute inset-0 carbon-texture opacity-5" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(204,0,0,0.05),transparent_70%)]" />

        <motion.div 
          animate={{ width: viewport === 'mobile' ? 375 : '100%', height: viewport === 'mobile' ? 812 : '100%' }}
          className={`relative bg-neutral-900/20 backdrop-blur-3xl shadow-[0_0_100px_rgba(0,0,0,0.5)] flex items-center justify-center overflow-hidden transition-all duration-700 border border-white/5 ${viewport === 'mobile' ? 'rounded-[3rem] border-white/20' : 'rounded-none border-transparent'}`}
        >
          {renderComponent()}

          {/* Guidelines info */}
          <div className="absolute bottom-10 left-10 flex items-center gap-3 text-white/10">
            <Info size={14} />
            <p className="text-[8px] font-mono tracking-widest uppercase">Safe Zone: Full Isolation Enabled</p>
          </div>
        </motion.div>
      </div>

      {/* Component Switcher Menu (Requested by Dan) */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/80 backdrop-blur-2xl p-1.5 rounded-full border border-white/5 shadow-2xl z-[200]">
         {WORKSHOP_COMPONENTS.map(comp => (
           <button
             key={comp.id}
             onClick={() => router.push(`/workshop/${comp.id}`)}
             className={`flex items-center gap-3 px-6 py-3 rounded-full text-[10px] font-black italic uppercase tracking-widest transition-all duration-300 ${id === comp.id ? 'bg-soyuz text-black shadow-[0_0_30px_rgba(255,215,0,0.3)]' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
           >
             <span className="text-sm">{comp.icon}</span>
             <span className="hidden sm:inline">{comp.label}</span>
           </button>
         ))}
      </div>

      <style jsx global>{`
        body { background: #000 !important; cursor: default !important; }
        .carbon-texture {
          background-image: linear-gradient(45deg, #111 25%, transparent 25%), linear-gradient(-45deg, #111 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #111 75%), linear-gradient(-45deg, transparent 75%, #111 75%);
          background-size: 4px 4px;
        }
      `}</style>
    </div>
  );
}
