/**
 * Sons da própria espécie por elemento (CLAUDE.md, seção 8, item 3): cantos de ave do
 * xeno-canto e sons de outros animais, republicados no Wikimedia Commons com autor e licença
 * no metadado, creditados no rodapé da página e em docs/registro-audio.md.
 *
 * Gerado por scripts/build-cantos.ts. Não editar à mão.
 */
import cantosJson from "@/content/cantos.json";

export type Canto = {
  /** Nome base do arquivo em public/audio/<andar>/. */
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
