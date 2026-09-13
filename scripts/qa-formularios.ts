/**
 * Teste dos formulários de ponta a ponta (etapa 6), com um servidor de e-mail simulado.
 *
 * O script sobe um servidor HTTP local que imita a API do Resend (POST /emails), registra
 * cada e-mail e, quando pedido, responde com erro, como faria um domínio não verificado.
 * Nenhum e-mail de verdade sai. O site precisa estar no ar apontando para ele:
 *
 *   RESEND_API_KEY=re_teste LEAD_TO_EMAIL=qa@kaluana.test RESEND_BASE_URL=http://127.0.0.1:3999 \
 *     npx next start -p 3101
 *   npm run qa:formularios -- --url=http://localhost:3101 [--mock=3999] [--phase=pre]
 *
 * Cada caso usa um IP próprio (x-forwarded-for), para o limite por IP de um caso não
 * contaminar o outro. Grava `docs/qa/etapa-6/formularios-<fase>.json`.
 */
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { chromium, type Browser, type Page } from "playwright";
import { arg } from "./qa/rotas";

const base = arg("url", "http://localhost:3101");
const phase = arg("phase", "pre");
const portaMock = Number(arg("mock", "3999"));
const out = resolve(process.cwd(), arg("out", "docs/qa/etapa-6"));

type Email = {
  from?: string;
  to?: string | string[];
  subject?: string;
  text?: string;
  reply_to?: string | string[];
  attachments?: { filename?: string; content?: string }[];
};

const recebidos: Email[] = [];
let modo: "ok" | "falha" = "ok";

const mock = createServer((req, res) => {
  const partes: Buffer[] = [];
  req.on("data", (c: Buffer) => partes.push(c));
  req.on("end", () => {
    if (req.method === "POST" && req.url?.startsWith("/emails")) {
      res.setHeader("content-type", "application/json");
      if (modo === "falha") {
        res.writeHead(403);
        res.end(
          JSON.stringify({
            statusCode: 403,
            name: "validation_error",
            message: "The kaluanaecohotel.com.br domain is not verified.",
          }),
        );
        return;
      }
      recebidos.push(JSON.parse(Buffer.concat(partes).toString("utf8")) as Email);
      res.writeHead(200);
      res.end(JSON.stringify({ id: `simulado-${recebidos.length}` }));
      return;
    }
    res.writeHead(404);
    res.end();
  });
});

type Caso = {
  id: string;
  formulario: string;
  descricao: string;
  esperado: string;
  obtido: string;
  ok: boolean;
};
const casos: Caso[] = [];

let ip = 1;
/** Faixa de IP por rodada: o limite por IP fica na memória do servidor entre uma rodada e outra. */
const rodada = 20 + Math.floor(Math.random() * 200);
let browser: Browser;

async function abrir(caminho: string, js = true, ipFixo?: string) {
  const ctx = await browser.newContext({
    javaScriptEnabled: js,
    locale: "pt-BR",
    viewport: { width: 1280, height: 900 },
    extraHTTPHeaders: { "x-forwarded-for": ipFixo ?? `10.${rodada}.0.${ip++}` },
  });
  await ctx.addInitScript(() => {
    window.sessionStorage.setItem("kaluana:abertura", "1");
    window.localStorage.setItem("kaluana:consentimento", "granted");
  });
  const page = await ctx.newPage();
  const console: string[] = [];
  page.on("console", (m) => {
    if (m.type() === "error" || m.type() === "warning") console.push(m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => console.push(`pageerror: ${e.message.slice(0, 200)}`));
  // Com JavaScript, espera a rede ociosa: clicar antes da hidratação do React não faz nada.
  await page.goto(`${base}${caminho}`, { waitUntil: js ? "networkidle" : "load" });
  return { ctx, page, console };
}

/** Espera o desfecho do envio: redirecionamento para /obrigado ou mensagem de erro. */
async function desfecho(page: Page, timeout = 20_000) {
  const url = page.waitForURL(/\/obrigado/, { timeout }).then(
    () => "redirect" as const,
    () => null,
  );
  const erro = page
    .locator("form [role=alert], form .field-error")
    .first()
    .waitFor({ state: "visible", timeout })
    .then(
      () => "erro" as const,
      () => null,
    );
  const r = (await Promise.race([url, erro])) ?? "nada";
  const textos =
    r === "erro" ? await page.locator("form [role=alert], form .field-error").allInnerTexts() : [];
  return { r, url: page.url(), textos };
}

async function eventos(page: Page) {
  await page
    .waitForFunction(
      () =>
        (window.dataLayer ?? []).some((d) =>
          /^(lead_|reservar_click)/.test(String((d as { event?: string }).event)),
        ),
      null,
      { timeout: 4_000 },
    )
    .catch(() => undefined);
  return page.evaluate(() =>
    (window.dataLayer ?? [])
      .map((d) => d as { event?: string; [k: string]: unknown })
      .filter((d) => /^(lead_|reservar_click)/.test(String(d.event))),
  );
}

async function caso(
  id: string,
  formulario: string,
  descricao: string,
  esperado: string,
  fn: () => Promise<{ ok: boolean; obtido: string }>,
) {
  try {
    const { ok, obtido } = await fn();
    casos.push({ id, formulario, descricao, esperado, obtido, ok });
  } catch (e) {
    const obtido = `exceção: ${e instanceof Error ? e.message.split("\n")[0] : String(e)}`;
    casos.push({ id, formulario, descricao, esperado, obtido, ok: false });
  }
  const c = casos[casos.length - 1];
  process.stdout.write(`${c.ok ? "ok   " : "FALHA"} ${id} ${descricao}\n      ${c.obtido}\n`);
}

const pessoa = {
  nome: "Maria Teste",
  email: "maria.teste@example.com",
  telefone: "(69) 99999-0000",
};

async function preencherLead(page: Page, sou = "hospede", telefone = pessoa.telefone) {
  await page.fill("#lead-nome", pessoa.nome);
  await page.fill("#lead-email", pessoa.email);
  await page.fill("#lead-telefone", telefone);
  await page.selectOption("#lead-sou", sou);
  if (sou === "empresa") await page.fill("#lead-empresa", "Agro Teste Ltda");
}
const enviarLead = (page: Page) => page.click("form.lead-form button[type=submit]");

async function preencherContato(
  page: Page,
  mensagem = "Quero saber sobre hospedagem para a equipe.",
) {
  await page.fill("#ct-nome", pessoa.nome);
  await page.fill("#ct-email", pessoa.email);
  await page.fill("#ct-telefone", pessoa.telefone);
  await page.selectOption("#ct-assunto", "reserva");
  await page.fill("#ct-mensagem", mensagem);
}

async function preencherPreReserva(page: Page) {
  await page.fill("#pr-nome", pessoa.nome);
  await page.fill("#pr-email", pessoa.email);
  await page.fill("#pr-telefone", pessoa.telefone);
  await page.fill("#pr-empresa", "Agro Teste Ltda");
  await page.fill("#pr-entrada", "2027-01-10");
  await page.fill("#pr-saida", "2027-01-12");
}

async function preencherCurriculo(page: Page, arquivo?: string) {
  await page.fill("#cv-nome", pessoa.nome);
  await page.fill("#cv-telefone", pessoa.telefone);
  await page.fill("#cv-email", pessoa.email);
  await page.selectOption("#cv-area", "recepcao");
  await page.fill("#cv-experiencia", "Cinco anos de recepção em hotel.");
  if (arquivo) await page.setInputFiles("#cv-arquivo", arquivo);
}

const enviar = (page: Page, id: string) => page.click(`form:has(#${id}) button[type=submit]`);

/** Arquivos de teste gerados no diretório temporário do sistema. */
function arquivos() {
  const dir = mkdtempSync(join(tmpdir(), "kaluana-qa-"));
  const criar = (nome: string, bytes: number, cabecalho: string) => {
    const b = Buffer.alloc(bytes, 0x20);
    b.write(cabecalho);
    const p = join(dir, nome);
    writeFileSync(p, b);
    return p;
  };
  return {
    pdf40k: criar("curriculo-40kb.pdf", 40 * 1024, "%PDF-1.4\n"),
    pdf900k: criar("curriculo-900kb.pdf", 900 * 1024, "%PDF-1.4\n"),
    pdf2m: criar("curriculo-2mb.pdf", 2 * 1024 * 1024, "%PDF-1.4\n"),
    pdf45m: criar("curriculo-4-5mb.pdf", Math.round(4.5 * 1024 * 1024), "%PDF-1.4\n"),
    pdf6m: criar("curriculo-6mb.pdf", 6 * 1024 * 1024, "%PDF-1.4\n"),
    docx: criar("curriculo.docx", 40 * 1024, "PK"),
    png: criar("foto.png", 40 * 1024, "PNG\r\n"),
  };
}

const resumoEventos = (lista: { event?: string; [k: string]: unknown }[]) =>
  lista.map((e) => JSON.stringify(e)).join(" ") || "nenhum evento";

(async () => {
  mkdirSync(out, { recursive: true });
  await new Promise<void>((ok) => mock.listen(portaMock, "127.0.0.1", ok));
  browser = await chromium.launch();
  const f = arquivos();

  // ---------------------------------------------------------------- Home, pré-inauguração
  if (phase === "pre") {
    await caso(
      "L1",
      "Avisamos você primeiro (Home)",
      "Envio válido, perfil hóspede",
      "vai para /obrigado, dispara lead_pre_inauguracao e envia um e-mail com resposta para quem escreveu",
      async () => {
        const { ctx, page } = await abrir("/");
        const antes = recebidos.length;
        await preencherLead(page);
        await enviarLead(page);
        const d = await desfecho(page);
        const ev = await eventos(page);
        const email = recebidos[antes];
        await ctx.close();
        const ok =
          d.r === "redirect" &&
          d.url.endsWith("/obrigado?perfil=hospede") &&
          ev.some((e) => e.event === "lead_pre_inauguracao" && e.perfil === "hospede") &&
          recebidos.length === antes + 1 &&
          [email?.to].flat().includes("qa@kaluana.test") &&
          String(email?.reply_to) === pessoa.email &&
          /Origem: Página de pré-inauguração/.test(email?.text ?? "");
        return {
          ok,
          obtido: `${d.r} ${d.url.replace(base, "")}; eventos: ${resumoEventos(ev)}; e-mail: "${email?.subject}" para ${email?.to}, resposta para ${email?.reply_to}`,
        };
      },
    );

    await caso(
      "L2",
      "Avisamos você primeiro (Home)",
      "Envio válido, perfil empresa",
      "dispara lead_pre_inauguracao e lead_corporativo; o e-mail traz a empresa",
      async () => {
        const { ctx, page } = await abrir("/");
        const antes = recebidos.length;
        await preencherLead(page, "empresa");
        await enviarLead(page);
        const d = await desfecho(page);
        const ev = await eventos(page);
        const email = recebidos[antes];
        await ctx.close();
        const ok =
          d.r === "redirect" &&
          ev.some((e) => e.event === "lead_corporativo") &&
          /Empresa: Agro Teste Ltda/.test(email?.text ?? "");
        return {
          ok,
          obtido: `${d.r}; eventos: ${resumoEventos(ev)}; e-mail com empresa: ${/Empresa:/.test(email?.text ?? "")}`,
        };
      },
    );

    await caso(
      "L3",
      "Avisamos você primeiro (Home)",
      "Telefone com letras",
      "fica na página com o erro no campo, aria-invalid e nenhum e-mail",
      async () => {
        const { ctx, page } = await abrir("/");
        const antes = recebidos.length;
        await preencherLead(page, "hospede", "telefone");
        await enviarLead(page);
        const d = await desfecho(page);
        const invalido = await page.getAttribute("#lead-telefone", "aria-invalid");
        await ctx.close();
        const ok =
          d.r === "erro" &&
          d.textos.some((t) => t.includes("Confira o telefone.")) &&
          invalido === "true" &&
          recebidos.length === antes;
        return {
          ok,
          obtido: `${d.r}: ${d.textos.join(" / ")}; aria-invalid=${invalido}; e-mails novos: ${recebidos.length - antes}`,
        };
      },
    );

    await caso(
      "L4",
      "Avisamos você primeiro (Home)",
      "E-mail sem domínio completo (maria@teste)",
      "erro no campo de e-mail, nenhum envio",
      async () => {
        const { ctx, page } = await abrir("/");
        const antes = recebidos.length;
        await preencherLead(page);
        await page.fill("#lead-email", "maria@teste");
        await enviarLead(page);
        const d = await desfecho(page, 8_000);
        await ctx.close();
        const ok = d.r !== "redirect" && recebidos.length === antes;
        return {
          ok,
          obtido: `${d.r}: ${d.textos.join(" / ") || "validação nativa do navegador"}; e-mails novos: ${recebidos.length - antes}`,
        };
      },
    );

    await caso(
      "L5",
      "Avisamos você primeiro (Home)",
      "Honeypot preenchido (robô)",
      "finge sucesso e não envia e-mail",
      async () => {
        const { ctx, page } = await abrir("/");
        const antes = recebidos.length;
        await preencherLead(page);
        await page.evaluate(() => {
          (document.querySelector("form.lead-form input[name=website]") as HTMLInputElement).value =
            "https://spam.example";
        });
        await enviarLead(page);
        const d = await desfecho(page);
        await ctx.close();
        return {
          ok: d.r === "redirect" && recebidos.length === antes,
          obtido: `${d.r}; e-mails novos: ${recebidos.length - antes}`,
        };
      },
    );

    await caso(
      "L6",
      "Avisamos você primeiro (Home)",
      "Seis envios do mesmo IP em sequência",
      "os cinco primeiros passam, o sexto recebe a mensagem de limite",
      async () => {
        const mesmoIp = `10.${rodada}.1.${ip++}`;
        const obtidos: string[] = [];
        const antes = recebidos.length;
        for (let i = 0; i < 6; i++) {
          const { ctx, page } = await abrir("/", true, mesmoIp);
          await preencherLead(page);
          await enviarLead(page);
          const d = await desfecho(page);
          obtidos.push(d.r === "erro" ? `erro(${d.textos.join(" ")})` : d.r);
          await ctx.close();
        }
        const ok =
          obtidos.slice(0, 5).every((o) => o === "redirect") &&
          /Muitos envios/.test(obtidos[5]) &&
          recebidos.length === antes + 5;
        return { ok, obtido: `${obtidos.join(", ")}; e-mails: ${recebidos.length - antes}` };
      },
    );

    await caso(
      "L7",
      "Avisamos você primeiro (Home)",
      "API de e-mail recusa o envio (domínio não verificado)",
      "o visitante vê que não deu certo e pode tentar de novo; nada de /obrigado",
      async () => {
        const { ctx, page } = await abrir("/");
        modo = "falha";
        await preencherLead(page);
        await enviarLead(page);
        const d = await desfecho(page);
        modo = "ok";
        await ctx.close();
        return {
          ok: d.r === "erro" && d.textos.some((t) => /Não conseguimos enviar/.test(t)),
          obtido: `${d.r} ${d.url.replace(base, "")} ${d.textos.join(" / ")}`,
        };
      },
    );

    await caso(
      "L8",
      "Avisamos você primeiro (Home)",
      "Sem JavaScript, envio válido",
      "o POST nativo leva a /obrigado e envia o e-mail",
      async () => {
        const { ctx, page } = await abrir("/", false);
        const antes = recebidos.length;
        await preencherLead(page);
        // Sem JavaScript a rolagem suave até o botão faz o Playwright ver o botão "instável";
        // o Enter no campo faz o envio implícito do formulário, como um visitante faria.
        await page.press("#lead-telefone", "Enter");
        await page.waitForURL(/\/obrigado/, { timeout: 15_000 }).catch(() => undefined);
        const url = page.url();
        await ctx.close();
        return {
          ok: /\/obrigado/.test(url) && recebidos.length === antes + 1,
          obtido: `${url.replace(base, "")}; e-mails novos: ${recebidos.length - antes}`,
        };
      },
    );

    await caso(
      "L9",
      "Avisamos você primeiro (Home)",
      "Sem JavaScript, telefone inválido",
      "a página volta com a mensagem de erro no campo",
      async () => {
        const { ctx, page } = await abrir("/", false);
        await preencherLead(page, "hospede", "telefone");
        // Sem JavaScript, envio implícito com Enter, como no L8.
        await page.press("#lead-telefone", "Enter");
        await page.waitForLoadState("load");
        await page.waitForTimeout(1500);
        const textos = await page.locator("form .field-error, form [role=alert]").allInnerTexts();
        const url = page.url();
        await ctx.close();
        return {
          ok: textos.some((t) => t.includes("Confira o telefone.")),
          obtido: `${url.replace(base, "")}; mensagens: ${textos.join(" / ") || "nenhuma"}`,
        };
      },
    );
  }

  // ---------------------------------------------------------------- Contato
  await caso(
    "C1",
    "Contato",
    "Envio válido",
    "vai para /obrigado?perfil=contato, dispara lead_pre_inauguracao e envia o e-mail",
    async () => {
      const { ctx, page } = await abrir("/contato");
      const antes = recebidos.length;
      await preencherContato(page);
      await enviar(page, "ct-nome");
      const d = await desfecho(page);
      const ev = await eventos(page);
      const email = recebidos[antes];
      await ctx.close();
      const ok =
        d.r === "redirect" &&
        d.url.endsWith("/obrigado?perfil=contato") &&
        ev.some((e) => e.event === "lead_pre_inauguracao" && e.perfil === "contato") &&
        recebidos.length === antes + 1;
      return {
        ok,
        obtido: `${d.r} ${d.url.replace(base, "")}; eventos: ${resumoEventos(ev)}; e-mail: "${email?.subject}", resposta para ${email?.reply_to ?? "(sem reply_to)"}`,
      };
    },
  );

  await caso(
    "C2",
    "Contato",
    "Mensagem curta demais (oi)",
    "erro no campo de mensagem, nenhum e-mail",
    async () => {
      const { ctx, page } = await abrir("/contato");
      const antes = recebidos.length;
      await preencherContato(page, "oi");
      await enviar(page, "ct-nome");
      const d = await desfecho(page);
      await ctx.close();
      return {
        ok:
          d.r === "erro" &&
          d.textos.some((t) => t.includes("Escreva sua mensagem.")) &&
          recebidos.length === antes,
        obtido: `${d.r}: ${d.textos.join(" / ")}`,
      };
    },
  );

  await caso(
    "C3",
    "Contato",
    "Sem JavaScript, envio válido",
    "o POST nativo leva a /obrigado e envia o e-mail",
    async () => {
      const { ctx, page } = await abrir("/contato", false);
      const antes = recebidos.length;
      await preencherContato(page);
      await page.press("#ct-telefone", "Enter");
      await page.waitForURL(/\/obrigado/, { timeout: 15_000 }).catch(() => undefined);
      const url = page.url();
      await ctx.close();
      return {
        ok: /\/obrigado/.test(url) && recebidos.length === antes + 1,
        obtido: `${url.replace(base, "")}; e-mails novos: ${recebidos.length - antes}`,
      };
    },
  );

  await caso(
    "C4",
    "Contato",
    "API de e-mail recusa o envio",
    "o visitante vê o erro; nada de /obrigado",
    async () => {
      const { ctx, page } = await abrir("/contato");
      modo = "falha";
      await preencherContato(page);
      await enviar(page, "ct-nome");
      const d = await desfecho(page);
      modo = "ok";
      await ctx.close();
      return {
        ok: d.r === "erro" && d.textos.some((t) => /Não conseguimos enviar/.test(t)),
        obtido: `${d.r} ${d.url.replace(base, "")} ${d.textos.join(" / ")}`,
      };
    },
  );

  // ---------------------------------------------------------------- Reservas
  await caso(
    "P1",
    "Pré-reserva (Reservas)",
    "Envio válido com datas",
    "vai para /obrigado?perfil=pre-reserva, dispara lead_pre_inauguracao e reservar_click, e-mail com as datas",
    async () => {
      const { ctx, page } = await abrir("/reservas");
      const antes = recebidos.length;
      await preencherPreReserva(page);
      await enviar(page, "pr-nome");
      const d = await desfecho(page);
      const ev = await eventos(page);
      const email = recebidos[antes];
      await ctx.close();
      const ok =
        d.r === "redirect" &&
        ev.some((e) => e.event === "reservar_click") &&
        ev.some((e) => e.event === "lead_pre_inauguracao") &&
        /Entrada prevista: 2027-01-10/.test(email?.text ?? "");
      return {
        ok,
        obtido: `${d.r} ${d.url.replace(base, "")}; eventos: ${resumoEventos(ev)}; e-mail: ${(email?.text ?? "").split("\n").slice(3).join(" | ")}`,
      };
    },
  );

  // ---------------------------------------------------------------- Trabalhe conosco
  const curriculo = async (
    id: string,
    descricao: string,
    esperado: string,
    arquivo: string | undefined,
    espera: "redirect" | "erro",
    texto?: RegExp,
  ) =>
    caso(id, "Currículo (Trabalhe conosco)", descricao, esperado, async () => {
      const { ctx, page, console } = await abrir("/trabalhe-conosco");
      const antes = recebidos.length;
      await preencherCurriculo(page, arquivo);
      await enviar(page, "cv-nome");
      const d = await desfecho(page, 30_000);
      const email = recebidos[antes];
      const anexo = email?.attachments?.[0];
      await ctx.close();
      const ok = d.r === espera && (!texto || d.textos.some((t) => texto.test(t)));
      const tamanho = anexo?.content
        ? `${Math.round((anexo.content.length * 3) / 4 / 1024)} KB`
        : "";
      return {
        ok,
        obtido: `${d.r} ${d.url.replace(base, "")} ${d.textos.join(" / ")}${anexo ? `; anexo ${anexo.filename} ${tamanho}` : ""}${console.length ? `; console: ${console.join(" | ")}` : ""}`,
      };
    });

  // Limite de 4 MB (lib/curriculo.ts): a Vercel recusa corpo acima de 4,5 MB antes da action.
  const extra = mkdtempSync(join(tmpdir(), "kaluana-qa-"));
  const pdf = (nome: string, mb: number) => {
    const b = Buffer.alloc(Math.round(mb * 1024 * 1024), 0x20);
    b.write("%PDF-1.4\n");
    const p = join(extra, nome);
    writeFileSync(p, b);
    return p;
  };
  const pdf39m = pdf("curriculo-3-9mb.pdf", 3.9);
  const pdf42m = pdf("curriculo-4-2mb.pdf", 4.2);

  await curriculo(
    "V1",
    "PDF de 40 KB",
    "vai para /obrigado com o PDF anexado ao e-mail",
    f.pdf40k,
    "redirect",
  );
  await curriculo(
    "V2",
    "DOCX de 40 KB",
    "vai para /obrigado com o DOCX anexado",
    f.docx,
    "redirect",
  );
  await curriculo(
    "V3",
    "Sem arquivo (campo opcional)",
    "vai para /obrigado, e-mail avisa que não há anexo",
    undefined,
    "redirect",
  );
  await curriculo(
    "V4",
    "Imagem PNG no lugar do currículo",
    "recusa com a mensagem de formato",
    f.png,
    "erro",
    /PDF ou DOCX/,
  );
  await curriculo("V5", "PDF de 900 KB", "vai para /obrigado com o anexo", f.pdf900k, "redirect");
  await curriculo("V6", "PDF de 2 MB", "vai para /obrigado com o anexo", f.pdf2m, "redirect");
  await curriculo(
    "V7",
    "PDF de 3,9 MB (perto do limite de 4 MB)",
    "vai para /obrigado com o anexo",
    pdf39m,
    "redirect",
  );
  await curriculo(
    "V8",
    "PDF de 4,5 MB",
    "recusa ao escolher o arquivo, com a mensagem de 4 MB, sem enviar",
    f.pdf45m,
    "erro",
    /4 MB/,
  );
  await curriculo(
    "V9",
    "PDF de 6 MB",
    "recusa ao escolher o arquivo, com a mensagem de 4 MB, sem enviar",
    f.pdf6m,
    "erro",
    /4 MB/,
  );

  await caso(
    "V10",
    "Currículo (Trabalhe conosco)",
    "Sem JavaScript, PDF de 4,2 MB (a checagem do navegador não existe)",
    "o servidor recusa e a página volta com a mensagem de 4 MB",
    async () => {
      const { ctx, page } = await abrir("/trabalhe-conosco", false);
      const antes = recebidos.length;
      await preencherCurriculo(page, pdf42m);
      await page.press("#cv-nome", "Enter");
      await page.waitForLoadState("load");
      await page.waitForTimeout(1500);
      const textos = await page.locator("form .field-error, form [role=alert]").allInnerTexts();
      const url = page.url();
      await ctx.close();
      return {
        ok: textos.some((t) => /4 MB/.test(t)) && recebidos.length === antes,
        obtido: `${url.replace(base, "")}; mensagens: ${textos.join(" / ") || "nenhuma"}; e-mails novos: ${recebidos.length - antes}`,
      };
    },
  );

  // ---------------------------------------------------------------- Eventos (fora do menu, noindex)
  const preencherEvento = async (page: Page, pular2 = false) => {
    await page.selectOption("#ev-tipo", "Treinamento");
    await page.fill("#ev-data", "2027-03-15");
    await page.fill("#ev-pessoas", "40");
    await page.getByRole("button", { name: "Continuar" }).click();
    if (!pular2) {
      await page.fill("#ev-nome", pessoa.nome);
      await page.fill("#ev-empresa", "Agro Teste Ltda");
      await page.fill("#ev-email", pessoa.email);
      await page.fill("#ev-telefone", pessoa.telefone);
    }
    await page.getByRole("button", { name: "Continuar" }).click();
    await page.check("input[name=hospedagem][value=sim]");
    await page.fill("#ev-mensagem", "Treinamento de dois dias com almoço.");
  };

  await caso(
    "E1",
    "Pedido de proposta (Eventos)",
    "Três passos preenchidos",
    "vai para /obrigado?perfil=evento, dispara lead_evento e envia o e-mail",
    async () => {
      const { ctx, page } = await abrir("/eventos");
      const antes = recebidos.length;
      await preencherEvento(page);
      await page.click(".form-evento .form-enviar");
      const d = await desfecho(page);
      const ev = await eventos(page);
      const email = recebidos[antes];
      await ctx.close();
      const ok =
        d.r === "redirect" &&
        ev.some((e) => e.event === "lead_evento") &&
        /Hospedagem: sim/.test(email?.text ?? "");
      return {
        ok,
        obtido: `${d.r} ${d.url.replace(base, "")}; eventos: ${resumoEventos(ev)}; e-mail: "${email?.subject}", resposta para ${email?.reply_to ?? "(sem reply_to)"}`,
      };
    },
  );

  await caso(
    "E2",
    "Pedido de proposta (Eventos)",
    "Pula para o terceiro passo pelo indicador, sem preencher o segundo, e envia",
    "o formulário volta ao passo 2 com o foco no primeiro campo pendente e nada é enviado",
    async () => {
      const { ctx, page, console } = await abrir("/eventos");
      const antes = recebidos.length;
      await page.selectOption("#ev-tipo", "Treinamento");
      // O formulário entra na tela com a animação de entrada (500 ms); um clique automático no
      // meio do movimento cai no form, e não no botão do passo.
      await page.locator(".form-passos").scrollIntoViewIfNeeded();
      await page.waitForTimeout(800);
      await page.locator(".form-passo").nth(2).click();
      await page.check("input[name=hospedagem][value=sim]");
      await page.click(".form-evento .form-enviar");
      await page.waitForTimeout(2500);
      const passoAtual = await page.getAttribute(".form-evento", "data-passo");
      const nomeVisivel = await page.locator("#ev-nome").isVisible();
      const foco = await page.evaluate(() => document.activeElement?.id ?? "");
      await ctx.close();
      const ok =
        passoAtual === "1" && nomeVisivel && foco === "ev-nome" && recebidos.length === antes;
      return {
        ok,
        obtido: `passo ${Number(passoAtual) + 1}; campo nome visível: ${nomeVisivel}; foco em: ${foco || "nada"}; e-mails novos: ${recebidos.length - antes}; console: ${console.join(" | ") || "vazio"}`,
      };
    },
  );

  await caso(
    "E2b",
    "Pedido de proposta (Eventos)",
    "Continuar no passo 2 com os campos vazios",
    "o formulário fica no passo 2 e o foco vai para o campo obrigatório",
    async () => {
      const { ctx, page } = await abrir("/eventos");
      await page.selectOption("#ev-tipo", "Treinamento");
      await page.getByRole("button", { name: "Continuar" }).click();
      await page.getByRole("button", { name: "Continuar" }).click();
      await page.waitForTimeout(800);
      const passoAtual = await page.getAttribute(".form-evento", "data-passo");
      const foco = await page.evaluate(() => document.activeElement?.id ?? "");
      const aoVivo = await page.locator(".form-evento [aria-live]").innerText();
      await ctx.close();
      return {
        ok: passoAtual === "1" && foco === "ev-nome",
        obtido: `passo ${Number(passoAtual) + 1}; foco em: ${foco || "nada"}; região viva: "${aoVivo}"`,
      };
    },
  );

  await caso(
    "E3",
    "Pedido de proposta (Eventos)",
    "Sem JavaScript, formulário inteiro",
    "todos os campos visíveis, o POST leva a /obrigado",
    async () => {
      const { ctx, page } = await abrir("/eventos", false);
      const antes = recebidos.length;
      await page.selectOption("#ev-tipo", "Treinamento");
      await page.fill("#ev-nome", pessoa.nome);
      await page.fill("#ev-email", pessoa.email);
      await page.fill("#ev-telefone", pessoa.telefone);
      // Enter no campo: envio implícito, sem a rolagem suave que deixa o botão "instável".
      await page.press("#ev-telefone", "Enter");
      await page.waitForURL(/\/obrigado/, { timeout: 15_000 }).catch(() => undefined);
      const url = page.url();
      await ctx.close();
      return {
        ok: /\/obrigado/.test(url) && recebidos.length === antes + 1,
        obtido: `${url.replace(base, "")}; e-mails novos: ${recebidos.length - antes}`,
      };
    },
  );

  await caso(
    "E4",
    "Pedido de proposta (Eventos)",
    "API de e-mail recusa o envio",
    "o visitante vê o erro; nada de /obrigado",
    async () => {
      const { ctx, page } = await abrir("/eventos");
      modo = "falha";
      await preencherEvento(page);
      await page.click(".form-evento .form-enviar");
      const d = await desfecho(page);
      modo = "ok";
      await ctx.close();
      return {
        ok: d.r === "erro",
        obtido: `${d.r} ${d.url.replace(base, "")} ${d.textos.join(" / ")}`,
      };
    },
  );

  // ---------------------------------------------------------------- Medição entre formulários
  await caso(
    "S1",
    "Medição",
    "Dois formulários diferentes na mesma sessão (Contato e depois Pré-reserva)",
    "cada envio dispara o seu evento de conversão",
    async () => {
      const { ctx, page } = await abrir("/contato");
      await preencherContato(page);
      await enviar(page, "ct-nome");
      await desfecho(page);
      const primeiro = await eventos(page);
      await page.goto(`${base}/reservas`, { waitUntil: "load" });
      await preencherPreReserva(page);
      await enviar(page, "pr-nome");
      await desfecho(page);
      const segundo = await eventos(page);
      await ctx.close();
      const ok = primeiro.length > 0 && segundo.some((e) => e.event === "reservar_click");
      return {
        ok,
        obtido: `primeiro: ${resumoEventos(primeiro)}; segundo: ${resumoEventos(segundo)}`,
      };
    },
  );

  await browser.close();
  mock.close();

  const emails = recebidos.map((e) => ({
    assunto: e.subject,
    para: e.to,
    de: e.from,
    respostaPara: e.reply_to ?? null,
    linhas: (e.text ?? "").split("\n").length,
    anexos: (e.attachments ?? []).map((a) => ({
      arquivo: a.filename,
      kb: Math.round(((a.content?.length ?? 0) * 3) / 4 / 1024),
    })),
  }));
  writeFileSync(
    resolve(out, `formularios-${phase}.json`),
    `${JSON.stringify({ fase: phase, base, data: new Date().toISOString(), aprovados: casos.filter((c) => c.ok).length, total: casos.length, casos, emails }, null, 2)}\n`,
  );
  const falhas = casos.filter((c) => !c.ok);
  process.stdout.write(
    `qa-formularios ${phase}: ${casos.length - falhas.length}/${casos.length} casos aprovados\n`,
  );
  process.exit(falhas.length ? 1 : 0);
})().catch((e: unknown) => {
  process.stderr.write(`qa-formularios: ${e instanceof Error ? e.stack : String(e)}\n`);
  mock.close();
  process.exit(1);
});
