/**
 * Verify Node HMAC matches Edge Web Crypto HMAC
 */
import { createHmac } from "crypto";

const secret = "velmayil-dev-secret-change-in-production";
const payload = "admin:9999999999999";

const nodeSig = createHmac("sha256", secret).update(payload).digest("hex");

async function edgeSig() {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const edge = await edgeSig();
console.log("Node:", nodeSig);
console.log("Edge:", edge);
console.log("Match:", nodeSig === edge);
