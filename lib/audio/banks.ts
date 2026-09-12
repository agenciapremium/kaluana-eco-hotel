/**
 * Bancos de loops por andar (CLAUDE.md, seção 8). Cada entrada é o nome base do arquivo
 * em public/audio/<andar>/, disponível em .webm (Opus) e .m4a (AAC).
 *
 * Etapa 1: um loop de exemplo por andar, sintetizado (ver docs/registro-audio.md).
 * Etapa 3: 4 a 6 loops reais por andar.
 */
import type { FloorKey } from "@/lib/content-schema";

export const audioBanks: Record<FloorKey, string[]> = {
  rios: ["exemplo-1"],
  peixes: ["exemplo-1"],
  arvores: ["exemplo-1"],
  aves: ["exemplo-1"],
  guardioes: ["exemplo-1"],
};

export function audioUrl(andar: FloorKey, loop: string, ext: "webm" | "m4a") {
  return `/audio/${andar}/${loop}.${ext}`;
}
