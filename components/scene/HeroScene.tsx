import type { CSSProperties, ReactNode } from "react";
import { CopyText } from "@/components/Copy";
import { Parallax } from "@/components/motion/Parallax";
import { WordTitle } from "@/components/motion/WordTitle";
import { MediaImage } from "@/components/ui/MediaImage";
import { getVideo, hasImage } from "@/lib/media";
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
  /**
   * Loop de fundo (id em content/media.json). Substitui a foto. O poster pinta primeiro e
   * continua no lugar do vídeo com movimento reduzido (Parte 2.3).
   */
  video?: string;
};

/**
 * Anexa as fontes do vídeo de fundo só depois da primeira pintura. O poster já pintou; o
 * loop, que pesa cerca de 1 MB, fica fora do caminho crítico e não entra na conta do LCP.
 * Com movimento reduzido o vídeo nem é carregado: fica o poster.
 */
const heroScript = `(function(){var v=document.currentScript&&document.currentScript.parentNode.querySelector('.hero-video');if(!v)return;
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
function go(){['webm','mp4'].forEach(function(t){var u=v.getAttribute('data-'+t);if(!u)return;var s=document.createElement('source');s.src=u;s.type='video/'+t;v.appendChild(s);});v.load();var p=v.play();if(p&&p.catch)p.catch(function(){});}
if(document.readyState==='complete')setTimeout(go,0);else window.addEventListener('load',function(){setTimeout(go,0);});})();`;

/**
 * Hero em tela cheia: foto de fundo com parallax e véu café, título centralizado palavra a
 * palavra. A foto é o LCP: entra com fetchpriority="high" e loading="eager" no HTML inicial,
 * sem <link rel="preload">, porque o preload (por ReactDOM.preload ou por <link> elevado)
 * vai no payload RSC e é executado também quando outra página faz prefetch desta rota,
 * baixando o hero de rotas vizinhas sem uso (ver docs/decisoes.md, item 39).
 *
 * O cabeçalho fica transparente sobre esta cena por CSS (`html:has(.scene-hero)`). Até a
 * etapa 5 era um atributo posto por script no html, que ficava para trás na navegação para
 * uma página sem hero e deixava o cabeçalho bege sobre bege (docs/decisoes.md, etapa 6).
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
  video,
}: Props) {
  const loop = video ? getVideo(video) : null;
  const has = !loop && hasImage(image);
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
      <div
        className="scene-bg"
        aria-hidden="true"
        style={loop ? { backgroundImage: `url(${loop.poster})` } : undefined}
      >
        {loop ? (
          <video
            className="hero-video"
            poster={loop.poster}
            width={loop.width}
            height={loop.height}
            data-webm={loop.webm}
            data-mp4={loop.mp4}
            autoPlay
            muted
            loop
            playsInline
            preload="none"
          />
        ) : null}
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
      {loop ? (
        <script
          dangerouslySetInnerHTML={{
            __html: heroScript,
          }}
        />
      ) : null}
    </section>
  );
}
