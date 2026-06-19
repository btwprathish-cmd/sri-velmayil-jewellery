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

export const FALLBACK_RATE: LiveRateRecord = {
  date: new Date().toISOString().split("T")[0],
  gold22k_1g: 13860,
  gold22k_8g: 110880,
  silver_1g: 270,
  gold24k_1g: 15131,
  source: "fallback",
  fetchedAt: new Date().toISOString(),
};

export function getDerivedRates(rate: LiveRateRecord) {
  return {
    gold24k_1g: rate.gold24k_1g,
    gold18k_1g: Math.round(rate.gold22k_1g * (18 / 22)),
    silver_1kg: rate.silver_1g * 1000,
  };
}

function getBaseUrl(): string {
  const domain = process.env.EXPO_PUBLIC_DOMAIN;
  if (domain) return `https://${domain}`;
  return "";
}

export async function fetchLatestRate(): Promise<LiveRateRecord> {
  const res = await fetch(`${getBaseUrl()}/api/rates/latest`);
  if (!res.ok) throw new Error("Failed to fetch rates");
  return res.json();
}

export async function fetchRateHistory(): Promise<LiveRateRecord[]> {
  const res = await fetch(`${getBaseUrl()}/api/rates/history`);
  if (!res.ok) throw new Error("Failed to fetch rate history");
  return res.json();
}

export function formatIndianDate(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  let suffix = "th";
  if (day === 1 || day === 21 || day === 31) suffix = "st";
  else if (day === 2 || day === 22) suffix = "nd";
  else if (day === 3 || day === 23) suffix = "rd";
  return `${day}${suffix} ${month} ${year}`;
}

export function formatINR(value: number): string {
  return `₹${Math.round(value).toLocaleString("en-IN")}`;
}
