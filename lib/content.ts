/**
 * Carregadores do conteúdo processado em content/ (gerado por scripts/build-content.ts).
 * As páginas consomem só estes JSON, nunca os YAML.
 */
import type { FloorKey, Grupo, Pagina, QrMap, Secao, UniversoIndexEntry } from "./content-schema";
import paginasJson from "@/content/paginas.json";
import riosJson from "@/content/rios.json";
import peixesJson from "@/content/peixes.json";
import arvoresJson from "@/content/arvores.json";
import avesJson from "@/content/aves.json";
import guardioesJson from "@/content/guardioes.json";
import qrMapJson from "@/content/qr-map.json";
import universoIndexJson from "@/content/universo-index.json";

const paginas = paginasJson as unknown as Record<string, Pagina>;

export const grupos: Record<FloorKey, Grupo> = {
  rios: riosJson as unknown as Grupo,
  peixes: peixesJson as unknown as Grupo,
  arvores: arvoresJson as unknown as Grupo,
  aves: avesJson as unknown as Grupo,
  guardioes: guardioesJson as unknown as Grupo,
};

export const qrMap = qrMapJson as unknown as QrMap;
export const universoIndex = universoIndexJson as unknown as UniversoIndexEntry[];

export function getPagina(id: string): Pagina {
  const p = paginas[id];
  if (!p) throw new Error(`Página "${id}" não existe em content/paginas.json`);
  return p;
}

export function getSecao(pagina: Pagina, nome: string): Secao {
  const s = pagina.secoes.find((x) => x.nome === nome);
  if (!s) throw new Error(`Seção "${nome}" não existe na página "${pagina.id}"`);
  return s;
}

export function getGrupo(key: FloorKey): Grupo {
  return grupos[key];
}
