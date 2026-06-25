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

  const { data, error } = await supabase
    .from("metals")
    .select("name,purity_label,description,image_url")
    .order("created_at", { ascending: true });

  if (error) {
    res.status(500).json({ error: "Failed to fetch metals", details: error.message });
    return;
  }

  res.json(
    (data || []).map((metal) => ({
      name: metal.name,
      purityLabel: metal.purity_label,
      description: metal.description,
      imageUrl: metal.image_url,
    }))
  );
}
