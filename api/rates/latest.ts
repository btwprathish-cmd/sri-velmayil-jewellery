import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "node:fs";
import path from "node:path";

const TROY_OZ_GRAMS = 31.1034768;
const GOLD_22K_PURITY = 0.916;
const LOCAL_PREMIUM_PERCENT = 1.5;

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

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0]!;
}

function buildRecord(
  gold22k_1g: number,
  silver_1g: number,
  source: string
): LiveRateRecord {
  const premium = 1 + LOCAL_PREMIUM_PERCENT / 100;

  const gold22k = Math.round(gold22k_1g * premium);
  const silver = Math.round(silver_1g * premium);

  return {
    date: getTodayDateString(),
    gold22k_1g: gold22k,
    gold22k_8g: gold22k * 8,
    silver_1g: silver,
    gold24k_1g: Math.round(gold22k / GOLD_22K_PURITY),
    source,
    fetchedAt: new Date().toISOString(),
  };
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

async function fetchFromGoldApi(): Promise<LiveRateRecord | null> {
  try {
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU"),
      fetch("https://api.gold-api.com/price/XAG"),
      fetch("https://api.frankfurter.app/latest?from=USD&to=INR"),
    ]);

    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) {
      return null;
    }

    const goldData = (await goldRes.json()) as { price?: number };
    const silverData = (await silverRes.json()) as { price?: number };
    const fxData = (await fxRes.json()) as {
      rates?: { INR?: number };
    };

    const usdToInr = fxData?.rates?.INR;
    const goldUsdPerOz = goldData?.price;
    const silverUsdPerOz = silverData?.price;

    if (!usdToInr || !goldUsdPerOz || !silverUsdPerOz) {
      return null;
    }

    const gold24kPerGram =
      (goldUsdPerOz * usdToInr) / TROY_OZ_GRAMS;

    const silverPerGram =
      (silverUsdPerOz * usdToInr) / TROY_OZ_GRAMS;

    const gold22kPerGram =
      gold24kPerGram * GOLD_22K_PURITY;

    const record = buildRecord(
      gold22kPerGram,
      silverPerGram,
      "gold-api.com + frankfurter.app"
    );

    const history = readHistory();

    if (history.length > 0) {
      record.trend_gold =
        record.gold22k_1g - history[0].gold22k_1g;

      record.trend_silver =
        record.silver_1g - history[0].silver_1g;
    }

    return record;
  } catch {
    return null;
  }
}

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
): Promise<void> {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
  "Cache-Control",
  "no-store, no-cache, must-revalidate"
);

  try {
    const live = await fetchFromGoldApi();

    if (live) {
      res.json(live);
      return;
    }

    const history = readHistory();

    if (history.length > 0) {
      res.json({
        ...history[0],
        source: `${history[0].source} (cached)`,
      });
      return;
    }

    res.json(
      buildRecord(
        13860,
        270,
        "fallback-default"
      )
    );
    return;
  } catch {
    res.status(500).json({
      error: "Failed to fetch latest rate",
    });
    return;
  }
}
