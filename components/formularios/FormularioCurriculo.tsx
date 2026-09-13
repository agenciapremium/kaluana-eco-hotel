"use client";

import { useActionState, useRef, useState, type ChangeEvent } from "react";
import { enviarCurriculo, type EstadoFormulario } from "@/app/actions/contato";
import { Arrow } from "@/components/ui/Arrow";
import { CURRICULO_MAX_BYTES, curriculoAceito } from "@/lib/curriculo";
import { CampoErro } from "./CampoErro";
import { Honeypot } from "./Honeypot";
import { useFocoNoErro } from "./useFocoNoErro";

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
 * lugar nenhum: o site não guarda arquivo de terceiro. PDF ou DOCX, até 4 MB.
 *
 * O tamanho e o formato são conferidos assim que o arquivo é escolhido: um arquivo grande
 * demais nem chega a ser enviado, porque a Vercel recusaria a requisição antes da action
 * (lib/curriculo.ts). A action confere de novo.
 */
export function FormularioCurriculo() {
  const [estado, action, enviando] = useActionState<EstadoFormulario, FormData>(
    enviarCurriculo,
    {},
  );
  const form = useRef<HTMLFormElement>(null);
  useFocoNoErro(estado, form);
  const [erroArquivo, setErroArquivo] = useState<string>();
  const erro = (campo: string) =>
    campo === "curriculo" ? (erroArquivo ?? estado?.campos?.curriculo) : estado?.campos?.[campo];
  const descrito = (campo: string) => (erro(campo) ? `cv-${campo}-erro` : undefined);

  const conferirArquivo = (e: ChangeEvent<HTMLInputElement>) => {
    const arquivo = e.currentTarget.files?.[0];
    let mensagem: string | undefined;
    if (arquivo && arquivo.size > CURRICULO_MAX_BYTES) {
      mensagem = "O arquivo passa de 4 MB. Envie uma versão menor.";
    } else if (arquivo && !curriculoAceito(arquivo)) {
      mensagem = "Envie o currículo em PDF ou DOCX.";
    }
    e.currentTarget.setCustomValidity(mensagem ?? "");
    setErroArquivo(mensagem);
  };

  return (
    <form ref={form} action={action} className="form-site" encType="multipart/form-data">
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
            aria-describedby={descrito("nome")}
          />
          <CampoErro id="cv-nome-erro" mensagem={erro("nome")} />
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
            aria-describedby={descrito("telefone")}
          />
          <CampoErro id="cv-telefone-erro" mensagem={erro("telefone")} />
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
            aria-describedby={descrito("email")}
          />
          <CampoErro id="cv-email-erro" mensagem={erro("email")} />
        </div>
        <div className="field-group">
          <label htmlFor="cv-area">Área de interesse</label>
          <select
            id="cv-area"
            name="area"
            className="field"
            required
            defaultValue="recepcao"
            aria-invalid={Boolean(erro("area"))}
            aria-describedby={descrito("area")}
          >
            {areas.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
          <CampoErro id="cv-area-erro" mensagem={erro("area")} />
        </div>
      </div>
      <div className="field-group mt-4">
        <label htmlFor="cv-experiencia">Experiência (opcional)</label>
        <textarea id="cv-experiencia" name="experiencia" className="field" rows={4} />
      </div>
      <div className="field-group mt-4">
        <label htmlFor="cv-arquivo">Currículo em PDF ou DOCX, até 4 MB (opcional)</label>
        <input
          id="cv-arquivo"
          name="curriculo"
          type="file"
          className="field field-arquivo"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={conferirArquivo}
          aria-invalid={Boolean(erro("curriculo"))}
          aria-describedby={descrito("curriculo")}
        />
        <CampoErro id="cv-curriculo-erro" mensagem={erro("curriculo")} />
      </div>
      {estado?.erro ? (
        <p className="field-error mt-4" role="alert" tabIndex={-1} data-erro-geral>
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
