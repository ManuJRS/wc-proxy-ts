// file: src/utils/validation.ts
import type { CheckoutPayload } from "../types/checkout.types";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function isPositiveNumber(v: unknown): v is number {
  return typeof v === "number" && Number.isFinite(v) && v > 0;
}

/**
 * Validación mínima (no rompe comportamiento):
 * - variationId > 0
 * - quantity > 0
 * - billing.email presente (string no vacío)
 * - billing debe ser objeto
 *
 * Nota: no forzamos el resto de campos billing para no cambiar reglas actuales.
 */
export function validateCheckoutPayload(body: unknown): ValidationResult<CheckoutPayload> {
  if (!isRecord(body)) return { ok: false, message: "Body inválido (se esperaba objeto JSON)" };

  const variationId = body.variationId;
  const quantity = body.quantity;
  const billing = body.billing;

  if (!isPositiveNumber(variationId)) return { ok: false, message: "variationId es requerido y debe ser número > 0" };
  if (!isPositiveNumber(quantity)) return { ok: false, message: "quantity es requerido y debe ser número > 0" };
  if (!isRecord(billing)) return { ok: false, message: "billing es requerido y debe ser objeto" };
  if (!isNonEmptyString(billing.email)) return { ok: false, message: "billing.email es requerido" };

  // Si flowers no viene, lo normalizamos a []
  const flowersRaw = body.flowers;
  const flowers = Array.isArray(flowersRaw) ? (flowersRaw as CheckoutPayload["flowers"]) : [];

  const payload: CheckoutPayload = {
    variationId,
    quantity,
    billing: billing as CheckoutPayload["billing"],
    flowers,
    message: typeof body.message === "string" ? body.message : undefined,
    notes: typeof body.notes === "string" ? body.notes : undefined,
  };

  return { ok: true, value: payload };
}
