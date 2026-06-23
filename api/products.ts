import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "./lib/db.js";
import { parseBody, parseQueryParam } from "./lib/utils.js";
import { slugify } from "./lib/slug.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    const metal = parseQueryParam(req.query.metal);
    const category = parseQueryParam(req.query.category);
    const collectionSlug = parseQueryParam(req.query.collection_slug);

    const filters: string[] = [];
    const values: unknown[] = [];

    if (metal) {
      values.push(metal);
      filters.push(`c.metal = $${values.length}`);
    }
    if (category) {
      values.push(category);
      filters.push(`c.category = $${values.length}`);
    }
    if (collectionSlug) {
      values.push(collectionSlug);
      filters.push(`c.slug = $${values.length}`);
    }

    const where = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";
    const sql = `SELECT p.id, p.slug, p.name, p.weight_g::float AS weight_g, p.making_charge_pct::float AS making_charge_pct, p.description, p.image, c.id AS collection_id, c.slug AS collection_slug, c.name AS collection_name, c.metal AS collection_metal, c.category AS collection_category, c.description AS collection_description, c.image AS collection_image FROM products p JOIN collections c ON c.id = p.collection_id ${where} ORDER BY p.id`;
    const result = await query(sql, values);
    return res.json(result.rows.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      weight_g: Number(row.weight_g),
      making_charge_pct: Number(row.making_charge_pct),
      description: row.description,
      image: row.image,
      collection: {
        id: row.collection_id,
        slug: row.collection_slug,
        name: row.collection_name,
        metal: row.collection_metal,
        category: row.collection_category,
        description: row.collection_description,
        image: row.collection_image,
      },
    })));
  }

  if (req.method === "POST") {
    const body = parseBody(req);
    const name = String(body.name || "").trim();
    const weight_g = Number(body.weight_g);
    const making_charge_pct = Number(body.making_charge_pct);
    const description = String(body.description || "").trim();
    const image = String(body.image || "").trim();
    const slug = slugify(String(body.slug || name));
    const collectionSlug = String(body.collection_slug || "").trim();

    if (!name || !collectionSlug || !description || !slug || Number.isNaN(weight_g) || Number.isNaN(making_charge_pct)) {
      return res.status(400).json({ error: "name, collection_slug, weight_g, making_charge_pct, description, and slug are required." });
    }

    const collectionResult = await query(
      `SELECT id, slug, name, metal, category, description, image FROM collections WHERE slug = $1`,
      [collectionSlug],
    );

    if (collectionResult.rows.length === 0) {
      return res.status(404).json({ error: "Collection not found." });
    }

    const collection = collectionResult.rows[0];

    try {
      const insertResult = await query(
        `INSERT INTO products (slug, collection_id, name, weight_g, making_charge_pct, description, image) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, slug, name, weight_g::float AS weight_g, making_charge_pct::float AS making_charge_pct, description, image, created_at, updated_at`,
        [slug, collection.id, name, weight_g, making_charge_pct, description, image],
      );
      const product = insertResult.rows[0];
      return res.status(201).json({
        ...product,
        collection: {
          id: collection.id,
          slug: collection.slug,
          name: collection.name,
          metal: collection.metal,
          category: collection.category,
          description: collection.description,
          image: collection.image,
        },
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to create product.";
      return res.status(500).json({ error: message });
    }
  }

  res.setHeader("Allow", "GET,POST");
  return res.status(405).json({ error: "Method not allowed" });
}
