/**
 * Universo Kaluanã: acesso aos 70 elementos, aos cinco andares e à navegação entre eles.
 * Tudo vem de content/*.json (gerado dos YAML). As páginas consomem só estes dados.
 */
import { grupos, qrMap, universoIndex } from "./content";
import type { FloorKey, Grupo, Item, QrEntry } from "./content-schema";
import { floorOrder, floors } from "./tokens";

export type Vizinho = { nome: string; url: string } | null;

export type Elemento = {
  item: Item;
  grupo: FloorKey;
  /** Dados do andar (cor de acento, nome, ordinal). */
  andar: (typeof floors)[FloorKey];
  url: string;
  /** Id da imagem hero no manifesto de mídia, e as de galeria. */
  heroId: string;
  galeriaIds: string[];
  anterior: Vizinho;
  proximo: Vizinho;
  /** Categoria da acomodação daquele quarto, vinda do mapa de QR. */
  qr: QrEntry | undefined;
};

export function elementoUrl(grupo: FloorKey, id: string) {
  return `/universo/${grupo}/${id}`;
}

export function heroId(grupo: FloorKey, id: string) {
  return `universo/${grupo}-${id}`;
}

/** Ids de galeria do elemento, na ordem do YAML (o índice acompanha a posição em imagens). */
export function galeriaIds(grupo: FloorKey, item: Item): string[] {
  const out: string[] = [];
  item.imagens.forEach((im, i) => {
    if (im.uso === "galeria" && im.arquivo) out.push(`universo/${grupo}-${item.id}-${i}`);
  });
  return out;
}

export function getGrupoUniverso(grupo: FloorKey): Grupo {
  return grupos[grupo];
}

/** Todos os elementos de um andar, na ordem do YAML (que segue a numeração das UHs). */
export function itensDoAndar(grupo: FloorKey): Item[] {
  return grupos[grupo].itens;
}

export function getElemento(grupo: FloorKey, id: string): Elemento | undefined {
  const lista = grupos[grupo].itens;
  const i = lista.findIndex((x) => x.id === id);
  if (i < 0) return undefined;
  const item = lista[i];
  const antes = lista[i - 1];
  const depois = lista[i + 1];
  return {
    item,
    grupo,
    andar: floors[grupo],
    url: elementoUrl(grupo, item.id),
    heroId: heroId(grupo, item.id),
    galeriaIds: galeriaIds(grupo, item),
    anterior: antes ? { nome: antes.nome, url: elementoUrl(grupo, antes.id) } : null,
    proximo: depois ? { nome: depois.nome, url: elementoUrl(grupo, depois.id) } : null,
    qr: qrMap[item.uh],
  };
}

/** Todos os pares (grupo, id) para generateStaticParams. */
export function todosOsElementos(): { grupo: FloorKey; id: string }[] {
  return floorOrder.flatMap((g) => grupos[g].itens.map((it) => ({ grupo: g, id: it.id })));
}

export function isFloorKey(v: string): v is FloorKey {
  return (floorOrder as string[]).includes(v);
}

/** Próximo quarto na sequência de UHs, para a barra de hóspede. */
export function proximoQuarto(uh: string): QrEntry | undefined {
  const uhs = Object.keys(qrMap).sort();
  const i = uhs.indexOf(uh);
  if (i < 0) return undefined;
  return qrMap[uhs[(i + 1) % uhs.length]];
}

export { universoIndex };
