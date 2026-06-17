import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ratesRouter from "./rates";
import authRouter from "./auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ratesRouter);
router.use(authRouter);

export default router;
