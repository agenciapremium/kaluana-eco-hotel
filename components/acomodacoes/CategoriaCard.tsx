import { CopyText } from "@/components/Copy";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { Categoria } from "@/lib/acomodacoes";
import { perfilFrase } from "@/lib/perfis";
import { getSecao } from "@/lib/content";
import { hasImage } from "@/lib/media";
import { motion as motionTokens } from "@/lib/tokens";

/**
 * Card grande de categoria no hub (5.3): foto de detalhe emoldurada, nome e frase do hero.
 * No hover a foto escala 1,03 e um véu em verde sálvia sobe com o nome e a frase de perfil.
 */
export function CategoriaCard({ categoria: c, index }: { categoria: Categoria; index: number }) {
  const hero = getSecao(c.pagina, "Hero");
  const frase = `${c.perfis.map((p) => perfilFrase[p]).join(". ")}.`;
  return (
    <Reveal variant="mask" delay={(index % 3) * motionTokens.stagger.item}>
      <Link href={c.url} className="categoria-link card-zoom">
        <div className="categoria-media">
          {hasImage(c.imagem) ? (
            <MediaImage
              id={c.imagem}
              sizes="(min-width: 64rem) 30vw, (min-width: 48rem) 45vw, 85vw"
              className="framed-picture"
              imgClassName="framed-img"
            />
          ) : (
            <div className="detalhe-placeholder absolute inset-0" aria-hidden="true" />
          )}
          <Frame />
          <div className="categoria-veil" aria-hidden="true">
            <p className="categoria-veil-nome">{c.nome}</p>
            <p className="categoria-veil-frase">{frase}</p>
          </div>
        </div>
        <div className="categoria-body">
          <span className="kicker mb-2">Até {c.capacidade} pessoas</span>
          <h3 className="categoria-nome">{c.nome}</h3>
          <p className="categoria-frase">
            <CopyText text={hero.titulo ?? ""} />
          </p>
        </div>
      </Link>
    </Reveal>
  );
}
