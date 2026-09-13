/**
 * Ajustes de veto sobre a copy dos YAML do documento mestre (CLAUDE.md, seção 3).
 *
 * Os vetos da marca valem sobre qualquer texto, inclusive o do próprio documento mestre.
 * Quando uma frase dos dados fere um veto, a troca fica aqui, explícita e revisável, e é
 * aplicada na geração de content/. Se a frase original sumir dos YAML (o cliente mudou o
 * texto), a geração para com erro, para o ajuste não virar lixo silencioso.
 *
 * TODO(copy): cada troca abaixo precisa da revisão do responsável e está na lista de
 * pendências do cliente (docs/etapas.md, etapa 6).
 */
import type { FloorKey, Grupo } from "../lib/content-schema";

type Ajuste = {
  grupo: FloorKey;
  id: string;
  campo: "no_kaluana";
  veto: string;
  de: string;
  para: string;
};

const AJUSTES: Ajuste[] = [
  {
    grupo: "arvores",
    id: "copaiba",
    campo: "no_kaluana",
    veto: "1: sustentabilidade só aparece como fato datado",
    de: "Ela está neste andar por mostrar o que sustentabilidade quer dizer na prática: usar sem destruir.",
    para: "Ela está neste andar por mostrar, na prática, que dá para usar sem destruir.",
  },
];

export function aplicarAjustesDeVeto(grupo: FloorKey, dados: Grupo) {
  for (const a of AJUSTES.filter((x) => x.grupo === grupo)) {
    const item = dados.itens.find((i) => i.id === a.id);
    if (!item || !item[a.campo].includes(a.de)) {
      throw new Error(
        `ajustes-de-veto: trecho não encontrado em ${a.grupo}/${a.id}.${a.campo}; revise scripts/ajustes-de-veto.ts`,
      );
    }
    item[a.campo] = item[a.campo].replace(a.de, a.para);
  }
}
