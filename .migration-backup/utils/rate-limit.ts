import { promises as fs } from "fs";
import path from "path";

const RATE_LIMIT_FILE = path.join(process.cwd(), "data", "login-attempts.json");
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const LOCKOUT_MS = 30 * 60 * 1000; // 30 minutes after max attempts

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil?: number;
}

interface AttemptStore {
  [ip: string]: AttemptRecord;
}

async function readStore(): Promise<AttemptStore> {
  try {
    const raw = await fs.readFile(RATE_LIMIT_FILE, "utf8");
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

async function writeStore(store: AttemptStore): Promise<void> {
  try {
    await fs.mkdir(path.dirname(RATE_LIMIT_FILE), { recursive: true });
    await fs.writeFile(RATE_LIMIT_FILE, JSON.stringify(store, null, 2));
  } catch {
    // Non-fatal: rate limiting degrades gracefully if storage is unavailable
  }
}

function cleanStore(store: AttemptStore): AttemptStore {
  const now = Date.now();
  const cleaned: AttemptStore = {};
  for (const [ip, record] of Object.entries(store)) {
    if (record.lockedUntil && record.lockedUntil < now) continue;
    if (now - record.firstAttempt > WINDOW_MS && !record.lockedUntil) continue;
    cleaned[ip] = record;
  }
  return cleaned;
}

export async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfterSec?: number }> {
  let store = cleanStore(await readStore());
  const record = store[ip];

  if (!record) return { allowed: true };

  const now = Date.now();

  if (record.lockedUntil && record.lockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  if (now - record.firstAttempt > WINDOW_MS) {
    delete store[ip];
    await writeStore(store);
    return { allowed: true };
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    store[ip] = record;
    await writeStore(store);
    return { allowed: false, retryAfterSec: Math.ceil(LOCKOUT_MS / 1000) };
  }

  return { allowed: true };
}

export async function recordFailedAttempt(ip: string): Promise<void> {
  let store = cleanStore(await readStore());
  const now = Date.now();
  const record = store[ip];

  if (!record || now - record.firstAttempt > WINDOW_MS) {
    store[ip] = { count: 1, firstAttempt: now };
  } else {
    record.count += 1;
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS;
    }
    store[ip] = record;
  }

  await writeStore(store);
}

export async function clearRateLimit(ip: string): Promise<void> {
  const store = await readStore();
  delete store[ip];
  await writeStore(store);
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = request.headers.get("x-real-ip");
  if (real) return real;
  return "127.0.0.1";
}
