import type { CSSProperties, ReactNode } from "react";
import { Parallax } from "@/components/motion/Parallax";
import { MediaImage } from "@/components/ui/MediaImage";
import { hasImage } from "@/lib/media";

type Props = {
  id?: string;
  /** Imagem de fundo (id do manifesto). Sem ela, a cena usa só a cor. */
  image?: string;
  /** Cor do véu sobre a foto: café, preto ou um acento de andar. */
  veil?: "cafe" | "preto" | string;
  veilOpacity?: number;
  /** Altura: tela cheia ou conforme o conteúdo. */
  height?: "full" | "auto" | "hero";
  align?: "center" | "left";
  parallax?: boolean;
  priority?: boolean;
  className?: string;
  children: ReactNode;
  /** Etiqueta acessível quando a cena é um marco de navegação. */
  ariaLabel?: string;
};

/**
 * Cena em tela cheia: foto de fundo com parallax e véu escuro, conteúdo em bege por cima.
 * É a unidade visual da Home conceitual (ver docs/decisoes.md, etapa 1, item 21).
 */
export function Scene({
  id,
  image,
  veil = "cafe",
  veilOpacity = 0.55,
  height = "auto",
  align = "center",
  parallax = true,
  priority = false,
  className,
  children,
  ariaLabel,
}: Props) {
  const veilColor =
    veil === "cafe" ? "var(--color-cafe)" : veil === "preto" ? "var(--color-preto)" : veil;
  const img = image && hasImage(image) ? image : null;
  const picture = img ? (
    <MediaImage
      id={img}
      sizes="100vw"
      className="scene-picture"
      imgClassName="scene-img"
      priority={priority}
    />
  ) : null;
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={["scene", `scene-${height}`, `scene-${align}`, className]
        .filter(Boolean)
        .join(" ")}
      style={{ "--veil": veilColor, "--veil-opacity": veilOpacity } as CSSProperties}
    >
      <div className="scene-bg" aria-hidden="true">
        {picture ? parallax ? <Parallax>{picture}</Parallax> : picture : null}
        <div className="scene-veil" />
      </div>
      <div className="scene-content container-site">{children}</div>
    </section>
  );
}
