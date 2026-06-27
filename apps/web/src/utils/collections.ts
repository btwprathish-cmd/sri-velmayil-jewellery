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

async function fetchApi(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return res.json().catch(() => null);
}

export async function getMetals(): Promise<MetalData[]> {
  try {
    const data = await fetchApi("/api/metals");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Failed to fetch metals:", error);
    return [];
  }
}

export async function addMetal(metal: MetalData): Promise<void> {
  await fetchApi("/api/admin/collections", {
    method: "POST",
    body: JSON.stringify(metal),
  });
}

export async function updateMetal(oldName: string, metal: MetalData): Promise<void> {
  await fetchApi(`/api/admin/collections/${encodeURIComponent(oldName)}`, {
    method: "PUT",
    body: JSON.stringify(metal),
  });
}

export async function deleteMetal(name: string): Promise<void> {
  await fetchApi(`/api/admin/collections/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

export async function getCategories(): Promise<CategoryData[]> {
  try {
    const data = await fetchApi("/api/categories");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function addCategory(category: CategoryData): Promise<void> {
  await fetchApi("/api/admin/categories", {
    method: "POST",
    body: JSON.stringify(category),
  });
}

export async function updateCategory(oldName: string, category: CategoryData): Promise<void> {
  await fetchApi(`/api/admin/categories/${encodeURIComponent(oldName)}`, {
    method: "PUT",
    body: JSON.stringify(category),
  });
}

export async function deleteCategory(name: string): Promise<void> {
  await fetchApi(`/api/admin/categories/${encodeURIComponent(name)}`, {
    method: "DELETE",
  });
}

export async function getCollections(): Promise<CollectionBlock[]> {
  try {
    const data = await fetchApi("/api/collections");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching collections:", error);
    return [];
  }
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
  await fetchApi("/api/admin/products", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(productId: string): Promise<void> {
  await fetchApi(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: "DELETE",
  });
}

export async function updateProduct(productId: string, payload: Partial<CollectionItem>): Promise<void> {
  await fetchApi(`/api/admin/products/${encodeURIComponent(productId)}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
