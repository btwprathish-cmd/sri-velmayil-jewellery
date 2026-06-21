import collectionsData from "@/data/collections.json";

export type MetalData = {
  name: string;
  purityLabel?: string;
  description?: string;
  imageUrl?: string;
};

export type CategoryData = {
  name: string;
  description?: string;
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

const STORAGE_KEY = "svj_collections";
const METALS_KEY = "svj_metals";
const CATEGORIES_KEY = "svj_categories";

const DEFAULT_METALS: MetalData[] = [
  { name: "Gold", purityLabel: "22K · 24K · 18K", description: "Rings, chains, earrings, bangles, coins and anklets — all hallmarked 916 BIS certified pure gold.", imageUrl: "/images/GOLD.jpg" },
  { name: "Silver", purityLabel: "Purity 99.9%", description: "Fine silver ornaments, auspicious articles, and investment coins — priced at today's live silver rate with the same purity guarantee we extend to our gold.", imageUrl: "/images/SILVER.jpg" }
];
const DEFAULT_CATEGORIES: CategoryData[] = [
  { name: "Coin", description: "Pure gold and silver coins in various weights — ideal for gifting and investment." },
  { name: "Ring", description: "Engagement, wedding, and daily-wear rings in traditional and modern styles." },
  { name: "Chain", description: "Necklaces and chains — from delicate daily wear to heavy bridal harems." },
  { name: "Earring", description: "Studs, drops, jhumkas, and chandbalis crafted in 22K hallmarked gold." },
  { name: "Bracelet", description: "Bangles and bracelets ranging from lightweight daily pieces to grand bridal sets." },
  { name: "Anklet", description: "Traditional and contemporary anklets in pure gold and silver." }
];

export function getMetals(): MetalData[] {
  try {
    const stored = localStorage.getItem(METALS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => {
        const metalData = typeof item === 'string' ? { name: item } : item;
        const defaultMatch = DEFAULT_METALS.find(m => m.name.toLowerCase() === metalData.name.toLowerCase());
        if (defaultMatch) {
          return { ...defaultMatch, ...metalData };
        }
        return metalData;
      });
    }
  } catch (e) {}
  return [...DEFAULT_METALS];
}

export function addMetal(metal: MetalData): void {
  const metals = getMetals();
  const trimmed = metal.name.trim();
  if (trimmed && !metals.map(m => m.name.toLowerCase()).includes(trimmed.toLowerCase())) {
    metals.push({ ...metal, name: trimmed });
    localStorage.setItem(METALS_KEY, JSON.stringify(metals));
  }
}

export function getCategories(): CategoryData[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((item: any) => typeof item === 'string' ? { name: item } : item);
    }
  } catch (e) {}
  return [...DEFAULT_CATEGORIES];
}

export function addCategory(category: CategoryData): void {
  const categories = getCategories();
  const trimmed = category.name.trim();
  if (trimmed && !categories.map(c => c.name.toLowerCase()).includes(trimmed.toLowerCase())) {
    categories.push({ ...category, name: trimmed });
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }
}

export function getCollections(): CollectionBlock[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored) as CollectionBlock[];
    }
  } catch (e) {
    console.error("Failed to parse collections from localStorage", e);
  }
  return collectionsData as CollectionBlock[];
}

export function saveCollectionItem(payload: {
  name: string;
  metal: string;
  category: string;
  weight_g: number;
  making_charge_pct: number;
  description: string;
  imageUrl: string;
}): void {
  const collections = getCollections();
  const targetMetal = payload.metal.toLowerCase();
  const targetCategory = payload.category.toLowerCase();

  let targetCollection = collections.find(
    (c) => c.metal.toLowerCase() === targetMetal && c.category.toLowerCase() === targetCategory
  );

  if (!targetCollection) {
    const slug = `${targetMetal}-${targetCategory}s`;
    targetCollection = {
      id: slug,
      name: `${payload.metal} ${payload.category}s`,
      slug: slug,
      metal: payload.metal,
      category: payload.category,
      description: `Explore our beautiful collection of ${payload.metal} ${payload.category}s.`,
      items: [],
    };
    collections.push(targetCollection);
  }

  const newItem: CollectionItem = {
    id: payload.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
    name: payload.name,
    weight_g: payload.weight_g,
    making_charge_pct: payload.making_charge_pct,
    description: payload.description || "",
    image: payload.imageUrl || "",
  };

  targetCollection.items.push(newItem);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  } catch (e) {
    console.error("Failed to save to localStorage", e);
    throw new Error("Local storage quota exceeded or unavailable. Could not save product.");
  }
}

export function deleteMetal(name: string): void {
  const metals = getMetals();
  const updated = metals.filter(m => m.name.toLowerCase() !== name.toLowerCase());
  localStorage.setItem(METALS_KEY, JSON.stringify(updated));

  const collections = getCollections();
  const updatedCollections = collections.filter(c => c.metal.toLowerCase() !== name.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCollections));
}

export function updateMetal(oldName: string, metal: MetalData): void {
  const metals = getMetals();
  const index = metals.findIndex(m => m.name.toLowerCase() === oldName.toLowerCase());
  if (index !== -1) {
    metals[index] = metal;
    localStorage.setItem(METALS_KEY, JSON.stringify(metals));
  }

  if (oldName.toLowerCase() !== metal.name.toLowerCase()) {
    const collections = getCollections();
    let changed = false;
    collections.forEach(c => {
      if (c.metal.toLowerCase() === oldName.toLowerCase()) {
        c.metal = metal.name;
        c.slug = `${metal.name.toLowerCase()}-${c.category.toLowerCase()}s`;
        c.id = c.slug;
        c.name = `${metal.name} ${c.category}s`;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    }
  }
}

export function deleteCategory(name: string): void {
  const categories = getCategories();
  const updated = categories.filter(c => c.name.toLowerCase() !== name.toLowerCase());
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(updated));

  const collections = getCollections();
  const updatedCollections = collections.filter(c => c.category.toLowerCase() !== name.toLowerCase());
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCollections));
}

export function updateCategory(oldName: string, category: CategoryData): void {
  const categories = getCategories();
  const index = categories.findIndex(c => c.name.toLowerCase() === oldName.toLowerCase());
  if (index !== -1) {
    categories[index] = category;
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }

  if (oldName.toLowerCase() !== category.name.toLowerCase()) {
    const collections = getCollections();
    let changed = false;
    collections.forEach(c => {
      if (c.category.toLowerCase() === oldName.toLowerCase()) {
        c.category = category.name;
        c.slug = `${c.metal.toLowerCase()}-${category.name.toLowerCase()}s`;
        c.id = c.slug;
        c.name = `${c.metal} ${category.name}s`;
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
    }
  }
}

export function deleteProduct(productId: string): void {
  const collections = getCollections();
  let changed = false;
  collections.forEach(c => {
    const initialLen = c.items.length;
    c.items = c.items.filter(item => item.id !== productId);
    if (c.items.length !== initialLen) changed = true;
  });
  if (changed) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }
}

export function updateProduct(productId: string, payload: any): void {
  const collections = getCollections();
  let oldItem: CollectionItem | null = null;
  
  collections.forEach(c => {
    const index = c.items.findIndex(item => item.id === productId);
    if (index !== -1) {
      oldItem = c.items.splice(index, 1)[0];
    }
  });

  if (oldItem) {
    const updatedItem: CollectionItem = {
      id: productId,
      name: payload.name,
      weight_g: payload.weight_g,
      making_charge_pct: payload.making_charge_pct,
      description: payload.description || "",
      image: payload.imageUrl !== undefined ? payload.imageUrl : (oldItem as any).image,
    };

    const targetMetal = payload.metal.toLowerCase();
    const targetCategory = payload.category.toLowerCase();
    let targetCollection = collections.find(
      (c) => c.metal.toLowerCase() === targetMetal && c.category.toLowerCase() === targetCategory
    );

    if (!targetCollection) {
      const slug = `${targetMetal}-${targetCategory}s`;
      targetCollection = {
        id: slug,
        name: `${payload.metal} ${payload.category}s`,
        slug: slug,
        metal: payload.metal,
        category: payload.category,
        description: `Explore our beautiful collection of ${payload.metal} ${payload.category}s.`,
        items: [],
      };
      collections.push(targetCollection);
    }

    targetCollection.items.push(updatedItem);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }
}
