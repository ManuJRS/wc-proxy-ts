import type { Request, Response } from "express";
import { WooCommerceService } from "../services/woocommerce.service";

const service = new WooCommerceService();

export async function getVariations(_req: Request, res: Response): Promise<void> {
  const r = await service.getVariations();
  res.status(r.status).json(r.data);
}
