"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  criarLimitador,
  enviarEmail,
  errosPorCampo,
  ipDaRequisicao,
  registrarFalha,
} from "@/lib/formularios";

const LeadSchema = z.object({
  nome: z.string().trim().min(2, "Escreva seu nome.").max(120, "Nome muito longo."),
  email: z.string().trim().email("Confira o e-mail.").max(200),
  telefone: z
    .string()
    .trim()
    .min(8, "Confira o telefone.")
    .max(30, "Confira o telefone.")
    .regex(/^[\d\s()+.-]+$/, "Confira o telefone."),
  sou: z.enum(["hospede", "empresa", "imprensa", "fornecedor"]),
  empresa: z.string().trim().max(120).optional(),
  origem: z.enum(["pre", "empresas"]).default("pre"),
});

export type LeadState = { erro: string; campos?: Record<string, string> } | null;

const passouDoLimite = criarLimitador();

const rotulos: Record<string, string> = {
  hospede: "Hóspede",
  empresa: "Empresa",
  imprensa: "Imprensa",
  fornecedor: "Fornecedor",
};

/** Formulário "Avisamos você primeiro". Evento de conversão: lead_pre_inauguracao (disparado em /obrigado). */
export async function enviarLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const dados = Object.fromEntries(formData.entries());

  // Honeypot preenchido: robô. Finge sucesso e não envia nada.
  if (typeof dados.website === "string" && dados.website.length > 0) {
    redirect("/obrigado");
  }

  const parsed = LeadSchema.safeParse(dados);
  if (!parsed.success) {
    return { erro: "Confira os campos marcados.", campos: errosPorCampo(parsed.error.issues) };
  }

  if (passouDoLimite(await ipDaRequisicao())) {
    return { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };
  }

  const d = parsed.data;
  try {
    await enviarEmail({
      assunto: `Novo contato pelo site: ${d.nome} (${rotulos[d.sou]})`,
      responderPara: d.email,
      linhas: [
        `Nome: ${d.nome}`,
        `E-mail: ${d.email}`,
        `Telefone: ${d.telefone}`,
        `Perfil: ${rotulos[d.sou]}`,
        d.empresa ? `Empresa: ${d.empresa}` : null,
        `Origem: ${d.origem === "pre" ? "Página de pré-inauguração" : "Bloco Empresas"}`,
      ],
    });
  } catch (e) {
    registrarFalha("lead", e);
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }

  redirect(`/obrigado?perfil=${d.sou}`);
}
