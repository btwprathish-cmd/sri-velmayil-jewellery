const SESSION_COOKIE = "velmayil_admin_session";

function getSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || "velmayil-dev-secret-change-in-production";
}

async function signPayloadEdge(payload: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const pad = base64.length % 4;
  const padded = pad ? base64 + "=".repeat(4 - pad) : base64;
  return atob(padded);
}

export async function verifySessionFromTokenEdge(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const decoded = base64UrlDecode(token);
    const lastColon = decoded.lastIndexOf(":");
    if (lastColon < 0) return false;

    const signature = decoded.slice(lastColon + 1);
    const payload = decoded.slice(0, lastColon);
    const expected = await signPayloadEdge(payload);

    if (signature !== expected) return false;

    const parts = payload.split(":");
    if (parts.length < 3) return false;

    const expiresStr = parts[1];
    if (Date.now() > Number(expiresStr)) return false;
    return true;
  } catch {
    return false;
  }
}

export { SESSION_COOKIE };
