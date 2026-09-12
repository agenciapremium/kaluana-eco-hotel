import { getVideo } from "@/lib/media";
import { HeroScroll } from "./HeroScroll";

/**
 * Vídeo de fundo do hero: BG - KALUAMÃ em loop, sem som, com véu bege a 20%.
 * Ao rolar, o vídeo perde 15% de opacidade e o véu sobe (Parte 2.4). Com movimento
 * reduzido ou economia de dados, entra o quadro estático.
 */
export function HeroVideo({ id = "hero-bg" }: { id?: string }) {
  const v = getVideo(id);
  return (
    <div className="hero-media" aria-hidden="true" style={{ backgroundImage: `url(${v.poster})` }}>
      <video
        className="hero-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        disablePictureInPicture
        poster={v.poster}
        width={v.width}
        height={v.height}
      >
        <source src={v.webm} type="video/webm" />
        <source src={v.mp4} type="video/mp4" />
      </video>
      <div className="hero-veil" />
      <HeroScroll />
    </div>
  );
}
