import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ratesRouter from "./rates";
import authRouter from "./auth";
import adminRouter from "./admin.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ratesRouter);
router.use(authRouter);
router.use(adminRouter);

export default router;
