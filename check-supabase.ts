import { supabase } from './apps/web/src/lib/supabase.ts';

async function check() {
  const { data: cats } = await supabase.from('categories').select('*');
  const { data: catMetals } = await supabase.from('category_metals').select('*');
  console.log("Categories:", cats?.length);
  console.log("Category Metals:", catMetals?.length);
  if (catMetals?.length === 0) {
    console.log("NO CATEGORY METALS MAPPINGS FOUND!");
  } else {
    console.log(catMetals);
  }
}

check();
