import type { Metadata } from "next";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { LinhaDoTempo } from "@/components/institucional/LinhaDoTempo";
import { TrilhoLeitura } from "@/components/institucional/TrilhoLeitura";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { OutlineText } from "@/components/motion/OutlineText";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { FramedImage } from "@/components/scene/FramedImage";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getPagina, getSecao } from "@/lib/content";
import { posts } from "@/lib/posts";
import { aboutPageSchema, organizationSchema } from "@/lib/schema";
import { reservasUrl } from "@/lib/site";

const pagina = getPagina("o-kaluana");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

const img = {
  hero: "obra/terra-e-enxada",
  lugar: "obra/perfil-do-solo",
  equipe: "obra/prumo",
  obra: "obra/linha-e-estacas",
} as const;

/**
 * O Kaluanã (5.2). Leitura longa, com o traço de progresso na lateral.
 *
 * A seção "Como construímos" fica de fora: a nota do documento mestre é explícita, "sem
 * fatos, não publicar a seção", e as práticas reais ainda não chegaram do cliente. O
 * componente e o lugar dela estão prontos (ver docs/etapas.md).
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const nome = getSecao(pagina, "O nome");
  const lugar = getSecao(pagina, "O lugar");
  const andares = getSecao(pagina, "Os andares");
  const tempo = getSecao(pagina, "Linha do tempo");
  const quemFaz = getSecao(pagina, "Quem faz");
  const final = getSecao(pagina, "Chamada final");

  return (
    <>
      <JsonLd
        data={[
          aboutPageSchema({
            url: pagina.url,
            nome: pagina.seo.h1,
            descricao: pagina.seo.resposta.trim(),
          }),
          organizationSchema(),
        ]}
      />
      <TrilhoLeitura />

      <HeroScene
        image={img.hero}
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.62}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Scene
          id="o-nome"
          image="atmosfera/nevoa-mata"
          veil="preto"
          veilOpacity={0.74}
          align="center"
        >
          <OutlineText text="Kaluanã" />
          <StrokeSymbol
            className="text-bege h-24 w-24 lg:h-32 lg:w-32"
            title="Símbolo do Kaluanã"
          />
          <Reveal className="mt-10 max-w-3xl">
            <span className="kicker mb-4">{nome.kicker}</span>
            <h2 className="text-title">
              <CopyText text={nome.titulo ?? ""} />
            </h2>
            {nome.texto ? (
              <CopyParagraphs text={nome.texto} className="lead text-bege/90 mt-6" />
            ) : null}
          </Reveal>
        </Scene>

        <Section id="o-lugar" kicker={lugar.kicker} title={lugar.titulo}>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {lugar.texto ? <CopyParagraphs text={lugar.texto} className="text-xl" /> : null}
              <Link href="/ji-parana" className="btn btn-secondary mt-8">
                {lugar.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
            <FramedImage id={img.lugar} ratio="4 / 3" sizes="(min-width: 64rem) 50vw, 100vw" />
          </div>
        </Section>

        <Section id="os-andares" kicker={andares.kicker} title={andares.titulo} tone="branco">
          <Reveal className="measure mt-6">
            {andares.texto ? <CopyParagraphs text={andares.texto} className="text-xl" /> : null}
            <Link href="/universo" className="btn btn-primary mt-8">
              {andares.cta_primario}
              <Arrow />
            </Link>
          </Reveal>
        </Section>

        <Section id="a-obra" kicker={tempo.kicker} title={tempo.titulo}>
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {tempo.texto ? <CopyParagraphs text={tempo.texto} className="text-xl" /> : null}
              <FramedImage
                id={img.obra}
                ratio="4 / 3"
                sizes="(min-width: 64rem) 46vw, 100vw"
                className="mt-8"
              />
            </Reveal>
            <LinhaDoTempo posts={posts} />
          </div>
        </Section>

        <Section id="quem-faz" kicker={quemFaz.kicker} title={quemFaz.titulo} tone="branco">
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {quemFaz.texto ? <CopyParagraphs text={quemFaz.texto} className="text-xl" /> : null}
            </Reveal>
            <FramedImage id={img.equipe} ratio="4 / 3" sizes="(min-width: 64rem) 50vw, 100vw" />
          </div>
        </Section>

        <Scene
          id="chamada-final"
          image="detalhes/textura-terra"
          veil="cafe"
          veilOpacity={0.68}
          align="center"
        >
          <Reveal className="scene-card">
            <h2 className="text-title">
              <CopyText text={final.titulo ?? ""} />
            </h2>
            {final.texto ? (
              <CopyParagraphs text={final.texto} className="text-bege/90 mt-4 text-xl" />
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <TrackedLink
                href={reservasUrl}
                event="reservar_click"
                params={{ origem: "o_kaluana" }}
                className="btn btn-inverse"
              >
                {final.cta_primario}
                <Arrow />
              </TrackedLink>
              <Link href="/contato" className="btn btn-ghost-light">
                {final.cta_secundario}
              </Link>
            </div>
          </Reveal>
        </Scene>
      </div>
    </>
  );
}
