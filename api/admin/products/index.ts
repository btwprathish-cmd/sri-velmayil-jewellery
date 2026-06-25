import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/admin";
import { supabase } from "../../lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdmin(req, res)) return;

  const { name, metal, category, weight_g, making_charge_pct, description, imageUrl } = req.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const trimmedMetal = typeof metal === "string" ? metal.trim() : "";
  const trimmedCategory = typeof category === "string" ? category.trim() : "";
  const parsedWeight = parseFloat(weight_g);
  const parsedMaking = parseFloat(making_charge_pct);

  if (!trimmedName || !trimmedMetal || !trimmedCategory || Number.isNaN(parsedWeight) || Number.isNaN(parsedMaking)) {
    res.status(400).json({ error: "Missing required fields for product. Please check name, metal, category, weight, and making charge." });
    return;
  }

  const id = `${trimmedName.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const { error } = await supabase.from("products").insert([{ 
    id,
    name: trimmedName,
    metal: trimmedMetal,
    category: trimmedCategory,
    weight_g: parsedWeight,
    making_charge_pct: parsedMaking,
    description: typeof description === "string" ? description : "",
    image: typeof imageUrl === "string" ? imageUrl : ""
  }]);

  if (error) {
    res.status(500).json({ error: "Failed to create product", details: error.message });
    return;
  }

  res.status(201).json({ success: true, message: "Product created successfully", id });
}
