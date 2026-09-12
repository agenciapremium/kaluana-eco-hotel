/**
 * Cantos de ave por elemento (CLAUDE.md, seção 8, item 3). Cada gravação vem do
 * xeno-canto, republicada no Wikimedia Commons com autor e licença no metadado, e é
 * creditada no rodapé da página e em docs/registro-audio.md.
 *
 * Gerado por scripts/build-cantos.ts. Não editar à mão.
 */
import cantosJson from "@/content/cantos.json";

export type Canto = {
  /** Nome base do arquivo em public/audio/aves/. */
  arquivo: string;
  autor: string;
  licenca: string;
  licencaUrl: string;
  fonte: string;
  especie: string;
};

const cantos = cantosJson as unknown as Record<string, Canto>;

export function cantoDe(elementoId: string): Canto | undefined {
  return cantos[elementoId];
}

export const todosOsCantos = cantos;
