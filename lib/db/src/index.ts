import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

let _db: ReturnType<typeof drizzle<typeof schema>> | undefined;

export function getDb() {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is missing! Cannot connect to Supabase.");
    }
    const client = postgres(process.env.DATABASE_URL, { prepare: false, ssl: "require" });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export { schema };
