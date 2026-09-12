import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BuscaPerguntas, type GrupoFaq } from "@/components/faq/BuscaPerguntas";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Pergunta } from "@/components/universo/Perguntas";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina } from "@/lib/content";
import type { Faq } from "@/lib/content-schema";
import { copyDeProducao } from "@/lib/copy";
import { faqSchema, webPageSchema } from "@/lib/schema";
import { eventosAutorizado, isProduction } from "@/lib/site";

const pagina = getPagina("perguntas-frequentes");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

/** Agrupamento por tema, com âncora (5.25, movimento). */
const temas: { id: string; nome: string; casa: (p: Faq) => boolean }[] = [
  {
    id: "o-hotel",
    nome: "O hotel",
    casa: (p) => /onde fica|abre|significa|nome de rio/i.test(p.p),
  },
  {
    id: "estadia",
    nome: "A estadia",
    casa: (p) => /check-in|café da manhã|estacionamento|acessívei|internet/i.test(p.p),
  },
  {
    id: "servicos",
    nome: "Serviços",
    casa: (p) => /restaurante|eventos|animais|empresa/i.test(p.p),
  },
  { id: "chegar", nome: "Como chegar", casa: (p) => /distância|aeroporto|rodoviária/i.test(p.p) },
];

/**
 * Perguntas frequentes (5.25). É a página de AEO do hotel: cada resposta é uma frase que
 * faz sentido isolada, com FAQPage.
 *
 * Respostas com campo pendente saem do ar em produção pela regra da etapa 4, e a de eventos
 * só entra com a autorização do cliente (veto 3).
 */
export default function Page() {
  const todas = pagina.faq ?? [];
  const visiveis = todas
    .filter((p) => (eventosAutorizado ? true : !/espaço para eventos/i.test(p.p)))
    .filter((p) => !isProduction || copyDeProducao(p.r).length > 0);

  const montar = (id: string, nome: string, lista: Faq[]): GrupoFaq => ({
    id,
    nome,
    itens: lista.map((f, i) => ({
      chave: f.p,
      // O texto da busca vai para um componente cliente, e prop de componente cliente
      // viaja no HTML servido: precisa estar saneado (ver docs/decisoes.md, item 57).
      texto: isProduction ? `${copyDeProducao(f.p)} ${copyDeProducao(f.r)}` : `${f.p} ${f.r}`,
      node: <Pergunta faq={f} delay={i * 40} grupo={id} />,
    })),
  });

  const grupos: GrupoFaq[] = temas
    .map((t) => montar(t.id, t.nome, visiveis.filter(t.casa)))
    .filter((g) => g.itens.length > 0);
  const agrupadas = new Set(grupos.flatMap((g) => g.itens.map((i) => i.chave)));
  const resto = visiveis.filter((p) => !agrupadas.has(p.p));
  if (resto.length > 0) grupos.push(montar("outras", "Outras", resto));

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: pagina.url,
            nome: pagina.seo.h1,
            descricao: pagina.seo.resposta.trim(),
          }),
          faqSchema(visiveis),
        ]}
      />

      <HeroScene
        image="detalhes/mesa-com-cafe"
        kicker="Perguntas frequentes"
        title={pagina.seo.h1}
        lead={pagina.seo.resposta.trim()}
        veilOpacity={0.66}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Section id="lista" kicker="Respostas" title="O que perguntam sobre o Kaluanã.">
          <div className="mt-10">
            <BuscaPerguntas grupos={grupos} />
          </div>
          <Reveal className="mt-12">
            <p className="text-lg">Não achou? Escreva para a gente.</p>
            <Link href="/contato" className="btn btn-primary mt-4">
              Falar com o hotel
              <Arrow />
            </Link>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
