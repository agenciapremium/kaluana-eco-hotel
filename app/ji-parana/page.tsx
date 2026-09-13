import type { Metadata } from "next";
import { foraDoIndiceNaPre } from "@/lib/seo";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { MapaJiParana } from "@/components/jiparana/MapaJiParana";
import { Perguntas } from "@/components/universo/Perguntas";
import { FramedImage } from "@/components/scene/FramedImage";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { semContagem } from "@/lib/contagem";
import { getPagina, getSecao } from "@/lib/content";
import { faqSchema, touristDestinationSchema } from "@/lib/schema";

const pagina = getPagina("ji-parana");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  ...foraDoIndiceNaPre,
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

/**
 * Ji-Paraná (5.20): guia do território e página de entidade para o GEO. O mapa estilizado
 * acompanha a leitura, acendendo o ponto de cada bloco.
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const comoChegar = getSecao(pagina, "Como chegar");
  const rio = getSecao(pagina, "O rio");
  const oQueFazer = getSecao(pagina, "O que fazer");
  const negocios = getSecao(pagina, "Negócios");
  const perguntas = getSecao(pagina, "Perguntas");

  return (
    <>
      <JsonLd
        data={[
          touristDestinationSchema({
            url: pagina.url,
            nome: pagina.seo.h1,
            descricao: pagina.seo.resposta.trim(),
          }),
          faqSchema(pagina.faq ?? []),
        ]}
      />

      <HeroScene
        image="atmosfera/estrada-terra"
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.64}
        actions={
          <TrackedLink
            href="/contato"
            event="mapa_click"
            params={{ origem: "ji_parana_hero" }}
            className="btn btn-inverse"
          >
            {hero.cta_secundario}
            <Arrow />
          </TrackedLink>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <div className="container-site guia">
          <div className="guia-mapa">
            <MapaJiParana />
          </div>
          <div className="guia-texto">
            <section id="onde-estamos" className="guia-bloco">
              <Reveal>
                <span className="kicker mb-4">{hero.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={hero.titulo ?? ""} />
                </h2>
                {hero.texto ? <CopyParagraphs text={hero.texto} className="mt-6 text-xl" /> : null}
              </Reveal>
            </section>

            <section id="como-chegar" className="guia-bloco">
              <Reveal>
                <span className="kicker mb-4">{comoChegar.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={comoChegar.titulo ?? ""} />
                </h2>
                {comoChegar.texto ? (
                  <CopyParagraphs text={comoChegar.texto} className="mt-6 text-xl" />
                ) : null}
              </Reveal>
            </section>

            <section id="o-rio" className="guia-bloco">
              <Reveal>
                <span className="kicker mb-4">{rio.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={rio.titulo ?? ""} />
                </h2>
                {rio.texto ? (
                  <CopyParagraphs text={semContagem(rio.texto)} className="mt-6 text-xl" />
                ) : null}
                <Link href="/universo/rios/rio-machado" className="btn btn-secondary mt-8">
                  {rio.cta_secundario}
                  <Arrow />
                </Link>
              </Reveal>
              <FramedImage
                id="universo/rios-rio-machado"
                ratio="4 / 3"
                sizes="(min-width: 64rem) 40vw, 100vw"
                className="mt-10"
              />
            </section>

            <section id="o-que-fazer" className="guia-bloco">
              <Reveal>
                <span className="kicker mb-4">{oQueFazer.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={oQueFazer.titulo ?? ""} />
                </h2>
                {oQueFazer.texto ? (
                  <CopyParagraphs text={oQueFazer.texto} className="mt-6 text-xl" />
                ) : null}
              </Reveal>
            </section>

            <section id="negocios" className="guia-bloco">
              <Reveal>
                <span className="kicker mb-4">{negocios.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={negocios.titulo ?? ""} />
                </h2>
                {negocios.texto ? (
                  <CopyParagraphs text={negocios.texto} className="mt-6 text-xl" />
                ) : null}
                <Link href="/acomodacoes" className="btn btn-secondary mt-8">
                  Ver as acomodações
                  <Arrow />
                </Link>
              </Reveal>
            </section>
          </div>
        </div>

        <Section id="perguntas" kicker={perguntas.kicker} title={perguntas.titulo} tone="branco">
          <div className="mt-8">
            <Perguntas faq={pagina.faq ?? []} />
          </div>
        </Section>
      </div>
    </>
  );
}
