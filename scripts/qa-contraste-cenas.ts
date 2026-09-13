/**
 * Contraste de texto claro sobre foto (etapa 6).
 *
 * O axe não calcula contraste de texto sobre imagem ou gradiente: marca como "incompleto" e não
 * reprova. Nas cenas do site, texto bege fica sobre foto, véu e a cor do andar. Este script mede
 * o que o olho vê: fotografa a caixa de cada texto claro, separa os pixels do fundo (os que ficam
 * bem mais escuros que a cor do texto) e calcula o contraste contra a parte mais clara desse fundo
 * (percentil 95), que é o pior caso para a leitura.
 *
 * Uso: npm run qa:contraste -- --phase=pre --url=http://localhost:3100 [--out=docs/qa/etapa-6]
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type BrowserContextOptions, type Page } from "playwright";
import sharp from "sharp";
import { arg } from "./qa/rotas";

const phase = arg("phase", "pre");
const base = arg("url", "http://localhost:3100");
const out = resolve(process.cwd(), arg("out", "docs/qa/etapa-6"));

const TELAS: Record<string, BrowserContextOptions> = {
  desktop: { viewport: { width: 1280, height: 900 } },
  celular: {
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    deviceScaleFactor: 2,
  },
};

/** Páginas com texto claro sobre foto ou cor de andar, e os seletores do texto. */
const ALVOS: { rota: string; seletor: string }[] = [
  {
    rota: "/",
    seletor:
      ".scene-hero .scene-content :is(h1, p, span.kicker), .panel :is(h2, h3, p, .panel-name)",
  },
  { rota: "/universo", seletor: ".andar-bloco :is(h2, h3, p, .kicker)" },
  ...["rios", "peixes", "arvores", "aves"].map((andar) => ({
    rota: `/universo/${andar}`,
    seletor: ".scene-hero .scene-content :is(h1, p, span.kicker)",
  })),
  { rota: "/universo/guardioes", seletor: ".guardiao :is(h2, h3, p)" },
  // As 70 páginas de elemento: cada uma tem uma foto diferente atrás do texto.
  ...(
    JSON.parse(readFileSync(resolve(process.cwd(), "content/universo-index.json"), "utf8")) as {
      url: string;
    }[]
  ).map((e) => ({ rota: e.url, seletor: ".elemento-hero :is(h1, p, .kicker)" })),
];

type Medida = { rota: string; tela: string; texto: string; contraste: number; grande: boolean };

const lum = (r: number, g: number, b: number) => {
  const f = (v: number) => {
    const x = v / 255;
    return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

async function medirPagina(page: Page, rota: string, tela: string): Promise<Medida[]> {
  const medidas: Medida[] = [];
  const elementos = page.locator(ALVOS.find((a) => a.rota === rota)?.seletor ?? "");
  const total = await elementos.count();
  for (let i = 0; i < total; i++) {
    const el = elementos.nth(i);
    if (!(await el.isVisible())) continue;
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    // Painéis empilhados com sticky: o painel seguinte pode cobrir o texto do anterior, e a
    // medição sairia contra a foto de outro painel. Alinha o painel ao topo da tela; se o texto
    // continuar coberto, não mede.
    const coberto = () =>
      el.evaluate((e) => {
        const r = e.getBoundingClientRect();
        const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !(t && (t === e || e.contains(t) || t.contains(e)));
      });
    if (await coberto()) {
      await el.evaluate((e) => (e.closest(".panel") ?? e).scrollIntoView({ block: "start" }));
      await page.waitForTimeout(700);
      if (await coberto()) continue;
    }
    const info = await el.evaluate((e) => {
      const cs = getComputedStyle(e);
      const m = cs.color.match(/[\d.]+/g)?.map(Number) ?? [0, 0, 0];
      const tamanho = parseFloat(cs.fontSize);
      const peso = Number(cs.fontWeight) || 400;
      return {
        cor: m.slice(0, 3),
        texto: (e.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 50),
        // WCAG: texto grande a partir de 24 px, ou 18,66 px em negrito
        grande: tamanho >= 24 || (tamanho >= 18.66 && peso >= 700),
      };
    });
    const lt = lum(info.cor[0], info.cor[1], info.cor[2]);
    if (lt < 0.45 || !info.texto) continue; // só texto claro
    const caixa = await el.boundingBox();
    if (!caixa || caixa.width < 4 || caixa.height < 4) continue;
    const png = await page.screenshot({ clip: caixa });
    const { data, info: img } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
    const { width: w, height: h, channels: c } = img;
    const lums = new Float32Array(w * h);
    for (let i = 0; i < w * h; i++) lums[i] = lum(data[i * c], data[i * c + 1], data[i * c + 2]);
    // Pixels a até 2 px de uma letra ficam fora do fundo: a borda suavizada da letra mistura
    // texto e fundo e, em texto pequeno, puxaria o percentil para baixo.
    const perto = new Uint8Array(w * h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (lums[y * w + x] < lt - 0.25) continue;
        for (let dy = -2; dy <= 2; dy++) {
          for (let dx = -2; dx <= 2; dx++) {
            const yy = y + dy;
            const xx = x + dx;
            if (yy >= 0 && yy < h && xx >= 0 && xx < w) perto[yy * w + xx] = 1;
          }
        }
      }
    }
    const fundo: number[] = [];
    for (let i = 0; i < w * h; i++) {
      if (!perto[i] && lums[i] < lt - 0.2) fundo.push(lums[i]);
    }
    if (fundo.length < 50) continue;
    fundo.sort((a, b) => a - b);
    const lb = fundo[Math.floor(fundo.length * 0.95)];
    const contraste = Math.round(((lt + 0.05) / (lb + 0.05)) * 100) / 100;
    medidas.push({ rota, tela, texto: info.texto, contraste, grande: info.grande });
  }
  return medidas;
}

(async () => {
  mkdirSync(out, { recursive: true });
  const browser = await chromium.launch();
  const todas: Medida[] = [];
  for (const { rota } of ALVOS) {
    for (const [tela, opcoes] of Object.entries(TELAS)) {
      const ctx = await browser.newContext({ ...opcoes, locale: "pt-BR", reducedMotion: "reduce" });
      await ctx.addInitScript(() => {
        window.sessionStorage.setItem("kaluana:abertura", "1");
        window.localStorage.setItem("kaluana:consentimento", "denied");
      });
      const page = await ctx.newPage();
      const resposta = await page.goto(`${base}${rota}`, { waitUntil: "networkidle" });
      // --css: injeta um CSS de teste antes de medir, para ajustar véus sem recompilar.
      if (arg("css", "")) await page.addStyleTag({ path: arg("css", "") });
      // O traço sálvia do kicker é decoração dentro da caixa do texto: sem escondê-lo, os pixels
      // dele contam como fundo e todo kicker reprova.
      await page.addStyleTag({ content: ".kicker::before{visibility:hidden!important}" });
      if (resposta?.status() === 200) todas.push(...(await medirPagina(page, rota, tela)));
      await ctx.close();
    }
  }
  await browser.close();
  const reprovadas = todas.filter((m) => m.contraste < (m.grande ? 3 : 4.5));
  writeFileSync(
    resolve(out, `contraste-cenas-${phase}.json`),
    `${JSON.stringify({ fase: phase, data: new Date().toISOString(), medidas: todas, reprovadas }, null, 2)}\n`,
  );
  const menor = [...todas].sort((a, b) => a.contraste - b.contraste).slice(0, 6);
  process.stdout.write(
    `qa-contraste ${phase}: ${todas.length} textos medidos, ${reprovadas.length} abaixo do mínimo\n`,
  );
  for (const m of reprovadas.length ? reprovadas : menor) {
    process.stdout.write(
      `  ${m.contraste}:1 ${m.grande ? "(grande)" : ""} [${m.tela}] ${m.rota} "${m.texto}"\n`,
    );
  }
  process.exit(reprovadas.length ? 1 : 0);
})().catch((e: unknown) => {
  process.stderr.write(`qa-contraste: ${e instanceof Error ? e.stack : String(e)}\n`);
  process.exit(1);
});
