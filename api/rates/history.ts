import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

interface LiveRateRecord {
  date: string;
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  gold24k_1g: number;
  source: string;
  fetchedAt: string;
  trend_gold?: number | null;
  trend_silver?: number | null;
}

function readHistory(): LiveRateRecord[] {
  const candidates = [
    path.resolve(process.cwd(), "artifacts/sabarish/src/data/rate-history.json"),
    path.resolve(__dirname, "../../artifacts/sabarish/src/data/rate-history.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
        if (parsed?.records && Array.isArray(parsed.records)) return parsed.records;
      }
    } catch {
      // skip
    }
  }
  return [];
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=7200");

  try {
    const history = readHistory();
    const sorted = history.sort((a, b) => b.date.localeCompare(a.date));
    res.json(sorted);
  } catch {
    res.status(500).json({ error: "Failed to fetch rate history" });
  }
}
