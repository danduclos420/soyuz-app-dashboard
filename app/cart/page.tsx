'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag, 
  ChevronLeft,
  Truck,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';

export default function CartPage() {
  const { 
    items, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getDiscountAmount, 
    getTotal,
    repCode,
    setRepCode
  } = useCartStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [localRepCode, setLocalRepCode] = useState('');
  const [isValidatingCode, setIsValidatingCode] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    if (repCode) setLocalRepCode(repCode);
  }, [repCode]);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const tax = total - (subtotal - discountAmount);

  const handleApplyRepCode = async () => {
    if (!localRepCode) return;
    setIsValidatingCode(true);
    
    // Simulate API call for now - Phase 7 will implement real validation
    setTimeout(() => {
      if (localRepCode.toUpperCase() === 'DAN15') {
        setRepCode(localRepCode.toUpperCase(), 15);
      } else {
        alert('Invalid code. Try "DAN15" for testing.');
      }
      setIsValidatingCode(false);
    }, 1000);
  };

  if (!isHydrated) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-soyuz font-black italic uppercase tracking-widest text-xl">
      Loading Locker...
    </div>
  );

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12 border-b border-white/5 pb-12">
          <div>
            <Link href="/products" className="group flex items-center text-[#888888] hover:text-white transition-colors text-xs font-bold uppercase tracking-widest mb-4">
              <ChevronLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Catalog
            </Link>
            <h1 className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-2">Shopping Bag</h1>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
              Your <span className="outline-text-white">Gear</span> Selection
            </h2>
          </div>
          <div className="flex items-center gap-4 text-[#888888] text-[10px] font-bold uppercase tracking-widest">
            <span className="flex items-center gap-2"><Truck size={14} className="text-soyuz" /> Free Shipping</span>
            <span className="hidden sm:inline opacity-20">|</span>
            <span className="hidden sm:flex items-center gap-2"><ShieldCheck size={14} className="text-soyuz" /> Secure Checkout</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center bg-carbon-surface border border-white/5 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 carbon-texture opacity-5" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-8">
                <ShoppingBag size={40} className="text-white/20" />
              </div>
              <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">No gear selected yet</h3>
              <p className="text-[#888888] max-w-md mx-auto mb-10 text-sm leading-relaxed uppercase tracking-wide">
                Your selection is empty. Head back to the locker room and pick your professional grade hockey sticks.
              </p>
              <Link href="/products" className="btn-primary px-10 py-4 text-sm">
                GO SHOPPING <ArrowRight size={16} className="ml-3" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <motion.div 
                  layout
                  key={`${item.id}-${item.variantId}`}
                  className="bg-carbon-surface border border-white/5 rounded-3xl p-6 relative overflow-hidden group hover:border-white/10 transition-colors"
                >
                  <div className="absolute inset-0 carbon-texture opacity-5" />
                  <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center">
                    {/* Image */}
                    <div className="relative w-32 h-32 bg-[#0D0D0D] rounded-2xl flex-shrink-0 border border-white/5 p-4">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col sm:flex-row gap-6 justify-between w-full">
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-white uppercase tracking-tight italic group-hover:text-soyuz transition-colors">
                          {item.name}
                        </h3>
                        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-[#888888]">
                          {item.flex && <span className="bg-white/5 px-2 py-1 rounded">Flex: {item.flex}</span>}
                          {item.side && <span className="bg-white/5 px-2 py-1 rounded">Side: {item.side}</span>}
                          {item.sku && <span className="opacity-50">SKU: {item.sku}</span>}
                        </div>
                      </div>

                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between gap-4">
                        <p className="text-2xl font-black text-white italic">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        
                        <div className="flex items-center gap-3">
                          {/* Qty */}
                          <div className="flex items-center gap-1 bg-black rounded-xl border border-white/10 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, Math.max(1, item.quantity - 1))}
                              className="p-2 text-muted hover:text-white transition-colors"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-10 text-center text-sm font-black text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              className="p-2 text-muted hover:text-white transition-colors"
                            >
                              <Plus size={14} />
                            </button>
                          </div>

                          {/* Delete */}
                          <button
                            onClick={() => removeItem(item.id, item.variantId)}
                            className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl text-[#888888] hover:text-[#CC0000] hover:bg-[#CC0000]/10 transition-all"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Summary */}
            <div className="space-y-6">
              <div className="bg-carbon-surface border border-white/5 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 carbon-texture opacity-5" />
                <div className="relative z-10">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-8">Summary</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#888888]">
                      <span>Subtotal</span>
                      <span className="text-white font-black italic">${subtotal.toFixed(2)}</span>
                    </div>
                    
                    {discountAmount > 0 ? (
                      <div className="flex justify-between text-xs font-black uppercase tracking-widest text-soyuz">
                        <span>Rep Discount ({repCode})</span>
                        <span className="italic">-${discountAmount.toFixed(2)}</span>
                      </div>
                    ) : (
                      <div className="pt-4 pb-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#888888] mb-3">Add REP Code</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={localRepCode}
                            onChange={(e) => setLocalRepCode(e.target.value)}
                            placeholder="Enter code"
                            className="flex-1 bg-black border border-white/10 rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest placeholder:text-white/20 focus:outline-none focus:border-soyuz transition-colors"
                          />
                          <Button 
                            onClick={handleApplyRepCode}
                            disabled={isValidatingCode || !localRepCode}
                            size="sm" 
                            variant="outline" 
                            className="border-soyuz text-soyuz text-[10px]"
                          >
                            {isValidatingCode ? 'Applying...' : 'Apply'}
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-[#888888]">
                      <span>Taxes (TPS + TVQ)</span>
                      <span className="text-white font-black italic">${tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mb-8">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest">Total CAD</p>
                        <p className="text-4xl font-black text-white italic leading-none mt-1">
                          ${total.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-[10px] font-black text-soyuz uppercase tracking-widest flex items-center gap-1">
                        <Zap size={10} /> Fast Ship
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout" className="btn-primary w-full py-5 text-base shadow-lg shadow-[#CC0000]/10">
                    SECURE CHECKOUT <ArrowRight size={18} className="ml-3" />
                  </Link>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <ShieldCheck size={24} className="text-soyuz mx-auto mb-2 opacity-50" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#888888]">Secure Data</p>
                </div>
                <div className="bg-white/5 rounded-2xl p-4 text-center">
                  <Truck size={24} className="text-soyuz mx-auto mb-2 opacity-50" />
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#888888]">Priority Ship</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
