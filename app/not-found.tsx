import { BuscaNomes } from "@/components/universo/BuscaNomes";
import { CopyText } from "@/components/Copy";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { mostraNumeroDeQuarto } from "@/lib/contagem";
import { getPagina, getSecao, universoIndex } from "@/lib/content";
import { floors } from "@/lib/tokens";

/**
 * Página 404 (5.29). O Next devolve status 404 de verdade aqui, sem redirecionamento
 * (Parte 4.2, item 9).
 *
 * Além dos atalhos, traz a busca sobre os setenta nomes do Universo: quem chega numa URL
 * errada quase sempre está atrás de um quarto, e o nome pode ter mudado de endereço.
 */
export default function NotFound() {
  const pagina = getPagina("pagina-404");
  const conteudo = getSecao(pagina, "Conteúdo");
  const itensBusca = universoIndex.map((i) => ({
    nome: i.nome,
    uh: i.uh,
    url: i.url,
    andar: floors[i.grupo].nome,
  }));

  return (
    <section className="section-y pagina-404">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <StrokeSymbol className="text-salvia mx-auto h-20 w-20" title="Símbolo do Kaluanã" />
          <p className="kicker mt-8 justify-center">Erro 404</p>
          <h1 className="text-title mt-4">
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

        <Reveal className="mx-auto mt-16 max-w-xl">
          <p className="text-center text-lg">Procurando o nome de um quarto?</p>
          <div className="mt-4">
            <BuscaNomes itens={itensBusca} mostraNumero={mostraNumeroDeQuarto} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
