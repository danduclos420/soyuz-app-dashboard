export type UserRole = 'admin' | 'b2b' | 'affiliate' | 'customer';
export type UserStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type OrderType = 'retail' | 'b2b';

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role: UserRole;
  status: UserStatus;
  company_name?: string;
  phone?: string;
  stripe_customer_id?: string;
  affiliate_code?: string;
  commission_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  erplain_id?: string;
  name: string;
  slug: string;
  description?: string;
  category: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  erplain_variant_id?: string;
  sku?: string;
  name: string;
  flex?: string;
  side?: 'left' | 'right';
  lie?: string;
  price_retail: number;
  price_b2b?: number;
  stock_qty: number;
  stripe_price_id?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_name?: string;
  order_type: OrderType;
  status: OrderStatus;
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  total_amount: number;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  affiliate_code?: string;
  affiliate_commission?: number;
  shipping_address?: Record<string, string>;
  notes?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  variant_id?: string;
  product_name: string;
  variant_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}
