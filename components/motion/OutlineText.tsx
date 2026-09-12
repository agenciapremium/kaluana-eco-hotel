/**
 * Palavra gigante em contorno que se desloca com a rolagem (nunca sozinha: sem marquee),
 * por animação nativa de rolagem em CSS. Decorativa, escondida de leitores de tela.
 */
export function OutlineText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={["outline-text", className].filter(Boolean).join(" ")} aria-hidden="true">
      <span className="outline-text-inner">{text}</span>
    </div>
  );
}
