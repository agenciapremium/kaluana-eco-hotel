/**
 * Camada de dados para o GTM (GA4, Pixel e CAPI da Meta configurados na agência).
 * Eventos definidos no CLAUDE.md, seção 5. Nada é enviado sem consentimento.
 */
import { getConsent } from "./consent";

export const eventNames = [
  "reservar_click",
  "lead_pre_inauguracao",
  "lead_evento",
  "lead_corporativo",
  "qr_scan",
  "whatsapp_click",
  "mapa_click",
  "cardapio_open",
  "audio_play",
] as const;

export type EventName = (typeof eventNames)[number];
export type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export const gtmId = process.env.NEXT_PUBLIC_GTM_ID || "";

export function track(event: EventName, params: EventParams = {}) {
  if (typeof window === "undefined") return;
  if (getConsent() !== "granted") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
