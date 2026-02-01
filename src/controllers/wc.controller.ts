// file: src/controllers/wc.controller.ts
import type { Request, Response } from "express";
import { WooCommerceService } from "../services/woocommerce.service";

const service = new WooCommerceService();

function paramToString(param: string | string[] | undefined): string {
  if (Array.isArray(param)) return param[0] ?? "";
  return param ?? "";
}

export async function getProducts(req: Request, res: Response): Promise<void> {
  const r = await service.getProducts(req.query as Record<string, unknown>);
  res.status(r.status).json(r.data);
}

export async function getProductById(req: Request, res: Response): Promise<void> {
  const id = paramToString(req.params.id as unknown as string | string[] | undefined);

  const r = await service.getProductById(id);
  res.status(r.status).json(r.data);
}

export async function postOrders(req: Request, res: Response): Promise<void> {
  const r = await service.createOrder(req.body);
  res.status(r.status).json(r.data);
}
