import type { PosterTheme } from "@/lib/poster-themes";

/** Client-side fallback artwork for the centre zone only (1080×1000). */
export function generateArtworkDataUrl(theme: PosterTheme, seed: number): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1000;
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";

  const rng = (() => {
    let s = seed;
    return () => {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  })();

  const grad = ctx.createLinearGradient(0, 0, 0, 1000);
  grad.addColorStop(0, theme.bg);
  grad.addColorStop(1, "#000000");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1000);

  for (let i = 0; i < 20; i++) {
    const x = rng() * 1080;
    const y = rng() * 1000;
    const r = 30 + rng() * 120;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${0.03 + rng() * 0.08})`;
    ctx.fill();
  }

  const cx = 540;
  const cy = 520;

  if (theme.id === "bridal" || theme.id === "wedding" || theme.id === "festival") {
    for (const side of [-1, 1]) {
      const fx = cx + side * (180 + rng() * 40);
      const fy = cy + rng() * 60 - 30;
      for (let p = 0; p < 16; p++) {
        const angle = (p / 16) * Math.PI * 2;
        const px = fx + Math.cos(angle) * 35;
        const py = fy + Math.sin(angle) * 35;
        ctx.beginPath();
        ctx.ellipse(px, py, 18, 10, angle, 0, Math.PI * 2);
        ctx.fillStyle = theme.id === "festival" ? "#ff9933" : "#e891a8";
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(fx, fy, 12, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd4a8";
      ctx.fill();
    }
  }

  ctx.beginPath();
  ctx.ellipse(cx, cy + 60, 200, 160, 0, 0, Math.PI * 2);
  ctx.fillStyle = theme.id === "bridal" ? "#d4a0a8" : "#2a2a2a";
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy - 40, 120, 140, 0, 0, Math.PI * 2);
  ctx.fillStyle = theme.id === "bridal" ? "#e0b0b8" : "#333";
  ctx.fill();

  ctx.strokeStyle = "#e8e8e8";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy + 20, 160, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();

  for (let i = 0; i < 12; i++) {
    const t = i / 11;
    const x = cx - 140 + t * 280;
    const y = cy + 20 + Math.sin(t * Math.PI) * 50;
    ctx.beginPath();
    ctx.ellipse(x, y, 12, 7, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = "#f0f0f0";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 5, 4, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }

  const spot = ctx.createRadialGradient(cx, cy - 100, 10, cx, cy, 400);
  spot.addColorStop(0, "rgba(255,255,255,0.12)");
  spot.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, 1080, 1000);

  return canvas.toDataURL("image/jpeg", 0.92);
}
