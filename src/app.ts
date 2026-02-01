import express from "express";
import cors from "cors";
import { corsOptions } from "./config/cors";
import { router } from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(cors(corsOptions));

  app.use(router);

  // Error handler al final
  app.use(errorHandler);

  return app;
}
