/**
 * Confere os vetos de linguagem (CLAUDE.md, seção 3) no conteúdo e no código:
 * expressões eco genéricas, travessões, emojis e o telefone provisório.
 * Uso: npm run check:copy
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dirs = ["content", "app", "components", "lib"];
const vetos = [
  { re: /\bno verde\b/i, nome: "no verde" },
  { re: /conex[aã]o com a natureza/i, nome: "conexão com a natureza" },
  { re: /ref[uú]gio/i, nome: "refúgio" },
  { re: /para[ií]so/i, nome: "paraíso" },
  { re: /em harmonia com a natureza/i, nome: "em harmonia com a natureza" },
  { re: /[—–]/, nome: "travessão" },
  { re: /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u, nome: "emoji" },
  { re: /2201-0050/, nome: "telefone provisório" },
];

let problemas = 0;
function walk(dir: string) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    const st = statSync(p);
    if (st.isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(p);
      continue;
    }
    if (!/\.(tsx?|json|css|md)$/.test(name)) continue;
    if (name.endsWith(".json")) {
      // Conteúdo: percorre os valores, pulando notas internas (não vão para o site).
      walkJson(JSON.parse(readFileSync(p, "utf8")), relative(root, p), "");
      continue;
    }
    const linhas = readFileSync(p, "utf8").split("\n");
    linhas.forEach((linha, i) => {
      for (const v of vetos) {
        if (v.re.test(linha)) {
          problemas++;
          process.stdout.write(
            `${relative(root, p)}:${i + 1}: ${v.nome}: ${linha.trim().slice(0, 100)}\n`,
          );
        }
      }
    });
  }
}
function walkJson(value: unknown, file: string, path: string) {
  if (typeof value === "string") {
    for (const v of vetos) {
      if (v.re.test(value)) {
        problemas++;
        process.stdout.write(`${file} ${path}: ${v.nome}: ${value.trim().slice(0, 100)}\n`);
      }
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => walkJson(item, file, `${path}[${i}]`));
    return;
  }
  if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (k === "nota" || k === "notas" || k === "$comment") continue;
      walkJson(v, file, path ? `${path}.${k}` : k);
    }
  }
}

for (const d of dirs) walk(join(root, d));

/** Arquivos do build: páginas em HTML e respostas de rota (llms.txt, robots, sitemap). */
function arquivosDoBuild(dir: string): string[] {
  const out: string[] = [];
  const pilha = [dir];
  while (pilha.length) {
    const atual = pilha.pop() as string;
    for (const nome of readdirSync(atual)) {
      const p = join(atual, nome);
      if (statSync(p).isDirectory()) pilha.push(p);
      else if (nome.endsWith(".html") || nome.endsWith(".body")) out.push(p);
    }
  }
  return out;
}

/**
 * Se houver build, confere o que vai ao ar:
 *
 * 1. nenhum campo ⟨entre colchetes⟩ (veto 5), inclusive dentro de dados estruturados e de
 *    props de componente cliente;
 * 2. na fase `pre` (detectada pelo sitemap do build), nenhum número de quarto nem contagem de
 *    elementos (Parte 3.5);
 * 3. sem a autorização de Eventos (detectada pelo robots.txt do build), nenhuma menção a
 *    auditório ou centro de convenções e nenhum link para /eventos fora da própria página
 *    (veto 3);
 * 4. no build de produção (VERCEL_ENV=production), nenhum aviso interno de revisão.
 */
function conferirBuild() {
  const dir = join(root, ".next/server/app");
  if (!existsSync(dir)) {
    process.stdout.write("check-copy: sem build para conferir (rode npm run build antes)\n");
    return;
  }
  const ler = (nome: string) =>
    existsSync(join(dir, nome)) ? readFileSync(join(dir, nome), "utf8") : "";
  const fasePre = !ler("sitemap.xml.body").includes("/acomodacoes<");
  const eventosAutorizado = !/Disallow: \/eventos/.test(ler("robots.txt.body"));
  const producao = process.env.VERCEL_ENV === "production";

  const regras: { nome: string; re: RegExp; vale: (rota: string) => boolean }[] = [
    { nome: "campo pendente visível", re: /⟨[^⟩]{0,60}⟩/g, vale: () => true },
    ...(fasePre
      ? [
          { nome: "número de quarto na fase pre", re: /\bquartos? \d{3}\b/gi, vale: () => true },
          {
            nome: "contagem de elementos na fase pre",
            re: /\b(catorze|dezoito|dezessete) (rios|peixes|árvores|aves)\b|\bsetenta (quartos|apartamentos|nomes|histórias)\b/gi,
            vale: () => true,
          },
        ]
      : []),
    ...(eventosAutorizado
      ? []
      : [
          {
            nome: "auditório ou centro de convenções sem autorização",
            re: /audit[óo]rio|centro de conven[çc][õo]es/gi,
            vale: (rota: string) => !rota.startsWith("eventos"),
          },
          {
            nome: "link para /eventos sem autorização",
            re: /href="\/eventos"/g,
            vale: (rota: string) => !rota.startsWith("eventos"),
          },
        ]),
    ...(producao
      ? [
          {
            nome: "aviso interno no build de produção",
            re: /class="aviso-interno/g,
            vale: () => true,
          },
        ]
      : []),
  ];

  const arquivos = arquivosDoBuild(dir);
  for (const p of arquivos) {
    const rota = relative(dir, p);
    if (rota.startsWith("dev/")) continue;
    const texto = readFileSync(p, "utf8");
    for (const r of regras) {
      if (!r.vale(rota)) continue;
      const achados = texto.match(r.re);
      if (achados) {
        problemas++;
        process.stdout.write(
          `${rota}: ${r.nome}: ${[...new Set(achados)].slice(0, 5).join(", ")}\n`,
        );
      }
    }
  }
  process.stdout.write(
    `check-copy: ${arquivos.length} arquivo(s) do build conferidos (fase ${fasePre ? "pre" : "full"}, eventos ${eventosAutorizado ? "autorizado" : "sem autorização"}${producao ? ", produção" : ""})\n`,
  );
}

conferirBuild();

process.stdout.write(
  problemas ? `check-copy: ${problemas} ocorrência(s)\n` : "check-copy: nenhum veto encontrado\n",
);
process.exit(problemas ? 1 : 0);
