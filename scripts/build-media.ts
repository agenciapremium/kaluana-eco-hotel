/**
 * Pipeline de mídia. Lê media-src/manifest.json e gera:
 *   imagens  -> public/media/<grupo>/<slug>-<largura>.{webp,avif} (640, 1024, 1600, 1920, sem ampliar)
 *   vídeo    -> public/media/video/hero-bg.{mp4,webm} + hero-bg-poster.webp (1280 px, sem áudio, < 2 MB)
 *   abertura -> public/media/video/abertura.webm (VP9 com alfa) + abertura.mp4 (H.264 sobre bege) + poster
 *   content/media.json com dimensões e caminhos, consumido por lib/media.ts
 *
 * Precisa de ffmpeg no PATH e da pasta ../DOCS. Roda localmente; as saídas são versionadas,
 * porque a Vercel não tem ffmpeg nem DOCS. Use: npm run build:media [-- --only=imagens|video|abertura]
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import sharp from "sharp";
import { imageWidths, colors, motion } from "../lib/tokens";

type ManifestImage = {
  grupo: string;
  slug: string;
  src: string;
  alt: string;
  uso?: string;
  crop?: string;
};
type ManifestVideo = { slug: string; src: string; uso?: string };
type Manifest = { imagens: ManifestImage[]; videos: ManifestVideo[]; abertura: ManifestVideo };

type MediaImage = {
  grupo: string;
  slug: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
  blurDataURL: string;
  original: string;
};
type MediaJson = {
  imagens: Record<string, MediaImage>;
  videos: Record<
    string,
    {
      mp4: string;
      webm: string;
      hevcAlpha?: string;
      poster: string;
      width: number;
      height: number;
      duration: number;
    }
  >;
};

const root = process.cwd();
const docsRoot = resolve(root, "..");
const manifest = JSON.parse(
  readFileSync(resolve(root, "media-src/manifest.json"), "utf8"),
) as Manifest;
const only = process.argv.find((a) => a.startsWith("--only="))?.slice(7);
const mediaJsonPath = resolve(root, "content/media.json");
const media: MediaJson = existsSync(mediaJsonPath)
  ? (JSON.parse(readFileSync(mediaJsonPath, "utf8")) as MediaJson)
  : { imagens: {}, videos: {} };

function srcPath(src: string) {
  const p = src.startsWith("DOCS/") ? resolve(docsRoot, src) : resolve(root, src);
  if (!existsSync(p)) throw new Error(`original não encontrado: ${src}`);
  return p;
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

function ffprobe(file: string) {
  const out = execFileSync("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height:format=duration",
    "-of",
    "json",
    file,
  ]).toString();
  const j = JSON.parse(out) as {
    streams: { width: number; height: number }[];
    format: { duration: string };
  };
  return {
    width: j.streams[0].width,
    height: j.streams[0].height,
    duration: Number(j.format.duration),
  };
}

/** Extrai um quadro (segundos, negativo conta do fim) como PNG e grava WebP com sharp. */
async function posterFrom(video: string, out: string, at: number, quality: number) {
  const png = out.replace(/\.webp$/, ".tmp.png");
  const seek = at < 0 ? ["-sseof", String(at)] : ["-ss", String(at)];
  ffmpeg([...seek, "-i", video, "-frames:v", "1", png]);
  await sharp(png).webp({ quality }).toFile(out);
  rmSync(png);
}

/** Marca: logo em PNG para schema.org, ícones e imagem Open Graph estática. */
async function buildMarca() {
  const logoDir = resolve(docsRoot, "DOCS/LOGO");
  const outDir = resolve(root, "public/media/marca");
  mkdirSync(outDir, { recursive: true });
  const vertical = readFileSync(resolve(logoDir, "logomarca_vertivcal.svg"));
  const simbolo = readFileSync(resolve(logoDir, "simbolo.svg"));
  // Logo vertical sobre bege, 1200 px, para o campo logo do schema.
  await sharp(vertical, { density: 300 })
    .resize({ width: 1000 })
    .flatten({ background: colors.bege })
    .extend({ top: 100, bottom: 100, left: 100, right: 100, background: colors.bege })
    .png()
    .toFile(resolve(outDir, "logo-vertical.png"));
  // Open Graph 1200x630: logo centralizada sobre bege.
  const logo = await sharp(vertical, { density: 300 }).resize({ width: 560 }).png().toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: colors.bege } })
    .composite([{ input: logo, gravity: "centre" }])
    .png()
    .toFile(resolve(root, "app/opengraph-image.png"));
  // Ícones: símbolo sobre bege.
  const icon = await sharp(simbolo, { density: 300 }).resize({ width: 120 }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 3, background: colors.bege } })
    .composite([{ input: icon, gravity: "centre" }])
    .png()
    .toFile(resolve(root, "app/apple-icon.png"));
  process.stdout.write("marca: logo-vertical.png, opengraph-image.png, apple-icon.png\n");
}

function kb(file: string) {
  return Math.round(statSync(file).size / 1024);
}

async function buildImages() {
  for (const img of manifest.imagens) {
    const input = srcPath(img.src);
    const outDir = resolve(root, "public/media", img.grupo);
    mkdirSync(outDir, { recursive: true });
    const meta = await sharp(input).rotate().metadata();
    const origWidth = meta.width ?? 0;
    const origHeight = meta.height ?? 0;
    // Recorte opcional (ex.: "1:1"), centrado no ponto de maior atenção, para as faixas de andar.
    const crop = img.crop?.match(/^(\d+):(\d+)$/);
    const ratio = crop ? Number(crop[2]) / Number(crop[1]) : origHeight / origWidth;
    let width = origWidth;
    let height = origHeight;
    if (crop) {
      if (origHeight / origWidth > ratio) {
        height = Math.round(origWidth * ratio);
      } else {
        width = Math.round(origHeight / ratio);
      }
    }
    const widths: number[] = imageWidths.filter((w) => w <= width);
    if (widths.length === 0) widths.push(width);
    for (const w of widths) {
      const base = crop
        ? sharp(input)
            .rotate()
            .resize({
              width: w,
              height: Math.round(w * ratio),
              fit: "cover",
              position: "attention",
              withoutEnlargement: true,
            })
        : sharp(input).rotate().resize({ width: w, withoutEnlargement: true });
      await base
        .clone()
        .webp({ quality: 78, effort: 5 })
        .toFile(resolve(outDir, `${img.slug}-${w}.webp`));
      await base
        .clone()
        .avif({ quality: 50, effort: 6 })
        .toFile(resolve(outDir, `${img.slug}-${w}.avif`));
    }
    const blur = crop
      ? await sharp(input)
          .rotate()
          .resize({
            width: 16,
            height: Math.round(16 * ratio),
            fit: "cover",
            position: "attention",
          })
          .webp({ quality: 40 })
          .toBuffer()
      : await sharp(input).rotate().resize({ width: 16 }).webp({ quality: 40 }).toBuffer();
    const largest = widths[widths.length - 1];
    media.imagens[`${img.grupo}/${img.slug}`] = {
      grupo: img.grupo,
      slug: img.slug,
      alt: img.alt,
      width: largest,
      height: Math.round((height / width) * largest),
      widths,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
      original: basename(img.src),
    };
    process.stdout.write(
      `imagem: ${img.grupo}/${img.slug} ${origWidth}x${origHeight}${crop ? ` recorte ${img.crop}` : ""} -> ${widths.join(", ")}\n`,
    );
  }
}

async function buildHeroVideo() {
  const outDir = resolve(root, "public/media/video");
  mkdirSync(outDir, { recursive: true });
  for (const v of manifest.videos) {
    const input = srcPath(v.src);
    const info = ffprobe(input);
    // Original vertical (1080x1920) de 2,5 s. Recorte central 16:9, escala para 1280x720,
    // loop ida e volta (ping-pong) repetido até passar de 12 s, sem áudio.
    const cropH = Math.round((info.width * 9) / 16);
    const crop = `crop=${info.width}:${cropH}:0:(ih-${cropH})/2`;
    const pingpong = `[0:v]${crop},scale=1280:720:flags=lanczos,setsar=1,split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1:a=0,fps=30[loop]`;
    const loops = Math.max(1, Math.ceil(12 / (info.duration * 2)));
    const mp4 = resolve(outDir, `${v.slug}.mp4`);
    const webm = resolve(outDir, `${v.slug}.webm`);
    const poster = resolve(outDir, `${v.slug}-poster.webp`);
    const filter = `${pingpong};[loop]loop=loop=${loops - 1}:size=32767:start=0[out]`;
    ffmpeg([
      "-i",
      input,
      "-filter_complex",
      filter,
      "-map",
      "[out]",
      "-an",
      "-c:v",
      "libx264",
      "-profile:v",
      "high",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "slow",
      "-crf",
      "20",
      "-movflags",
      "+faststart",
      mp4,
    ]);
    ffmpeg([
      "-i",
      input,
      "-filter_complex",
      filter,
      "-map",
      "[out]",
      "-an",
      "-c:v",
      "libvpx-vp9",
      "-b:v",
      "0",
      "-crf",
      "30",
      "-row-mt",
      "1",
      "-deadline",
      "good",
      "-cpu-used",
      "2",
      webm,
    ]);
    await posterFrom(mp4, poster, 0, 70);
    const out = ffprobe(mp4);
    media.videos[v.slug] = {
      mp4: `/media/video/${v.slug}.mp4`,
      webm: `/media/video/${v.slug}.webm`,
      poster: `/media/video/${v.slug}-poster.webp`,
      width: out.width,
      height: out.height,
      duration: Math.round(out.duration * 10) / 10,
    };
    process.stdout.write(
      `vídeo: ${v.slug} ${out.width}x${out.height} ${out.duration.toFixed(1)} s, mp4 ${kb(mp4)} KB, webm ${kb(webm)} KB, poster ${kb(poster)} KB\n`,
    );
    if (kb(mp4) > 2048 || kb(webm) > 2048) {
      throw new Error(`vídeo ${v.slug} acima de 2 MB`);
    }
  }
}

async function buildAbertura() {
  const outDir = resolve(root, "public/media/video");
  mkdirSync(outDir, { recursive: true });
  const a = manifest.abertura;
  const input = srcPath(a.src);
  const info = ffprobe(input);
  // O desenho da logo termina por volta de 1,4 s e depois segura. Corta em 1,75 s e
  // ajusta a velocidade para fechar exatamente no teto da abertura (1,8 s).
  const cut = 1.75;
  const target = motion.duration.opening / 1000;
  const speed = cut / target;
  const size = 480;
  const base = `trim=0:${cut},setpts=PTS/${speed.toFixed(4)},scale=${size}:-2:flags=lanczos,fps=30`;
  const webm = resolve(outDir, `${a.slug}.webm`);
  const mp4 = resolve(outDir, `${a.slug}.mp4`);
  const poster = resolve(outDir, `${a.slug}-poster.webp`);
  const bege = colors.bege;
  ffmpeg([
    "-i",
    input,
    "-vf",
    `${base},format=yuva420p`,
    "-an",
    "-c:v",
    "libvpx-vp9",
    "-pix_fmt",
    "yuva420p",
    "-b:v",
    "0",
    "-crf",
    "30",
    "-row-mt",
    "1",
    "-deadline",
    "good",
    "-cpu-used",
    "2",
    "-auto-alt-ref",
    "0",
    webm,
  ]);
  ffmpeg([
    "-i",
    input,
    "-filter_complex",
    `color=c=${bege}:s=${size}x${Math.round((size * info.height) / info.width / 2) * 2}:r=30[bg];[0:v]${base}[fg];[bg][fg]overlay=shortest=1:format=auto,format=yuv420p[out]`,
    "-map",
    "[out]",
    "-an",
    "-c:v",
    "libx264",
    "-profile:v",
    "high",
    "-preset",
    "slow",
    "-crf",
    "24",
    "-movflags",
    "+faststart",
    mp4,
  ]);
  // HEVC com alfa (Safari), via VideoToolbox do macOS. Opcional: se o encoder não existir, segue sem.
  const hevc = resolve(outDir, `${a.slug}-alpha.mp4`);
  let hevcOk = false;
  try {
    ffmpeg([
      "-i",
      input,
      "-vf",
      `${base},format=bgra`,
      "-an",
      "-c:v",
      "hevc_videotoolbox",
      "-alpha_quality",
      "0.8",
      "-q:v",
      "60",
      "-tag:v",
      "hvc1",
      "-movflags",
      "+faststart",
      hevc,
    ]);
    hevcOk = true;
  } catch {
    process.stdout.write("abertura: hevc_videotoolbox indisponível, sem versão HEVC com alfa\n");
  }
  await posterFrom(mp4, poster, -0.1, 80);
  const out = ffprobe(mp4);
  media.videos[a.slug] = {
    mp4: `/media/video/${a.slug}.mp4`,
    webm: `/media/video/${a.slug}.webm`,
    ...(hevcOk ? { hevcAlpha: `/media/video/${a.slug}-alpha.mp4` } : {}),
    poster: `/media/video/${a.slug}-poster.webp`,
    width: out.width,
    height: out.height,
    duration: Math.round(out.duration * 100) / 100,
  };
  process.stdout.write(
    `abertura: ${out.width}x${out.height} ${out.duration.toFixed(2)} s, webm ${kb(webm)} KB, mp4 ${kb(mp4)} KB${hevcOk ? `, hevc alfa ${kb(hevc)} KB` : ""}, poster ${kb(poster)} KB\n`,
  );
}

(async () => {
  if (!only || only === "imagens") await buildImages();
  if (!only || only === "video") await buildHeroVideo();
  if (!only || only === "abertura") await buildAbertura();
  if (!only || only === "marca") await buildMarca();
  mkdirSync(resolve(root, "content"), { recursive: true });
  writeFileSync(mediaJsonPath, JSON.stringify(media, null, 2) + "\n");
  process.stdout.write(`media: content/media.json atualizado\n`);
})().catch((err: unknown) => {
  process.stderr.write(`media: ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});
