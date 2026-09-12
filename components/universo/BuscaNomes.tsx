"use client";

import { useId, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type ItemBusca = { nome: string; uh: string; url: string; andar: string };

/** Tira acentos e caixa, para a busca casar "acai" com "Açaí". */
const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

/**
 * Busca do hub (5.11): filtra os nomes e os números de quarto conforme o visitante digita.
 * Sem JavaScript o campo some e a grade de andares continua servindo de navegação.
 * O número do quarto só entra no índice na fase completa (Parte 3.5).
 */
export function BuscaNomes({ itens, mostraNumero }: { itens: ItemBusca[]; mostraNumero: boolean }) {
  const [termo, setTermo] = useState("");
  const id = useId();
  const router = useRouter();

  const achados = useMemo(() => {
    const t = normalizar(termo);
    if (t.length < 2) return [];
    return itens
      .filter((i) => normalizar(i.nome).includes(t) || (mostraNumero && i.uh.startsWith(t)))
      .slice(0, 8);
  }, [termo, itens, mostraNumero]);

  return (
    <form
      className="busca"
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        if (achados[0]) router.push(achados[0].url);
      }}
    >
      <label htmlFor={id} className="busca-label">
        {mostraNumero ? "Digite o nome ou o número do quarto" : "Digite o nome do quarto"}
      </label>
      <input
        id={id}
        type="search"
        className="field busca-campo"
        autoComplete="off"
        placeholder={mostraNumero ? "Rio Machado ou 112" : "Rio Machado"}
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        aria-describedby={`${id}-contagem`}
      />
      <p id={`${id}-contagem`} className="sr-only" aria-live="polite">
        {termo.length < 2
          ? "Digite ao menos duas letras"
          : `${achados.length} resultado${achados.length === 1 ? "" : "s"}`}
      </p>
      {achados.length > 0 ? (
        <ul className="busca-resultados">
          {achados.map((a) => (
            <li key={a.url}>
              <a href={a.url}>
                <span className="busca-nome">{a.nome}</span>
                <span className="busca-andar">
                  {a.andar}
                  {mostraNumero ? ` · ${a.uh}` : ""}
                </span>
              </a>
            </li>
          ))}
        </ul>
      ) : null}
    </form>
  );
}
