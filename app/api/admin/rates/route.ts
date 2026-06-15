import { NextResponse } from "next/server";
import { getLiveRates } from "@/lib/live-rates";
import { formatIndianDate } from "@/utils/date";

export const dynamic = "force-dynamic";

export async function GET() {
  const rate = await getLiveRates();
  return NextResponse.json({
    ...rate,
    dateDisplay: formatIndianDate(rate.date),
  });
}
