import { Router } from 'express';
import roleRouter from "./roleRoute"
import userRouter from "./userRoute"
import categoryRouter from "./categoryRoute";
import bidsRouter from "./bidsRoute";
import orderRouter from "./orderRoute";
import analyticsRouter from "./analyticsRoute";

const router = Router();
const version = "v1";
const webRoute = "web";
export const prefix = `/${version}/${webRoute}`;

router.use(`${prefix}/role`, roleRouter);
router.use(`${prefix}/user`, userRouter);
router.use(`${prefix}/category`, categoryRouter);
router.use(`${prefix}/bids`, bidsRouter);
router.use(`${prefix}/order`,orderRouter);
router.use(`${prefix}/analytics`,analyticsRouter);
export default router;
