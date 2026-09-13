/**
 * Acessibilidade em execução (etapa 6): axe-core em todas as rotas e roteiros de teclado.
 *
 * 1. axe-core (o mesmo motor que o Lighthouse usa, já instalado como dependência dele) com as
 *    regras WCAG 2.0, 2.1 e 2.2 nos níveis A e AA, mais as boas práticas, em todas as rotas do
 *    build, no desktop e no celular, e em estados que só aparecem com interação: banner de
 *    consentimento, menu do celular aberto, barra de hóspede, acordeões abertos, erros de
 *    formulário e movimento reduzido.
 * 2. Teclado: percorre cada modelo de página com Tab e confere, em cada parada, se o foco está
 *    visível (contorno ou sombra, contraste do contorno com o fundo, recorte por clip-path), se
 *    está na tela e se não está coberto por outro elemento. Depois volta com Shift+Tab. E
 *    roteiros específicos: atalho para o conteúdo, menu do celular, cabeçalho transparente
 *    após navegação, banner, acordeão, filtro, busca, barra de hóspede, mapa sob demanda,
 *    passos do formulário de eventos e foco após erro de formulário.
 * 3. Leitor de tela: grava a árvore de acessibilidade (a mesma que o VoiceOver e o NVDA leem)
 *    de cada modelo de página em `docs/qa/<etapa>/aria/`, com a hierarquia de títulos e os
 *    marcos, para revisão.
 *
 * Uso: npm run qa:a11y -- --phase=pre --url=http://localhost:3100 [--out=docs/qa/etapa-6] [--so=axe|teclado|aria]
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { chromium, type Browser, type BrowserContextOptions, type Page } from "playwright";
import { arg, nomeDaRota, rotasDoBuild, ROTA_404 } from "./qa/rotas";

const phase = arg("phase", "pre");
const base = arg("url", "http://localhost:3100");
const out = resolve(process.cwd(), arg("out", "docs/qa/etapa-6"));
const so = arg("so", "");
const axePath = resolve("node_modules/axe-core/axe.min.js");

const DESKTOP: BrowserContextOptions = { viewport: { width: 1280, height: 900 } };
const CELULAR: BrowserContextOptions = {
  viewport: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 2,
};

/** Modelos de página: um representante de cada template do site. */
const MODELOS = [
  "/",
  "/universo",
  "/universo/rios",
  "/universo/arvores",
  "/universo/guardioes",
  "/universo/rios/rio-machado",
  "/universo/guardioes/onca-pintada",
  "/acomodacoes",
  "/acomodacoes/duplo-king",
  "/o-kaluana",
  "/restaurante",
  "/eventos",
  "/ji-parana",
  "/historias",
  "/historias/por-que-kaluana",
  "/reservas",
  "/contato",
  "/perguntas-frequentes",
  "/trabalhe-conosco",
  "/politica-de-privacidade",
  ROTA_404,
];

type Violacao = { id: string; impacto: string; ajuda: string; alvos: string[] };
type ResultadoAxe = { rota: string; tela: string; estado: string; violacoes: Violacao[] };
type Achado = { roteiro: string; rota: string; tela: string; ok: boolean; detalhe: string };

const achados: Achado[] = [];
const registrar = (a: Achado) => {
  achados.push(a);
  process.stdout.write(
    `${a.ok ? "ok   " : "FALHA"} [${a.tela}] ${a.roteiro} ${a.rota}: ${a.detalhe}\n`,
  );
};

let browser: Browser;

async function abrir(
  rota: string,
  opcoes: BrowserContextOptions,
  consentimento: string | null = "denied",
) {
  const ctx = await browser.newContext({ ...opcoes, locale: "pt-BR" });
  // O tsx (esbuild) envolve funções nomeadas em __name(), que não existe no navegador: sem
  // isto, qualquer page.evaluate com função interna nomeada quebra.
  await ctx.addInitScript({ content: "window.__name = window.__name || ((f) => f);" });
  await ctx.addInitScript((c) => {
    window.sessionStorage.setItem("kaluana:abertura", "1");
    if (c) window.localStorage.setItem("kaluana:consentimento", c);
  }, consentimento);
  const page = await ctx.newPage();
  await page.goto(`${base}${rota}`, { waitUntil: "load" });
  await page.addStyleTag({ content: "html{scroll-behavior:auto!important}" });
  return { ctx, page };
}

/** Rola a página inteira para disparar as entradas por interseção, e volta ao topo. */
async function revelar(page: Page) {
  await page.evaluate(async () => {
    const passo = window.innerHeight / 2;
    for (let y = 0; y < document.body.scrollHeight; y += passo) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 900));
  });
}

async function axe(page: Page): Promise<Violacao[]> {
  await page.addScriptTag({ path: axePath });
  return page.evaluate(async () => {
    type No = { target: string[] };
    type V = { id: string; impact: string | null; help: string; nodes: No[] };
    const motor = (
      window as unknown as {
        axe: { run: (c: Document, o: object) => Promise<{ violations: V[] }> };
      }
    ).axe;
    const r = await motor.run(document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"],
      },
      resultTypes: ["violations"],
    });
    return r.violations.map((v) => ({
      id: v.id,
      impacto: v.impact ?? "",
      ajuda: v.help,
      alvos: v.nodes.slice(0, 5).map((n) => n.target.join(" ")),
    }));
  });
}

async function axeEmTodasAsRotas(): Promise<ResultadoAxe[]> {
  const resultados: ResultadoAxe[] = [];
  const fila: { rota: string; tela: string; opcoes: BrowserContextOptions }[] = [];
  for (const rota of rotasDoBuild()) {
    fila.push({ rota, tela: "desktop", opcoes: DESKTOP });
    fila.push({ rota, tela: "celular", opcoes: CELULAR });
  }
  const total = fila.length;
  const trabalhar = async () => {
    for (let t = fila.shift(); t; t = fila.shift()) {
      const { ctx, page } = await abrir(t.rota, t.opcoes);
      try {
        await revelar(page);
        const violacoes = await axe(page);
        resultados.push({ rota: t.rota, tela: t.tela, estado: "padrão", violacoes });
        if (violacoes.length) {
          process.stdout.write(
            `axe [${t.tela}] ${t.rota}: ${violacoes.map((v) => `${v.id}(${v.alvos.length})`).join(", ")}\n`,
          );
        }
      } finally {
        await ctx.close();
      }
      if ((total - fila.length) % 40 === 0)
        process.stdout.write(`axe: ${total - fila.length}/${total}\n`);
    }
  };
  await Promise.all(Array.from({ length: 4 }, trabalhar));
  return resultados;
}

/** Estados que só existem com interação. */
async function axeEmEstados(): Promise<ResultadoAxe[]> {
  const r: ResultadoAxe[] = [];
  const medir = async (
    rota: string,
    tela: string,
    estado: string,
    opcoes: BrowserContextOptions,
    preparar: (p: Page) => Promise<void>,
    consentimento: string | null = "denied",
  ) => {
    const { ctx, page } = await abrir(rota, opcoes, consentimento);
    try {
      await preparar(page);
      await page.waitForTimeout(700);
      const violacoes = await axe(page);
      r.push({ rota, tela, estado, violacoes });
      process.stdout.write(
        `axe [${tela}] ${rota} (${estado}): ${violacoes.map((v) => v.id).join(", ") || "sem violações"}\n`,
      );
    } finally {
      await ctx.close();
    }
  };
  await medir("/", "desktop", "banner de consentimento", DESKTOP, async () => {}, null);
  await medir(
    "/universo",
    "celular",
    phase === "full" ? "menu aberto" : "cabeçalho da fase pre",
    CELULAR,
    async (p) => {
      // Na fase pre o cabeçalho não tem menu: só o atalho para o formulário.
      const botao = p.locator("header button[aria-expanded]");
      if (await botao.count()) await botao.first().click();
    },
  );
  // Barra de hóspede nos quatro andares: a cor de fundo muda por andar (etapa 6).
  for (const rota of [
    "/universo/rios/rio-machado?uh=112",
    "/universo/peixes/pirarucu?uh=201",
    "/universo/arvores/samauma?uh=301",
    "/universo/aves/arara?uh=404",
    "/universo/guardioes/onca-pintada?uh=401",
  ]) {
    await medir(rota, "celular", "barra de hóspede", CELULAR, async (p) => {
      await p.locator("aside.barra-hospede").waitFor();
    });
  }
  // Faixa do elevador no celular parada num andar que não é o primeiro.
  await medir("/universo", "celular", "elevador no andar das Aves", CELULAR, async (p) => {
    await p.evaluate(() => document.getElementById("andar-aves")?.scrollIntoView());
    await p.waitForTimeout(900);
  });
  await medir("/perguntas-frequentes", "desktop", "acordeões abertos", DESKTOP, async (p) => {
    await p.evaluate(() => document.querySelectorAll("details").forEach((d) => (d.open = true)));
  });
  await medir("/contato", "desktop", "erros de formulário", DESKTOP, async (p) => {
    await p.evaluate(() => {
      const f = document.querySelector("form:has(#ct-nome)") as HTMLFormElement;
      f.noValidate = true;
    });
    await p.click("form:has(#ct-nome) button[type=submit]");
    await p.locator("form [role=alert]").first().waitFor({ timeout: 10_000 });
  });
  await medir(
    "/universo/rios",
    "desktop",
    "movimento reduzido",
    { ...DESKTOP, reducedMotion: "reduce" },
    async (p) => {
      await revelar(p);
    },
  );
  return r;
}

type Parada = {
  desc: string;
  nome: string;
  visivel: boolean;
  naTela: boolean;
  cobertoPor: string | null;
  contorno: boolean;
  contraste: number | null;
  recortado: boolean;
  honeypot: boolean;
};

/** Estado do elemento em foco, calculado no navegador. */
function paradaAtual(page: Page): Promise<Parada | null> {
  return page.evaluate(() => {
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    const descrever = (e: Element) => {
      const c =
        typeof e.className === "string"
          ? e.className.trim().split(/\s+/).filter(Boolean).slice(0, 2)
          : [];
      return `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""}${c.length ? `.${c.join(".")}` : ""}`;
    };
    const rgba = (s: string) => {
      // color(srgb r g b / a), de color-mix, vem com canais de 0 a 1.
      const srgb = s.match(/color\(srgb ([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)/);
      if (srgb) {
        const [, r, g, b, a = "1"] = srgb;
        return { r: +r * 255, g: +g * 255, b: +b * 255, a: +a };
      }
      const m = s.match(/rgba?\(([^)]+)\)/);
      if (!m) return null;
      const [r, g, b, a = "1"] = m[1].split(/[\s,/]+/).filter(Boolean);
      return { r: +r, g: +g, b: +b, a: +a };
    };
    const lum = (c: { r: number; g: number; b: number }) => {
      const f = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
    };
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    let visivel = r.width > 0 && r.height > 0 && cs.visibility !== "hidden";
    for (let a: HTMLElement | null = el; a; a = a.parentElement) {
      const s = getComputedStyle(a);
      if (s.opacity === "0" || s.display === "none") visivel = false;
    }
    const naTela = r.bottom > 0 && r.right > 0 && r.top < innerHeight && r.left < innerWidth;
    let cobertoPor: string | null = null;
    if (naTela && visivel) {
      const x = Math.min(Math.max(r.left + r.width / 2, 1), innerWidth - 1);
      const y = Math.min(Math.max(r.top + r.height / 2, 1), innerHeight - 1);
      const topo = document.elementFromPoint(x, y);
      if (topo && topo !== el && !el.contains(topo) && !topo.contains(el))
        cobertoPor = descrever(topo);
    }
    const largura = parseFloat(cs.outlineWidth) || 0;
    const temContorno = cs.outlineStyle !== "none" && largura >= 1;
    const temSombra = cs.boxShadow !== "none";
    let contraste: number | null = null;
    const cor = rgba(cs.outlineColor);
    if (temContorno && cor) {
      // Fundo efetivo: o que está logo fora da borda do elemento, onde o contorno é desenhado,
      // e não o fundo do ancestral (um cabeçalho transparente fica sobre a foto do hero). Foto,
      // vídeo ou imagem de fundo nessa pilha: desconhecido, o contraste real depende da foto.
      let fundo: { r: number; g: number; b: number } | null = null;
      const px = Math.min(Math.max(r.left - 4, 0), innerWidth - 1);
      const py = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
      for (const a of document.elementsFromPoint(px, py)) {
        if (a === el || el.contains(a)) continue;
        const s = getComputedStyle(a);
        if (/^(IMG|VIDEO|PICTURE|CANVAS|IFRAME)$/.test(a.tagName) || s.backgroundImage !== "none") {
          break;
        }
        const c = rgba(s.backgroundColor);
        if (c && c.a > 0.9) {
          fundo = c;
          break;
        }
      }
      // Contorno por dentro da caixa (outline-offset negativo): o fundo é o do próprio elemento.
      if (parseFloat(cs.outlineOffset) < 0) {
        const proprio = rgba(cs.backgroundColor);
        if (proprio && proprio.a > 0.9) fundo = proprio;
      }
      if (fundo) {
        const [l1, l2] = [lum(cor), lum(fundo)].sort((a, b) => b - a);
        contraste = Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100;
      }
    }
    const nome = (
      el.getAttribute("aria-label") ||
      el.textContent ||
      el.getAttribute("title") ||
      el.getAttribute("name") ||
      ""
    )
      .trim()
      .replace(/\s+/g, " ")
      .slice(0, 50);
    return {
      desc: descrever(el),
      nome,
      visivel,
      naTela,
      cobertoPor,
      contorno: temContorno || temSombra,
      contraste,
      // inset() com margem negativa (fim da máscara de entrada) deixa o contorno inteiro.
      recortado:
        cs.clipPath !== "none" && !(/inset\(/.test(cs.clipPath) && cs.clipPath.includes("-")),
      honeypot: (el as HTMLInputElement).name === "website",
    };
  });
}

function problemasDa(p: Parada): string[] {
  const out: string[] = [];
  if (p.honeypot) out.push("honeypot recebeu foco");
  if (!p.visivel) out.push("foco em elemento invisível");
  else if (!p.naTela) out.push("foco fora da tela");
  if (p.cobertoPor) out.push(`coberto por ${p.cobertoPor}`);
  if (!p.contorno) out.push("sem contorno de foco");
  if (p.contraste !== null && p.contraste < 3) out.push(`contorno com contraste ${p.contraste}:1`);
  if (p.recortado) out.push("contorno recortado por clip-path");
  return out;
}

async function percorrer(rota: string, tela: string, opcoes: BrowserContextOptions) {
  const { ctx, page } = await abrir(rota, opcoes);
  try {
    await revelar(page);
    const vistos = new Set<string>();
    const problemas = new Map<string, Set<string>>();
    let paradas = 0;
    let primeira = "";
    const anotar = (p: Parada, sentido: string) => {
      for (const prob of problemasDa(p)) {
        const chave = `${prob} (${sentido})`;
        if (!problemas.has(chave)) problemas.set(chave, new Set());
        problemas.get(chave)?.add(`${p.desc} "${p.nome}"`);
      }
    };
    for (let i = 0; i < 350; i++) {
      await page.keyboard.press("Tab");
      await page.waitForTimeout(60);
      const p = await paradaAtual(page);
      if (!p) continue;
      const chave = `${p.desc}|${p.nome}`;
      if (i === 0) primeira = chave;
      else if (chave === primeira) break;
      paradas++;
      vistos.add(chave);
      anotar(p, "Tab");
    }
    // volta com Shift+Tab a partir do meio da página, onde o cabeçalho some ao rolar
    await page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
    await page.evaluate(() => window.scrollTo(0, 0));
    for (let i = 0; i < Math.min(45, paradas); i++) await page.keyboard.press("Tab");
    await page.waitForTimeout(400);
    for (let i = 0; i < 45; i++) {
      await page.keyboard.press("Shift+Tab");
      // Espera as transições (cabeçalho que volta, trilho que some) antes de medir.
      await page.waitForTimeout(400);
      const p = await paradaAtual(page);
      if (p) anotar(p, "Shift+Tab");
    }
    const lista = [...problemas.entries()].map(
      ([k, v]) =>
        `${k}: ${[...v].slice(0, 6).join("; ")}${v.size > 6 ? ` e mais ${v.size - 6}` : ""}`,
    );
    registrar({
      roteiro: "Percurso com Tab e Shift+Tab",
      rota,
      tela,
      ok: lista.length === 0,
      detalhe: `${paradas} paradas${lista.length ? `; ${lista.join(" | ")}` : ", foco visível em todas"}`,
    });
  } finally {
    await ctx.close();
  }
}

/** Um roteiro que quebra vira falha registrada, sem derrubar os seguintes. */
async function tentar(roteiro: string, fn: () => Promise<void>) {
  try {
    await fn();
  } catch (e) {
    registrar({
      roteiro,
      rota: "",
      tela: "",
      ok: false,
      detalhe: `quebrou: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`,
    });
  }
}

async function roteiros() {
  await tentar("Atalho para o conteúdo", async () => {
    const { ctx, page } = await abrir("/", DESKTOP);
    await page.keyboard.press("Tab");
    const primeiro = await paradaAtual(page);
    await page.keyboard.press("Enter");
    await page.keyboard.press("Tab");
    const dentro = await page.evaluate(() => Boolean(document.activeElement?.closest("main")));
    registrar({
      roteiro: "Atalho para o conteúdo",
      rota: "/",
      tela: "desktop",
      ok: /skip-link/.test(primeiro?.desc ?? "") && Boolean(primeiro?.naTela) && dentro,
      detalhe: `primeiro foco: ${primeiro?.desc} "${primeiro?.nome}", na tela: ${primeiro?.naTela}; depois do Enter o Tab cai dentro do main: ${dentro}`,
    });
    await ctx.close();
  });

  await tentar("Menu do celular", async () => {
    const { ctx, page } = await abrir("/universo", CELULAR);
    if (phase !== "full") {
      registrar({
        roteiro: "Menu do celular",
        rota: "/universo",
        tela: "celular",
        ok: true,
        detalhe:
          "a fase pre não tem menu, só o atalho Quero ser avisado; o roteiro vale na fase full",
      });
      await ctx.close();
      return;
    }
    const botao = page.locator("header button[aria-expanded]").first();
    await botao.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(500);
    const aberto = await botao.getAttribute("aria-expanded");
    const focoDentro = await page.evaluate(() => {
      const b = document.querySelector("header button[aria-expanded]");
      const id = b?.getAttribute("aria-controls");
      const menu = id ? document.getElementById(id) : null;
      return Boolean(menu && menu.contains(document.activeElement));
    });
    let escapou = "";
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press("Tab");
      const fora = await page.evaluate(() => {
        const b = document.querySelector("header button[aria-expanded]");
        const id = b?.getAttribute("aria-controls");
        const menu = id ? document.getElementById(id) : null;
        const a = document.activeElement;
        // Foco no body: saiu da página para a interface do navegador, porque o fundo está inerte.
        return a && a !== document.body && menu && !menu.contains(a) && a !== b
          ? `${a.tagName.toLowerCase()} "${(a.textContent ?? "").trim().slice(0, 30)}"`
          : "";
      });
      if (fora) {
        escapou = fora;
        break;
      }
    }
    await page.keyboard.press("Escape");
    await page.waitForTimeout(400);
    const fechado = await botao.getAttribute("aria-expanded");
    const focoNoBotao = await page.evaluate(
      () => document.activeElement === document.querySelector("header button[aria-expanded]"),
    );
    registrar({
      roteiro: "Menu do celular",
      rota: "/universo",
      tela: "celular",
      ok: aberto === "true" && focoDentro && !escapou && fechado === "false" && focoNoBotao,
      detalhe: `abre: ${aberto}; foco vai para o menu: ${focoDentro}; Tab sai do menu aberto: ${escapou || "não"}; Escape fecha: ${fechado === "false"}; foco volta ao botão: ${focoNoBotao}`,
    });
    await ctx.close();
  });

  await tentar(
    "Cabeçalho depois de navegar de uma página com hero para uma sem hero (fundo bege)",
    async () => {
      const { ctx, page } = await abrir("/universo/rios", DESKTOP);
      await page.locator('footer a[href="/politica-de-privacidade"]').first().click();
      await page.waitForURL(/\/politica-de-privacidade$/);
      await page.waitForTimeout(1500);
      const estado = await page.evaluate(() => {
        // color(srgb r g b / a), de color-mix, vem com canais de 0 a 1.
        const rgb = (s: string) => {
          const n = (s.match(/[\d.]+/g) ?? []).map(Number);
          return s.startsWith("color(") ? [n[0] * 255, n[1] * 255, n[2] * 255, n[3] ?? 1] : n;
        };
        const lum = ([r, g, b]: number[]) => {
          const f = (v: number) => {
            const x = v / 255;
            return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
        };
        const h = document.querySelector("header") as HTMLElement;
        const fundoH = rgb(getComputedStyle(h).backgroundColor);
        const fundo =
          fundoH.length === 4 && fundoH[3] < 0.5
            ? rgb(getComputedStyle(document.body).backgroundColor)
            : fundoH;
        const [a, b] = [lum(rgb(getComputedStyle(h).color)), lum(fundo)].sort((x, y) => y - x);
        return {
          temHero: Boolean(document.querySelector(".scene-hero")),
          cor: getComputedStyle(h).color,
          fundo: getComputedStyle(h).backgroundColor,
          contraste: Math.round(((a + 0.05) / (b + 0.05)) * 100) / 100,
        };
      });
      registrar({
        roteiro: "Cabeçalho após navegação",
        rota: "/universo/rios → /politica-de-privacidade",
        tela: "desktop",
        ok: !estado.temHero && estado.contraste >= 4.5,
        detalhe: JSON.stringify(estado),
      });
      await ctx.close();
    },
  );

  await tentar("Banner de consentimento", async () => {
    const { ctx, page } = await abrir("/", DESKTOP, null);
    let passos = 0;
    for (; passos < 300; passos++) {
      await page.keyboard.press("Tab");
      const noBanner = await page.evaluate(() =>
        /aceitar|recusar|permitir|negar/i.test(document.activeElement?.textContent ?? ""),
      );
      if (noBanner) break;
    }
    registrar({
      roteiro: "Banner de consentimento",
      rota: "/",
      tela: "desktop",
      ok: passos < 10,
      detalhe: `${passos + 1} Tabs até o primeiro botão do banner`,
    });
    await ctx.close();
  });

  await tentar("Acordeão", async () => {
    const { ctx, page } = await abrir("/perguntas-frequentes", DESKTOP);
    const s = page.locator("main summary").first();
    await s.focus();
    await page.keyboard.press("Enter");
    const aberto = await page.evaluate(
      () => (document.querySelector("main details") as HTMLDetailsElement).open,
    );
    registrar({
      roteiro: "Acordeão (details)",
      rota: "/perguntas-frequentes",
      tela: "desktop",
      ok: aberto,
      detalhe: `Enter abre: ${aberto}`,
    });
    await ctx.close();
  });

  await tentar("Filtro", async () => {
    const { ctx, page } = await abrir("/universo/arvores", DESKTOP);
    const chip = page.locator("main button[aria-pressed]").first();
    await chip.focus();
    await page.keyboard.press("Space");
    await page.waitForTimeout(500);
    const pressionado = await chip.getAttribute("aria-pressed");
    const aoVivo = await page.locator("main [aria-live]").allInnerTexts();
    registrar({
      roteiro: "Filtro por uso",
      rota: "/universo/arvores",
      tela: "desktop",
      ok: pressionado === "true" && aoVivo.some((t) => t.trim().length > 0),
      detalhe: `aria-pressed: ${pressionado}; região viva: "${aoVivo.join(" ").trim()}"`,
    });
    await ctx.close();
  });

  await tentar("Busca do Universo", async () => {
    const { ctx, page } = await abrir("/universo", DESKTOP);
    const campo = page
      .locator("main input[type=search], main input[role=combobox], main input[type=text]")
      .first();
    await campo.focus();
    await page.keyboard.type("ma");
    await page.waitForTimeout(600);
    const vivo = await page.locator("main [aria-live]").allInnerTexts();
    await page.keyboard.press("Tab");
    const alvo = await paradaAtual(page);
    await campo.focus();
    await page.keyboard.press("Escape");
    const valor = await campo.inputValue();
    registrar({
      roteiro: "Busca do Universo",
      rota: "/universo",
      tela: "desktop",
      ok: /universo/.test(alvo?.desc ?? "") || Boolean(alvo),
      detalhe: `região viva: "${vivo.join(" ").trim().slice(0, 80)}"; Tab depois de digitar vai para: ${alvo?.desc} "${alvo?.nome}"; Escape limpa: ${valor === ""}`,
    });
    await ctx.close();
  });

  await tentar("Barra de hóspede e som", async () => {
    const { ctx, page } = await abrir("/universo/rios/rio-machado?uh=112", CELULAR);
    await page.locator("aside.barra-hospede").waitFor();
    const botaoBarra = page.locator(".barra-hospede-audio button").first();
    await botaoBarra.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500);
    const estado = await page.evaluate(() =>
      [
        ...document.querySelectorAll(".barra-hospede-audio button, .elemento-hero-acoes button"),
      ].map(
        (b) =>
          `${b.closest(".barra-hospede") ? "barra" : "hero"}: "${b.textContent?.trim()}" aria-pressed=${b.getAttribute("aria-pressed")}`,
      ),
    );
    const focoNoBotao = await page.evaluate(() =>
      Boolean(document.activeElement?.closest(".barra-hospede-audio")),
    );
    await page.evaluate(() => window.scrollTo(0, 1200));
    await page.waitForTimeout(500);
    await page.mouse.wheel(0, -150);
    await page.waitForTimeout(900);
    const menuCoberto = await page.evaluate(() => {
      // Botão do menu na fase full; "Quero ser avisado" na fase pre.
      // O primeiro candidato visível: na fase full, o Reservar do cabeçalho some no celular.
      const b =
        [
          ...document.querySelectorAll<HTMLElement>(
            "header button[aria-expanded], header a.btn-primary",
          ),
        ].find((x) => x.getBoundingClientRect().height > 0) ?? null;
      if (!b) return "sem ação no cabeçalho";
      const r = b.getBoundingClientRect();
      if (r.bottom <= 0) return "cabeçalho fora da tela";
      const t = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return t && (t === b || b.contains(t)) ? "" : `coberto por ${t?.className}`;
    });
    registrar({
      roteiro: "Barra de hóspede e som",
      rota: "/universo/rios/rio-machado?uh=112",
      tela: "celular",
      ok: focoNoBotao && !menuCoberto,
      detalhe: `${estado.join(" | ")}; foco fica no botão: ${focoNoBotao}; ação do cabeçalho ao voltar a rolagem: ${menuCoberto || "visível"}`,
    });
    await ctx.close();
  });

  await tentar("Mapa sob demanda", async () => {
    const { ctx, page } = await abrir("/contato", DESKTOP);
    const botao = page.getByRole("button", { name: /mapa/i }).first();
    await botao.focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(800);
    const foco = await paradaAtual(page);
    registrar({
      roteiro: "Mapa sob demanda",
      rota: "/contato",
      tela: "desktop",
      ok: Boolean(foco),
      detalhe: `foco depois do clique: ${foco ? `${foco.desc} "${foco.nome}"` : "perdido (body)"}`,
    });
    await ctx.close();
  });

  await tentar("Passos do formulário de eventos", async () => {
    const { ctx, page } = await abrir("/eventos", DESKTOP);
    await page.selectOption("#ev-tipo", "Treinamento");
    await page.getByRole("button", { name: "Continuar" }).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    const f1 = await paradaAtual(page);
    await page.fill("#ev-nome", "Maria Teste");
    await page.fill("#ev-email", "maria.teste@example.com");
    await page.fill("#ev-telefone", "(69) 99999-0000");
    await page.getByRole("button", { name: "Continuar" }).focus();
    await page.keyboard.press("Enter");
    await page.waitForTimeout(400);
    const f2 = await paradaAtual(page);
    registrar({
      roteiro: "Passos do pedido de proposta",
      rota: "/eventos",
      tela: "desktop",
      ok: /ev-nome/.test(f1?.desc ?? "") && /^input/.test(f2?.desc ?? ""),
      detalhe: `foco após o 1º Continuar: ${f1 ? `${f1.desc} "${f1.nome}"` : "perdido"}; após o 2º: ${f2 ? `${f2.desc} "${f2.nome}"` : "perdido"}`,
    });
    await ctx.close();
  });

  await tentar("Foco depois de erro de validação no servidor", async () => {
    const { ctx, page } = await abrir("/contato", DESKTOP);
    await page.evaluate(() => {
      (document.querySelector("form:has(#ct-nome)") as HTMLFormElement).noValidate = true;
    });
    await page.locator("form:has(#ct-nome) button[type=submit]").focus();
    await page.keyboard.press("Enter");
    await page.locator("form [role=alert]").first().waitFor({ timeout: 10_000 });
    await page.waitForTimeout(400);
    const foco = await paradaAtual(page);
    const descrito = await page.evaluate(() => {
      const c = document.querySelector("form [aria-invalid=true]");
      const ids = c?.getAttribute("aria-describedby") ?? "";
      return ids
        ? ids
            .split(/\s+/)
            .map((i) => document.getElementById(i)?.textContent ?? "")
            .join(" ")
        : "";
    });
    registrar({
      roteiro: "Foco após erro de formulário",
      rota: "/contato",
      tela: "desktop",
      ok: Boolean(foco) && /aria-invalid|ct-nome/.test(`${foco?.desc}`) && descrito.length > 0,
      detalhe: `foco: ${foco ? `${foco.desc} "${foco.nome}"` : "perdido (body)"}; erro ligado ao campo por aria-describedby: "${descrito}"`,
    });
    await ctx.close();
  });

  await tentar("Movimento reduzido", async () => {
    const { ctx, page } = await abrir("/universo/rios", { ...DESKTOP, reducedMotion: "reduce" });
    await page.waitForTimeout(2500);
    const estado = await page.evaluate(() => ({
      abertura: document.documentElement.getAttribute("data-opening"),
      videosTocando: [...document.querySelectorAll("video")].filter(
        (v) => !v.paused && getComputedStyle(v).display !== "none",
      ).length,
    }));
    registrar({
      roteiro: "Movimento reduzido",
      rota: "/universo/rios",
      tela: "desktop",
      ok: !estado.videosTocando,
      detalhe: JSON.stringify(estado),
    });
    await ctx.close();
  });
}

/** Árvore de acessibilidade, títulos e marcos de cada modelo de página. */
async function arvores() {
  const dir = resolve(out, "aria");
  mkdirSync(dir, { recursive: true });
  const resumo: {
    rota: string;
    h1: number;
    saltos: string[];
    titulos: string[];
    marcos: string[];
  }[] = [];
  for (const rota of MODELOS) {
    const { ctx, page } = await abrir(rota, DESKTOP);
    try {
      await revelar(page);
      const yaml = await page.locator("body").ariaSnapshot();
      writeFileSync(resolve(dir, `${nomeDaRota(rota)}-${phase}.yml`), `${yaml}\n`);
      const info = await page.evaluate(() => {
        const oculto = (e: Element) => Boolean(e.closest("[aria-hidden=true], [hidden]"));
        const titulos = [...document.querySelectorAll("h1, h2, h3, h4, h5, h6")]
          .filter((h) => !oculto(h))
          .map((h) => ({
            n: Number(h.tagName[1]),
            t: (h.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 60),
          }));
        const saltos: string[] = [];
        for (let i = 1; i < titulos.length; i++) {
          if (titulos[i].n > titulos[i - 1].n + 1)
            saltos.push(
              `h${titulos[i - 1].n} "${titulos[i - 1].t}" → h${titulos[i].n} "${titulos[i].t}"`,
            );
        }
        const marcos = [
          ...document.querySelectorAll(
            "header, nav, main, footer, aside, [role=region][aria-label], section[aria-label], form[aria-label]",
          ),
        ]
          .filter((m) => !oculto(m))
          .map(
            (m) =>
              `${m.tagName.toLowerCase()}${m.getAttribute("aria-label") ? ` "${m.getAttribute("aria-label")}"` : ""}`,
          );
        return {
          h1: titulos.filter((t) => t.n === 1).length,
          saltos,
          titulos: titulos.map((t) => `h${t.n} ${t.t}`),
          marcos,
        };
      });
      resumo.push({ rota, ...info });
      registrar({
        roteiro: "Títulos e marcos",
        rota,
        tela: "desktop",
        ok: info.h1 === 1 && info.saltos.length === 0,
        detalhe: `${info.h1} h1; ${info.titulos.length} títulos; saltos: ${info.saltos.join("; ") || "nenhum"}; marcos: ${info.marcos.join(", ")}`,
      });
    } finally {
      await ctx.close();
    }
  }
  return resumo;
}

(async () => {
  mkdirSync(out, { recursive: true });
  browser = await chromium.launch();
  const saida: Record<string, unknown> = { fase: phase, base, data: new Date().toISOString() };
  if (!so || so === "axe") {
    saida.axe = [...(await axeEmTodasAsRotas()), ...(await axeEmEstados())];
  }
  if (!so || so === "teclado") {
    for (const rota of MODELOS) {
      await percorrer(rota, "desktop", DESKTOP);
      await percorrer(rota, "celular", CELULAR);
    }
    await roteiros();
  }
  if (!so || so === "aria") saida.arvores = await arvores();
  saida.teclado = achados;
  await browser.close();

  const axeLista = (saida.axe as ResultadoAxe[] | undefined) ?? [];
  const porRegra = new Map<string, { impacto: string; ajuda: string; rotas: Set<string> }>();
  for (const r of axeLista) {
    for (const v of r.violacoes) {
      const item = porRegra.get(v.id) ?? {
        impacto: v.impacto,
        ajuda: v.ajuda,
        rotas: new Set<string>(),
      };
      item.rotas.add(`${r.rota} [${r.tela}${r.estado !== "padrão" ? `, ${r.estado}` : ""}]`);
      porRegra.set(v.id, item);
    }
  }
  saida.axePorRegra = [...porRegra.entries()].map(([id, v]) => ({
    id,
    impacto: v.impacto,
    ajuda: v.ajuda,
    ocorrencias: v.rotas.size,
    exemplos: [...v.rotas].slice(0, 8),
  }));
  writeFileSync(
    resolve(out, `a11y-${phase}${so ? `-${so}` : ""}.json`),
    `${JSON.stringify(saida, null, 2)}\n`,
  );

  process.stdout.write(
    `\nqa-a11y ${phase}: ${axeLista.length} medições axe, ${porRegra.size} regra(s) violada(s)\n`,
  );
  for (const [id, v] of porRegra)
    process.stdout.write(`  ${id} (${v.impacto}): ${v.rotas.size} ocorrência(s). ${v.ajuda}\n`);
  const falhas = achados.filter((a) => !a.ok);
  process.stdout.write(
    `teclado e leitor de tela: ${achados.length - falhas.length}/${achados.length} verificações ok\n`,
  );
  process.exit(porRegra.size || falhas.length ? 1 : 0);
})().catch((e: unknown) => {
  process.stderr.write(`qa-a11y: ${e instanceof Error ? e.stack : String(e)}\n`);
  process.exit(1);
});
