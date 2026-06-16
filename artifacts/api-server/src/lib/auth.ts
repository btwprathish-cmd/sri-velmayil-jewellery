import crypto from "crypto";

const SESSION_SECRET = process.env["ADMIN_SESSION_SECRET"] || "";
const ADMIN_USERNAME = process.env["ADMIN_USERNAME"] || "";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] || "";

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function isAdminConfigured(): boolean {
  return Boolean(ADMIN_USERNAME && ADMIN_PASSWORD && SESSION_SECRET);
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

export function verifySessionToken(token: string): { username: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastColon = decoded.lastIndexOf(":");
    const payload = decoded.substring(0, lastColon);
    const sig = decoded.substring(lastColon + 1);

    const expectedSig = signPayload(payload);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;

    const parts = payload.split(":");
    if (parts.length < 2) return null;
    const expires = Number(parts[parts.length - 1]);
    const username = parts.slice(0, -1).join(":");

    if (Date.now() > expires) return null;
    return { username };
  } catch {
    return null;
  }
}

export function validateCredentials(username: string, password: string): boolean {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) return false;
  const userOk = crypto.timingSafeEqual(Buffer.from(username), Buffer.from(ADMIN_USERNAME));
  const passOk = crypto.timingSafeEqual(Buffer.from(password), Buffer.from(ADMIN_PASSWORD));
  return userOk && passOk;
}

export { SESSION_COOKIE };
