import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getProducts, getProductById, postOrders } from "../controllers/wc.controller";

export const wcRouter = Router();

wcRouter.get("/api/wc/products", asyncHandler(getProducts));
wcRouter.get("/api/wc/products/:id", asyncHandler(getProductById));
wcRouter.post("/api/wc/orders", asyncHandler(postOrders));
