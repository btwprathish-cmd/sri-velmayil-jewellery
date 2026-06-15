import { unstable_cache } from "next/cache";
import { promises as fs } from "fs";
import path from "path";
import { getTodayDateString } from "@/utils/date";

const TROY_OZ_GRAMS = 31.1034768;
const GOLD_22K_PURITY = 0.916;
const HISTORY_FILE = path.join(process.cwd(), "data", "rate-history.json");

export interface LiveRateRecord {
  date: string;
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  gold24k_1g: number;
  source: string;
  fetchedAt: string;
  trend_gold?: number;
  trend_silver?: number;
}

interface HistoryStore {
  records: LiveRateRecord[];
}

async function readHistory(): Promise<HistoryStore> {
  try {
    const raw = await fs.readFile(HISTORY_FILE, "utf8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return { records: parsed };
    return parsed;
  } catch {
    return { records: [] };
  }
}

async function appendToHistory(record: LiveRateRecord): Promise<void> {
  const store = await readHistory();
  const existing = store.records.findIndex((r) => r.date === record.date);
  if (existing >= 0) {
    const prev = store.records[existing];
    record.trend_gold = record.gold22k_1g - (store.records[existing + 1]?.gold22k_1g ?? prev.gold22k_1g);
    record.trend_silver = record.silver_1g - (store.records[existing + 1]?.silver_1g ?? prev.silver_1g);
    store.records[existing] = record;
  } else {
    if (store.records.length > 0) {
      record.trend_gold = record.gold22k_1g - store.records[0].gold22k_1g;
      record.trend_silver = record.silver_1g - store.records[0].silver_1g;
    }
    store.records.unshift(record);
  }
  store.records = store.records.slice(0, 90);
  await fs.mkdir(path.dirname(HISTORY_FILE), { recursive: true });
  await fs.writeFile(HISTORY_FILE, JSON.stringify(store.records, null, 2));
}

function buildRecord(
  gold22k_1g: number,
  silver_1g: number,
  source: string
): LiveRateRecord {
  const gold22k = Math.round(gold22k_1g);
  const silver = Math.round(silver_1g);
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

async function fetchFromMetalpriceApi(): Promise<LiveRateRecord | null> {
  const apiKey = process.env.METALPRICE_API_KEY;
  if (!apiKey) return null;

  try {
    const url = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU,XAG,INR`;
    const res = await fetch(url, { next: { revalidate: 0 } });
    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.success || !data?.rates) return null;

    const usdToInr = data.rates.INR;
    const goldUsdPerOz = data.rates.XAU;
    const silverUsdPerOz = data.rates.XAG;
    if (!usdToInr || !goldUsdPerOz || !silverUsdPerOz) return null;

    const gold24kPerGram = (goldUsdPerOz * usdToInr) / TROY_OZ_GRAMS;
    const silverPerGram = (silverUsdPerOz * usdToInr) / TROY_OZ_GRAMS;
    const gold22kPerGram = gold24kPerGram * GOLD_22K_PURITY;

    return buildRecord(gold22kPerGram, silverPerGram, "metalpriceapi.com");
  } catch {
    return null;
  }
}

async function fetchFromGoldApi(): Promise<LiveRateRecord | null> {
  try {
    const [goldRes, silverRes, fxRes] = await Promise.all([
      fetch("https://api.gold-api.com/price/XAU", { next: { revalidate: 0 } }),
      fetch("https://api.gold-api.com/price/XAG", { next: { revalidate: 0 } }),
      fetch("https://api.frankfurter.app/latest?from=USD&to=INR", { next: { revalidate: 0 } }),
    ]);

    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) return null;

    const goldData = await goldRes.json();
    const silverData = await silverRes.json();
    const fxData = await fxRes.json();

    const usdToInr = fxData?.rates?.INR;
    const goldUsdPerOz = goldData?.price;
    const silverUsdPerOz = silverData?.price;
    if (!usdToInr || !goldUsdPerOz || !silverUsdPerOz) return null;

    const gold24kPerGram = (goldUsdPerOz * usdToInr) / TROY_OZ_GRAMS;
    const silverPerGram = (silverUsdPerOz * usdToInr) / TROY_OZ_GRAMS;
    const gold22kPerGram = gold24kPerGram * GOLD_22K_PURITY;

    return buildRecord(gold22kPerGram, silverPerGram, "gold-api.com + frankfurter.app");
  } catch {
    return null;
  }
}

async function fetchLiveRatesUncached(): Promise<LiveRateRecord> {
  const metalprice = await fetchFromMetalpriceApi();
  if (metalprice) {
    await appendToHistory(metalprice);
    return metalprice;
  }

  const goldApi = await fetchFromGoldApi();
  if (goldApi) {
    await appendToHistory(goldApi);
    return goldApi;
  }

  const store = await readHistory();
  if (store.records.length > 0) {
    return { ...store.records[0], source: `${store.records[0].source} (cached)` };
  }

  return buildRecord(13860, 270, "fallback-default");
}

export const getLiveRates = unstable_cache(
  async () => fetchLiveRatesUncached(),
  ["live-gold-silver-rates"],
  { revalidate: 1800, tags: ["rates"] }
);

/** Direct fetch without Next.js cache — for scripts and diagnostics */
export async function fetchLatestRatesDirect(): Promise<LiveRateRecord> {
  return fetchLiveRatesUncached();
}

export async function getRateHistory(): Promise<LiveRateRecord[]> {
  const store = await readHistory();
  if (store.records.length > 0) return store.records;

  try {
    const live = await fetchLiveRatesUncached();
    return [live];
  } catch {
    return [];
  }
}

export async function getRateByDate(date: string): Promise<LiveRateRecord | null> {
  const store = await readHistory();
  return store.records.find((r) => r.date === date) ?? null;
}
