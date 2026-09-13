/**
 * Lighthouse em todas as rotas do build (etapa 6).
 *
 * Chama a CLI do Lighthouse num processo à parte para cada medição, com o mesmo throttling
 * simulado do `scripts/lighthouse.ts` das etapas anteriores. A API do Node não serve aqui: o
 * tsx transforma também o código do Lighthouse, e as funções que ele executa dentro da página
 * chegam lá com um auxiliar (__name) que o navegador não tem. Cada medição abre um Chrome novo,
 * com armazenamento limpo, então toda rota é medida como primeira visita, com a abertura de
 * sessão. O resultado é gravado a cada rota, para a medição poder ser retomada.
 *
 * Desempenho varia entre medições. Quando a primeira fica abaixo de 90, a rota é medida mais duas
 * vezes e vale a mediana das três (todas ficam registradas). Acessibilidade, boas práticas e SEO são
 * determinísticos e não se repetem. Em página com noindex, o SEO reprova de propósito no
 * critério `is-crawlable`: fica registrado e marcado.
 *
 * O relatório HTML só é guardado quando alguma categoria fecha abaixo de 90; o resumo com as
 * notas, as métricas e as auditorias reprovadas de todas as medições vai para
 * `docs/lighthouse/<etapa>/resumo-<fase>.json`.
 *
 * Uso: npm run lighthouse:lote -- --phase=pre --url=http://localhost:3100
 *        [--presets=mobile,desktop] [--rotas=/,/universo] [--out=docs/lighthouse/etapa-6] [--retomar] [--refazer]
 */
import { execFile } from "node:child_process";
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";
import type lighthouse from "lighthouse";
import { arg, nomeDaRota, rotasDoBuild } from "./qa/rotas";

const exec = promisify(execFile);

const phase = arg("phase", "pre");
const base = arg("url", "http://localhost:3100");
const presets = arg("presets", "mobile,desktop").split(",");
const out = resolve(process.cwd(), arg("out", "docs/lighthouse/etapa-6"));
const rotas = arg("rotas", "") ? arg("rotas", "").split(",") : rotasDoBuild();
const arquivo = resolve(out, `resumo-${phase}.json`);
const bin = resolve("node_modules/.bin/lighthouse");
const temporario = mkdtempSync(join(tmpdir(), "kaluana-lh-"));

const categorias = ["performance", "accessibility", "best-practices", "seo"] as const;

export type Medicao = {
  rota: string;
  fase: string;
  preset: string;
  desempenho: number;
  acessibilidade: number;
  boasPraticas: number;
  seo: number;
  tentativasDesempenho: number[];
  noindex: boolean;
  lcpMs: number;
  cls: number;
  tbtMs: number;
  fcpMs: number;
  pesoKB: number;
  reprovadas: string[];
  relatorio: string | null;
  data: string;
};

type Lhr = NonNullable<Awaited<ReturnType<typeof lighthouse>>>["lhr"];
type Execucao = { lhr: Lhr; html: string };

const nota = (lhr: Lhr, c: (typeof categorias)[number]) =>
  Math.round((lhr.categories[c]?.score ?? 0) * 100);
const numero = (lhr: Lhr, id: string) => lhr.audits[id]?.numericValue ?? 0;

/** Auditorias reprovadas fora de desempenho, que são as que apontam o que corrigir. */
function reprovadas(lhr: Lhr): string[] {
  const ids = new Set<string>();
  for (const c of ["accessibility", "best-practices", "seo"] as const) {
    for (const ref of lhr.categories[c]?.auditRefs ?? []) {
      const a = lhr.audits[ref.id];
      if (!a || a.score === null || a.score >= 1) continue;
      if (["notApplicable", "informative", "manual"].includes(a.scoreDisplayMode)) continue;
      ids.add(`${c}:${ref.id}`);
    }
  }
  return [...ids];
}

const mediana = (v: number[]) => [...v].sort((a, b) => a - b)[Math.floor(v.length / 2)];

let contador = 0;
async function medir(rota: string, preset: string): Promise<Execucao> {
  const saida = join(temporario, `${nomeDaRota(rota)}-${preset}-${contador++}`);
  const args = [
    `${base}${rota}`,
    "--output=json",
    "--output=html",
    `--output-path=${saida}`,
    `--only-categories=${categorias.join(",")}`,
    "--chrome-flags=--headless=new --no-sandbox",
    "--quiet",
  ];
  if (preset === "desktop") args.push("--preset=desktop");
  await exec(bin, args, { maxBuffer: 64 * 1024 * 1024 });
  return {
    lhr: JSON.parse(readFileSync(`${saida}.report.json`, "utf8")) as Lhr,
    html: `${saida}.report.html`,
  };
}

(async () => {
  mkdirSync(out, { recursive: true });
  const medicoes: Medicao[] =
    (process.argv.includes("--retomar") || process.argv.includes("--refazer")) &&
    existsSync(arquivo)
      ? (JSON.parse(readFileSync(arquivo, "utf8")) as { medicoes: Medicao[] }).medicoes
      : [];
  // --refazer: mede de novo as rotas e telas pedidas, substituindo o que já estava gravado.
  if (process.argv.includes("--refazer")) {
    const alvo = new Set(rotas.flatMap((r) => presets.map((p) => r + "|" + p)));
    const mantidas = medicoes.filter((m) => !alvo.has(m.rota + "|" + m.preset));
    medicoes.splice(0, medicoes.length, ...mantidas);
  }
  const feito = new Set(medicoes.map((m) => `${m.rota}|${m.preset}`));
  const total = rotas.length * presets.length;
  let n = feito.size;
  let versao = "";

  for (const rota of rotas) {
    for (const preset of presets) {
      if (feito.has(`${rota}|${preset}`)) continue;
      n++;
      let r = await medir(rota, preset);
      const tentativas = [nota(r.lhr, "performance")];
      const execucoes = [r];
      // Abaixo de 90: sempre mais duas medições, e vale a mediana das três. Parar na primeira
      // repetição acima de 90 escolheria sempre a melhor de duas.
      if (tentativas[0] < 90) {
        for (let i = 0; i < 2; i++) {
          const nova = await medir(rota, preset);
          tentativas.push(nota(nova.lhr, "performance"));
          execucoes.push(nova);
        }
        r = execucoes[tentativas.indexOf(mediana(tentativas))];
      }
      const lhr = r.lhr;
      versao = lhr.lighthouseVersion;
      const noindex = lhr.audits["is-crawlable"]?.score === 0;
      const m: Medicao = {
        rota,
        fase: phase,
        preset,
        desempenho: nota(lhr, "performance"),
        acessibilidade: nota(lhr, "accessibility"),
        boasPraticas: nota(lhr, "best-practices"),
        seo: nota(lhr, "seo"),
        tentativasDesempenho: tentativas,
        noindex,
        lcpMs: Math.round(numero(lhr, "largest-contentful-paint")),
        cls: Number(numero(lhr, "cumulative-layout-shift").toFixed(3)),
        tbtMs: Math.round(numero(lhr, "total-blocking-time")),
        fcpMs: Math.round(numero(lhr, "first-contentful-paint")),
        pesoKB: Math.round(numero(lhr, "total-byte-weight") / 1024),
        reprovadas: reprovadas(lhr),
        relatorio: null,
        data: new Date().toISOString(),
      };
      const abaixo =
        m.desempenho < 90 ||
        m.acessibilidade < 90 ||
        m.boasPraticas < 90 ||
        (m.seo < 90 && !noindex);
      if (abaixo) {
        const nome = `${nomeDaRota(rota)}-${phase}-${preset}.report.html`;
        copyFileSync(r.html, resolve(out, nome));
        m.relatorio = nome;
      }
      medicoes.push(m);
      writeFileSync(
        arquivo,
        `${JSON.stringify({ fase: phase, base, lighthouse: versao, medicoes }, null, 2)}\n`,
      );
      process.stdout.write(
        `[${n}/${total}] ${rota} ${preset}: ${m.desempenho}${tentativas.length > 1 ? ` (${tentativas.join("/")})` : ""} ${m.acessibilidade} ${m.boasPraticas} ${m.seo}${noindex ? " noindex" : ""} LCP ${(m.lcpMs / 1000).toFixed(1)} s, ${m.pesoKB} KB${m.reprovadas.length ? ` ${m.reprovadas.join(",")}` : ""}\n`,
      );
    }
  }
})().catch((e: unknown) => {
  process.stderr.write(`lighthouse-lote: ${e instanceof Error ? e.stack : String(e)}\n`);
  process.exit(1);
});
