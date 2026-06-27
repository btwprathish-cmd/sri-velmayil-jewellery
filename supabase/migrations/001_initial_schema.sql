-- ============================================================
-- Sri Velmayil Jewellery — Supabase Database Schema
-- Run this in Supabase Dashboard → SQL Editor
-- Safe to re-run (uses IF NOT EXISTS)
-- ============================================================

-- TABLES

CREATE TABLE IF NOT EXISTS metals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  purity_label text,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS category_metals (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  metal_name text REFERENCES metals(name) ON DELETE CASCADE NOT NULL,
  PRIMARY KEY (category_id, metal_name)
);

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  metal text REFERENCES metals(name) ON DELETE CASCADE NOT NULL,
  category text REFERENCES categories(name) ON DELETE CASCADE NOT NULL,
  weight_g numeric NOT NULL,
  making_charge_pct numeric NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- INDEXES

CREATE INDEX IF NOT EXISTS idx_products_metal ON products (metal);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_metal_category ON products (metal, category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products (created_at DESC);

-- ROW LEVEL SECURITY

ALTER TABLE metals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_metals ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read (website visitors can read all data)
CREATE POLICY "Public read metals" ON metals FOR SELECT TO anon USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public read category_metals" ON category_metals FOR SELECT TO anon USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT TO anon USING (true);

-- Service role full access (for direct DB connections like the Express API via DATABASE_URL)
-- The Express API connects via the Postgres connection string which bypasses RLS entirely.
-- These policies are for any future Supabase JS client usage.
CREATE POLICY "Service role full access metals" ON metals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access categories" ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access category_metals" ON category_metals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- UPDATED_AT TRIGGER

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- SEED DATA (safe — uses ON CONFLICT DO NOTHING)
-- Run this after tables are confirmed to exist

INSERT INTO metals (name, purity_label, description) VALUES
  ('Gold', '22K • 24K • 18K', 'BIS Hallmarked pure gold jewellery crafted with tradition'),
  ('Silver', '99.9% Pure', 'Pure silver jewellery and articles')
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description) VALUES
  ('Coin', 'Gold and silver coins in various weights — ideal for gifting and investment'),
  ('Ring', 'Engagement, wedding, and daily-wear rings in traditional and modern styles'),
  ('Chain', 'Necklaces and chains from delicate daily wear to heavy bridal harems'),
  ('Earring', 'Studs, drops, jhumkas, and chandbalis crafted in hallmarked gold'),
  ('Bracelet', 'Bangles and bracelets from lightweight daily pieces to grand bridal sets'),
  ('Anklet', 'Traditional and contemporary anklets in pure gold and silver')
ON CONFLICT (name) DO NOTHING;

INSERT INTO category_metals (category_id, metal_name)
SELECT c.id, m.name
FROM categories c
CROSS JOIN metals m
ON CONFLICT DO NOTHING;
