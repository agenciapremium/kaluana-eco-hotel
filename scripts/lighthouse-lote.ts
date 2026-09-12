/**
 * Lighthouse em todas as rotas do build (etapa 6).
 *
 * Mesmo motor e mesmo throttling simulado do `scripts/lighthouse.ts`, mas pela API do Node,
 * com um Chrome reaproveitado (reiniciado a cada 25 medições) e o resultado gravado a cada
 * rota, para a medição poder ser retomada. O Lighthouse limpa o armazenamento da origem antes
 * de cada medição, então toda rota é medida como primeira visita, com a abertura de sessão.
 *
 * Desempenho varia entre medições. Quando fica abaixo de 90, a rota é medida mais duas vezes e
 * vale a mediana das três (todas ficam registradas). Acessibilidade, boas práticas e SEO são
 * determinísticos e não se repetem. Em página com noindex, o SEO reprova de propósito no
 * critério `is-crawlable`: fica registrado e marcado.
 *
 * O relatório HTML só é gravado quando alguma categoria fecha abaixo de 90; o resumo com as
 * notas, as métricas e as auditorias reprovadas de todas as medições vai para
 * `docs/lighthouse/<etapa>/resumo-<fase>.json`.
 *
 * Uso: npm run lighthouse:lote -- --phase=pre --url=http://localhost:3100
 *        [--presets=mobile,desktop] [--rotas=/,/universo] [--out=docs/lighthouse/etapa-6] [--retomar]
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import * as chromeLauncher from "chrome-launcher";
import lighthouse, { desktopConfig } from "lighthouse";
import { arg, nomeDaRota, rotasDoBuild } from "./qa/rotas";

const phase = arg("phase", "pre");
const base = arg("url", "http://localhost:3100");
const presets = arg("presets", "mobile,desktop").split(",");
const out = resolve(process.cwd(), arg("out", "docs/lighthouse/etapa-6"));
const rotas = arg("rotas", "") ? arg("rotas", "").split(",") : rotasDoBuild();
const arquivo = resolve(out, `resumo-${phase}.json`);

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

type Resultado = NonNullable<Awaited<ReturnType<typeof lighthouse>>>;
type Lhr = Resultado["lhr"];

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

let chrome: chromeLauncher.LaunchedChrome | null = null;
let usos = 0;
async function porta() {
  if (!chrome || usos >= 25) {
    if (chrome) await chrome.kill();
    chrome = await chromeLauncher.launch({ chromeFlags: ["--headless=new", "--no-sandbox"] });
    usos = 0;
  }
  usos++;
  return chrome.port;
}

async function medir(rota: string, preset: string): Promise<Resultado> {
  const r = await lighthouse(
    `${base}${rota}`,
    {
      port: await porta(),
      output: "html",
      logLevel: "error",
      onlyCategories: [...categorias],
    },
    preset === "desktop" ? desktopConfig : undefined,
  );
  if (!r) throw new Error(`sem resultado para ${rota} (${preset})`);
  return r;
}

(async () => {
  mkdirSync(out, { recursive: true });
  const medicoes: Medicao[] =
    process.argv.includes("--retomar") && existsSync(arquivo)
      ? (JSON.parse(readFileSync(arquivo, "utf8")) as { medicoes: Medicao[] }).medicoes
      : [];
  const feito = new Set(medicoes.map((m) => `${m.rota}|${m.preset}`));
  const total = rotas.length * presets.length;
  let n = feito.size;

  for (const rota of rotas) {
    for (const preset of presets) {
      if (feito.has(`${rota}|${preset}`)) continue;
      n++;
      let r = await medir(rota, preset);
      const tentativas = [nota(r.lhr, "performance")];
      const execucoes = [r];
      while (tentativas[tentativas.length - 1] < 90 && tentativas.length < 3) {
        const nova = await medir(rota, preset);
        tentativas.push(nota(nova.lhr, "performance"));
        execucoes.push(nova);
      }
      if (tentativas.length > 1) {
        const alvo = mediana(tentativas);
        r = execucoes[tentativas.indexOf(alvo)];
      }
      const lhr = r.lhr;
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
        writeFileSync(resolve(out, nome), String(Array.isArray(r.report) ? r.report[0] : r.report));
        m.relatorio = nome;
      }
      medicoes.push(m);
      writeFileSync(
        arquivo,
        `${JSON.stringify({ fase: phase, base, lighthouse: lhr.lighthouseVersion, medicoes }, null, 2)}\n`,
      );
      process.stdout.write(
        `[${n}/${total}] ${rota} ${preset}: ${m.desempenho}${tentativas.length > 1 ? ` (${tentativas.join("/")})` : ""} ${m.acessibilidade} ${m.boasPraticas} ${m.seo}${noindex ? " noindex" : ""} LCP ${(m.lcpMs / 1000).toFixed(1)} s, ${m.pesoKB} KB${m.reprovadas.length ? ` ${m.reprovadas.join(",")}` : ""}\n`,
      );
    }
  }
  if (chrome) await (chrome as chromeLauncher.LaunchedChrome).kill();
})().catch(async (e: unknown) => {
  if (chrome) await chrome.kill();
  process.stderr.write(`lighthouse-lote: ${e instanceof Error ? e.stack : String(e)}\n`);
  process.exit(1);
});
