import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";

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
  ];

  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        const raw = fs.readFileSync(p, "utf-8");
        const parsed = JSON.parse(raw);

        if (Array.isArray(parsed)) return parsed;

        if (parsed?.records && Array.isArray(parsed.records)) {
          return parsed.records;
        }
      }
    } catch {
      // skip
    }
  }

  return [];
}

export default function handler(
  req: VercelRequest,
  res: VercelResponse
): void {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const { date } = req.query;
  const dateStr = Array.isArray(date) ? date[0] : date;

  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    res.status(400).json({
      error: "Invalid date format. Use YYYY-MM-DD.",
    });
    return;
  }

  try {
    const history = readHistory();

    const record = history.find((r) => r.date === dateStr);

    if (!record) {
      res.status(404).json({
        error: `No rate found for ${dateStr}`,
      });
      return;
    }

    res.json(record);
    return;
  } catch {
    res.status(500).json({
      error: "Failed to fetch rate for date",
    });
    return;
  }
}