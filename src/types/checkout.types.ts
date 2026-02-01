// file: src/types/checkout.types.ts
export type Billing = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export type CheckoutFlower = {
  id: string;
  name: string;
  qty: number;
};

export type CheckoutPayload = {
  variationId: number;
  quantity: number;
  billing: Billing;
  flowers: CheckoutFlower[];
  message?: string;
  notes?: string;
};

export type WcOrderCreatePayload = {
  set_paid: boolean;
  payment_method: string;
  payment_method_title: string;
  billing: Billing;
  line_items: Array<{
    product_id: number;
    variation_id: number;
    quantity: number;
  }>;
  meta_data: Array<{ key: string; value: unknown }>;
};

export type WcOrderResponseMinimal = {
  id: number;
  order_key: string;
};
