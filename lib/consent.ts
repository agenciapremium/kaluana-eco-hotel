/**
 * Consentimento de cookies (LGPD). Nenhuma tag carrega antes de "granted".
 * Estado em localStorage, com evento para os componentes reagirem.
 */
import { useSyncExternalStore } from "react";

export type Consent = "granted" | "denied" | null;

export const CONSENT_KEY = "kaluana:consentimento";
const EVENT = "kaluana:consentimento";

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(value: Exclude<Consent, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // armazenamento indisponível: o estado vale só nesta página
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: value }));
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

/** null no servidor e antes da hidratação; depois, o valor guardado. */
export function useConsent(): { consent: Consent; ready: boolean } {
  const consent = useSyncExternalStore(subscribe, getConsent, () => null);
  const ready = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return { consent, ready };
}
