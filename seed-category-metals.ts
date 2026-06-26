import { supabase } from './apps/web/src/lib/';

async function seed() {
  const { data: cats } = await supabase.from('categories').select('*');
  const { data: metals } = await supabase.from('metals').select('name');
  
  if (!cats || !metals) return;
  
  const metalNames = metals.map(m => m.name);
  
  for (const cat of cats) {
    // Check if it already has mappings
    const { data: existing } = await supabase.from('category_metals').select('*').eq('category_id', cat.id);
    if (!existing || existing.length === 0) {
      console.log(`Seeding mappings for category: ${cat.name}`);
      const mappings = metalNames.map(m => ({
        category_id: cat.id,
        metal_name: m
      }));
      await supabase.from('category_metals').insert(mappings);
    }
  }
  console.log("Done seeding category metals!");
}

seed();
