import type { ReactNode } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { CopyText } from "@/components/Copy";

type Props = {
  id?: string;
  kicker?: string | null;
  title?: string;
  as?: "h2" | "h3";
  children?: ReactNode;
  className?: string;
  align?: "left" | "center";
  tone?: "bege" | "branco" | "cafe" | "preto";
};

/** Seção padrão da Home: kicker, título em display e conteúdo, tudo entrando por interseção. */
export function Section({
  id,
  kicker,
  title,
  as = "h2",
  children,
  className,
  align = "left",
  tone = "bege",
}: Props) {
  const Heading = as;
  const toneClass =
    tone === "cafe"
      ? "bg-cafe text-bege"
      : tone === "preto"
        ? "bg-preto text-bege"
        : tone === "branco"
          ? "bg-branco"
          : "";
  return (
    <section id={id} className={["section-y", toneClass, className].filter(Boolean).join(" ")}>
      <div className={["container-site", align === "center" ? "text-center" : ""].join(" ")}>
        {kicker || title ? (
          <Reveal className={align === "center" ? "mx-auto max-w-3xl" : "max-w-3xl"}>
            {kicker ? (
              <span
                className={["kicker mb-4", align === "center" ? "justify-center" : ""].join(" ")}
              >
                {kicker}
              </span>
            ) : null}
            {title ? (
              <Heading className="text-title">
                <CopyText text={title} />
              </Heading>
            ) : null}
          </Reveal>
        ) : null}
        {children}
      </div>
    </section>
  );
}
