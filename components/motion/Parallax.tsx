import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Fundo em tela cheia: a camada é 16% mais alta que a área para o deslocamento não vazar. */
  fill?: boolean;
};

/**
 * Parallax ligado à rolagem, sem JavaScript: animação nativa de rolagem em CSS
 * (`animation-timeline: view()`), só em transform, com teto de 8% (Parte 2.3).
 * Navegadores sem suporte, ou com movimento reduzido, mostram a foto parada.
 * Ver app/globals.css, seção "Parallax".
 */
export function Parallax({ children, className, fill = true }: Props) {
  return (
    <div className={["parallax", fill ? "parallax-fill" : "", className].filter(Boolean).join(" ")}>
      <div className="parallax-layer">{children}</div>
    </div>
  );
}
