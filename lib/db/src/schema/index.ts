import { pgTable, text, timestamp, uuid, numeric, primaryKey } from "drizzle-orm/pg-core";

export const metalsTable = pgTable("metals", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  purityLabel: text("purity_label"),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categoriesTable = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").unique().notNull(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const categoryMetalsTable = pgTable("category_metals", {
  categoryId: uuid("category_id").notNull().references(() => categoriesTable.id, { onDelete: 'cascade' }),
  metalName: text("metal_name").notNull().references(() => metalsTable.name, { onDelete: 'cascade' }),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.categoryId, table.metalName] }),
  };
});

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  metal: text("metal").notNull().references(() => metalsTable.name, { onDelete: 'cascade' }),
  category: text("category").notNull().references(() => categoriesTable.name, { onDelete: 'cascade' }),
  weight_g: numeric("weight_g").notNull(),
  making_charge_pct: numeric("making_charge_pct").notNull(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * 1. DATABASE_URL format expected by Drizzle: postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
 * 2. Exact field names defined above.
 * 3. API endpoints in apps/api/src/routes/admin.ts: 
 *    - GET /metals, GET /categories, GET /collections
 *    - POST /admin/upload, POST /admin/collections, PUT /admin/collections/:oldName, DELETE /admin/collections/:name
 *    - POST /admin/categories, PUT /admin/categories/:oldName, DELETE /admin/categories/:name
 *    - POST /admin/products, PUT /admin/products/:id, DELETE /admin/products/:id
 * 4. Frontend calls endpoints via fetchApi wrapper in collections.ts, mapping identical paths (with /api/ prefix).
 * 5. Current env vars: PORT, NODE_ENV, BASE_URL, DATABASE_URL, UPLOAD_PATH, MAX_FILE_SIZE, ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_SESSION_SECRET.
 */
