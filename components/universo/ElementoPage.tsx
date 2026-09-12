import { Suspense, type CSSProperties } from "react";
import { AmbientAudio } from "@/components/audio/AmbientAudio";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { WordTitle } from "@/components/motion/WordTitle";
import { FramedImage } from "@/components/scene/FramedImage";
import { MediaImage } from "@/components/ui/MediaImage";
import { kickerDoElemento, mostraNumeroDeQuarto } from "@/lib/contagem";
import { getImage, hasImage, imageSrc } from "@/lib/media";
import { articleSchema, faqSchema } from "@/lib/schema";
import { siteUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";
import type { Elemento } from "@/lib/universo";
import { proximoQuarto } from "@/lib/universo";
import { cantoDe } from "@/lib/audio/cantos";
import { BarraHospede } from "./BarraHospede";
import { Ficha } from "./Ficha";
import { NavAndar } from "./NavAndar";
import { Perguntas } from "./Perguntas";

/** Data de atualização do conteúdo, visível no rodapé de autoria (Parte 6.0, item 10). */
const ATUALIZADO_EM = "2026-09-12";

const formatarData = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Página de elemento do Universo (Parte 6.0). As 70 seguem este mesmo modelo, para que o
 * hóspede aprenda a ler uma e saiba ler todas. Sem abertura de sessão (BootScript já pula
 * as rotas do Universo e do QR).
 */
export function ElementoPage({ elemento: e }: { elemento: Elemento }) {
  const { item, grupo, andar } = e;
  const temHero = hasImage(e.heroId);
  const hero = temHero ? getImage(e.heroId) : null;
  const galeria = e.galeriaIds.filter(hasImage);
  const canto = cantoDe(item.id);
  const rio = grupo === "rios";

  return (
    <article
      className="elemento-page"
      style={{ "--accent": andar.accent } as CSSProperties}
      data-andar={grupo}
    >
      <JsonLd
        data={[
          articleSchema({
            url: e.url,
            titulo: item.seo.title,
            descricao: item.seo.description,
            sobre: {
              nome: item.nome,
              cientifico: item.cientifico ?? null,
              tipo: rio ? "BodyOfWater" : "Thing",
            },
            imagem: hero
              ? {
                  url: `${siteUrl}${imageSrc(hero, 1600, "webp")}`,
                  alt: hero.alt,
                  width: hero.width,
                  height: hero.height,
                }
              : undefined,
            atualizadoEm: ATUALIZADO_EM,
          }),
          faqSchema(item.faq),
          // O BreadcrumbList sai do componente Breadcrumbs, que também o desenha na página.
        ]}
      />

      <Suspense fallback={null}>
        <BarraHospede
          dados={{
            nome: item.nome,
            uh: item.uh,
            proximo: (() => {
              const p = proximoQuarto(item.uh);
              return p ? { nome: p.nome, url: p.url } : null;
            })(),
            categoria: e.qr?.categoria ?? null,
            categoriaUrl: e.qr?.categoriaUrl ?? null,
            mostraNumero: mostraNumeroDeQuarto,
          }}
        >
          <AmbientAudio
            andar={grupo}
            elemento={item.id}
            extraLoops={canto ? [canto.arquivo] : []}
            variant="destaque"
          />
        </BarraHospede>
      </Suspense>

      <header className="elemento-hero">
        <div className="scene-bg" aria-hidden="true">
          {temHero ? (
            <div className="hero-zoom">
              <MediaImage
                id={e.heroId}
                sizes="100vw"
                className="scene-picture"
                imgClassName="scene-img"
                priority
              />
            </div>
          ) : (
            <div className="elemento-sem-foto" />
          )}
          <div className="elemento-veil" />
        </div>
        <div className="container-site elemento-hero-conteudo">
          <span className="kicker mb-4">{kickerDoElemento(andar.nome, item.uh)}</span>
          <WordTitle text={item.nome} className="elemento-nome" />
          <p className="elemento-sub">{item.subtitulo}</p>
          {item.cientifico ? <p className="elemento-cientifico">{item.cientifico}</p> : null}
          <div className="elemento-hero-acoes">
            <AmbientAudio
              andar={grupo}
              elemento={item.id}
              extraLoops={canto ? [canto.arquivo] : []}
            />
          </div>
        </div>
      </header>

      <div id="conteudo-principal" className="elemento-corpo">
        <div className="container-site">
          <Breadcrumbs
            items={[
              { name: "Universo Kaluanã", url: "/universo" },
              { name: andar.nome, url: andar.url },
              { name: item.nome, url: e.url },
            ]}
          />
        </div>

        <section className="elemento-secao elemento-abertura">
          <div className="container-site">
            <Reveal className="measure">
              <CopyParagraphs text={item.abertura} className="lead" />
            </Reveal>
          </div>
        </section>

        <section className="elemento-secao" id="por-que">
          <div className="container-site elemento-duas-colunas">
            <Reveal className="measure">
              <h2 className="kicker mb-4">Por que está no Kaluanã</h2>
              <CopyParagraphs text={item.no_kaluana} className="elemento-texto" />
            </Reveal>
            {galeria[0] ? (
              <FramedImage
                id={galeria[0]}
                ratio="4 / 3"
                sizes="(min-width: 64rem) 44vw, 100vw"
                delay={motionTokens.stagger.item}
              />
            ) : null}
          </div>
        </section>

        <section className="elemento-secao" id="historia">
          <div className="container-site">
            <Reveal className="measure">
              <h2 className="kicker mb-4">História</h2>
            </Reveal>
            <Reveal className="measure elemento-texto">
              <CopyParagraphs text={item.historia} />
            </Reveal>
          </div>
        </section>

        {galeria[1] ? (
          <section className="elemento-secao elemento-secao-larga">
            <div className="container-site">
              <FramedImage id={galeria[1]} ratio="16 / 9" sizes="100vw" />
            </div>
          </section>
        ) : null}

        <section className="elemento-secao" id="curiosidades">
          <div className="container-site">
            <Reveal className="measure">
              <h2 className="kicker mb-4">Curiosidades</h2>
            </Reveal>
            <ul className="curiosidades">
              {item.curiosidades.map((c, i) => (
                <Reveal as="li" key={c} delay={i * motionTokens.stagger.item} amount={0.2}>
                  <CopyText text={c} />
                </Reveal>
              ))}
            </ul>
          </div>
        </section>

        <section className="elemento-secao elemento-ficha" id="ficha">
          <div className="container-site">
            <Reveal className="measure">
              <h2 className="kicker mb-6">Ficha rápida</h2>
            </Reveal>
            <Ficha linhas={item.ficha} />
          </div>
        </section>

        <section className="elemento-secao" id="perguntas">
          <div className="container-site">
            <Reveal className="measure">
              <h2 className="kicker mb-6">Perguntas e respostas</h2>
            </Reveal>
            <Perguntas faq={item.faq} />
          </div>
        </section>

        <div className="container-site">
          <NavAndar elemento={e} />
          <p className="elemento-autoria">
            Publicado por Kaluanã Eco Hotel, Ji-Paraná. Atualizado em{" "}
            <time dateTime={ATUALIZADO_EM}>{formatarData(ATUALIZADO_EM)}</time>.
            {canto ? (
              <>
                {" "}
                Canto: {canto.autor}, {canto.licenca}.
              </>
            ) : null}
          </p>
        </div>
      </div>
    </article>
  );
}
