import type { PosterTheme } from "@/lib/poster-themes";

/** Client-side fallback for the artwork zone only (1080×1000). */
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

  const teal = theme.id === "bridal" ? "#0d4a52" : theme.bg.startsWith("#") ? theme.bg : "#0B3D45";
  const grad = ctx.createLinearGradient(0, 0, 0, 1000);
  grad.addColorStop(0, teal);
  grad.addColorStop(0.6, "#061e22");
  grad.addColorStop(1, "#041418");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1080, 1000);

  for (let i = 0; i < 16; i++) {
    const x = rng() * 1080;
    const y = rng() * 1000;
    const r = 40 + rng() * 100;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(212, 175, 55, ${0.02 + rng() * 0.06})`;
    ctx.fill();
  }

  const cx = 540;
  const cy = 500;

  if (theme.id === "bridal" || theme.id === "wedding" || theme.id === "festival" || theme.id === "peacock") {
    for (const side of [-1, 1]) {
      const fx = cx + side * (200 + rng() * 50);
      const fy = cy + rng() * 80 - 20;
      ctx.globalAlpha = 0.7;
      for (let p = 0; p < 14; p++) {
        const angle = (p / 14) * Math.PI * 2;
        const px = fx + Math.cos(angle) * 30;
        const py = fy + Math.sin(angle) * 30;
        ctx.beginPath();
        ctx.ellipse(px, py, 16, 9, angle, 0, Math.PI * 2);
        ctx.fillStyle = theme.id === "festival" ? "#ff9933" : "#e891a8";
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      ctx.beginPath();
      ctx.arc(fx, fy, 10, 0, Math.PI * 2);
      ctx.fillStyle = "#ffd4a8";
      ctx.fill();
    }
    ctx.fillStyle = "#2d6b3a";
    for (let g = 0; g < 8; g++) {
      const gx = cx - 280 + rng() * 200;
      const gy = cy + 80 + rng() * 120;
      ctx.beginPath();
      ctx.ellipse(gx, gy, 28, 12, rng() * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const bustColor = theme.id === "bridal" ? "#1a6b75" : "#145a62";
  ctx.beginPath();
  ctx.ellipse(cx, cy + 80, 210, 170, 0, 0, Math.PI * 2);
  ctx.fillStyle = bustColor;
  ctx.fill();

  ctx.beginPath();
  ctx.ellipse(cx, cy - 30, 130, 150, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#1a7580";
  ctx.fill();

  ctx.strokeStyle = "#f0d878";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy + 30, 170, 0.12 * Math.PI, 0.88 * Math.PI);
  ctx.stroke();

  for (let i = 0; i < 14; i++) {
    const t = i / 13;
    const x = cx - 150 + t * 300;
    const y = cy + 30 + Math.sin(t * Math.PI) * 55;
    ctx.beginPath();
    ctx.ellipse(x, y, 14, 8, rng() * Math.PI, 0, Math.PI * 2);
    ctx.fillStyle = "#f5e6a8";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, y - 6, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#fff8e0";
    ctx.fill();
  }

  const spot = ctx.createRadialGradient(cx, cy - 80, 20, cx, cy, 450);
  spot.addColorStop(0, "rgba(255,255,255,0.15)");
  spot.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, 1080, 1000);

  return canvas.toDataURL("image/jpeg", 0.92);
}
