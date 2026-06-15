import { NextRequest, NextResponse } from "next/server";
import { buildArtPrompt, getThemeById } from "@/lib/poster-themes";

export const maxDuration = 60;

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1024x1792",
      response_format: "b64_json",
      quality: "standard",
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) return null;
  return `data:image/png;base64,${b64}`;
}

async function generateWithPollinations(prompt: string, seed: number): Promise<string | null> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1000&seed=${seed}&nologo=true&enhance=true`;
    const res = await fetch(url, { signal: AbortSignal.timeout(45000) });
    if (!res.ok) return null;
    const buffer = await res.arrayBuffer();
    const b64 = Buffer.from(buffer).toString("base64");
    const mime = res.headers.get("content-type") || "image/jpeg";
    return `data:${mime};base64,${b64}`;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const themeId = body.themeId as string;
    const seed = Number(body.seed) || Date.now();

    const theme = getThemeById(themeId);
    const prompt = buildArtPrompt(theme);

    const openai = await generateWithOpenAI(prompt);
    if (openai) {
      return NextResponse.json({ imageData: openai, source: "openai", themeId, prompt });
    }

    const pollinations = await generateWithPollinations(prompt, seed);
    if (pollinations) {
      return NextResponse.json({ imageData: pollinations, source: "pollinations", themeId, prompt });
    }

    return NextResponse.json({ fallback: true, themeId, seed, prompt });
  } catch {
    return NextResponse.json({ error: "Artwork generation failed" }, { status: 500 });
  }
}
