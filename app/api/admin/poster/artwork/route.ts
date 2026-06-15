import { NextRequest, NextResponse } from "next/server";
import { getThemeById } from "@/lib/poster-themes";
import {
  buildUniqueArtPrompt,
  generateUniqueSeed,
  recordGeneration,
} from "@/lib/poster-uniqueness";
import { generateBestFreeArtwork } from "@/lib/free-poster-ai";

export const maxDuration = 60;

async function generateWithOpenAI(prompt: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || process.env.USE_PAID_AI !== "true") return null;

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

  if (!res.ok) return null;
  const data = await res.json();
  const b64 = data?.data?.[0]?.b64_json;
  if (!b64) return null;
  return `data:image/png;base64,${b64}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const themeId = (body.themeId as string) || "velmayil-teal";
    const theme = getThemeById(themeId);
    const seed = body.seed ? Number(body.seed) : await generateUniqueSeed(themeId);
    const prompt = buildUniqueArtPrompt(theme, seed);

    // 1. Best free AI (Pollinations Flux + optional Hugging Face) — no payment
    const free = await generateBestFreeArtwork(prompt, seed);
    if (free) {
      await recordGeneration(themeId, seed, prompt);
      return NextResponse.json({
        imageData: free.imageData,
        source: free.source,
        themeId,
        seed,
        prompt,
        cost: "free",
      });
    }

    // 2. Optional paid ChatGPT — only if USE_PAID_AI=true
    const openai = await generateWithOpenAI(prompt);
    if (openai) {
      await recordGeneration(themeId, seed, prompt);
      return NextResponse.json({
        imageData: openai,
        source: "chatgpt-dalle",
        themeId,
        seed,
        prompt,
        cost: "paid",
      });
    }

    return NextResponse.json({ fallback: true, themeId, seed, prompt });
  } catch {
    return NextResponse.json({ error: "Artwork generation failed" }, { status: 500 });
  }
}
