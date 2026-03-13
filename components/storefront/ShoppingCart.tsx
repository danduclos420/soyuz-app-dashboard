'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';

export default function ShoppingCart() {
  const { 
    items, 
    isCartOpen, 
    toggleCart, 
    updateQuantity, 
    removeItem, 
    getSubtotal, 
    getDiscountAmount, 
    getTotal 
  } = useCartStore();

  const subtotal = getSubtotal();
  const discountAmount = getDiscountAmount();
  const total = getTotal();
  const tax = total - (subtotal - discountAmount);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={() => toggleCart(false)}
          />

          {/* Cart Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-carbon-surface border-l border-white/10 shadow-2xl z-[101] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="bg-soyuz p-2 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter italic text-white leading-none">Your Gear</h2>
                  <p className="text-[10px] text-muted font-bold tracking-widest uppercase mt-1">SOYUZ BC North America</p>
                </div>
              </div>
              <button
                onClick={() => toggleCart(false)}
                className="p-2 hover:bg-white/5 rounded-full transition-colors text-muted hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-8 h-8 text-white/20" />
                  </div>
                  <h3 className="text-white font-bold uppercase tracking-tight mb-2">The locker is empty</h3>
                  <p className="text-muted text-sm max-w-[200px] mb-8">Grab some professional gear and dominate the game.</p>
                  <Link
                    href="/products"
                    onClick={() => toggleCart(false)}
                    className="btn-primary"
                  >
                    START SHOPPING <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={`${item.id}-${item.variantId}`}
                      className="flex gap-4 p-4 bg-black/40 border border-white/5 rounded-2xl group hover:border-white/10 transition-colors"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 flex-shrink-0 bg-carbon-surface rounded-xl overflow-hidden p-2 border border-white/5">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-white uppercase tracking-tight text-sm leading-tight">{item.name}</h3>
                            <button
                              onClick={() => removeItem(item.id, item.variantId)}
                              className="text-muted hover:text-soyuz transition-colors ml-2"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          {(item.flex || item.side) && (
                            <p className="text-muted text-[10px] uppercase font-black tracking-widest mt-1">
                              {item.flex ? `Flex ${item.flex}` : ''} {item.side ? `• ${item.side}` : ''}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <p className="text-white font-black text-lg">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-black rounded-lg border border-white/10 p-1">
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, Math.max(1, item.quantity - 1))}
                              className="p-1 text-muted hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-xs font-black text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.variantId, item.quantity + 1)}
                              className="p-1 text-muted hover:text-white transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Totals */}
            {items.length > 0 && (
              <div className="border-t border-white/10 p-8 space-y-6 bg-black/50 backdrop-blur-md">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted">
                    <span>Subtotal</span>
                    <span className="text-white">${subtotal.toFixed(2)}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-soyuz">
                      <span>Discount (REP Code)</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-muted">
                    <span>Taxes (TPS + TVQ)</span>
                    <span className="text-white">${tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-end pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-muted font-black uppercase tracking-widest">Total CAD</p>
                      <p className="text-3xl font-black text-white italic leading-none mt-1">
                        ${total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Link
                    href="/cart"
                    onClick={() => toggleCart(false)}
                    className="btn-outline flex items-center justify-center text-xs"
                  >
                    VIEW BAG
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={() => toggleCart(false)}
                    className="btn-primary flex items-center justify-center text-xs"
                  >
                    CHECKOUT <ArrowRight size={14} className="ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
