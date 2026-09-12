"use client";

import { useSyncExternalStore } from "react";
import { CopyText } from "@/components/Copy";

export type Refeicao = {
  id: string;
  nome: string;
  /**
   * Frase da copy já pronta para exibir. Vem vazia quando os horários ainda são campos
   * pendentes: o texto é saneado no servidor, porque prop de componente cliente viaja no
   * HTML e um ⟨colchete⟩ aqui chegaria à produção (veto 5).
   */
  texto: string;
  /** Faixa aproximada do dia, para destacar a refeição do momento (5.18, movimento). */
  faixa: [number, number];
};

/**
 * Cardápio em acordeão por refeição (5.18). A refeição do momento abre sozinha, pela hora
 * do navegador, e ganha a etiqueta "Servindo agora".
 *
 * Enquanto os horários forem campos pendentes com o cliente, a lista mostra só os nomes das
 * refeições: sem hora de verdade não há como afirmar que o restaurante está servindo agora.
 * Quando os horários chegarem, a faixa aproximada sai e entra o horário real.
 * Sem JavaScript, todas as refeições ficam abertas.
 */
/** Nada muda depois da primeira leitura: a hora é lida uma vez, na montagem. */
const semInscricao = () => () => {};
const horaNoCliente = () => new Date().getHours();
const horaNoServidor = () => null;

export function Cardapio({ refeicoes }: { refeicoes: Refeicao[] }) {
  // useSyncExternalStore em vez de efeito com setState: o servidor renderiza tudo aberto e
  // o navegador destaca a refeição do momento, sem renderização em cascata.
  const agora = useSyncExternalStore(semInscricao, horaNoCliente, horaNoServidor);

  return (
    <div className="cardapio">
      {refeicoes.map((r) => {
        const naHora =
          Boolean(r.texto) && agora !== null && agora >= r.faixa[0] && agora < r.faixa[1];
        if (!r.texto) {
          return (
            <p key={r.id} className="refeicao refeicao-simples">
              <span className="refeicao-nome">{r.nome}</span>
            </p>
          );
        }
        return (
          <details
            key={r.id}
            className="refeicao"
            open={agora === null ? true : naHora}
            data-agora={naHora ? "true" : undefined}
          >
            <summary>
              <span className="refeicao-nome">{r.nome}</span>
              {naHora ? <span className="refeicao-agora">Servindo agora</span> : null}
              <svg
                viewBox="0 0 24 24"
                className="pergunta-seta h-5 w-5 flex-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 10l6 6 6-6" />
              </svg>
            </summary>
            <div className="pergunta-corpo">
              <p>
                <CopyText text={r.texto} />
              </p>
            </div>
          </details>
        );
      })}
    </div>
  );
}
