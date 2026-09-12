"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { z } from "zod";

/**
 * Formulários de conversão da etapa 5: mensagem do Contato (5.24), pré-reserva (5.23) e
 * currículo (5.26). Os três seguem a mesma proteção dos anteriores: validação com Zod,
 * honeypot e limite por IP, sem CAPTCHA visível.
 *
 * O currículo vai anexado no e-mail e não é gravado em lugar nenhum: o site não guarda
 * arquivo de terceiro (ver docs/decisoes.md).
 */

const base = {
  nome: z.string().trim().min(2, "Escreva seu nome.").max(120),
  email: z.string().trim().email("Confira o e-mail.").max(200),
  telefone: z.string().trim().min(8, "Confira o telefone.").max(40),
};

const ContatoSchema = z.object({
  ...base,
  assunto: z.enum(["reserva", "evento", "restaurante", "imprensa", "outro"]),
  mensagem: z.string().trim().min(5, "Escreva sua mensagem.").max(3000),
});

const PreReservaSchema = z.object({
  ...base,
  entrada: z.string().trim().max(40).optional().default(""),
  saida: z.string().trim().max(40).optional().default(""),
  empresa: z.string().trim().max(120).optional().default(""),
});

const CurriculoSchema = z.object({
  ...base,
  area: z.enum([
    "recepcao",
    "governanca",
    "restaurante",
    "cozinha",
    "manutencao",
    "eventos",
    "outra",
  ]),
  experiencia: z.string().trim().max(2000).optional().default(""),
});

export type EstadoFormulario = { erro?: string; campos?: Record<string, string> };

/** Limite por IP em memória da instância, como nos demais formulários. */
const JANELA_MS = 10 * 60 * 1000;
const LIMITE = 5;
const envios = new Map<string, number[]>();

async function limitado() {
  const h = await headers();
  const ip =
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "desconhecido";
  const agora = Date.now();
  const lista = (envios.get(ip) ?? []).filter((t) => agora - t < JANELA_MS);
  lista.push(agora);
  envios.set(ip, lista);
  return lista.length > LIMITE;
}

function erros(issues: { path: PropertyKey[]; message: string }[]): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "");
    if (k && !campos[k]) campos[k] = i.message;
  }
  return campos;
}

type Anexo = { filename: string; content: Buffer };

async function enviar(assunto: string, linhas: (string | null)[], anexos?: Anexo[]) {
  const chave = process.env.RESEND_API_KEY;
  const para = process.env.LEAD_TO_EMAIL;
  if (!chave || !para) return;
  const resend = new Resend(chave);
  await resend.emails.send({
    from: process.env.LEAD_FROM_EMAIL ?? "site@kaluanaecohotel.com.br",
    to: para,
    subject: assunto,
    text: linhas.filter(Boolean).join("\n"),
    ...(anexos?.length
      ? { attachments: anexos.map((a) => ({ filename: a.filename, content: a.content })) }
      : {}),
  });
}

/** Mensagem do formulário de Contato (5.24). */
export async function enviarMensagem(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=contato");
  const r = ContatoSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { erro: "Confira os campos marcados.", campos: erros(r.error.issues) };
  if (await limitado()) {
    return { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };
  }
  const d = r.data;
  try {
    await enviar(`Contato pelo site: ${d.assunto}`, [
      `Nome: ${d.nome}`,
      `E-mail: ${d.email}`,
      `Telefone: ${d.telefone}`,
      `Assunto: ${d.assunto}`,
      `Mensagem: ${d.mensagem}`,
    ]);
  } catch {
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }
  redirect("/obrigado?perfil=contato");
}

/** Pré-reserva, enquanto o motor de reservas não existir (5.23). */
export async function enviarPreReserva(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=pre-reserva");
  const r = PreReservaSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { erro: "Confira os campos marcados.", campos: erros(r.error.issues) };
  if (await limitado()) {
    return { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };
  }
  const d = r.data;
  try {
    await enviar("Pré-reserva pelo site", [
      `Nome: ${d.nome}`,
      `E-mail: ${d.email}`,
      `Telefone: ${d.telefone}`,
      d.entrada ? `Entrada prevista: ${d.entrada}` : null,
      d.saida ? `Saída prevista: ${d.saida}` : null,
      d.empresa ? `Empresa: ${d.empresa}` : null,
    ]);
  } catch {
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }
  redirect("/obrigado?perfil=pre-reserva");
}

/** Tipos e tamanho aceitos no currículo. O arquivo não é gravado: segue anexo no e-mail. */
const TIPOS_CURRICULO = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const TAMANHO_MAXIMO = 5 * 1024 * 1024;

/** Currículo de Trabalhe conosco (5.26). */
export async function enviarCurriculo(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=curriculo");
  const r = CurriculoSchema.safeParse(Object.fromEntries(form));
  if (!r.success) return { erro: "Confira os campos marcados.", campos: erros(r.error.issues) };
  if (await limitado()) {
    return { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };
  }

  const arquivo = form.get("curriculo");
  let anexo: Anexo | undefined;
  if (arquivo instanceof File && arquivo.size > 0) {
    if (arquivo.size > TAMANHO_MAXIMO) {
      return { erro: "O arquivo passa de 5 MB.", campos: { curriculo: "Arquivo grande demais." } };
    }
    if (!TIPOS_CURRICULO.includes(arquivo.type)) {
      return {
        erro: "Envie o currículo em PDF ou DOCX.",
        campos: { curriculo: "Formato não aceito." },
      };
    }
    anexo = {
      filename: arquivo.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120),
      content: Buffer.from(await arquivo.arrayBuffer()),
    };
  }

  const d = r.data;
  try {
    await enviar(
      `Currículo: ${d.area}`,
      [
        `Nome: ${d.nome}`,
        `E-mail: ${d.email}`,
        `Telefone: ${d.telefone}`,
        `Área: ${d.area}`,
        d.experiencia ? `Experiência: ${d.experiencia}` : null,
        anexo ? `Currículo em anexo: ${anexo.filename}` : "Sem arquivo anexado.",
      ],
      anexo ? [anexo] : undefined,
    );
  } catch {
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }
  redirect("/obrigado?perfil=curriculo");
}
