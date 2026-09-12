/**
 * Acesso às mídias processadas (content/media.json, gerado por scripts/build-media.ts).
 */
import mediaJson from "@/content/media.json";

export type MediaImage = {
  grupo: string;
  slug: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  blurDataURL: string;
  original: string;
};

export type MediaVideo = {
  mp4: string;
  webm: string;
  /** HEVC com canal alfa, para Safari. Só a abertura tem. */
  hevcAlpha?: string;
  poster: string;
  width: number;
  height: number;
  duration: number;
};

const media = mediaJson as unknown as {
  imagens: Record<string, MediaImage>;
  videos: Record<string, MediaVideo>;
};

export function getImage(id: string): MediaImage {
  const m = media.imagens[id];
  if (!m) throw new Error(`Imagem "${id}" não existe em content/media.json`);
  return m;
}

export function hasImage(id: string): boolean {
  return Boolean(media.imagens[id]);
}

export function getVideo(id: string): MediaVideo {
  const v = media.videos[id];
  if (!v) throw new Error(`Vídeo "${id}" não existe em content/media.json`);
  return v;
}

export function imageSrc(m: MediaImage, width: number, ext: "webp" | "avif" = "webp") {
  return `/media/${m.grupo}/${m.slug}-${width}.${ext}`;
}

export function srcSet(m: MediaImage, ext: "webp" | "avif") {
  return m.widths.map((w) => `${imageSrc(m, w, ext)} ${w}w`).join(", ");
}
