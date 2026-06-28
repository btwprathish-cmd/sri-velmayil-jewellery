import fs from "fs";
import path from "path";

export interface RateRecord {
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

function getRateHistoryPath(): string {
  const workspace = process.env["REPL_HOME"] || "/home/runner/workspace";
  const candidates = [
    path.join(workspace, ".migration-backup/data/rate-history.json"),
    path.join(workspace, "artifacts/sabarish/src/data/rate-history.json"),
    path.join(workspace, "data/rate-history.json"),
    path.resolve(process.cwd(), "data/rate-history.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[1];
}

function getFallbackRates(): RateRecord[] {
  const today = new Date().toISOString().split("T")[0];
  return [
    {
      date: today,
      gold22k_1g: 13860,
      gold22k_8g: 110880,
      silver_1g: 270,
      gold24k_1g: 15131,
      source: "fallback",
      fetchedAt: new Date().toISOString(),
      trend_gold: null,
      trend_silver: null,
    },
  ];
}

function loadRates(): RateRecord[] {
  try {
    const p = getRateHistoryPath();
    const raw = fs.readFileSync(p, "utf-8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return data as RateRecord[];
    if (data && Array.isArray(data.rates)) return data.rates as RateRecord[];
    return getFallbackRates();
  } catch {
    return getFallbackRates();
  }
}

export function getAllRates(): RateRecord[] {
  return loadRates().sort((a, b) => b.date.localeCompare(a.date));
}

export function getLatestRate(): RateRecord {
  const rates = loadRates();
  if (!rates.length) return getFallbackRates()[0];
  return rates.sort((a, b) => b.date.localeCompare(a.date))[0];
}

export function getRateByDate(date: string): RateRecord | null {
  const rates = loadRates();
  return rates.find((r) => r.date === date) ?? null;
}
