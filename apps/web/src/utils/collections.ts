import collectionsData from "@/data/collections.json";

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

const DEFAULT_METALS = ["Gold", "Silver"];
const DEFAULT_CATEGORIES = ["Coin", "Ring", "Chain", "Earring", "Bracelet", "Anklet"];

export function getMetals(): string[] {
  try {
    const stored = localStorage.getItem(METALS_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [...DEFAULT_METALS];
}

export function addMetal(metal: string): void {
  const metals = getMetals();
  const trimmed = metal.trim();
  if (trimmed && !metals.map(m => m.toLowerCase()).includes(trimmed.toLowerCase())) {
    metals.push(trimmed);
    localStorage.setItem(METALS_KEY, JSON.stringify(metals));
  }
}

export function getCategories(): string[] {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return [...DEFAULT_CATEGORIES];
}

export function addCategory(category: string): void {
  const categories = getCategories();
  const trimmed = category.trim();
  if (trimmed && !categories.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
    categories.push(trimmed);
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
