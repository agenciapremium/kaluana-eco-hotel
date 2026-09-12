/**
 * Lighthouse em uma rota (mobile por padrão). Grava JSON e HTML em docs/lighthouse/<etapa>/.
 * Uso: npm run lighthouse -- --phase=pre --url=http://localhost:3000 [--path=/acomodacoes] [--preset=desktop] [--out=docs/lighthouse/etapa-2]
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const arg = (k: string, d: string) =>
  process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const phase = arg("phase", "pre");
const url = arg("url", "http://localhost:3000");
const preset = arg("preset", "mobile");
const path = arg("path", "/");
const name = path === "/" ? "home" : path.replace(/^\/|\/$/g, "").replace(/\//g, "-");
const outDir = resolve(process.cwd(), arg("out", "docs/lighthouse/etapa-1"));
mkdirSync(outDir, { recursive: true });
const base = resolve(outDir, `${name}-${phase}-${preset}`);

const args = [
  `${url}${path}`,
  "--output=json",
  "--output=html",
  `--output-path=${base}`,
  "--only-categories=performance,accessibility,best-practices,seo",
  "--chrome-flags=--headless=new --no-sandbox",
  "--quiet",
];
if (preset === "desktop") args.push("--preset=desktop");

execFileSync("npx", ["lighthouse", ...args], { stdio: "inherit" });

const report = JSON.parse(readFileSync(`${base}.report.json`, "utf8")) as {
  categories: Record<string, { score: number | null }>;
  audits: Record<string, { numericValue?: number; displayValue?: string }>;
};
const linha = Object.entries(report.categories)
  .map(([k, v]) => `${k}=${Math.round((v.score ?? 0) * 100)}`)
  .join(" ");
const lcp = report.audits["largest-contentful-paint"]?.displayValue ?? "";
const cls = report.audits["cumulative-layout-shift"]?.displayValue ?? "";
process.stdout.write(`lighthouse ${name} ${phase} ${preset}: ${linha} (LCP ${lcp}, CLS ${cls})\n`);
