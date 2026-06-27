import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import ratesRouter from "./rates.js";
import authRouter from "./auth.js";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ratesRouter);
router.use(authRouter);
router.use(adminRouter);

export default router;
