"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { Resend } from "resend";
import { z } from "zod";

/**
 * Pedido de proposta de evento (5.19). Mesma proteção do formulário de leads da etapa 1:
 * validação com Zod, honeypot e limite por IP, sem CAPTCHA visível. O evento de conversão
 * lead_evento dispara na página de obrigado.
 */
const EventoSchema = z.object({
  nome: z.string().trim().min(2, "Escreva seu nome.").max(120),
  empresa: z.string().trim().max(120).optional().default(""),
  email: z.string().trim().email("Confira o e-mail.").max(160),
  telefone: z.string().trim().min(8, "Confira o telefone.").max(40),
  tipo: z.string().trim().min(2, "Escolha o tipo de evento.").max(80),
  data: z.string().trim().max(40).optional().default(""),
  pessoas: z.string().trim().max(20).optional().default(""),
  hospedagem: z.enum(["sim", "nao"]).optional().default("nao"),
  alimentacao: z.enum(["sim", "nao"]).optional().default("nao"),
  mensagem: z.string().trim().max(2000).optional().default(""),
});

export type EstadoEvento = { erro?: string; campos?: Record<string, string> };

/** Limite por IP guardado em memória da instância, como em app/actions/lead.ts. */
const janelaMs = 10 * 60 * 1000;
const limite = 5;
const acessos = new Map<string, number[]>();

function passouDoLimite(ip: string) {
  const agora = Date.now();
  const anteriores = (acessos.get(ip) ?? []).filter((t) => agora - t < janelaMs);
  anteriores.push(agora);
  acessos.set(ip, anteriores);
  return anteriores.length > limite;
}

export async function enviarPedidoDeEvento(
  _estado: EstadoEvento,
  form: FormData,
): Promise<EstadoEvento> {
  if (String(form.get("website") ?? "")) return {};

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "desconhecido").split(",")[0].trim();
  if (passouDoLimite(ip)) {
    return { erro: "Muitos envios seguidos. Tente de novo em alguns minutos." };
  }

  const dados = EventoSchema.safeParse(Object.fromEntries(form));
  if (!dados.success) {
    const campos: Record<string, string> = {};
    for (const issue of dados.error.issues) {
      const campo = String(issue.path[0] ?? "");
      if (campo && !campos[campo]) campos[campo] = issue.message;
    }
    return { erro: "Confira os campos destacados.", campos };
  }

  const d = dados.data;
  const chave = process.env.RESEND_API_KEY;
  const para = process.env.LEAD_TO_EMAIL;
  if (chave && para) {
    const resend = new Resend(chave);
    const linhas = [
      `Nome: ${d.nome}`,
      d.empresa ? `Empresa: ${d.empresa}` : null,
      `E-mail: ${d.email}`,
      `Telefone: ${d.telefone}`,
      `Tipo de evento: ${d.tipo}`,
      d.data ? `Data pretendida: ${d.data}` : null,
      d.pessoas ? `Pessoas: ${d.pessoas}` : null,
      `Hospedagem: ${d.hospedagem === "sim" ? "sim" : "não"}`,
      `Alimentação: ${d.alimentacao === "sim" ? "sim" : "não"}`,
      d.mensagem ? `Mensagem: ${d.mensagem}` : null,
    ].filter(Boolean);
    await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL ?? "site@kaluanaecohotel.com.br",
      to: para,
      subject: `Proposta de evento: ${d.tipo}`,
      text: linhas.join("\n"),
    });
  }

  redirect("/obrigado?perfil=evento");
}
