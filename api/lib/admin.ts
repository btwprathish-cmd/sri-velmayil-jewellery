import type { VercelRequest, VercelResponse } from "@vercel/node";
import { SESSION_COOKIE, verifySessionToken } from "../auth/_auth";

export function requireAdmin(req: VercelRequest, res: VercelResponse): boolean {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Unauthorized. Admin session is required." });
    return false;
  }

  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: "Unauthorized. Session is invalid or expired." });
    return false;
  }

  return true;
}
