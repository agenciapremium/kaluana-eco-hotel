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

/**
 * Se houver build, confere o HTML gerado: nenhum campo ⟨entre colchetes⟩ pode chegar à
 * produção (veto 5). É a checagem que pega o que escapa dos componentes, inclusive dentro
 * de dados estruturados.
 */
function conferirBuild() {
  const dir = join(root, ".next/server/app");
  if (!existsSync(dir)) {
    process.stdout.write("check-copy: sem build para conferir (rode npm run build antes)\n");
    return;
  }
  const pilha = [dir];
  let arquivos = 0;
  while (pilha.length) {
    const atual = pilha.pop() as string;
    for (const nome of readdirSync(atual)) {
      const p = join(atual, nome);
      if (statSync(p).isDirectory()) {
        pilha.push(p);
        continue;
      }
      if (!nome.endsWith(".html")) continue;
      arquivos++;
      const html = readFileSync(p, "utf8");
      const achados = html.match(/⟨[^⟩]{0,60}⟩/g);
      if (achados) {
        problemas++;
        process.stdout.write(
          `${relative(root, p)}: campo pendente visível: ${[...new Set(achados)].join(", ")}\n`,
        );
      }
    }
  }
  process.stdout.write(`check-copy: ${arquivos} página(s) do build conferidas\n`);
}

conferirBuild();

process.stdout.write(
  problemas ? `check-copy: ${problemas} ocorrência(s)\n` : "check-copy: nenhum veto encontrado\n",
);
process.exit(problemas ? 1 : 0);
