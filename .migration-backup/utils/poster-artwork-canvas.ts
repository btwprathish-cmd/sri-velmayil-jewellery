import type { PosterTheme } from "@/lib/poster-themes";

/** High-quality reference-style artwork — no API needed. Matches maroon bridal sample. */
export function generateArtworkDataUrl(theme: PosterTheme, seed: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1100;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const c = ctx;

  const rng = (() => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  })();

  const maroon = theme.id === "velmayil-teal" ? "#4a0818" : theme.bg.startsWith("#") ? theme.bg : "#4a0818";
  const grad = ctx.createLinearGradient(0, 0, 0, 1100);
  grad.addColorStop(0, maroon);
  grad.addColorStop(0.5, "#3a0612");
  grad.addColorStop(1, "#2d020d");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1100);

  for (let i = 0; i < 18; i++) {
    const x = rng() * 1080;
    const y = rng() * 1100;
    const r = 50 + rng() * 120;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${0.02 + rng() * 0.05})`;
    ctx.fill();
  }

  const cx = 540;
  const cy = 520;

  function drawDahlia(fx: number, fy: number, scale: number, color: string) {
    c.save();
    c.translate(fx, fy);
    c.scale(scale, scale);
    for (let ring = 0; ring < 2; ring++) {
      const petals = 16;
      for (let p = 0; p < petals; p++) {
        const angle = (p / petals) * Math.PI * 2 + ring * 0.15;
        const px = Math.cos(angle) * (22 + ring * 10);
        const py = Math.sin(angle) * (22 + ring * 10);
        c.beginPath();
        c.ellipse(px, py, 14, 8, angle, 0, Math.PI * 2);
        c.fillStyle = color;
        c.globalAlpha = 0.88 - ring * 0.12;
        c.fill();
      }
    }
    c.globalAlpha = 1;
    c.beginPath();
    c.arc(0, 0, 10, 0, Math.PI * 2);
    c.fillStyle = "#ffd4a8";
    c.fill();
    c.restore();
  }

  const flowerColor = theme.id === "festival" ? "#ff9933" : "#e891a8";
  drawDahlia(cx - 220 - rng() * 30, cy + rng() * 40, 1.2 + rng() * 0.2, flowerColor);
  drawDahlia(cx + 220 + rng() * 30, cy + 20 + rng() * 30, 1.1 + rng() * 0.15, flowerColor);
  drawDahlia(cx + 120, cy - 180, 0.55 + rng() * 0.15, flowerColor);

  const bustPink = theme.id === "bridal" || theme.id === "wedding" ? "#d4a0a8" : "#c89098";
  const bustLight = "#e0b0b8";

  ctx.beginPath();
  ctx.ellipse(cx, cy + 90, 220, 175, 0, 0, Math.PI * 2);
  ctx.fillStyle = bustPink;
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy - 20, 135, 155, 0, 0, Math.PI * 2);
  ctx.fillStyle = bustLight;
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 45, cy - 75);
  ctx.quadraticCurveTo(cx, cy - 105, cx + 45, cy - 75);
  ctx.quadraticCurveTo(cx + 30, cy - 55, cx, cy - 50);
  ctx.quadraticCurveTo(cx - 30, cy - 55, cx - 45, cy - 75);
  ctx.fillStyle = "#e8c0c8";
  ctx.fill();

  const neckY = cy + 35;
  const silver = "#e8e8e8";
  const gem = "#ffffff";

  ctx.strokeStyle = silver;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, neckY, 175, 0.14 * Math.PI, 0.86 * Math.PI);
  ctx.stroke();

  const leafCount = 11 + Math.floor(rng() * 3);
  for (let i = 0; i < leafCount; i++) {
    const t = i / (leafCount - 1);
    const x = cx - 160 + t * 320;
    const y = neckY + Math.sin(t * Math.PI) * 52;
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 7, rng() * 0.5, 0, Math.PI * 2);
    ctx.fillStyle = silver;
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 5, 4, 0, Math.PI * 2);
    ctx.fillStyle = gem;
    ctx.fill();
  }

  const pendY = neckY + 55 + rng() * 12;
  ctx.strokeStyle = silver;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx, neckY + 30);
  ctx.lineTo(cx, pendY - 12);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, pendY);
  ctx.lineTo(cx - 14, pendY - 20);
  ctx.lineTo(cx + 14, pendY - 20);
  ctx.closePath();
  ctx.fillStyle = silver;
  ctx.fill();
  ctx.beginPath();
  ctx.arc(cx, pendY - 10, 9, 0, Math.PI * 2);
  ctx.fillStyle = gem;
  ctx.fill();

  const spot = ctx.createRadialGradient(cx, cy - 60, 30, cx, cy, 480);
  spot.addColorStop(0, "rgba(255,255,255,0.14)");
  spot.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, 1080, 1100);

  return canvas.toDataURL("image/jpeg", 0.94);
}
