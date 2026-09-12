import { CopyText } from "@/components/Copy";
import { Reveal } from "@/components/motion/Reveal";
import { motion as motionTokens } from "@/lib/tokens";

/** Ficha rápida (Parte 6.0, item 7). Preenche linha a linha ao entrar na tela. */
export function Ficha({ linhas }: { linhas: [string, string][] }) {
  return (
    <dl className="ficha-rapida">
      {linhas.map(([chave, valor], i) => (
        <Reveal
          key={chave}
          className="ficha-linha"
          delay={i * motionTokens.stagger.min}
          amount={0.4}
        >
          <dt>{chave}</dt>
          <dd>
            <CopyText text={valor} />
          </dd>
        </Reveal>
      ))}
    </dl>
  );
}
