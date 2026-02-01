import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { getHealth } from "../controllers/health.controller";

export const healthRouter = Router();

healthRouter.get("/health", asyncHandler(getHealth));
