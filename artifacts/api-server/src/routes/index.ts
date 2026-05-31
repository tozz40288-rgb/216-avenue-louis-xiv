import { Router, type IRouter } from "express";
import healthRouter from "./health";
import checkoutRouter from "./checkout";
import ordersRouter from "./orders";
import contactRouter from "./contact";
import adminAuthRouter from "./admin-auth";

const router: IRouter = Router();

router.use(healthRouter);
router.use(checkoutRouter);
router.use(ordersRouter);
router.use(contactRouter);
router.use(adminAuthRouter);

export default router;
