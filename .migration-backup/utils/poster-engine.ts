import { BRAND } from "@/utils/brand";

export interface PosterRates {
  gold22k_1g: number;
  gold22k_8g: number;
  silver_1g: number;
  dateDisplay: string;
  date?: string;
  trend_gold?: number;
}

export interface PosterConfig {
  seed: number;
  layout: string;
  palette: ColorPalette;
  pattern: string;
  jewelryType: string;
  composition: string;
  flowerHue: string;
  typography: (typeof TYPOGRAPHY_STYLES)[number];
  width: number;
  height: number;
}

export interface ColorPalette {
  name: string;
  bg1: string;
  bg2: string;
  accent: string;
  accentLight: string;
  text: string;
  muted: string;
}

const JEWELRY_TYPES = ["necklace", "ring", "bangle", "earring", "pendant", "choker", "haram", "mangalsutra"] as const;
const COMPOSITIONS = ["center-focus", "top-heavy", "bottom-heavy", "diagonal-flow", "symmetric", "asymmetric"] as const;

const PALETTES: ColorPalette[] = [
  { name: "classic-maroon", bg1: "#5c0a1a", bg2: "#3d0612", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#F3E5AB" },
  { name: "burgundy-gold", bg1: "#4a0818", bg2: "#2d020d", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#e8d5a3" },
  { name: "royal-purple", bg1: "#1a0b2e", bg2: "#0c0418", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#F3E5AB" },
  { name: "emerald-luxe", bg1: "#07221e", bg2: "#020e0c", accent: "#D4AF37", accentLight: "#c9f0e8", text: "#ffffff", muted: "#a8d4c8" },
  { name: "midnight-teal", bg1: "#0a1f2e", bg2: "#051018", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#8ecae6" },
  { name: "chocolate-velvet", bg1: "#1f1008", bg2: "#0d0804", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#c4a882" },
  { name: "wine-noir", bg1: "#1a0510", bg2: "#0a0206", accent: "#e8c547", accentLight: "#F3E5AB", text: "#ffffff", muted: "#d4a0a8" },
  { name: "deep-navy", bg1: "#0a1628", bg2: "#050d18", accent: "#D4AF37", accentLight: "#F3E5AB", text: "#ffffff", muted: "#8fa8c8" },
  { name: "rose-gold", bg1: "#1f0f14", bg2: "#0f0709", accent: "#e8b4b8", accentLight: "#F3E5AB", text: "#ffffff", muted: "#d4a0a8" },
];

const LAYOUTS = ["velmayil-showroom", "velmayil-showroom", "velmayil-showroom", "classic-header", "bubble-rates", "split-panel", "minimal-luxury", "floral-accent"] as const;
const FLOWER_HUES = ["#e891a8", "#f4a0b8", "#d4789a", "#ffb6c8", "#e8a0c0"] as const;
const PATTERNS = ["radial-bokeh", "diagonal-lines", "dot-grid", "peacock-feather", "concentric-rings", "scattered-sparkle"] as const;

const TYPOGRAPHY_STYLES = [
  { heading: "Georgia, serif", body: "Arial, sans-serif", rateSize: 36, titleSize: 26, dateSize: 32, weight: "bold" },
  { heading: "'Times New Roman', serif", body: "Helvetica, sans-serif", rateSize: 38, titleSize: 24, dateSize: 30, weight: "800" },
  { heading: "Palatino, serif", body: "Verdana, sans-serif", rateSize: 34, titleSize: 28, dateSize: 34, weight: "bold" },
  { heading: "Garamond, serif", body: "Tahoma, sans-serif", rateSize: 40, titleSize: 22, dateSize: 28, weight: "700" },
  { heading: "'Book Antiqua', serif", body: "'Segoe UI', sans-serif", rateSize: 36, titleSize: 26, dateSize: 32, weight: "bold" },
  { heading: "Cambria, serif", body: "Calibri, sans-serif", rateSize: 42, titleSize: 24, dateSize: 30, weight: "900" },
] as const;

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807 + 0) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(this.next() * arr.length)];
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  int(min: number, max: number): number {
    return Math.floor(this.range(min, max + 1));
  }
}

function createUniqueSeed(): number {
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buf = new Uint32Array(2);
    crypto.getRandomValues(buf);
    return buf[0] * 0x100000000 + buf[1];
  }
  return Date.now() * 1000 + Math.floor(Math.random() * 1000000);
}

export function generatePosterConfig(seed?: number, format: "story" | "post" = "story"): PosterConfig {
  const actualSeed = seed ?? createUniqueSeed();
  const rng = new SeededRandom(actualSeed);

  const dims = format === "story"
    ? { width: 1080, height: 1920 }
    : { width: 1080, height: 1080 };

  return {
    seed: actualSeed,
    layout: "velmayil-showroom",
    palette: rng.pick(PALETTES.slice(0, 4)), // maroon/burgundy family preferred
    pattern: rng.pick(PATTERNS),
    jewelryType: rng.pick(JEWELRY_TYPES),
    composition: rng.pick(COMPOSITIONS),
    flowerHue: rng.pick(FLOWER_HUES),
    typography: rng.pick(TYPOGRAPHY_STYLES),
    ...dims,
  };
}

function fmt(n: number): string {
  return n.toLocaleString("en-IN");
}

function parsePosterDate(rates: PosterRates): { day: string; month: string; year: string } {
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
  let date: Date;
  if (rates.date) {
    date = new Date(rates.date);
  } else {
    const m = rates.dateDisplay.match(/(\d+)(?:st|nd|rd|th)?\s+(\w+)\s+(\d{4})/i);
    date = m ? new Date(`${m[1]} ${m[2]} ${m[3]}`) : new Date();
  }
  if (isNaN(date.getTime())) date = new Date();
  return {
    day: String(date.getDate()).padStart(2, "0"),
    month: months[date.getMonth()],
    year: String(date.getFullYear()),
  };
}

function renderPillBadge(x: number, y: number, label: string, fill: string, textColor: string): string {
  return `
    <rect x="${x}" y="${y}" width="52" height="24" rx="12" fill="${fill}"/>
    <text x="${x + 26}" y="${y + 17}" text-anchor="middle" fill="${textColor}" font-size="11" font-weight="bold" font-family="Arial, sans-serif">${label}</text>
  `;
}

function renderShowroomRateBar(config: PosterConfig, rates: PosterRates, y: number): string {
  const { palette, width: w, typography: t } = config;
  const boxX = 70;
  const boxW = w - 140;
  const boxH = 132;
  const colW = boxW / 3;

  const cols = [
    { badge: "1GM", sub: "22K", value: rates.gold22k_1g, badgeFill: palette.accent, badgeText: palette.bg2 },
    { badge: "8GM", sub: "22K", value: rates.gold22k_8g, badgeFill: palette.accent, badgeText: palette.bg2 },
    { badge: "1GM", sub: "SILVER", value: rates.silver_1g, badgeFill: "#c0c0c0", badgeText: "#333" },
  ];

  let colsSvg = "";
  cols.forEach((col, i) => {
    const cx = boxX + colW * i + colW / 2;
    colsSvg += `
      <g>
        ${renderPillBadge(cx - 26, y + 22, col.badge, col.badgeFill, col.badgeText)}
        <text x="${cx + 32}" y="${y + 40}" text-anchor="start" fill="${palette.accent}" font-size="13" font-weight="bold" font-family="Arial, sans-serif">${col.sub}</text>
        <text x="${cx}" y="${y + 98}" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize}" font-weight="${t.weight}" font-family="${t.body}">₹${fmt(col.value)}</text>
        ${i < 2 ? `<line x1="${boxX + colW * (i + 1)}" y1="${y + 18}" x2="${boxX + colW * (i + 1)}" y2="${y + boxH - 18}" stroke="${palette.accent}" stroke-width="1.5" stroke-dasharray="5,5" opacity="0.55"/>` : ""}
      </g>
    `;
  });

  return `
    <rect x="${boxX}" y="${y}" width="${boxW}" height="${boxH}" rx="14" fill="${palette.bg1}" fill-opacity="0.35" stroke="${palette.accent}" stroke-width="2"/>
    ${colsSvg}
  `;
}

function renderShowroomDateRow(config: PosterConfig, rates: PosterRates, y: number): string {
  const { palette, width: w, typography: t } = config;
  const d = parsePosterDate(rates);

  return `
    <g font-family="${t.body}">
      <text x="90" y="${y + 58}" fill="${palette.text}" font-size="72" font-weight="900">${d.day}</text>
      <text x="175" y="${y + 28}" fill="${palette.text}" font-size="22" font-weight="bold">${d.month}</text>
      <text x="175" y="${y + 58}" fill="${palette.text}" font-size="22" font-weight="bold">${d.year}</text>
      <text x="${w - 90}" y="${y + 22}" text-anchor="end" fill="${palette.text}" font-size="20" font-weight="normal" opacity="0.9">Today's</text>
      <text x="${w - 90}" y="${y + 58}" text-anchor="end" fill="${palette.text}" font-size="34" font-weight="900">GOLD RATE</text>
    </g>
  `;
}

function renderDahlia(cx: number, cy: number, scale: number, color: string, rng: SeededRandom): string {
  const petals = rng.int(14, 18);
  let svg = `<g transform="translate(${cx}, ${cy}) scale(${scale})">`;
  for (let ring = 0; ring < 2; ring++) {
    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2 + ring * 0.2;
      const px = Math.cos(angle) * (22 + ring * 10);
      const py = Math.sin(angle) * (22 + ring * 10);
      svg += `<ellipse cx="${px}" cy="${py}" rx="14" ry="8" fill="${color}" opacity="${0.85 - ring * 0.15}" transform="rotate(${angle * 57.3} ${px} ${py})"/>`;
    }
  }
  svg += `<circle cx="0" cy="0" r="10" fill="#ffd4a8" opacity="0.9"/>`;
  svg += `</g>`;
  return svg;
}

function renderJewelryBust(cx: number, cy: number, scale: number): string {
  const s = scale;
  return `
    <g transform="translate(${cx}, ${cy}) scale(${s})">
      <ellipse cx="0" cy="30" rx="95" ry="75" fill="#d4a0a8" opacity="0.95"/>
      <ellipse cx="0" cy="-20" rx="55" ry="65" fill="#e0b0b8"/>
      <path d="M-40,-55 Q0,-85 40,-55 Q30,-35 0,-30 Q-30,-35 -40,-55" fill="#e8c0c8"/>
      <ellipse cx="0" cy="95" rx="110" ry="25" fill="#000" opacity="0.15"/>
    </g>
  `;
}

function renderShowcaseNecklace(cx: number, cy: number, rng: SeededRandom): string {
  const silver = "#e8e8e8";
  const gem = "#ffffff";
  const leafCount = rng.int(9, 13);
  let svg = `<g transform="translate(${cx}, ${cy})">`;
  svg += `<path d="M-120,-10 Q0,80 120,-10" fill="none" stroke="${silver}" stroke-width="3"/>`;
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const x = -110 + t * 220;
    const y = -8 + Math.sin(t * Math.PI) * 35;
    const rot = rng.range(-30, 30);
    svg += `<ellipse cx="${x}" cy="${y}" rx="10" ry="6" fill="${silver}" stroke="${gem}" stroke-width="0.5" transform="rotate(${rot} ${x} ${y})"/>`;
    svg += `<circle cx="${x}" cy="${y - 4}" r="${rng.range(2, 4)}" fill="${gem}" opacity="0.95"/>`;
  }
  const pendY = 45 + rng.range(0, 15);
  svg += `<line x1="0" y1="25" x2="0" y2="${pendY - 10}" stroke="${silver}" stroke-width="2"/>`;
  svg += `<polygon points="0,${pendY} -12,${pendY - 18} 12,${pendY - 18}" fill="${silver}"/>`;
  svg += `<circle cx="0" cy="${pendY - 8}" r="8" fill="${gem}" opacity="0.95"/>`;
  svg += `</g>`;
  return svg;
}

function renderShowroomJewelryScene(config: PosterConfig, cx: number, cy: number, rng: SeededRandom): string {
  const flowerColor = config.flowerHue;
  const leftX = cx - rng.range(150, 190);
  const rightX = cx + rng.range(150, 190);
  const flowerY = cy + rng.range(-20, 30);
  const bustScale = rng.range(0.95, 1.08);

  return `
    ${renderDahlia(leftX, flowerY, rng.range(1.1, 1.4), flowerColor, rng)}
    ${renderDahlia(rightX, flowerY + rng.range(-15, 15), rng.range(1.0, 1.35), flowerColor, rng)}
    ${renderDahlia(cx + rng.range(80, 140), cy - rng.range(80, 120), rng.range(0.5, 0.75), flowerColor, rng)}
    ${renderJewelryBust(cx, cy + 40, bustScale)}
    ${renderShowcaseNecklace(cx, cy - 10, rng)}
  `;
}

function renderShowroomFooter(config: PosterConfig, _rates: PosterRates, y: number): string {
  const { palette, width: w, typography: t } = config;

  return `
    <g transform="translate(70, ${y + 20})">
      <circle cx="10" cy="0" r="10" fill="${palette.accent}" opacity="0.2"/>
      <text x="10" y="4" text-anchor="middle" fill="${palette.accent}" font-size="12">📞</text>
      <text x="30" y="5" fill="${palette.text}" font-size="16" font-weight="bold" font-family="${t.body}">${BRAND.phone}</text>
      <text x="0" y="38" fill="${palette.muted}" font-size="13" font-family="${t.body}">📍 ${BRAND.address}</text>
    </g>
    <g transform="translate(${w - 120}, ${y + 10})">
      <polygon points="0,-14 -16,14 16,14" fill="none" stroke="${palette.accent}" stroke-width="2"/>
      <text x="0" y="32" text-anchor="middle" fill="${palette.accent}" font-size="10" font-weight="bold" font-family="Arial, sans-serif">${BRAND.hallmark}</text>
    </g>
  `;
}

function renderVelmayilShowroom(config: PosterConfig, rates: PosterRates, rng: SeededRandom): string {
  const { width: w, height: h } = config;
  return `
    ${renderBrandHeader(config, 100)}
    ${renderShowroomDateRow(config, rates, 230)}
    ${renderShowroomRateBar(config, rates, 340)}
    ${renderShowroomJewelryScene(config, w / 2, 920, rng)}
    ${renderShowroomFooter(config, rates, h - 130)}
  `;
}

function renderBackground(config: PosterConfig, rng: SeededRandom): string {
  const { palette, pattern, width: w, height: h } = config;
  let bg = `<rect width="${w}" height="${h}" fill="url(#bgGrad)"/>`;

  if (pattern === "radial-bokeh") {
    for (let i = 0; i < 12; i++) {
      const cx = rng.range(0, w);
      const cy = rng.range(0, h);
      const r = rng.range(40, 200);
      const op = rng.range(0.03, 0.12);
      bg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${palette.accent}" opacity="${op}"/>`;
    }
  } else if (pattern === "diagonal-lines") {
    for (let i = -h; i < w + h; i += 40) {
      bg += `<line x1="${i}" y1="0" x2="${i + h}" y2="${h}" stroke="${palette.accent}" stroke-width="0.5" opacity="0.06"/>`;
    }
  } else if (pattern === "dot-grid") {
    for (let x = 30; x < w; x += 50) {
      for (let y = 30; y < h; y += 50) {
        bg += `<circle cx="${x + rng.range(-5, 5)}" cy="${y + rng.range(-5, 5)}" r="1.5" fill="${palette.accent}" opacity="${rng.range(0.05, 0.15)}"/>`;
      }
    }
  } else if (pattern === "peacock-feather") {
    for (let i = 0; i < 8; i++) {
      const cx = rng.range(0, w);
      const cy = rng.range(0, h);
      bg += `<ellipse cx="${cx}" cy="${cy}" rx="${rng.range(30, 80)}" ry="${rng.range(60, 150)}" fill="none" stroke="${palette.accent}" stroke-width="1" opacity="0.08" transform="rotate(${rng.range(0, 360)} ${cx} ${cy})"/>`;
    }
  } else if (pattern === "concentric-rings") {
    const cx = w / 2;
    const cy = h * 0.45;
    for (let r = 100; r < 600; r += 60) {
      bg += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${palette.accent}" stroke-width="0.8" opacity="${0.15 - r * 0.0002}"/>`;
    }
  } else if (pattern === "scattered-sparkle") {
    for (let i = 0; i < 30; i++) {
      const x = rng.range(0, w);
      const y = rng.range(0, h);
      const s = rng.range(2, 6);
      bg += `<polygon points="${x},${y - s} ${x + s},${y} ${x},${y + s} ${x - s},${y}" fill="${palette.accentLight}" opacity="${rng.range(0.1, 0.4)}"/>`;
    }
  }

  return bg;
}

function renderLogo(cx: number, cy: number, scale: number): string {
  const s = scale;
  return `
    <g transform="translate(${cx}, ${cy}) scale(${s})">
      <circle cx="0" cy="0" r="50" fill="none" stroke="url(#goldGrad)" stroke-width="3"/>
      <path d="M0,-35 L6,-18 L0,-22 L-6,-18 Z" fill="url(#goldGrad)"/>
      <rect x="-2" y="-22" width="4" height="14" fill="url(#goldGrad)"/>
      <ellipse cx="0" cy="5" rx="14" ry="18" fill="url(#goldGrad)"/>
      <circle cx="0" cy="-10" r="9" fill="url(#goldGrad)"/>
      <g fill="none" stroke="url(#goldGrad)" stroke-width="2" opacity="0.8">
        <path d="M-12,8 Q-28,-5 -32,-22"/>
        <path d="M-6,12 Q-16,-2 -18,-25"/>
        <path d="M0,14 Q0,-2 0,-28"/>
        <path d="M6,12 Q16,-2 18,-25"/>
        <path d="M12,8 Q28,-5 32,-22"/>
      </g>
    </g>
  `;
}

function renderBrandHeader(config: PosterConfig, y: number): string {
  const { palette, width: w, typography: t } = config;
  return `
    ${renderLogo(w / 2, y, 0.55)}
    <text x="${w / 2}" y="${y + 65}" text-anchor="middle" fill="url(#goldGrad)" font-size="${t.titleSize}" font-family="${t.heading}" font-weight="${t.weight}" letter-spacing="3">${BRAND.name.toUpperCase()}</text>
    <text x="${w / 2}" y="${y + 92}" text-anchor="middle" fill="${palette.muted}" font-size="13" font-family="${t.body}" letter-spacing="8" opacity="0.85">— ${BRAND.location.toUpperCase()} —</text>
  `;
}

function renderRateBoxesClassic(config: PosterConfig, rates: PosterRates, y: number): string {
  const { palette, width: w, typography: t } = config;
  const boxW = 300;
  const gap = 30;
  const startX = (w - boxW * 3 - gap * 2) / 2;

  const boxes = [
    { label: "1GM 22K", value: rates.gold22k_1g },
    { label: "8GM 22K", value: rates.gold22k_8g },
    { label: "1GM SILVER", value: rates.silver_1g },
  ];

  return boxes.map((box, i) => {
    const x = startX + i * (boxW + gap);
    return `
      <g transform="translate(${x}, ${y})">
        <rect width="${boxW}" height="120" rx="8" fill="${palette.bg1}" fill-opacity="0.6" stroke="${palette.accent}" stroke-width="2"/>
        <text x="${boxW / 2}" y="35" text-anchor="middle" fill="${palette.accentLight}" font-size="14" font-weight="bold" letter-spacing="1">${box.label}</text>
        <text x="${boxW / 2}" y="80" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize}" font-weight="${t.weight}" font-family="${t.heading}">₹${fmt(box.value)}</text>
        ${i < 2 ? `<line x1="${boxW}" y1="20" x2="${boxW}" y2="100" stroke="${palette.accent}" stroke-width="1" stroke-dasharray="4,4" opacity="0.4"/>` : ""}
      </g>
    `;
  }).join("");
}

function renderBubbleRates(config: PosterConfig, rates: PosterRates, cy: number): string {
  const { palette, width: w, typography: t } = config;
  const cx = w / 2;

  return `
    <g transform="translate(${cx}, ${cy})">
      <circle cx="0" cy="-180" r="150" fill="${palette.bg1}" fill-opacity="0.7" stroke="${palette.accent}" stroke-width="4"/>
      <text x="0" y="-220" text-anchor="middle" fill="${palette.accentLight}" font-size="16" font-weight="bold">8GM</text>
      <text x="0" y="-165" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize + 6}" font-weight="${t.weight}" font-family="${t.heading}">₹${fmt(rates.gold22k_8g)}</text>
      <text x="0" y="-130" text-anchor="middle" fill="${palette.muted}" font-size="14" font-weight="bold">22K</text>

      <circle cx="-170" cy="80" r="115" fill="${palette.bg1}" fill-opacity="0.7" stroke="${palette.accent}" stroke-width="3"/>
      <text x="-170" y="50" text-anchor="middle" fill="${palette.accentLight}" font-size="14" font-weight="bold">1GM</text>
      <text x="-170" y="95" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize - 6}" font-weight="${t.weight}" font-family="${t.heading}">₹${fmt(rates.gold22k_1g)}</text>
      <text x="-170" y="125" text-anchor="middle" fill="${palette.muted}" font-size="12" font-weight="bold">22K</text>

      <circle cx="170" cy="80" r="115" fill="${palette.bg1}" fill-opacity="0.7" stroke="${palette.accent}" stroke-width="3"/>
      <text x="170" y="50" text-anchor="middle" fill="${palette.accentLight}" font-size="14" font-weight="bold">1GM</text>
      <text x="170" y="95" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize - 6}" font-weight="${t.weight}" font-family="${t.heading}">₹${fmt(rates.silver_1g)}</text>
      <text x="170" y="125" text-anchor="middle" fill="${palette.muted}" font-size="12" font-weight="bold">SILVER</text>
    </g>
  `;
}

function renderLayeredCards(config: PosterConfig, rates: PosterRates, y: number): string {
  const { palette, width: w, typography: t } = config;
  return `
    <g transform="translate(${w / 2}, ${y})">
      <g transform="translate(-220, 0)">
        <rect x="0" y="0" width="200" height="90" rx="12" fill="${palette.bg1}" stroke="${palette.accent}" stroke-width="2"/>
        <text x="100" y="28" text-anchor="middle" fill="${palette.accentLight}" font-size="12" font-weight="bold">Gold Rate 1GM 22K</text>
        <text x="100" y="65" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize - 8}" font-weight="${t.weight}" font-family="${t.heading}">₹ ${fmt(rates.gold22k_1g)}</text>
      </g>
      <g transform="translate(20, 0)">
        <rect x="0" y="0" width="200" height="90" rx="12" fill="${palette.bg1}" stroke="${palette.accent}" stroke-width="2"/>
        <text x="100" y="28" text-anchor="middle" fill="${palette.accentLight}" font-size="12" font-weight="bold">Gold Rate 8GM 22K</text>
        <text x="100" y="65" text-anchor="middle" fill="${palette.text}" font-size="${t.rateSize - 8}" font-weight="${t.weight}" font-family="${t.heading}">₹ ${fmt(rates.gold22k_8g)}</text>
      </g>
      <g transform="translate(-90, 110)">
        <rect x="0" y="0" width="180" height="50" rx="25" fill="${palette.accent}" fill-opacity="0.15" stroke="${palette.accent}" stroke-width="1.5"/>
        <text x="90" y="32" text-anchor="middle" fill="${palette.text}" font-size="18" font-weight="bold">Silver 1GM ₹ ${fmt(rates.silver_1g)}</text>
      </g>
    </g>
  `;
}

function renderDateHeader(config: PosterConfig, rates: PosterRates, y: number, align: "left" | "center" = "center"): string {
  const { palette, width: w, typography: t } = config;
  const x = align === "left" ? 80 : w / 2;
  const anchor = align === "left" ? "start" : "middle";

  return `
    <text x="${x}" y="${y}" text-anchor="${anchor}" fill="${palette.muted}" font-size="18" font-family="${t.body}">Today's</text>
    <text x="${align === "left" ? x + 120 : x}" y="${y}" text-anchor="${align === "left" ? "start" : "middle"}" fill="${palette.text}" font-size="22" font-weight="${t.weight}" font-family="${t.body}"> GOLD RATE</text>
    <text x="${x}" y="${y + 45}" text-anchor="${anchor}" fill="${palette.text}" font-size="${t.dateSize}" font-weight="${t.weight}" font-family="${t.heading}">${rates.dateDisplay.toUpperCase()}</text>
  `;
}

function renderProceduralJewelry(config: PosterConfig, cx: number, cy: number, size: number, rng: SeededRandom): string {
  const { palette, jewelryType } = config;
  const r = size / 2;
  const gold = palette.accent;
  const light = palette.accentLight;
  const strokeW = rng.range(2, 4);
  const gemCount = rng.int(3, 8);
  let svg = `<g transform="translate(${cx}, ${cy})">`;

  if (jewelryType === "necklace" || jewelryType === "choker") {
    const curve = rng.range(80, 120);
    svg += `<path d="M-${curve},-${r * 0.3} Q0,${r * 0.6} ${curve},-${r * 0.3}" fill="none" stroke="${gold}" stroke-width="${strokeW + 2}"/>`;
    for (let i = 0; i < gemCount; i++) {
      const angle = (i / gemCount) * Math.PI;
      const gx = Math.cos(angle + Math.PI) * curve * 0.85;
      const gy = Math.sin(angle + Math.PI) * r * 0.15 - r * 0.1;
      svg += `<circle cx="${gx}" cy="${gy}" r="${rng.range(4, 8)}" fill="${light}" opacity="0.9"/>`;
    }
    svg += `<circle cx="0" cy="${r * 0.35}" r="${rng.range(10, 16)}" fill="${gold}" stroke="${light}" stroke-width="1"/>`;
  } else if (jewelryType === "ring") {
    svg += `<circle cx="0" cy="0" r="${r * 0.45}" fill="none" stroke="${gold}" stroke-width="${strokeW + 3}"/>`;
    const prong = rng.range(8, 14);
    svg += `<polygon points="0,-${prong} -${prong * 0.6},0 ${prong * 0.6},0" fill="${light}"/>`;
    svg += `<circle cx="0" cy="-${prong * 0.3}" r="${rng.range(5, 9)}" fill="${light}" opacity="0.95"/>`;
  } else if (jewelryType === "bangle") {
    svg += `<circle cx="-${r * 0.2}" cy="0" r="${r * 0.5}" fill="none" stroke="${gold}" stroke-width="${strokeW + 4}"/>`;
    svg += `<circle cx="${r * 0.2}" cy="0" r="${r * 0.5}" fill="none" stroke="${gold}" stroke-width="${strokeW + 4}"/>`;
    for (let i = 0; i < gemCount; i++) {
      const a = (i / gemCount) * Math.PI * 2;
      svg += `<circle cx="${Math.cos(a) * r * 0.5}" cy="${Math.sin(a) * r * 0.5}" r="3" fill="${light}"/>`;
    }
  } else if (jewelryType === "haram" || jewelryType === "mangalsutra") {
    const layers = rng.int(2, 4);
    for (let l = 0; l < layers; l++) {
      const yOff = l * 25;
      svg += `<ellipse cx="0" cy="${yOff}" rx="${r * 0.4 - l * 5}" ry="${r * 0.15}" fill="none" stroke="${gold}" stroke-width="${strokeW}"/>`;
    }
    svg += `<circle cx="0" cy="${r * 0.5}" r="${rng.range(12, 18)}" fill="${gold}" stroke="${light}" stroke-width="1"/>`;
  } else if (jewelryType === "earring") {
    svg += `<line x1="0" y1="-${r * 0.5}" x2="0" y2="-${r * 0.1}" stroke="${gold}" stroke-width="2"/>`;
    svg += `<circle cx="0" cy="${r * 0.15}" r="${r * 0.35}" fill="none" stroke="${gold}" stroke-width="${strokeW}"/>`;
    svg += `<circle cx="0" cy="${r * 0.15}" r="${rng.range(6, 12)}" fill="${light}" opacity="0.8"/>`;
  } else {
    // pendant
    svg += `<path d="M0,-${r * 0.5} L-${r * 0.25},${r * 0.1} L${r * 0.25},${r * 0.1} Z" fill="${gold}"/>`;
    svg += `<ellipse cx="0" cy="${r * 0.35}" rx="${r * 0.3}" ry="${r * 0.4}" fill="none" stroke="${gold}" stroke-width="${strokeW}"/>`;
    svg += `<circle cx="0" cy="${r * 0.35}" r="${rng.range(8, 14)}" fill="${light}" opacity="0.85"/>`;
  }

  svg += `</g>`;
  // Glow backdrop
  return `
    <circle cx="${cx}" cy="${cy}" r="${r + 10}" fill="${gold}" opacity="0.08"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${gold}" stroke-width="2" opacity="0.4"/>
    ${svg}
  `;
}

function renderJewelryVisual(config: PosterConfig, cx: number, cy: number, size: number, rng: SeededRandom): string {
  return renderProceduralJewelry(config, cx, cy, size, rng);
}

function renderFloralAccents(config: PosterConfig, rng: SeededRandom): string {
  const { palette, width: w, height: h } = config;
  let flowers = "";
  for (let i = 0; i < 4; i++) {
    const x = i % 2 === 0 ? rng.range(40, 150) : rng.range(w - 150, w - 40);
    const y = rng.range(h * 0.35, h * 0.65);
    const petals = rng.int(5, 8);
    for (let p = 0; p < petals; p++) {
      const angle = (p / petals) * Math.PI * 2;
      const px = x + Math.cos(angle) * 20;
      const py = y + Math.sin(angle) * 20;
      flowers += `<ellipse cx="${px}" cy="${py}" rx="12" ry="8" fill="${palette.accent}" opacity="0.12" transform="rotate(${angle * 57.3} ${px} ${py})"/>`;
    }
    flowers += `<circle cx="${x}" cy="${y}" r="8" fill="${palette.accentLight}" opacity="0.2"/>`;
  }
  return flowers;
}

function renderFooter(config: PosterConfig, y: number): string {
  const { palette, width: w } = config;
  return `
    <rect x="0" y="${y - 20}" width="${w}" height="120" fill="${palette.bg1}" fill-opacity="0.85"/>
    <line x1="60" y1="${y}" x2="${w - 60}" y2="${y}" stroke="${palette.accent}" stroke-width="1" opacity="0.3"/>
    <g transform="translate(80, ${y + 35})">
      <polygon points="0,-12 -14,12 14,12" fill="none" stroke="${palette.accent}" stroke-width="2"/>
      <text x="0" y="28" text-anchor="middle" fill="${palette.accent}" font-size="9" font-weight="bold">${BRAND.hallmark}</text>
    </g>
    <text x="${w / 2}" y="${y + 40}" text-anchor="middle" fill="${palette.text}" font-size="16" font-weight="bold">📞 ${BRAND.phone}</text>
    <text x="${w - 80}" y="${y + 35}" text-anchor="end" fill="${palette.muted}" font-size="12" opacity="0.85">📍 ${BRAND.address}</text>
  `;
}

export function generatePosterSvg(config: PosterConfig, rates: PosterRates): string {
  const rng = new SeededRandom(config.seed + 42);
  const { palette, layout, width: w, height: h } = config;
  const isStory = h > w;

  let content = "";

  if (layout === "velmayil-showroom") {
    content += renderVelmayilShowroom(config, rates, rng);
  } else if (layout === "classic-header") {
    content += renderBrandHeader(config, isStory ? 120 : 80);
    content += renderDateHeader(config, rates, isStory ? 280 : 200, "left");
    content += renderRateBoxesClassic(config, rates, isStory ? 340 : 260);
    content += renderJewelryVisual(config, w / 2, isStory ? 900 : 650, isStory ? 280 : 200, rng);
    content += renderFloralAccents(config, rng);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "bubble-rates") {
    content += `<text x="${w / 2}" y="${isStory ? 80 : 60}" text-anchor="middle" fill="${palette.text}" font-size="24" font-weight="bold" letter-spacing="2">TODAY'S GOLD RATE</text>`;
    content += `<text x="${w / 2}" y="${isStory ? 120 : 95}" text-anchor="middle" fill="${palette.accent}" font-size="28" font-weight="bold" font-family="Georgia, serif">${rates.dateDisplay}</text>`;
    content += renderBubbleRates(config, rates, isStory ? 480 : 380);
    content += renderJewelryVisual(config, w / 2, isStory ? 1050 : 750, isStory ? 200 : 150, rng);
    content += renderBrandHeader(config, isStory ? 1350 : 920);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "split-panel") {
    content += renderBrandHeader(config, isStory ? 100 : 70);
    content += renderJewelryVisual(config, w / 2, isStory ? 550 : 400, isStory ? 320 : 220, rng);
    content += renderFloralAccents(config, rng);
    content += renderDateHeader(config, rates, isStory ? 820 : 580);
    content += renderLayeredCards(config, rates, isStory ? 900 : 640);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "minimal-luxury") {
    content += `<rect x="30" y="30" width="${w - 60}" height="${h - 60}" fill="none" stroke="${palette.accent}" stroke-width="2" opacity="0.4"/>`;
    content += renderBrandHeader(config, isStory ? 130 : 90);
    content += renderDateHeader(config, rates, isStory ? 300 : 220);
    content += renderRateBoxesClassic(config, rates, isStory ? 380 : 290);
    content += renderJewelryVisual(config, w / 2, isStory ? 850 : 620, isStory ? 250 : 180, rng);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "floral-accent") {
    content += renderFloralAccents(config, rng);
    content += renderBrandHeader(config, isStory ? 110 : 80);
    content += renderJewelryVisual(config, w / 2, isStory ? 520 : 380, isStory ? 300 : 200, rng);
    content += renderDateHeader(config, rates, isStory ? 750 : 540);
    content += renderLayeredCards(config, rates, isStory ? 830 : 600);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "geometric") {
    const frameY = isStory ? 250 : 180;
    content += `<polygon points="${w / 2},${frameY} ${w - 60},${frameY + 200} ${w - 60},${isStory ? 1100 : 800} 60,${isStory ? 1100 : 800} 60,${frameY + 200}" fill="none" stroke="${palette.accent}" stroke-width="2" opacity="0.3"/>`;
    content += renderBrandHeader(config, isStory ? 100 : 70);
    content += renderJewelryVisual(config, w / 2, isStory ? 600 : 440, isStory ? 260 : 180, rng);
    content += renderRateBoxesClassic(config, rates, isStory ? 1250 : 880);
    content += renderDateHeader(config, rates, isStory ? 1180 : 820);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else if (layout === "radial-glow") {
    content += `<circle cx="${w / 2}" cy="${h * 0.45}" r="${isStory ? 400 : 300}" fill="${palette.accent}" opacity="0.06"/>`;
    content += `<circle cx="${w / 2}" cy="${h * 0.45}" r="${isStory ? 250 : 180}" fill="${palette.accent}" opacity="0.04"/>`;
    content += renderBrandHeader(config, isStory ? 110 : 80);
    content += renderBubbleRates(config, rates, isStory ? 500 : 370);
    content += renderJewelryVisual(config, w / 2, isStory ? 1050 : 750, isStory ? 180 : 130, rng);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  } else {
    // layered-cards default
    content += renderBrandHeader(config, isStory ? 110 : 80);
    content += renderDateHeader(config, rates, isStory ? 280 : 200);
    content += renderLayeredCards(config, rates, isStory ? 350 : 260);
    content += renderJewelryVisual(config, w / 2, isStory ? 750 : 550, isStory ? 300 : 200, rng);
    content += renderFloralAccents(config, rng);
    content += renderFooter(config, isStory ? h - 80 : h - 60);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
  viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${palette.bg1}"/>
      <stop offset="100%" stop-color="${palette.bg2}"/>
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${palette.accent}"/>
      <stop offset="50%" stop-color="${palette.accentLight}"/>
      <stop offset="100%" stop-color="${palette.accent}"/>
    </linearGradient>
  </defs>
  ${renderBackground(config, rng)}
  ${content}
</svg>`;
}
