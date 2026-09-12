"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Dispara o evento de conversão uma vez por envio, conforme o formulário de origem:
 * lead_evento para o pedido de proposta (5.19), lead_pre_inauguracao para o formulário da
 * pré-inauguração e lead_corporativo quando o perfil é empresa.
 */
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
    if (perfil === "evento") {
      track("lead_evento", { origem: "eventos" });
      return;
    }
    track("lead_pre_inauguracao", { perfil });
    if (perfil === "empresa") track("lead_corporativo", { origem: "pre_inauguracao" });
  }, [perfil]);
  return null;
}
