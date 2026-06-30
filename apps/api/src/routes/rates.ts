import { Router } from "express";
import { getLiveRates, getRateHistory, getRateByDate } from "../lib/live-rates.js";

const router = Router();

router.get("/rates/latest", async (_req: any, res: any) => {
  try {
    const rate = await getLiveRates();
    res.json(rate);
  } catch {
    res.status(500).json({ error: "Failed to fetch latest rate" });
  }
});

router.get("/rates/history", async (_req: any, res: any) => {
  try {
    const history = await getRateHistory();
    const sorted = history.sort((a, b) => b.date.localeCompare(a.date));
    res.json(sorted);
  } catch {
    res.status(500).json({ error: "Failed to fetch rate history" });
  }
});

router.get("/rates/date/:date", async (req: any, res: any) => {
  const { date } = req.params;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    return;
  }
  const record = await getRateByDate(date);
  if (!record) {
    res.status(404).json({ error: `No rate found for ${date}` });
    return;
  }
  res.json(record);
});

router.get("/cron/update-rates", async (req: any, res: any) => {
  if (
    process.env.CRON_SECRET &&
    req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  
  try {
    const { fetchLiveRatesUncached } = await import("../lib/live-rates.js");
    const rate = await fetchLiveRatesUncached();
    res.status(200).json({ success: true, rate });
  } catch (error) {
    console.error("Cron update failed", error);
    res.status(500).json({ error: "Update failed" });
  }
});

export default router;
