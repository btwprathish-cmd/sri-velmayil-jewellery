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

  const { name, purityLabel, description, imageUrl } = req.body || {};
  const trimmedName = typeof name === "string" ? name.trim() : "";

  if (!trimmedName) {
    res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
    return;
  }

  const { data: existing, error: fetchError } = await supabase
    .from("metals")
    .select("name,image_url")
    .eq("name", trimmedName)
    .maybeSingle();

  if (fetchError) {
    res.status(500).json({ error: "Failed to verify existing collection", details: fetchError.message });
    return;
  }

  if (existing) {
    const { error: updateError } = await supabase
      .from("metals")
      .update({
        purity_label: purityLabel !== undefined ? purityLabel : existing.purity_label,
        description: description !== undefined ? description : existing.description,
        image_url: imageUrl !== undefined ? imageUrl : existing.image_url,
      })
      .eq("name", trimmedName);

    if (updateError) {
      res.status(500).json({ error: "Failed to update collection", details: updateError.message });
      return;
    }

    res.status(200).json({ success: true, message: "Collection updated successfully" });
    return;
  }

  const { error: insertError } = await supabase.from("metals").insert([{ 
    name: trimmedName,
    purity_label: purityLabel || "",
    description: description || "",
    image_url: imageUrl || ""
  }]);

  if (insertError) {
    res.status(500).json({ error: "Failed to create collection", details: insertError.message });
    return;
  }

  res.status(201).json({ success: true, message: "Collection created successfully" });
}
