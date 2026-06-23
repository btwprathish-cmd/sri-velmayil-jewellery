import crypto from "crypto";

const SESSION_SECRET = process.env["ADMIN_SESSION_SECRET"] || "";
const ADMIN_USERNAME = process.env["ADMIN_USERNAME"] || "";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "";
export const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function isAdminConfigured(): boolean {
  return Boolean(SESSION_SECRET && ADMIN_USERNAME && ADMIN_PASSWORD);
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payload).digest("hex");
}

export function createSessionToken(username: string): string {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${username}:${expires}`;
  const sig = signPayload(payload);
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
}

export function parseCookies(cookieHeader: string | undefined): Record<string, string> {
  const cookies: Record<string, string> = {};
  if (!cookieHeader) return cookies;
  for (const entry of cookieHeader.split(";")) {
    const [name, ...rest] = entry.split("=");
    if (!name || rest.length === 0) continue;
    cookies[name.trim()] = decodeURIComponent(rest.join("=").trim());
  }
  return cookies;
}

export function verifySessionToken(token: string | undefined): { username: string } | null {
  if (!token) return null;
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon < 0) return null;
    const payload = decoded.substring(0, lastColon);
    const sig = decoded.substring(lastColon + 1);
    const expectedSig = signPayload(payload);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const parts = payload.split(":");
    if (parts.length < 2) return null;
    const expires = Number(parts[parts.length - 1]);
    const username = parts.slice(0, -1).join(":");
    if (Number.isNaN(expires) || Date.now() > expires) return null;
    return { username };
  } catch {
    return null;
  }
}

export function getSessionFromRequest(cookieHeader: string | undefined): { username: string } | null {
  const cookies = parseCookies(cookieHeader);
  return verifySessionToken(cookies[SESSION_COOKIE]);
}

export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return false;
  const userBuf = Buffer.from(username);
  const adminUserBuf = Buffer.from(ADMIN_USERNAME);
  const passBuf = Buffer.from(password);
  const adminPassBuf = Buffer.from(ADMIN_PASSWORD);
  if (userBuf.length !== adminUserBuf.length || passBuf.length !== adminPassBuf.length) return false;
  const userOk = crypto.timingSafeEqual(userBuf, adminUserBuf);
  const passOk = crypto.timingSafeEqual(passBuf, adminPassBuf);
  return userOk && passOk;
}

export function getCookieOptions(): string {
  const secure = process.env["NODE_ENV"] === "production";
  return `Path=/; HttpOnly; SameSite=Lax;${secure ? " Secure;" : ""} Max-Age=${SESSION_TTL_MS / 1000}`;
}
