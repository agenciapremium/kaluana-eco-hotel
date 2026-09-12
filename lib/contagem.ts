/**
 * Contagens e números de quarto na fase de pré-inauguração.
 *
 * A Parte 3.5 coloca o Universo Kaluanã completo na fase 0, mas "sem números de quarto e
 * sem contagens"; a nota da 5.11 repete que catorze, dezoito e dezessete só entram depois.
 * Na inauguração (fase `full`) os números entram e a copy do documento mestre vale como está.
 *
 * O mapa abaixo é explícito, e não uma expressão regular, para que toda troca de copy fique
 * visível e revisável. Cada variante foi escrita no padrão do documento mestre.
 * TODO(copy): variantes de pré-inauguração a revisar com o responsável.
 */
import { phase } from "./site";

const semNumero: Record<string, string> = {
  // Respostas diretas (AEO) dos hubs de andar
  "de catorze rios:": "dos rios:",
  "de dezoito peixes:": "dos peixes:",
  "de dezoito árvores:": "das árvores:",
  "de dezessete aves:": "das aves:",
  // Texto dos blocos de andar no hub do Universo (5.11)
  "Catorze rios que explicam": "Rios que explicam",
  "Dezoito peixes que vivem": "Peixes que vivem",
  "Dezoito árvores que dão": "Árvores que dão",
  "Dezessete aves que voam": "Aves que voam",
  // Títulos dos heroes dos hubs de andar (5.12 a 5.15)
  "Catorze rios. Uma bacia.": "Rios da Amazônia. Uma bacia.",
  "Dezoito peixes. Um deles dá choque.": "Peixes da Amazônia. Um deles dá choque.",
  "Dezoito árvores. Muitas delas estão no que você toca.":
    "Árvores da Amazônia. Muitas delas estão no que você toca.",
  "Dezessete aves. O andar mais perto do céu.": "Aves da Amazônia. O andar mais perto do céu.",
  // Blocos de SEO
  "Os 14 rios dos quartos": "Os rios dos quartos",
  "Os 18 peixes dos quartos": "Os peixes dos quartos",
  "As 18 árvores dos quartos": "As árvores dos quartos",
  "As 17 aves dos quartos": "As aves dos quartos",
  "Os dezoito peixes da Amazônia": "Os peixes da Amazônia",
};

/** Aplica as variantes de pré-inauguração. Na fase completa, devolve o texto original. */
export function semContagem(texto: string): string {
  if (phase === "full") return texto;
  let saida = texto;
  for (const [de, para] of Object.entries(semNumero)) {
    if (saida.includes(de)) saida = saida.split(de).join(para);
  }
  return saida;
}

/** Kickers com faixa de quartos ("Quartos 101 a 114") não existem antes da inauguração. */
export function kickerDeQuartos(kicker: string | null | undefined): string | null {
  if (!kicker) return null;
  if (phase === "full") return kicker;
  return /quartos?\s*\d/i.test(kicker) ? null : kicker;
}

/** "Andar dos Rios · Quarto 112" na fase completa; só o andar antes da inauguração. */
export function kickerDoElemento(nomeDoAndar: string, uh: string): string {
  return phase === "full" ? `${nomeDoAndar} · Quarto ${uh}` : nomeDoAndar;
}

/** Mostra o número do quarto (cards dos hubs, barra de hóspede) só na fase completa. */
export const mostraNumeroDeQuarto = phase === "full";
