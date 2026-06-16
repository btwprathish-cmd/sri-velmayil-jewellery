import { Router, type IRouter } from "express";
import { getAllRates, getLatestRate, getRateByDate } from "../lib/rates.js";

const router: IRouter = Router();

router.get("/rates/latest", (_req, res) => {
  const rate = getLatestRate();
  res.json(rate);
});

router.get("/rates/history", (_req, res) => {
  const rates = getAllRates();
  const sorted = rates.sort((a, b) => b.date.localeCompare(a.date));
  res.json(sorted);
});

router.get("/rates/date/:date", (req, res) => {
  const { date } = req.params;
  const rate = getRateByDate(date);
  if (!rate) {
    res.status(404).json({ error: "Rate not found for this date" });
    return;
  }
  res.json(rate);
});

export default router;
