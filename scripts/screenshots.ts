/**
 * Capturas de tela da Home em desktop e mobile com Playwright.
 * Uso: npm run screenshots -- --phase=pre --url=http://localhost:3000 [--out=docs/screenshots/etapa-1]
 * Pressupõe o servidor no ar (next start) construído na fase indicada.
 */
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, devices } from "playwright";

const arg = (k: string, d: string) =>
  process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
const phase = arg("phase", "pre");
const url = arg("url", "http://localhost:3000");
const out = resolve(process.cwd(), arg("out", "docs/screenshots/etapa-1"));
mkdirSync(out, { recursive: true });

const targets = [
  { name: "desktop", viewport: { width: 1440, height: 900 } },
  { name: "mobile", ...devices["iPhone 13"] },
];

(async () => {
  const browser = await chromium.launch({ args: ["--autoplay-policy=no-user-gesture-required"] });
  for (const t of targets) {
    const context = await browser.newContext({ ...t, locale: "pt-BR" });
    await context.addInitScript(() => {
      // sem abertura de sessão e sem banner nas capturas
      window.sessionStorage.setItem("kaluana:abertura", "1");
      window.localStorage.setItem("kaluana:consentimento", "denied");
    });
    const page = await context.newPage();
    page.on("console", (msg) => {
      if (msg.type() === "error" || msg.type() === "warning") {
        process.stdout.write(`console ${msg.type()} (${t.name}): ${msg.text().slice(0, 300)}\n`);
      }
    });
    page.on("pageerror", (err) =>
      process.stdout.write(`pageerror (${t.name}): ${err.message.slice(0, 300)}\n`),
    );
    await page.goto(url, { waitUntil: "load" });
    // a cortina de transição fica abaixo da viewport e apareceria na captura de página inteira
    await page.addStyleTag({ content: ".page-curtain{display:none!important}" });
    await page.waitForTimeout(1500);
    await page.evaluate(async () => {
      // rola até o fim para disparar as entradas por interseção
      // passos curtos e pausas para o IntersectionObserver ver cada seção entrar na tela
      const step = window.innerHeight / 3;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 200));
      }
      window.scrollTo(0, document.body.scrollHeight);
      await new Promise((r) => setTimeout(r, 1000));
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 2500));
    });
    const file = resolve(out, `home-${phase}-${t.name}.png`);
    await page.screenshot({ path: file, fullPage: true });
    process.stdout.write(`screenshot: ${file}\n`);
    await context.close();
  }
  await browser.close();
})().catch((e: unknown) => {
  process.stderr.write(`screenshots: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
