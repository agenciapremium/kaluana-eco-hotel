import type { CSSProperties } from "react";
import { CopyText } from "@/components/Copy";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/ui/Arrow";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { qrMap } from "@/lib/content";
import type { Item } from "@/lib/content-schema";
import { hasImage } from "@/lib/media";
import { elementoUrl, heroId } from "@/lib/universo";

/**
 * Três painéis em tela cheia com rolagem por snap (5.16). Cada painel tem a foto do animal
 * em fundo escuro, o nome em tipografia grande e os dois destinos: a história e a
 * acomodação que leva o nome. O snap é do navegador, sem sequestrar a rolagem.
 */
export function PaineisGuardioes({ itens }: { itens: Item[] }) {
  return (
    <div className="guardioes">
      {itens.map((item, i) => {
        const id = heroId("guardioes", item.id);
        const qr = qrMap[item.uh];
        return (
          <section
            key={item.id}
            className="guardiao"
            style={{ "--i": i } as CSSProperties}
            aria-label={item.nome}
          >
            <div className="scene-bg" aria-hidden="true">
              {hasImage(id) ? (
                <MediaImage
                  id={id}
                  sizes="100vw"
                  className="scene-picture"
                  imgClassName="scene-img"
                  priority={i === 0}
                />
              ) : null}
              <div className="guardiao-veil" />
            </div>
            <div className="container-site guardiao-conteudo">
              <Reveal className="guardiao-card">
                <Frame />
                <p className="kicker mb-4">{item.subtitulo}</p>
                <h3 className="guardiao-nome">{item.nome}</h3>
                {item.cientifico ? <p className="elemento-cientifico">{item.cientifico}</p> : null}
                <p className="guardiao-texto">
                  <CopyText text={item.abertura.split(/\n\s*\n/)[0]} />
                </p>
                <div className="guardiao-acoes">
                  <Link href={elementoUrl("guardioes", item.id)} className="btn btn-inverse">
                    A história
                    <Arrow />
                  </Link>
                  {qr?.categoriaUrl && qr.categoria ? (
                    <Link href={qr.categoriaUrl} className="btn btn-ghost-light">
                      {qr.categoria}
                    </Link>
                  ) : null}
                </div>
              </Reveal>
            </div>
          </section>
        );
      })}
    </div>
  );
}
