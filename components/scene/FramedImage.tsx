import type { ReactNode } from "react";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { MediaImage } from "@/components/ui/MediaImage";
import { hasImage } from "@/lib/media";

type Props = {
  id: string;
  sizes: string;
  ratio?: string;
  className?: string;
  /** Conteúdo sobre a foto (título, texto), no rodapé da moldura. */
  children?: ReactNode;
  delay?: number;
  href?: string;
};

/** Foto com moldura fina interna, entrada em máscara e zoom leve no hover. */
export function FramedImage({ id, sizes, ratio = "4 / 3", className, children, delay = 0 }: Props) {
  return (
    <Reveal
      variant="mask"
      delay={delay}
      className={["framed", className].filter(Boolean).join(" ")}
    >
      <div className="framed-inner card-zoom" style={{ aspectRatio: ratio }}>
        {hasImage(id) ? (
          <MediaImage id={id} sizes={sizes} className="framed-picture" imgClassName="framed-img" />
        ) : (
          <div className="detalhe-placeholder h-full w-full" aria-hidden="true" />
        )}
        {children ? <div className="framed-veil" aria-hidden="true" /> : null}
        <Frame />
        {children ? <div className="framed-content">{children}</div> : null}
      </div>
    </Reveal>
  );
}
