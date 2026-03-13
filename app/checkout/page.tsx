'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  CreditCard, 
  Truck, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const { 
    items, 
    getSubtotal, 
    getDiscountAmount, 
    getTotal, 
    affiliateCode, 
    isCartOpen,
    toggleCart 
  } = useCartStore();

  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Close cart drawer if open
    if (isCartOpen) toggleCart(false);
  }, [isCartOpen, toggleCart]);

  // Redirect to products if cart is empty
  useEffect(() => {
    if (isHydrated && items.length === 0) {
      router.push('/products');
    }
  }, [isHydrated, items.length, router]);

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const tax = (subtotal - discountAmount) * 0.15;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          affiliateCode: affiliateCode,
          customerEmail: '', // Optional for now
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Unable to reach payment gateway. Please try again.');
      setIsProcessing(false);
    }
  };

  if (!isHydrated || items.length === 0) return null;

  return (
    <div className="bg-[#0D0D0D] min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-white/5 pb-8">
          <Link 
            href="/cart" 
            className="group flex items-center text-[#888888] hover:text-white transition-colors text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <ChevronLeft size={14} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Bag
          </Link>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white italic">
                Finalize <span className="outline-text-white">Order</span>
              </h1>
              <p className="text-muted text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
                <Lock size={12} className="text-soyuz" /> Secure Encryption Active
              </p>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-end">
                <p className="text-[10px] text-[#888888] font-black uppercase tracking-widest">Grand Total</p>
                <p className="text-3xl font-black text-white italic">${total.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Steps / Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-carbon-surface border border-soyuz/20 rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">01. Review</h3>
                <p className="text-[#888888] text-[10px] uppercase font-bold tracking-wider leading-relaxed">Confirm your stick configuration and quantities.</p>
              </div>
              <div className="bg-carbon-surface border border-white/5 rounded-2xl p-6 opacity-40">
                <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">02. Shipping</h3>
                <p className="text-[#888888] text-[10px] uppercase font-bold tracking-wider leading-relaxed">Handled securely on the Stripe payment page.</p>
              </div>
              <div className="bg-carbon-surface border border-white/5 rounded-2xl p-6 opacity-40">
                <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-2">03. Payment</h3>
                <p className="text-[#888888] text-[10px] uppercase font-bold tracking-wider leading-relaxed">Fast, encrypted and multi-method support.</p>
              </div>
            </div>

            {/* Order Items Review */}
            <div className="bg-carbon-surface border border-white/5 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5" />
              <div className="relative z-10">
                <h3 className="text-xl font-black text-white uppercase italic tracking-tight mb-8">Order Review</h3>
                <div className="divide-y divide-white/5">
                  {items.map((item) => (
                    <div key={`${item.id}-${item.variantId}`} className="py-6 flex gap-6 items-center">
                      <div className="w-16 h-16 bg-[#0D0D0D] border border-white/10 rounded-xl p-2 flex-shrink-0">
                        <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-black text-white uppercase tracking-tight">{item.name}</h4>
                        <p className="text-[10px] text-[#888888] font-bold uppercase tracking-widest mt-1">
                          {item.flex} Flex | {item.side === 'left' ? 'Gauche' : 'Droite'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-white italic">x{item.quantity}</p>
                        <p className="text-sm font-black text-white italic mt-1">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Policy Info */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5 flex items-start gap-4">
                <div className="p-3 bg-black rounded-xl text-soyuz">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Elite Shipping</h4>
                  <p className="text-[10px] text-[#888888] uppercase font-bold leading-relaxed">Global tracking provided. Insured delivery on all pro-grade hardware.</p>
                </div>
              </div>
              <div className="flex-1 bg-white/5 rounded-2xl p-6 border border-white/5 flex items-start gap-4">
                <div className="p-3 bg-black rounded-xl text-soyuz">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">SOYUZ Warranty</h4>
                  <p className="text-[10px] text-[#888888] uppercase font-bold leading-relaxed">30-day performance guarantee on sticks under normal play conditions.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar / Totals */}
          <div className="lg:col-span-4">
            <div className="bg-carbon-surface border border-white/5 rounded-3xl p-8 sticky top-32 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-soyuz to-transparent opacity-50" />
              <div className="absolute inset-0 carbon-texture opacity-5" />
              
              <div className="relative z-10">
                <h3 className="text-2xl font-black text-white uppercase italic tracking-tight mb-8">Totals</h3>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#888888]">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-soyuz">
                      <span>Rep ({affiliateCode})</span>
                      <span className="italic">-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#888888]">
                    <span>Taxes (Quebec)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-black uppercase tracking-widest text-[#888888]">
                    <span>Shipping</span>
                    <span className="text-soyuz italic">Included</span>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10 mb-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] text-[#888888] font-black uppercase tracking-[0.3em]">Payable Amount</p>
                      <p className="text-5xl font-black text-white italic leading-none mt-2">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="btn-primary w-full py-6 text-base"
                >
                  {isProcessing ? 'Redirecting...' : 'Proceed to Payment'} 
                  {!isProcessing && <CreditCard size={18} className="ml-3" />}
                </Button>
                
                <p className="text-[9px] text-[#888888] font-black uppercase tracking-widest text-center mt-6 flex items-center justify-center gap-2">
                  <ShieldCheck size={12} className="text-soyuz" /> Encrypted by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
