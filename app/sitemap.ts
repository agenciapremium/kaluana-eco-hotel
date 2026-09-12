import type { MetadataRoute } from "next";
import { categorias } from "@/lib/acomodacoes";
import { phase, siteUrl } from "@/lib/site";

/**
 * Fase `pre`: só a Home (Parte 3.5). Fase `full`: Home, hub de Acomodações e as sete
 * categorias. As próximas etapas acrescentam o resto.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  const home: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
  ];
  if (phase === "pre") return home;
  return [
    ...home,
    {
      url: `${siteUrl}/acomodacoes`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...categorias.map((c) => ({
      url: `${siteUrl}${c.url}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
