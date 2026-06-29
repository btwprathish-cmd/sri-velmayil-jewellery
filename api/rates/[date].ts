import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabase } from "../lib/supabase.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<void> {
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
    const { data, error } = await supabase
      .from("live_rates")
      .select("*")
      .eq("date", dateStr)
      .single();

    if (error || !data) {
      res.status(404).json({
        error: `No rate found for ${dateStr}`,
      });
      return;
    }

    res.json(data);
    return;
  } catch {
    res.status(500).json({
      error: "Failed to fetch rate for date",
    });
    return;
  }
}