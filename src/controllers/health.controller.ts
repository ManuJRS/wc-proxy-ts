import type { Request, Response } from "express";
import { WooCommerceService } from "../services/woocommerce.service";

const service = new WooCommerceService();

export async function getHealth(_req: Request, res: Response): Promise<void> {
  const data = await service.getHealth();
  res.json(data);
}
