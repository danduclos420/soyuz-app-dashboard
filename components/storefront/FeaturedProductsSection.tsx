'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import Image from 'next/image';

const featuredProducts = [
  {
    id: 1,
    name: 'SOYUZ PRO V1',
    category: 'PRO SERIES',
    price: '299,00 $',
    image: 'https://images.unsplash.com/photo-1547053501-bc8497672af6?q=80&w=800&auto=format&fit=crop',
    tag: 'Elite Performance'
  },
  {
    id: 2,
    name: 'SOYUZ ELITE CARBON',
    category: 'ELITE SERIES',
    price: '249,00 $',
    image: 'https://images.unsplash.com/photo-1580748141549-716500ca23ae?q=80&w=800&auto=format&fit=crop',
    tag: 'Best Seller'
  },
  {
    id: 3,
    name: 'SOYUZ CORE LIGHT',
    category: 'CORE SERIES',
    price: '199,00 $',
    image: 'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=800&auto=format&fit=crop',
    tag: 'Rising Talent'
  },
  {
    id: 4,
    name: 'SOYUZ GOALIE ELITE',
    category: 'GOALIE',
    price: '349,00 $',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=800&auto=format&fit=crop',
    tag: 'New'
  }
];

export default function FeaturedProductsSection() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div>
            <h2 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4">Elite Gear</h2>
            <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white italic leading-none">
              Produits <span className="outline-text-cyan">Vedettes</span>
            </h3>
          </div>
          <Button variant="outline" className="border-soyuz text-soyuz hover:bg-soyuz hover:text-black" asChild>
            <a href="/products">Tout Voir</a>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-carbon-surface mb-6 overflow-hidden border border-white/5 rounded-2xl group-hover:border-soyuz/50 transition-all duration-500 shadow-2xl">
                {/* Product Image */}
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover grayscale brightness-75 transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0 group-hover:brightness-100"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4">
                  <Badge variant="accent" className="bg-soyuz text-black font-black border-none">{product.tag}</Badge>
                </div>

                {/* Quick Add Overlay */}
                <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Button variant="primary" fullWidth size="sm">
                    Rapide Ajouter
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs text-muted font-bold uppercase tracking-widest">{product.category}</p>
                <h4 className="text-lg font-bold text-white uppercase group-hover:text-soyuz transition-colors">
                  {product.name}
                </h4>
                <p className="text-white font-black tracking-widest">{product.price}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button variant="outline" asChild>
            <a href="/products">Tout Voir</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
