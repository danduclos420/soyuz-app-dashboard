-- Migration: Hockey Card Persistence
-- Adds support for storing custom hockey card photos and their transformation settings

-- 1. Update profiles table to store card-specific data
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS hockey_card_photo_url TEXT,
ADD COLUMN IF NOT EXISTS hockey_card_settings JSONB DEFAULT '{ "x": 0, "y": 0, "scale": 1 }'::jsonb;

-- 2. Create a bucket for hockey card photos (if using Supabase Storage)
-- Note: This part is usually done in the Supabase Dashboard, 
-- but we can document the intent here.
-- BUCKET NAME: 'hockey-cards'
-- PUBLIC: true
-- RLS: Authenticated users can upload their own photo (id = user_id)
