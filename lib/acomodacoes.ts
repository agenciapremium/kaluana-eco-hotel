/**
 * Acomodações: as sete categorias de quarto (5.3 a 5.10) e a ligação de cada UH
 * com a página do Universo. Tudo vem de content/paginas.json e content/qr-map.json.
 *
 * As tags de perfil (chegou cansado, precisa produzir, precisa parar) não estão
 * listadas no documento mestre, que só diz que cada categoria recebe uma ou mais.
 * Foram derivadas das seções "Perfis" e "Público" de cada página e registradas em
 * docs/decisoes.md para validação com o cliente.
 */
import { qrMap } from "./content";
import type { Pagina, QrEntry } from "./content-schema";
import paginasJson from "@/content/paginas.json";
import { type Perfil } from "./perfis";
import { floorOrder, floors, type FloorKey } from "./tokens";

export { perfilFrase, perfilLabel, perfis, type Perfil } from "./perfis";

type CategoriaFixa = {
  id: string;
  perfis: Perfil[];
  /** Tipo de cama para o schema HotelRoom, só quando a copy da ficha o diz. */
  cama: string | null;
  /** Suíte ou quarto, para o schema. */
  suite: boolean;
  /**
   * Detalhes abstratos gerados no Higgsfield (ids do manifesto), nunca ambientes do hotel.
   * O primeiro é o hero (escolha provisória até o responsável aprovar a variação final);
   * os demais entram na faixa de detalhes. Ver docs/registro-higgsfield.md.
   */
  galeria: string[];
};

/** Ordem de exibição no hub, igual à do documento mestre. */
const fixas: CategoriaFixa[] = [
  {
    id: "superior-familia",
    perfis: ["chegou-cansado", "precisa-produzir"],
    cama: null,
    suite: false,
    galeria: [
      "acomodacoes/superior-familia-1",
      "acomodacoes/superior-familia-2",
      "acomodacoes/superior-familia-3",
      "acomodacoes/superior-familia-4",
    ],
  },
  {
    id: "duplo-king",
    perfis: ["chegou-cansado", "precisa-produzir"],
    cama: "King",
    suite: false,
    galeria: [
      "acomodacoes/duplo-king-1",
      "acomodacoes/duplo-king-2",
      "acomodacoes/duplo-king-3",
      "acomodacoes/duplo-king-4",
    ],
  },
  {
    id: "superior-acessivel",
    perfis: ["chegou-cansado", "precisa-produzir"],
    cama: null,
    suite: false,
    galeria: [
      "acomodacoes/superior-acessivel-1",
      "acomodacoes/superior-acessivel-2",
      "acomodacoes/superior-acessivel-4",
      "acomodacoes/superior-acessivel-3",
    ],
  },
  {
    id: "superior-familia-com-terraco",
    perfis: ["precisa-parar", "precisa-produzir"],
    cama: null,
    suite: false,
    galeria: [
      "acomodacoes/superior-familia-com-terraco-1",
      "acomodacoes/superior-familia-com-terraco-2",
      "acomodacoes/superior-familia-com-terraco-3",
      "acomodacoes/superior-familia-com-terraco-4",
    ],
  },
  {
    id: "suite-terraco-lateral-aberto",
    perfis: ["precisa-parar"],
    cama: "King",
    suite: true,
    galeria: [
      "acomodacoes/suite-terraco-lateral-aberto-1",
      "acomodacoes/suite-terraco-lateral-aberto-2",
      "acomodacoes/suite-terraco-lateral-aberto-3",
    ],
  },
  {
    id: "suite-terraco-lateral-fechado",
    perfis: ["precisa-parar", "precisa-produzir"],
    cama: "King",
    suite: true,
    galeria: [
      "acomodacoes/suite-terraco-lateral-fechado-1",
      "acomodacoes/suite-terraco-lateral-fechado-2",
      "acomodacoes/suite-terraco-lateral-fechado-3",
      "acomodacoes/suite-terraco-lateral-fechado-4",
    ],
  },
  {
    id: "suite-presidencial-onca-pintada",
    perfis: ["precisa-parar"],
    cama: "King",
    suite: true,
    galeria: [
      "acomodacoes/suite-presidencial-onca-pintada-1",
      "acomodacoes/suite-presidencial-onca-pintada-2",
      "acomodacoes/suite-presidencial-onca-pintada-3",
    ],
  },
];

export type UhNome = QrEntry & { floor: FloorKey };

export type Categoria = CategoriaFixa & {
  pagina: Pagina;
  /** Imagem do hero: a primeira da galeria. */
  imagem: string;
  slug: string;
  url: string;
  codigo: string;
  capacidade: number;
  /** Nome curto para cards e migalhas (H1 do bloco de SEO). */
  nome: string;
  /** Quantidade de UHs. Só para uso interno: o número não aparece antes da inauguração. */
  uhs: UhNome[];
  /** UHs agrupadas por andar, na ordem dos andares. */
  porAndar: { floor: FloorKey; nome: string; ordinal: string; accent: string; uhs: UhNome[] }[];
};

const paginas = paginasJson as unknown as Record<string, Pagina>;

function montar(fixa: CategoriaFixa): Categoria {
  const pagina = paginas[fixa.id];
  if (!pagina) throw new Error(`Categoria "${fixa.id}" não existe em content/paginas.json`);
  if (!pagina.codigo || !pagina.capacidade) {
    throw new Error(`Categoria "${fixa.id}" sem código ou capacidade no YAML`);
  }
  const uhs: UhNome[] = (pagina.uhs ?? []).map((uh) => {
    const entry = qrMap[uh];
    if (!entry) throw new Error(`UH ${uh} da categoria "${fixa.id}" não existe no qr-map`);
    return { ...entry, floor: entry.grupo };
  });
  const porAndar = floorOrder
    .map((floor) => ({
      floor,
      nome: floors[floor].nome,
      ordinal: floors[floor].ordinal,
      accent: floors[floor].accent,
      uhs: uhs.filter((u) => u.floor === floor),
    }))
    .filter((g) => g.uhs.length > 0);
  return {
    ...fixa,
    pagina,
    imagem: fixa.galeria[0],
    slug: fixa.id,
    url: pagina.url,
    codigo: pagina.codigo,
    capacidade: pagina.capacidade,
    nome: pagina.seo.h1,
    uhs,
    porAndar,
  };
}

export const categorias: Categoria[] = fixas.map(montar);

export function getCategoria(slug: string): Categoria | undefined {
  return categorias.find((c) => c.slug === slug);
}

/** Página do hub (5.3). */
export function getAcomodacoesHub(): Pagina {
  const p = paginas["acomodacoes"];
  if (!p) throw new Error('Página "acomodacoes" não existe em content/paginas.json');
  return p;
}

/**
 * Ficha do quarto: a copy é uma sequência de frases curtas ("Até 3 pessoas. ⟨metragem⟩ m². ...").
 * Cada frase vira um item de lista. Itens com campo pendente aparecem em desenvolvimento
 * (com o placeholder) e somem em produção, a não ser que sobre texto útil depois de
 * remover o campo ("Banheiro privativo com ⟨amenidades⟩" vira "Banheiro privativo").
 */
export function splitFicha(texto: string): string[] {
  return texto
    .replace(/\s+/g, " ")
    .split(/(?<=\.)\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}
