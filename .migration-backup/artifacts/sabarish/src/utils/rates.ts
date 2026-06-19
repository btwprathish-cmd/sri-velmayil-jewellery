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

export function getDerivedRates(rate: LiveRateRecord) {
  return {
    gold24k_1g: rate.gold24k_1g,
    gold18k_1g: Math.round(rate.gold22k_1g * (18 / 22)),
    silver_1kg: rate.silver_1g * 1000,
  };
}

export async function fetchLatestRate(): Promise<LiveRateRecord> {
  const res = await fetch("/api/rates/latest");
  if (!res.ok) throw new Error("Failed to fetch rates");
  return res.json();
}

export async function fetchRateHistory(): Promise<LiveRateRecord[]> {
  const res = await fetch("/api/rates/history");
  if (!res.ok) throw new Error("Failed to fetch rate history");
  return res.json();
}

export async function fetchRateByDate(date: string): Promise<LiveRateRecord | null> {
  const res = await fetch(`/api/rates/date/${date}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch rate");
  return res.json();
}
