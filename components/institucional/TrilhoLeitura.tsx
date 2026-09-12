/**
 * Traço vertical em verde sálvia que acompanha a rolagem, marcando o progresso da leitura
 * (5.2, movimento; a Parte 5.22 pede o mesmo no topo dos posts, na horizontal).
 *
 * Usa animação nativa de rolagem em CSS (`animation-timeline: scroll()`), sem JavaScript.
 * Navegadores sem suporte, ou com movimento reduzido, mostram o traço parado e discreto.
 */
export function TrilhoLeitura({ orientacao = "vertical" }: { orientacao?: "vertical" | "topo" }) {
  return (
    <div className={orientacao === "topo" ? "progresso-topo" : "trilho-leitura"} aria-hidden="true">
      <span className={orientacao === "topo" ? "progresso-topo-barra" : "trilho-leitura-barra"} />
    </div>
  );
}
