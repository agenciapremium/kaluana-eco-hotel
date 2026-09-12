"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Dispara lead_pre_inauguracao (e lead_corporativo para empresas) uma vez por envio. */
export function LeadTracker() {
  const params = useSearchParams();
  const perfil = params.get("perfil") ?? "";
  useEffect(() => {
    const key = "kaluana:lead-registrado";
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // segue sem a trava
    }
    track("lead_pre_inauguracao", { perfil });
    if (perfil === "empresa") track("lead_corporativo", { origem: "pre_inauguracao" });
  }, [perfil]);
  return null;
}
