import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createSessionToken, getCookieOptions, isAdminConfigured, validateCredentials } from "../lib/auth";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isAdminConfigured()) {
    return res.status(503).json({ error: "Admin login is not configured on the server." });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body;
  const username = typeof body?.username === "string" ? body.username.trim() : "";
  const password = typeof body?.password === "string" ? body.password : "";

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password are required." });
  }

  if (!validateCredentials(username, password)) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = createSessionToken(username);
  res.setHeader("Set-Cookie", `admin_session=${encodeURIComponent(token)}; ${getCookieOptions()}`);
  return res.json({ success: true });
}
