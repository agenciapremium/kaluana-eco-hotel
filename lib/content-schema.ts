/**
 * Schemas Zod dos dados em ../DOCS/SITE/dados/*.yaml.
 * Usados por scripts/build-content.ts (validação) e por lib/content.ts (tipos).
 */
import { z } from "zod";

export const floorKeys = ["rios", "peixes", "arvores", "aves", "guardioes"] as const;
export const FloorKeySchema = z.enum(floorKeys);

export const FaqSchema = z.object({
  p: z.string().min(1),
  r: z.string().min(1),
});

export const ImagemSchema = z.object({
  /** Caminho relativo à pasta FOTOS. Nulo quando o elemento não tem imagem. */
  arquivo: z.string().nullable(),
  uso: z.enum(["hero", "galeria"]),
  nota: z.string().optional(),
});

export const SeoItemSchema = z.object({
  title: z.string().min(1).max(60),
  description: z.string().min(1).max(160),
  keywords: z.array(z.string()),
  resposta: z.string().min(1),
});

export const ItemSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  nome: z.string().min(1),
  subtitulo: z.string().min(1),
  cientifico: z.string().optional(),
  categoria: z.string().optional(),
  uh: z.string().regex(/^[1-4]\d{2}$/),
  quarto: z.number().int().nullable(),
  abertura: z.string().min(1),
  no_kaluana: z.string().min(1),
  historia: z.string().min(1),
  curiosidades: z.array(z.string().min(1)),
  ficha: z.array(z.tuple([z.string(), z.string()])),
  faq: z.array(FaqSchema),
  seo: SeoItemSchema,
  imagens: z.array(ImagemSchema),
});

export const GrupoSchema = z.object({
  grupo: FloorKeySchema,
  nome_grupo: z.string().min(1),
  andar: z.number().int().min(1).max(4),
  cor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  intro_grupo: z.string().min(1),
  itens: z.array(ItemSchema).min(1),
});

export const SecaoSchema = z.object({
  nome: z.string().min(1),
  kicker: z.string().nullable().optional(),
  titulo: z.string().optional(),
  texto: z.string().optional(),
  cta_primario: z.string().optional(),
  cta_secundario: z.string().optional(),
  imagem: z.string().optional(),
  nota: z.string().optional(),
});

export const SeoPaginaSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  h1: z.string().min(1),
  keywords: z.array(z.string()),
  schema: z.array(z.string()),
  resposta: z.string().min(1),
});

export const PaginaSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  url: z.string().min(1),
  nome: z.string().min(1),
  tipo: z.string().min(1),
  pai: z.string().nullable(),
  ordem: z.number().int(),
  codigo: z.string().optional(),
  capacidade: z.number().int().optional(),
  objetivo: z.string().min(1),
  publico: z.string().min(1),
  seo: SeoPaginaSchema,
  movimento: z.string().min(1),
  secoes: z.array(SecaoSchema),
  links_internos: z.array(z.string()),
  notas: z.array(z.string()).optional(),
  uhs: z.array(z.string().regex(/^[1-4]\d{2}$/)).optional(),
  faq: z.array(FaqSchema).optional(),
});

export const PaginasArquivoSchema = z.object({
  paginas: z.array(PaginaSchema).min(1),
});

/** Uma linha da tabela de redirecionamento dos QR Codes (Parte 6.1). */
export const QrEntrySchema = z.object({
  uh: z.string(),
  grupo: FloorKeySchema,
  andar: z.number().int(),
  slug: z.string(),
  nome: z.string(),
  url: z.string(),
  categoria: z.string().nullable(),
  categoriaUrl: z.string().nullable(),
});

export const QrMapSchema = z.record(z.string(), QrEntrySchema);

/** Índice leve dos 70 elementos, para busca e navegação. */
export const UniversoIndexEntrySchema = z.object({
  id: z.string(),
  nome: z.string(),
  subtitulo: z.string(),
  cientifico: z.string().nullable(),
  grupo: FloorKeySchema,
  andar: z.number().int(),
  uh: z.string(),
  url: z.string(),
  hero: z.string().nullable(),
  ordem: z.number().int(),
});

export type FloorKey = z.infer<typeof FloorKeySchema>;
export type Faq = z.infer<typeof FaqSchema>;
export type Imagem = z.infer<typeof ImagemSchema>;
export type Item = z.infer<typeof ItemSchema>;
export type Grupo = z.infer<typeof GrupoSchema>;
export type Secao = z.infer<typeof SecaoSchema>;
export type Pagina = z.infer<typeof PaginaSchema>;
export type QrEntry = z.infer<typeof QrEntrySchema>;
export type QrMap = z.infer<typeof QrMapSchema>;
export type UniversoIndexEntry = z.infer<typeof UniversoIndexEntrySchema>;

/* ------------------------------------------------------------------
   Histórias (etapa 4). Os posts não vêm de DOCS: são escritos no
   repositório do site, em posts/*.yaml, e validados aqui.
   ------------------------------------------------------------------ */

export const categoriasDePost = ["obra", "nomes", "ji-parana", "hotel"] as const;
export const CategoriaPostSchema = z.enum(categoriasDePost);

/** Bloco do corpo do post. Sem markdown: a estrutura é explícita e validada. */
export const BlocoPostSchema = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("paragrafo"), texto: z.string().min(1) }),
  z.object({ tipo: z.literal("subtitulo"), texto: z.string().min(1) }),
  z.object({ tipo: z.literal("citacao"), texto: z.string().min(1) }),
  z.object({ tipo: z.literal("lista"), itens: z.array(z.string().min(1)).min(1) }),
  z.object({
    tipo: z.literal("imagem"),
    /** Id no manifesto de mídia (content/media.json). */
    id: z.string().min(1),
    legenda: z.string().min(1),
  }),
]);

export const PostSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  titulo: z.string().min(1),
  /** Resumo de até 155 caracteres: vira a meta description (5.22). */
  resumo: z.string().min(1).max(155),
  categoria: CategoriaPostSchema,
  /** Data de publicação, ISO (AAAA-MM-DD). */
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  atualizado: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  /** Imagem de capa: id no manifesto de mídia. */
  capa: z.string().min(1),
  keywords: z.array(z.string()).default([]),
  /** Primeiro parágrafo, escrito como resposta direta ao tema (até 60 palavras). */
  abertura: z.string().min(1),
  corpo: z.array(BlocoPostSchema).min(1),
  /** Bloco final "o que vem a seguir" (5.22). */
  a_seguir: z.string().optional(),
  /** Links para páginas do site, um por post no mínimo (Parte 3.3). */
  links: z.array(z.string()).default([]),
  /** Copy fora do documento mestre, a revisar. */
  revisar: z.boolean().default(false),
});

export const PostsArquivoSchema = z.array(PostSchema);

export type CategoriaPost = z.infer<typeof CategoriaPostSchema>;
export type BlocoPost = z.infer<typeof BlocoPostSchema>;
export type Post = z.infer<typeof PostSchema>;
