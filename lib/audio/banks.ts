/**
 * Bancos de loops por andar (CLAUDE.md, seção 8). Cada entrada é o nome base do arquivo
 * em public/audio/<andar>/, disponível em .webm (Opus) e .m4a (AAC), 45 s, mono, 48 kbps.
 *
 * As cenas são as da seção 8. Os arquivos são gerados por scripts/build-audio.ts e
 * continuam sintetizados até chegarem as gravações de campo da Premium em Rondônia
 * (docs/registro-audio.md). Os cantos de ave, esses reais, entram como loop extra na
 * página da espécie (lib/audio/cantos.ts).
 */
import type { FloorKey } from "@/lib/content-schema";

export const audioBanks: Record<FloorKey, string[]> = {
  rios: ["correnteza", "margem-insetos", "chuva-no-rio", "barco-ao-longe"],
  peixes: ["agua-sob-a-superficie", "bolhas", "remo", "chuva-na-agua"],
  arvores: ["folhas-ao-vento", "cigarras", "mata-ao-amanhecer", "chuva-leve-na-copa"],
  aves: ["mata-com-cantos", "amanhecer", "entardecer", "vento-alto"],
  guardioes: ["noite-na-floresta", "grilos", "agua-parada"],
};

export function audioUrl(andar: FloorKey, loop: string, ext: "webm" | "m4a") {
  return `/audio/${andar}/${loop}.${ext}`;
}
