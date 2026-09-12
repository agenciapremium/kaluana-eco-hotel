"use client";

import { SiteLink as Link } from "@/components/ui/SiteLink";
import { setConsent, useConsent } from "@/lib/consent";

/**
 * Banner de consentimento no padrão da marca. Aparece uma vez, antes de qualquer tag.
 * TODO(copy): texto do banner não consta no documento mestre; escrito no mesmo padrão, a revisar.
 */
export function ConsentBanner() {
  const { consent, ready } = useConsent();
  if (!ready || consent !== null) return null;
  return (
    <div
      role="region"
      aria-label="Cookies e medição"
      className="fixed inset-x-0 bottom-0 z-50 p-3 sm:p-5"
    >
      <div className="container-site">
        <div className="border-bege-escuro bg-branco mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border p-5 shadow-[0_12px_40px_-12px_rgba(85,47,34,0.35)] sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base">
            <strong className="font-semibold">Cookies e medição.</strong> Este site usa cookies para
            medir visitas e para anúncios do Kaluanã. Você escolhe.{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-4">
              Política de privacidade
            </Link>
          </p>
          <div className="flex flex-none gap-2">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setConsent("denied")}
            >
              Só o essencial
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setConsent("granted")}>
              Aceitar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
