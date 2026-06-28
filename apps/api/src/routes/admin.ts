import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import path from "path";
import fs from "fs/promises";
import { verifySessionToken, SESSION_COOKIE } from "../lib/auth.js";
import { getDb, schema } from "@workspace/db";
import { eq, desc } from "drizzle-orm";

const router: any = Router();

// Configure storage path for multer (in memory, then we write it manually)
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

async function saveLocalUpload(file: Express.Multer.File): Promise<string> {
  const fileExt = path.extname(file.originalname) || ".png";
  const cleanBase = path.basename(file.originalname, fileExt).replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const safeName = `${Date.now()}-${cleanBase}${fileExt}`;
  
  // Save to frontend public/images directory so it serves properly
  const uploadDir = path.join(process.cwd(), '../web/public/images');
  await fs.mkdir(uploadDir, { recursive: true });
  
  const targetPath = path.join(uploadDir, safeName);
  await fs.writeFile(targetPath, file.buffer);
  
  return `/images/${safeName}`;
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
        res.status(400).json({ error: err instanceof Error ? err.message : "Unknown upload error" });
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
    const data = await getDb().select().from(schema.metalsTable).orderBy(desc(schema.metalsTable.createdAt));
    
    const mapped = data.map(m => ({
      name: m.name,
      purityLabel: m.purityLabel,
      description: m.description,
      imageUrl: m.imageUrl
    }));
    res.json(mapped);
  } catch (error: unknown) {
    console.error("Metals fetch error:", error);
    res.status(500).json({ error: "Failed to fetch metals", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// GET /api/categories
router.get("/categories", async (req: Request, res: Response) => {
  try {
    const cats = await getDb().select().from(schema.categoriesTable).orderBy(desc(schema.categoriesTable.createdAt));
    const catMetals = await getDb().select().from(schema.categoryMetalsTable);

    const mapped = cats.map(c => {
      const metals = catMetals
        .filter(cm => cm.categoryId === c.id)
        .map(cm => cm.metalName);
      
      return {
        name: c.name,
        description: c.description,
        metals
      };
    });
    res.json(mapped);
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to fetch categories", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// GET /api/collections (returns grouped products)
router.get("/collections", async (req: Request, res: Response) => {
  try {
    const products = await getDb().select().from(schema.productsTable).orderBy(desc(schema.productsTable.createdAt));

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
      
      const weight_g = parseFloat(p.weight_g as string);
      const making_charge_pct = parseFloat(p.making_charge_pct as string);

      grouped[key].items.push({
        id: p.id,
        name: p.name,
        weight_g,
        making_charge_pct,
        description: p.description || "",
        image: p.image || ""
      });
    }
    
    res.json(Object.values(grouped));
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to fetch collections", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// POST /api/admin/upload (Generic upload endpoint)
router.post("/admin/upload", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  if (!req.file) {
    res.status(400).json({ error: "No file uploaded" });
    return;
  }

  try {
    const imageUrl = await saveLocalUpload(req.file);
    res.status(200).json({ success: true, imageUrl });
  } catch (error: unknown) {
    res.status(500).json({ error: error instanceof Error ? error.message : "Unknown error" });
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
      imageUrl = await saveLocalUpload(req.file);
    }

    const trimmedName = name.trim();
    
    const existing = await getDb().select().from(schema.metalsTable).where(eq(schema.metalsTable.name, trimmedName)).limit(1);
    
    if (existing.length > 0) {
      await getDb().update(schema.metalsTable).set({
        description: description || existing[0].description,
        purityLabel: purityLabel || existing[0].purityLabel,
        imageUrl: imageUrl || existing[0].imageUrl
      }).where(eq(schema.metalsTable.name, trimmedName));
      res.status(200).json({ success: true, message: "Metal updated successfully" });
      return;
    } else {
      await getDb().insert(schema.metalsTable).values({
        name: trimmedName,
        description: description || "",
        purityLabel: purityLabel || "",
        imageUrl: imageUrl
      });
      res.status(201).json({ success: true, message: "Metal created successfully" });
      return;
    }
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to save metal", details: error instanceof Error ? error.message : "Unknown error" });
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
      imageUrl = await saveLocalUpload(req.file);
    }

    const existing = await getDb().select().from(schema.metalsTable).where(eq(schema.metalsTable.name, oldName)).limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: `Metal ${oldName} not found` });
      return;
    }

    await getDb().update(schema.metalsTable).set({
      name: name.trim(),
      description: description !== undefined ? description : existing[0].description,
      purityLabel: purityLabel !== undefined ? purityLabel : existing[0].purityLabel,
      imageUrl: imageUrl !== undefined ? imageUrl : existing[0].imageUrl
    }).where(eq(schema.metalsTable.name, oldName));

    res.json({ success: true, message: "Metal updated successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update metal", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// DELETE /api/admin/collections/:name (Deletes a Metal)
router.delete("/admin/collections/:name", requireAdmin, async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    await getDb().delete(schema.metalsTable).where(eq(schema.metalsTable.name, name));
    res.json({ success: true, message: "Metal deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete metal", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// POST /admin/categories (Adds / Updates a Category)
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

    const existing = await getDb().select().from(schema.categoriesTable).where(eq(schema.categoriesTable.name, trimmedName)).limit(1);
    let categoryId: string;

    if (existing.length > 0) {
      categoryId = existing[0].id;
      await getDb().update(schema.categoriesTable).set({ description }).where(eq(schema.categoriesTable.id, categoryId));
    } else {
      const inserted = await getDb().insert(schema.categoriesTable).values({
        name: trimmedName,
        description: description || ""
      }).returning();
      categoryId = inserted[0].id;
    }

    // Recreate mappings
    await getDb().delete(schema.categoryMetalsTable).where(eq(schema.categoryMetalsTable.categoryId, categoryId));
    
    if (metalList.length > 0) {
      const mappings = metalList.map(m => ({
        categoryId: categoryId,
        metalName: m as string
      }));
      await getDb().insert(schema.categoryMetalsTable).values(mappings);
    }

    res.status(201).json({ success: true, message: "Category saved successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to save category", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// PUT /admin/categories/:oldName (Updates a Category)
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

    const existing = await getDb().select().from(schema.categoriesTable).where(eq(schema.categoriesTable.name, oldName)).limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: `Category ${oldName} not found` });
      return;
    }

    const categoryId = existing[0].id;
    await getDb().update(schema.categoriesTable).set({
      name: name.trim(),
      description: description !== undefined ? description : existing[0].description
    }).where(eq(schema.categoriesTable.id, categoryId));

    const metalList = Array.isArray(metals) 
      ? metals 
      : (typeof metals === "string" ? metals.split(",").map(m => m.trim()).filter(Boolean) : []);

    // Recreate mappings
    await getDb().delete(schema.categoryMetalsTable).where(eq(schema.categoryMetalsTable.categoryId, categoryId));

    if (metalList.length > 0) {
      const mappings = metalList.map(m => ({
        categoryId: categoryId,
        metalName: m as string
      }));
      await getDb().insert(schema.categoryMetalsTable).values(mappings);
    }

    res.json({ success: true, message: "Category updated successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update category", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// DELETE /admin/categories/:name (Deletes a Category)
router.delete("/admin/categories/:name", requireAdmin, async (req: Request, res: Response) => {
  try {
    const name = req.params.name as string;
    await getDb().delete(schema.categoriesTable).where(eq(schema.categoriesTable.name, name));
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete category", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// POST /admin/products (Adds / Updates a Product)
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
      imagePath = await saveLocalUpload(req.file);
    }

    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now();

    await getDb().insert(schema.productsTable).values({
      id,
      name,
      metal,
      category,
      weight_g: finalWeight.toString(),
      making_charge_pct: finalMakingCharge.toString(),
      description: description || "",
      image: imagePath
    });

    res.status(201).json({ success: true, message: "Product created successfully", id });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to create product", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// PUT /admin/products/:id (Updates a Product)
router.put("/admin/products/:id", requireAdmin, handleUpload("image"), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, metal, category, weight_g, weightG, making_charge_pct, makingChargePct, description } = req.body;

    const existing = await getDb().select().from(schema.productsTable).where(eq(schema.productsTable.id, id)).limit(1);

    if (existing.length === 0) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    let imagePath = req.body.imageUrl;
    if (req.file) {
      imagePath = await saveLocalUpload(req.file);
    }

    const finalWeight = parseFloat(weight_g || weightG);
    const finalMakingCharge = parseFloat(making_charge_pct || makingChargePct);

    await getDb().update(schema.productsTable).set({
      name: name !== undefined ? name : existing[0].name,
      metal: metal !== undefined ? metal : existing[0].metal,
      category: category !== undefined ? category : existing[0].category,
      weight_g: !isNaN(finalWeight) ? finalWeight.toString() : existing[0].weight_g,
      making_charge_pct: !isNaN(finalMakingCharge) ? finalMakingCharge.toString() : existing[0].making_charge_pct,
      description: description !== undefined ? description : existing[0].description,
      image: imagePath !== undefined ? imagePath : existing[0].image
    }).where(eq(schema.productsTable.id, id));

    res.json({ success: true, message: "Product updated successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to update product", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

// DELETE /admin/products/:id (Deletes a Product)
router.delete("/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await getDb().delete(schema.productsTable).where(eq(schema.productsTable.id, id));
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error: unknown) {
    res.status(500).json({ error: "Failed to delete product", details: error instanceof Error ? error.message : "Unknown error" });
  }
});

export default router;
