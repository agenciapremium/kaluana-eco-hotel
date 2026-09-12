import { Reveal } from "@/components/motion/Reveal";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { dataPorExtenso, postUrl } from "@/lib/posts";
import type { Post } from "@/lib/content-schema";
import { site } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";

export type Marco = { data: string; titulo: string; texto?: string; url?: string };

/**
 * Linha do tempo da obra (5.2). Os marcos vêm dos posts de Histórias, como a nota do
 * documento mestre pede, mais a inauguração. Só datas, nunca quantidades: a nota do
 * movimento é explícita quanto a isso, e o veto 2 proíbe número de apartamentos.
 */
export function LinhaDoTempo({ posts }: { posts: Post[] }) {
  const marcos: Marco[] = [
    ...posts.map((p) => ({
      data: p.data,
      titulo: p.titulo,
      texto: p.resumo,
      url: postUrl(p.slug),
    })),
    {
      data: `${site.openingDate}-01`,
      titulo: "Inauguração",
      texto: `O Kaluanã abre em ${site.openingLabel}.`,
    },
  ].sort((a, b) => (a.data < b.data ? -1 : 1));

  return (
    <ol className="linha-do-tempo">
      {marcos.map((m, i) => (
        <Reveal as="li" key={`${m.data}-${m.titulo}`} delay={i * motionTokens.stagger.item}>
          <time className="linha-do-tempo-data" dateTime={m.data}>
            {m.data.endsWith("-01") && m.titulo === "Inauguração"
              ? site.openingLabel
              : dataPorExtenso(m.data)}
          </time>
          <h3 className="linha-do-tempo-titulo">
            {m.url ? <Link href={m.url}>{m.titulo}</Link> : m.titulo}
          </h3>
          {m.texto ? <p className="linha-do-tempo-texto">{m.texto}</p> : null}
        </Reveal>
      ))}
    </ol>
  );
}
