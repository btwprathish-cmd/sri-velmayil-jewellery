import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../lib/admin";
import { supabase } from "../../lib/supabase";

function normalizeMetals(metals: any): string[] {
  if (Array.isArray(metals)) return metals.filter((item) => typeof item === "string").map((item) => item.trim()).filter(Boolean);
  if (typeof metals === "string") return metals.split(",").map((item) => item.trim()).filter(Boolean);
  return [];
}

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

  const { name, description, metals } = req.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";
  const metalList = normalizeMetals(metals);

  if (!trimmedName) {
    res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
    return;
  }

  const { data: existing, error: existingError } = await supabase
    .from("categories")
    .select("id")
    .eq("name", trimmedName)
    .maybeSingle();

  if (existingError) {
    res.status(500).json({ error: "Failed to verify existing category", details: existingError.message });
    return;
  }

  let categoryId: string | undefined;

  if (existing) {
    categoryId = existing.id;
    const { error: updateError } = await supabase
      .from("categories")
      .update({ description: description || "" })
      .eq("id", categoryId);

    if (updateError) {
      res.status(500).json({ error: "Failed to update category", details: updateError.message });
      return;
    }
  } else {
    const { data: insertData, error: insertError } = await supabase
      .from("categories")
      .insert([{ name: trimmedName, description: description || "" }])
      .select("id")
      .single();

    if (insertError || !insertData) {
      res.status(500).json({ error: "Failed to create category", details: insertError?.message });
      return;
    }

    categoryId = insertData.id;
  }

  const { error: deleteMappingsError } = await supabase
    .from("category_metals")
    .delete()
    .eq("category_id", categoryId);

  if (deleteMappingsError) {
    res.status(500).json({ error: "Failed to reset category mappings", details: deleteMappingsError.message });
    return;
  }

  if (metalList.length > 0) {
    const mappings = metalList.map((metal) => ({ category_id: categoryId, metal_name: metal }));
    const { error: insertMappingsError } = await supabase.from("category_metals").insert(mappings);
    if (insertMappingsError) {
      res.status(500).json({ error: "Failed to save category metals", details: insertMappingsError.message });
      return;
    }
  }

  res.status(existing ? 200 : 201).json({ success: true, message: "Category saved successfully" });
}
