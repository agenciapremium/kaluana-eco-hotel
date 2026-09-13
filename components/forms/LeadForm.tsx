"use client";

import { SiteLink as Link } from "@/components/ui/SiteLink";
import { useActionState, useRef } from "react";
import { enviarLead, type LeadState } from "@/app/actions/lead";
import { CampoErro } from "@/components/formularios/CampoErro";
import { Honeypot } from "@/components/formularios/Honeypot";
import { useFocoNoErro } from "@/components/formularios/useFocoNoErro";
import { Arrow } from "@/components/ui/Arrow";

const perfis = [
  { value: "hospede", label: "Hóspede" },
  { value: "empresa", label: "Empresa" },
  { value: "imprensa", label: "Imprensa" },
  { value: "fornecedor", label: "Fornecedor" },
] as const;

/**
 * Formulário "Avisamos você primeiro" (5.30). Server action com validação Zod, honeypot e
 * limite por IP. Funciona sem JavaScript: o envio redireciona para /obrigado.
 */
export function LeadForm({ origem }: { origem: "pre" | "empresas" }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(enviarLead, null);
  const form = useRef<HTMLFormElement>(null);
  useFocoNoErro(state, form);
  const erro = (campo: string) => state?.campos?.[campo];
  const descrito = (campo: string) => (erro(campo) ? `lead-${campo}-erro` : undefined);

  return (
    <form ref={form} action={action} className="lead-form" aria-describedby="lead-ajuda">
      <input type="hidden" name="origem" value={origem} />
      <Honeypot id="lead" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="lead-nome">Nome</label>
          <input
            id="lead-nome"
            name="nome"
            type="text"
            className="field"
            required
            autoComplete="name"
            aria-invalid={Boolean(erro("nome"))}
            aria-describedby={descrito("nome")}
          />
          <CampoErro id="lead-nome-erro" mensagem={erro("nome")} />
        </div>
        <div className="field-group">
          <label htmlFor="lead-email">E-mail</label>
          <input
            id="lead-email"
            name="email"
            type="email"
            className="field"
            required
            autoComplete="email"
            aria-invalid={Boolean(erro("email"))}
            aria-describedby={descrito("email")}
          />
          <CampoErro id="lead-email-erro" mensagem={erro("email")} />
        </div>
        <div className="field-group">
          <label htmlFor="lead-telefone">Telefone</label>
          <input
            id="lead-telefone"
            name="telefone"
            type="tel"
            className="field"
            required
            autoComplete="tel"
            aria-invalid={Boolean(erro("telefone"))}
            aria-describedby={descrito("telefone")}
          />
          <CampoErro id="lead-telefone-erro" mensagem={erro("telefone")} />
        </div>
        <div className="field-group">
          <label htmlFor="lead-sou">Sou</label>
          <select id="lead-sou" name="sou" className="field" required defaultValue="hospede">
            {perfis.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="field-group sm:col-span-2">
          <label htmlFor="lead-empresa">
            Empresa <span className="text-cafe/80">(se for o caso)</span>
          </label>
          <input
            id="lead-empresa"
            name="empresa"
            type="text"
            className="field"
            autoComplete="organization"
          />
        </div>
      </div>

      {state?.erro ? (
        <p role="alert" className="field-error mt-4" tabIndex={-1} data-erro-geral>
          {state.erro}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* TODO(copy): "Seus dados ficam com o hotel." não consta no documento mestre. */}
        <p id="lead-ajuda" className="text-cafe/80 text-sm">
          Seus dados ficam com o hotel.{" "}
          <Link href="/politica-de-privacidade" className="underline underline-offset-4">
            Política de privacidade
          </Link>
        </p>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? "Enviando" : "Quero ser avisado"}
          <Arrow />
        </button>
      </div>
    </form>
  );
}
