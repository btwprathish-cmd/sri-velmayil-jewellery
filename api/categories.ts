import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./lib/db.js";
import { parseBody, parseQueryParam } from "./lib/utils.js";
import { slugify } from "./lib/slug.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const metal = parseQueryParam(req.query.metal);
    const sql = `SELECT id, slug, name, metal, description, image, created_at, updated_at FROM categories${metal ? " WHERE metal = $1" : ""} ORDER BY name`;
    const result = await query(sql, metal ? [metal] : []);
    return res.json(result.rows);
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const name = String(body.name || "").trim();
    const metal = String(body.metal || "").trim();
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const slug = slugify(String(body.slug || name));

    if (!name || !metal || !description || !slug) {
      return res.status(400).json({ error: "name, metal, description, and slug are required." });
    }

    try {
      const result = await query(
        `INSERT INTO categories (slug, name, metal, description, image) VALUES ($1, $2, $3, $4, $5) RETURNING id, slug, name, metal, description, image, created_at, updated_at`,
        [slug, name, metal, description, image],
      );
      return res.status(201).json(result.rows[0]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create category.";
      return res.status(500).json({ error: message });
    }
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed" });
}
