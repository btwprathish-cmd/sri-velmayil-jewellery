/**
 * Best free poster artwork generators — no payment required.
 * Optional HF_API_KEY (free from huggingface.co) improves reliability.
 */

const TIMEOUT_MS = 55000;
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Referer: "https://pollinations.ai/",
};

export interface FreeArtworkResult {
  imageData: string;
  source: string;
}

async function fetchImageUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: HEADERS,
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("image")) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 1000) return null;
    const mime = contentType.split(";")[0] || "image/jpeg";
    const b64 = Buffer.from(buffer).toString("base64");
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
}

async function pollinations(
  prompt: string,
  seed: number,
  model: string,
  width = 1080,
  height = 1000
): Promise<string | null> {
  const params = new URLSearchParams({
    width: String(width),
    height: String(height),
    seed: String(seed),
    nologo: "true",
    enhance: "true",
    model,
  });
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?${params}`;
  return fetchImageUrl(url);
}

async function huggingFaceFlux(prompt: string): Promise<string | null> {
  const apiKey = process.env.HF_API_KEY || process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) return null;

  const model = process.env.HF_MODEL || "black-forest-labs/FLUX.1-schnell";
  try {
    const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: prompt }),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("image")) return null;
    const buffer = await res.arrayBuffer();
    if (buffer.byteLength < 1000) return null;
    const mime = contentType.split(";")[0] || "image/jpeg";
    return `data:${mime};base64,${Buffer.from(buffer).toString("base64")}`;
  } catch {
    return null;
  }
}

/** Try best free AI providers in quality order. Returns null if all fail. */
export async function generateBestFreeArtwork(
  prompt: string,
  seed: number
): Promise<FreeArtworkResult | null> {
  const attempts: { fn: () => Promise<string | null>; source: string }[] = [
    { fn: () => pollinations(prompt, seed, "flux"), source: "free-flux-hd" },
    { fn: () => pollinations(prompt, seed + 1, "flux-realism"), source: "free-flux-realism" },
    { fn: () => huggingFaceFlux(prompt), source: "free-huggingface-flux" },
    { fn: () => pollinations(prompt, seed + 2, "turbo"), source: "free-turbo" },
    { fn: () => pollinations(prompt, seed + 3, "flux", 768, 1000), source: "free-flux-standard" },
  ];

  for (const { fn, source } of attempts) {
    const imageData = await fn();
    if (imageData) return { imageData, source };
  }

  return null;
}

export function getFreeAiSourceLabel(source: string): string {
  const labels: Record<string, string> = {
    "free-flux-hd": "Free AI · Flux HD",
    "free-flux-realism": "Free AI · Flux Realism",
    "free-huggingface-flux": "Free AI · Hugging Face Flux",
    "free-turbo": "Free AI · Turbo",
    "free-flux-standard": "Free AI · Flux",
    "chatgpt-dalle": "ChatGPT · DALL-E (paid)",
    "canvas-fallback": "Basic fallback",
  };
  return labels[source] || source;
}
