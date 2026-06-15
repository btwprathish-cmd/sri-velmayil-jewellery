import { NextRequest, NextResponse } from "next/server";
import { verifyCredentials, setSessionCookie, isProductionAuthConfigured } from "@/utils/auth";
import { checkRateLimit, recordFailedAttempt, clearRateLimit, getClientIp } from "@/utils/rate-limit";

export async function POST(request: NextRequest) {
  try {
    if (!isProductionAuthConfigured()) {
      return NextResponse.json(
        { error: "Admin authentication is not configured for production" },
        { status: 503 }
      );
    }

    const ip = getClientIp(request);
    const limit = await checkRateLimit(ip);

    if (!limit.allowed) {
      return NextResponse.json(
        { error: `Too many login attempts. Try again in ${limit.retryAfterSec} seconds.` },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSec ?? 1800) } }
      );
    }

    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });
    }

    if (!verifyCredentials(username, password)) {
      await recordFailedAttempt(ip);
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    await clearRateLimit(ip);
    await setSessionCookie(username);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
