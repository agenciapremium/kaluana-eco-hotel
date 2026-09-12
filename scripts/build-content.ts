/**
 * Lê ../DOCS/SITE/dados/*.yaml, valida com Zod e grava JSON tipado em content/.
 *
 * Saídas:
 *   content/<grupo>.json      um por andar (rios, peixes, arvores, aves, guardioes)
 *   content/paginas.json      as 30 páginas, indexadas por id
 *   content/qr-map.json       UH -> URL canônica (tabela da Parte 6.1)
 *   content/universo-index.json  índice leve dos 70 elementos
 *
 * Na Vercel a pasta DOCS não existe: o script então apenas confere se os JSON
 * versionados estão presentes e segue. Os JSON são versionados por isso.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { parse } from "yaml";
import {
  floorKeys,
  GrupoSchema,
  PaginasArquivoSchema,
  type FloorKey,
  type Grupo,
  type Pagina,
  type QrMap,
  type UniversoIndexEntry,
} from "../lib/content-schema";

const root = process.cwd();
const dadosDir = resolve(root, "../DOCS/SITE/dados");
const outDir = resolve(root, "content");
const outputs = [...floorKeys.map((k) => `${k}.json`), "paginas.json", "qr-map.json", "universo-index.json"];

mkdirSync(outDir, { recursive: true });

if (!existsSync(dadosDir)) {
  const missing = outputs.filter((f) => !existsSync(resolve(outDir, f)));
  if (missing.length) {
    process.stderr.write(`content: DOCS ausente e JSON faltando: ${missing.join(", ")}\n`);
    process.exit(1);
  }
  process.stdout.write("content: DOCS ausente, usando os JSON versionados em content/\n");
  process.exit(0);
}

const grupos = {} as Record<FloorKey, Grupo>;
for (const key of floorKeys) {
  const raw = parse(readFileSync(resolve(dadosDir, `${key}.yaml`), "utf8"));
  const result = GrupoSchema.safeParse(raw);
  if (!result.success) {
    process.stderr.write(`content: ${key}.yaml inválido\n${formatIssues(result.error.issues)}\n`);
    process.exit(1);
  }
  if (result.data.grupo !== key) {
    process.stderr.write(`content: ${key}.yaml declara grupo "${result.data.grupo}"\n`);
    process.exit(1);
  }
  grupos[key] = result.data;
  write(`${key}.json`, result.data);
}

const paginas: Pagina[] = [];
for (const file of ["paginas-1.yaml", "paginas-2.yaml"]) {
  const raw = parse(readFileSync(resolve(dadosDir, file), "utf8"));
  const result = PaginasArquivoSchema.safeParse(raw);
  if (!result.success) {
    process.stderr.write(`content: ${file} inválido\n${formatIssues(result.error.issues)}\n`);
    process.exit(1);
  }
  paginas.push(...result.data.paginas);
}
const paginasPorId: Record<string, Pagina> = {};
for (const p of paginas) {
  if (paginasPorId[p.id]) {
    process.stderr.write(`content: página duplicada "${p.id}"\n`);
    process.exit(1);
  }
  paginasPorId[p.id] = p;
}
write("paginas.json", paginasPorId);

// Categoria de cada UH, a partir das páginas de categoria (campo uhs).
const categoriaPorUh = new Map<string, { nome: string; url: string }>();
for (const p of paginas) {
  if (!p.uhs) continue;
  for (const uh of p.uhs) {
    if (categoriaPorUh.has(uh)) {
      process.stderr.write(`content: UH ${uh} em duas categorias\n`);
      process.exit(1);
    }
    categoriaPorUh.set(uh, { nome: p.nome, url: p.url });
  }
}

const qrMap: QrMap = {};
const index: UniversoIndexEntry[] = [];
let ordem = 0;
for (const key of floorKeys) {
  const g = grupos[key];
  for (const item of g.itens) {
    if (qrMap[item.uh]) {
      process.stderr.write(`content: UH ${item.uh} duplicada (${item.id})\n`);
      process.exit(1);
    }
    const url = `/universo/${key}/${item.id}`;
    const categoria = categoriaPorUh.get(item.uh) ?? null;
    qrMap[item.uh] = {
      uh: item.uh,
      grupo: key,
      andar: g.andar,
      slug: item.id,
      nome: item.nome,
      url,
      categoria: categoria?.nome ?? null,
      categoriaUrl: categoria?.url ?? null,
    };
    index.push({
      id: item.id,
      nome: item.nome,
      subtitulo: item.subtitulo,
      cientifico: item.cientifico ?? null,
      grupo: key,
      andar: g.andar,
      uh: item.uh,
      url,
      hero: item.imagens.find((i) => i.uso === "hero")?.arquivo ?? null,
      ordem: ordem++,
    });
  }
}
write("qr-map.json", qrMap);
write("universo-index.json", index);

const total = Object.keys(qrMap).length;
const semCategoria = Object.values(qrMap).filter((e) => !e.categoria).length;
process.stdout.write(
  `content: ${floorKeys.length} andares, ${total} elementos, ${paginas.length} páginas, ${semCategoria} UH sem categoria\n`,
);

function write(name: string, data: unknown) {
  writeFileSync(resolve(outDir, name), JSON.stringify(data, null, 2) + "\n");
}

function formatIssues(issues: { path: PropertyKey[]; message: string }[]) {
  return issues
    .slice(0, 20)
    .map((i) => `  ${i.path.map(String).join(".")}: ${i.message}`)
    .join("\n");
}
