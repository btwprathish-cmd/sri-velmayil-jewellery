import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import type { PosterTheme } from "@/lib/poster-themes";
import { getThemeById } from "@/lib/poster-themes";

const HISTORY_PATH = path.join(process.cwd(), "data", "poster-generation-history.json");
const MAX_HISTORY = 200;

const VARIATIONS = {
  lighting: [
    "warm golden spotlight from upper left like luxury jewellery ad",
    "soft diffused studio lighting with rim glow",
    "dramatic cinematic rim light, deep shadows",
    "warm candlelit ambient glow on gold",
    "center showroom spotlight on necklace",
    "moody side lighting with teal and gold reflections",
    "backlit halo glow behind mannequin bust",
    "soft morning window light with gold warmth",
  ],
  composition: [
    "centered symmetrical hero shot",
    "three-quarter angle mannequin bust",
    "close-up shallow depth of field on necklace",
    "elegant low angle looking up at jewellery",
    "slightly off-center with floral accent on left",
    "wide composition with jewellery as clear focal point",
  ],
  flowers: [
    "large pink dahlia flowers softly blurred left and right",
    "marigold garlands and green foliage accents",
    "white jasmine and rose petals scattered",
    "delicate pink and yellow wildflowers on sides",
    "peacock feather bokeh in deep background",
    "minimal florals, pure luxury dark backdrop",
  ],
  extraJewelry: [
    "matching jhumka earrings beside the bust",
    "layered haram and choker set",
    "diamond-studded bridal necklace with teardrop pendant",
    "temple gold choker with ruby and emerald stones",
    "antique kundan long necklace",
    "statement gold ring on velvet cushion in foreground blur",
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
    // read-only FS on Vercel
  }
}

function pick<T>(arr: T[], seed: number, offset: number): T {
  return arr[(seed + offset) % arr.length];
}

export function buildUniqueArtPrompt(theme: PosterTheme, seed: number): string {
  const lighting = pick(VARIATIONS.lighting, seed, 1);
  const composition = pick(VARIATIONS.composition, seed, 3);
  const flowers = pick(VARIATIONS.flowers, seed, 5);
  const extra = pick(VARIATIONS.extraJewelry, seed, 9);

  return [
    "Ultra photorealistic luxury South Indian jewellery product photography",
    "Professional commercial advertisement quality like ChatGPT DALL-E poster artwork",
    `Campaign theme: ${theme.name}`,
    `Hero piece: ${theme.jewelryItem}`,
    `Also feature: ${extra}`,
    `Displayed on ${theme.surface}`,
    `Colour palette: ${theme.palette}`,
    `Background atmosphere: ${theme.motifs}`,
    lighting,
    composition,
    flowers,
    "22 karat gold jewellery with realistic reflections and gemstone sparkle",
    "Premium Tamil Nadu jewellery showroom aesthetic",
    "Magazine cover quality, 8K detail, natural skin-tone mannequin if visible",
    "Absolutely NO text, NO numbers, NO logos, NO watermarks, NO brand names",
    "NO poster layout, NO rate cards, NO footer, NO typography of any kind",
    "Fill entire frame with jewellery scene — portrait crop 1080x1100 artwork zone",
    `Unique creative variation ID ${seed} — must look different from any previous poster`,
  ].join(". ");
}

export async function generateUniqueSeed(themeId: string): Promise<number> {
  const history = await readHistory();
  const usedHashes = new Set(history.map((h) => h.hash));

  for (let attempt = 0; attempt < 30; attempt++) {
    const seed = Date.now() + Math.floor(Math.random() * 9_999_999) + attempt * 12007;
    const theme = getThemeById(themeId);
    const prompt = buildUniqueArtPrompt(theme, seed);
    const hash = createHash("sha256").update(`${themeId}:${seed}:${prompt.slice(0, 160)}`).digest("hex").slice(0, 16);
    if (!usedHashes.has(hash)) return seed;
  }
  return Date.now() + Math.floor(Math.random() * 99_999_999);
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
