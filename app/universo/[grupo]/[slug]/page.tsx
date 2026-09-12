import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ElementoPage } from "@/components/universo/ElementoPage";
import { semNumeroDeQuarto } from "@/lib/contagem";
import { getElemento, isFloorKey, todosOsElementos } from "@/lib/universo";

type Props = { params: Promise<{ grupo: string; slug: string }> };

/** Os 70 elementos são estáticos; qualquer outro endereço é 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return todosOsElementos().map(({ grupo, id }) => ({ grupo, slug: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { grupo, slug } = await params;
  if (!isFloorKey(grupo)) return {};
  const e = getElemento(grupo, slug);
  if (!e) return {};
  const { seo } = e.item;
  // Na pré-inauguração a descrição não leva o número do quarto (Parte 3.5).
  const description = semNumeroDeQuarto(seo.description);
  return {
    title: { absolute: seo.title },
    description,
    keywords: seo.keywords,
    // Canônica sem o parâmetro de quarto (Parte 6.0).
    alternates: { canonical: e.url },
    openGraph: { title: seo.title, description, url: e.url, type: "article" },
  };
}

export default async function Page({ params }: Props) {
  const { grupo, slug } = await params;
  if (!isFloorKey(grupo)) notFound();
  const elemento = getElemento(grupo, slug);
  if (!elemento) notFound();
  return <ElementoPage elemento={elemento} />;
}
