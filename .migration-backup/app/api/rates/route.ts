import { NextResponse } from "next/server";
import { getFormattedLatestRate } from "@/utils/rates";

export const dynamic = "force-dynamic";

export async function GET() {
  const rate = await getFormattedLatestRate();
  return NextResponse.json(rate);
}
