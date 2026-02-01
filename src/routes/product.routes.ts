import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getVariations } from "../controllers/product.controller";

export const productRouter = Router();

productRouter.get("/api/product/variations", asyncHandler(getVariations));
