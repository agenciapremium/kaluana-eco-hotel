import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Libera busca e robôs de resposta; bloqueia o atalho do QR e a página de formulário enviado.
 * A política para robôs de treinamento (GPTBot, CCBot) depende de decisão do cliente (Parte 4.6).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/q/", "/obrigado"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
