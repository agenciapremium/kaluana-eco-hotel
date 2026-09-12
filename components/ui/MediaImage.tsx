import type { CSSProperties } from "react";
import { getImage, imageSrc, srcSet } from "@/lib/media";

type Props = {
  id: string;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  style?: CSSProperties;
};

/**
 * Imagem processada pelo pipeline: AVIF e WebP em 640, 1024, 1600 e 1920 px, servidas como
 * arquivos estáticos com dimensões declaradas (sem deslocamento de layout) e placeholder
 * borrado. Usa <picture> em vez de next/image para não reprocessar na borda o que o
 * pipeline já gerou (ver docs/decisoes.md).
 */
export function MediaImage({ id, sizes, className, imgClassName, priority, style }: Props) {
  const m = getImage(id);
  const largest = m.widths[m.widths.length - 1];
  return (
    <picture className={className} style={style}>
      <source type="image/avif" srcSet={srcSet(m, "avif")} sizes={sizes} />
      <img
        src={imageSrc(m, largest, "webp")}
        srcSet={srcSet(m, "webp")}
        sizes={sizes}
        width={m.width}
        height={m.height}
        alt={m.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={imgClassName}
        style={{ backgroundImage: `url(${m.blurDataURL})`, backgroundSize: "cover" }}
      />
    </picture>
  );
}
