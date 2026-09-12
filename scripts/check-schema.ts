/**
 * Auditoria de SEO técnico sobre o HTML construído (Parte 4.2 e 4.3).
 *
 * Confere, em todas as páginas de `.next/server/app`:
 *   1. um H1 por página;
 *   2. title único e com no máximo 60 caracteres;
 *   3. description única e entre 120 e 160 caracteres;
 *   4. canônica presente e sem parâmetro;
 *   5. JSON-LD válido, sem campo ⟨pendente⟩ e com os tipos que a Parte 4.3 manda para
 *      aquela rota;
 *   6. referências `@id` apontando para algo declarado em alguma página do site.
 *
 * Páginas com noindex ficam fora das regras de title, description e canônica: elas não
 * disputam índice. Use: npm run check:schema (precisa de um build antes).
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const dir = join(root, ".next/server/app");

if (!existsSync(dir)) {
  process.stderr.write("check-schema: rode npm run build antes\n");
  process.exit(1);
}

/** Tipos exigidos por rota, conforme a tabela da Parte 4.3. */
const exigidos: { rota: RegExp; tipos: string[] }[] = [
  { rota: /^\/$/, tipos: ["Hotel", "Organization", "WebSite", "BreadcrumbList"] },
  { rota: /^\/o-kaluana$/, tipos: ["AboutPage", "Organization"] },
  { rota: /^\/acomodacoes$/, tipos: ["CollectionPage", "BreadcrumbList"] },
  { rota: /^\/acomodacoes\/[^/]+$/, tipos: ["HotelRoom", "Product", "BreadcrumbList"] },
  { rota: /^\/universo$/, tipos: ["CollectionPage", "BreadcrumbList"] },
  { rota: /^\/universo\/[^/]+$/, tipos: ["CollectionPage", "BreadcrumbList"] },
  { rota: /^\/universo\/[^/]+\/[^/]+$/, tipos: ["Article", "FAQPage", "BreadcrumbList"] },
  { rota: /^\/restaurante$/, tipos: ["Restaurant", "BreadcrumbList"] },
  { rota: /^\/eventos$/, tipos: ["EventVenue", "Service", "BreadcrumbList"] },
  { rota: /^\/ji-parana$/, tipos: ["TouristDestination", "FAQPage", "BreadcrumbList"] },
  { rota: /^\/historias$/, tipos: ["Blog", "BreadcrumbList"] },
  { rota: /^\/historias\/[^/]+$/, tipos: ["BlogPosting", "BreadcrumbList"] },
  { rota: /^\/reservas$/, tipos: ["WebPage", "Hotel", "BreadcrumbList"] },
  { rota: /^\/contato$/, tipos: ["ContactPage", "Hotel", "BreadcrumbList"] },
  { rota: /^\/perguntas-frequentes$/, tipos: ["WebPage", "FAQPage", "BreadcrumbList"] },
  { rota: /^\/trabalhe-conosco$/, tipos: ["WebPage", "BreadcrumbList"] },
  { rota: /^\/politica-de-privacidade$/, tipos: ["WebPage", "BreadcrumbList"] },
  { rota: /^\/termos-de-uso$/, tipos: ["WebPage", "BreadcrumbList"] },
];

type Pagina = {
  rota: string;
  arquivo: string;
  html: string;
  noindex: boolean;
  title: string;
  description: string;
  canonical: string;
  h1: string[];
  jsonLd: unknown[];
};

function listar(): string[] {
  const out: string[] = [];
  const pilha = [dir];
  while (pilha.length) {
    const atual = pilha.pop() as string;
    for (const nome of readdirSync(atual)) {
      const p = join(atual, nome);
      if (statSync(p).isDirectory()) pilha.push(p);
      // Rotas internas do Next e a página de teste do áudio, que só existe em
      // desenvolvimento, ficam fora da auditoria: não disputam índice.
      else if (nome.endsWith(".html") && !/^_/.test(nome) && !p.includes("/dev/")) out.push(p);
    }
  }
  return out.sort();
}

const decodificar = (s: string) =>
  s
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)));

function ler(arquivo: string): Pagina {
  const html = readFileSync(arquivo, "utf8");
  const rota =
    "/" +
    relative(dir, arquivo)
      .replace(/\.html$/, "")
      .replace(/^index$/, "");
  const meta = (nome: string) =>
    decodificar(
      html.match(new RegExp(`<meta name="${nome}" content="([^"]*)"`, "i"))?.[1] ??
        html.match(new RegExp(`<meta content="([^"]*)" name="${nome}"`, "i"))?.[1] ??
        "",
    );
  const jsonLd: unknown[] = [];
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const dado = JSON.parse(m[1].replace(/\\u003c/g, "<"));
      for (const d of Array.isArray(dado) ? dado : [dado]) jsonLd.push(d);
    } catch {
      jsonLd.push({ __invalido: m[1].slice(0, 120) });
    }
  }
  return {
    rota: rota === "/" ? "/" : rota.replace(/\/index$/, ""),
    arquivo,
    html,
    noindex: /<meta name="robots" content="[^"]*noindex/i.test(html),
    title: decodificar(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? ""),
    description: meta("description"),
    canonical: html.match(/<link rel="canonical" href="([^"]*)"/i)?.[1] ?? "",
    h1: [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      m[1]
        .replace(/<[^>]+>/g, "")
        .replace(/\s+/g, " ")
        .trim(),
    ),
    jsonLd,
  };
}

const paginas = listar().map(ler);
const problemas: string[] = [];
const aviso = (rota: string, texto: string) => problemas.push(`${rota}: ${texto}`);

const titles = new Map<string, string[]>();
const descriptions = new Map<string, string[]>();
const idsDeclarados = new Set<string>();
const idsUsados: { rota: string; id: string }[] = [];

for (const p of paginas) {
  // 1. H1
  if (p.h1.length === 0) aviso(p.rota, "sem H1");
  if (p.h1.length > 1) aviso(p.rota, `${p.h1.length} H1 na mesma página`);

  // 2 e 3. Title e description, só para páginas que disputam índice.
  if (!p.noindex) {
    if (!p.title) aviso(p.rota, "sem title");
    else if (p.title.length > 60) aviso(p.rota, `title com ${p.title.length} caracteres`);
    if (!p.description) aviso(p.rota, "sem description");
    else if (p.description.length < 120 || p.description.length > 160) {
      aviso(p.rota, `description com ${p.description.length} caracteres (esperado 120 a 160)`);
    }
    if (p.title) titles.set(p.title, [...(titles.get(p.title) ?? []), p.rota]);
    if (p.description) {
      descriptions.set(p.description, [...(descriptions.get(p.description) ?? []), p.rota]);
    }

    // 4. Canônica
    if (!p.canonical) aviso(p.rota, "sem canônica");
    else if (p.canonical.includes("?")) aviso(p.rota, "canônica com parâmetro");
  }

  // 5. JSON-LD
  const tipos = new Set<string>();
  for (const d of p.jsonLd) {
    const obj = d as Record<string, unknown>;
    if (obj.__invalido) {
      aviso(p.rota, `JSON-LD inválido: ${String(obj.__invalido)}`);
      continue;
    }
    const t = obj["@type"];
    for (const x of Array.isArray(t) ? t : [t]) if (typeof x === "string") tipos.add(x);
    const texto = JSON.stringify(obj);
    const pendentes = texto.match(/⟨[^⟩]{0,60}⟩/g);
    if (pendentes)
      aviso(p.rota, `JSON-LD com campo pendente: ${[...new Set(pendentes)].join(", ")}`);
    // Coleta @id declarados e referenciados, para conferir as ligações entre entidades.
    const percorrer = (v: unknown, raiz: boolean) => {
      if (Array.isArray(v)) return v.forEach((x) => percorrer(x, false));
      if (!v || typeof v !== "object") return;
      const o = v as Record<string, unknown>;
      const id = typeof o["@id"] === "string" ? (o["@id"] as string) : null;
      if (id) {
        const soRef = Object.keys(o).length === 1;
        if (soRef) idsUsados.push({ rota: p.rota, id });
        else idsDeclarados.add(id);
      }
      for (const [k, x] of Object.entries(o)) if (k !== "@id") percorrer(x, false);
      void raiz;
    };
    percorrer(obj, true);
  }

  const regra = exigidos.find((e) => e.rota.test(p.rota));
  if (regra) {
    const faltando = regra.tipos.filter((t) => !tipos.has(t));
    if (faltando.length) aviso(p.rota, `JSON-LD sem ${faltando.join(", ")}`);
  }
}

// Title e description únicos (Parte 4.2, item 5).
for (const [t, rotas] of titles) {
  if (rotas.length > 1) aviso(rotas.join(", "), `title repetido: ${t.slice(0, 60)}`);
}
for (const [d, rotas] of descriptions) {
  if (rotas.length > 1) aviso(rotas.join(", "), `description repetida: ${d.slice(0, 60)}`);
}

// 6. Referências @id que ninguém declara.
const orfas = new Map<string, Set<string>>();
for (const u of idsUsados) {
  if (!idsDeclarados.has(u.id)) {
    orfas.set(u.id, (orfas.get(u.id) ?? new Set()).add(u.rota));
  }
}
for (const [id, rotas] of orfas) {
  aviso(
    `${[...rotas].slice(0, 3).join(", ")}${rotas.size > 3 ? ` e mais ${rotas.size - 3}` : ""}`,
    `referência @id sem declaração em nenhuma página: ${id}`,
  );
}

process.stdout.write(`check-schema: ${paginas.length} página(s) conferidas\n`);
if (problemas.length === 0) {
  process.stdout.write("check-schema: nenhum problema\n");
  process.exit(0);
}
for (const p of problemas) process.stdout.write(`  ${p}\n`);
process.stdout.write(`check-schema: ${problemas.length} problema(s)\n`);
process.exit(1);
