// file: src/middlewares/errorHandler.ts
import type { ErrorRequestHandler } from "express";
import { AxiosError } from "axios";
import type { ProxyErrorPayload } from "../types/proxy.types";

function isAxiosError(err: unknown): err is AxiosError {
  return err instanceof AxiosError;
}

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (isAxiosError(err)) {
    const status = err.response?.status ?? 500;
    const data = err.response?.data ?? { message: err.message ?? "Unknown error" };

    const payload: ProxyErrorPayload = {
      proxy_error: true,
      status,
      data,
    };

    res.status(status).json(payload);
    return;
  }

  // Errores no-Axios
  const payload: ProxyErrorPayload = {
    proxy_error: true,
    status: 500,
    data: { message: err instanceof Error ? err.message : "Unknown error" },
  };

  res.status(500).json(payload);
};
