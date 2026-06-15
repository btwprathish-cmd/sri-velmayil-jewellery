import { NextResponse } from "next/server";
import { fetchLatestRatesDirect } from "@/lib/live-rates";
import { verifySessionFromTokenEdge } from "@/utils/auth-edge";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const token = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("velmayil_admin_session="))?.split("=")[1];
  if (!(await verifySessionFromTokenEdge(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const rate = await fetchLatestRatesDirect();
    return NextResponse.json({
      gold22k_1g: rate.gold22k_1g,
      gold22k_8g: rate.gold22k_8g,
      silver_1g: rate.silver_1g,
      fetchedAt: rate.fetchedAt,
      source: rate.source,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch rates";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}