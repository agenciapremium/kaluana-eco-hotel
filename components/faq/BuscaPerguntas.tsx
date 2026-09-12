"use client";

import { useId, useMemo, useState, type ReactNode } from "react";

const normalizar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export type ItemFaq = { chave: string; texto: string; node: ReactNode };
export type GrupoFaq = { id: string; nome: string; itens: ItemFaq[] };

/**
 * Busca que filtra as perguntas em tempo real (5.25, movimento), sobre os grupos por tema.
 *
 * As perguntas chegam já renderizadas no servidor: o componente só decide o que fica
 * visível. Sem JavaScript o campo some e todas ficam na tela, agrupadas e com âncora.
 */
export function BuscaPerguntas({ grupos }: { grupos: GrupoFaq[] }) {
  const [termo, setTermo] = useState("");
  const id = useId();

  const visiveis = useMemo(() => {
    const t = normalizar(termo.trim());
    if (t.length < 2) return null;
    return new Set(
      grupos.flatMap((g) =>
        g.itens.filter((i) => normalizar(i.texto).includes(t)).map((i) => i.chave),
      ),
    );
  }, [termo, grupos]);

  const total = visiveis ? visiveis.size : grupos.reduce((s, g) => s + g.itens.length, 0);

  return (
    <div>
      <div className="busca-faq">
        <label htmlFor={id} className="busca-label">
          Procure uma pergunta
        </label>
        <input
          id={id}
          type="search"
          className="field"
          placeholder="café da manhã, estacionamento, acessibilidade"
          value={termo}
          onChange={(e) => setTermo(e.target.value)}
          autoComplete="off"
        />
        <p className="sr-only" aria-live="polite">
          {total} pergunta{total === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-10">
        {grupos.map((g) => {
          const algum = g.itens.some((i) => !visiveis || visiveis.has(i.chave));
          return (
            <section key={g.id} id={g.id} className="grupo-faq" hidden={!algum}>
              <h2 className="kicker mb-4">{g.nome}</h2>
              <div className="perguntas">
                {g.itens.map((i) => (
                  <div key={i.chave} hidden={visiveis ? !visiveis.has(i.chave) : false}>
                    {i.node}
                  </div>
                ))}
              </div>
            </section>
          );
        })}
        {total === 0 ? (
          <p className="text-lg">
            Nenhuma pergunta com esse termo. Escreva para a gente pelo formulário de contato.
          </p>
        ) : null}
      </div>
    </div>
  );
}
