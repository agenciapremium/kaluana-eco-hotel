/**
 * Posts de Histórias: lê posts/*.yaml, valida com Zod e grava content/posts.json.
 *
 * Ao contrário do resto do conteúdo, os posts não vêm de DOCS: são escritos no repositório
 * do site pela agência. Por isso este script roda sempre, inclusive na Vercel, e entra no
 * prebuild junto com o de conteúdo.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import { PostsArquivoSchema, type Post } from "../lib/content-schema";

const root = process.cwd();
const dir = resolve(root, "posts");
const saida = resolve(root, "content/posts.json");

const arquivos = existsSync(dir) ? readdirSync(dir).filter((f) => /\.ya?ml$/.test(f)) : [];
const posts: Post[] = [];

for (const nome of arquivos) {
  const bruto = parse(readFileSync(resolve(dir, nome), "utf8")) as unknown;
  const r = PostSchema_safeParse(bruto, nome);
  posts.push(r);
}

function PostSchema_safeParse(bruto: unknown, nome: string): Post {
  const r = PostsArquivoSchema.element.safeParse(bruto);
  if (!r.success) {
    process.stderr.write(`posts: ${nome} inválido\n${JSON.stringify(r.error.issues, null, 2)}\n`);
    process.exit(1);
  }
  return r.data;
}

// Mais recentes primeiro, que é a ordem da listagem (5.21).
posts.sort((a, b) => (a.data < b.data ? 1 : a.data > b.data ? -1 : a.slug.localeCompare(b.slug)));

const slugs = new Set<string>();
for (const p of posts) {
  if (slugs.has(p.slug)) {
    process.stderr.write(`posts: slug repetido: ${p.slug}\n`);
    process.exit(1);
  }
  slugs.add(p.slug);
}

mkdirSync(resolve(root, "content"), { recursive: true });
writeFileSync(saida, JSON.stringify(posts, null, 2) + "\n");
process.stdout.write(
  `posts: ${posts.length} post(s) em content/posts.json${posts.some((p) => p.revisar) ? ` (${posts.filter((p) => p.revisar).length} a revisar)` : ""}\n`,
);
