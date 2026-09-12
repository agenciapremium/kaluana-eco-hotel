"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

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

const LIMITE = 5;
const JANELA_MS = 10 * 60 * 1000;
const envios = new Map<string, number[]>();

function limitado(ip: string) {
  const agora = Date.now();
  const lista = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  if (lista.length >= LIMITE) return true;
  lista.push(agora);
  envios.set(ip, lista);
  return false;
}

const rotulos: Record<string, string> = {
  hospede: "Hóspede",
  empresa: "Empresa",
  imprensa: "Imprensa",
  fornecedor: "Fornecedor",
};

async function enviarEmail(d: z.infer<typeof LeadSchema>) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL;
  const from = process.env.LEAD_FROM_EMAIL || "site@kaluanaecohotel.com.br";
  if (!key || !to) return; // sem configuração, o envio é simulado (desenvolvimento)
  const resend = new Resend(key);
  const linhas = [
    `Nome: ${d.nome}`,
    `E-mail: ${d.email}`,
    `Telefone: ${d.telefone}`,
    `Perfil: ${rotulos[d.sou]}`,
    d.empresa ? `Empresa: ${d.empresa}` : null,
    `Origem: ${d.origem === "pre" ? "Página de pré-inauguração" : "Bloco Empresas"}`,
  ].filter(Boolean);
  await resend.emails.send({
    from,
    to,
    replyTo: d.email,
    subject: `Novo contato pelo site: ${d.nome} (${rotulos[d.sou]})`,
    text: linhas.join("\n"),
  });
}

/** Formulário "Avisamos você primeiro". Evento de conversão: lead_pre_inauguracao (disparado em /obrigado). */
export async function enviarLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  const dados = Object.fromEntries(formData.entries());

  // Honeypot preenchido: robô. Finge sucesso e não envia nada.
  if (typeof dados.website === "string" && dados.website.length > 0) {
    redirect("/obrigado");
  }

  const parsed = LeadSchema.safeParse(dados);
  if (!parsed.success) {
    const campos: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "");
      if (k && !campos[k]) campos[k] = issue.message;
    }
    return { erro: "Confira os campos marcados.", campos };
  }

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "desconhecido";
  if (limitado(ip)) {
    return { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };
  }

  try {
    await enviarEmail(parsed.data);
  } catch {
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }

  redirect(`/obrigado?perfil=${parsed.data.sou}`);
}
