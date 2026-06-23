import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getCookieOptions } from "../lib/auth";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const secure = process.env["NODE_ENV"] === "production";
  res.setHeader(
    "Set-Cookie",
    `admin_session=deleted; Path=/; HttpOnly; SameSite=Lax;${secure ? " Secure;" : ""} Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
  );
  return res.json({ success: true });
}
