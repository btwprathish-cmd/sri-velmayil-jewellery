import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { uploadImageToCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";

const COLLECTIONS_FILE = path.join(process.cwd(), "data", "collections.json");
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function readCollections() {
  const data = await fs.readFile(COLLECTIONS_FILE, "utf8");
  return JSON.parse(data);
}

async function writeCollections(data: unknown) {
  await fs.writeFile(COLLECTIONS_FILE, JSON.stringify(data, null, 2));
}

export async function GET() {
  const collections = await readCollections();
  return NextResponse.json(collections);
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const categorySlug = formData.get("categorySlug") as string;
      const name = formData.get("name") as string;
      const category = formData.get("category") as string;
      const weight_g = Number(formData.get("weight_g"));
      const making_charge_pct = Number(formData.get("making_charge_pct"));
      const description = formData.get("description") as string;
      const price = formData.get("price") ? Number(formData.get("price")) : undefined;
      const imageFile = formData.get("image") as File | null;

      const collections = await readCollections();
      const catIndex = collections.findIndex((c: { slug: string }) => c.slug === categorySlug);
      if (catIndex < 0) return NextResponse.json({ error: "Category not found" }, { status: 404 });

      const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      let imagePath = `/images/${id}-tirupur.webp`;

      if (imageFile && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        const ext = imageFile.name.split(".").pop() || "webp";
        const filename = `${id}-tirupur.${ext}`;

        if (isCloudinaryConfigured()) {
          const uploaded = await uploadImageToCloudinary(buffer, filename);
          imagePath = uploaded.url;
        } else {
          await fs.mkdir(UPLOADS_DIR, { recursive: true });
          await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);
          imagePath = `/uploads/${filename}`;
        }
      }

      const newItem = {
        id,
        name,
        category: category || collections[catIndex].name,
        weight_g,
        making_charge_pct,
        description,
        image: imagePath,
        ...(price ? { price } : {}),
      };

      collections[catIndex].items.push(newItem);
      await writeCollections(collections);
      return NextResponse.json({ success: true, item: newItem });
    }

    const body = await request.json();
    const collections = await readCollections();
    const catIndex = collections.findIndex((c: { slug: string }) => c.slug === body.categorySlug);
    if (catIndex < 0) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const id = body.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const newItem = {
      id,
      name: body.name,
      category: body.category || collections[catIndex].name,
      weight_g: Number(body.weight_g),
      making_charge_pct: Number(body.making_charge_pct),
      description: body.description,
      image: body.image || `/images/${id}-tirupur.webp`,
      ...(body.price ? { price: Number(body.price) } : {}),
    };

    collections[catIndex].items.push(newItem);
    await writeCollections(collections);
    return NextResponse.json({ success: true, item: newItem });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to add product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { categorySlug, itemId, ...updates } = body;
    const collections = await readCollections();
    const catIndex = collections.findIndex((c: { slug: string }) => c.slug === categorySlug);
    if (catIndex < 0) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    const itemIndex = collections[catIndex].items.findIndex((i: { id: string }) => i.id === itemId);
    if (itemIndex < 0) return NextResponse.json({ error: "Product not found" }, { status: 404 });

    collections[catIndex].items[itemIndex] = {
      ...collections[catIndex].items[itemIndex],
      ...updates,
    };

    await writeCollections(collections);
    return NextResponse.json({ success: true, item: collections[catIndex].items[itemIndex] });
  } catch {
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categorySlug = searchParams.get("categorySlug");
    const itemId = searchParams.get("itemId");
    if (!categorySlug || !itemId) {
      return NextResponse.json({ error: "categorySlug and itemId required" }, { status: 400 });
    }

    const collections = await readCollections();
    const catIndex = collections.findIndex((c: { slug: string }) => c.slug === categorySlug);
    if (catIndex < 0) return NextResponse.json({ error: "Category not found" }, { status: 404 });

    collections[catIndex].items = collections[catIndex].items.filter(
      (i: { id: string }) => i.id !== itemId
    );
    await writeCollections(collections);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
