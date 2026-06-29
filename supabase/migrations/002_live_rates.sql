-- Create live_rates table
CREATE TABLE live_rates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date text UNIQUE NOT NULL,
  gold22k_1g numeric NOT NULL,
  gold22k_8g numeric NOT NULL,
  silver_1g numeric NOT NULL,
  gold24k_1g numeric NOT NULL,
  source text,
  fetched_at timestamptz DEFAULT now() NOT NULL,
  trend_gold numeric,
  trend_silver numeric
);

-- Enable RLS
ALTER TABLE live_rates ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read live_rates" ON live_rates FOR SELECT TO anon USING (true);

-- Allow anon to insert/update for Vercel functions using anon key
CREATE POLICY "Anon insert live_rates" ON live_rates FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anon update live_rates" ON live_rates FOR UPDATE TO anon USING (true);

-- Service role full access
CREATE POLICY "Service role full access live_rates" ON live_rates FOR ALL TO service_role USING (true) WITH CHECK (true);
