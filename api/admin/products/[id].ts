import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../../lib/admin";
import { supabase } from "../../../lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!requireAdmin(req, res)) return;

  const id = req.query.id as string;

  if (req.method === "PUT") {
    const { name, metal, category, weight_g, making_charge_pct, description, imageUrl } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : undefined;
    const trimmedMetal = typeof metal === "string" ? metal.trim() : undefined;
    const trimmedCategory = typeof category === "string" ? category.trim() : undefined;
    const parsedWeight = typeof weight_g === "number" ? weight_g : parseFloat(weight_g);
    const parsedMaking = typeof making_charge_pct === "number" ? making_charge_pct : parseFloat(making_charge_pct);

    const { data: existing, error: existingError } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    if (existingError) {
      res.status(500).json({ error: "Failed to verify existing product", details: existingError.message });
      return;
    }
    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    const updates: any = {};
    if (trimmedName) updates.name = trimmedName;
    if (trimmedMetal) updates.metal = trimmedMetal;
    if (trimmedCategory) updates.category = trimmedCategory;
    if (!Number.isNaN(parsedWeight)) updates.weight_g = parsedWeight;
    if (!Number.isNaN(parsedMaking)) updates.making_charge_pct = parsedMaking;
    if (description !== undefined) updates.description = description;
    if (imageUrl !== undefined) updates.image = imageUrl;

    const { error: updateError } = await supabase.from("products").update(updates).eq("id", id);
    if (updateError) {
      res.status(500).json({ error: "Failed to update product", details: updateError.message });
      return;
    }

    res.json({ success: true, message: "Product updated successfully" });
    return;
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      res.status(500).json({ error: "Failed to delete product", details: error.message });
      return;
    }

    res.json({ success: true, message: "Product deleted successfully" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
