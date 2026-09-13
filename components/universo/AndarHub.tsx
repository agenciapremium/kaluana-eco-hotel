import type { CSSProperties } from "react";
import { CopyParagraphs, CopyText } from "@/components/Copy";
import { JsonLd } from "@/components/JsonLd";
import { Section } from "@/components/home/Section";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { HeroScene } from "@/components/scene/HeroScene";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { AmbientAudio } from "@/components/audio/AmbientAudio";
import { kickerDeQuartos, semContagem } from "@/lib/contagem";
import { getSecao } from "@/lib/content";
import type { Grupo, Pagina } from "@/lib/content-schema";
import { colecaoSchema } from "@/lib/schema";
import { motion as motionTokens, floors, type FloorKey } from "@/lib/tokens";
import { elementoUrl, heroId } from "@/lib/universo";
import { usosDe } from "@/lib/usos";
import { Bando } from "./Bando";
import { CardElemento } from "./CardElemento";
import { FiltroUso } from "./FiltroUso";
import { MapaBacia } from "./MapaBacia";
import { PaineisGuardioes } from "./PaineisGuardioes";

/** Atmosfera de fundo do hero de cada andar, gerada na etapa 1 (nunca ambiente do hotel). */
const atmosfera: Record<FloorKey, string> = {
  rios: "atmosfera/rio-mata",
  peixes: "atmosfera/agua-corrente",
  arvores: "atmosfera/copa-mata",
  aves: "atmosfera/ceu-entardecer",
  guardioes: "atmosfera/nevoa-mata",
};

/**
 * Loop de fundo do hero de cada andar (Higgsfield, kling3_0 a partir da atmosfera
 * correspondente). Um vídeo por página; o hub do Universo segue com as fotos paradas,
 * para não carregar cinco loops de uma vez (ver docs/decisoes.md).
 */
const videoDoAndar: Record<FloorKey, string> = {
  rios: "andar-rios",
  peixes: "andar-peixes",
  arvores: "andar-arvores",
  aves: "andar-aves",
  guardioes: "andar-guardioes",
};

/** Proporção dos cards por andar: as árvores são fotos verticais. */
const ratio: Record<FloorKey, string> = {
  rios: "4 / 3",
  peixes: "4 / 3",
  arvores: "3 / 4",
  aves: "1 / 1",
  guardioes: "3 / 4",
};

type Props = { pagina: Pagina; grupo: FloorKey; dados: Grupo };

/**
 * Hub de andar (5.12 a 5.16): hero em atmosfera, lista dos elementos e a seção final
 * própria de cada andar. Cada andar tem o seu movimento, descrito no documento mestre.
 */
export function AndarHub({ pagina, grupo, dados }: Props) {
  const hero = getSecao(pagina, "Hero");
  const lista = getSecao(pagina, "Lista");
  const extras = pagina.secoes.filter((s) => !["Hero", "Lista"].includes(s.nome));
  const andar = floors[grupo];
  const itens = dados.itens;

  const grade = (
    <ul className="grade-elementos" data-andar={grupo}>
      {itens.map((item, i) => (
        <li key={item.id} data-rio-card={grupo === "rios" ? item.id : undefined}>
          <CardElemento
            item={item}
            grupo={grupo}
            ratio={ratio[grupo]}
            delay={(i % 4) * motionTokens.stagger.min}
            style={{ "--f": i % 5 } as CSSProperties}
          />
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="andar-page"
      data-andar={grupo}
      style={{ "--accent": andar.accent } as CSSProperties}
    >
      <JsonLd
        data={colecaoSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: semContagem(pagina.seo.resposta.trim()),
          itens: itens.map((it) => ({
            url: elementoUrl(grupo, it.id),
            nome: it.nome,
            imagem: heroId(grupo, it.id),
          })),
        })}
      />

      <HeroScene
        image={atmosfera[grupo]}
        video={videoDoAndar[grupo]}
        kicker={hero.kicker}
        title={pagina.seo.h1}
        lead={semContagem(hero.titulo ?? "")}
        leadClassName="hero-headline"
        text={hero.texto ? <CopyParagraphs text={semContagem(hero.texto)} /> : null}
        actions={<AmbientAudio andar={grupo} elemento={`andar-${grupo}`} />}
        veilOpacity={0.6}
      />

      <div id="conteudo-principal">
        <div className="container-site py-5">
          <Breadcrumbs
            items={[
              { name: "Universo Kaluanã", url: "/universo" },
              { name: pagina.seo.h1, url: pagina.url },
            ]}
          />
        </div>

        {grupo === "rios" ? (
          <section className="section-y-sm">
            <div className="container-site">
              <MapaBacia />
            </div>
          </section>
        ) : null}

        <Section
          id="lista"
          kicker={kickerDeQuartos(lista.kicker)}
          title={semContagem(lista.titulo ?? "")}
        >
          <div className="mt-12">
            {grupo === "aves" ? <Bando /> : null}
            {grupo === "guardioes" ? (
              <PaineisGuardioes itens={itens} />
            ) : grupo === "arvores" ? (
              <FiltroUso
                items={itens.map((item, i) => ({
                  id: item.id,
                  usos: usosDe(item.id),
                  node: (
                    <CardElemento
                      item={item}
                      grupo={grupo}
                      ratio={ratio[grupo]}
                      delay={(i % 4) * motionTokens.stagger.min}
                    />
                  ),
                }))}
              />
            ) : (
              grade
            )}
          </div>
        </Section>

        {extras.map((s) => (
          <Section key={s.nome} kicker={s.kicker} title={semContagem(s.titulo ?? "")} tone="branco">
            <Reveal className="measure mt-6">
              {s.texto ? <CopyParagraphs text={semContagem(s.texto)} className="text-xl" /> : null}
              {s.cta_secundario ? (
                <Link
                  href={s.nome === "À mesa" ? "/restaurante" : "/o-kaluana"}
                  className="btn btn-secondary mt-8"
                >
                  {s.cta_secundario}
                  <Arrow />
                </Link>
              ) : null}
            </Reveal>
          </Section>
        ))}

        <div className="container-site pb-16">
          <Reveal className="andar-rodape">
            <Link href="/universo" className="btn btn-secondary">
              Voltar ao Universo
            </Link>
            <p className="andar-rodape-texto">
              <CopyText text={semContagem(dados.intro_grupo.split(/\n\s*\n/)[0])} />
            </p>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
