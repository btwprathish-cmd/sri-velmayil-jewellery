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
  categoryId: uuid("category_id").references(() => categoriesTable.id, { onDelete: "cascade" }).notNull(),
  metalName: text("metal_name").references(() => metalsTable.name, { onDelete: "cascade" }).notNull(),
}, (t: any) => ({
  pk: primaryKey({ columns: [t.categoryId, t.metalName] }),
}));

export const productsTable = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  metal: text("metal").references(() => metalsTable.name, { onDelete: "cascade" }).notNull(),
  category: text("category").references(() => categoriesTable.name, { onDelete: "cascade" }).notNull(),
  weightG: numeric("weight_g").notNull(),
  makingChargePct: numeric("making_charge_pct").notNull(),
  description: text("description"),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});