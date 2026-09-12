import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { CSSProperties } from "react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/motion/Reveal";
import { floors, motion as motionTokens, type FloorKey } from "@/lib/tokens";

const bands: { key: FloorKey; image: string }[] = [
  { key: "rios", image: "andares/rio-machado" },
  { key: "peixes", image: "andares/jau" },
  { key: "arvores", image: "andares/samauma" },
  { key: "aves", image: "andares/coruja" },
];

/**
 * Quatro faixas horizontais, uma por andar, com a foto de referência (RIO MACHADO 4, Jau 2,
 * Samauma 2, coruja). No hover a faixa expande e revela o nome; no mobile viram cards (Parte 2.4).
 */
export function FloorBands() {
  return (
    <div className="floor-bands">
      {bands.map((b, i) => {
        const f = floors[b.key];
        return (
          <Reveal key={b.key} as="div" delay={i * motionTokens.stagger.item} className="floor-band-wrap">
            <Link
              href={f.url}
              className="floor-band"
              style={{ "--accent": f.accent } as CSSProperties}
              aria-label={`${f.nome}, ${f.ordinal}`}
            >
              <MediaImage id={b.image} sizes="(min-width: 64rem) 25vw, 100vw" className="floor-band-picture" />
              <span className="floor-band-veil" aria-hidden="true" />
              <span className="floor-band-label">
                <span className="floor-band-ordinal">{f.ordinal}</span>
                <span className="floor-band-name">{f.nome.replace(/^Andar (dos|das) /, "")}</span>
              </span>
            </Link>
          </Reveal>
        );
      })}
    </div>
  );
}
