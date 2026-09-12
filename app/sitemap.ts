import type { MetadataRoute } from "next";
import { categorias } from "@/lib/acomodacoes";
import { universoIndex } from "@/lib/content";
import { posts } from "@/lib/posts";
import { eventosAutorizado, phase, siteUrl } from "@/lib/site";
import { floorOrder } from "@/lib/tokens";

/**
 * Fase `pre`: Home e o Universo completo, que é o conteúdo da fase 0 (Parte 3.5).
 * Fase `full`: acrescenta Acomodações, O Kaluanã, Restaurante, Ji-Paraná e Histórias.
 * Eventos só entra com a autorização do cliente; o atalho /q/ fica sempre fora e bloqueado
 * no robots.txt.
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

  const institucional: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/o-kaluana`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    {
      url: `${siteUrl}/restaurante`,
      lastModified: agora,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    { url: `${siteUrl}/ji-parana`, lastModified: agora, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/historias`, lastModified: agora, changeFrequency: "weekly", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${siteUrl}/historias/${p.slug}`,
      lastModified: new Date(`${p.atualizado ?? p.data}T12:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...(eventosAutorizado
      ? [
          {
            url: `${siteUrl}/eventos`,
            lastModified: agora,
            changeFrequency: "monthly" as const,
            priority: 0.8,
          },
        ]
      : []),
  ];
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
    ...institucional,
    ...universo,
  ];
}
