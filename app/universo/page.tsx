import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { BuscaNomes } from "@/components/universo/BuscaNomes";
import { Elevador } from "@/components/universo/Elevador";
import { mostraNumeroDeQuarto, semContagem } from "@/lib/contagem";
import { getPagina, getSecao } from "@/lib/content";
import { hasImage } from "@/lib/media";
import { colecaoSchema } from "@/lib/schema";
import { floorOrder, floors, motion as motionTokens, type FloorKey } from "@/lib/tokens";
import { universoIndex } from "@/lib/universo";

const pagina = getPagina("universo");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

/** Cada andar tem uma seção no hub, com o nome da seção no YAML e a sua atmosfera. */
const secaoDoAndar: Record<FloorKey, { secao: string; imagem: string }> = {
  rios: { secao: "Andar dos Rios", imagem: "atmosfera/rio-mata" },
  peixes: { secao: "Andar dos Peixes", imagem: "atmosfera/agua-corrente" },
  arvores: { secao: "Andar das Árvores", imagem: "atmosfera/copa-mata" },
  aves: { secao: "Andar das Aves", imagem: "atmosfera/ceu-entardecer" },
  guardioes: { secao: "Os Guardiões", imagem: "atmosfera/nevoa-mata" },
};

/**
 * Hub do Universo Kaluanã (5.11). A página é um elevador: cada andar ocupa a tela com a sua
 * cor e uma foto em parallax, o indicador lateral acompanha a subida e a busca encontra
 * qualquer um dos nomes. É a porta de entrada dos QR Codes e o maior ativo de SEO do site.
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const como = getSecao(pagina, "Como funciona");
  const busca = getSecao(pagina, "Busca");

  const paradas = floorOrder.map((key) => ({
    id: `andar-${key}`,
    ordinal: floors[key].ordinal,
    nome: floors[key].nome.replace(/^Andar (dos|das) /, ""),
    accent: floors[key].accent,
  }));

  const itensBusca = universoIndex.map((i) => ({
    nome: i.nome,
    uh: i.uh,
    url: i.url,
    andar: floors[i.grupo].nome,
  }));

  return (
    <>
      <JsonLd
        data={colecaoSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: pagina.seo.resposta.trim(),
          itens: floorOrder.map((k) => ({ url: floors[k].url, nome: floors[k].nome })),
        })}
      />

      <HeroScene
        image="atmosfera/nevoa-mata"
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.62}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: "Universo Kaluanã", url: pagina.url }]} />
        </div>

        <Section id="como-funciona" kicker={como.kicker} title={como.titulo} align="center">
          <Reveal className="measure mx-auto mt-6 text-center">
            {como.texto ? <CopyParagraphs text={como.texto} className="text-xl" /> : null}
          </Reveal>
        </Section>

        <div className="elevador-wrap">
          <Elevador paradas={paradas} />
          <div className="andares">
            {floorOrder.map((key) => {
              const f = floors[key];
              const cfg = secaoDoAndar[key];
              const s = getSecao(pagina, cfg.secao);
              return (
                <section
                  key={key}
                  id={`andar-${key}`}
                  className="andar-bloco"
                  style={{ "--accent": f.accent } as CSSProperties}
                  aria-label={f.nome}
                >
                  <div className="scene-bg" aria-hidden="true">
                    {hasImage(cfg.imagem) ? (
                      <MediaImage
                        id={cfg.imagem}
                        sizes="100vw"
                        className="scene-picture"
                        imgClassName="scene-img"
                      />
                    ) : null}
                    <div className="andar-bloco-veil" />
                  </div>
                  <div className="container-site andar-bloco-conteudo">
                    <Reveal className="andar-bloco-texto">
                      <span className="kicker mb-4">{s.kicker}</span>
                      <h2 className="andar-bloco-nome">
                        <CopyText text={s.titulo ?? f.nome} />
                      </h2>
                      {s.texto ? (
                        <CopyParagraphs text={semContagem(s.texto)} className="andar-bloco-lead" />
                      ) : null}
                      <Link href={f.url} className="btn btn-inverse mt-8">
                        {s.cta_secundario ?? `Ver o ${f.nome.toLowerCase()}`}
                        <Arrow />
                      </Link>
                    </Reveal>
                  </div>
                </section>
              );
            })}
          </div>
        </div>

        <Section id="busca" kicker={busca.kicker} title={busca.titulo} align="center">
          <Reveal className="measure mx-auto mt-6 text-center">
            {busca.texto ? <CopyParagraphs text={busca.texto} className="text-xl" /> : null}
          </Reveal>
          <Reveal className="mx-auto mt-8 max-w-xl" delay={motionTokens.stagger.item}>
            <BuscaNomes itens={itensBusca} mostraNumero={mostraNumeroDeQuarto} />
          </Reveal>
          <Reveal className="mt-10 text-center">
            <Link href="/acomodacoes" className="btn btn-secondary">
              Ver as acomodações
              <Arrow />
            </Link>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
