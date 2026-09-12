"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { track } from "@/lib/analytics";

export type DadosHospede = {
  /** Nome do quarto, para a saudação. */
  nome: string;
  uh: string;
  /** Próximo quarto na sequência das UHs. */
  proximo: { nome: string; url: string } | null;
  categoriaUrl: string | null;
  categoria: string | null;
  mostraNumero: boolean;
};

/**
 * Barra de hóspede (Parte 6.0, item 1). Aparece só quando a página é aberta pelo QR Code,
 * que chega com ?uh= vindo do 301 de /q/[uh].
 *
 * Usa useSearchParams dentro de um Suspense: a página continua estática (a canônica nunca
 * tem o parâmetro e o HTML é o mesmo para todos) e o parâmetro é lido no navegador.
 * Dispara qr_scan uma vez por sessão e por quarto.
 */
export function BarraHospede({ dados, children }: { dados: DadosHospede; children?: ReactNode }) {
  const params = useSearchParams();
  const aberta = params.get("uh") === dados.uh;

  useEffect(() => {
    if (!aberta) return;
    const chave = `kaluana:qr:${dados.uh}`;
    try {
      if (window.sessionStorage.getItem(chave)) return;
      window.sessionStorage.setItem(chave, "1");
    } catch {
      // sem armazenamento de sessão: registra assim mesmo
    }
    track("qr_scan", { uh: dados.uh, elemento: dados.nome });
  }, [aberta, dados.uh, dados.nome]);

  if (!aberta) return null;

  return (
    <aside className="barra-hospede" aria-label="Informações do seu quarto">
      <div className="container-site barra-hospede-inner">
        <p className="barra-hospede-saudacao">
          Você está no quarto <strong>{dados.nome}</strong>
          {dados.mostraNumero ? <span className="barra-hospede-uh">{dados.uh}</span> : null}
        </p>
        <ul className="barra-hospede-links">
          <li>
            <Link href="/contato">Wi-Fi e recepção</Link>
          </li>
          <li>
            <Link href="/restaurante">Restaurante</Link>
          </li>
          <li>
            <Link href="/perguntas-frequentes">Check-out</Link>
          </li>
          {dados.categoriaUrl && dados.categoria ? (
            <li>
              <Link href={dados.categoriaUrl}>{dados.categoria}</Link>
            </li>
          ) : null}
          {dados.proximo ? (
            <li>
              <Link href={dados.proximo.url}>Próximo quarto: {dados.proximo.nome}</Link>
            </li>
          ) : null}
        </ul>
        {children ? <div className="barra-hospede-audio">{children}</div> : null}
      </div>
    </aside>
  );
}
