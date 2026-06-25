import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  isAdminConfigured,
  validateCredentials,
  createSessionToken,
  SESSION_COOKIE,
} from "./_auth";

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = loginAttempts.get(ip);
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 0, resetAt: now + LOCKOUT_MS });
    return true;
  }
  if (entry.count >= MAX_ATTEMPTS) return false;
  return true;
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const entry = loginAttempts.get(ip) || { count: 0, resetAt: now + LOCKOUT_MS };
  entry.count += 1;
  loginAttempts.set(ip, entry);
}

function clearAttempts(ip: string) {
  loginAttempts.delete(ip);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (!isAdminConfigured()) {
    res.status(503).json({ error: "Admin is not configured on the server." });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many login attempts. Please wait 15 minutes and try again." });
    return;
  }

  const { username, password } = req.body || {};
  if (!username || !password) {
    res.status(400).json({ error: "Username and password are required." });
    return;
  }

  if (!validateCredentials(username, password)) {
    recordFailedAttempt(ip);
    res.status(401).json({ error: "Invalid username or password." });
    return;
  }

  clearAttempts(ip);
  const token = createSessionToken(username);

  const isProd = process.env.NODE_ENV === "production";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax${isProd ? "; Secure" : ""}`
  );

  res.json({ success: true });
}
