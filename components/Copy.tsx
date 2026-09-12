import type { ReactNode } from "react";
import { segmentPlaceholders, splitParagraphs } from "@/lib/copy";
import { Placeholder } from "./Placeholder";

/** Renderiza um texto do YAML respeitando ⟨campos pendentes⟩. */
export function CopyText({ text }: { text: string }): ReactNode {
  return segmentPlaceholders(text).map((seg, i) =>
    seg.kind === "text" ? seg.value : <Placeholder key={i} label={seg.value} />,
  );
}

/** Renderiza um campo multiparágrafo do YAML como uma sequência de <p>. */
export function CopyParagraphs({ text, className }: { text: string; className?: string }) {
  return splitParagraphs(text).map((p, i) => (
    <p key={i} className={className}>
      <CopyText text={p} />
    </p>
  ));
}
