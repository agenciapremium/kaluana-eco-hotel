import { NextResponse } from "next/server";
import { qrMap } from "@/lib/content";

/**
 * Atalho do QR Code (5.17 e Parte 6.1). O QR impresso na placa aponta para /q/101 e o
 * servidor responde 301 para a URL canônica do elemento, com ?uh= para a página reconhecer
 * o hóspede. Assim a placa nunca precisa ser reimpressa se o nome do quarto mudar, e o
 * acesso pode ser medido por quarto.
 *
 * Sem correspondência, 301 para o hub do Universo: um QR errado nunca cai em erro.
 */
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(qrMap).map((uh) => ({ uh }));
}

export async function GET(req: Request, ctx: { params: Promise<{ uh: string }> }) {
  const { uh } = await ctx.params;
  const entrada = qrMap[uh];
  const destino = entrada ? `${entrada.url}?uh=${entrada.uh}` : "/universo";
  // Resolve no host da requisição: em pré-visualização o QR continua dentro do mesmo deploy.
  return NextResponse.redirect(new URL(destino, req.url), 301);
}
