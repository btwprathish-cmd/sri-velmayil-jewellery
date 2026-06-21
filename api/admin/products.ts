import { VercelRequest, VercelResponse } from "@vercel/node";
import * as fs from "fs";
import * as path from "path";

// Note: In a real Vercel production environment, the file system is read-only except for /tmp.
// Since this is a Vite app using a local JSON file for data, this endpoint is intended
// primarily for local development/demonstration of the admin flow.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const product = req.body;
    
    // Basic validation
    if (!product || !product.metal || !product.category || !product.name || !product.weight_g) {
      return res.status(400).json({ error: "Missing required product fields" });
    }

    // Path to collections.json
    const dataPath = path.join(process.cwd(), "apps", "web", "src", "data", "collections.json");
    
    if (!fs.existsSync(dataPath)) {
      return res.status(500).json({ error: "collections.json not found at " + dataPath });
    }

    const fileContent = fs.readFileSync(dataPath, "utf-8");
    const collections = JSON.parse(fileContent);

    // Find the matching collection
    const targetMetal = product.metal.toLowerCase();
    const targetCategory = product.category.toLowerCase();
    
    let targetCollection = collections.find(
      (c: any) => c.metal.toLowerCase() === targetMetal && c.category.toLowerCase() === targetCategory
    );

    if (!targetCollection) {
      // Create new collection entry if it doesn't exist
      const slug = `${targetMetal}-${targetCategory}s`;
      targetCollection = {
        id: slug,
        name: `${product.metal} ${product.category}s`,
        slug: slug,
        metal: product.metal,
        category: product.category,
        description: `Explore our beautiful collection of ${product.metal} ${product.category}s.`,
        items: []
      };
      collections.push(targetCollection);
    }

    // Construct the new item
    const newItem = {
      id: product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now(),
      name: product.name,
      weight_g: parseFloat(product.weight_g),
      making_charge_pct: parseFloat(product.making_charge_pct),
      description: product.description || "",
      image: product.imageUrl || ""
    };

    targetCollection.items.push(newItem);

    // Write back to collections.json
    fs.writeFileSync(dataPath, JSON.stringify(collections, null, 2), "utf-8");

    return res.status(200).json({ success: true, item: newItem });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({ error: "Failed to create product", details: error.message });
  }
}
