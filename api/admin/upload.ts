import type { VercelRequest, VercelResponse } from "@vercel/node";
import { requireAdmin } from "../lib/admin";
import { supabase } from "../lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const BUCKET = "jewellery-images";

function parseMultipart(req: VercelRequest): Promise<{ file: Buffer; filename: string; mimetype: string }> {
  return new Promise((resolve, reject) => {
    const busboy = require("busboy");
    const bb = new busboy({ headers: req.headers as any, limits: { fileSize: MAX_FILE_SIZE } });

    let fileBuffer = Buffer.alloc(0);
    let filename = "";
    let mimetype = "";
    let finished = false;

    bb.on("file", (_fieldname: string, file: NodeJS.ReadableStream, info: any) => {
      filename = info.filename;
      mimetype = info.mimeType;

      if (!ALLOWED_TYPES.includes(mimetype)) {
        file.resume();
        reject(new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed."));
        return;
      }

      file.on("data", (chunk) => {
        fileBuffer = Buffer.concat([fileBuffer, chunk]);
        if (fileBuffer.length > MAX_FILE_SIZE) {
          reject(new Error("File too large. Maximum allowed size is 5MB."));
        }
      });

      file.on("limit", () => {
        reject(new Error("File too large. Maximum allowed size is 5MB."));
      });
    });

    bb.on("finish", () => {
      finished = true;
      if (!filename) {
        reject(new Error("No file uploaded"));
        return;
      }
      resolve({ file: fileBuffer, filename, mimetype });
    });

    bb.on("error", reject);

    req.on("data", (data) => bb.write(data));
    req.on("end", () => bb.end());
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  if (!requireAdmin(req, res)) return;

  try {
    const { file, filename, mimetype } = await parseMultipart(req);
    const ext = filename.split(".").pop() || "png";
    const cleanName = filename.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const key = `${Date.now()}-${cleanName}`;

    const { data, error } = await supabase.storage.from(BUCKET).upload(key, file, {
      contentType: mimetype,
      upsert: false,
    });

    if (error) {
      res.status(500).json({ error: "Failed to upload image", details: error.message });
      return;
    }

    const { data: urlData, error: urlError } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
    if (urlError) {
      res.status(500).json({ error: "Failed to generate public URL", details: urlError.message });
      return;
    }

    res.status(201).json({ success: true, imageUrl: urlData.publicUrl });
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to parse upload" });
  }
}
