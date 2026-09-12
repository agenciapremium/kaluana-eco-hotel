import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { LeadForm } from "@/components/forms/LeadForm";
import { Frame } from "@/components/motion/Frame";
import { OutlineText } from "@/components/motion/OutlineText";
import { Reveal } from "@/components/motion/Reveal";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
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
import { FloorPanels } from "./FloorPanels";
import { Section } from "./Section";

const img = {
  hero: "atmosfera/rio-amanhecer",
  nome: "atmosfera/nevoa-mata",
  empresas: "atmosfera/estrada-terra",
} as const;

/**
 * Página de pré-inauguração (5.30) em cenas: hero em foto, o nome em cena escura, os andares
 * em painéis, empresas em cena com card emoldurado, formulário "Avisamos você primeiro" e
 * três perguntas (FAQPage, do bloco de SEO).
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

      <HeroScene
        image={img.hero}
        kicker={hero.kicker}
        title={hero.titulo ?? pagina.seo.h1}
        lead={pagina.seo.resposta.trim()}
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        actions={
          <>
            <a href="#avisamos" className="btn btn-inverse">
              {hero.cta_primario}
              <Arrow />
            </a>
            <Link href="/historias" className="btn btn-ghost-light">
              {hero.cta_secundario}
            </Link>
          </>
        }
      />

      <div id="conteudo-principal">
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
            <h2 className="text-title">
              <CopyText text={nome.titulo ?? ""} />
            </h2>
            {nome.texto ? (
              <CopyParagraphs text={nome.texto} className="lead text-bege/90 mt-6" />
            ) : null}
          </Reveal>
        </Scene>

        <Section
          id="os-andares"
          kicker="Universo Kaluanã"
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
                {andares.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>

        <Scene
          id="empresas"
          image={img.empresas}
          veil="cafe"
          veilOpacity={0.7}
          height="full"
          align="center"
        >
          <Reveal className="scene-card">
            <Frame />
            <span className="kicker mb-4 justify-center">Empresas</span>
            <h2 className="text-title">
              <CopyText text={empresas.titulo ?? ""} />
            </h2>
            {empresas.texto ? (
              <CopyParagraphs text={empresas.texto} className="text-bege/90 mt-4 text-xl" />
            ) : null}
            <a href="#avisamos" className="btn btn-inverse mt-8">
              {empresas.cta_secundario}
              <Arrow />
            </a>
          </Reveal>
        </Scene>

        <Section id="avisamos" title={formulario.titulo} align="center" tone="bege">
          <Reveal className="bg-branco relative mx-auto mt-10 max-w-3xl p-6 sm:p-10">
            <Frame tone="cafe" inset="0.75rem" />
            <LeadForm origem="pre" />
          </Reveal>
        </Section>

        {faq.length ? (
          <Section
            id="perguntas"
            kicker="Perguntas frequentes"
            title="O que perguntam sobre o Kaluanã."
            tone="branco"
          >
            <dl className="mt-10 grid gap-8 md:grid-cols-3">
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
      </div>
    </>
  );
}
