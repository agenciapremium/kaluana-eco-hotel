/**
 * Histórias: acesso aos posts processados em content/posts.json (gerado de posts/*.yaml
 * por scripts/build-posts.ts). Já vêm ordenados do mais recente para o mais antigo.
 */
import postsJson from "@/content/posts.json";
import { categoriasDePost, type CategoriaPost, type Post } from "./content-schema";

export const posts = postsJson as unknown as Post[];

/** Rótulos das categorias, na ordem da seção "Assuntos" (5.21). */
export const rotuloDaCategoria: Record<CategoriaPost, string> = {
  obra: "Obra",
  nomes: "Nomes",
  "ji-parana": "Ji-Paraná",
  hotel: "Hotel",
};

/** Só as categorias que têm post, para não mostrar chip que não filtra nada. */
export function categoriasComPost(): CategoriaPost[] {
  return categoriasDePost.filter((c) => posts.some((p) => p.categoria === c));
}

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export function postUrl(slug: string) {
  return `/historias/${slug}`;
}

/**
 * Até três relacionados (5.22): primeiro os da mesma categoria, depois os mais recentes.
 */
export function relacionados(slug: string, quantos = 3): Post[] {
  const atual = getPost(slug);
  if (!atual) return [];
  const outros = posts.filter((p) => p.slug !== slug);
  const mesma = outros.filter((p) => p.categoria === atual.categoria);
  const resto = outros.filter((p) => p.categoria !== atual.categoria);
  return [...mesma, ...resto].slice(0, quantos);
}

/** Estimativa de tempo de leitura, a 200 palavras por minuto (5.22). */
export function tempoDeLeitura(post: Post): number {
  const texto = [
    post.abertura,
    ...post.corpo.map((b) =>
      b.tipo === "lista" ? b.itens.join(" ") : b.tipo === "imagem" ? b.legenda : b.texto,
    ),
    post.a_seguir ?? "",
  ].join(" ");
  return Math.max(1, Math.round(texto.trim().split(/\s+/).length / 200));
}

/** Data por extenso, como aparece na listagem e no post. */
export function dataPorExtenso(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Paginação da listagem: 12 por página (5.21). */
export const postsPorPagina = 12;
