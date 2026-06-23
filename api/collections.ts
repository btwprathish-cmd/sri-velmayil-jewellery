import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./lib/db.js";
import { parseBody, parseQueryParam } from "./lib/utils.js";
import { slugify } from "./lib/slug.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const metal = parseQueryParam(req.query.metal);
    const category = parseQueryParam(req.query.category);

    const conditions: string[] = [];
    const values: unknown[] = [];

    if (metal) {
      values.push(metal);
      conditions.push(`c.metal = $${values.length}`);
    }
    if (category) {
      values.push(category);
      conditions.push(`c.category = $${values.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const sql = `SELECT c.id, c.slug, c.name, c.metal, c.category, c.description, c.image, COALESCE(count(p.id), 0) AS product_count FROM collections c LEFT JOIN products p ON p.collection_id = c.id ${where} GROUP BY c.id ORDER BY c.name`;
    const result = await query(sql, values);
    return res.json(result.rows);
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const name = String(body.name || "").trim();
    const metal = String(body.metal || "").trim();
    const category = String(body.category || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const slug = slugify(String(body.slug || name));

    if (!name || !metal || !category || !description || !slug) {
      return res.status(400).json({ error: "name, metal, category, description, and slug are required." });
    }

    try {
      const result = await query(
        `INSERT INTO collections (slug, name, metal, category, description, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, slug, name, metal, category, description, image, created_at, updated_at`,
        [slug, name, metal, category, description, image],
      );
      return res.status(201).json(result.rows[0]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create collection.";
      return res.status(500).json({ error: message });
    }
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed" });
}
