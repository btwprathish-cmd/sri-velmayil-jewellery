import { NextResponse } from "next/server";
import { readPosterBrandSettings } from "@/lib/poster-brand-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await readPosterBrandSettings();
  return NextResponse.json(settings);
}
