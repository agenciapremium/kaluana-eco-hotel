"use client";

import { useActionState, useState } from "react";
import { enviarPedidoDeEvento, type EstadoEvento } from "@/app/actions/evento";
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

/**
 * Pedido de proposta em etapas (5.19, movimento: transição lateral entre os passos).
 *
 * Todos os campos existem no DOM desde o início: os passos só controlam o que aparece, de
 * forma que o envio sem JavaScript mande o formulário inteiro de uma vez. A validação de
 * verdade é a do servidor.
 */
export function FormularioEvento() {
  const [estado, action, enviando] = useActionState<EstadoEvento, FormData>(
    enviarPedidoDeEvento,
    {},
  );
  const [passo, setPasso] = useState(0);
  const erro = (campo: string) => estado?.campos?.[campo];
  const passos = ["O evento", "Você", "Detalhes"];

  return (
    <form action={action} className="form-evento" data-passo={passo}>
      {/* Honeypot: campo invisível que humanos não preenchem. */}
      <div className="hp" aria-hidden="true">
        <label htmlFor="ev-website">Site</label>
        <input id="ev-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <ol className="form-passos" aria-label="Etapas do formulário">
        {passos.map((p, i) => (
          <li key={p}>
            <button
              type="button"
              className="form-passo"
              aria-current={passo === i ? "step" : undefined}
              onClick={() => setPasso(i)}
            >
              <span className="form-passo-numero">{i + 1}</span>
              {p}
            </button>
          </li>
        ))}
      </ol>

      <div className="form-painel" hidden={passo !== 0}>
        <div className="field-group">
          <label htmlFor="ev-tipo">Tipo de evento</label>
          <select id="ev-tipo" name="tipo" className="field" required defaultValue="">
            <option value="" disabled>
              Escolha
            </option>
            {tipos.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {erro("tipo") ? <p className="field-error">{erro("tipo")}</p> : null}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="field-group">
            <label htmlFor="ev-data">Data pretendida</label>
            <input id="ev-data" name="data" type="date" className="field" />
          </div>
          <div className="field-group">
            <label htmlFor="ev-pessoas">Quantas pessoas</label>
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

      <div className="form-painel" hidden={passo !== 1}>
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
            />
            {erro("nome") ? <p className="field-error">{erro("nome")}</p> : null}
          </div>
          <div className="field-group">
            <label htmlFor="ev-empresa">Empresa</label>
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
            />
            {erro("email") ? <p className="field-error">{erro("email")}</p> : null}
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
            />
            {erro("telefone") ? <p className="field-error">{erro("telefone")}</p> : null}
          </div>
        </div>
      </div>

      <div className="form-painel" hidden={passo !== 2}>
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
          <label htmlFor="ev-mensagem">Conte o que você precisa</label>
          <textarea id="ev-mensagem" name="mensagem" className="field" rows={4} />
        </div>
      </div>

      {estado?.erro ? (
        <p className="field-error mt-4" role="alert">
          {estado.erro}
        </p>
      ) : null}

      <div className="form-acoes">
        {passo > 0 ? (
          <button type="button" className="btn btn-secondary" onClick={() => setPasso(passo - 1)}>
            Voltar
          </button>
        ) : null}
        {passo < passos.length - 1 ? (
          <button type="button" className="btn btn-primary" onClick={() => setPasso(passo + 1)}>
            Continuar
            <Arrow />
          </button>
        ) : null}
        <button type="submit" className="btn btn-primary form-enviar" disabled={enviando}>
          {enviando ? "Enviando" : "Solicitar proposta"}
          <Arrow />
        </button>
      </div>
      <p className="mt-3 text-sm">
        A equipe responde em até um dia útil. Seus dados ficam com o hotel.
      </p>
    </form>
  );
}
