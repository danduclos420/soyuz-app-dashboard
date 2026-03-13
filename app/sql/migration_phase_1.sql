-- Migration Phase 1: Dynamic Objectives & Targeting

-- 1. Table for stored objectives
CREATE TABLE IF NOT EXISTS affiliate_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    target_amount NUMERIC NOT NULL,
    is_global BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Junction table for targeted objectives (if NOT is_global)
CREATE TABLE IF NOT EXISTS objective_assignments (
    objective_id UUID REFERENCES affiliate_objectives(id) ON DELETE CASCADE,
    affiliate_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    PRIMARY KEY (objective_id, affiliate_id)
);

-- 3. Initial baseline from previous Phase 0 table (optional migration of data if exists)
-- Assuming we want to start fresh with a clean UI, but let's insert the default gifts as global objectives
INSERT INTO affiliate_objectives (title, description, target_amount, is_global)
VALUES 
('Cadeau de Bienvenue', 'Atteignez ce premier palier pour débloquer votre cadeau de bienvenue SOYUZ.', 5000, true),
('Statut Elite', 'Débloquez les avantages Elite et une commission bonus.', 15000, true);

-- Enable RLS
ALTER TABLE affiliate_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE objective_assignments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admin full access objectives" ON affiliate_objectives FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Affiliates can see assigned/global objectives" ON affiliate_objectives FOR SELECT USING (
    is_global = true OR 
    EXISTS (SELECT 1 FROM objective_assignments WHERE objective_id = affiliate_objectives.id AND affiliate_id = auth.uid())
);

CREATE POLICY "Admin full access assignments" ON objective_assignments FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Affiliates can see their own assignments" ON objective_assignments FOR SELECT USING (
    affiliate_id = auth.uid()
);
