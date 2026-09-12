import type { Metadata } from "next";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { FormularioEvento } from "@/components/eventos/FormularioEvento";
import { PlantaEspacos } from "@/components/eventos/PlantaEspacos";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina, getSecao } from "@/lib/content";
import { splitParagraphs } from "@/lib/copy";
import { eventVenueSchema, serviceSchema } from "@/lib/schema";
import { eventosAutorizado } from "@/lib/site";

const pagina = getPagina("eventos");

/**
 * Enquanto o cliente não autorizar a divulgação do auditório e do centro de convenções, a
 * página fica fora do menu e com noindex (nota da 5.19 e veto 3 do CLAUDE.md). Ela continua
 * acessível por link direto, para a equipe comercial usar.
 */
export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
  ...(eventosAutorizado ? {} : { robots: { index: false, follow: false } }),
};

/** Eventos e convenções (5.19). */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const espacos = getSecao(pagina, "Espaços");
  const formatos = getSecao(pagina, "Formatos");
  const grupos = getSecao(pagina, "Hospedagem para grupos");
  const formulario = getSecao(pagina, "Formulário");

  return (
    <>
      <JsonLd
        data={[
          eventVenueSchema({
            url: pagina.url,
            descricao: pagina.seo.resposta.trim(),
            // Capacidade máxima é campo pendente: não entra no schema até o cliente confirmar.
            capacidade: null,
          }),
          serviceSchema({
            url: pagina.url,
            nome: "Eventos e convenções no Kaluanã Eco Hotel",
            descricao: pagina.seo.resposta.trim(),
          }),
        ]}
      />

      <HeroScene
        image="detalhes/luz-de-janela"
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.66}
        actions={
          <a href="#proposta" className="btn btn-inverse">
            {hero.cta_primario}
            <Arrow />
          </a>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        {!eventosAutorizado ? (
          <div className="container-site">
            <p className="aviso-interno" role="note">
              Página fora do menu e com <code>noindex</code> até a autorização formal do cliente
              para divulgar o auditório e o centro de convenções. Capacidades, equipamentos e áreas
              entram quando forem confirmados.
            </p>
          </div>
        ) : null}

        <Section id="espacos" kicker={espacos.kicker} title={espacos.titulo}>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {espacos.texto ? <CopyParagraphs text={espacos.texto} className="text-xl" /> : null}
            </Reveal>
            <PlantaEspacos />
          </div>
        </Section>

        <Section id="formatos" kicker={formatos.kicker} title={formatos.titulo} tone="branco">
          <ul className="formatos mt-10">
            {splitParagraphs(formatos.texto ?? "")
              .flatMap((p) => p.split(/(?<=\.)\s+/))
              .filter(Boolean)
              .map((f) => (
                <Reveal as="li" key={f}>
                  <CopyText text={f} />
                </Reveal>
              ))}
          </ul>
        </Section>

        <Section id="grupos" kicker={grupos.kicker} title={grupos.titulo}>
          <Reveal className="measure mt-6">
            {grupos.texto ? <CopyParagraphs text={grupos.texto} className="text-xl" /> : null}
            <Link href="/acomodacoes" className="btn btn-secondary mt-8">
              Ver as acomodações
              <Arrow />
            </Link>
          </Reveal>
        </Section>

        <Section id="proposta" kicker={formulario.kicker} title={formulario.titulo} tone="branco">
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {formulario.texto ? (
                <CopyParagraphs text={formulario.texto} className="text-xl" />
              ) : null}
              <p className="mt-6 text-base">
                Prefere falar? <Link href="/contato">Fale com a equipe</Link>.
              </p>
            </Reveal>
            <Reveal>
              <FormularioEvento />
            </Reveal>
          </div>
        </Section>
      </div>
    </>
  );
}
