import type { CSSProperties } from "react";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { mostraNumeroDeQuarto } from "@/lib/contagem";
import type { Item } from "@/lib/content-schema";
import { hasImage } from "@/lib/media";
import { elementoUrl, heroId } from "@/lib/universo";
import type { FloorKey } from "@/lib/tokens";

type Props = {
  item: Item;
  grupo: FloorKey;
  delay?: number;
  /** Proporção do card: as árvores são verticais, os peixes e rios horizontais. */
  ratio?: string;
  className?: string;
  style?: CSSProperties;
};

/** Card de elemento nos hubs de andar: foto, nome, subtítulo e o quarto (só na fase completa). */
export function CardElemento({ item, grupo, delay = 0, ratio = "4 / 3", className, style }: Props) {
  const id = heroId(grupo, item.id);
  return (
    <Reveal variant="mask" delay={delay} className={className} style={style} amount={0.1}>
      <Link href={elementoUrl(grupo, item.id)} className="card-elemento card-zoom">
        <div className="card-elemento-media" style={{ aspectRatio: ratio }}>
          {hasImage(id) ? (
            <MediaImage
              id={id}
              sizes="(min-width: 64rem) 25vw, (min-width: 48rem) 45vw, 85vw"
              className="framed-picture"
              imgClassName="framed-img"
            />
          ) : (
            <div className="detalhe-placeholder absolute inset-0" aria-hidden="true" />
          )}
          <Frame inset="0.75rem" />
        </div>
        <div className="card-elemento-corpo">
          <h3 className="card-elemento-nome">{item.nome}</h3>
          <p className="card-elemento-sub">{item.subtitulo}</p>
          {mostraNumeroDeQuarto ? <p className="card-elemento-uh">Quarto {item.uh}</p> : null}
        </div>
      </Link>
    </Reveal>
  );
}
