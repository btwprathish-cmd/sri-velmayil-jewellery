import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifySessionToken, SESSION_COOKIE } from "./_auth.js";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

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
}
