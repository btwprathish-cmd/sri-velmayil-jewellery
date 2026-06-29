-- ============================================================
-- Supabase Database Schema: Rate History
-- ============================================================

CREATE TABLE IF NOT EXISTS rate_history (
  date date PRIMARY KEY,
  gold22k_1g numeric NOT NULL,
  gold22k_8g numeric NOT NULL,
  silver_1g numeric NOT NULL,
  gold24k_1g numeric NOT NULL,
  source text NOT NULL,
  fetched_at timestamptz DEFAULT now() NOT NULL,
  trend_gold numeric,
  trend_silver numeric
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_rate_history_date ON rate_history (date DESC);

-- ROW LEVEL SECURITY
ALTER TABLE rate_history ENABLE ROW LEVEL SECURITY;

-- Public read (website visitors can read all data)
CREATE POLICY "Public read rate_history" ON rate_history FOR SELECT TO anon USING (true);

-- Service role full access
CREATE POLICY "Service role full access rate_history" ON rate_history FOR ALL TO service_role USING (true) WITH CHECK (true);
