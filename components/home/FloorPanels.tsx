import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { EncaixePaineis } from "@/components/home/EncaixePaineis";
import { FramedImage } from "@/components/scene/FramedImage";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { MediaImage } from "@/components/ui/MediaImage";
import { hasImage } from "@/lib/media";
import { floors, motion as motionTokens, type FloorKey } from "@/lib/tokens";

type Panel = { key: FloorKey; atmosfera: string; foto: string; elemento: string; cta: string };

/**
 * Os quatro andares como painéis em tela cheia empilhados com sticky: cada um cobre o
 * anterior ao rolar, como subir de elevador. Fundo: atmosfera sem espécie (Higgsfield).
 * Card emoldurado: a foto de referência do andar indicada no documento mestre (5.1).
 * Sem contagens nem números de quarto antes da inauguração.
 *
 * Encaixe da rolagem (decisão 120): cada painel para inteiro na tela. Os pontos de encaixe são
 * marcadores fora dos painéis, porque o navegador se confunde com elementos em sticky: um antes
 * do primeiro painel, um por painel e um depois do último, para entrar e sair sem ficar preso.
 */
const panels: Panel[] = [
  {
    key: "rios",
    atmosfera: "atmosfera/rio-mata",
    foto: "andares/rio-machado",
    elemento: "Rio Machado",
    cta: "Ver o andar dos rios",
  },
  {
    key: "peixes",
    atmosfera: "atmosfera/agua-corrente",
    foto: "andares/jau",
    elemento: "Jaú",
    cta: "Ver o andar dos peixes",
  },
  {
    key: "arvores",
    atmosfera: "atmosfera/copa-mata",
    foto: "andares/samauma",
    elemento: "Samaúma",
    cta: "Ver o andar das árvores",
  },
  {
    key: "aves",
    atmosfera: "atmosfera/ceu-entardecer",
    foto: "andares/coruja",
    elemento: "Coruja",
    cta: "Ver o andar das aves",
  },
];

export function FloorPanels() {
  return (
    <div className="panels">
      {panels.map((p) => {
        const f = floors[p.key];
        return (
          <section
            key={p.key}
            className="panel"
            style={{ "--accent": f.accent } as CSSProperties}
            aria-label={`${f.nome}, ${f.ordinal}`}
          >
            <div className="scene-bg" aria-hidden="true">
              {hasImage(p.atmosfera) ? (
                <MediaImage
                  id={p.atmosfera}
                  sizes="100vw"
                  className="scene-picture"
                  imgClassName="scene-img"
                />
              ) : null}
              <div className="scene-veil" />
            </div>
            <div className="panel-content container-site">
              <Reveal className="panel-text">
                <span className="kicker mb-4">{f.ordinal}</span>
                <h3 className="panel-name">{f.nome.replace(/^Andar (dos|das) /, "")}</h3>
                <Link href={f.url} className="btn btn-secondary mt-8">
                  {p.cta}
                  <Arrow />
                </Link>
              </Reveal>
              <FramedImage
                id={p.foto}
                ratio="1 / 1"
                sizes="(min-width: 64rem) 22rem, 20rem"
                className="panel-card"
                delay={motionTokens.stagger.item * 2}
              >
                <span className="kicker text-bege mb-1">Quarto com nome</span>
                <p className="font-display text-3xl">{p.elemento}</p>
              </FramedImage>
            </div>
          </section>
        );
      })}
      {Array.from({ length: panels.length + 2 }, (_, i) => i - 1).map((i) => (
        <span
          key={`encaixe-${i}`}
          className="panel-encaixe"
          aria-hidden="true"
          style={{ "--i": i } as CSSProperties}
        />
      ))}
      <EncaixePaineis />
    </div>
  );
}
