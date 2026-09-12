"use client";

import { useActionState } from "react";
import { enviarMensagem, type EstadoFormulario } from "@/app/actions/contato";
import { Arrow } from "@/components/ui/Arrow";
import { CampoErro } from "./CampoErro";
import { Honeypot } from "./Honeypot";

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
  const erro = (campo: string) => estado?.campos?.[campo];

  return (
    <form action={action} className="form-site">
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
          />
          <CampoErro mensagem={erro("nome")} />
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
          />
          <CampoErro mensagem={erro("email")} />
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
          />
          <CampoErro mensagem={erro("telefone")} />
        </div>
        <div className="field-group">
          <label htmlFor="ct-assunto">Assunto</label>
          <select id="ct-assunto" name="assunto" className="field" required defaultValue="reserva">
            {assuntos.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <CampoErro mensagem={erro("assunto")} />
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
        />
        <CampoErro mensagem={erro("mensagem")} />
      </div>
      {estado?.erro ? (
        <p className="field-error mt-4" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-6" disabled={enviando}>
        {enviando ? "Enviando" : "Enviar mensagem"}
        <Arrow />
      </button>
      <p className="mt-3 text-sm">Seus dados ficam com o hotel.</p>
    </form>
  );
}
