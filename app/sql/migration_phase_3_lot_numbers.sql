-- Migration Phase 3: Persistent Lot Numbers (v18.0)
-- Adds a unique, auto-incrementing lot number for each user's hockey card.

-- 1. Create a sequence for lot numbers starting from 1
CREATE SEQUENCE IF NOT EXISTS lot_number_seq START 1;

-- 2. Add the lot_number column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS lot_number INTEGER DEFAULT nextval('lot_number_seq');

-- 3. Ensure uniqueness
ALTER TABLE profiles 
ADD CONSTRAINT profiles_lot_number_key UNIQUE (lot_number);

-- 4. Set initial lot numbers for key users (Dan and Dany)
-- NOTE: Dan needs to run this and replace the UUIDs with the actual ones if needed.
-- We can also use email or username to target them if available.

-- Example seeding (replace with real IDs if known, or run manually in Supabase)
-- UPDATE profiles SET lot_number = 1 WHERE email = 'dany@example.com'; 
-- UPDATE profiles SET lot_number = 2 WHERE email = 'danduclos@example.com';

-- 5. Create a function to auto-assign lot numbers to new users
CREATE OR REPLACE FUNCTION assign_lot_number()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lot_number IS NULL THEN
    NEW.lot_number := nextval('lot_number_seq');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger
DROP TRIGGER IF EXISTS tr_assign_lot_number ON profiles;
CREATE TRIGGER tr_assign_lot_number
BEFORE INSERT ON profiles
FOR EACH ROW
EXECUTE FUNCTION assign_lot_number();
