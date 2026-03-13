import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  variantId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  flex?: string | null;
  side?: 'left' | 'right' | null;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  repCode: string | null;
  discount: number;
  isCartOpen: boolean;
  
  // Actions
  addItem: (item: CartItem) => void;
  removeItem: (id: string, variantId: string) => void;
  updateQuantity: (id: string, variantId: string, quantity: number) => void;
  setRepCode: (code: string | null, discount?: number) => void;
  toggleCart: (open?: boolean) => void;
  clearCart: () => void;
  
  // Computed (helper functions to be used in components)
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      repCode: null,
      discount: 0,
      isCartOpen: false,

      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(
          (i) => i.id === item.id && i.variantId === item.variantId
        );

        if (existingItemIndex > -1) {
          const newItems = [...items];
          newItems[existingItemIndex].quantity += item.quantity;
          set({ items: newItems, isCartOpen: true });
        } else {
          set({ items: [...items, item], isCartOpen: true });
        }
      },

      removeItem: (id, variantId) => {
        set((state) => ({
          items: state.items.filter((i) => !(i.id === id && i.variantId === variantId)),
        }));
      },

      updateQuantity: (id, variantId, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id && i.variantId === variantId ? { ...i, quantity } : i
          ),
        }));
      },

      setRepCode: (code, discount = 0) => {
        set({ repCode: code, discount });
      },

      toggleCart: (open) => {
        set((state) => ({ isCartOpen: open ?? !state.isCartOpen }));
      },

      clearCart: () => {
        set({ items: [], repCode: null, discount: 0 });
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getDiscountAmount: () => {
        const { getSubtotal, discount } = get();
        return (getSubtotal() * discount) / 100;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discountAmount = get().getDiscountAmount();
        const tax = (subtotal - discountAmount) * 0.15; // 15% TPS/TVQ
        return subtotal - discountAmount + tax;
      },
    }),
    {
      name: 'soyuz-cart-storage',
    }
  )
);
