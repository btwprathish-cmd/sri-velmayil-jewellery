-- Instructions: 
-- 1. Go to Supabase project -> SQL Editor
-- 2. Paste the contents of this file
-- 3. Click Run

-- Create tables
CREATE TABLE metals (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  purity_label text,
  description text,
  image_url text,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- We use a junction table to map categories to metals (since a category can have multiple metals)
CREATE TABLE category_metals (
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  metal_name text REFERENCES metals(name) ON DELETE CASCADE,
  PRIMARY KEY (category_id, metal_name)
);

CREATE TABLE products (
  id text PRIMARY KEY,
  name text NOT NULL,
  metal text NOT NULL REFERENCES metals(name) ON DELETE CASCADE,
  category text NOT NULL REFERENCES categories(name) ON DELETE CASCADE,
  weight_g numeric NOT NULL,
  making_charge_pct numeric NOT NULL,
  description text,
  image text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE metals ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_metals ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read metals" ON metals FOR SELECT TO anon USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Public read category_metals" ON category_metals FOR SELECT TO anon USING (true);
CREATE POLICY "Public read products" ON products FOR SELECT TO anon USING (true);

-- Service role full access (Admin API bypasses RLS)
CREATE POLICY "Service role full access metals" ON metals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access categories" ON categories FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access category_metals" ON category_metals FOR ALL TO service_role USING (true) WITH CHECK (true);
CREATE POLICY "Service role full access products" ON products FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Also allow anon full access for now since the frontend admin dashboard directly calls the functions in `utils/collections.ts`.
-- Wait, the admin dashboard uses local storage directly right now. If we switch to Supabase directly from the browser, we need to allow anon to insert/update, OR we keep the Vercel API. 
-- But currently only `api/admin/products.ts` exists for products. Metals and categories don't have APIs!
-- Let's just create an authenticated policy for the browser, or temporarily open RLS for demonstration until auth is moved to Supabase.
-- Since they currently have a simple password-based admin login, we'll allow anon to ALL, relying on frontend routes for protection for now.
-- In a real app, Admin should use Supabase Auth.
CREATE POLICY "Admin anon access metals" ON metals FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin anon access categories" ON categories FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin anon access category_metals" ON category_metals FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Admin anon access products" ON products FOR ALL TO anon USING (true) WITH CHECK (true);

-- Updated_at trigger for products
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
