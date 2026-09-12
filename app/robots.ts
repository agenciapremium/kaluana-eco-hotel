import type { MetadataRoute } from "next";
import { eventosAutorizado, siteUrl } from "@/lib/site";

/**
 * robots.txt (Parte 4.2, item 4, e Parte 4.6).
 *
 * A recomendação do documento mestre é liberar busca e robôs de resposta para todo o site,
 * porque o objetivo do Universo Kaluanã é justamente ser citado. Bloqueamos só o atalho do
 * QR, a página de formulário enviado e a de Eventos enquanto não houver autorização.
 *
 * Se o cliente preferir barrar o uso do conteúdo para treinamento, basta ligar
 * NEXT_PUBLIC_BLOQUEAR_TREINO_IA=true: a busca e as respostas continuam liberadas e só os
 * agentes de treinamento (GPTBot, CCBot) passam a ser bloqueados. A decisão fica registrada
 * em docs/decisoes.md.
 */
const bloquearTreino = process.env.NEXT_PUBLIC_BLOQUEAR_TREINO_IA === "true";

const agentesDeTreino = ["GPTBot", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  const proibido = ["/q/", "/obrigado", ...(eventosAutorizado ? [] : ["/eventos"])];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: proibido },
      ...(bloquearTreino ? [{ userAgent: agentesDeTreino, disallow: "/" }] : []),
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
