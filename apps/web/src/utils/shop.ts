export type CategoryRecord = {
  id: number;
  slug: string;
  name: string;
  metal: "Gold" | "Silver";
  description: string;
  image: string;
};

export type CollectionRecord = {
  id: number;
  slug: string;
  name: string;
  metal: "Gold" | "Silver";
  category: string;
  description: string;
  image: string;
  product_count: number;
};

export type ProductRecord = {
  id: number;
  slug: string;
  name: string;
  weight_g: number;
  making_charge_pct: number;
  description: string;
  image: string;
  collection: {
    id: number;
    slug: string;
    name: string;
    metal: "Gold" | "Silver";
    category: string;
    description: string;
    image: string;
  };
};

function parseQueryParams(params: Record<string, string | undefined>) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  return search.toString() ? `?${search.toString()}` : "";
}

async function apiFetch<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(path, { ...opts, headers: { "Content-Type": "application/json", ...(opts?.headers ?? {}) } });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchCategories(metal?: string): Promise<CategoryRecord[]> {
  const query = parseQueryParams({ metal });
  return apiFetch<CategoryRecord[]>(`/api/categories${query}`);
}

export async function fetchCollections(metal?: string, category?: string): Promise<CollectionRecord[]> {
  const query = parseQueryParams({ metal, category });
  return apiFetch<CollectionRecord[]>(`/api/collections${query}`);
}

export async function fetchCollectionBySlug(slug: string): Promise<CollectionRecord & { products: ProductRecord[] }> {
  return apiFetch<CollectionRecord & { products: ProductRecord[] }>(`/api/collections/${encodeURIComponent(slug)}`);
}

export async function fetchProducts(params?: { metal?: string; category?: string; collection_slug?: string }): Promise<ProductRecord[]> {
  const query = parseQueryParams({ metal: params?.metal, category: params?.category, collection_slug: params?.collection_slug });
  return apiFetch<ProductRecord[]>(`/api/products${query}`);
}

export async function createCategory(payload: Omit<CategoryRecord, "id">): Promise<CategoryRecord> {
  return apiFetch<CategoryRecord>("/api/categories", { method: "POST", body: JSON.stringify(payload) });
}

export async function createCollection(payload: Omit<CollectionRecord, "id" | "product_count">): Promise<CollectionRecord> {
  return apiFetch<CollectionRecord>("/api/collections", { method: "POST", body: JSON.stringify(payload) });
}

export async function createProduct(payload: Omit<ProductRecord, "id" | "collection"> & { collection_slug: string }): Promise<ProductRecord> {
  return apiFetch<ProductRecord>("/api/products", { method: "POST", body: JSON.stringify(payload) });
}
