# Supabase Database Setup — Sri Velmayil Jewellery

## Step 1: Create Supabase Project
1. Go to [Supabase](https://supabase.com) and click **New Project**.
2. Set the Name to: `sri-velmayil-jewellery`.
3. Set the Region to: **Southeast Asia (Singapore)** (closest to Tamil Nadu for optimal performance).
4. Save the database password securely.

## Step 2: Get Your Connection String
1. Go to **Project Settings → Database → Connection string → URI**.
2. Copy the connection string. It will look like this:
   `postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
   *(This is your `DATABASE_URL`)*

## Step 3: Apply the Schema
1. Go to the **SQL Editor** in your Supabase dashboard.
2. Paste the contents of `supabase/migrations/001_initial_schema.sql` into the editor.
3. Click **Run**. This will create your tables and populate the initial setup.

## Step 4: Verify Tables
Check the **Table Editor** in Supabase to ensure the following exist:
- `metals` (Should have 2 rows: Gold, Silver)
- `categories` (Should have 6 rows: Coin, Ring, Chain, Earring, Bracelet, Anklet)
- `category_metals` (Should have 12 rows connecting the above)
- `products` (Should be empty initially)

## Step 5: Configure .env
1. Open `.env` in the root of your project.
2. Paste your PostgreSQL connection string into the `DATABASE_URL=` variable.
3. Go to **Project Settings → API** in Supabase and copy the **Project URL** and **anon public key**.
4. Paste them into `.env` under `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.

## Step 6: Run the App
1. Install dependencies: `pnpm install`
2. Start the API and Web app: `pnpm run dev`

## Verification Checklist
- [ ] `metals` table has 2 rows: Gold, Silver
- [ ] `categories` table has 6 rows: Coin, Ring, Chain, Earring, Bracelet, Anklet
- [ ] `category_metals` has 12 rows (2 metals × 6 categories)
- [ ] `products` table is empty (admin will add products via dashboard)
- [ ] `/api/metals` returns JSON array with Gold and Silver
- [ ] `/api/categories` returns JSON array with 6 categories
- [ ] `/api/collections` returns empty array `[]` (no products yet)
- [ ] Admin login works at `/admin/login`
- [ ] Adding a product in admin dashboard → appears at `/jewellery-collections/gold/ring`

## Troubleshooting
- **DATABASE_URL connection refused**: Check the connection string format, ensure you are using port 5432 and not the pooler port.
- **RLS blocking reads**: The `anon` user should have `SELECT` via the public read policies.
- **Product not showing after add**: Check the metal and category match exactly (case matters in DB, frontend normalizes).
