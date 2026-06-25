import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../../lib/admin";
import { supabase } from "../../../lib/supabase";

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

  if (!requireAdmin(req, res)) return;

  const oldName = req.query.oldName as string;
  if (req.method === "PUT") {
    const { name, description, metals } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : "";
    const metalList = normalizeMetals(metals);

    if (!trimmedName) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from("categories")
      .select("*")
      .eq("name", oldName)
      .maybeSingle();

    if (fetchError) {
      res.status(500).json({ error: "Failed to verify category", details: fetchError.message });
      return;
    }

    if (!existing) {
      res.status(404).json({ error: `Category ${oldName} not found` });
      return;
    }

    const { error: updateError } = await supabase
      .from("categories")
      .update({
        name: trimmedName,
        description: description !== undefined ? description : existing.description,
      })
      .eq("name", oldName);

    if (updateError) {
      res.status(500).json({ error: "Failed to update category", details: updateError.message });
      return;
    }

    const categoryId = existing.id;
    const { error: deleteError } = await supabase.from("category_metals").delete().eq("category_id", categoryId);
    if (deleteError) {
      res.status(500).json({ error: "Failed to reset category mappings", details: deleteError.message });
      return;
    }

    if (metalList.length > 0) {
      const { error: insertError } = await supabase.from("category_metals").insert(
        metalList.map((metal) => ({ category_id: categoryId, metal_name: metal }))
      );
      if (insertError) {
        res.status(500).json({ error: "Failed to save category metals", details: insertError.message });
        return;
      }
    }

    res.json({ success: true, message: "Category updated successfully" });
    return;
  }

  if (req.method === "DELETE") {
    const { data: existing, error: fetchError } = await supabase
      .from("categories")
      .select("id")
      .eq("name", oldName)
      .maybeSingle();

    if (fetchError) {
      res.status(500).json({ error: "Failed to verify category", details: fetchError.message });
      return;
    }
    if (!existing) {
      res.status(404).json({ error: `Category ${oldName} not found` });
      return;
    }

    const { error: deleteError } = await supabase.from("categories").delete().eq("id", existing.id);
    if (deleteError) {
      res.status(500).json({ error: "Failed to delete category", details: deleteError.message });
      return;
    }

    res.json({ success: true, message: "Category deleted successfully" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
