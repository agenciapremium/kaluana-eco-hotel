import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legais/PaginaLegal";
import { getPagina } from "@/lib/content";
import { descricaoDe } from "@/lib/seo";
import { politicaDePrivacidade } from "@/lib/legais";

const pagina = getPagina("politica-de-privacidade");
const descricao = descricaoDe("politica-de-privacidade", pagina.seo.description);

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: descricao,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: descricao, url: pagina.url },
};

export default function Page() {
  return (
    <PaginaLegal
      pagina={pagina}
      blocos={politicaDePrivacidade}
      outra={{ url: "/termos-de-uso", nome: "Termos de uso" }}
    />
  );
}
