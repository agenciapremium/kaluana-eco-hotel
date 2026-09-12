import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AndarHub } from "@/components/universo/AndarHub";
import { semContagem } from "@/lib/contagem";
import { getPagina } from "@/lib/content";
import { getGrupoUniverso, isFloorKey } from "@/lib/universo";
import { floorOrder } from "@/lib/tokens";

type Props = { params: Promise<{ grupo: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return floorOrder.map((grupo) => ({ grupo }));
}

/** A página de cada andar em content/paginas.json usa o id "universo-<grupo>". */
const paginaId = (grupo: string) => `universo-${grupo}`;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grupo } = await params;
  if (!isFloorKey(grupo)) return {};
  const pagina = getPagina(paginaId(grupo));
  const title = semContagem(pagina.seo.title);
  const description = semContagem(pagina.seo.description);
  return {
    title: { absolute: title },
    description,
    keywords: pagina.seo.keywords,
    alternates: { canonical: pagina.url },
    openGraph: { title, description, url: pagina.url },
  };
}

export default async function Page({ params }: Props) {
  const { grupo } = await params;
  if (!isFloorKey(grupo)) notFound();
  return (
    <AndarHub pagina={getPagina(paginaId(grupo))} grupo={grupo} dados={getGrupoUniverso(grupo)} />
  );
}
