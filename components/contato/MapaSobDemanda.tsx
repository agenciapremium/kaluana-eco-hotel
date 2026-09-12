"use client";

import { useEffect, useRef, useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { track } from "@/lib/analytics";

/**
 * Mapa embutido que só carrega depois do clique (5.24, movimento): um iframe do Google Maps
 * pesa centenas de quilobytes e traz cookies de terceiro, o que atrapalharia o desempenho e
 * o consentimento. Até o clique, fica o endereço e o botão.
 *
 * O botão some quando o mapa abre; o foco vai para a moldura do mapa, para quem usa teclado
 * não voltar ao começo da página (etapa 6).
 *
 * Dispara mapa_click no analytics.
 */
export function MapaSobDemanda({ endereco }: { endereco: string }) {
  const [aberto, setAberto] = useState(false);
  const moldura = useRef<HTMLDivElement>(null);
  const consulta = encodeURIComponent(endereco);

  useEffect(() => {
    if (aberto) moldura.current?.focus();
  }, [aberto]);

  if (!aberto) {
    return (
      <div className="mapa-espera">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            track("mapa_click", { origem: "contato" });
            setAberto(true);
          }}
        >
          Ver mapa
          <Arrow />
        </button>
        <p className="mapa-espera-nota">O mapa carrega do Google e só entra quando você pede.</p>
      </div>
    );
  }

  return (
    <div ref={moldura} className="mapa-embutido" tabIndex={-1} role="region" aria-label="Mapa">
      <iframe
        title="Mapa do Kaluanã Eco Hotel"
        src={`https://www.google.com/maps?q=${consulta}&output=embed`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
    </div>
  );
}
