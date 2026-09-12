import type { Metadata } from "next";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { MapaSobDemanda } from "@/components/contato/MapaSobDemanda";
import { FormularioContato } from "@/components/formularios/FormularioContato";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Placeholder } from "@/components/Placeholder";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina, getSecao } from "@/lib/content";
import { hotelContatoSchema, webPageSchema } from "@/lib/schema";
import { isProduction, site } from "@/lib/site";

const pagina = getPagina("contato");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

const enderecoCompleto = `${site.address.street}, ${site.address.locality}, ${site.address.region}`;

/**
 * Contato (5.24). Reforça o NAP, que precisa bater letra por letra com a ficha do Google
 * (Parte 4.4). Telefone, WhatsApp, e-mail, CEP e coordenadas são campos pendentes com o
 * cliente: até chegarem, a página funciona por formulário e o schema não declara o que a
 * página não mostra. O número provisório citado no veto 5 do CLAUDE.md não entra aqui nem
 * em lugar nenhum do site.
 */
export default function Page() {
  const canais = getSecao(pagina, "Canais");
  const endereco = getSecao(pagina, "Endereço");
  const formulario = getSecao(pagina, "Formulário");
  const redes = getSecao(pagina, "Redes");
  const temCanalDireto = Boolean(site.phone || site.whatsapp || site.email);
  const temRedes = Object.values(site.social).some(Boolean);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: pagina.url,
            nome: pagina.seo.h1,
            descricao: pagina.seo.resposta.trim(),
            tipo: "ContactPage",
          }),
          hotelContatoSchema({ descricao: pagina.seo.resposta.trim() }),
        ]}
      />

      <HeroScene
        image="detalhes/maos-no-balcao"
        kicker={canais.kicker}
        title={pagina.seo.h1}
        lead={canais.titulo}
        leadClassName="hero-headline"
        veilOpacity={0.62}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Section id="canais" kicker={canais.kicker} title={canais.titulo}>
          <div className="canais mt-10">
            {site.phone ? (
              <Reveal className="canal">
                <span className="kicker mb-2">Telefone</span>
                <a href={`tel:${site.phone.replace(/\D/g, "")}`} className="canal-valor">
                  {site.phone}
                </a>
              </Reveal>
            ) : null}
            {site.email ? (
              <Reveal className="canal">
                <span className="kicker mb-2">E-mail</span>
                <a href={`mailto:${site.email}`} className="canal-valor">
                  {site.email}
                </a>
              </Reveal>
            ) : null}
            <Reveal className="canal">
              <span className="kicker mb-2">Formulário</span>
              <a href="#mensagem" className="canal-valor">
                Escreva para a gente
              </a>
            </Reveal>
            <Reveal className="canal">
              <span className="kicker mb-2">Recepção</span>
              <p className="canal-valor">24 horas</p>
            </Reveal>
          </div>
          {!temCanalDireto ? (
            <Reveal className="measure mt-8">
              <p className="text-lg">
                O telefone e o e-mail oficiais entram no site assim que forem definidos. Até lá, o
                formulário abaixo chega direto na equipe.
              </p>
              {!isProduction ? (
                <p className="mt-2 text-base">
                  <Placeholder label="número oficial, e-mail e WhatsApp pendentes" />
                </p>
              ) : null}
            </Reveal>
          ) : null}
        </Section>

        <Section id="endereco" kicker={endereco.kicker} title={endereco.titulo} tone="branco">
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {endereco.texto ? <CopyParagraphs text={endereco.texto} className="text-xl" /> : null}
              <p className="mt-6 text-base">
                O hotel fica no acesso à cidade, com estacionamento no local.
              </p>
              <Link href="/ji-parana" className="btn btn-secondary mt-6">
                Como chegar a Ji-Paraná
              </Link>
            </Reveal>
            <Reveal>
              <MapaSobDemanda endereco={enderecoCompleto} />
            </Reveal>
          </div>
        </Section>

        <Section id="mensagem" kicker={formulario.kicker} title={formulario.titulo}>
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              <p className="text-xl">
                Conte o que você precisa e a equipe responde em até um dia útil.
              </p>
            </Reveal>
            <Reveal>
              <FormularioContato />
            </Reveal>
          </div>
        </Section>

        {temRedes ? (
          <Section id="redes" kicker={redes.kicker} title={redes.titulo} tone="branco">
            <Reveal className="mt-8 flex flex-wrap gap-3">
              {Object.entries(site.social)
                .filter(([, url]) => Boolean(url))
                .map(([nome, url]) => (
                  <a key={nome} href={url as string} className="btn btn-secondary" rel="noopener">
                    <CopyText text={nome} />
                  </a>
                ))}
            </Reveal>
          </Section>
        ) : null}
      </div>
    </>
  );
}
