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
