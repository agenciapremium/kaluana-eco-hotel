import type { CSSProperties, ReactNode } from "react";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Frame } from "@/components/motion/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { FramedImage } from "@/components/scene/FramedImage";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { MediaImage } from "@/components/ui/MediaImage";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { Categoria } from "@/lib/acomodacoes";
import { getSecao } from "@/lib/content";
import type { Secao } from "@/lib/content-schema";
import { getImage, hasImage, imageSrc } from "@/lib/media";
import { hotelRoomSchema, roomProductSchema } from "@/lib/schema";
import { reservasUrl, siteUrl } from "@/lib/site";
import { motion as motionTokens } from "@/lib/tokens";
import { DragScroller } from "./DragScroller";
import { FichaList, fichaVisivel } from "./FichaList";
import { NomesUh } from "./NomesUh";

/** Seções com render próprio; as demais (Perfis, Como chegar ao quarto, Ocasiões) são texto e foto. */
const fixas = ["Hero", "Ficha", "Os nomes", "O nome", "Chamada final"];

/** Destino dos botões secundários das chamadas finais (5.4 a 5.10). */
function ctaHref(label: string | undefined): string {
  switch (label) {
    case "Suíte Presidencial":
      return "/acomodacoes/suite-presidencial-onca-pintada";
    case "Hospedagem corporativa":
    case "Falar com o hotel":
      return "/contato";
    default:
      return "/acomodacoes";
  }
}

function idDe(nome: string) {
  return nome
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Página de categoria (5.4 a 5.10): hero em foto de detalhe, migalhas, faixa de detalhes
 * arrastável, ficha item a item, seções de texto com foto, os nomes dos quartos por andar
 * ligando ao Universo, e a chamada final. A Suíte Presidencial troca as seções do meio por
 * uma pilha de cenas com sticky e movimento mais lento (5.10).
 */
export function CategoriaPage({ categoria: c }: { categoria: Categoria }) {
  const { pagina } = c;
  const hero = getSecao(pagina, "Hero");
  const ficha = getSecao(pagina, "Ficha");
  const nomes = pagina.secoes.find((s) => s.nome === "Os nomes" || s.nome === "O nome");
  const final = getSecao(pagina, "Chamada final");
  const extras = pagina.secoes.filter((s) => !fixas.includes(s.nome));
  const universoLink = pagina.links_internos.find((l) => /^\/universo\/[^/]+\/[^/]+/.test(l));
  const galeria = c.galeria.filter(hasImage);
  const presidencial = c.slug === "suite-presidencial-onca-pintada";
  const acessivel = c.slug === "superior-acessivel";
  const resposta = pagina.seo.resposta.trim();

  const amenidades = fichaVisivel(ficha.texto ?? "")
    .filter((i) => !/^Até \d/.test(i))
    .map((i) => i.replace(/\.$/, ""));
  const room = {
    slug: c.slug,
    url: c.url,
    nome: c.nome,
    descricao: resposta,
    capacidade: c.capacidade,
    cama: c.cama,
    suite: c.suite,
    amenidades,
    image: hasImage(c.imagem)
      ? `${siteUrl}${imageSrc(getImage(c.imagem), 1600, "webp")}`
      : undefined,
  };

  // Variações de movimento por categoria (documento mestre, seção "Movimento" de cada página).
  const heroStyle =
    c.slug === "superior-familia-com-terraco"
      ? ({ "--parallax-max": "var(--parallax-terraco)" } as CSSProperties)
      : undefined;
  let bgExtra: ReactNode = null;
  if (c.slug === "suite-terraco-lateral-aberto") {
    bgExtra = <div className="luz-deriva" aria-hidden="true" />;
  } else if (c.slug === "suite-terraco-lateral-fechado" && galeria[1]) {
    bgExtra = (
      <MediaImage
        id={galeria[1]}
        sizes="100vw"
        className="scene-picture scene-picture-2"
        imgClassName="scene-img"
      />
    );
  }
  const kicker = hero.kicker && hero.kicker !== c.nome && !presidencial ? hero.kicker : null;
  const titleNode = presidencial ? (
    <>
      <span className="nome-prefixo">{hero.kicker}</span>
      <span className="nome-gigante">{hero.titulo}</span>
    </>
  ) : undefined;

  const reservar = (origem: string, label: string | undefined) => (
    <TrackedLink
      href={reservasUrl}
      event="reservar_click"
      params={{ origem, categoria: c.codigo }}
      className="btn btn-inverse"
    >
      {label}
      <Arrow />
    </TrackedLink>
  );

  return (
    <div className="categoria-page" data-variante={c.slug}>
      <JsonLd data={[hotelRoomSchema(room), roomProductSchema(room, reservasUrl)]} />

      <HeroScene
        image={c.imagem}
        kicker={kicker}
        title={c.nome}
        titleNode={titleNode}
        lead={presidencial ? undefined : hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        actions={reservar("hero", hero.cta_primario)}
        veilOpacity={acessivel ? 0.7 : 0.55}
        style={heroStyle}
        bgExtra={bgExtra}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs
            items={[
              { name: "Acomodações", url: "/acomodacoes" },
              { name: c.nome, url: c.url },
            ]}
          />
        </div>

        {galeria.length > 1 && !presidencial ? (
          <div className="container-site pb-4">
            <DragScroller label={`Detalhes: ${c.nome}`}>
              {galeria.map((id, i) => (
                <FramedImage
                  key={id}
                  id={id}
                  ratio="4 / 3"
                  sizes="(min-width: 64rem) 34rem, 80vw"
                  delay={i * motionTokens.stagger.item}
                />
              ))}
            </DragScroller>
          </div>
        ) : null}

        {presidencial ? (
          <div className="stack">
            <Scene image={galeria[1]} veil="preto" veilOpacity={0.7} height="full" align="left">
              <Reveal className="max-w-3xl">
                <span className="kicker mb-4">{ficha.kicker}</span>
                <h2 className="text-title">
                  <CopyText text={ficha.titulo ?? ""} />
                </h2>
                <p className="text-bege/90 mt-6 text-xl">
                  <CopyText text={resposta} />
                </p>
              </Reveal>
              <div className="mt-10">
                <FichaList texto={ficha.texto ?? ""} />
              </div>
            </Scene>
            {nomes ? (
              <Scene image={galeria[2]} veil="cafe" veilOpacity={0.7} height="full" align="left">
                <Reveal className="max-w-3xl">
                  <span className="kicker mb-4">{nomes.kicker}</span>
                  <h2 className="text-title">
                    <CopyText text={nomes.titulo ?? ""} />
                  </h2>
                  {nomes.texto ? (
                    <CopyParagraphs text={nomes.texto} className="text-bege/90 mt-6 text-xl" />
                  ) : null}
                </Reveal>
                <div className="mt-10">
                  <NomesUh categoria={c} />
                </div>
                {nomes.cta_secundario && universoLink ? (
                  <Reveal className="mt-8">
                    <Link href={universoLink} className="btn btn-secondary">
                      {nomes.cta_secundario}
                      <Arrow />
                    </Link>
                  </Reveal>
                ) : null}
              </Scene>
            ) : null}
            {extras.map((s) => (
              <Scene
                key={s.nome}
                image="detalhes/textura-madeira"
                veil="preto"
                veilOpacity={0.72}
                height="full"
                align="left"
              >
                <Reveal className="max-w-3xl">
                  <span className="kicker mb-4">{s.kicker}</span>
                  <h2 className="text-title">
                    <CopyText text={s.titulo ?? ""} />
                  </h2>
                  {s.texto ? (
                    <CopyParagraphs text={s.texto} className="text-bege/90 mt-6 text-xl" />
                  ) : null}
                </Reveal>
              </Scene>
            ))}
          </div>
        ) : (
          <>
            <Section id="ficha" kicker={ficha.kicker} title={ficha.titulo}>
              <Reveal className="measure mt-6">
                <p className="text-xl">
                  <CopyText text={resposta} />
                </p>
              </Reveal>
              <div className="mt-10">
                <FichaList texto={ficha.texto ?? ""} />
              </div>
            </Section>
            {extras.map((s, i) => (
              <ExtraSection
                key={s.nome}
                secao={s}
                image={galeria[(i + 1) % galeria.length]}
                foco={c.slug === "duplo-king"}
                tone={i % 2 === 0 ? "branco" : "bege"}
              />
            ))}
            {nomes ? (
              <Section id="os-nomes" kicker={nomes.kicker} title={nomes.titulo}>
                <Reveal className="measure mt-6">
                  {nomes.texto ? <CopyParagraphs text={nomes.texto} className="text-xl" /> : null}
                </Reveal>
                <div className="mt-10">
                  <NomesUh categoria={c} />
                </div>
                {nomes.cta_secundario && universoLink ? (
                  <Reveal className="mt-8">
                    <Link href={universoLink} className="btn btn-secondary">
                      {nomes.cta_secundario}
                      <Arrow />
                    </Link>
                  </Reveal>
                ) : null}
              </Section>
            ) : null}
          </>
        )}

        <Scene
          id="chamada-final"
          image={galeria[galeria.length - 1] ?? c.imagem}
          veil="cafe"
          veilOpacity={0.7}
          height="auto"
          align="center"
        >
          <Reveal className="scene-card">
            <Frame />
            <h2 className="text-title">
              <CopyText text={final.titulo ?? ""} />
            </h2>
            {final.texto ? (
              <CopyParagraphs text={final.texto} className="text-bege/90 mt-4 text-xl" />
            ) : null}
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {reservar("chamada_final", final.cta_primario)}
              {final.cta_secundario ? (
                <Link href={ctaHref(final.cta_secundario)} className="btn btn-ghost-light">
                  {final.cta_secundario}
                </Link>
              ) : null}
            </div>
          </Reveal>
        </Scene>
      </div>
    </div>
  );
}

/** Seção de texto com foto de detalhe ao lado (Perfis, Como chegar ao quarto). */
function ExtraSection({
  secao,
  image,
  foco,
  tone,
}: {
  secao: Secao;
  image?: string;
  /** Duplo King (5.5): o detalhe ganha foco e o resto da foto escurece 20% no hover. */
  foco: boolean;
  tone: "branco" | "bege";
}) {
  return (
    <Section id={idDe(secao.nome)} kicker={secao.kicker} title={secao.titulo} tone={tone}>
      <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
        <Reveal className="measure">
          {secao.texto ? <CopyParagraphs text={secao.texto} className="text-xl" /> : null}
        </Reveal>
        {image ? (
          <FramedImage
            id={image}
            ratio="4 / 3"
            sizes="(min-width: 64rem) 50vw, 100vw"
            className={foco ? "foco-card" : undefined}
          />
        ) : null}
      </div>
    </Section>
  );
}
