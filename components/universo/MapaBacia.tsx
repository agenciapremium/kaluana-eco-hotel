import { Reveal } from "@/components/motion/Reveal";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { elementoUrl } from "@/lib/universo";
import { DestaqueRio } from "./DestaqueRio";

/**
 * Mapa esquemático da bacia em linhas finas (5.12, movimento). Cada rio é um traço que se
 * desenha ao entrar na tela; ao passar o mouse o traço engrossa e o card correspondente se
 * destaca (DestaqueRio faz a ligação entre os dois).
 *
 * O desenho é esquemático, não cartográfico: mostra como os rios deste andar se ligam,
 * com o Machado, o rio de Ji-Paraná, chegando ao Madeira e o Madeira ao Amazonas.
 */
type Traco = {
  id: string;
  nome: string;
  d: string;
  label: [number, number];
  anchor?: "start" | "middle" | "end";
};

const tracos: Traco[] = [
  // Tronco: Solimões a oeste, Amazonas a leste do encontro com o Negro.
  { id: "rio-solimoes", nome: "Solimões", d: "M 40 250 L 300 250 L 470 250", label: [150, 232] },
  { id: "rio-amazonas", nome: "Amazonas", d: "M 470 250 L 700 250 L 950 250", label: [700, 232] },
  // Norte
  { id: "rio-negro", nome: "Negro", d: "M 400 60 L 440 160 L 470 250", label: [386, 48] },
  // Sudoeste, afluentes do Solimões
  { id: "rio-jurua", nome: "Juruá", d: "M 60 470 L 120 380 L 170 250", label: [44, 492] },
  { id: "rio-purus", nome: "Purus", d: "M 190 480 L 240 370 L 275 250", label: [176, 502] },
  // Bacia do Madeira, onde fica Rondônia
  { id: "rio-madeira", nome: "Madeira", d: "M 300 470 L 350 360 L 395 250", label: [236, 330] },
  { id: "rio-mamore", nome: "Mamoré", d: "M 230 610 L 270 540 L 300 470", label: [172, 630] },
  { id: "rio-guapore", nome: "Guaporé", d: "M 330 650 L 320 560 L 300 470", label: [316, 676] },
  { id: "rio-jamari", nome: "Jamari", d: "M 452 566 L 400 510 L 340 440", label: [466, 580] },
  { id: "rio-machado", nome: "Machado", d: "M 566 654 L 470 545 L 372 430", label: [582, 668] },
  { id: "rio-roosevelt", nome: "Roosevelt", d: "M 660 640 L 540 520 L 400 400", label: [676, 652] },
  // Sudeste
  {
    id: "rio-tapajos",
    nome: "Tapajós",
    d: "M 700 520 L 700 400 L 700 250",
    label: [700, 546],
    anchor: "middle",
  },
  {
    id: "rio-xingu",
    nome: "Xingu",
    d: "M 820 520 L 812 400 L 800 250",
    label: [820, 546],
    anchor: "middle",
  },
  // Bacia vizinha, fora da do Amazonas
  {
    id: "rio-araguaia",
    nome: "Araguaia",
    d: "M 940 560 L 935 460 L 930 380",
    label: [935, 586],
    anchor: "middle",
  },
];

/** Ji-Paraná fica sobre o Machado: o ponto e o rótulo ficam à esquerda da linha. */
const hotel = { x: 528, y: 620, label: [512, 616] as [number, number] };

export function MapaBacia() {
  return (
    <Reveal variant="draw" className="mapa-bacia-wrap" amount={0.15}>
      <DestaqueRio />
      <svg
        className="mapa-bacia"
        viewBox="0 0 1000 720"
        role="img"
        aria-label="Mapa esquemático dos rios do primeiro andar e de como se ligam"
      >
        {tracos.map((t, i) => (
          <g key={t.id} className="mapa-rio" data-rio={t.id}>
            <path
              className="draw-path draw-only mapa-rio-traco"
              d={t.d}
              pathLength={1}
              style={{ ["--i" as string]: i }}
            />
            <text
              x={t.label[0]}
              y={t.label[1]}
              className="mapa-rio-nome"
              textAnchor={t.anchor ?? "start"}
            >
              {t.nome}
            </text>
          </g>
        ))}
        <circle className="mapa-hotel" cx={hotel.x} cy={hotel.y} r="8" />
        <text x={hotel.label[0]} y={hotel.label[1]} className="mapa-hotel-nome" textAnchor="end">
          Ji-Paraná
        </text>
      </svg>
      <ul className="mapa-bacia-links">
        {tracos.map((t) => (
          <li key={t.id}>
            <Link href={elementoUrl("rios", t.id)} className="uh-chip" data-rio-link={t.id}>
              {t.nome}
            </Link>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
