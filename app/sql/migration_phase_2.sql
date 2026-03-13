-- Migration Phase 2: Rank Thresholds
-- Stores the $ amount needed for each rank

INSERT INTO app_settings (key, value)
VALUES ('rank_thresholds', '{
  "agent": 0,
  "pro": 5000,
  "elite": 15000,
  "legend": 50000
}'::jsonb)
ON CONFLICT (key) DO NOTHING;

-- Policies for profiles to include rank visibility if needed
-- (Already existing from Phase 0)
