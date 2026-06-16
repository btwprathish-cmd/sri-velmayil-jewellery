import { NextRequest, NextResponse } from "next/server";
import { verifySessionFromTokenEdge } from "@/utils/auth-edge";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const token = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("velmayil_admin_session="))?.split("=")[1];
  if (!(await verifySessionFromTokenEdge(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url).searchParams.get("url");
    if (!url) {
      return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
    }

    const allowedDomains = ["ideogram.ai", "img.ideogram.ai"];
    let hostname: string;
    try {
      hostname = new URL(url).hostname;
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const isAllowed = allowedDomains.some((domain) => hostname.endsWith(domain));
    if (!isAllowed) {
      return NextResponse.json({ error: "URL not allowed" }, { status: 403 });
    }

    const imageRes = await fetch(url);
    if (!imageRes.ok) {
      return NextResponse.json({ error: "Failed to fetch image" }, { status: 500 });
    }

    return new Response(imageRes.body, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": 'attachment; filename="gold-rate-poster.png"',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Download failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}