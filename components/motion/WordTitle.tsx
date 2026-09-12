import { Fragment, type CSSProperties, type ElementType } from "react";

type Props = {
  as?: ElementType;
  text: string;
  className?: string;
  /** Atraso inicial em ms (por exemplo, esperar a abertura de sessão). */
  delay?: number;
  id?: string;
};

/** Título palavra a palavra: cada palavra sobe 20 px em fade, 60 ms entre elas (Parte 2.4). */
export function WordTitle({ as, text, className, delay, id }: Props) {
  const Tag = (as ?? "h1") as ElementType;
  const words = text.trim().split(/\s+/);
  return (
    <Tag
      id={id}
      className={["word-title", className].filter(Boolean).join(" ")}
      style={delay ? ({ "--word-delay": `${delay}ms` } as CSSProperties) : undefined}
    >
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word" style={{ "--i": i } as CSSProperties}>
            {w}
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}
