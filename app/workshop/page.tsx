'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useDevStore } from '@/lib/store/dev';
import { Layout, Palette, Zap, Box, Component, ArrowRight } from 'lucide-react';

const WORKSHOP_COMPONENTS = [
  { 
    id: 'card-recto', 
    name: 'CARD RECTO', 
    description: 'Premium front design (Recto). Optimize typography and holographic alignment.',
    icon: '🎨',
    preview: 'bg-soyuz/20'
  },
  { 
    id: 'card-verso', 
    name: 'CARD VERSO', 
    description: 'Technical stats view (Verso). Perfect the layout for player performance data.',
    icon: '📊',
    preview: 'bg-neutral-800'
  },
  { 
    id: 'about-section', 
    name: 'ABOUT SOYUZ', 
    description: 'Engineered for Power section. Edit the technical story and graphics.',
    icon: '📖',
    preview: 'bg-blue-500/10'
  },
  { 
    id: 'b2b-section', 
    name: 'B2B BANNER', 
    description: 'Join the team section. Refine the call to action for professional partners.',
    icon: '🤝',
    preview: 'bg-soyuz/30'
  },
  { 
    id: 'collections', 
    name: 'COLLECTIONS GRID', 
    description: 'Series navigation (Hit Ultra, Pro Series). Test grid spacing and hover states.',
    icon: '📦',
    preview: 'bg-neutral-700'
  },
  { 
    id: 'product-card', 
    name: 'PRODUCT CARD', 
    description: 'Stick preview design. Customize the price tag and detail hierarchy.',
    icon: '🏑',
    preview: 'bg-white/5'
  },
  { 
    id: 'hero', 
    name: 'HOMEPAGE HERO', 
    description: 'Hero section with technical graphics. Customize text alignment and animations.',
    icon: '⚡',
    preview: 'bg-blue-500/10'
  },
  { 
    id: 'footer', 
    name: 'SITE FOOTER', 
    description: 'Complete brand footer. Manage links, socials, and contact layout.',
    icon: '⚓',
    preview: 'bg-neutral-900'
  }
];

export default function WorkshopDashboard() {
  const router = useRouter();
  const { isDevMode } = useDevStore();

  useEffect(() => {
    if (!isDevMode) {
      router.push('/login');
    }
  }, [isDevMode, router]);

  if (!isDevMode) return null;

  return (
    <div className="min-h-screen bg-black text-white p-12 lg:p-24 selection:bg-soyuz selection:text-black">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-soyuz/20 flex items-center justify-center text-soyuz">
              <Component size={24} />
            </div>
            <h4 className="text-[10px] font-black italic uppercase tracking-[0.4em] text-white/30">Soyuz Laboratory</h4>
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter mb-8 group">
            COMPONENT <br />
            <span className="text-soyuz group-hover:text-white transition-colors duration-700">WORKSHOP</span>
          </h1>
          <p className="max-w-2xl text-white/40 font-medium text-lg leading-relaxed">
            Édite chaque composant en isolation totale. <br />
            Zéro risque de casser la version mobile pendant que tu crées ton design parfait.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {WORKSHOP_COMPONENTS.map((comp) => (
            <motion.button
              key={comp.id}
              whileHover={{ y: -10, scale: 1.02 }}
              onClick={() => router.push(`/workshop/${comp.id}`)}
              className="group relative bg-neutral-900/40 border border-white/5 rounded-[2.5rem] p-10 text-left overflow-hidden transition-all hover:bg-neutral-900/60 hover:border-soyuz/30 shadow-2xl"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${comp.preview} blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-12">
                  <span className="text-5xl">{comp.icon}</span>
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-soyuz group-hover:text-black transition-all duration-500">
                    <ArrowRight size={18} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black italic uppercase tracking-wider mb-4 group-hover:text-soyuz transition-colors">
                  {comp.name}
                </h3>
                <p className="text-sm text-white/30 font-medium leading-relaxed mb-8">
                  {comp.description}
                </p>
                
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-soyuz animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-soyuz/60">Ready for editing</span>
                </div>
              </div>
            </motion.button>
          ))}

          {/* New Component Placeholder */}
          <div className="border-2 border-dashed border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-white/20 transition-all">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-6 group-hover:scale-110 transition-transform">
              <Box size={32} />
            </div>
            <h3 className="text-sm font-black italic uppercase tracking-widest text-white/20">Add Component</h3>
            <p className="text-[10px] font-mono text-white/10 mt-2 uppercase">Request a new module from Antigravity</p>
          </div>
        </div>
      </div>

      <style jsx global>{`
        body {
          background-color: #000 !important;
        }
      `}</style>
    </div>
  );
}
