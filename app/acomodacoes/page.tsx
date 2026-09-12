import type { Metadata } from "next";
import { CategoriaCard } from "@/components/acomodacoes/CategoriaCard";
import { FiltroPerfil } from "@/components/acomodacoes/FiltroPerfil";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import { categorias, getAcomodacoesHub, splitFicha } from "@/lib/acomodacoes";
import { getSecao } from "@/lib/content";
import { roomsCollectionSchema } from "@/lib/schema";
import { phase, reservasUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";

const pagina = getAcomodacoesHub();

/** Fase 0 (Parte 3.5): Acomodações só entra no site na inauguração. Até lá, fora do índice. */
const robotsFase = phase === "pre" ? { robots: { index: false, follow: false } } : {};

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
  ...robotsFase,
};

/** Imagens de reserva da etapa 1 (detalhes, nunca ambientes do hotel). */
const img = { hero: "detalhes/luz-de-janela", final: "detalhes/textura-madeira" } as const;

/**
 * Hub de Acomodações (5.3): hero em foto, filtro por perfil com a grade das sete categorias
 * em cards grandes (faixa com snap no celular), regras da casa e chamada final.
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const filtro = getSecao(pagina, "Filtro por perfil");
  const cats = getSecao(pagina, "Categorias");
  const regras = getSecao(pagina, "Regras da casa");
  const final = getSecao(pagina, "Chamada final");
  // TODO(copy): "Setenta" só entra após a inauguração, quando o veto ao número de apartamentos
  // cair (nota da 5.3). Até lá, "Sete categorias. Muitas histórias."
  const tituloCategorias = (cats.titulo ?? "").replace("Setenta", "Muitas");

  return (
    <>
      <JsonLd
        data={roomsCollectionSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: pagina.seo.resposta.trim(),
          quartos: categorias.map((c) => ({ url: c.url, nome: c.nome, capacidade: c.capacidade })),
        })}
      />

      <HeroScene
        image={img.hero}
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        actions={
          <TrackedLink
            href={reservasUrl}
            event="reservar_click"
            params={{ origem: "hero_acomodacoes" }}
            className="btn btn-inverse"
          >
            {hero.cta_primario}
            <Arrow />
          </TrackedLink>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: "Acomodações", url: pagina.url }]} />
        </div>

        <Section id="escolha" kicker={filtro.kicker} title={filtro.titulo} align="center">
          <Reveal className="measure mx-auto mt-6 text-center">
            {filtro.texto ? <CopyParagraphs text={filtro.texto} className="text-xl" /> : null}
          </Reveal>
          <div className="mt-8">
            <FiltroPerfil
              items={categorias.map((c, i) => ({
                id: c.slug,
                perfis: c.perfis,
                node: <CategoriaCard categoria={c} index={i} />,
              }))}
              heading={
                <Reveal className="mx-auto mt-14 mb-10 max-w-3xl text-center">
                  <span className="kicker mb-4 justify-center">{cats.kicker}</span>
                  <h2 className="text-title">
                    <CopyText text={tituloCategorias} />
                  </h2>
                  <p className="mt-6 text-xl">
                    <CopyText text={pagina.seo.resposta.trim()} />
                  </p>
                  {cats.texto ? (
                    <CopyParagraphs text={cats.texto} className="mt-4 text-lg" />
                  ) : null}
                </Reveal>
              }
            />
          </div>
        </Section>

        <Section id="bom-saber" kicker={regras.kicker} title={regras.titulo} tone="branco">
          <ul className="ficha-list mt-10">
            {splitFicha(regras.texto ?? "").map((item, i) => (
              <Reveal as="li" key={item} delay={i * motionTokens.stagger.item}>
                <CopyText text={item} />
              </Reveal>
            ))}
          </ul>
        </Section>

        <Scene id="chamada-final" image={img.final} veil="cafe" veilOpacity={0.7} align="center">
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
                params={{ origem: "chamada_final_acomodacoes" }}
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
