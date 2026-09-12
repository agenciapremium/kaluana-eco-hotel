import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { CardPost } from "@/components/historias/CardPost";
import { TrilhoLeitura } from "@/components/institucional/TrilhoLeitura";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { FramedImage } from "@/components/scene/FramedImage";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { Arrow } from "@/components/ui/Arrow";
import type { BlocoPost } from "@/lib/content-schema";
import { getImage, hasImage, imageSrc } from "@/lib/media";
import {
  dataPorExtenso,
  getPost,
  postUrl,
  posts,
  relacionados,
  rotuloDaCategoria,
  tempoDeLeitura,
} from "@/lib/posts";
import { blogPostingSchema } from "@/lib/schema";
import { foraDoIndiceNaPre } from "@/lib/seo";
import { notasInternas, siteUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  const title = `${post.titulo} | Histórias | Kaluanã`;
  return {
    title: { absolute: title },
    description: post.resumo,
    keywords: post.keywords,
    alternates: { canonical: postUrl(post.slug) },
    ...foraDoIndiceNaPre,
    openGraph: {
      title,
      description: post.resumo,
      url: postUrl(post.slug),
      type: "article",
      publishedTime: post.data,
    },
  };
}

/** Blocos do corpo do post. A estrutura é validada no build (lib/content-schema.ts). */
function Bloco({ bloco, indice }: { bloco: BlocoPost; indice: number }) {
  switch (bloco.tipo) {
    case "subtitulo":
      return (
        <Reveal as="h2" className="post-subtitulo">
          <CopyText text={bloco.texto} />
        </Reveal>
      );
    case "citacao":
      return (
        <Reveal as="blockquote" className="post-citacao">
          <CopyText text={bloco.texto} />
        </Reveal>
      );
    case "lista":
      return (
        <Reveal as="ul" className="curiosidades post-lista">
          {bloco.itens.map((item) => (
            <li key={item}>
              <CopyText text={item} />
            </li>
          ))}
        </Reveal>
      );
    case "imagem":
      return hasImage(bloco.id) ? (
        <figure className="post-figura">
          <FramedImage
            id={bloco.id}
            ratio="4 / 3"
            sizes="(min-width: 64rem) 46rem, 100vw"
            delay={indice % 2 === 0 ? 0 : motionTokens.stagger.item}
          />
          <figcaption>{bloco.legenda}</figcaption>
        </figure>
      ) : null;
    default:
      return (
        <Reveal as="p" className="post-paragrafo">
          <CopyText text={bloco.texto} />
        </Reveal>
      );
  }
}

/** Post de Histórias (5.22). */
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const capa = hasImage(post.capa) ? getImage(post.capa) : null;
  const outros = relacionados(post.slug);

  return (
    <article className="post-page">
      <JsonLd
        data={blogPostingSchema({
          url: postUrl(post.slug),
          titulo: post.titulo,
          descricao: post.resumo,
          publicadoEm: post.data,
          atualizadoEm: post.atualizado ?? post.data,
          keywords: post.keywords,
          imagem: capa
            ? {
                url: `${siteUrl}${imageSrc(capa, 1600, "webp")}`,
                alt: capa.alt,
                width: capa.width,
                height: capa.height,
              }
            : undefined,
        })}
      />
      <TrilhoLeitura orientacao="topo" />

      <header className="post-cabecalho">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { name: "Histórias", url: "/historias" },
              { name: post.titulo, url: postUrl(post.slug) },
            ]}
          />
          <span className="kicker mt-8 mb-4">{rotuloDaCategoria[post.categoria]}</span>
          <h1 className="post-titulo">{post.titulo}</h1>
          <p className="post-meta">
            <time dateTime={post.data}>{dataPorExtenso(post.data)}</time>
            <span aria-hidden="true"> · </span>
            {tempoDeLeitura(post)} min de leitura
          </p>
        </div>
      </header>

      {capa ? (
        <div className="post-capa">
          <MediaImage
            id={post.capa}
            sizes="100vw"
            className="post-capa-picture"
            imgClassName="post-capa-img"
            priority
          />
        </div>
      ) : null}

      <div id="conteudo-principal" className="container-site post-corpo">
        <Reveal as="p" className="post-abertura">
          <CopyText text={post.abertura} />
        </Reveal>
        {post.corpo.map((b, i) => (
          <Bloco key={`${b.tipo}-${i}`} bloco={b} indice={i} />
        ))}

        {post.a_seguir ? (
          <Reveal className="post-a-seguir">
            <h2 className="kicker mb-3">O que vem a seguir</h2>
            <p>
              <CopyText text={post.a_seguir} />
            </p>
            {post.links.length > 0 ? (
              <div className="mt-6 flex flex-wrap gap-3">
                {post.links.map((l) => (
                  <Link key={l} href={l} className="btn btn-secondary">
                    {l === "/o-kaluana"
                      ? "O Kaluanã"
                      : l === "/ji-parana"
                        ? "Ji-Paraná"
                        : l.startsWith("/universo")
                          ? "Universo Kaluanã"
                          : "Ver mais"}
                    <Arrow />
                  </Link>
                ))}
              </div>
            ) : null}
          </Reveal>
        ) : null}

        {post.revisar && notasInternas ? (
          <p className="aviso-interno mt-10" role="note">
            Post escrito a partir de fatos já presentes no documento mestre, para a página não
            nascer vazia. A revisar pelo responsável da Premium, inclusive a data.
          </p>
        ) : null}
      </div>

      {outros.length > 0 ? (
        <section className="post-relacionados">
          <div className="container-site">
            <Reveal>
              <h2 className="text-title">Continue lendo</h2>
            </Reveal>
            <ul className="lista-posts mt-10">
              {outros.map((p, i) => (
                <li key={p.slug}>
                  <CardPost post={p} delay={i * motionTokens.stagger.item} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </article>
  );
}
