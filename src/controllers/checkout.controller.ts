import type { Request, Response } from "express";
import { WooCommerceService } from "../services/woocommerce.service";
import { validateCheckoutPayload } from "../utils/validation";
import { config } from "../config/env";
import type { WcOrderCreatePayload } from "../types/checkout.types";

const service = new WooCommerceService();

export async function postCheckout(req: Request, res: Response): Promise<void> {
  const validation = validateCheckoutPayload(req.body);
  if (!validation.ok) {
    res.status(400).json({ message: validation.message });
    return;
  }

  const body = validation.value;

  const orderPayload: WcOrderCreatePayload = {
    set_paid: false,
    payment_method: "bacs",
    payment_method_title: "Transferencia",
    billing: body.billing,
    line_items: [
      {
        product_id: config.WC_PRODUCT_ID,
        variation_id: body.variationId,
        quantity: body.quantity,
      },
    ],
    meta_data: [
      { key: "_lp_flowers", value: body.flowers ?? [] },
      { key: "_lp_message", value: body.message ?? "" },
      { key: "_lp_notes", value: body.notes ?? "" },
    ],
  };

  const r = await service.createCheckoutOrder(orderPayload);

  const orderId = r.data.id;
  const orderKey = r.data.order_key;

  const checkoutUrl = service.buildCheckoutUrl(orderId, orderKey);

  res.json({ orderId, checkoutUrl });
}
