import axios from "axios";
import { config } from "../config/env";

function basicAuthHeader(): Record<string, string> {
  const token = Buffer.from(`${config.WC_CONSUMER_KEY}:${config.WC_CONSUMER_SECRET}`).toString("base64");
  return { Authorization: `Basic ${token}` };
}

export const wc = axios.create({
  baseURL: `${config.WC_BASE_URL}/wp-json/wc/v3`,
  timeout: 20000,
  headers: {
    ...basicAuthHeader(),
    "Content-Type": "application/json",
  },
});
