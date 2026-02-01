import type { CorsOptions } from "cors";
import { config } from "./env";

export const corsOptions: CorsOptions = {
  origin: config.FRONTEND_ORIGIN,
  credentials: false,
};
