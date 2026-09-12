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

/**
 * Pedido de proposta de evento (5.19). Mesma proteção dos demais formulários: validação com
 * Zod, honeypot e limite por IP, sem CAPTCHA visível. O evento de conversão lead_evento
 * dispara na página de obrigado.
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

const passouDoLimite = criarLimitador();

export async function enviarPedidoDeEvento(
  _estado: EstadoEvento,
  form: FormData,
): Promise<EstadoEvento> {
  // Honeypot preenchido: robô. Finge sucesso e não envia nada.
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=evento");

  const dados = EventoSchema.safeParse(Object.fromEntries(form));
  if (!dados.success) {
    return { erro: "Confira os campos destacados.", campos: errosPorCampo(dados.error.issues) };
  }

  if (passouDoLimite(await ipDaRequisicao())) {
    return { erro: "Muitos envios seguidos. Tente de novo em alguns minutos." };
  }

  const d = dados.data;
  try {
    await enviarEmail({
      assunto: `Proposta de evento: ${d.tipo}, ${d.nome}`,
      responderPara: d.email,
      linhas: [
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
      ],
    });
  } catch (e) {
    registrarFalha("evento", e);
    return { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
  }

  redirect("/obrigado?perfil=evento");
}
