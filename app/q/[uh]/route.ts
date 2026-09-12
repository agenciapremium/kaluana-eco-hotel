import { qrMap } from "@/lib/content";

/**
 * Atalho do QR Code (5.17 e Parte 6.1). O QR impresso na placa aponta para /q/101 e o
 * servidor responde 301 para a URL canônica do elemento, com ?uh= para a página reconhecer
 * o hóspede. Assim a placa nunca precisa ser reimpressa se o nome do quarto mudar, e o
 * acesso pode ser medido por quarto.
 *
 * O cabeçalho Location é relativo, e não absoluto: a rota é pré-renderizada no build, então
 * um endereço absoluto congelaria o host do build (em pré-visualização o QR sairia do
 * próprio deploy). Com Location relativo o navegador resolve no host da requisição.
 *
 * Sem correspondência, 301 para o hub do Universo: um QR errado nunca cai em erro.
 */
export const dynamic = "force-static";
export const dynamicParams = true;

export function generateStaticParams() {
  return Object.keys(qrMap).map((uh) => ({ uh }));
}

export async function GET(_req: Request, ctx: { params: Promise<{ uh: string }> }) {
  const { uh } = await ctx.params;
  const entrada = qrMap[uh];
  const destino = entrada ? `${entrada.url}?uh=${entrada.uh}` : "/universo";
  return new Response(null, {
    status: 301,
    headers: { Location: destino, "Cache-Control": "public, max-age=0, must-revalidate" },
  });
}
