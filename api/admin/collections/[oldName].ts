import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../../../lib/admin";
import { supabase } from "../../../lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!requireAdmin(req, res)) return;

  if (req.method === "PUT") {
    const oldName = req.query.oldName as string;
    const { name, purityLabel, description, imageUrl } = req.body || {};
    const trimmedName = typeof name === "string" ? name.trim() : "";

    if (!trimmedName) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    const { data: existing, error: fetchError } = await supabase
      .from("metals")
      .select("*")
      .eq("name", oldName)
      .maybeSingle();

    if (fetchError) {
      res.status(500).json({ error: "Failed to verify existing collection", details: fetchError.message });
      return;
    }

    if (!existing) {
      res.status(404).json({ error: `Collection ${oldName} not found` });
      return;
    }

    const { error: updateError } = await supabase
      .from("metals")
      .update({
        name: trimmedName,
        purity_label: purityLabel !== undefined ? purityLabel : existing.purity_label,
        description: description !== undefined ? description : existing.description,
        image_url: imageUrl !== undefined ? imageUrl : existing.image_url,
      })
      .eq("name", oldName);

    if (updateError) {
      res.status(500).json({ error: "Failed to update collection", details: updateError.message });
      return;
    }

    res.json({ success: true, message: "Collection updated successfully" });
    return;
  }

  if (req.method === "DELETE") {
    const oldName = req.query.oldName as string;
    const { error } = await supabase.from("metals").delete().eq("name", oldName);
    if (error) {
      res.status(500).json({ error: "Failed to delete collection", details: error.message });
      return;
    }
    res.json({ success: true, message: "Collection deleted successfully" });
    return;
  }

  res.status(405).json({ error: "Method not allowed" });
}
