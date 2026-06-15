import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifySessionFromTokenEdge } from "@/utils/auth-edge";

const ADMIN_ONLY_PATHS = [
  "/poster-generator",
  "/admin/poster-studio",
];

const ADMIN_ONLY_API = [
  "/api/poster/artwork",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("velmayil_admin_session")?.value;
  const isAuthed = await verifySessionFromTokenEdge(token);

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (ADMIN_ONLY_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    if (!isAuthed) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("redirect", pathname === "/poster-generator" ? "/admin/poster-studio" : pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (pathname.startsWith("/api/admin") || ADMIN_ONLY_API.some((p) => pathname.startsWith(p))) {
    if (!isAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (pathname === "/poster-generator" && isAuthed) {
    return NextResponse.redirect(new URL("/admin/poster-studio", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/:path*",
    "/poster-generator",
    "/admin/poster-studio",
    "/api/poster/artwork",
  ],
};
