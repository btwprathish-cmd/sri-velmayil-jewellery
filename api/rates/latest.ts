import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase.js";

const GOLD_22K_PURITY = 0.916;
const LOCAL_PREMIUM_PERCENT = 1.5;

interface LiveRateRecord {
  date: string;
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  gold24k_1g: number;
  source: string;
  fetched_at?: string;
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
    fetched_at: new Date().toISOString(),
  };
}

async function readHistory(): Promise<LiveRateRecord[]> {
  const { data, error } = await supabase
    .from("live_rates")
    .select("*")
    .order("date", { ascending: false })
    .limit(30);

  if (error || !data) {
    console.error("Error reading history from Supabase:", error);
    return [];
  }
  return data as LiveRateRecord[];
}

async function saveToHistory(record: LiveRateRecord): Promise<void> {
  const { error } = await supabase
    .from("live_rates")
    .upsert(
      {
        date: record.date,
        gold22k_1g: record.gold22k_1g,
        gold22k_8g: record.gold22k_8g,
        silver_1g: record.silver_1g,
        gold24k_1g: record.gold24k_1g,
        source: record.source,
        trend_gold: record.trend_gold,
        trend_silver: record.trend_silver,
        fetched_at: record.fetched_at,
      },
      { onConflict: "date" }
    );
  if (error) {
    console.error("Error saving history to Supabase:", error);
  }
}

async function fetchFromCurrencyApi(): Promise<LiveRateRecord | null> {
  try {
    const [goldRes, silverRes] = await Promise.all([
      fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xau.json", { cache: "no-store" }),
      fetch("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/xag.json", { cache: "no-store" })
    ]);

    if (!goldRes.ok || !silverRes.ok) return null;

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();

    const xauInr = goldData.xau.inr;
    const xagInr = silverData.xag.inr;

    const TROY_OUNCE_IN_GRAMS = 31.1034768;
    
    // Spot prices in INR per gram
    const goldSpotPerGram = xauInr / TROY_OUNCE_IN_GRAMS;
    const silverSpotPerGram = xagInr / TROY_OUNCE_IN_GRAMS;

    const GOLD_INDIAN_MULTIPLIER = 1.15; 
    const SILVER_INDIAN_MULTIPLIER = 1.28; 

    const gold24kBase = goldSpotPerGram * GOLD_INDIAN_MULTIPLIER;
    const gold22kBase = gold24kBase * GOLD_22K_PURITY;
    
    const silverBase = silverSpotPerGram * SILVER_INDIAN_MULTIPLIER;

    const record = buildRecord(
      gold22kBase,
      silverBase,
      "currency-api"
    );

    const history = await readHistory();

    if (history.length > 0 && history[0].date !== record.date) {
      record.trend_gold = record.gold22k_1g - history[0].gold22k_1g;
      record.trend_silver = record.silver_1g - history[0].silver_1g;
    } else if (history.length > 1 && history[0].date === record.date) {
      record.trend_gold = record.gold22k_1g - history[1].gold22k_1g;
      record.trend_silver = record.silver_1g - history[1].silver_1g;
    } else if (history.length > 0 && history[0].date === record.date) {
      record.trend_gold = history[0].trend_gold;
      record.trend_silver = history[0].trend_silver;
    }

    await saveToHistory(record);
    return record;
  } catch (err) {
    console.error("Error fetching rates:", err);
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
    const live = await fetchFromCurrencyApi();

    if (live) {
      res.json(live);
      return;
    }

    const history = await readHistory();

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
  } catch {
    res.status(500).json({
      error: "Failed to fetch latest rate",
    });
  }
}
