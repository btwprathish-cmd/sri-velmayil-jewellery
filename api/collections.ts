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

  const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: true });
  if (error) {
    res.status(500).json({ error: "Failed to fetch collections", details: error.message });
    return;
  }

  const grouped: Record<string, any> = {};

  for (const product of data || []) {
    const metal = product.metal || "";
    const category = product.category || "";
    const key = `${metal}:${category}`;
    if (!grouped[key]) {
      const slug = `${metal.toLowerCase()}-${category.toLowerCase()}s`;
      grouped[key] = {
        id: slug,
        name: `${metal} ${category}s`,
        slug,
        metal,
        category,
        description: `Explore our beautiful collection of ${metal} ${category}s.`,
        items: [],
      };
    }

    grouped[key].items.push({
      id: product.id,
      name: product.name,
      weight_g: Number(product.weight_g),
      making_charge_pct: Number(product.making_charge_pct),
      description: product.description || "",
      image: product.image || "",
    });
  }

  res.json(Object.values(grouped));
}
