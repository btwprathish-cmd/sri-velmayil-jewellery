import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionFromTokenEdge } from "@/utils/auth-edge";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = request.cookies.get("velmayil_admin_session")?.value;
    if (!(await verifySessionFromTokenEdge(token))) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("velmayil_admin_session")?.value;
    if (!(await verifySessionFromTokenEdge(token))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
