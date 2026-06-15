import { NextRequest, NextResponse } from "next/server";
import { getThemeById } from "@/lib/poster-themes";
import {
  buildUniqueArtPrompt,
  generateUniqueSeed,
  recordGeneration,
} from "@/lib/poster-uniqueness";

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
      size: "1024x1024",
      response_format: "b64_json",
      quality: "hd",
      style: "natural",
    }),
  });

  if (!res.ok) {
    console.error("OpenAI image error:", await res.text().catch(() => ""));
    return null;
  }
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) return null;
  return `data:image/png;base64,${b64}`;
}

async function generateWithPollinations(prompt: string, seed: number): Promise<string | null> {
  try {
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1080&height=1000&seed=${seed}&nologo=true&enhance=true&model=flux`;
    const res = await fetch(url, { signal: AbortSignal.timeout(55000) });
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
    const themeId = (body.themeId as string) || "bridal";
    const theme = getThemeById(themeId);
    const seed = body.seed ? Number(body.seed) : await generateUniqueSeed(themeId);
    const prompt = buildUniqueArtPrompt(theme, seed);

    const openai = await generateWithOpenAI(prompt);
    if (openai) {
      await recordGeneration(themeId, seed, prompt);
      return NextResponse.json({ imageData: openai, source: "chatgpt-dalle", themeId, seed, prompt });
    }

    const pollinations = await generateWithPollinations(prompt, seed);
    if (pollinations) {
      await recordGeneration(themeId, seed, prompt);
      return NextResponse.json({ imageData: pollinations, source: "ai-flux", themeId, seed, prompt });
    }

    return NextResponse.json({ fallback: true, themeId, seed, prompt });
  } catch {
    return NextResponse.json({ error: "Artwork generation failed" }, { status: 500 });
  }
}
