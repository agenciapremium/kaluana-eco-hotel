import type { CSSProperties } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { Categoria } from "@/lib/acomodacoes";
import { motion as motionTokens } from "@/lib/tokens";

/**
 * Nomes dos quartos da categoria, agrupados por andar, como etiquetas que se acendem em
 * verde sálvia no hover e abrem a página do Universo (etapa 3). Só os nomes: os números de
 * UH ficam fora até a inauguração (veto 2).
 */
export function NomesUh({ categoria }: { categoria: Categoria }) {
  return (
    <div className="uh-grupos">
      {categoria.porAndar.map((g, gi) => (
        <Reveal
          key={g.floor}
          delay={gi * motionTokens.stagger.item}
          style={{ "--accent": g.accent } as CSSProperties}
        >
          <h3 className="kicker">{g.nome}</h3>
          <ul className="uh-list" aria-label={g.nome}>
            {g.uhs.map((u) => (
              <li key={u.uh}>
                <Link href={u.url} className="uh-chip">
                  {u.nome}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>
  );
}
