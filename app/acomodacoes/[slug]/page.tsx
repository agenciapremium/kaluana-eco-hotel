import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoriaPage } from "@/components/acomodacoes/CategoriaPage";
import { categorias, getCategoria } from "@/lib/acomodacoes";
import { phase } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

/** As sete categorias são estáticas; qualquer outro slug é 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return categorias.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = getCategoria(slug);
  if (!c) return {};
  const { seo } = c.pagina;
  return {
    title: { absolute: seo.title },
    description: seo.description,
    keywords: seo.keywords,
    alternates: { canonical: c.url },
    openGraph: { title: seo.title, description: seo.description, url: c.url },
    // Fase 0 (Parte 3.5): as categorias só entram no site na inauguração.
    ...(phase === "pre" ? { robots: { index: false, follow: false } } : {}),
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const c = getCategoria(slug);
  if (!c) notFound();
  return <CategoriaPage categoria={c} />;
}
