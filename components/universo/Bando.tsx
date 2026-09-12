/**
 * Bando de pontos em verde sálvia que cruza o topo da tela uma única vez, em 2 segundos
 * (5.15, movimento). Decorativo, sem repetição e desligado com movimento reduzido.
 */
import type { CSSProperties } from "react";

const pontos = [
  { x: 4, y: 22, d: 0, s: 1 },
  { x: 0, y: 34, d: 120, s: 0.8 },
  { x: -6, y: 12, d: 240, s: 1.1 },
  { x: -2, y: 44, d: 320, s: 0.7 },
  { x: -12, y: 28, d: 420, s: 0.9 },
  { x: -9, y: 52, d: 520, s: 0.75 },
  { x: -18, y: 18, d: 640, s: 1 },
  { x: -16, y: 38, d: 760, s: 0.8 },
];

export function Bando() {
  return (
    <div className="bando" aria-hidden="true">
      {pontos.map((p, i) => (
        <span
          key={i}
          className="bando-ponto"
          style={
            {
              "--x": `${p.x}%`,
              "--y": `${p.y}%`,
              "--d": `${p.d}ms`,
              "--s": p.s,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}
