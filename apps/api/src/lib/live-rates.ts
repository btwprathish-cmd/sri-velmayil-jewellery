import { supabase } from "./supabase.js";

const TROY_OZ_GRAMS = 31.1034768;
const GOLD_22K_PURITY = 0.916;
const LOCAL_PREMIUM_PERCENT = 1.5;

export interface LiveRateRecord {
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
  return new Date().toISOString().split("T")[0];
}

async function readHistory(): Promise<LiveRateRecord[]> {
  try {
    const { data, error } = await supabase
      .from('rate_history')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error("Failed to read rate history from Supabase", error);
      return [];
    }

    return (data || []).map((row: any) => ({
      date: row.date,
      gold22k_1g: Number(row.gold22k_1g),
      gold22k_8g: Number(row.gold22k_8g),
      silver_1g: Number(row.silver_1g),
      gold24k_1g: Number(row.gold24k_1g),
      source: row.source,
      fetchedAt: row.fetched_at,
      trend_gold: row.trend_gold != null ? Number(row.trend_gold) : null,
      trend_silver: row.trend_silver != null ? Number(row.trend_silver) : null
    }));
  } catch (err) {
    console.error("Error reading history", err);
    return [];
  }
}

async function appendToHistory(record: LiveRateRecord): Promise<void> {
  try {
    const records = await readHistory();
    const existingIdx = records.findIndex((r) => r.date === record.date);

    if (existingIdx >= 0) {
      const prevRecord = records[existingIdx + 1];
      record.trend_gold = prevRecord
        ? record.gold22k_1g - prevRecord.gold22k_1g
        : records[existingIdx].trend_gold ?? null;
      record.trend_silver = prevRecord
        ? record.silver_1g - prevRecord.silver_1g
        : records[existingIdx].trend_silver ?? null;
    } else {
      if (records.length > 0) {
        record.trend_gold = record.gold22k_1g - records[0].gold22k_1g;
        record.trend_silver = record.silver_1g - records[0].silver_1g;
      } else {
        record.trend_gold = null;
        record.trend_silver = null;
      }
    }

    const { error } = await supabase
      .from('rate_history')
      .upsert({
        date: record.date,
        gold22k_1g: record.gold22k_1g,
        gold22k_8g: record.gold22k_8g,
        silver_1g: record.silver_1g,
        gold24k_1g: record.gold24k_1g,
        source: record.source,
        fetched_at: record.fetchedAt,
        trend_gold: record.trend_gold,
        trend_silver: record.trend_silver
      }, { onConflict: 'date' });

    if (error) {
      console.error("Failed to upsert rate history", error);
    }
  } catch (err) {
    console.error("Error in appendToHistory", err);
  }
}

function buildRecord(gold22k_1g: number, silver_1g: number, source: string): LiveRateRecord {
  const premium = 1 + LOCAL_PREMIUM_PERCENT / 100;
  const gold22k = Math.round(gold22k_1g * premium);
  const silver = Math.round(silver_1g * premium);
  const record: LiveRateRecord = {
    date: getTodayDateString(),
    gold22k_1g: gold22k,
    gold22k_8g: gold22k * 8,
    silver_1g: silver,
    gold24k_1g: Math.round(gold22k / GOLD_22K_PURITY),
    source,
    fetchedAt: new Date().toISOString(),
  };
  if (process.env["NODE_ENV"] === "development") {
    console.log("[Rates]", {
      source,
      gold22k: record.gold22k_1g,
      gold24k: record.gold24k_1g,
      silver: record.silver_1g,
      fetchedAt: record.fetchedAt,
      localPremium: LOCAL_PREMIUM_PERCENT,
    });
  }
  return record;
}

async function fetchFromMetalpriceApi(): Promise<LiveRateRecord | null> {
  const apiKey = process.env["METALPRICE_API_KEY"];
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU,XAG,INR`
    ) as any;
    if (!res.ok) return null;
    const data = await res.json() as { success?: boolean; rates?: Record<string, number> };
    if (!data?.success || !data?.rates) return null;

    const { INR: usdToInr, XAU: goldUsdPerOz, XAG: silverUsdPerOz } = data.rates;
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
      fetch("https://api.gold-api.com/price/XAU") as any,
      fetch("https://api.gold-api.com/price/XAG") as any,
      fetch("https://api.frankfurter.app/latest?from=USD&to=INR") as any,
    ]);
    if (!goldRes.ok || !silverRes.ok || !fxRes.ok) return null;

    const goldData = await goldRes.json() as { price?: number };
    const silverData = await silverRes.json() as { price?: number };
    const fxData = await fxRes.json() as { rates?: { INR?: number } };

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

export async function fetchLiveRatesUncached(): Promise<LiveRateRecord> {
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

  const history = await readHistory();
  if (history.length > 0) {
    return { ...history[0], source: `${history[0].source} (cached)` };
  }

  return buildRecord(13860, 270, "fallback-default");
}

let cachedRate: LiveRateRecord | null = null;
let cacheExpiry = 0;
const CACHE_TTL_MS = 30 * 60 * 1000;

export async function getLiveRates(): Promise<LiveRateRecord> {
  const now = Date.now();
  if (cachedRate && now < cacheExpiry) return cachedRate;

  const rate = await fetchLiveRatesUncached();
  cachedRate = rate;
  cacheExpiry = now + CACHE_TTL_MS;
  return rate;
}

export async function getRateHistory(): Promise<LiveRateRecord[]> {
  const records = await readHistory();
  if (records.length > 0) return records;
  if (cachedRate) return [cachedRate];
  return [];
}

export async function getRateByDate(date: string): Promise<LiveRateRecord | null> {
  const records = await readHistory();
  return records.find((r) => r.date === date) ?? null;
}
