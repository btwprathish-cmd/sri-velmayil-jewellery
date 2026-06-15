import { getLiveRates, getRateHistory, getRateByDate, type LiveRateRecord } from "@/lib/live-rates";
import { formatIndianDate } from "@/utils/date";

export type { LiveRateRecord };

export async function getLatestRate(): Promise<LiveRateRecord> {
  return getLiveRates();
}

export async function getAllRates(): Promise<LiveRateRecord[]> {
  return getRateHistory();
}

export function getDerivedRates(rate: LiveRateRecord) {
  return {
    gold24k_1g: rate.gold24k_1g,
    gold18k_1g: Math.round(rate.gold22k_1g * (18 / 22)),
    silver_1kg: rate.silver_1g * 1000,
  };
}

export async function getFormattedLatestRate() {
  const rate = await getLatestRate();
  return {
    ...rate,
    dateDisplay: formatIndianDate(rate.date),
  };
}

export { getRateByDate, getRateHistory };
