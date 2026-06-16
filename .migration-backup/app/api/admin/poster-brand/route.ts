import { NextRequest, NextResponse } from "next/server";
import {
  readPosterBrandSettings,
  writePosterBrandSettings,
  type PosterBrandSettings,
} from "@/lib/poster-brand-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await readPosterBrandSettings();
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<PosterBrandSettings>;
    const allowed: (keyof PosterBrandSettings)[] = [
      "logo",
      "phone",
      "address",
      "hallmarkImage",
      "hallmarkLabel",
    ];
    const patch: Partial<PosterBrandSettings> = {};
    for (const key of allowed) {
      if (typeof body[key] === "string" && body[key]!.trim()) {
        patch[key] = body[key]!.trim();
      }
    }
    const settings = await writePosterBrandSettings(patch);
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to save brand settings" }, { status: 500 });
  }
}
