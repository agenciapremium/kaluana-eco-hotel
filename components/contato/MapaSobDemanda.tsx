"use client";

import { useState } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { track } from "@/lib/analytics";

/**
 * Mapa embutido que só carrega depois do clique (5.24, movimento): um iframe do Google Maps
 * pesa centenas de quilobytes e traz cookies de terceiro, o que atrapalharia o desempenho e
 * o consentimento. Até o clique, fica o endereço e o botão.
 *
 * Dispara mapa_click no analytics.
 */
export function MapaSobDemanda({ endereco }: { endereco: string }) {
  const [aberto, setAberto] = useState(false);
  const consulta = encodeURIComponent(endereco);

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
    <div className="mapa-embutido">
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
