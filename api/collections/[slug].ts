import type { VercelRequest, VercelResponse } from "@vercel/node";
import { query } from "../lib/db.js";
import { parseQueryParam } from "../lib/utils.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const slug = parseQueryParam(req.query.slug ?? req.query["slug"]);
  const collectionSlug = slug || (Array.isArray(req.query.slug) ? req.query.slug[0] : undefined) || req.query?.slug?.toString();
  const actualSlug = typeof collectionSlug === "string" ? collectionSlug : undefined;

  if (!actualSlug) {
    return res.status(400).json({ error: "Collection slug is required." });
  }

  const collectionResult = await query(
    `SELECT id, slug, name, metal, category, description, image, created_at, updated_at FROM collections WHERE slug = $1`,
    [actualSlug],
  );

  if (collectionResult.rows.length === 0) {
    return res.status(404).json({ error: "Collection not found." });
  }

  const collection = collectionResult.rows[0];
  const productsResult = await query(
    `SELECT id, slug, name, weight_g::float AS weight_g, making_charge_pct::float AS making_charge_pct, description, image, created_at, updated_at FROM products WHERE collection_id = $1 ORDER BY id`,
    [collection.id],
  );

  return res.json({
    ...collection,
    products: productsResult.rows,
  });
}
