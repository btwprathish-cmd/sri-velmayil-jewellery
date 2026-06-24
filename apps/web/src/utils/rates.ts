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
    gold18k_1g: Math.round((rate.gold22k_1g * 18) / 22),
    silver_1kg: rate.silver_1g * 1000,
  };
}

export async function fetchLatestRate(): Promise<LiveRateRecord> {
  const response = await fetch("/api/rates/latest", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch latest rates");
  }

  return await response.json();
}

export async function fetchRateByDate(date: string): Promise<LiveRateRecord | null> {
  const response = await fetch(`/api/rates/date/${date}`);
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to fetch rate for date ${date}`);
  }
  return await response.json();
}

export async function fetchRateHistory(): Promise<LiveRateRecord[]> {
  const response = await fetch("/api/rates/history", {
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch rate history");
  }
  return await response.json();
}