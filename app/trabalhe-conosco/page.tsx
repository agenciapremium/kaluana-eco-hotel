import type { Metadata } from "next";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { FormularioCurriculo } from "@/components/formularios/FormularioCurriculo";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina, getSecao } from "@/lib/content";
import { webPageSchema } from "@/lib/schema";

const pagina = getPagina("trabalhe-conosco");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

/**
 * Trabalhe conosco (5.26).
 *
 * Sem JobPosting no schema: ele exige vaga aberta, com título, descrição, data de
 * publicação e validade, e o hotel ainda não abriu processo por vaga. Declarar JobPosting
 * sem vaga real é dado inventado, e a Parte 4.3 proíbe declarar o que a página não mostra.
 * Quando houver vaga, cada uma entra com o seu.
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const formulario = getSecao(pagina, "Formulário");

  return (
    <>
      <JsonLd
        data={webPageSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: pagina.seo.resposta.trim(),
        })}
      />

      <HeroScene
        image="obra/linha-e-estacas"
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.64}
        actions={
          <a href="#curriculo" className="btn btn-inverse">
            {hero.cta_primario}
            <Arrow />
          </a>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Section id="curriculo" kicker="Currículo" title={formulario.titulo}>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              <p className="text-xl">
                <CopyText text={formulario.texto ?? ""} />
              </p>
              <p className="mt-6 text-base">
                Ainda não há processo aberto por vaga. Os currículos ficam com a equipe e são
                chamados conforme a operação for montada, mais perto da inauguração.
              </p>
              <Link href="/o-kaluana" className="btn btn-secondary mt-8">
                Conhecer o Kaluanã
                <Arrow />
              </Link>
            </Reveal>
            <Reveal>
              <FormularioCurriculo />
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  );
}
