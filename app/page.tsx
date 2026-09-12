import type { Metadata } from "next";
import { HomeFull } from "@/components/home/HomeFull";
import { HomePre } from "@/components/home/HomePre";
import { getPagina } from "@/lib/content";
import { phase } from "@/lib/site";

const pagina = getPagina(phase === "pre" ? "pre-inauguracao" : "home");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: "/" },
  openGraph: {
    title: pagina.seo.title,
    description: pagina.seo.description,
    url: "/",
  },
};

export default function Page() {
  return phase === "pre" ? <HomePre pagina={pagina} /> : <HomeFull pagina={pagina} />;
}
