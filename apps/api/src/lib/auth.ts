import crypto from "crypto";

function getEnvVar(key: string): string {
  return (process.env[key] || "").trim();
}

const SESSION_COOKIE = "admin_session";
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

export function isAdminConfigured(): boolean {
  return Boolean(getEnvVar("ADMIN_USERNAME") && getEnvVar("ADMIN_PASSWORD") && getEnvVar("ADMIN_SESSION_SECRET"));
}

function signPayload(payload: string): string {
  return crypto.createHmac("sha256", getEnvVar("ADMIN_SESSION_SECRET")).update(payload).digest("hex");
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
  const adminUser = getEnvVar("ADMIN_USERNAME");
  const adminPass = getEnvVar("ADMIN_PASSWORD");
  
  if (!adminUser || !adminPass) return false;
  const userBuf = Buffer.from(username.trim());
  const adminUserBuf = Buffer.from(adminUser);
  const passBuf = Buffer.from(password.trim());
  const adminPassBuf = Buffer.from(adminPass);
  if (userBuf.length !== adminUserBuf.length || passBuf.length !== adminPassBuf.length) return false;
  const userOk = crypto.timingSafeEqual(userBuf, adminUserBuf);
  const passOk = crypto.timingSafeEqual(passBuf, adminPassBuf);
  return userOk && passOk;
}

export { SESSION_COOKIE };
