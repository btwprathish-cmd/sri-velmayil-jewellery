import { NextRequest, NextResponse } from "next/server";
import { PosterFormData, buildPosterPrompt } from "@/utils/build-poster-prompt";
import { verifySessionFromTokenEdge } from "@/utils/auth-edge";
import { generateCachedImage } from "@/utils/huggingface-service";
import path from "path";
import { promises as fs } from "fs";

export const dynamic = "force-dynamic";

const LIMITS_FILE = path.join(process.cwd(), "cache", "daily-limits.json");

async function checkAndIncrementLimit(): Promise<boolean> {
  try {
    const data = await fs.readFile(LIMITS_FILE, "utf-8");
    const limits = JSON.parse(data);
    const today = new Date().toISOString().split("T")[0];

    if (limits.date !== today) {
      // New day, reset
      await fs.writeFile(LIMITS_FILE, JSON.stringify({ date: today, count: 1 }));
      return true;
    }

    if (limits.count >= 5) {
      return false;
    }

    limits.count += 1;
    await fs.writeFile(LIMITS_FILE, JSON.stringify(limits));
    return true;
  } catch (err) {
    // File doesn't exist or is invalid, create it
    const today = new Date().toISOString().split("T")[0];
    await fs.mkdir(path.dirname(LIMITS_FILE), { recursive: true });
    await fs.writeFile(LIMITS_FILE, JSON.stringify({ date: today, count: 1 }));
    return true;
  }
}

async function decrementLimit() {
  try {
    const data = await fs.readFile(LIMITS_FILE, "utf-8");
    const limits = JSON.parse(data);
    const today = new Date().toISOString().split("T")[0];

    if (limits.date === today && limits.count > 0) {
      limits.count -= 1;
      await fs.writeFile(LIMITS_FILE, JSON.stringify(limits));
    }
  } catch (err) {}
}

export async function POST(request: NextRequest) {
  const token = request.headers.get("cookie")?.split("; ").find((c) => c.startsWith("velmayil_admin_session="))?.split("=")[1];
  if (!(await verifySessionFromTokenEdge(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const canGenerate = await checkAndIncrementLimit();
    if (!canGenerate) {
      return NextResponse.json({ error: "Limit reached. Come back tomorrow." }, { status: 429 });
    }

    const body = await request.json();
    const formData = body as PosterFormData;

    const requiredFields: (keyof PosterFormData)[] = [
      "phone",
      "address",
      "date",
      "gold1g",
      "gold8g",
      "silver1g",
    ];

    for (const field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        await decrementLimit();
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const prompt = buildPosterPrompt(formData);
    
    // Generate image through Hugging Face API with caching
    const imageUrl = await generateCachedImage(prompt);

    return NextResponse.json({ prompt, imageUrl, success: true });
  } catch (err: unknown) {
    await decrementLimit();
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}