import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Frame } from "@/components/motion/Frame";
import { OutlineText } from "@/components/motion/OutlineText";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { FramedImage } from "@/components/scene/FramedImage";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getSecao } from "@/lib/content";
import type { Pagina } from "@/lib/content-schema";
import { splitLead, splitParagraphs } from "@/lib/copy";
import { breadcrumbSchema, hotelSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { eventosAutorizado, reservasUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";
import { FloorPanels } from "./FloorPanels";
import { Section } from "./Section";
import { StylizedMap } from "./StylizedMap";

/** Imagens do Higgsfield (ver docs/registro-higgsfield.md). Detalhes e atmosferas, nunca ambientes do hotel. */
const img = {
  hero: "atmosfera/rio-amanhecer",
  nome: "atmosfera/nevoa-mata",
  jiparana: "atmosfera/estrada-terra",
  cansado: "detalhes/maos-no-balcao",
  produzir: "detalhes/mesa-com-cafe",
  parar: "detalhes/cadeira-na-varanda",
  restaurante: "detalhes/prato-de-peixe",
  historias: "detalhes/maos-na-obra",
  final: "detalhes/textura-terra",
} as const;

/**
 * Home completa (5.1) em cenas: hero em foto, três jeitos de chegar em cards emoldurados,
 * o nome em cena escura, os quatro andares em painéis empilhados, restaurante, eventos
 * (só com autorização), Ji-Paraná com o mapa, histórias e a chamada final.
 */
export function HomeFull({ pagina }: { pagina: Pagina }) {
  const hero = getSecao(pagina, "Hero");
  const jeitos = getSecao(pagina, "Três jeitos de chegar");
  const nome = getSecao(pagina, "O nome");
  const andares = getSecao(pagina, "Os andares");
  const restaurante = getSecao(pagina, "Restaurante");
  const eventos = getSecao(pagina, "Eventos");
  const jiparana = getSecao(pagina, "Ji-Paraná");
  const historias = getSecao(pagina, "Histórias");
  const final = getSecao(pagina, "Chamada final");
  // A resposta direta do mestre cita auditório e centro de convenções, que só entram com a
  // autorização do cliente (veto 3).
  const resposta = eventosAutorizado
    ? pagina.seo.resposta.trim()
    : pagina.seo.resposta.trim().replace(", auditório e centro de convenções,", "");

  const [jeitosIntro, ...perfis] = splitParagraphs(jeitos.texto ?? "");
  const cards = perfis.map((p, i) => {
    const [titulo, texto] = splitLead(p);
    return { titulo, texto, image: [img.cansado, img.produzir, img.parar][i] };
  });

  return (
    <>
      <JsonLd
        data={[
          hotelSchema({ description: resposta, restaurante: true }),
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([{ name: "Início", url: "/" }]),
        ]}
      />

      <HeroScene
        image={img.hero}
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={resposta}
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        actions={
          <>
            <TrackedLink
              href={reservasUrl}
              event="reservar_click"
              params={{ origem: "hero" }}
              className="btn btn-inverse"
            >
              {hero.cta_primario}
              <Arrow />
            </TrackedLink>
            <Link href="/o-kaluana" className="btn btn-ghost-light">
              {hero.cta_secundario}
            </Link>
          </>
        }
      />

      <div id="conteudo-principal">
        <Section id="para-quem" kicker={jeitos.kicker} title={jeitos.titulo} align="center">
          <Reveal className="measure mx-auto mt-6 text-center">
            <p className="text-xl">
              <CopyText text={jeitosIntro ?? ""} />
            </p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {cards.map((c, i) => (
              <FramedImage
                key={c.titulo}
                id={c.image}
                ratio="3 / 4"
                sizes="(min-width: 48rem) 33vw, 100vw"
                delay={i * motionTokens.stagger.item}
              >
                <h3 className="font-display">
                  <CopyText text={c.titulo} />
                </h3>
                <p className="text-bege/90 mt-2 text-base">
                  <CopyText text={c.texto} />
                </p>
              </FramedImage>
            ))}
          </div>
          <Reveal className="mt-12 text-center">
            <Link href="/acomodacoes" className="btn btn-primary">
              {jeitos.cta_primario}
              <Arrow />
            </Link>
          </Reveal>
        </Section>

        <Scene
          id="o-nome"
          image={img.nome}
          veil="preto"
          veilOpacity={0.72}
          height="full"
          align="center"
        >
          <OutlineText text="Kaluanã" />
          <StrokeSymbol
            className="text-bege h-28 w-28 lg:h-40 lg:w-40"
            title="Símbolo do Kaluanã"
          />
          <Reveal className="mt-10 max-w-3xl">
            {nome.kicker ? <span className="kicker mb-4">{nome.kicker}</span> : null}
            <h2 className="text-title">
              <CopyText text={nome.titulo ?? ""} />
            </h2>
            {nome.texto ? (
              <CopyParagraphs text={nome.texto} className="lead text-bege/90 mt-6" />
            ) : null}
            <Link href="/o-kaluana" className="btn btn-secondary mt-8">
              {nome.cta_secundario}
              <Arrow />
            </Link>
          </Reveal>
        </Scene>

        <Section
          id="os-andares"
          kicker={andares.kicker}
          title={andares.titulo}
          align="center"
          tone="branco"
        >
          <Reveal className="measure mx-auto mt-6 text-center">
            {andares.texto ? <CopyParagraphs text={andares.texto} className="text-xl" /> : null}
          </Reveal>
        </Section>
        <FloorPanels />
        <div className="bg-branco">
          <div className="container-site py-10 text-center">
            <Reveal>
              <Link href="/universo" className="btn btn-primary">
                {andares.cta_primario}
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>

        <Section id="restaurante" kicker={restaurante.kicker} title={restaurante.titulo}>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <FramedImage
              id={img.restaurante}
              ratio="4 / 3"
              sizes="(min-width: 64rem) 50vw, 100vw"
            />
            <Reveal className="measure">
              {restaurante.texto ? (
                <CopyParagraphs text={restaurante.texto} className="text-xl" />
              ) : null}
              <Link href="/restaurante" className="btn btn-secondary mt-8">
                {restaurante.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </Section>

        {eventosAutorizado ? (
          <Section id="eventos" kicker={eventos.kicker} title={eventos.titulo} tone="branco">
            <Reveal className="measure mt-6">
              {eventos.texto ? <CopyParagraphs text={eventos.texto} className="text-xl" /> : null}
              <Link href="/eventos" className="btn btn-secondary mt-8">
                {eventos.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
          </Section>
        ) : null}

        <Scene
          id="ji-parana"
          image={img.jiparana}
          veil="cafe"
          veilOpacity={0.7}
          height="auto"
          align="left"
        >
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="measure">
              {jiparana.kicker ? <span className="kicker mb-4">{jiparana.kicker}</span> : null}
              <h2 className="text-title">
                <CopyText text={jiparana.titulo ?? ""} />
              </h2>
              {jiparana.texto ? (
                <CopyParagraphs text={jiparana.texto} className="text-bege/90 mt-6 text-xl" />
              ) : null}
              <TrackedLink
                href="/ji-parana"
                event="mapa_click"
                params={{ origem: "home" }}
                className="btn btn-secondary mt-8"
              >
                {jiparana.cta_secundario}
                <Arrow />
              </TrackedLink>
            </Reveal>
            <StylizedMap className="w-full" />
          </div>
        </Scene>

        <Section id="historias" kicker={historias.kicker} title={historias.titulo} tone="branco">
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <FramedImage id={img.historias} ratio="4 / 3" sizes="(min-width: 64rem) 50vw, 100vw" />
            <Reveal className="measure">
              {historias.texto ? (
                <CopyParagraphs text={historias.texto} className="text-xl" />
              ) : null}
              {/* Os três últimos posts entram na etapa 4, quando Histórias existir. */}
              <Link href="/historias" className="btn btn-secondary mt-8">
                {historias.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </Section>

        <Scene
          id="chamada-final"
          image={img.final}
          veil="cafe"
          veilOpacity={0.6}
          height="full"
          align="center"
          parallax
        >
          <OutlineText text="Chegue" />
          <Reveal className="scene-card">
            <Frame />
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
                params={{ origem: "chamada_final" }}
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
