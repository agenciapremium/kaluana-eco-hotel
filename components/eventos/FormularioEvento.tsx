"use client";

import { useActionState, useRef, useState, type FormEvent } from "react";
import { enviarPedidoDeEvento, type EstadoEvento } from "@/app/actions/evento";
import { CampoErro } from "@/components/formularios/CampoErro";
import { Honeypot } from "@/components/formularios/Honeypot";
import { useFocoNoErro } from "@/components/formularios/useFocoNoErro";
import { Arrow } from "@/components/ui/Arrow";

const tipos = [
  "Reunião de diretoria",
  "Treinamento",
  "Convenção de vendas",
  "Congresso ou seminário",
  "Formatura",
  "Casamento",
  "Aniversário",
  "Outro",
];

const passos = ["O evento", "Você", "Detalhes"];

/** Em que passo fica cada campo, para levar o visitante ao erro que o servidor apontou. */
const passoDoCampo: Record<string, number> = {
  tipo: 0,
  data: 0,
  pessoas: 0,
  nome: 1,
  empresa: 1,
  email: 1,
  telefone: 1,
  hospedagem: 2,
  alimentacao: 2,
  mensagem: 2,
};

const CAMPO_INVALIDO = "input:invalid, select:invalid, textarea:invalid";

/**
 * Pedido de proposta em etapas (5.19, movimento: transição lateral entre os passos).
 *
 * Todos os campos existem no DOM desde o início: os passos só controlam o que aparece. Sem
 * JavaScript, todos os painéis ficam visíveis e o envio manda o formulário inteiro.
 *
 * Com JavaScript, a validação nativa do navegador fica desligada (noValidate), porque ela
 * travava o envio em silêncio quando o campo obrigatório estava num painel escondido. Em
 * troca: "Continuar" confere o passo atual, o envio confere tudo e abre o passo do primeiro
 * campo pendente, e um erro do servidor também leva ao passo do campo. O foco acompanha.
 */
export function FormularioEvento() {
  const [estado, action, enviando] = useActionState<EstadoEvento, FormData>(
    enviarPedidoDeEvento,
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  const [passo, setPasso] = useState(0);

  // Erro do servidor: abre o passo do primeiro campo com erro. Ajuste de estado durante a
  // renderização, o padrão do React para estado que depende de outro.
  const [estadoVisto, setEstadoVisto] = useState(estado);
  if (estado !== estadoVisto) {
    setEstadoVisto(estado);
    const primeiro = Object.keys(estado.campos ?? {})[0];
    if (primeiro !== undefined) setPasso(passoDoCampo[primeiro] ?? 0);
  }
  useFocoNoErro(estado, form);

  const erro = (campo: string) => estado?.campos?.[campo];
  const descrito = (campo: string) => (erro(campo) ? `ev-${campo}-erro` : undefined);
  const painel = (i: number) =>
    form.current?.querySelector<HTMLElement>(`[data-passo-indice="${i}"]`) ?? null;

  const irPara = (i: number) => {
    setPasso(i);
    requestAnimationFrame(() =>
      painel(i)?.querySelector<HTMLElement>("input, select, textarea")?.focus(),
    );
  };

  const avancar = () => {
    const pendente = painel(passo)?.querySelector<HTMLInputElement>(CAMPO_INVALIDO);
    if (pendente) {
      pendente.focus();
      pendente.reportValidity();
      return;
    }
    irPara(passo + 1);
  };

  const aoEnviar = (e: FormEvent<HTMLFormElement>) => {
    const pendente = e.currentTarget.querySelector<HTMLInputElement>(CAMPO_INVALIDO);
    if (!pendente) return;
    e.preventDefault();
    const indice = Number(
      pendente.closest<HTMLElement>("[data-passo-indice]")?.dataset.passoIndice ?? 0,
    );
    setPasso(indice);
    requestAnimationFrame(() => {
      pendente.focus();
      pendente.reportValidity();
    });
  };

  return (
    <form
      ref={form}
      action={action}
      onSubmit={aoEnviar}
      noValidate
      className="form-evento"
      data-passo={passo}
    >
      <Honeypot id="ev" />

      <ol className="form-passos" aria-label="Etapas do formulário">
        {passos.map((p, i) => (
          <li key={p}>
            <button
              type="button"
              className="form-passo"
              aria-current={passo === i ? "step" : undefined}
              onClick={() => irPara(i)}
            >
              <span className="form-passo-numero">{i + 1}</span>
              {p}
            </button>
          </li>
        ))}
      </ol>
      <p className="sr-only" aria-live="polite">
        Passo {passo + 1} de {passos.length}: {passos[passo]}
      </p>

      <div className="form-painel" data-passo-indice={0} data-ativo={passo === 0}>
        <div className="field-group">
          <label htmlFor="ev-tipo">Tipo de evento</label>
          <select
            id="ev-tipo"
            name="tipo"
            className="field"
            required
            defaultValue=""
            aria-invalid={Boolean(erro("tipo"))}
            aria-describedby={descrito("tipo")}
          >
            <option value="" disabled>
              Escolha
            </option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <CampoErro id="ev-tipo-erro" mensagem={erro("tipo")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field-group">
            <label htmlFor="ev-data">Data pretendida (opcional)</label>
            <input id="ev-data" name="data" type="date" className="field" />
          </div>
          <div className="field-group">
            <label htmlFor="ev-pessoas">Quantas pessoas (opcional)</label>
            <input
              id="ev-pessoas"
              name="pessoas"
              type="number"
              min="1"
              inputMode="numeric"
              className="field"
            />
          </div>
        </div>
      </div>

      <div className="form-painel" data-passo-indice={1} data-ativo={passo === 1}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field-group">
            <label htmlFor="ev-nome">Nome</label>
            <input
              id="ev-nome"
              name="nome"
              type="text"
              className="field"
              required
              autoComplete="name"
              aria-invalid={Boolean(erro("nome"))}
              aria-describedby={descrito("nome")}
            />
            <CampoErro id="ev-nome-erro" mensagem={erro("nome")} />
          </div>
          <div className="field-group">
            <label htmlFor="ev-empresa">Empresa (opcional)</label>
            <input
              id="ev-empresa"
              name="empresa"
              type="text"
              className="field"
              autoComplete="organization"
            />
          </div>
          <div className="field-group">
            <label htmlFor="ev-email">E-mail</label>
            <input
              id="ev-email"
              name="email"
              type="email"
              className="field"
              required
              autoComplete="email"
              aria-invalid={Boolean(erro("email"))}
              aria-describedby={descrito("email")}
            />
            <CampoErro id="ev-email-erro" mensagem={erro("email")} />
          </div>
          <div className="field-group">
            <label htmlFor="ev-telefone">Telefone</label>
            <input
              id="ev-telefone"
              name="telefone"
              type="tel"
              className="field"
              required
              autoComplete="tel"
              aria-invalid={Boolean(erro("telefone"))}
              aria-describedby={descrito("telefone")}
            />
            <CampoErro id="ev-telefone-erro" mensagem={erro("telefone")} />
          </div>
        </div>
      </div>

      <div className="form-painel" data-passo-indice={2} data-ativo={passo === 2}>
        <fieldset className="field-set">
          <legend>Precisa de hospedagem?</legend>
          <label className="field-radio">
            <input type="radio" name="hospedagem" value="sim" /> Sim
          </label>
          <label className="field-radio">
            <input type="radio" name="hospedagem" value="nao" defaultChecked /> Não
          </label>
        </fieldset>
        <fieldset className="field-set">
          <legend>Precisa de alimentação?</legend>
          <label className="field-radio">
            <input type="radio" name="alimentacao" value="sim" /> Sim
          </label>
          <label className="field-radio">
            <input type="radio" name="alimentacao" value="nao" defaultChecked /> Não
          </label>
        </fieldset>
        <div className="field-group">
          <label htmlFor="ev-mensagem">Conte o que você precisa (opcional)</label>
          <textarea id="ev-mensagem" name="mensagem" className="field" rows={4} />
        </div>
      </div>

      {estado?.erro ? (
        <p className="field-error mt-4" role="alert" tabIndex={-1} data-erro-geral>
          {estado.erro}
        </p>
      ) : null}

      <div className="form-acoes">
        {passo > 0 ? (
          <button type="button" className="btn btn-secondary" onClick={() => irPara(passo - 1)}>
            Voltar
          </button>
        ) : null}
        {passo < passos.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={avancar}>
            Continuar
            <Arrow />
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary form-enviar" disabled={enviando}>
          {enviando ? "Enviando" : "Solicitar proposta"}
          <Arrow />
        </button>
      </div>
      {/* TODO(copy): "Seus dados ficam com o hotel." não consta no documento mestre. */}
      <p className="mt-3 text-sm">
        A equipe responde em até um dia útil. Seus dados ficam com o hotel.
      </p>
    </form>
  );
}
