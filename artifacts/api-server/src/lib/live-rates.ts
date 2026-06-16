import fs from "fs";
import path from "path";

const TROY_OZ_GRAMS = 31.1034768;
const GOLD_22K_PURITY = 0.916;

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

function getHistoryFilePath(): string {
  const workspace = process.env["REPL_HOME"] || "/home/runner/workspace";
  const candidates = [
    path.join(workspace, "artifacts/sabarish/src/data/rate-history.json"),
    path.join(workspace, ".migration-backup/data/rate-history.json"),
    path.join(workspace, "data/rate-history.json"),
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  return candidates[0];
}

function getTodayDateString(): string {
  return new Date().toISOString().split("T")[0];
}

function readHistory(): LiveRateRecord[] {
  try {
    const raw = fs.readFileSync(getHistoryFilePath(), "utf-8");
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    if (parsed?.records && Array.isArray(parsed.records)) return parsed.records;
    return [];
  } catch {
    return [];
  }
}

function writeHistory(records: LiveRateRecord[]): void {
  try {
    const p = getHistoryFilePath();
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(records, null, 2));
  } catch {
    // Filesystem may be read-only in some environments — skip
  }
}

function appendToHistory(record: LiveRateRecord): void {
  const records = readHistory();
  const existingIdx = records.findIndex((r) => r.date === record.date);

  if (existingIdx >= 0) {
    const prevRecord = records[existingIdx + 1];
    record.trend_gold = prevRecord
      ? record.gold22k_1g - prevRecord.gold22k_1g
      : records[existingIdx].trend_gold ?? null;
    record.trend_silver = prevRecord
      ? record.silver_1g - prevRecord.silver_1g
      : records[existingIdx].trend_silver ?? null;
    records[existingIdx] = record;
  } else {
    if (records.length > 0) {
      record.trend_gold = record.gold22k_1g - records[0].gold22k_1g;
      record.trend_silver = record.silver_1g - records[0].silver_1g;
    } else {
      record.trend_gold = null;
      record.trend_silver = null;
    }
    records.unshift(record);
  }

  writeHistory(records.slice(0, 90));
}

function buildRecord(gold22k_1g: number, silver_1g: number, source: string): LiveRateRecord {
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
  const apiKey = process.env["METALPRICE_API_KEY"];
  if (!apiKey) return null;
  try {
    const res = await fetch(
      `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=USD&currencies=XAU,XAG,INR`
    );
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
      fetch("https://api.gold-api.com/price/XAU"),
      fetch("https://api.gold-api.com/price/XAG"),
      fetch("https://api.frankfurter.app/latest?from=USD&to=INR"),
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

async function fetchLiveRatesUncached(): Promise<LiveRateRecord> {
  const metalprice = await fetchFromMetalpriceApi();
  if (metalprice) {
    appendToHistory(metalprice);
    return metalprice;
  }

  const goldApi = await fetchFromGoldApi();
  if (goldApi) {
    appendToHistory(goldApi);
    return goldApi;
  }

  const history = readHistory();
  if (history.length > 0) {
    return { ...history[0], source: `${history[0].source} (cached)` };
  }

  return buildRecord(13860, 270, "fallback-default");
}

// ── In-memory cache (30 min TTL) ─────────────────────────────────────────────
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

export function getRateHistory(): LiveRateRecord[] {
  const records = readHistory();
  if (records.length > 0) return records;
  if (cachedRate) return [cachedRate];
  return [];
}

export function getRateByDate(date: string): LiveRateRecord | null {
  return readHistory().find((r) => r.date === date) ?? null;
}

/** Override today's rate manually (admin use). Writes directly to history and busts cache. */
export function overrideRate(gold22k_1g: number, silver_1g: number): LiveRateRecord {
  const record: LiveRateRecord = {
    date: getTodayDateString(),
    gold22k_1g: Math.round(gold22k_1g),
    gold22k_8g: Math.round(gold22k_1g) * 8,
    silver_1g: Math.round(silver_1g),
    gold24k_1g: Math.round(gold22k_1g / GOLD_22K_PURITY),
    source: "admin-override",
    fetchedAt: new Date().toISOString(),
  };

  const history = readHistory();
  const existingIdx = history.findIndex((r) => r.date === record.date);
  if (existingIdx >= 0) {
    const prevRecord = history[existingIdx + 1];
    record.trend_gold = prevRecord ? record.gold22k_1g - prevRecord.gold22k_1g : null;
    record.trend_silver = prevRecord ? record.silver_1g - prevRecord.silver_1g : null;
    history[existingIdx] = record;
  } else {
    if (history.length > 0) {
      record.trend_gold = record.gold22k_1g - history[0].gold22k_1g;
      record.trend_silver = record.silver_1g - history[0].silver_1g;
    }
    history.unshift(record);
  }
  writeHistory(history.slice(0, 90));

  // Bust in-memory cache so next getLiveRates() returns this override
  cachedRate = record;
  cacheExpiry = Date.now() + CACHE_TTL_MS;

  return record;
}

/** Called once at server startup — fetch today's rate and schedule daily refresh */
export function scheduleDailyRateFetch(logger: { info: (...a: unknown[]) => void; error: (...a: unknown[]) => void }): void {
  // Fetch immediately on startup
  getLiveRates()
    .then((r) => logger.info({ source: r.source, gold22k: r.gold22k_1g, date: r.date }, "Live rates fetched on startup"))
    .catch((err) => logger.error({ err }, "Failed to fetch live rates on startup"));

  // Schedule a refresh every hour so the cache stays warm and history is updated
  setInterval(() => {
    // Force cache expiry so next getLiveRates() triggers a real fetch
    cacheExpiry = 0;
    getLiveRates()
      .then((r) => logger.info({ source: r.source, gold22k: r.gold22k_1g, date: r.date }, "Hourly live rate refresh"))
      .catch((err) => logger.error({ err }, "Failed to refresh live rates on schedule"));
  }, 60 * 60 * 1000);
}
