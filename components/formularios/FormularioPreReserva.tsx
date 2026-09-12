"use client";

import { useActionState } from "react";
import { enviarPreReserva, type EstadoFormulario } from "@/app/actions/contato";
import { Arrow } from "@/components/ui/Arrow";
import { CampoErro } from "./CampoErro";
import { Honeypot } from "./Honeypot";

/**
 * Pré-reserva (5.23): enquanto o motor de reservas não existir, a página capta o interesse
 * com datas previstas. Quando o motor entrar, este bloco dá lugar ao widget.
 */
export function FormularioPreReserva() {
  const [estado, action, enviando] = useActionState<EstadoFormulario, FormData>(
    enviarPreReserva,
    {},
  );
  const erro = (campo: string) => estado?.campos?.[campo];

  return (
    <form action={action} className="form-site">
      <Honeypot id="pr" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="pr-nome">Nome</label>
          <input
            id="pr-nome"
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
          <label htmlFor="pr-email">E-mail</label>
          <input
            id="pr-email"
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
          <label htmlFor="pr-telefone">Telefone</label>
          <input
            id="pr-telefone"
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
          <label htmlFor="pr-empresa">Empresa (opcional)</label>
          <input
            id="pr-empresa"
            name="empresa"
            type="text"
            className="field"
            autoComplete="organization"
          />
        </div>
        <div className="field-group">
          <label htmlFor="pr-entrada">Entrada prevista</label>
          <input id="pr-entrada" name="entrada" type="date" className="field" />
        </div>
        <div className="field-group">
          <label htmlFor="pr-saida">Saída prevista</label>
          <input id="pr-saida" name="saida" type="date" className="field" />
        </div>
      </div>
      {estado?.erro ? (
        <p className="field-error mt-4" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-6" disabled={enviando}>
        {enviando ? "Enviando" : "Quero ser avisado"}
        <Arrow />
      </button>
      <p className="mt-3 text-sm">Avisamos você assim que as reservas abrirem.</p>
    </form>
  );
}
