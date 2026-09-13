/**
 * Resumo do Lighthouse em lote (etapa 6): lê `resumo-pre.json` e `resumo-full.json` e grava
 * `README.md` na mesma pasta, com as notas por grupo de página, o que ficou abaixo de 90, os
 * orçamentos de peso da Parte 2.6 (Home abaixo de 2,5 MB, página do Universo abaixo de 700 KB)
 * e a tabela de todas as rotas.
 *
 * Uso: npm run lighthouse:resumo -- [--out=docs/lighthouse/etapa-6]
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Medicao } from "./lighthouse-lote";
import { arg } from "./qa/rotas";

const out = resolve(process.cwd(), arg("out", "docs/lighthouse/etapa-6"));

const grupos: { nome: string; re: RegExp }[] = [
  { nome: "Home", re: /^\/$/ },
  { nome: "Hub do Universo", re: /^\/universo$/ },
  { nome: "Hubs de andar (5)", re: /^\/universo\/[^/]+$/ },
  { nome: "Páginas de elemento (70)", re: /^\/universo\/[^/]+\/[^/]+$/ },
  { nome: "Acomodações e categorias (8)", re: /^\/acomodacoes/ },
  { nome: "O Kaluanã, Restaurante, Ji-Paraná", re: /^\/(o-kaluana|restaurante|ji-parana)$/ },
  { nome: "Eventos (fora do índice)", re: /^\/eventos$/ },
  { nome: "Histórias e posts (4)", re: /^\/historias/ },
  {
    nome: "Reservas, Contato, FAQ, Trabalhe conosco",
    re: /^\/(reservas|contato|perguntas-frequentes|trabalhe-conosco)$/,
  },
  { nome: "Legais (2)", re: /^\/(politica-de-privacidade|termos-de-uso)$/ },
  { nome: "Obrigado e 404", re: /^\/(obrigado|rota-que-nao-existe)$/ },
];

const mediana = (v: number[]) => {
  const s = [...v].sort((a, b) => a - b);
  return s.length ? s[Math.floor(s.length / 2)] : 0;
};
const faixa = (v: number[]) => {
  const min = Math.min(...v);
  const max = Math.max(...v);
  return min === max ? `${min}` : `${min} a ${max}`;
};
const seg = (ms: number) => `${(ms / 1000).toFixed(1).replace(".", ",")} s`;

function secao(fase: string, medicoes: Medicao[]): string[] {
  const linhas: string[] = [];
  for (const preset of ["mobile", "desktop"]) {
    const ms = medicoes.filter((m) => m.preset === preset);
    if (!ms.length) continue;
    linhas.push(
      `### Fase \`${fase}\`, ${preset === "mobile" ? "celular" : "desktop"} (${ms.length} rotas)`,
      "",
    );
    linhas.push(
      "| Grupo | Rotas | Desempenho | Acessibilidade | Boas práticas | SEO | LCP maior | Peso maior |",
    );
    linhas.push("| --- | --- | --- | --- | --- | --- | --- | --- |");
    for (const g of grupos) {
      const gm = ms.filter((m) => g.re.test(m.rota));
      if (!gm.length) continue;
      const seo = gm.every((m) => m.noindex)
        ? `${faixa(gm.map((m) => m.seo))} (noindex)`
        : faixa(gm.filter((m) => !m.noindex).map((m) => m.seo));
      linhas.push(
        `| ${g.nome} | ${gm.length} | ${faixa(gm.map((m) => m.desempenho))} (mediana ${mediana(gm.map((m) => m.desempenho))}) | ${faixa(gm.map((m) => m.acessibilidade))} | ${faixa(gm.map((m) => m.boasPraticas))} | ${seo} | ${seg(Math.max(...gm.map((m) => m.lcpMs)))} | ${Math.max(...gm.map((m) => m.pesoKB))} KB |`,
      );
    }
    linhas.push("");
    const abaixo = ms.filter(
      (m) =>
        m.desempenho < 90 ||
        m.acessibilidade < 90 ||
        m.boasPraticas < 90 ||
        (m.seo < 90 && !m.noindex),
    );
    linhas.push(
      abaixo.length
        ? `Abaixo de 90: ${abaixo.map((m) => `\`${m.rota}\` (${m.desempenho}/${m.acessibilidade}/${m.boasPraticas}/${m.seo}, desempenho em ${m.tentativasDesempenho.join(", ")})`).join("; ")}.`
        : "Nenhuma rota abaixo de 90 em desempenho, acessibilidade, boas práticas ou SEO indexável.",
    );
    const reprovadas = [...new Set(ms.flatMap((m) => m.reprovadas))];
    if (reprovadas.length)
      linhas.push(
        "",
        `Auditorias reprovadas fora de desempenho: ${reprovadas.map((r) => `\`${r}\``).join(", ")}.`,
      );
    const home = ms.find((m) => m.rota === "/");
    const universo = ms.filter((m) => /^\/universo\/[^/]+\/[^/]+$/.test(m.rota));
    const acimaUniverso = universo.filter((m) => m.pesoKB > 700);
    if (!home || !universo.length) continue;
    linhas.push(
      "",
      `Orçamento de peso: Home com ${home?.pesoKB ?? "?"} KB (limite 2.500 KB); páginas de elemento entre ${Math.min(...universo.map((m) => m.pesoKB))} e ${Math.max(...universo.map((m) => m.pesoKB))} KB (limite 700 KB)${acimaUniverso.length ? `, acima do limite: ${acimaUniverso.map((m) => `\`${m.rota}\` ${m.pesoKB} KB`).join(", ")}` : ", todas dentro"}.`,
      "",
    );
  }
  return linhas;
}

function todas(pre: Medicao[], full: Medicao[]): string[] {
  const rotas = [...new Set([...pre, ...full].map((m) => m.rota))];
  const nota = (ms: Medicao[], rota: string, preset: string) => {
    const m = ms.find((x) => x.rota === rota && x.preset === preset);
    return m
      ? `${m.desempenho} ${m.acessibilidade} ${m.boasPraticas} ${m.seo}${m.noindex ? "*" : ""}`
      : "";
  };
  const linhas = [
    "## Todas as rotas",
    "",
    "Notas na ordem desempenho, acessibilidade, boas práticas e SEO. Asterisco: página com noindex, em que o SEO reprova de propósito no critério `is-crawlable`.",
    "",
    "| Rota | pre, celular | pre, desktop | full, celular | full, desktop |",
    "| --- | --- | --- | --- | --- |",
  ];
  for (const r of rotas) {
    linhas.push(
      `| \`${r}\` | ${nota(pre, r, "mobile")} | ${nota(pre, r, "desktop")} | ${nota(full, r, "mobile")} | ${nota(full, r, "desktop")} |`,
    );
  }
  return linhas;
}

const ler = (fase: string): { medicoes: Medicao[]; lighthouse?: string } => {
  const p = resolve(out, `resumo-${fase}.json`);
  return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : { medicoes: [] };
};
const pre = ler("pre");
const full = ler("full");

const doc = [
  "# Lighthouse, etapa 6",
  "",
  `Todas as rotas do build de produção, nas duas fases, em celular e desktop. Lighthouse ${pre.lighthouse ?? full.lighthouse ?? ""}, throttling simulado, como nas etapas anteriores. Cada rota é medida como primeira visita, com a abertura de sessão. Quando o desempenho fica abaixo de 90, a rota é medida mais duas vezes e vale a mediana. Os relatórios HTML só existem para as medições que ficaram abaixo de 90; o resto está nos arquivos \`resumo-pre.json\` e \`resumo-full.json\`.`,
  "",
  "## Por grupo de página",
  "",
  ...secao("pre", pre.medicoes),
  ...secao("full", full.medicoes),
  ...todas(pre.medicoes, full.medicoes),
  "",
];
writeFileSync(resolve(out, "README.md"), doc.join("\n"));
process.stdout.write(
  `lighthouse-resumo: ${pre.medicoes.length} medições pre, ${full.medicoes.length} full\n`,
);
