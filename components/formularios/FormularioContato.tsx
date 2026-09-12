"use client";

import { useActionState, useRef } from "react";
import { enviarMensagem, type EstadoFormulario } from "@/app/actions/contato";
import { Arrow } from "@/components/ui/Arrow";
import { CampoErro } from "./CampoErro";
import { Honeypot } from "./Honeypot";
import { useFocoNoErro } from "./useFocoNoErro";

const assuntos = [
  { value: "reserva", label: "Reserva" },
  { value: "evento", label: "Evento" },
  { value: "restaurante", label: "Restaurante" },
  { value: "imprensa", label: "Imprensa" },
  { value: "outro", label: "Outro" },
];

/** Formulário de mensagem do Contato (5.24). Funciona sem JavaScript. */
export function FormularioContato() {
  const [estado, action, enviando] = useActionState<EstadoFormulario, FormData>(enviarMensagem, {});
  const form = useRef<HTMLFormElement>(null);
  useFocoNoErro(estado, form);
  const erro = (campo: string) => estado?.campos?.[campo];
  const descrito = (campo: string) => (erro(campo) ? `ct-${campo}-erro` : undefined);

  return (
    <form ref={form} action={action} className="form-site">
      <Honeypot id="ct" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="ct-nome">Nome</label>
          <input
            id="ct-nome"
            name="nome"
            type="text"
            className="field"
            required
            autoComplete="name"
            aria-invalid={Boolean(erro("nome"))}
            aria-describedby={descrito("nome")}
          />
          <CampoErro id="ct-nome-erro" mensagem={erro("nome")} />
        </div>
        <div className="field-group">
          <label htmlFor="ct-email">E-mail</label>
          <input
            id="ct-email"
            name="email"
            type="email"
            className="field"
            required
            autoComplete="email"
            aria-invalid={Boolean(erro("email"))}
            aria-describedby={descrito("email")}
          />
          <CampoErro id="ct-email-erro" mensagem={erro("email")} />
        </div>
        <div className="field-group">
          <label htmlFor="ct-telefone">Telefone</label>
          <input
            id="ct-telefone"
            name="telefone"
            type="tel"
            className="field"
            required
            autoComplete="tel"
            aria-invalid={Boolean(erro("telefone"))}
            aria-describedby={descrito("telefone")}
          />
          <CampoErro id="ct-telefone-erro" mensagem={erro("telefone")} />
        </div>
        <div className="field-group">
          <label htmlFor="ct-assunto">Assunto</label>
          <select
            id="ct-assunto"
            name="assunto"
            className="field"
            required
            defaultValue="reserva"
            aria-invalid={Boolean(erro("assunto"))}
            aria-describedby={descrito("assunto")}
          >
            {assuntos.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <CampoErro id="ct-assunto-erro" mensagem={erro("assunto")} />
        </div>
      </div>
      <div className="field-group mt-4">
        <label htmlFor="ct-mensagem">Mensagem</label>
        <textarea
          id="ct-mensagem"
          name="mensagem"
          className="field"
          rows={5}
          required
          aria-invalid={Boolean(erro("mensagem"))}
          aria-describedby={descrito("mensagem")}
        />
        <CampoErro id="ct-mensagem-erro" mensagem={erro("mensagem")} />
      </div>
      {estado?.erro ? (
        <p className="field-error mt-4" role="alert" tabIndex={-1} data-erro-geral>
          {estado.erro}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-6" disabled={enviando}>
        {enviando ? "Enviando" : "Enviar mensagem"}
        <Arrow />
      </button>
      {/* TODO(copy): "Seus dados ficam com o hotel." não consta no documento mestre. */}
      <p className="mt-3 text-sm">Seus dados ficam com o hotel.</p>
    </form>
  );
}
