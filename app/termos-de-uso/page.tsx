import type { Metadata } from "next";
import { PaginaLegal } from "@/components/legais/PaginaLegal";
import { getPagina } from "@/lib/content";
import { descricaoDe } from "@/lib/seo";
import { termosDeUso } from "@/lib/legais";

const pagina = getPagina("termos-de-uso");
const descricao = descricaoDe("termos-de-uso", pagina.seo.description);

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
      blocos={termosDeUso}
      outra={{ url: "/politica-de-privacidade", nome: "Política de privacidade" }}
    />
  );
}
