import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __sriVelmayilDbPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set for API database access.");
}

const pool = globalThis.__sriVelmayilDbPool ?? new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 5,
});

globalThis.__sriVelmayilDbPool = pool;

export async function query<T = any>(text: string, params: unknown[] = []) {
  const client = await pool.connect();
  try {
    return await client.query<T>(text, params);
  } finally {
    client.release();
  }
}
