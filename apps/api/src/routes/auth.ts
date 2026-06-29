import { Router, type Request, type Response } from "express";
import {
  isAdminConfigured,
  validateCredentials,
  createSessionToken,
  verifySessionToken,
  SESSION_COOKIE,
} from "../lib/auth.js";

const router: any = Router();

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

router.post("/auth/login", (req: Request, res: Response) => {
  if (!isAdminConfigured()) {
    res.status(503).json({ error: "Admin is not configured on the server." });
    return;
  }

  const ip = (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() || req.socket.remoteAddress || "unknown";

  if (!checkRateLimit(ip)) {
    res.status(429).json({ error: "Too many login attempts. Please wait 15 minutes and try again." });
    return;
  }

  const { username, password } = req.body as { username?: string; password?: string };
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

  res.cookie(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env["NODE_ENV"] === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
    path: "/",
  });

  res.json({ success: true });
});

router.post("/auth/logout", (_req: Request, res: Response) => {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.json({ success: true });
});

router.get("/auth/session", (req: Request, res: Response) => {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.json({ authenticated: false, username: null });
    return;
  }
  const session = verifySessionToken(token);
  if (!session) {
    res.json({ authenticated: false, username: null });
    return;
  }
  res.json({ authenticated: true, username: session.username });
});

export default router;
