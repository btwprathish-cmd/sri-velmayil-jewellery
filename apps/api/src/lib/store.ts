import fs from 'fs/promises';
import path from 'path';

export interface Metal {
  name: string;
  purity_label: string;
  description: string;
  image_url: string;
  created_at?: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  created_at?: string;
}

export interface CategoryMetal {
  category_id: string;
  metal_name: string;
}

export interface Product {
  id: string;
  name: string;
  metal: string;
  category: string;
  weight_g: string;
  making_charge_pct: string;
  description: string;
  image: string;
  created_at?: string;
  updated_at?: string;
}

interface StoreData {
  metals: Metal[];
  categories: Category[];
  category_metals: CategoryMetal[];
  products: Product[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

let storeData: StoreData | null = null;

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (err) {
    // Ignore if exists
  }
}

async function loadStore(): Promise<StoreData> {
  if (storeData) return storeData;
  await ensureDataDir();
  try {
    const data = await fs.readFile(STORE_FILE, 'utf-8');
    storeData = JSON.parse(data);
  } catch (err) {
    storeData = {
      metals: [],
      categories: [],
      category_metals: [],
      products: []
    };
    await saveStore();
  }
  return storeData as StoreData;
}

async function saveStore() {
  if (!storeData) return;
  await ensureDataDir();
  await fs.writeFile(STORE_FILE, JSON.stringify(storeData, null, 2));
}

export const store = {
  async getMetals(): Promise<Metal[]> {
    const data = await loadStore();
    return data.metals;
  },
  async getMetal(name: string): Promise<Metal | undefined> {
    const data = await loadStore();
    return data.metals.find(m => m.name.toLowerCase() === name.toLowerCase());
  },
  async insertMetal(metal: Metal): Promise<void> {
    const data = await loadStore();
    if (!metal.created_at) metal.created_at = new Date().toISOString();
    data.metals.push(metal);
    await saveStore();
  },
  async updateMetal(name: string, updates: Partial<Metal>): Promise<void> {
    const data = await loadStore();
    const index = data.metals.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
    if (index !== -1) {
      data.metals[index] = { ...data.metals[index], ...updates };
      await saveStore();
    }
  },
  async deleteMetal(name: string): Promise<void> {
    const data = await loadStore();
    data.metals = data.metals.filter(m => m.name.toLowerCase() !== name.toLowerCase());
    // Also delete cascade mapping
    data.category_metals = data.category_metals.filter(cm => cm.metal_name.toLowerCase() !== name.toLowerCase());
    await saveStore();
  },

  async getCategories(): Promise<Category[]> {
    const data = await loadStore();
    return data.categories;
  },
  async getCategory(idOrName: string): Promise<Category | undefined> {
    const data = await loadStore();
    return data.categories.find(c => c.id === idOrName || c.name.toLowerCase() === idOrName.toLowerCase());
  },
  async insertCategory(category: Category): Promise<Category> {
    const data = await loadStore();
    if (!category.id) category.id = Date.now().toString() + Math.random().toString(36).substring(2, 9);
    if (!category.created_at) category.created_at = new Date().toISOString();
    data.categories.push(category);
    await saveStore();
    return category;
  },
  async updateCategory(id: string, updates: Partial<Category>): Promise<void> {
    const data = await loadStore();
    const index = data.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      data.categories[index] = { ...data.categories[index], ...updates };
      await saveStore();
    }
  },
  async deleteCategory(name: string): Promise<void> {
    const data = await loadStore();
    const cat = data.categories.find(c => c.name.toLowerCase() === name.toLowerCase());
    if (cat) {
      data.categories = data.categories.filter(c => c.id !== cat.id);
      data.category_metals = data.category_metals.filter(cm => cm.category_id !== cat.id);
      await saveStore();
    }
  },

  async getCategoryMetals(): Promise<CategoryMetal[]> {
    const data = await loadStore();
    return data.category_metals;
  },
  async clearCategoryMetals(categoryId: string): Promise<void> {
    const data = await loadStore();
    data.category_metals = data.category_metals.filter(cm => cm.category_id !== categoryId);
    await saveStore();
  },
  async insertCategoryMetals(mappings: CategoryMetal[]): Promise<void> {
    const data = await loadStore();
    data.category_metals.push(...mappings);
    await saveStore();
  },

  async getProducts(): Promise<Product[]> {
    const data = await loadStore();
    return data.products;
  },
  async getProduct(id: string): Promise<Product | undefined> {
    const data = await loadStore();
    return data.products.find(p => p.id === id);
  },
  async insertProduct(product: Product): Promise<void> {
    const data = await loadStore();
    if (!product.created_at) product.created_at = new Date().toISOString();
    data.products.push(product);
    await saveStore();
  },
  async updateProduct(id: string, updates: Partial<Product>): Promise<void> {
    const data = await loadStore();
    const index = data.products.findIndex(p => p.id === id);
    if (index !== -1) {
      data.products[index] = { ...data.products[index], ...updates, updated_at: new Date().toISOString() };
      await saveStore();
    }
  },
  async deleteProduct(id: string): Promise<void> {
    const data = await loadStore();
    data.products = data.products.filter(p => p.id !== id);
    await saveStore();
  }
};
