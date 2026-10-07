/**
 * Ajustes sobre a copy dos YAML do documento mestre (CLAUDE.md, seções 2 e 3).
 *
 * `DOCS/` é somente leitura, então toda correção de texto fica aqui, explícita e revisável, e é
 * aplicada na geração de `content/`. Dois motivos trazem uma frase para esta lista: um veto da
 * marca que o próprio documento mestre fere, ou uma decisão do responsável tomada depois da
 * escrita do documento. Se a frase original sumir dos YAML (o cliente mudou o texto), a geração
 * para com erro, para o ajuste não virar lixo silencioso.
 *
 * TODO(copy): cada troca abaixo precisa da revisão do responsável e está na lista de
 * pendências do cliente (docs/etapas.md, etapa 6).
 */
import type { FloorKey, Grupo, Pagina } from "../lib/content-schema";

type AjusteDeElemento = {
  grupo: FloorKey;
  id: string;
  campo: "no_kaluana";
  motivo: string;
  de: string;
  para: string;
};

/** Caminho do campo dentro da página: "seo.title", "secoes[0].titulo", "faq[1].r". */
type AjusteDePagina = {
  pagina: string;
  campo: string;
  motivo: string;
  de: string;
  para: string;
};

const ELEMENTOS: AjusteDeElemento[] = [
  {
    grupo: "arvores",
    id: "copaiba",
    campo: "no_kaluana",
    motivo: "veto 1: sustentabilidade só aparece como fato datado",
    de: "Ela está neste andar por mostrar o que sustentabilidade quer dizer na prática: usar sem destruir.",
    para: "Ela está neste andar por mostrar, na prática, que dá para usar sem destruir.",
  },
];

/**
 * Data de inauguração: em 07/10/2026 o responsável da Premium pediu que o site não anunciasse
 * data, porque dezembro de 2026 não está confirmado (decisão 121). As trocas abaixo tiram a data
 * da Home da fase `pre` e da resposta da pergunta "Quando o Kaluanã Eco Hotel abre?", que a Home
 * mostra e declara no FAQPage. A copy da fase completa continua citando dezembro de 2026 nos
 * YAML e espera a revisão do cliente; o `dataDeAberturaConfirmada` em `lib/site.ts` cuida do
 * JSON-LD, do llms.txt e das páginas legais.
 */
const PAGINAS: AjusteDePagina[] = [
  {
    pagina: "pre-inauguracao",
    campo: "seo.title",
    motivo: "data não confirmada",
    de: "Kaluanã Eco Hotel | Abre em dezembro de 2026 em Ji-Paraná",
    para: "Kaluanã Eco Hotel | Um hotel novo em Ji-Paraná",
  },
  {
    pagina: "pre-inauguracao",
    campo: "seo.description",
    motivo: "data não confirmada",
    de: "O Kaluanã Eco Hotel abre em dezembro de 2026 em Ji-Paraná, Rondônia.",
    para: "O Kaluanã Eco Hotel está sendo construído em Ji-Paraná, Rondônia.",
  },
  {
    pagina: "pre-inauguracao",
    campo: "seo.h1",
    motivo: "data não confirmada",
    de: "Um hotel novo em Ji-Paraná. Abre em dezembro de 2026.",
    para: "Um hotel novo em Ji-Paraná.",
  },
  {
    pagina: "pre-inauguracao",
    campo: "seo.resposta",
    motivo: "data não confirmada",
    de: "em Ji-Paraná, Rondônia, com inauguração prevista para dezembro de 2026.",
    para: "em Ji-Paraná, Rondônia.",
  },
  {
    pagina: "pre-inauguracao",
    campo: "secoes[0].titulo",
    motivo: "data não confirmada",
    de: "Um hotel novo em Ji-Paraná. Abre em dezembro de 2026.",
    para: "Um hotel novo em Ji-Paraná.",
  },
  {
    pagina: "perguntas-frequentes",
    campo: "faq[1].r",
    motivo: "data não confirmada",
    de: "A inauguração está prevista para dezembro de 2026.",
    para: "A data ainda não está confirmada. Deixe seu e-mail no site e avisamos você quando as reservas abrirem.",
  },
  {
    pagina: "home",
    campo: "seo.resposta",
    motivo: "data não confirmada",
    de: " Inauguração prevista para dezembro de 2026.",
    para: "",
  },
  {
    pagina: "home",
    campo: "secoes[0].texto",
    motivo: "data não confirmada",
    de: " Abre em dezembro de 2026.",
    para: "",
  },
  {
    pagina: "home",
    campo: "secoes[8].texto",
    motivo: "data não confirmada",
    de: "Reservas abertas para dezembro de 2026.",
    para: "Reservas abertas.",
  },
  {
    pagina: "o-kaluana",
    campo: "seo.resposta",
    motivo: "data não confirmada",
    de: ", com inauguração prevista para dezembro de 2026, restaurante",
    para: ", com restaurante",
  },
  {
    pagina: "o-kaluana",
    campo: "secoes[0].texto",
    motivo: "data não confirmada",
    de: " Abre em dezembro de 2026.",
    para: "",
  },
  {
    pagina: "o-kaluana",
    campo: "secoes[7].texto",
    motivo: "data não confirmada",
    de: "Reservas abertas para dezembro de 2026.",
    para: "Reservas abertas.",
  },
  {
    pagina: "trabalhe-conosco",
    campo: "seo.description",
    motivo: "data não confirmada",
    de: "O Kaluanã Eco Hotel abre em Ji-Paraná em dezembro de 2026 e está montando a equipe.",
    para: "O Kaluanã Eco Hotel abre em Ji-Paraná e está montando a equipe.",
  },
  {
    pagina: "trabalhe-conosco",
    campo: "seo.resposta",
    motivo: "data não confirmada",
    de: "para a inauguração em Ji-Paraná, em dezembro de 2026, nas áreas",
    para: "para a inauguração em Ji-Paraná, nas áreas",
  },
  {
    pagina: "trabalhe-conosco",
    campo: "secoes[0].texto",
    motivo: "data não confirmada",
    de: "O Kaluanã abre em dezembro de 2026 e está montando a equipe.",
    para: "O Kaluanã está montando a equipe.",
  },
];

function partes(campo: string) {
  return campo.split(/\.|\[|\]/).filter(Boolean);
}

function descer(raiz: Pagina, caminho: string[]): unknown {
  let atual: unknown = raiz;
  for (const parte of caminho) {
    if (Array.isArray(atual)) atual = atual[Number(parte)];
    else if (atual && typeof atual === "object") atual = (atual as Record<string, unknown>)[parte];
    else return undefined;
  }
  return atual;
}

function ler(pagina: Pagina, campo: string): string | undefined {
  const valor = descer(pagina, partes(campo));
  return typeof valor === "string" ? valor : undefined;
}

function gravar(pagina: Pagina, campo: string, valor: string) {
  const caminho = partes(campo);
  const chave = caminho[caminho.length - 1];
  const pai = descer(pagina, caminho.slice(0, -1));
  if (Array.isArray(pai)) pai[Number(chave)] = valor;
  else if (pai && typeof pai === "object") (pai as Record<string, unknown>)[chave] = valor;
}

export function aplicarAjustesDeVeto(grupo: FloorKey, dados: Grupo) {
  for (const a of ELEMENTOS.filter((x) => x.grupo === grupo)) {
    const item = dados.itens.find((i) => i.id === a.id);
    if (!item || !item[a.campo].includes(a.de)) {
      throw new Error(
        `ajustes-de-copy: trecho não encontrado em ${a.grupo}/${a.id}.${a.campo}; revise scripts/ajustes-de-copy.ts`,
      );
    }
    item[a.campo] = item[a.campo].replace(a.de, a.para);
  }
}

export function aplicarAjustesDePagina(pagina: Pagina) {
  for (const a of PAGINAS.filter((x) => x.pagina === pagina.id)) {
    const atual = ler(pagina, a.campo);
    if (atual === undefined || !atual.includes(a.de)) {
      throw new Error(
        `ajustes-de-copy: trecho não encontrado em ${a.pagina}.${a.campo}; revise scripts/ajustes-de-copy.ts`,
      );
    }
    gravar(pagina, a.campo, atual.replace(a.de, a.para));
  }
}

/** Um ajuste que aponta para página inexistente é erro de manutenção, e não ajuste a aplicar. */
export function conferirAjustesDePagina(ids: Set<string>) {
  const perdidos = [...new Set(PAGINAS.map((a) => a.pagina))].filter((id) => !ids.has(id));
  if (perdidos.length) {
    throw new Error(
      `ajustes-de-copy: página não encontrada nos YAML: ${perdidos.join(", ")}; revise scripts/ajustes-de-copy.ts`,
    );
  }
}
