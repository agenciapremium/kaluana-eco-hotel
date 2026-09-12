import { CopyText } from "@/components/Copy";
import { Reveal } from "@/components/motion/Reveal";
import { splitFicha } from "@/lib/acomodacoes";
import { hasPlaceholder } from "@/lib/copy";
import { isProduction } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";

/**
 * Item da ficha como fica em produção. Campos ⟨pendentes⟩ somem (veto 5): se o campo é o
 * complemento de uma frase ("Banheiro privativo com ⟨amenidades⟩"), sobra a frase
 * ("Banheiro privativo."); se a frase depende do campo ("⟨metragem⟩ m²"), o item sai.
 */
export function fichaProducao(item: string): string | null {
  if (!hasPlaceholder(item)) return item;
  const m = item.match(/^(.*\S)\s+(?:com|e)\s+⟨[^⟩]*⟩\.?$/);
  return m ? `${m[1]}.` : null;
}

/** Itens visíveis em produção. Também alimentam o amenityFeature do schema HotelRoom. */
export function fichaVisivel(texto: string): string[] {
  return splitFicha(texto)
    .map(fichaProducao)
    .filter((x): x is string => Boolean(x));
}

/** Ficha do quarto em lista, entrando item a item por interseção (5.4, movimento). */
export function FichaList({ texto, className }: { texto: string; className?: string }) {
  const itens = isProduction ? fichaVisivel(texto) : splitFicha(texto);
  return (
    <ul className={["ficha-list", className].filter(Boolean).join(" ")}>
      {itens.map((item, i) => (
        <Reveal as="li" key={`${i}-${item}`} delay={i * motionTokens.stagger.item}>
          <CopyText text={item} />
        </Reveal>
      ))}
    </ul>
  );
}
