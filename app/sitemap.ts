import type { MetadataRoute } from "next";
import { categorias } from "@/lib/acomodacoes";
import { universoIndex } from "@/lib/content";
import { phase, siteUrl } from "@/lib/site";
import { floorOrder } from "@/lib/tokens";

/**
 * Fase `pre`: Home e o Universo completo, que é o conteúdo da fase 0 (Parte 3.5).
 * Fase `full`: acrescenta o hub de Acomodações e as sete categorias.
 * O atalho /q/ fica fora do sitemap e bloqueado no robots.txt.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const agora = new Date();
  const universo: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/universo`, lastModified: agora, changeFrequency: "monthly", priority: 0.9 },
    ...floorOrder.map((g) => ({
      url: `${siteUrl}/universo/${g}`,
      lastModified: agora,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...universoIndex.map((i) => ({
      url: `${siteUrl}${i.url}`,
      lastModified: agora,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
  ];
  const home: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: agora, changeFrequency: "weekly", priority: 1 },
  ];
  if (phase === "pre") return [...home, ...universo];
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
    ...universo,
  ];
}
