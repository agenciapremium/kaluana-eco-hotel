import type { ReactNode } from "react";
import { copyDeProducao, segmentPlaceholders, splitParagraphs } from "@/lib/copy";
import { isProduction } from "@/lib/site";
import { Placeholder } from "./Placeholder";

/**
 * Renderiza um texto do YAML respeitando ⟨campos pendentes⟩ (veto 5).
 *
 * Em desenvolvimento os campos aparecem destacados. Em produção o texto passa por
 * copyDeProducao, que tira frase por frase o que depende de campo pendente: apagar só o
 * campo deixaria pontuação órfã ("O comércio do centro. . . Feira") ou frase sem sentido
 * ("Café da manhã das às").
 */
export function CopyText({ text }: { text: string }): ReactNode {
  if (isProduction) return copyDeProducao(text);
  return segmentPlaceholders(text).map((seg, i) =>
    seg.kind === "text" ? seg.value : <Placeholder key={i} label={seg.value} />,
  );
}

/** Renderiza um campo multiparágrafo do YAML como uma sequência de <p>. */
export function CopyParagraphs({ text, className }: { text: string; className?: string }) {
  return splitParagraphs(text)
    .map((p) => (isProduction ? copyDeProducao(p) : p))
    .filter(Boolean)
    .map((p, i) => (
      <p key={i} className={className}>
        <CopyText text={p} />
      </p>
    ));
}
