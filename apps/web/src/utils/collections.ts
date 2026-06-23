import { supabase } from "@/lib/supabase";

export type MetalData = {
  name: string;
  purityLabel?: string;
  description?: string;
  imageUrl?: string;
};

export type CategoryData = {
  name: string;
  description?: string;
  metals?: string[];
};

export type CollectionItem = {
  id: string;
  name: string;
  weight_g: number;
  making_charge_pct: number;
  description: string;
  image: string;
};

export type CollectionBlock = {
  id: string;
  name: string;
  slug: string;
  metal: string;
  category: string;
  description: string;
  items: CollectionItem[];
};

export async function getMetals(): Promise<MetalData[]> {
  const { data, error } = await supabase.from('metals').select('*').order('created_at', { ascending: true });
  if (error) {
    console.error("Error fetching metals:", error);
    return [];
  }
  return data.map(m => ({
    name: m.name,
    purityLabel: m.purity_label,
    description: m.description,
    imageUrl: m.image_url
  }));
}

export async function addMetal(metal: MetalData): Promise<void> {
  const { error } = await supabase.from('metals').insert([{
    name: metal.name.trim(),
    purity_label: metal.purityLabel,
    description: metal.description,
    image_url: metal.imageUrl
  }]);
  if (error) {
    console.error("Error adding metal:", error);
    throw new Error(error.message);
  }
}

export async function updateMetal(oldName: string, metal: MetalData): Promise<void> {
  const { error } = await supabase.from('metals').update({
    name: metal.name.trim(),
    purity_label: metal.purityLabel,
    description: metal.description,
    image_url: metal.imageUrl
  }).eq('name', oldName);
  if (error) {
    console.error("Error updating metal:", error);
    throw new Error(error.message);
  }
}

export async function deleteMetal(name: string): Promise<void> {
  const { error } = await supabase.from('metals').delete().eq('name', name);
  if (error) {
    console.error("Error deleting metal:", error);
    throw new Error(error.message);
  }
}

export async function getCategories(): Promise<CategoryData[]> {
  const { data: cats, error: catErr } = await supabase.from('categories').select('*').order('created_at', { ascending: true });
  if (catErr) {
    console.error("Error fetching categories:", catErr);
    return [];
  }
  
  const { data: catMetals, error: mapErr } = await supabase.from('category_metals').select('*');
  if (mapErr) {
    console.error("Error fetching category_metals:", mapErr);
    return [];
  }

  return cats.map(c => {
    const metalsForCat = catMetals.filter(cm => cm.category_id === c.id).map(cm => cm.metal_name);
    return {
      name: c.name,
      description: c.description,
      metals: metalsForCat
    };
  });
}

export async function addCategory(category: CategoryData): Promise<void> {
  const { data, error } = await supabase.from('categories').insert([{
    name: category.name.trim(),
    description: category.description
  }]).select('id').single();
  
  if (error) {
    console.error("Error adding category:", error);
    throw new Error(error.message);
  }

  if (category.metals && category.metals.length > 0 && data) {
    const mappings = category.metals.map(m => ({
      category_id: data.id,
      metal_name: m
    }));
    const { error: mapErr } = await supabase.from('category_metals').insert(mappings);
    if (mapErr) {
      console.error("Error adding category mappings:", mapErr);
      throw new Error(mapErr.message);
    }
  }
}

export async function updateCategory(oldName: string, category: CategoryData): Promise<void> {
  const { data, error } = await supabase.from('categories').update({
    name: category.name.trim(),
    description: category.description
  }).eq('name', oldName).select('id').single();

  if (error) {
    console.error("Error updating category:", error);
    throw new Error(error.message);
  }

  if (data) {
    // Recreate mappings
    await supabase.from('category_metals').delete().eq('category_id', data.id);
    if (category.metals && category.metals.length > 0) {
      const mappings = category.metals.map(m => ({
        category_id: data.id,
        metal_name: m
      }));
      const { error: mapErr } = await supabase.from('category_metals').insert(mappings);
      if (mapErr) {
        console.error("Error updating category mappings:", mapErr);
        throw new Error(mapErr.message);
      }
    }
  }
}

export async function deleteCategory(name: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('name', name);
  if (error) {
    console.error("Error deleting category:", error);
    throw new Error(error.message);
  }
}

export async function getCollections(): Promise<CollectionBlock[]> {
  const { data: products, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error("Error fetching products:", error);
    return [];
  }

  // Group by metal and category
  const grouped: Record<string, CollectionBlock> = {};
  
  for (const p of products) {
    const key = `${p.metal}-${p.category}`;
    if (!grouped[key]) {
      const slug = `${p.metal.toLowerCase()}-${p.category.toLowerCase()}s`;
      grouped[key] = {
        id: slug,
        name: `${p.metal} ${p.category}s`,
        slug: slug,
        metal: p.metal,
        category: p.category,
        description: `Explore our beautiful collection of ${p.metal} ${p.category}s.`,
        items: []
      };
    }
    grouped[key].items.push({
      id: p.id,
      name: p.name,
      weight_g: p.weight_g,
      making_charge_pct: p.making_charge_pct,
      description: p.description,
      image: p.image
    });
  }

  return Object.values(grouped);
}

export async function saveCollectionItem(payload: {
  name: string;
  metal: string;
  category: string;
  weight_g: number;
  making_charge_pct: number;
  description: string;
  imageUrl: string;
}): Promise<void> {
  const { error } = await supabase.from('products').insert([{
    id: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
    name: payload.name,
    metal: payload.metal,
    category: payload.category,
    weight_g: payload.weight_g,
    making_charge_pct: payload.making_charge_pct,
    description: payload.description || "",
    image: payload.imageUrl || ""
  }]);
  if (error) {
    console.error("Error saving product:", error);
    throw new Error(error.message);
  }
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', productId);
  if (error) {
    console.error("Error deleting product:", error);
    throw new Error(error.message);
  }
}

export async function updateProduct(productId: string, payload: any): Promise<void> {
  const { error } = await supabase.from('products').update({
    name: payload.name,
    metal: payload.metal,
    category: payload.category,
    weight_g: payload.weight_g,
    making_charge_pct: payload.making_charge_pct,
    description: payload.description,
    image: payload.imageUrl !== undefined ? payload.imageUrl : undefined
  }).eq('id', productId);
  if (error) {
    console.error("Error updating product:", error);
    throw new Error(error.message);
  }
}
