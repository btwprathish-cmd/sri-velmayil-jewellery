import { pgTable, serial, text, integer, numeric, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const categories = pgTable(
  "categories",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    metal: text("metal").notNull(),
    description: text("description").notNull(),
    image: text("image").notNull().default(""),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
  }),
);

export const collections = pgTable(
  "collections",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    metal: text("metal").notNull(),
    category: text("category").notNull(),
    description: text("description").notNull(),
    image: text("image").notNull().default(""),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("collections_slug_idx").on(table.slug),
  }),
);

export const products = pgTable(
  "products",
  {
    id: serial("id").primaryKey(),
    slug: text("slug").notNull(),
    collection_id: integer("collection_id").notNull().references(() => collections.id),
    name: text("name").notNull(),
    weight_g: numeric("weight_g", { precision: 10, scale: 2 }).notNull(),
    making_charge_pct: numeric("making_charge_pct", { precision: 5, scale: 2 }).notNull(),
    description: text("description").notNull(),
    image: text("image").notNull().default(""),
    created_at: timestamp("created_at").defaultNow().notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    slugIdx: uniqueIndex("products_slug_idx").on(table.slug),
  }),
);

export const insertCategorySchema = createInsertSchema(categories).omit({ id: true, created_at: true, updated_at: true });
export const insertCollectionSchema = createInsertSchema(collections).omit({ id: true, created_at: true, updated_at: true });
export const insertProductSchema = createInsertSchema(products).omit({ id: true, created_at: true, updated_at: true });

export type CategoryRow = typeof categories.$inferSelect;
export type CollectionRow = typeof collections.$inferSelect;
export type ProductRow = typeof products.$inferSelect;
