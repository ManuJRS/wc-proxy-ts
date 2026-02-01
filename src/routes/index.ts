import { Router } from "express";
import { healthRouter } from "./health.routes";
import { wcRouter } from "./wc.routes";
import { productRouter } from "./product.routes";
import { checkoutRouter } from "./checkout.routes";

export const router = Router();

router.use(healthRouter);
router.use(wcRouter);
router.use(productRouter);
router.use(checkoutRouter);
