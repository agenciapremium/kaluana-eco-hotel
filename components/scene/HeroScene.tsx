import type { CSSProperties, ReactNode } from "react";
import { CopyText } from "@/components/Copy";
import { Parallax } from "@/components/motion/Parallax";
import { WordTitle } from "@/components/motion/WordTitle";
import { MediaImage } from "@/components/ui/MediaImage";
import { hasImage } from "@/lib/media";
import { motion as motionTokens } from "@/lib/tokens";

type Props = {
  image: string;
  kicker?: string | null;
  title: string;
  /** Substitui o título palavra a palavra por um nó próprio (nome gigante em fade lento, 5.10). */
  titleNode?: ReactNode;
  lead?: string;
  leadClassName?: string;
  text?: ReactNode;
  actions?: ReactNode;
  veilOpacity?: number;
  /** Variáveis de movimento da cena (ex.: parallax de 6% no terraço, 5.7). */
  style?: CSSProperties;
  /** Camadas extras sobre a foto: segunda foto em fade (5.9), deriva de luz (5.8). */
  bgExtra?: ReactNode;
};

/**
 * Hero em tela cheia: foto de fundo com parallax e véu café, título centralizado palavra a
 * palavra. A foto é o LCP: entra com fetchpriority="high" e loading="eager" no HTML inicial,
 * sem <link rel="preload">, porque o preload (por ReactDOM.preload ou por <link> elevado)
 * vai no payload RSC e é executado também quando outra página faz prefetch desta rota,
 * baixando o hero de rotas vizinhas sem uso (ver docs/decisoes.md, item 39). Um script
 * inline marca a página como "de hero" para o cabeçalho ficar transparente até rolar.
 */
export function HeroScene({
  image,
  kicker,
  title,
  titleNode,
  lead,
  leadClassName,
  text,
  actions,
  veilOpacity = 0.5,
  style,
  bgExtra,
}: Props) {
  const has = hasImage(image);
  return (
    <section
      className="scene scene-hero scene-center hero-scene"
      data-hero
      style={
        {
          "--veil": "var(--color-cafe)",
          "--veil-opacity": veilOpacity,
          ...style,
        } as CSSProperties
      }
    >
      <div className="scene-bg" aria-hidden="true">
        {has ? (
          <Parallax>
            <MediaImage
              id={image}
              sizes="100vw"
              className="scene-picture"
              imgClassName="scene-img"
              priority
            />
          </Parallax>
        ) : null}
        {bgExtra}
        <div className="scene-veil" />
      </div>
      <div className="scene-content container-site">
        <div className="max-w-4xl">
          {kicker ? <span className="kicker mb-6">{kicker}</span> : null}
          {titleNode ? (
            <h1 className="hero-fade-title">{titleNode}</h1>
          ) : (
            <WordTitle text={title} className="text-display" delay={motionTokens.duration.short} />
          )}
          {lead ? (
            <p className={["hero-lead mt-8", leadClassName].filter(Boolean).join(" ")}>
              <CopyText text={lead} />
            </p>
          ) : null}
          {text ? <div className="hero-text mx-auto mt-4 max-w-2xl">{text}</div> : null}
          {actions ? (
            <div className="mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          ) : null}
        </div>
      </div>
      <a href="#conteudo-principal" className="scroll-cue" aria-label="Rolar para o conteúdo">
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M6 10l6 6 6-6" />
        </svg>
        Rolar
      </a>
      <script
        dangerouslySetInnerHTML={{
          __html: "document.documentElement.setAttribute('data-hero-page','1');",
        }}
      />
    </section>
  );
}
