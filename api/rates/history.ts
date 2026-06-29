import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase.js";

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

export default async function handler(
  _req: VercelRequest,
  res: VercelResponse
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate"
  );

  try {
    const history = await readHistory();
    const sorted = history.sort((a, b) =>
      b.date.localeCompare(a.date)
    );

    return res.status(200).json(sorted);
  } catch {
    return res.status(500).json({
      error: "Failed to fetch rate history",
    });
  }
}
