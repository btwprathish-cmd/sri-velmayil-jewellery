import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  DEFAULT_POSTER_BRAND,
  type PosterBrandSettings,
} from "@/lib/poster-brand";

export type { PosterBrandSettings } from "@/lib/poster-brand";

const SETTINGS_PATH = path.join(process.cwd(), "data", "poster-brand-settings.json");

export function getDefaultPosterBrandSettings(): PosterBrandSettings {
  return { ...DEFAULT_POSTER_BRAND };
}

export async function readPosterBrandSettings(): Promise<PosterBrandSettings> {
  try {
    const raw = await readFile(SETTINGS_PATH, "utf-8");
    const parsed = JSON.parse(raw) as Partial<PosterBrandSettings>;
    return { ...DEFAULT_POSTER_BRAND, ...parsed };
  } catch {
    return { ...DEFAULT_POSTER_BRAND };
  }
}

export async function writePosterBrandSettings(
  settings: Partial<PosterBrandSettings>
): Promise<PosterBrandSettings> {
  const current = await readPosterBrandSettings();
  const next = { ...current, ...settings };
  await mkdir(path.dirname(SETTINGS_PATH), { recursive: true });
  try {
    await writeFile(SETTINGS_PATH, JSON.stringify(next, null, 2), "utf-8");
  } catch {
    // Vercel serverless FS may be read-only
  }
  return next;
}
