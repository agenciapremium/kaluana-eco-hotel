/**
 * Teste dos 70 QR Codes (etapa 6).
 *
 * Para cada UH de `content/qr-map.json`:
 *   1. HTTP: `/q/<uh>` responde 301 com Location relativo igual a `<url canônica>?uh=<uh>`,
 *      e o destino responde 200 com a canônica sem parâmetro;
 *   2. navegador: abrir `/q/<uh>` termina na página certa, com a barra de hóspede mostrando o
 *      nome do quarto, o número só na fase `full`, os atalhos e o botão de som, e o evento
 *      `qr_scan` na camada de dados (com consentimento).
 * Casos de borda: UH inexistente, UH não numérica, barra final, recarga sem `qr_scan` repetido
 * e o bloqueio de `/q/` no robots.txt.
 *
 * Uso: npm run qa:qr -- --phase=pre --url=http://localhost:3100 [--out=docs/qa/etapa-6]
 * Grava `qr-<fase>.json` e, com --csv, a tabela das placas em `docs/qr-codes.csv`.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser } from "playwright";
import { arg } from "./qa/rotas";

type Entrada = {
  uh: string;
  grupo: string;
  andar: number;
  slug: string;
  nome: string;
  url: string;
  categoria: string | null;
  categoriaUrl: string | null;
};

const phase = arg("phase", "pre");
const base = arg("url", "http://localhost:3100");
const out = resolve(process.cwd(), arg("out", "docs/qa/etapa-6"));
const site = arg("site", "https://kaluanaecohotel.com.br");
const qrMap = JSON.parse(readFileSync("content/qr-map.json", "utf8")) as Record<string, Entrada>;
const uhs = Object.keys(qrMap).sort();

type Resultado = { uh: string; nome: string; destino: string; ok: boolean; falhas: string[] };

async function testarHttp(e: Entrada): Promise<string[]> {
  const falhas: string[] = [];
  const r = await fetch(`${base}/q/${e.uh}`, { redirect: "manual" });
  const esperado = `${e.url}?uh=${e.uh}`;
  if (r.status !== 301) falhas.push(`status ${r.status} (esperado 301)`);
  const location = r.headers.get("location");
  if (location !== esperado) falhas.push(`Location ${location} (esperado ${esperado})`);
  const destino = await fetch(`${base}${esperado}`);
  if (destino.status !== 200) falhas.push(`destino respondeu ${destino.status}`);
  const html = await destino.text();
  const canonica = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1] ?? "";
  if (!canonica.endsWith(e.url))
    falhas.push(`canônica ${canonica} (esperado terminar em ${e.url})`);
  return falhas;
}

async function testarNavegador(browser: Browser, e: Entrada, proxima: Entrada | null) {
  const falhas: string[] = [];
  const ctx = await browser.newContext({ locale: "pt-BR" });
  await ctx.addInitScript(() => {
    window.sessionStorage.setItem("kaluana:abertura", "1");
    window.localStorage.setItem("kaluana:consentimento", "granted");
  });
  const page = await ctx.newPage();
  const erros: string[] = [];
  page.on("pageerror", (err) => erros.push(err.message));
  try {
    await page.goto(`${base}/q/${e.uh}`, { waitUntil: "domcontentloaded" });
    const final = new URL(page.url());
    if (final.pathname !== e.url || final.searchParams.get("uh") !== e.uh) {
      falhas.push(`terminou em ${final.pathname}${final.search}`);
    }
    const barra = page.locator("aside.barra-hospede");
    await barra.waitFor({ state: "visible", timeout: 10_000 });
    const nome = (await barra.locator(".barra-hospede-saudacao strong").textContent())?.trim();
    if (nome !== e.nome) falhas.push(`saudação com "${nome}" (esperado "${e.nome}")`);
    const numero = barra.locator(".barra-hospede-uh");
    if (phase === "pre" && (await numero.count()) > 0)
      falhas.push("número da UH visível na fase pre");
    if (phase === "full" && (await numero.textContent())?.trim() !== e.uh) {
      falhas.push("número da UH ausente na fase full");
    }
    for (const href of ["/contato", "/restaurante", "/perguntas-frequentes"]) {
      if ((await barra.locator(`a[href="${href}"]`).count()) !== 1)
        falhas.push(`sem atalho ${href}`);
    }
    if (e.categoriaUrl && (await barra.locator(`a[href="${e.categoriaUrl}"]`).count()) !== 1) {
      falhas.push(`sem link da categoria ${e.categoriaUrl}`);
    }
    if (proxima && (await barra.locator(`a[href="${proxima.url}"]`).count()) !== 1) {
      falhas.push(`sem link do próximo quarto ${proxima.url}`);
    }
    if ((await barra.locator(".barra-hospede-audio button").count()) < 1) {
      falhas.push("sem botão de som na barra");
    }
    await page
      .waitForFunction(
        () => (window.dataLayer ?? []).some((d) => (d as { event?: string }).event === "qr_scan"),
        null,
        { timeout: 5_000 },
      )
      .catch(() => falhas.push("qr_scan não disparou"));
    const scans = await page.evaluate(() =>
      (window.dataLayer ?? []).filter((d) => (d as { event?: string }).event === "qr_scan"),
    );
    const scan = scans[0] as { uh?: string; elemento?: string } | undefined;
    if (scans.length !== 1 || scan?.uh !== e.uh || scan?.elemento !== e.nome) {
      falhas.push(`qr_scan inesperado: ${JSON.stringify(scans)}`);
    }
    if (erros.length) falhas.push(`erro de página: ${erros.join(" | ").slice(0, 200)}`);
  } catch (err) {
    falhas.push(err instanceof Error ? err.message.split("\n")[0] : String(err));
  } finally {
    await ctx.close();
  }
  return falhas;
}

async function casosDeBorda(browser: Browser) {
  const casos: { caso: string; ok: boolean; obtido: string }[] = [];
  for (const [caso, caminho] of [
    ["UH inexistente", "/q/999"],
    ["UH não numérica", "/q/abc"],
  ] as const) {
    const r = await fetch(`${base}${caminho}`, { redirect: "manual" });
    const loc = r.headers.get("location");
    casos.push({ caso, ok: r.status === 301 && loc === "/universo", obtido: `${r.status} ${loc}` });
  }
  const primeira = qrMap[uhs[0]];

  const ctx = await browser.newContext({ locale: "pt-BR" });
  await ctx.addInitScript(() => {
    window.sessionStorage.setItem("kaluana:abertura", "1");
    window.localStorage.setItem("kaluana:consentimento", "granted");
  });
  const page = await ctx.newPage();
  await page.goto(`${base}/q/${primeira.uh}/`, { waitUntil: "domcontentloaded" });
  const final = new URL(page.url());
  casos.push({
    caso: "Barra final no endereço",
    ok: final.pathname === primeira.url && final.searchParams.get("uh") === primeira.uh,
    obtido: `${final.pathname}${final.search}`,
  });
  await page.waitForTimeout(1500);
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator("aside.barra-hospede").waitFor({ state: "visible" });
  await page.waitForTimeout(1500);
  const repetidos = await page.evaluate(
    () =>
      (window.dataLayer ?? []).filter((d) => (d as { event?: string }).event === "qr_scan").length,
  );
  casos.push({
    caso: "Recarga não repete qr_scan na sessão",
    ok: repetidos === 0,
    obtido: `${repetidos} evento(s) após recarregar`,
  });
  await page.goto(`${base}${primeira.url}`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1000);
  const semParametro = await page.locator("aside.barra-hospede").count();
  casos.push({
    caso: "Sem ?uh= a barra não aparece",
    ok: semParametro === 0,
    obtido: `${semParametro} barra(s)`,
  });
  await ctx.close();

  const robots = await (await fetch(`${base}/robots.txt`)).text();
  casos.push({
    caso: "robots.txt bloqueia /q/",
    ok: /Disallow: \/q\//.test(robots),
    obtido: robots
      .split("\n")
      .filter((l) => l.startsWith("Disallow"))
      .join(", "),
  });
  return casos;
}

(async () => {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const resultados: Resultado[] = [];
  const fila = [...uhs];
  const trabalhar = async () => {
    for (let uh = fila.shift(); uh; uh = fila.shift()) {
      const e = qrMap[uh];
      const i = uhs.indexOf(uh);
      const proxima = i < uhs.length - 1 ? qrMap[uhs[i + 1]] : null;
      const falhas = [...(await testarHttp(e)), ...(await testarNavegador(browser, e, proxima))];
      resultados.push({
        uh,
        nome: e.nome,
        destino: `${e.url}?uh=${uh}`,
        ok: !falhas.length,
        falhas,
      });
      process.stdout.write(
        `${falhas.length ? "FALHA" : "ok"} ${uh} ${e.nome}${falhas.length ? `: ${falhas.join("; ")}` : ""}\n`,
      );
    }
  };
  await Promise.all(Array.from({ length: 4 }, trabalhar));
  resultados.sort((a, b) => a.uh.localeCompare(b.uh));
  const borda = await casosDeBorda(browser);
  await browser.close();
  for (const c of borda) process.stdout.write(`${c.ok ? "ok" : "FALHA"} ${c.caso}: ${c.obtido}\n`);

  const aprovados = resultados.filter((r) => r.ok).length;
  writeFileSync(
    resolve(out, `qr-${phase}.json`),
    `${JSON.stringify({ fase: phase, base, data: new Date().toISOString(), aprovados, total: resultados.length, resultados, borda }, null, 2)}\n`,
  );
  if (process.argv.includes("--csv")) {
    const linhas = [
      "uh,andar,grupo,nome,endereco_do_qr,destino",
      ...uhs.map((uh) => {
        const e = qrMap[uh];
        return [
          uh,
          e.andar,
          e.grupo,
          `"${e.nome}"`,
          `${site}/q/${uh}`,
          `${site}${e.url}?uh=${uh}`,
        ].join(",");
      }),
    ];
    writeFileSync(resolve("docs/qr-codes.csv"), `${linhas.join("\n")}\n`);
  }
  const bordaOk = borda.every((c) => c.ok);
  process.stdout.write(
    `qa-qr ${phase}: ${aprovados}/${resultados.length} UHs aprovadas; casos de borda ${bordaOk ? "ok" : "com falha"}\n`,
  );
  process.exit(aprovados === resultados.length && bordaOk ? 0 : 1);
})().catch((e: unknown) => {
  process.stderr.write(`qa-qr: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
