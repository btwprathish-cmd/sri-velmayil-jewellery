export interface PosterTheme {
  id: string;
  name: string;
  bg: string;
  bgGradient: string;
  accent: string;
  text: string;
  muted: string;
  jewelryItem: string;
  surface: string;
  palette: string;
  motifs: string;
}

export const POSTER_THEMES: PosterTheme[] = [
  {
    id: "peacock",
    name: "Peacock Jewellery Collection",
    bg: "#1a0b2e",
    bgGradient: "linear-gradient(180deg, #1a0b2e 0%, #0c0418 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#F3E5AB",
    jewelryItem: "peacock-inspired gold necklace with emerald and ruby stones",
    surface: "velvet jewellery bust",
    palette: "deep purple, emerald green, and gold",
    motifs: "peacock feather bokeh",
  },
  {
    id: "bridal",
    name: "Bridal Jewellery Collection",
    bg: "#6E1423",
    bgGradient: "linear-gradient(180deg, #6E1423 0%, #4a0818 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#F3E5AB",
    jewelryItem: "bridal diamond necklace with teardrop pendant",
    surface: "soft peach velvet jewellery bust",
    palette: "maroon, blush pink, and gold",
    motifs: "pink dahlia flowers",
  },
  {
    id: "temple",
    name: "Temple Jewellery Collection",
    bg: "#2d1f0a",
    bgGradient: "linear-gradient(180deg, #2d1f0a 0%, #1a1206 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#e8d5a3",
    jewelryItem: "traditional South Indian temple gold haram and choker set",
    surface: "antique brass display stand",
    palette: "antique gold, warm amber, and deep brown",
    motifs: "temple arch silhouette soft blur",
  },
  {
    id: "antique",
    name: "Antique Gold Collection",
    bg: "#1f1008",
    bgGradient: "linear-gradient(180deg, #1f1008 0%, #0d0804 100%)",
    accent: "#c9a227",
    text: "#ffffff",
    muted: "#c4a882",
    jewelryItem: "antique gold kundan necklace with oxidised finish",
    surface: "dark carved wooden mannequin bust",
    palette: "chocolate brown, antique gold, and cream",
    motifs: "vintage floral emboss pattern",
  },
  {
    id: "diamond",
    name: "Diamond Collection",
    bg: "#0a1628",
    bgGradient: "linear-gradient(180deg, #0a1628 0%, #050d18 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#8fa8c8",
    jewelryItem: "platinum diamond solitaire ring with brilliant cut stones",
    surface: "black reflective marble surface",
    palette: "midnight navy, silver, and diamond white",
    motifs: "soft spotlight bokeh",
  },
  {
    id: "wedding",
    name: "Wedding Collection",
    bg: "#4a0818",
    bgGradient: "linear-gradient(180deg, #4a0818 0%, #2d020d 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#F3E5AB",
    jewelryItem: "wedding gold bangle and necklace set with ruby accents",
    surface: "ivory silk draped display",
    palette: "burgundy, rose gold, and cream",
    motifs: "rose petals scattered",
  },
  {
    id: "luxury",
    name: "Premium Luxury Collection",
    bg: "#0c0418",
    bgGradient: "linear-gradient(180deg, #0c0418 0%, #1a0b2e 100%)",
    accent: "#F3E5AB",
    text: "#ffffff",
    muted: "#D4AF37",
    jewelryItem: "statement gold choker with cascading gemstones",
    surface: "black velvet luxury display bust",
    palette: "black, champagne gold, and pearl white",
    motifs: "golden light rays",
  },
  {
    id: "festival",
    name: "Festival Collection",
    bg: "#07221e",
    bgGradient: "linear-gradient(180deg, #07221e 0%, #020e0c 100%)",
    accent: "#D4AF37",
    text: "#ffffff",
    muted: "#a8d4c8",
    jewelryItem: "festive gold jhumka earrings and layered necklace",
    surface: "green silk with marigold garlands",
    palette: "emerald green, saffron orange, and gold",
    motifs: "marigold flowers and diyas soft glow",
  },
];

export function getThemeById(id: string): PosterTheme {
  return POSTER_THEMES.find((t) => t.id === id) ?? POSTER_THEMES[0];
}

export function pickNextTheme(lastThemeId: string | null, overrideId?: string): PosterTheme {
  if (overrideId) return getThemeById(overrideId);
  const pool = lastThemeId
    ? POSTER_THEMES.filter((t) => t.id !== lastThemeId)
    : POSTER_THEMES;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function buildArtPrompt(theme: PosterTheme): string {
  return [
    "Luxury South Indian jewellery product photography",
    `${theme.name} campaign`,
    `${theme.jewelryItem} on ${theme.surface}`,
    `${theme.palette} colour palette`,
    `${theme.motifs} softly blurred in background`,
    "dark teal and gold luxury showroom atmosphere",
    "dramatic spotlight on gold jewellery",
    "photorealistic studio quality",
    "no text, no logos, no watermarks, no brand names, no price tags",
    "no poster layout, no rate cards, no footer",
    "jewellery mannequin bust centered, flowers and foliage accents optional",
    "unique composition and lighting every time",
    "horizontal crop friendly 1080x1000 artwork zone only",
  ].join(", ");
}
