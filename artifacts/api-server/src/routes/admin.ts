import { Router, type IRouter, type Request, type Response } from "express";
import { verifySessionToken, SESSION_COOKIE } from "../lib/auth.js";
import { overrideRate } from "../lib/live-rates.js";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): boolean {
  const token = req.cookies?.[SESSION_COOKIE] as string | undefined;
  if (!token) {
    res.status(401).json({ error: "Not authenticated." });
    return false;
  }
  const session = verifySessionToken(token);
  if (!session) {
    res.status(401).json({ error: "Session expired or invalid." });
    return false;
  }
  return true;
}

router.post("/admin/rates", (req: Request, res: Response) => {
  if (!requireAdmin(req, res)) return;

  const { gold22k_1g, silver_1g } = req.body as { gold22k_1g?: unknown; silver_1g?: unknown };

  const gold = Number(gold22k_1g);
  const silver = Number(silver_1g);

  if (!Number.isFinite(gold) || gold < 1000 || gold > 200000) {
    res.status(400).json({ error: "gold22k_1g must be a number between 1000 and 200000." });
    return;
  }
  if (!Number.isFinite(silver) || silver < 10 || silver > 50000) {
    res.status(400).json({ error: "silver_1g must be a number between 10 and 50000." });
    return;
  }

  const record = overrideRate(gold, silver);
  res.json({ success: true, record });
});

export default router;
