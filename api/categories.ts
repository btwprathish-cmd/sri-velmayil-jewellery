import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "./lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "GET") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const [categoriesResult, mappingsResult] = await Promise.all([
    supabase.from("categories").select("id,name,description").order("created_at", { ascending: true }),
    supabase.from("category_metals").select("category_id,metal_name"),
  ]);

  if (categoriesResult.error || mappingsResult.error) {
    const details = categoriesResult.error?.message || mappingsResult.error?.message;
    res.status(500).json({ error: "Failed to fetch categories", details });
    return;
  }

  const mappingsByCategory = (mappingsResult.data || []).reduce<Record<string, string[]>>(
    (acc, row) => {
      if (!acc[row.category_id]) acc[row.category_id] = [];
      acc[row.category_id].push(row.metal_name);
      return acc;
    },
    {}
  );

  res.json(
    (categoriesResult.data || []).map((category) => ({
      name: category.name,
      description: category.description,
      metals: mappingsByCategory[category.id] || [],
    }))
  );
}
