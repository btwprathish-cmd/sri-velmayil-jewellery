import postgres from "postgres";

async function test() {
  try {
    console.log("Connecting...");
    const sql = postgres("postgresql://postgres:QDhfw2LD2RFgSPMxQDhfw2LD2RFgSPMx@db.llqolexrxqzohthsqakg.supabase.co:5432/postgres", { prepare: false });
    const res = await sql`SELECT 1 as result`;
    console.log("Connected successfully!", res);
    process.exit(0);
  } catch (err) {
    console.error("Connection error:", err);
    process.exit(1);
  }
}

test();
