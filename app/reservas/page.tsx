import type { Metadata } from "next";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { FormularioPreReserva } from "@/components/formularios/FormularioPreReserva";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina, getSecao } from "@/lib/content";
import { descricaoDe } from "@/lib/seo";
import { hotelReservaSchema, webPageSchema } from "@/lib/schema";
import { reservasUrl } from "@/lib/site";

const pagina = getPagina("reservas");
const descricao = descricaoDe("reservas", pagina.seo.description);

/** Há motor contratado quando a variável aponta para fora do site. */
const motorUrl = /^https?:\/\//.test(reservasUrl) ? reservasUrl : null;

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: descricao,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  openGraph: { title: pagina.seo.title, description: descricao, url: pagina.url },
};

/**
 * Reservas (5.23). Destino de todos os botões Reservar do site.
 *
 * Sem motor contratado, a página entra em modo pré-reserva: explica o caminho e capta o
 * interesse com as datas previstas. Quando `NEXT_PUBLIC_RESERVAS_URL` apontar para um motor,
 * o bloco vira o widget e o ReserveAction entra no schema.
 */
export default function Page() {
  const motor = getSecao(pagina, "Motor");
  const empresas = getSecao(pagina, "Empresas");
  const grupos = getSecao(pagina, "Grupos e eventos");
  const politicas = getSecao(pagina, "Políticas");

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            url: pagina.url,
            nome: pagina.seo.h1,
            descricao: pagina.seo.resposta.trim(),
          }),
          hotelReservaSchema({ descricao: pagina.seo.resposta.trim(), motorUrl }),
        ]}
      />

      <HeroScene
        image="detalhes/luz-de-janela"
        kicker={motor.kicker}
        title={pagina.seo.h1}
        lead={motor.titulo}
        leadClassName="hero-headline"
        text={motor.texto ? <CopyParagraphs text={motor.texto} /> : null}
        veilOpacity={0.64}
        actions={
          <a href="#reservar" className="btn btn-inverse">
            {motorUrl ? "Escolher as datas" : "Quero ser avisado"}
            <Arrow />
          </a>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Section id="reservar" kicker="Pré-reserva" title="Reservas abertas em breve.">
          <div className="mt-10 grid gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              <p className="text-xl">
                O motor de reservas entra junto com a inauguração, em dezembro de 2026. Até lá,
                deixe seu contato e as datas que você pretende: avisamos primeiro e seguramos a
                conversa com você.
              </p>
              <p className="mt-4 text-base">
                Para grupos, eventos e conta corporativa, a equipe atende direto, sem esperar o
                motor.
              </p>
            </Reveal>
            <Reveal>
              <FormularioPreReserva />
            </Reveal>
          </div>
        </Section>

        <div className="container-site">
          <div className="blocos-reserva">
            <Reveal className="bloco-reserva">
              <span className="kicker mb-3">{empresas.kicker}</span>
              <h2 className="bloco-reserva-titulo">
                <CopyText text={empresas.titulo ?? ""} />
              </h2>
              {empresas.texto ? <CopyParagraphs text={empresas.texto} /> : null}
              <Link href="/contato" className="btn btn-secondary mt-6">
                {empresas.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
            <Reveal className="bloco-reserva">
              <span className="kicker mb-3">{grupos.kicker}</span>
              <h2 className="bloco-reserva-titulo">
                <CopyText text={grupos.titulo ?? ""} />
              </h2>
              {grupos.texto ? <CopyParagraphs text={grupos.texto} /> : null}
              <Link href="/eventos" className="btn btn-secondary mt-6">
                {grupos.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
            <Reveal className="bloco-reserva">
              <span className="kicker mb-3">{politicas.kicker}</span>
              <h2 className="bloco-reserva-titulo">
                <CopyText text={politicas.titulo ?? ""} />
              </h2>
              {politicas.texto ? <CopyParagraphs text={politicas.texto} /> : null}
              <Link href="/perguntas-frequentes" className="btn btn-secondary mt-6">
                Perguntas frequentes
                <Arrow />
              </Link>
            </Reveal>
          </div>
        </div>

        <Section
          id="acomodacoes"
          kicker="Antes de reservar"
          title="Escolha a categoria."
          tone="branco"
        >
          <Reveal className="measure mt-6">
            <p className="text-xl">
              São sete categorias, do quarto para uma noite de estrada à suíte para uma semana de
              trabalho. Todas com nome da Amazônia na porta.
            </p>
            <Link href="/acomodacoes" className="btn btn-primary mt-8">
              Ver as acomodações
              <Arrow />
            </Link>
          </Reveal>
        </Section>
      </div>
    </>
  );
}
