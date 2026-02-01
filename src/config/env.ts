import dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
  PORT: number;
  WC_BASE_URL: string;
  WC_CONSUMER_KEY: string;
  WC_CONSUMER_SECRET: string;
  WC_PRODUCT_ID: number;
  FRONTEND_ORIGIN: string;
};

function requireString(name: string): string {
  const v = process.env[name];
  if (!v || v.trim().length === 0) {
    // eslint-disable-next-line no-console
    console.error(`Falta ${name} en .env`);
    process.exit(1);
  }
  return v;
}

function requireNumber(name: string): number {
  const raw = requireString(name);
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) {
    // eslint-disable-next-line no-console
    console.error(`${name} debe ser un número válido (> 0). Valor recibido: "${raw}"`);
    process.exit(1);
  }
  return n;
}

export const config: EnvConfig = {
  PORT: Number(process.env.PORT ?? 3001),
  WC_BASE_URL: requireString("WC_BASE_URL"),
  WC_CONSUMER_KEY: requireString("WC_CONSUMER_KEY"),
  WC_CONSUMER_SECRET: requireString("WC_CONSUMER_SECRET"),
  WC_PRODUCT_ID: requireNumber("WC_PRODUCT_ID"),
  FRONTEND_ORIGIN: requireString("FRONTEND_ORIGIN"),
};
