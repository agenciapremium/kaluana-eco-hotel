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
type Traco = { id: string; nome: string; d: string; label: [number, number]; anchor?: string };

const tracos: Traco[] = [
  // Tronco: Solimões a oeste, Amazonas a leste do encontro com o Negro.
  { id: "rio-solimoes", nome: "Solimões", d: "M 40 250 L 300 250 L 470 250", label: [150, 236] },
  { id: "rio-amazonas", nome: "Amazonas", d: "M 470 250 L 700 250 L 950 250", label: [690, 236] },
  // Norte
  { id: "rio-negro", nome: "Negro", d: "M 400 60 L 440 160 L 470 250", label: [372, 52] },
  // Sudoeste, afluentes do Solimões
  { id: "rio-jurua", nome: "Juruá", d: "M 60 470 L 120 380 L 170 250", label: [40, 486] },
  { id: "rio-purus", nome: "Purus", d: "M 190 480 L 240 370 L 275 250", label: [172, 496] },
  // Bacia do Madeira (Rondônia)
  { id: "rio-madeira", nome: "Madeira", d: "M 300 470 L 350 360 L 395 250", label: [300, 356] },
  { id: "rio-mamore", nome: "Mamoré", d: "M 230 610 L 270 540 L 300 470", label: [180, 626] },
  { id: "rio-guapore", nome: "Guaporé", d: "M 330 640 L 320 560 L 300 470", label: [312, 664] },
  { id: "rio-jamari", nome: "Jamari", d: "M 430 560 L 390 520 L 340 440", label: [440, 570] },
  { id: "rio-machado", nome: "Machado", d: "M 520 620 L 450 540 L 372 430", label: [530, 634] },
  { id: "rio-roosevelt", nome: "Roosevelt", d: "M 610 660 L 520 560 L 400 400", label: [620, 676] },
  // Sudeste
  { id: "rio-tapajos", nome: "Tapajós", d: "M 700 520 L 700 400 L 700 250", label: [682, 540] },
  { id: "rio-xingu", nome: "Xingu", d: "M 820 520 L 812 400 L 800 250", label: [802, 540] },
  // Bacia vizinha, fora da do Amazonas
  { id: "rio-araguaia", nome: "Araguaia", d: "M 940 560 L 935 460 L 930 380", label: [900, 580] },
];

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
            <text x={t.label[0]} y={t.label[1]} className="mapa-rio-nome">
              {t.nome}
            </text>
          </g>
        ))}
        <circle className="mapa-hotel" cx="520" cy="620" r="7" />
        <text x="536" y="612" className="mapa-hotel-nome">
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
