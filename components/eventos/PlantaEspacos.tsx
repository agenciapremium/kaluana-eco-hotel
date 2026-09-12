import { Reveal } from "@/components/motion/Reveal";

/**
 * Planta esquemática dos espaços (5.19, movimento). Sem escala e sem dimensões reais, como
 * a nota do documento mestre exige: as capacidades e as áreas são campos pendentes com o
 * cliente e não podem ser sugeridas nem por desenho. Cada espaço acende ao passar o mouse.
 *
 * O traço se desenha ao entrar na tela. Decorativa, com legenda em texto ao lado.
 */
const espacos = [
  { id: "auditorio", nome: "Auditório", d: "M 40 40 H 300 V 210 H 40 Z", rotulo: [170, 132] },
  {
    id: "convencoes",
    nome: "Centro de convenções",
    d: "M 320 40 H 660 V 210 H 320 Z",
    rotulo: [490, 122],
  },
  { id: "divisoria-1", nome: "", d: "M 433 40 V 210", rotulo: null },
  { id: "divisoria-2", nome: "", d: "M 546 40 V 210", rotulo: null },
  { id: "foyer", nome: "Foyer", d: "M 40 230 H 660 V 310 H 40 Z", rotulo: [350, 278] },
] as const;

export function PlantaEspacos() {
  return (
    <Reveal variant="draw" className="planta" amount={0.2}>
      <svg
        className="planta-svg"
        viewBox="0 0 700 350"
        role="img"
        aria-label="Planta esquemática dos espaços de evento: auditório, centro de convenções divisível e foyer. Sem escala."
      >
        {espacos.map((e, i) => (
          <g key={e.id} className="planta-espaco" data-espaco={e.id}>
            <path
              className="draw-path draw-only planta-traco"
              d={e.d}
              pathLength={1}
              style={{ ["--i" as string]: i }}
            />
            {e.rotulo ? (
              <text x={e.rotulo[0]} y={e.rotulo[1]} className="planta-rotulo" textAnchor="middle">
                {e.nome}
              </text>
            ) : null}
          </g>
        ))}
        <text x="490" y="152" className="planta-nota" textAnchor="middle">
          divisível em salas
        </text>
      </svg>
      <p className="planta-legenda">Desenho esquemático, sem escala e sem dimensões reais.</p>
    </Reveal>
  );
}
