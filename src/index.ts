import express, { Request, Response } from "express";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const WC_PRODUCT_ID = Number(process.env.WC_PRODUCT_ID);
if (!WC_PRODUCT_ID) {
  console.error("Falta WC_PRODUCT_ID en .env");
  process.exit(1);
}

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    credentials: false,
  })
);

const WC_BASE_URL = process.env.WC_BASE_URL;
const WC_KEY = process.env.WC_CONSUMER_KEY;
const WC_SECRET = process.env.WC_CONSUMER_SECRET;

if (!WC_BASE_URL || !WC_KEY || !WC_SECRET) {
  console.error(
    "Faltan variables en .env: WC_BASE_URL, WC_CONSUMER_KEY, WC_CONSUMER_SECRET"
  );
  process.exit(1);
}

const basicAuthHeader = () => {
  const token = Buffer.from(`${WC_KEY}:${WC_SECRET}`).toString("base64");
  return { Authorization: `Basic ${token}` };
};

const wc = axios.create({
  baseURL: `${WC_BASE_URL}/wp-json/wc/v3`,
  timeout: 20000,
  headers: {
    ...basicAuthHeader(),
    "Content-Type": "application/json",
  },
});

// ---------- Tipos ----------
type ProxyErrorPayload = {
  proxy_error: true;
  status: number;
  data: unknown;
};

function handleAxiosError(err: unknown, res: Response) {
  const axiosErr = err as AxiosError;
  const status = axiosErr.response?.status ?? 500;
  const data = axiosErr.response?.data ?? { message: axiosErr.message ?? "Unknown error" };

  const payload: ProxyErrorPayload = {
    proxy_error: true,
    status,
    data,
  };

  res.status(status).json(payload);
}

// ---------- Rutas ----------
app.get("/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

// GET products
app.get("/api/wc/products", async (req: Request, res: Response) => {
  try {
    const per_page = Number(req.query.per_page ?? 10);
    const page = Number(req.query.page ?? 1);

    const r = await wc.get("/products", { params: { per_page, page } });
    res.status(r.status).json(r.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// GET product by id
app.get("/api/wc/products/:id", async (req: Request, res: Response) => {
  try {
    const r = await wc.get(`/products/${req.params.id}`);
    res.status(r.status).json(r.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

// Buscar productos por nombre (temporal)
app.get("/api/wc/products", async (req, res) => {
  try {
    // Reenvía TODOS los query params tal cual a WooCommerce
    const r = await wc.get("/products", { params: req.query });
    res.status(r.status).json(r.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

app.get("/api/product/variations", async (_req, res) => {
  try {
    const r = await wc.get(`/products/${WC_PRODUCT_ID}/variations`, {
      params: { per_page: 100 },
    });
    res.status(r.status).json(r.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});


// POST orders (requiere Read/Write)
app.post("/api/wc/orders", async (req: Request, res: Response) => {
  try {
    const payload = req.body; // aquí puedes validar si quieres
    const r = await wc.post("/orders", payload);
    res.status(r.status).json(r.data);
  } catch (err) {
    handleAxiosError(err, res);
  }
});

type Billing = {
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

type CheckoutPayload = {
  variationId: number;
  quantity: number;
  billing: Billing;
  flowers: Array<{ id: string; name: string; qty: number }>;
  message?: string;
  notes?: string;
};

app.post("/api/checkout", async (req, res) => {
  try {
    const body = req.body as CheckoutPayload;

    if (!body?.variationId || !body?.quantity || !body?.billing?.email) {
      return res.status(400).json({ message: "Datos mínimos incompletos" });
    }

    const orderPayload = {
      set_paid: false,
      payment_method: "bacs",
      payment_method_title: "Transferencia",
      billing: body.billing,
      line_items: [
        {
          product_id: WC_PRODUCT_ID,
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

    const r = await wc.post("/orders", orderPayload);

    const orderId = (r.data as any).id as number;
    const orderKey = (r.data as any).order_key as string;

    const checkoutUrl =
      `${process.env.WC_BASE_URL}/checkout/order-pay/${orderId}/?pay_for_order=true&key=${orderKey}`;

    res.json({ orderId, checkoutUrl });
  } catch (err) {
    handleAxiosError(err, res);
  }
});


const port = Number(process.env.PORT ?? 3001);
app.listen(port, () => {
  console.log(`✅ Proxy TS corriendo en http://localhost:${port}`);
});
