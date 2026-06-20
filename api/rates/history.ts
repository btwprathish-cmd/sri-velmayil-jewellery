import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    path.resolve(
      process.cwd(),
      "artifacts/sabarish/src/data/rate-history.json"
    ),
    path.resolve(
      __dirname,
      "../../artifacts/sabarish/src/data/rate-history.json"
    ),
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) {
          return parsed;
        }

        if (parsed?.records && Array.isArray(parsed.records)) {
          return parsed.records;
        }
      }
    } catch {
      // skip invalid file
    }
  }

  return [];
}

export default function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Cache-Control",
    "s-maxage=3600, stale-while-revalidate=7200"
  );

  try {
    const history = readHistory();
    const sorted = history.sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    res.status(200).json(sorted);
  } catch {
    res.status(500).json({
      error: "Failed to fetch rate history",
    });
  }
}