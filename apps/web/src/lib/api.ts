export async function fetchCollections(params: { metal?: string; category?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.metal) qs.set("metal", params.metal);
  if (params.category) qs.set("category", params.category);
  const res = await fetch(`/api/collections?${qs.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch collections: ${res.status}`);
  return res.json();
}

export async function fetchCollectionBySlug(slug: string) {
  const res = await fetch(`/api/collections/${encodeURIComponent(slug)}`);
  if (!res.ok) throw new Error(`Failed to fetch collection: ${res.status}`);
  return res.json();
}

export async function fetchProducts(params: { metal?: string; category?: string; collection_slug?: string } = {}) {
  const qs = new URLSearchParams();
  if (params.metal) qs.set("metal", params.metal);
  if (params.category) qs.set("category", params.category);
  if (params.collection_slug) qs.set("collection_slug", params.collection_slug);
  const res = await fetch(`/api/products?${qs.toString()}`);
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  return res.json();
}

export async function createProduct(payload: Record<string, unknown>) {
  const res = await fetch(`/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to create product: ${res.status}`);
  }
  return res.json();
}

export async function createCategory(payload: Record<string, unknown>) {
  const res = await fetch(`/api/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to create category: ${res.status}`);
  }
  return res.json();
}

export async function createCollection(payload: Record<string, unknown>) {
  const res = await fetch(`/api/collections`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error || `Failed to create collection: ${res.status}`);
  }
  return res.json();
}
