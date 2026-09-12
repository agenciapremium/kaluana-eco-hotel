import { SiteLink as Link } from "@/components/ui/SiteLink";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/forms/LeadForm";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { WordTitle } from "@/components/motion/WordTitle";
import { Arrow } from "@/components/ui/Arrow";
import { getPagina, getSecao } from "@/lib/content";
import type { Pagina } from "@/lib/content-schema";
import {
  breadcrumbSchema,
  faqSchema,
  hotelSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/schema";
import { motion as motionTokens } from "@/lib/tokens";
import { FloorBands } from "./FloorBands";
import { HeroVideo } from "./HeroVideo";
import { Section } from "./Section";

/**
 * Página de pré-inauguração (5.30): hero com vídeo, o nome, os andares, empresas,
 * formulário "Avisamos você primeiro" e três perguntas (FAQPage, do bloco de SEO).
 */
export function HomePre({ pagina }: { pagina: Pagina }) {
  const hero = getSecao(pagina, "Hero");
  const nome = getSecao(pagina, "O nome");
  const andares = getSecao(pagina, "Os andares");
  const empresas = getSecao(pagina, "Empresas");
  const formulario = getSecao(pagina, "Formulário");

  // As três perguntas do FAQPage vêm da página Perguntas frequentes (5.25), sem campos pendentes.
  const faqPagina = getPagina("perguntas-frequentes");
  const faq = (faqPagina.faq ?? [])
    .filter((f) => !/⟨/.test(f.r))
    .filter((f) => /Onde fica|Quando o Kaluanã|O que significa/.test(f.p))
    .slice(0, 3);

  return (
    <>
      <JsonLd
        data={[
          hotelSchema({ description: pagina.seo.resposta.trim() }),
          organizationSchema(),
          websiteSchema(),
          faqSchema(faq),
          breadcrumbSchema([{ name: "Início", url: "/" }]),
        ]}
      />

      <section className="hero" data-hero>
        <HeroVideo />
        <div className="container-site hero-inner">
          <div className="max-w-3xl">
            {hero.kicker ? <span className="kicker mb-6">{hero.kicker}</span> : null}
            <WordTitle
              text={hero.titulo ?? pagina.seo.h1}
              className="text-display"
              delay={motionTokens.duration.short}
            />
            <p className="lead mt-6">{pagina.seo.resposta.trim()}</p>
            {hero.texto ? <CopyParagraphs text={hero.texto} className="mt-4 text-xl" /> : null}
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#avisamos" className="btn btn-primary">
                {hero.cta_primario}
                <Arrow />
              </a>
              <Link href="/historias" className="btn btn-secondary">
                {hero.cta_secundario}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Section id="o-nome" title={nome.titulo} tone="branco">
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1fr_auto]">
          <Reveal className="measure">
            {nome.texto ? <CopyParagraphs text={nome.texto} className="text-xl" /> : null}
          </Reveal>
          <StrokeSymbol
            className="text-cafe h-40 w-40 justify-self-center lg:h-56 lg:w-56"
            title="Símbolo do Kaluanã"
          />
        </div>
      </Section>

      <Section id="os-andares" kicker="Universo Kaluanã" title={andares.titulo}>
        <Reveal className="measure mt-6">
          {andares.texto ? <CopyParagraphs text={andares.texto} className="text-xl" /> : null}
        </Reveal>
        <div className="mt-10">
          <FloorBands />
        </div>
        <Reveal className="mt-8">
          <Link href="/universo" className="btn btn-secondary">
            {andares.cta_secundario}
            <Arrow />
          </Link>
        </Reveal>
      </Section>

      <Section id="empresas" kicker="Empresas" title={empresas.titulo} tone="cafe">
        <Reveal className="measure mt-6">
          {empresas.texto ? (
            <CopyParagraphs text={empresas.texto} className="text-bege/90 text-xl" />
          ) : null}
          <a href="#avisamos" className="btn btn-inverse mt-8">
            {empresas.cta_secundario}
            <Arrow />
          </a>
        </Reveal>
      </Section>

      <Section id="avisamos" title={formulario.titulo} tone="branco">
        <Reveal className="mt-8 max-w-3xl">
          <LeadForm origem="pre" />
        </Reveal>
      </Section>

      {faq.length ? (
        <Section
          id="perguntas"
          kicker="Perguntas frequentes"
          title="O que perguntam sobre o Kaluanã."
        >
          <dl className="mt-8 grid gap-8 md:grid-cols-3">
            {faq.map((f, i) => (
              <Reveal key={f.p} as="div" delay={i * motionTokens.stagger.item}>
                <dt className="font-display text-2xl">
                  <CopyText text={f.p} />
                </dt>
                <dd className="mt-2 text-lg">
                  <CopyText text={f.r} />
                </dd>
              </Reveal>
            ))}
          </dl>
        </Section>
      ) : null}
    </>
  );
}
