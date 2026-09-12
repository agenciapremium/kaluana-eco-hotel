"use client";

import { useActionState } from "react";
import { enviarCurriculo, type EstadoFormulario } from "@/app/actions/contato";
import { Arrow } from "@/components/ui/Arrow";
import { CampoErro } from "./CampoErro";
import { Honeypot } from "./Honeypot";

const areas = [
  { value: "recepcao", label: "Recepção" },
  { value: "governanca", label: "Governança" },
  { value: "restaurante", label: "Restaurante" },
  { value: "cozinha", label: "Cozinha" },
  { value: "manutencao", label: "Manutenção" },
  { value: "eventos", label: "Eventos" },
  { value: "outra", label: "Outra" },
];

/**
 * Currículo (5.26). O arquivo segue anexo no e-mail para a equipe e não é gravado em
 * lugar nenhum: o site não guarda arquivo de terceiro. PDF ou DOCX, até 5 MB.
 */
export function FormularioCurriculo() {
  const [estado, action, enviando] = useActionState<EstadoFormulario, FormData>(
    enviarCurriculo,
    {},
  );
  const erro = (campo: string) => estado?.campos?.[campo];

  return (
    <form action={action} className="form-site" encType="multipart/form-data">
      <Honeypot id="cv" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field-group">
          <label htmlFor="cv-nome">Nome</label>
          <input
            id="cv-nome"
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
          <label htmlFor="cv-telefone">Telefone</label>
          <input
            id="cv-telefone"
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
          <label htmlFor="cv-email">E-mail</label>
          <input
            id="cv-email"
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
          <label htmlFor="cv-area">Área de interesse</label>
          <select id="cv-area" name="area" className="field" required defaultValue="recepcao">
            {areas.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <CampoErro mensagem={erro("area")} />
        </div>
      </div>
      <div className="field-group mt-4">
        <label htmlFor="cv-experiencia">Experiência</label>
        <textarea id="cv-experiencia" name="experiencia" className="field" rows={4} />
      </div>
      <div className="field-group mt-4">
        <label htmlFor="cv-arquivo">Currículo em PDF ou DOCX, até 5 MB</label>
        <input
          id="cv-arquivo"
          name="curriculo"
          type="file"
          className="field field-arquivo"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          aria-invalid={Boolean(erro("curriculo"))}
        />
        <CampoErro mensagem={erro("curriculo")} />
      </div>
      {estado?.erro ? (
        <p className="field-error mt-4" role="alert">
          {estado.erro}
        </p>
      ) : null}
      <button type="submit" className="btn btn-primary mt-6" disabled={enviando}>
        {enviando ? "Enviando" : "Enviar currículo"}
        <Arrow />
      </button>
      <p className="mt-3 text-sm">
        O arquivo vai direto para a equipe por e-mail e não fica guardado no site.
      </p>
    </form>
  );
}
