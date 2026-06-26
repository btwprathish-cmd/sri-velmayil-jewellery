import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "@workspace/db";
import { metalsTable, categoriesTable, categoryMetalsTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { verifySessionToken, SESSION_COOKIE } from "../lib/auth.js";
import { supabase } from "../lib/supabase.js";

const router = Router();

// Configure storage path for multer
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

const BUCKET = "jewellery-images";

async function uploadToSupabase(file: Express.Multer.File, subDir: string): Promise<string> {
  const fileExt = path.extname(file.originalname) || ".png";
  const cleanBase = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const safeName = `${Date.now()}-${cleanBase}${fileExt}`;
  const key = `${subDir}/${safeName}`;

  const { data, error } = await supabase.storage.from(BUCKET).upload(key, file.buffer, {
    contentType: file.mimetype,
    upsert: false,
  });

  if (error) {
    throw new Error(`Supabase upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return urlData.publicUrl;
}

// Multer error handling wrapper
function handleUpload(fieldName: string) {
  const uploadMiddleware = upload.single(fieldName);
  return (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === "LIMIT_FILE_SIZE") {
            res.status(400).json({ error: "File too large. Maximum allowed size is 5MB." });
            return;
          }
          res.status(400).json({ error: `Upload failed: ${err.message}` });
          return;
        }
        res.status(400).json({ error: err.message });
        return;
      }
      next();
    });
  };
}

// Session check middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized. Admin session is required." });
    return;
  }
  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized. Session is invalid or expired." });
    return;
  }
  next();
}

// --- PUBLIC READ ENDPOINTS ---

// GET /api/metals
router.get("/metals", async (req: Request, res: Response) => {
  try {
    const data = await db.select().from(metalsTable).orderBy(metalsTable.createdAt);
    const mapped = data.map(m => ({
      name: m.name,
      purityLabel: m.purityLabel,
      description: m.description,
      imageUrl: m.imageUrl
    }));
    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch metals", details: error.message });
  }
});

// GET /api/categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const cats = await db.select().from(categoriesTable).orderBy(categoriesTable.createdAt);
    const catMetals = await db.select().from(categoryMetalsTable);
    const mapped = cats.map(c => {
      const metals = catMetals.filter(cm => cm.categoryId === c.id).map(cm => cm.metalName);
      return {
        name: c.name,
        description: c.description,
        metals
      };
    });
    res.json(mapped);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch categories", details: error.message });
  }
});

// GET /api/collections (returns grouped products)
router.get("/collections", async (req: Request, res: Response) => {
  try {
    const products = await db.select().from(productsTable).orderBy(productsTable.createdAt);
    const grouped: Record<string, any> = {};
    
    for (const p of products) {
      const key = `${p.metal}-${p.category}`;
      if (!grouped[key]) {
        const slug = `${p.metal.toLowerCase()}-${p.category.toLowerCase()}s`;
        grouped[key] = {
          id: slug,
          name: `${p.metal} ${p.category}s`,
          slug: slug,
          metal: p.metal,
          category: p.category,
          description: `Explore our beautiful collection of ${p.metal} ${p.category}s.`,
          items: []
        };
      }
      grouped[key].items.push({
        id: p.id,
        name: p.name,
        weight_g: parseFloat(p.weightG),
        making_charge_pct: parseFloat(p.makingChargePct),
        description: p.description || "",
        image: p.image || ""
      });
    }
    
    res.json(Object.values(grouped));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch collections", details: error.message });
  }
});

// POST /api/admin/upload (Generic upload endpoint)
router.post("/admin/upload", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  let subDir = "products";
  const type = req.query.type as string | undefined;
  if (type === "collection" || type === "metal") {
    subDir = "collections";
  } else if (type === "category") {
    subDir = "categories";
  }

  try {
    const imageUrl = await uploadToSupabase(req.file, subDir);
    res.status(200).json({ success: true, imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- ADMIN WRITE ENDPOINTS (SECURED) ---

// POST /api/admin/collections (Adds / Updates a Metal)
router.post("/admin/collections", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  try {
    const name = req.body.name as string | undefined;
    const description = req.body.description as string | undefined;
    const purityLabel = req.body.purityLabel as string | undefined;

    if (!name || !name.trim()) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    let imageUrl = req.body.imageUrl || "";
    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, "collections");
    }

    const trimmedName = name.trim();
    const existing = await db.select().from(metalsTable).where(eq(metalsTable.name, trimmedName));
    
    if (existing.length > 0) {
      await db.update(metalsTable).set({
        description: description || existing[0].description,
        purityLabel: purityLabel || existing[0].purityLabel,
        imageUrl: imageUrl || existing[0].imageUrl
      }).where(eq(metalsTable.name, trimmedName));
      res.status(200).json({ success: true, message: "Metal updated successfully" });
      return;
    } else {
      await db.insert(metalsTable).values({
        name: trimmedName,
        description: description || "",
        purityLabel: purityLabel || "",
        imageUrl: imageUrl
      });
      res.status(201).json({ success: true, message: "Metal created successfully" });
      return;
    }
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save metal", details: error.message });
  }
});

// PUT /api/admin/collections/:oldName (Updates a Metal by old name)
router.put("/admin/collections/:oldName", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  try {
    const oldName = req.params.oldName as string;
    const name = req.body.name as string | undefined;
    const description = req.body.description as string | undefined;
    const purityLabel = req.body.purityLabel as string | undefined;
    
    if (!name || !name.trim()) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    let imageUrl = req.body.imageUrl;
    if (req.file) {
      imageUrl = await uploadToSupabase(req.file, "collections");
    }

    const existing = await db.select().from(metalsTable).where(eq(metalsTable.name, oldName));
    if (existing.length === 0) {
      res.status(404).json({ error: `Metal ${oldName} not found` });
      return;
    }

    await db.update(metalsTable).set({
      name: name.trim(),
      description: description !== undefined ? description : existing[0].description,
      purityLabel: purityLabel !== undefined ? purityLabel : existing[0].purityLabel,
      imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl
    }).where(eq(metalsTable.name, oldName));

    res.json({ success: true, message: "Metal updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update metal", details: error.message });
  }
});

// DELETE /api/admin/collections/:name (Deletes a Metal)
router.delete("/admin/collections/:name", requireAdmin, async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    await db.delete(metalsTable).where(eq(metalsTable.name, name));
    res.json({ success: true, message: "Metal deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete metal", details: error.message });
  }
});

// POST /api/admin/categories (Adds / Updates a Category)
router.post("/admin/categories", requireAdmin, async (req: Request, res: Response) => {
  try {
    const name = req.body.name as string | undefined;
    const description = req.body.description as string | undefined;
    const metals = req.body.metals;

    if (!name || !name.trim()) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    const trimmedName = name.trim();
    const metalList = Array.isArray(metals) 
      ? metals 
      : (typeof metals === "string" ? metals.split(",").map(m => m.trim()).filter(Boolean) : []);

    const existing = await db.select().from(categoriesTable).where(eq(categoriesTable.name, trimmedName));
    let categoryId: string;

    if (existing.length > 0) {
      categoryId = existing[0].id;
      await db.update(categoriesTable).set({ description }).where(eq(categoriesTable.id, categoryId));
    } else {
      const inserted = await db.insert(categoriesTable).values({
        name: trimmedName,
        description: description || ""
      }).returning({ id: categoriesTable.id });
      categoryId = inserted[0].id;
    }

    // Recreate mappings
    await db.delete(categoryMetalsTable).where(eq(categoryMetalsTable.categoryId, categoryId));
    if (metalList.length > 0) {
      const mappings = metalList.map(m => ({
        categoryId,
        metalName: m as string
      }));
      await db.insert(categoryMetalsTable).values(mappings);
    }

    res.status(201).json({ success: true, message: "Category saved successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to save category", details: error.message });
  }
});

// PUT /api/admin/categories/:oldName (Updates a Category)
router.put("/admin/categories/:oldName", requireAdmin, async (req: Request, res: Response) => {
  try {
    const oldName = req.params.oldName as string;
    const name = req.body.name as string | undefined;
    const description = req.body.description as string | undefined;
    const metals = req.body.metals;

    if (!name || !name.trim()) {
      res.status(400).json({ error: "Missing required field: name. Please fill all required fields." });
      return;
    }

    const existing = await db.select().from(categoriesTable).where(eq(categoriesTable.name, oldName));
    if (existing.length === 0) {
      res.status(404).json({ error: `Category ${oldName} not found` });
      return;
    }

    const categoryId = existing[0].id;
    await db.update(categoriesTable).set({
      name: name.trim(),
      description: description !== undefined ? description : existing[0].description
    }).where(eq(categoriesTable.id, categoryId));

    const metalList = Array.isArray(metals) 
      ? metals 
      : (typeof metals === "string" ? metals.split(",").map(m => m.trim()).filter(Boolean) : []);

    // Recreate mappings
    await db.delete(categoryMetalsTable).where(eq(categoryMetalsTable.categoryId, categoryId));
    if (metalList.length > 0) {
      const mappings = metalList.map(m => ({
        categoryId,
        metalName: m as string
      }));
      await db.insert(categoryMetalsTable).values(mappings);
    }

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update category", details: error.message });
  }
});

// DELETE /api/admin/categories/:name (Deletes a Category)
router.delete("/admin/categories/:name", requireAdmin, async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    await db.delete(categoriesTable).where(eq(categoriesTable.name, name));
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete category", details: error.message });
  }
});

// POST /api/admin/products (Adds / Updates a Product)
router.post("/admin/products", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  try {
    const { name, metal, category, weight_g, weightG, making_charge_pct, makingChargePct, description } = req.body;
    
    const finalWeight = parseFloat(weight_g || weightG);
    const finalMakingCharge = parseFloat(making_charge_pct || makingChargePct);

    if (!name || !metal || !category || isNaN(finalWeight) || isNaN(finalMakingCharge)) {
      res.status(400).json({ error: "Missing required fields for product. Please check name, metal, category, weight, and making charge." });
      return;
    }

    let imagePath = req.body.imageUrl || "";
    if (req.file) {
      imagePath = await uploadToSupabase(req.file, "products");
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    await db.insert(productsTable).values({
      id,
      name,
      metal,
      category,
      weightG: finalWeight.toString(),
      makingChargePct: finalMakingCharge.toString(),
      description: description || "",
      image: imagePath
    });

    res.status(201).json({ success: true, message: "Product created successfully", id });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to create product", details: error.message });
  }
});

// PUT /api/admin/products/:id (Updates a Product)
router.put("/admin/products/:id", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, metal, category, weight_g, weightG, making_charge_pct, makingChargePct, description } = req.body;

    const existing = await db.select().from(productsTable).where(eq(productsTable.id, id));
    if (existing.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    let imagePath = req.body.imageUrl;
    if (req.file) {
      imagePath = await uploadToSupabase(req.file, "products");
    }

    const finalWeight = parseFloat(weight_g || weightG);
    const finalMakingCharge = parseFloat(making_charge_pct || makingChargePct);

    await db.update(productsTable).set({
      name: name !== undefined ? name : existing[0].name,
      metal: metal !== undefined ? metal : existing[0].metal,
      category: category !== undefined ? category : existing[0].category,
      weightG: !isNaN(finalWeight) ? finalWeight.toString() : existing[0].weightG,
      makingChargePct: !isNaN(finalMakingCharge) ? finalMakingCharge.toString() : existing[0].makingChargePct,
      description: description !== undefined ? description : existing[0].description,
      image: imagePath !== undefined ? imagePath : existing[0].image,
      updatedAt: new Date()
    }).where(eq(productsTable.id, id));

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update product", details: error.message });
  }
});

// DELETE /api/admin/products/:id (Deletes a Product)
router.delete("/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await db.delete(productsTable).where(eq(productsTable.id, id));
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to delete product", details: error.message });
  }
});

export default router;
