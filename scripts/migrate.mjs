import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../apps/web/.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in apps/web/.env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log("Starting migration...");
  const dataPath = path.join(__dirname, '../apps/web/src/data/collections.json');
  if (!fs.existsSync(dataPath)) {
    console.error("collections.json not found!");
    return;
  }

  const rawData = fs.readFileSync(dataPath, 'utf-8');
  const collections = JSON.parse(rawData);

  const metalsSet = new Set();
  const categoriesSet = new Set();
  const products = [];

  for (const block of collections) {
    metalsSet.add(block.metal);
    categoriesSet.add(block.category);
    for (const item of block.items) {
      products.push({
        id: item.id,
        name: item.name,
        metal: block.metal,
        category: block.category,
        weight_g: item.weight_g,
        making_charge_pct: item.making_charge_pct,
        description: item.description || '',
        image: item.image || ''
      });
    }
  }

  console.log(`Found ${metalsSet.size} metals, ${categoriesSet.size} categories, ${products.length} products.`);

  // Insert Metals
  for (const m of metalsSet) {
    const { error } = await supabase.from('metals').upsert([{ 
      name: m, 
      purity_label: m === 'Gold' ? 'BIS 916 Hallmarked' : 'Purity 99.9%',
      description: `Premium ${m} jewellery.`
    }], { onConflict: 'name' });
    if (error) console.error("Error inserting metal:", error);
  }

  // Insert Categories
  for (const c of categoriesSet) {
    const { error } = await supabase.from('categories').upsert([{
      name: c,
      description: `Beautiful ${c} collection.`
    }], { onConflict: 'name' });
    if (error) console.error("Error inserting category:", error);
  }

  // Map Categories to Metals
  for (const block of collections) {
    const { data: cat } = await supabase.from('categories').select('id').eq('name', block.category).single();
    if (cat) {
      const { error } = await supabase.from('category_metals').upsert([{
        category_id: cat.id,
        metal_name: block.metal
      }], { onConflict: 'category_id,metal_name' });
      if (error) console.error("Error inserting mapping:", error);
    }
  }

  // Insert Products
  for (const p of products) {
    const { error } = await supabase.from('products').upsert([{
      id: p.id,
      name: p.name,
      metal: p.metal,
      category: p.category,
      weight_g: p.weight_g,
      making_charge_pct: p.making_charge_pct,
      description: p.description,
      image: p.image
    }], { onConflict: 'id' });
    if (error) console.error("Error inserting product:", p.id, error);
  }

  console.log("Migration complete!");
}

migrate().catch(console.error);
