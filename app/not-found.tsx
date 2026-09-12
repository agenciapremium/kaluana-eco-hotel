import { SiteLink as Link } from "@/components/ui/SiteLink";
import { Simbolo } from "@/components/brand/Simbolo";
import { CopyText } from "@/components/Copy";
import { Arrow } from "@/components/ui/Arrow";
import { getPagina, getSecao } from "@/lib/content";

/**
 * Versão mínima da página 404 (5.29), com a copy do documento mestre.
 * A versão final, com o símbolo em traço em loop lento, entra na etapa 5.
 */
export default function NotFound() {
  const pagina = getPagina("pagina-404");
  const conteudo = getSecao(pagina, "Conteúdo");
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <Simbolo className="text-salvia mx-auto h-16 w-16" />
          <h1 className="text-title mt-8">
            <CopyText text={conteudo.titulo ?? pagina.seo.h1} />
          </h1>
          <p className="mt-4 text-xl">
            <CopyText text={conteudo.texto ?? ""} />
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/" className="btn btn-primary">
              {conteudo.cta_primario}
              <Arrow />
            </Link>
            <Link href="/universo" className="btn btn-secondary">
              {conteudo.cta_secundario}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
