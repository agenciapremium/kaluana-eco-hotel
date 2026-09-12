import { Reveal } from "./Reveal";

/**
 * Moldura fina desenhada por dentro de fotos e cards: a assinatura visual das cenas.
 * O traço se desenha ao entrar na tela (stroke-dashoffset). Decorativa.
 */
export function Frame({
  inset = "1rem",
  className,
  tone = "bege",
}: {
  inset?: string;
  className?: string;
  tone?: "bege" | "cafe";
}) {
  return (
    <Reveal
      as="span"
      variant="draw"
      className={["frame", tone === "cafe" ? "frame-cafe" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={{ inset }}
      amount={0.1}
    >
      <svg
        className="frame-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <rect
          className="draw-path draw-only"
          x="0"
          y="0"
          width="100"
          height="100"
          pathLength={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </Reveal>
  );
}
