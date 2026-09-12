import { CopyText } from "@/components/Copy";
import { Reveal } from "@/components/motion/Reveal";
import type { Faq } from "@/lib/content-schema";
import { motion as motionTokens } from "@/lib/tokens";

/**
 * Perguntas e respostas em acordeão de 250 ms (Parte 6.0, item 8).
 * Usa <details>, que funciona sem JavaScript e anuncia o estado sozinho.
 */
export function Perguntas({ faq }: { faq: Faq[] }) {
  return (
    <div className="perguntas">
      {faq.map((f, i) => (
        <Reveal key={f.p} delay={i * motionTokens.stagger.item} amount={0.2}>
          <details className="pergunta" name="perguntas">
            <summary>
              <span>
                <CopyText text={f.p} />
              </span>
              <svg
                viewBox="0 0 24 24"
                className="pergunta-seta h-5 w-5 flex-none"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                aria-hidden="true"
              >
                <path d="M6 10l6 6 6-6" />
              </svg>
            </summary>
            <div className="pergunta-corpo">
              <p>
                <CopyText text={f.r} />
              </p>
            </div>
          </details>
        </Reveal>
      ))}
    </div>
  );
}
