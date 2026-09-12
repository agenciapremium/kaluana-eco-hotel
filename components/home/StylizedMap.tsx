import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";

/**
 * Mapa esquemático de Rondônia em verde sálvia, sem escala: a BR-364, o rio Machado,
 * o rio Madeira e o ponto do hotel em Ji-Paraná. As linhas se desenham ao entrar na tela.
 * Sem foto aérea do terreno até a inauguração (5.1).
 */
export function StylizedMap({ className }: { className?: string }) {
  const draw = (i: number) => ({ "--i": i }) as CSSProperties;
  return (
    <Reveal as="figure" variant="draw" className={className}>
      <svg
        viewBox="0 0 600 420"
        className="stylized-map"
        role="img"
        aria-labelledby="mapa-titulo mapa-desc"
      >
        <title id="mapa-titulo">Mapa esquemático de Rondônia</title>
        <desc id="mapa-desc">
          A BR-364 cruza o estado de Porto Velho a Vilhena. O rio Machado corta Ji-Paraná e segue ao
          norte até o rio Madeira. O Kaluanã fica em Ji-Paraná, no centro do estado.
        </desc>
        {/* Rio Madeira */}
        <path
          className="draw-path draw-only map-river"
          pathLength={1}
          style={draw(0)}
          d="M18 118 C 60 96, 90 70, 130 62 S 220 40, 262 36 S 330 22, 372 14"
        />
        {/* Rio Machado */}
        <path
          className="draw-path draw-only map-river"
          pathLength={1}
          style={draw(1)}
          d="M486 402 C 470 372, 440 352, 414 318 S 372 268, 344 246 S 322 200, 330 168 S 318 112, 306 78 S 290 46, 272 36"
        />
        {/* BR-364 */}
        <path
          className="draw-path draw-only map-road"
          pathLength={1}
          style={draw(2)}
          d="M58 64 L 196 150 L 330 236 L 404 286 L 548 372"
        />
        {/* Cidades */}
        {[
          { x: 58, y: 64, label: "Porto Velho", dx: 10, dy: -8 },
          { x: 196, y: 150, label: "Ariquemes", dx: 10, dy: -8 },
          { x: 404, y: 286, label: "Cacoal", dx: 12, dy: 4 },
          { x: 548, y: 372, label: "Vilhena", dx: -60, dy: 24 },
        ].map((c) => (
          <g key={c.label} className="map-city">
            <circle cx={c.x} cy={c.y} r={4} />
            <text x={c.x + c.dx} y={c.y + c.dy}>
              {c.label}
            </text>
          </g>
        ))}
        {/* Hotel em Ji-Paraná */}
        <g className="map-hotel">
          <circle cx={330} cy={236} r={13} className="map-hotel-ring" />
          <circle cx={330} cy={236} r={6} />
          <text x={348} y={230} className="map-hotel-label">
            Kaluanã
          </text>
          <text x={348} y={250}>
            Ji-Paraná
          </text>
        </g>
        {/* Rótulos das linhas */}
        <text x={120} y={92} className="map-label-river">
          rio Madeira
        </text>
        <text x={410} y={344} className="map-label-river">
          rio Machado
        </text>
        <text x={244} y={214} className="map-label-road">
          BR-364
        </text>
      </svg>
      <figcaption className="text-cafe/70 mt-3 text-sm">Mapa esquemático, sem escala.</figcaption>
    </Reveal>
  );
}
