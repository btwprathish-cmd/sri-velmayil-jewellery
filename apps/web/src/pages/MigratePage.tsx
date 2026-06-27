import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import localData from '@/data/collections.json';

export default function MigratePage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isMigrating, setIsMigrating] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const runMigration = async () => {
    setIsMigrating(true);
    addLog("Starting migration...");
    
    try {
      const metalsSet = new Set<string>();
      const categoriesSet = new Set<string>();
      interface MigrationProduct {
        id: string;
        name: string;
        metal: string;
        category: string;
        weight_g: number;
        making_charge_pct: number;
        description: string;
        image: string;
      }
      const products: MigrationProduct[] = [];

      for (const block of localData) {
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

      addLog(`Found ${metalsSet.size} metals, ${categoriesSet.size} categories, ${products.length} products.`);

      // 1. Insert Metals
      for (const m of Array.from(metalsSet)) {
        addLog(`Upserting metal: ${m}`);
        const { error } = await supabase.from('metals').upsert([{ 
          name: m, 
          purity_label: m === 'Gold' ? 'BIS 916 Hallmarked' : 'Purity 99.9%',
          description: `Premium ${m} jewellery.`
        }], { onConflict: 'name' });
        if (error) addLog(`Error metal ${m}: ${error.message}`);
      }

      // 2. Insert Categories
      for (const c of Array.from(categoriesSet)) {
        addLog(`Upserting category: ${c}`);
        const { error } = await supabase.from('categories').upsert([{
          name: c,
          description: `Beautiful ${c} collection.`
        }], { onConflict: 'name' });
        if (error) addLog(`Error category ${c}: ${error.message}`);
      }

      // 3. Map Categories to Metals
      for (const block of localData) {
        addLog(`Mapping ${block.category} to ${block.metal}`);
        const { data: cat } = await supabase.from('categories').select('id').eq('name', block.category).single();
        if (cat) {
          const { error } = await supabase.from('category_metals').upsert([{
            category_id: cat.id,
            metal_name: block.metal
          }], { onConflict: 'category_id,metal_name' });
          if (error) addLog(`Error mapping: ${error.message}`);
        }
      }

      // 4. Insert Products
      for (const p of products) {
        addLog(`Upserting product: ${p.name}`);
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
        if (error) addLog(`Error product ${p.name}: ${error.message}`);
      }

      addLog("✅ Migration complete! You can now visit the admin dashboard.");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown fatal error";
      addLog(`❌ Fatal Error: ${message}`);
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0c0418] text-[#F3E5AB] p-10 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-[#D4AF37]">Supabase Data Migration Tool</h1>
        <p className="mb-6 opacity-80">
          This tool will read your local `collections.json` and safely push (upsert) all metals, categories, and products to your connected Supabase database.
        </p>
        
        <button 
          onClick={runMigration} 
          disabled={isMigrating}
          className="bg-[#D4AF37] text-black px-6 py-3 rounded-lg font-bold disabled:opacity-50 hover:bg-[#F3E5AB] transition-colors mb-8"
        >
          {isMigrating ? 'Migrating...' : 'Start Migration'}
        </button>

        <div className="bg-black/50 border border-[#D4AF37]/30 p-6 rounded-lg h-96 overflow-y-auto font-mono text-sm shadow-xl">
          {logs.length === 0 ? (
            <span className="opacity-50">Waiting to start... Make sure you have added VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file before running.</span>
          ) : (
            logs.map((log, i) => <div key={i} className="mb-1">{log}</div>)
          )}
        </div>
      </div>
    </div>
  );
}
