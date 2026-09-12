import { SiteLink as Link } from "@/components/ui/SiteLink";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { WordTitle } from "@/components/motion/WordTitle";
import { Arrow } from "@/components/ui/Arrow";
import { MediaImage } from "@/components/ui/MediaImage";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { getSecao } from "@/lib/content";
import type { Pagina } from "@/lib/content-schema";
import { splitLead, splitParagraphs } from "@/lib/copy";
import { hasImage } from "@/lib/media";
import { breadcrumbSchema, hotelSchema, organizationSchema, websiteSchema } from "@/lib/schema";
import { eventosAutorizado, reservasUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";
import { FloorBands } from "./FloorBands";
import { HeroVideo } from "./HeroVideo";
import { Section } from "./Section";
import { StylizedMap } from "./StylizedMap";

/** Imagens de detalhe geradas no Higgsfield (ver docs/registro-higgsfield.md). Sem ambientes do hotel. */
const detalhes = {
  cansado: "detalhes/maos-no-balcao",
  produzir: "detalhes/mesa-com-cafe",
  parar: "detalhes/cadeira-na-varanda",
  restaurante: "detalhes/prato-de-peixe",
  historias: "detalhes/maos-na-obra",
  final: "detalhes/textura-terra",
} as const;

function Detalhe({ id, sizes, className }: { id: string; sizes: string; className?: string }) {
  if (!hasImage(id)) {
    return (
      <div
        className={["detalhe-placeholder", className].filter(Boolean).join(" ")}
        aria-hidden="true"
      />
    );
  }
  return (
    <MediaImage
      id={id}
      sizes={sizes}
      className={className}
      imgClassName="h-full w-full object-cover"
    />
  );
}

/**
 * Home completa (5.1): hero, três jeitos de chegar, o nome, as quatro faixas de andar,
 * restaurante, eventos (só com autorização), Ji-Paraná, histórias e chamada final.
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

  const [jeitosIntro, ...perfis] = splitParagraphs(jeitos.texto ?? "");
  const cards = perfis.map((p, i) => {
    const [titulo, texto] = splitLead(p);
    return { titulo, texto, image: [detalhes.cansado, detalhes.produzir, detalhes.parar][i] };
  });

  return (
    <>
      <JsonLd
        data={[
          hotelSchema({ description: pagina.seo.resposta.trim(), restaurante: true }),
          organizationSchema(),
          websiteSchema(),
          breadcrumbSchema([{ name: "Início", url: "/" }]),
        ]}
      />

      <section className="hero" data-hero>
        <HeroVideo />
        <div className="container-site hero-inner">
          <div className="max-w-3xl">
            {hero.kicker ? <span className="kicker mb-6">{hero.kicker}</span> : null}
            <WordTitle
              text={pagina.seo.h1}
              className="text-display"
              delay={motionTokens.duration.short}
            />
            <p className="lead mt-6">{pagina.seo.resposta.trim()}</p>
            {hero.texto ? <CopyParagraphs text={hero.texto} className="mt-4 text-xl" /> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <TrackedLink
                href={reservasUrl}
                event="reservar_click"
                params={{ origem: "hero" }}
                className="btn btn-primary"
              >
                {hero.cta_primario}
                <Arrow />
              </TrackedLink>
              <Link href="/o-kaluana" className="btn btn-secondary">
                {hero.cta_secundario}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section id="para-quem" kicker={jeitos.kicker} title={jeitos.titulo} tone="branco">
        <Reveal className="measure mt-6">
          <p className="text-xl">
            <CopyText text={jeitosIntro ?? ""} />
          </p>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {cards.map((c, i) => (
            <Reveal
              key={c.titulo}
              as="article"
              delay={i * motionTokens.stagger.item}
              className="card-zoom bg-bege rounded-2xl"
            >
              <div className="aspect-[4/3] overflow-hidden rounded-t-2xl">
                <Detalhe
                  id={c.image}
                  sizes="(min-width: 48rem) 33vw, 100vw"
                  className="h-full w-full"
                />
              </div>
              <div className="p-6">
                <h3 className="font-display text-3xl">
                  <CopyText text={c.titulo} />
                </h3>
                <p className="mt-3 text-lg">
                  <CopyText text={c.texto} />
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <Link href="/acomodacoes" className="btn btn-primary">
            {jeitos.cta_primario}
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      <Section id="o-nome" kicker={nome.kicker} title={nome.titulo}>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal className="measure">
            {nome.texto ? <CopyParagraphs text={nome.texto} className="text-xl" /> : null}
            <Link href="/o-kaluana" className="btn btn-secondary mt-8">
              {nome.cta_secundario}
              <Arrow />
            </Link>
          </Reveal>
          <StrokeSymbol
            className="text-cafe h-40 w-40 justify-self-center lg:h-64 lg:w-64"
            title="Símbolo do Kaluanã"
          />
        </div>
      </Section>

      <Section id="os-andares" kicker={andares.kicker} title={andares.titulo} tone="branco">
        <Reveal className="measure mt-6">
          {andares.texto ? <CopyParagraphs text={andares.texto} className="text-xl" /> : null}
        </Reveal>
        <div className="mt-10">
          <FloorBands />
        </div>
        <Reveal className="mt-8">
          <Link href="/universo" className="btn btn-primary">
            {andares.cta_primario}
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      <Section id="restaurante" kicker={restaurante.kicker} title={restaurante.titulo}>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="measure">
            {restaurante.texto ? (
              <CopyParagraphs text={restaurante.texto} className="text-xl" />
            ) : null}
            <Link href="/restaurante" className="btn btn-secondary mt-8">
              {restaurante.cta_secundario}
              <Arrow />
            </Link>
          </Reveal>
          <Reveal variant="mask" className="card-zoom aspect-[4/3] overflow-hidden rounded-2xl">
            <Detalhe
              id={detalhes.restaurante}
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="h-full w-full"
            />
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

      <Section id="ji-parana" kicker={jiparana.kicker} title={jiparana.titulo} tone="branco">
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <Reveal className="measure">
            {jiparana.texto ? <CopyParagraphs text={jiparana.texto} className="text-xl" /> : null}
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
      </Section>

      <Section id="historias" kicker={historias.kicker} title={historias.titulo}>
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2">
          <Reveal
            variant="mask"
            className="card-zoom aspect-[4/3] overflow-hidden rounded-2xl lg:order-first"
          >
            <Detalhe
              id={detalhes.historias}
              sizes="(min-width: 64rem) 50vw, 100vw"
              className="h-full w-full"
            />
          </Reveal>
          <Reveal className="measure">
            {historias.texto ? <CopyParagraphs text={historias.texto} className="text-xl" /> : null}
            {/* Os três últimos posts entram na etapa 4, quando Histórias existir. */}
            <Link href="/historias" className="btn btn-secondary mt-8">
              {historias.cta_secundario}
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </Section>

      <section id="chamada-final" className="bg-cafe text-bege relative overflow-hidden">
        <div className="absolute inset-0 opacity-30" aria-hidden="true">
          <Detalhe id={detalhes.final} sizes="100vw" className="h-full w-full" />
        </div>
        <div className="container-site section-y relative text-center">
          <Reveal className="mx-auto max-w-3xl">
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
        </div>
      </section>
    </>
  );
}
