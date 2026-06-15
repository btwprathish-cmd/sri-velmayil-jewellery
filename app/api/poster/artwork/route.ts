import { NextResponse } from "next/server";

/** Legacy public route — artwork generation is admin-only. */
export async function POST() {
  return NextResponse.json(
    { error: "Poster artwork generation requires admin login" },
    { status: 401 }
  );
}
