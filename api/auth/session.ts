import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSessionFromRequest } from "../lib/auth.js";

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  const session = getSessionFromRequest(_req.headers.cookie);
  if (!session) {
    return res.json({ authenticated: false, username: null });
  }
  return res.json({ authenticated: true, username: session.username });
}
