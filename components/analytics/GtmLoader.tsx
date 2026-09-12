"use client";

import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/consent";
import { gtmId } from "@/lib/analytics";

/**
 * Carrega o Google Tag Manager só depois do consentimento. Antes disso, declara o
 * Consent Mode com tudo negado. Sem NEXT_PUBLIC_GTM_ID, não carrega nada.
 */
export function GtmLoader() {
  const { consent } = useConsent();
  const granted = consent === "granted" && Boolean(gtmId);

  useEffect(() => {
    if (!gtmId) return;
    window.dataLayer = window.dataLayer || [];
    const gtag = (...args: unknown[]) => {
      window.dataLayer?.push(args);
    };
    if (consent === "granted") {
      gtag("consent", "update", {
        ad_storage: "granted",
        analytics_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
      });
    } else {
      gtag("consent", "default", {
        ad_storage: "denied",
        analytics_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        wait_for_update: 500,
      });
    }
  }, [consent]);

  if (!granted) return null;
  return (
    <Script id="gtm" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtmId}');`}
    </Script>
  );
}
