import type { Metadata } from "next";
import { foraDoIndiceNaPre } from "@/lib/seo";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { Cardapio, type Refeicao } from "@/components/restaurante/Cardapio";
import { FramedImage } from "@/components/scene/FramedImage";
import { HeroScene } from "@/components/scene/HeroScene";
import { Scene } from "@/components/scene/Scene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { getPagina, getSecao } from "@/lib/content";
import { copyDeProducao, splitParagraphs } from "@/lib/copy";
import { getImage, hasImage, imageSrc } from "@/lib/media";
import { restaurantSchema } from "@/lib/schema";
import { isProduction, siteUrl } from "@/lib/site";

const pagina = getPagina("restaurante");

export const metadata: Metadata = {
  title: { absolute: pagina.seo.title },
  description: pagina.seo.description,
  keywords: pagina.seo.keywords,
  alternates: { canonical: pagina.url },
  ...foraDoIndiceNaPre,
  openGraph: { title: pagina.seo.title, description: pagina.seo.description, url: pagina.url },
};

const img = {
  hero: "restaurante/peixe-na-tigela",
  cozinha: "restaurante/lasca-de-peixe",
  tigelas: "restaurante/farinha-e-pirao",
  manha: "restaurante/cafe-da-manha",
  almoco: "restaurante/mesa-ao-meio-dia",
  empresas: "restaurante/guardanapos-em-fila",
} as const;

/**
 * Restaurante Kaluanã (5.18). Aberto à cidade, não só ao hóspede.
 *
 * O schema Restaurant não declara horário nem cardápio: os dois são campos pendentes com o
 * cliente, e a regra é declarar só o que a página mostra (Parte 4.3).
 */
export default function Page() {
  const hero = getSecao(pagina, "Hero");
  const cozinha = getSecao(pagina, "Cozinha");
  const horarios = getSecao(pagina, "Horários");
  const empresas = getSecao(pagina, "Para empresas");
  const final = getSecao(pagina, "Chamada final");

  // A copy dos horários é uma frase por refeição, na ordem café, almoço e jantar.
  // O texto vai saneado para o componente cliente: prop viaja no HTML servido.
  const cru = splitParagraphs(horarios.texto ?? "")[0]?.split(/(?<=\.)\s+/) ?? [];
  const frases = isProduction ? cru.map((f) => copyDeProducao(f)) : cru;
  const refeicoes: Refeicao[] = (
    [
      { id: "cafe", nome: "Café da manhã", texto: frases[0] ?? "", faixa: [5, 11] },
      { id: "almoco", nome: "Almoço", texto: frases[1] ?? "", faixa: [11, 16] },
      { id: "jantar", nome: "Jantar", texto: frases[2] ?? "", faixa: [18, 24] },
    ] satisfies Refeicao[]
  ).filter((_, i) => Boolean(cru[i]));
  const observacao = frases.slice(3).filter(Boolean).join(" ");

  return (
    <>
      <JsonLd
        data={restaurantSchema({
          url: pagina.url,
          descricao: pagina.seo.resposta.trim(),
          cozinhas: ["Amazônica", "Brasileira", "Peixes de água doce"],
          image: hasImage(img.hero)
            ? `${siteUrl}${imageSrc(getImage(img.hero), 1600, "webp")}`
            : undefined,
        })}
      />

      <HeroScene
        image={img.hero}
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={hero.titulo}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={hero.texto} /> : null}
        veilOpacity={0.58}
        actions={
          <>
            <Link href="/contato" className="btn btn-inverse">
              {hero.cta_primario}
              <Arrow />
            </Link>
            <a href="#quando" className="btn btn-ghost-light">
              {hero.cta_secundario}
            </a>
          </>
        }
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
        </div>

        <Section id="cozinha" kicker={cozinha.kicker} title={cozinha.titulo}>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {cozinha.texto ? <CopyParagraphs text={cozinha.texto} className="text-xl" /> : null}
              <Link href="/universo/peixes" className="btn btn-secondary mt-8">
                Os peixes do Universo
                <Arrow />
              </Link>
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <FramedImage id={img.cozinha} ratio="3 / 4" sizes="(min-width: 64rem) 24vw, 45vw" />
              <FramedImage
                id={img.tigelas}
                ratio="3 / 4"
                sizes="(min-width: 64rem) 24vw, 45vw"
                className="sm:mt-10"
              />
            </div>
          </div>
        </Section>

        <Section id="quando" kicker={horarios.kicker} title={horarios.titulo} tone="branco">
          <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
            <Reveal>
              <Cardapio refeicoes={refeicoes} />
              {observacao ? (
                <p className="mt-6 text-base">
                  <CopyText text={observacao} />
                </p>
              ) : null}
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2">
              <FramedImage id={img.manha} ratio="1 / 1" sizes="(min-width: 64rem) 24vw, 45vw" />
              <FramedImage
                id={img.almoco}
                ratio="1 / 1"
                sizes="(min-width: 64rem) 24vw, 45vw"
                className="sm:mt-8"
              />
            </div>
          </div>
        </Section>

        <Section id="empresas" kicker={empresas.kicker} title={empresas.titulo}>
          <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
            <Reveal className="measure">
              {empresas.texto ? <CopyParagraphs text={empresas.texto} className="text-xl" /> : null}
              <Link href="/contato" className="btn btn-secondary mt-8">
                {empresas.cta_secundario}
                <Arrow />
              </Link>
            </Reveal>
            <FramedImage id={img.empresas} ratio="4 / 3" sizes="(min-width: 64rem) 50vw, 100vw" />
          </div>
        </Section>

        <Scene id="chamada-final" image={img.hero} veil="preto" veilOpacity={0.7} align="center">
          <Reveal className="scene-card">
            <h2 className="text-title">
              <CopyText text={final.titulo ?? ""} />
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contato" className="btn btn-inverse">
                {final.cta_primario}
                <Arrow />
              </Link>
              <Link href="/ji-parana" className="btn btn-ghost-light">
                {final.cta_secundario}
              </Link>
            </div>
          </Reveal>
        </Scene>
      </div>
    </>
  );
}
