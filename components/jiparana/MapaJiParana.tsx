import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { PontosAtivos } from "./PontosAtivos";

/**
 * Mapa estilizado de Ji-Paraná (5.20): o rio Machado em traço que se desenha, a BR-364, o
 * hotel e o aeroporto. Esquemático, sem escala e sem coordenadas: as do hotel são campo
 * pendente com o cliente.
 *
 * Os pontos acendem conforme a rolagem passa pelo bloco correspondente (PontosAtivos).
 */
type Ponto = { id: string; nome: string; x: number; y: number; secao: string; destaque?: boolean };

const pontos: Ponto[] = [
  { id: "hotel", nome: "Kaluanã", x: 386, y: 250, secao: "onde-estamos", destaque: true },
  { id: "aeroporto", nome: "Aeroporto José Coleto", x: 132, y: 128, secao: "como-chegar" },
  { id: "centro", nome: "Centro", x: 286, y: 196, secao: "o-que-fazer" },
  { id: "orla", nome: "Orla do rio", x: 312, y: 300, secao: "o-rio" },
];

export function MapaJiParana({ className }: { className?: string }) {
  const draw = (i: number) => ({ "--i": i }) as CSSProperties;
  return (
    <Reveal
      as="figure"
      variant="draw"
      className={["mapa-cidade", className].filter(Boolean).join(" ")}
    >
      <PontosAtivos />
      <svg
        viewBox="0 0 560 420"
        className="stylized-map"
        role="img"
        aria-labelledby="mapa-jp-titulo mapa-jp-desc"
      >
        <title id="mapa-jp-titulo">Mapa esquemático de Ji-Paraná</title>
        <desc id="mapa-jp-desc">
          O rio Machado corta a cidade de sul a norte e separa os dois distritos. A BR-364 atravessa
          a cidade. O Kaluanã fica no acesso à cidade e o aeroporto José Coleto a noroeste. Desenho
          sem escala.
        </desc>
        {/* Rio Machado, de sul para norte */}
        <path
          className="draw-path draw-only map-river"
          pathLength={1}
          style={draw(0)}
          d="M330 412 C 322 366, 300 336, 300 296 S 316 236, 300 196 S 262 132, 258 78 S 250 40, 244 12"
        />
        {/* BR-364 */}
        <path
          className="draw-path draw-only map-road"
          pathLength={1}
          style={draw(1)}
          d="M40 96 L 180 168 L 300 232 L 420 288 L 530 342"
        />
        {/* Malha viária esquemática dos dois distritos */}
        <path
          className="draw-path draw-only map-road map-road-fina"
          pathLength={1}
          style={draw(2)}
          d="M214 214 L 300 196 M 300 196 L 366 176 M 268 268 L 312 300 M 312 300 L 386 250"
        />
        <text x="196" y="130" className="map-label-river">
          1º distrito
        </text>
        <text x="352" y="356" className="map-label-river">
          2º distrito
        </text>
        <text x="60" y="86" className="map-label-road">
          BR-364
        </text>
        <text x="272" y="404" className="map-label-river">
          rio Machado
        </text>
        {pontos.map((p) => (
          <g key={p.id} className="map-ponto" data-ponto={p.secao}>
            <circle className="map-ponto-halo" cx={p.x} cy={p.y} r="16" />
            <circle className="map-ponto-nucleo" cx={p.x} cy={p.y} r={p.destaque ? 8 : 6} />
            <text
              x={p.x + 14}
              y={p.y - 10}
              className={p.destaque ? "map-hotel-label" : "map-ponto-nome"}
            >
              {p.nome}
            </text>
          </g>
        ))}
      </svg>
    </Reveal>
  );
}
