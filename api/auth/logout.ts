import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESSION_COOKIE } from "./_auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const isProd = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax${isProd ? "; Secure" : ""}`
  );

  res.json({ success: true });
}
