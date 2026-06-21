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
  const response = await fetch(
    "https://drhint.com/api/public/hooks/gold-rates",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch rates");
  }

  const data = await response.json();

  const gold24k = Number(data?.perGram24kInr);

  if (!gold24k || Number.isNaN(gold24k)) {
    throw new Error("Invalid gold rate received");
  }

  const gold22k = Math.round((gold24k * 22) / 24);

  return {
    date: new Date().toISOString().split("T")[0]!,
    gold22k_1g: gold22k,
    gold22k_8g: gold22k * 8,
    silver_1g: 270,
    gold24k_1g: Math.round(gold24k),
    source: "drhint",
    fetchedAt: new Date().toISOString(),
    trend_gold: null,
    trend_silver: null,
  };
}

export async function fetchRateHistory(): Promise<LiveRateRecord[]> {
  const res = await fetch("/api/rates/history", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch rate history");
  }

  return await res.json();
}

export async function fetchRateByDate(
  date: string
): Promise<LiveRateRecord | null> {
  const res = await fetch(`/api/rates/date/${date}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to fetch rate");
  }

  return await res.json();
}
