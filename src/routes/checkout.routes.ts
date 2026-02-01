import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { postCheckout } from "../controllers/checkout.controller";

export const checkoutRouter = Router();

checkoutRouter.post("/api/checkout", asyncHandler(postCheckout));
