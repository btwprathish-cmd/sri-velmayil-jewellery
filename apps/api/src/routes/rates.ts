import { Router, Request, Response } from "express";
import { getLiveRates, getRateHistory, getRateByDate } from "../lib/live-rates.js";

const router: any = Router();

router.get("/rates/latest", async (_req: Request, res: Response) => {
  try {
    const rate = await getLiveRates();
    res.json(rate);
  } catch {
    res.status(500).json({ error: "Failed to fetch latest rate" });
  }
});

router.get("/rates/history", (_req: Request, res: Response) => {
  try {
    const history = getRateHistory();
    const sorted = history.sort((a, b) => b.date.localeCompare(a.date));
    res.json(sorted);
  } catch {
    res.status(500).json({ error: "Failed to fetch rate history" });
  }
});

router.get("/rates/date/:date", (req: Request, res: Response) => {
  const { date } = req.params;
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
    return;
  }
  const record = getRateByDate(date);
  if (!record) {
    res.status(404).json({ error: `No rate found for ${date}` });
    return;
  }
  res.json(record);
});

export default router;
