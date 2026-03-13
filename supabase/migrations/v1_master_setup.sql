-- SOYUZ MASTER MIGRATION V1

-- 0. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Already exists but ensure schema and RLS)
-- We assume it has id, email, full_name, role
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('client', 'affiliate', 'admin', 'devtool');
    END IF;
END $$;

ALTER TABLE IF EXISTS profiles 
ALTER COLUMN role SET DEFAULT 'client';

-- 2. SITE_STYLES (Phase 1.5 - Global DevTool Persistence)
CREATE TABLE IF NOT EXISTS site_styles (
    id TEXT PRIMARY KEY, -- Element selector or wix-id
    styles JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by UUID REFERENCES profiles(id)
);

-- 3. AFFILIATES
CREATE TABLE IF NOT EXISTS affiliates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) UNIQUE NOT NULL,
    affiliate_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'suspended', 'rejected')),
    commission_rate DECIMAL DEFAULT 0.15, -- 15% standard
    total_sales DECIMAL DEFAULT 0,
    total_commissions DECIMAL DEFAULT 0,
    photo_url TEXT,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCTS & VARIANTS
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    category TEXT,
    base_price DECIMAL NOT NULL,
    images TEXT[],
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku TEXT UNIQUE NOT NULL,
    size TEXT,
    color TEXT,
    flex INTEGER,
    side TEXT CHECK (side IN ('left', 'right')),
    stock_qty INTEGER DEFAULT 0,
    price_retail DECIMAL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. ORDERS & ITEMS
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    affiliate_code TEXT REFERENCES affiliates(affiliate_code),
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent TEXT UNIQUE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'refunded', 'failed')),
    subtotal DECIMAL NOT NULL,
    tax DECIMAL DEFAULT 0,
    shipping DECIMAL DEFAULT 0,
    total DECIMAL NOT NULL,
    shipping_address JSONB,
    customer_email TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    variant_id UUID REFERENCES product_variants(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL NOT NULL
);

-- 6. COMMISSIONS
CREATE TABLE IF NOT EXISTS commissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL NOT NULL,
    rate DECIMAL NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 7. MESSAGES (Admin -> Affiliate)
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES profiles(id),
    recipient_id UUID REFERENCES profiles(id), -- NULL if broadcast
    is_broadcast BOOLEAN DEFAULT false,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    is_perpetual BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AFFILIATE POINTS
CREATE TABLE IF NOT EXISTS affiliate_points (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    affiliate_id UUID REFERENCES affiliates(id) UNIQUE,
    total_points INTEGER DEFAULT 0,
    monthly_points INTEGER DEFAULT 0,
    lifetime_points INTEGER DEFAULT 0,
    last_reset TIMESTAMPTZ DEFAULT NOW()
);

-- 9. APP_CONFIG (QuickBooks Tokens etc)
CREATE TABLE IF NOT EXISTS app_config (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES (BASIC V1)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_styles ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_config ENABLE ROW LEVEL SECURITY;

-- PUBLIC READ PRODUCTS
CREATE POLICY "Public read active products" ON products FOR SELECT USING (is_active = true);
CREATE POLICY "Public read variants" ON product_variants FOR SELECT USING (true);

-- ADMIN FULL ACCESS
CREATE POLICY "Admin full access profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'role' = 'admin' OR auth.jwt() ->> 'role' = 'devtool');
-- (And so on for other tables, to be refined in Phase 1)
