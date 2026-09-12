import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { Post } from "@/lib/content-schema";
import { hasImage } from "@/lib/media";
import { dataPorExtenso, postUrl, rotuloDaCategoria, tempoDeLeitura } from "@/lib/posts";

/**
 * Card da listagem (5.21): capa em 4 por 5, que escala 3% no hover, com a data deslizando
 * para dentro.
 */
export function CardPost({ post, delay = 0 }: { post: Post; delay?: number }) {
  return (
    <Reveal variant="mask" delay={delay} amount={0.1}>
      <Link href={postUrl(post.slug)} className="card-post card-zoom">
        <div className="card-post-media">
          {hasImage(post.capa) ? (
            <MediaImage
              id={post.capa}
              sizes="(min-width: 64rem) 44vw, 92vw"
              className="framed-picture"
              imgClassName="framed-img"
            />
          ) : (
            <div className="detalhe-placeholder absolute inset-0" aria-hidden="true" />
          )}
          <Frame inset="0.75rem" />
          <span className="card-post-data">
            <time dateTime={post.data}>{dataPorExtenso(post.data)}</time>
          </span>
        </div>
        <div className="card-post-corpo">
          <span className="kicker mb-2">{rotuloDaCategoria[post.categoria]}</span>
          <h3 className="card-post-titulo">{post.titulo}</h3>
          <p className="card-post-resumo">{post.resumo}</p>
          <p className="card-post-tempo">{tempoDeLeitura(post)} min de leitura</p>
        </div>
      </Link>
    </Reveal>
  );
}
