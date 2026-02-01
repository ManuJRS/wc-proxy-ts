// file: src/services/woocommerce.service.ts
import type { AxiosResponse } from "axios";
import { wc } from "../clients/woocommerce.client";
import { config } from "../config/env";
import type { WcOrderCreatePayload, WcOrderResponseMinimal } from "../types/checkout.types";

export class WooCommerceService {
  async getHealth(): Promise<{ ok: true }> {
    return { ok: true };
  }

  async getProducts(params: Record<string, unknown>): Promise<AxiosResponse<unknown>> {
    // Defaults compatibles
    const per_page = params.per_page ? Number(params.per_page) : 10;
    const page = params.page ? Number(params.page) : 1;

    const mergedParams = {
      ...params,
      per_page: Number.isFinite(per_page) && per_page > 0 ? per_page : 10,
      page: Number.isFinite(page) && page > 0 ? page : 1,
    };

    return wc.get("/products", { params: mergedParams });
  }

  async getProductById(id: string): Promise<AxiosResponse<unknown>> {
    return wc.get(`/products/${id}`);
  }

  async getVariations(): Promise<AxiosResponse<unknown>> {
    return wc.get(`/products/${config.WC_PRODUCT_ID}/variations`, {
      params: { per_page: 100 },
    });
  }

  async createOrder(payload: unknown): Promise<AxiosResponse<unknown>> {
    return wc.post("/orders", payload);
  }

  async createCheckoutOrder(payload: WcOrderCreatePayload): Promise<AxiosResponse<WcOrderResponseMinimal>> {
    // Tipado mínimo de respuesta (id, order_key)
    return wc.post<WcOrderResponseMinimal>("/orders", payload);
  }

  buildCheckoutUrl(orderId: number, orderKey: string): string {
    return `${config.WC_BASE_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;
  }
}