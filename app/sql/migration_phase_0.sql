-- SOYUZ DASHBOARD MIGRATION - PHASE 0 & 1
-- Run this in Supabase SQL Editor

-- 1. Rename 'reps' table if it exists (backup/unity)
-- Note: If you already have 'affiliates', skip this or adjust.
-- ALTER TABLE IF EXISTS reps RENAME TO affiliates;

-- 2. Update profiles role terminology
UPDATE profiles SET role = 'affiliate' WHERE role = 'rep';
-- Ensure role check constraint allows 'affiliate'
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('client', 'affiliate', 'admin'));

-- 3. Update orders to include affiliate_code
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='affiliate_code') THEN
    ALTER TABLE orders ADD COLUMN affiliate_code TEXT;
  END IF;
END $$;

-- 4. Update commissions terminology
-- If you have 'rep_id', rename it to 'affiliate_id'
-- ALTER TABLE commissions RENAME COLUMN rep_id TO affiliate_id;

-- 5. Create App Settings table for Points & Gifts
CREATE TABLE IF NOT EXISTS app_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Insert default settings
INSERT INTO app_settings (key, value)
VALUES 
  ('points_config', '{"dollars_per_point": 1000}'),
  ('gifts_config', '{"gift_1_threshold": 5000, "gift_2_threshold": 10000}')
ON CONFLICT (key) DO NOTHING;

-- 7. Ensure invite_codes table exists for the new admin features
CREATE TABLE IF NOT EXISTS invite_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  used_by UUID REFERENCES profiles(id)
);
