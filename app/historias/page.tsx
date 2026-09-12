import type { Metadata } from "next";
import { foraDoIndiceNaPre } from "@/lib/seo";
import { CopyParagraphs } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { CardPost } from "@/components/historias/CardPost";
import { ListaPosts } from "@/components/historias/ListaPosts";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { getPagina, getSecao } from "@/lib/content";
import { blogSchema } from "@/lib/schema";
import { categoriasComPost, posts, postsPorPagina, rotuloDaCategoria } from "@/lib/posts";
import { motion as motionTokens } from "@/lib/tokens";

const pagina = getPagina("historias");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  ...foraDoIndiceNaPre,
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

/**
 * Histórias (5.21): o diário do Kaluanã. Lista os posts mais recentes primeiro, doze por
 * página, com os assuntos como chips. A paginação só aparece quando passar de doze posts.
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const categorias = getSecao(pagina, "Categorias");
  const daPagina = posts.slice(0, postsPorPagina);

  return (
    <>
      <JsonLd
        data={blogSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: pagina.seo.resposta.trim(),
        })}
      />

      <HeroScene
        image="detalhes/maos-na-obra"
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

        <Section id="assuntos" kicker={categorias.kicker} title={categorias.titulo}>
          <Reveal className="measure mt-6">
            {categorias.texto ? (
              <CopyParagraphs text={categorias.texto} className="text-xl" />
            ) : null}
          </Reveal>
          <div className="mt-12">
            {daPagina.length > 0 ? (
              <ListaPosts
                categorias={categoriasComPost()}
                rotulos={rotuloDaCategoria}
                items={daPagina.map((p, i) => ({
                  slug: p.slug,
                  categoria: p.categoria,
                  node: <CardPost post={p} delay={(i % 2) * motionTokens.stagger.item} />,
                }))}
              />
            ) : (
              <p className="text-xl">Os primeiros posts entram junto com o avanço da obra.</p>
            )}
          </div>
        </Section>
      </div>
    </>
  );
}
