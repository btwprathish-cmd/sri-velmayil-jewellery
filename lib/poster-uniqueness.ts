import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import type { PosterTheme } from "@/lib/poster-themes";
import { getThemeById } from "@/lib/poster-themes";

const HISTORY_PATH = path.join(process.cwd(), "data", "poster-generation-history.json");
const MAX_HISTORY = 100;

const VARIATIONS = {
  lighting: [
    "warm golden spotlight from upper left",
    "soft diffused studio lighting from above",
    "dramatic rim light with deep shadows",
    "candlelit warm ambient glow",
    "luxury showroom spotlight from center",
    "moody side lighting with teal shadows",
  ],
  composition: [
    "centered symmetrical composition",
    "slightly off-center with floral accent left",
    "close-up bust shot with shallow depth of field",
    "wide shot with jewellery as hero focal point",
    "three-quarter angle mannequin view",
    "elegant low angle looking up at necklace",
  ],
  atmosphere: [
    "dark teal luxury showroom like Tamil Nadu jewellery store",
    "deep burgundy velvet backdrop with gold accents",
    "moody peacock-inspired teal and emerald tones",
    "traditional South Indian wedding mandap atmosphere",
    "premium dark studio with bokeh gold particles",
    "temple festival warm amber atmosphere",
  ],
  flowers: [
    "pink dahlia flowers softly blurred on sides",
    "marigold garlands with green foliage",
    "white jasmine and rose petals scattered",
    "no flowers, pure dark luxury background",
    "delicate pink and yellow wildflowers on left",
    "peacock feather motifs subtly in background blur",
  ],
};

export interface PosterGenerationRecord {
  hash: string;
  themeId: string;
  seed: number;
  prompt: string;
  createdAt: string;
}

async function readHistory(): Promise<PosterGenerationRecord[]> {
  try {
    const raw = await readFile(HISTORY_PATH, "utf-8");
    return JSON.parse(raw) as PosterGenerationRecord[];
  } catch {
    return [];
  }
}

async function saveRecord(record: PosterGenerationRecord): Promise<void> {
  try {
    const history = await readHistory();
    history.unshift(record);
    const trimmed = history.slice(0, MAX_HISTORY);
    await mkdir(path.dirname(HISTORY_PATH), { recursive: true });
    await writeFile(HISTORY_PATH, JSON.stringify(trimmed, null, 2), "utf-8");
  } catch {
    // read-only FS on Vercel — skip persistence
  }
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

export function buildUniqueArtPrompt(theme: PosterTheme, seed: number): string {
  const lighting = pick(VARIATIONS.lighting, seed, 1);
  const composition = pick(VARIATIONS.composition, seed, 3);
  const atmosphere = pick(VARIATIONS.atmosphere, seed, 5);
  const flowers = pick(VARIATIONS.flowers, seed, 7);

  return [
    "Professional luxury jewellery campaign photography for Sri Velmayil Jewellery Tirupur",
    `${theme.name}: ${theme.jewelryItem}`,
    `displayed on ${theme.surface}`,
    atmosphere,
    `${theme.palette} colour palette`,
    lighting,
    composition,
    flowers,
    "dark teal or burgundy premium background matching South Indian gold jewellery aesthetic",
    "photorealistic, 8K quality, magazine advertisement style",
    "dramatic highlights on 22 karat gold jewellery",
    "NO text, NO logos, NO watermarks, NO brand names, NO price tags, NO poster layout",
    "artwork zone only: jewellery mannequin bust with necklace as hero",
    `unique creative variation seed ${seed}`,
  ].join(". ");
}

export async function generateUniqueSeed(themeId: string): Promise<number> {
  const history = await readHistory();
  const usedHashes = new Set(history.map((h) => h.hash));

  for (let attempt = 0; attempt < 20; attempt++) {
    const seed = Date.now() + Math.floor(Math.random() * 1_000_000) + attempt * 7919;
    const theme = getThemeById(themeId);
    const prompt = buildUniqueArtPrompt(theme, seed);
    const hash = createHash("sha256").update(`${themeId}:${seed}:${prompt.slice(0, 120)}`).digest("hex").slice(0, 16);
    if (!usedHashes.has(hash)) return seed;
  }
  return Date.now() + Math.floor(Math.random() * 9_999_999);
}

export async function recordGeneration(
  themeId: string,
  seed: number,
  prompt: string
): Promise<void> {
  const hash = createHash("sha256").update(`${themeId}:${seed}:${prompt}`).digest("hex").slice(0, 16);
  await saveRecord({
    hash,
    themeId,
    seed,
    prompt: prompt.slice(0, 500),
    createdAt: new Date().toISOString(),
  });
}

export async function isDuplicatePrompt(prompt: string): Promise<boolean> {
  const history = await readHistory();
  const hash = createHash("sha256").update(prompt).digest("hex").slice(0, 16);
  return history.some((h) => h.hash === hash);
}
