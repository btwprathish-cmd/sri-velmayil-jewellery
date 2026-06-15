import { cookies } from "next/headers";
import { createHmac, timingSafeEqual, scryptSync, randomBytes } from "crypto";

export const SESSION_COOKIE = "velmayil_admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("ADMIN_SESSION_SECRET must be set in production");
  }
  return secret || "velmayil-dev-secret-change-in-production";
}

export function isProductionAuthConfigured(): boolean {
  if (process.env.NODE_ENV !== "production") return true;
  const { username, password, secret } = {
    username: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD,
    secret: process.env.ADMIN_SESSION_SECRET,
  };
  return Boolean(
    username &&
      password &&
      secret &&
      password.length >= 16 &&
      secret.length >= 32
  );
}
export function validateProductionAuthConfig(): void {
  if (process.env.NODE_ENV !== "production") return;
  if (!isProductionAuthConfigured()) {
    throw new Error("ADMIN_USERNAME, ADMIN_PASSWORD (16+ chars), and ADMIN_SESSION_SECRET (32+ chars) are required in production");
  }
}

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "Velmayil@Dev2026!Secure",
  };
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function verifyCredentials(username: string, password: string): boolean {
  const creds = getAdminCredentials();
  return timingSafeEqualStr(username, creds.username) && timingSafeEqualStr(password, creds.password);
}

function signPayload(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

export function createSessionToken(username: string): string {
  const nonce = randomBytes(8).toString("hex");
  const expires = Date.now() + SESSION_MAX_AGE * 1000;
  const payload = `${username}:${expires}:${nonce}`;
  const signature = signPayload(payload);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

export function verifySessionToken(token: string): { valid: boolean; username?: string } {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon < 0) return { valid: false };

    const signature = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const expected = signPayload(payload);

    const sigBuf = Buffer.from(signature);
    const expBuf = Buffer.from(expected);
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
      return { valid: false };
    }

    const parts = payload.split(":");
    if (parts.length < 3) return { valid: false };

    const [username, expiresStr] = parts;
    if (Date.now() > Number(expiresStr)) return { valid: false };
    return { valid: true, username };
  } catch {
    return { valid: false };
  }
}

export async function setSessionCookie(username: string) {
  const token = createSessionToken(username);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSession(): Promise<{ username: string } | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const result = verifySessionToken(token);
  if (!result.valid || !result.username) return null;
  return { username: result.username };
}

export function verifySessionFromToken(token: string | undefined): boolean {
  if (!token) return false;
  return verifySessionToken(token).valid;
}

// Utility for hashing passwords if migrating to hashed storage later
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
