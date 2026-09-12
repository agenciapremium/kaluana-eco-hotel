import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/** Etapa 1: só a Home. As etapas seguintes acrescentam as demais URLs indexáveis. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: `${siteUrl}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1 }];
}
