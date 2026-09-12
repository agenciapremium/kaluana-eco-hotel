/**
 * Confere as variáveis de ambiente antes do build de produção na Vercel (etapa 6).
 *
 * Só age no build de produção da Vercel (VERCEL=1 e VERCEL_ENV=production). Em
 * desenvolvimento, na pré-visualização e nos builds locais de QA, apenas informa e segue.
 *
 * Sem RESEND_API_KEY e LEAD_TO_EMAIL os formulários não teriam para onde mandar os contatos,
 * e sem a URL do domínio as canônicas e o sitemap sairiam errados. Nesses casos o build de
 * produção para: é melhor o deploy falhar do que o site ir ao ar perdendo contatos. O GTM é
 * recomendado, mas não bloqueia (o site funciona sem medição).
 *
 * Uso: npm run check:env (roda no prebuild)
 */
const producaoNaVercel = process.env.VERCEL === "1" && process.env.VERCEL_ENV === "production";

if (!producaoNaVercel) {
  process.stdout.write(
    `check-env: ambiente ${process.env.VERCEL_ENV ?? "local"}, conferência de produção não se aplica\n`,
  );
  process.exit(0);
}

const erros: string[] = [];
const avisos: string[] = [];

for (const nome of [
  "NEXT_PUBLIC_SITE_PHASE",
  "NEXT_PUBLIC_SITE_URL",
  "RESEND_API_KEY",
  "LEAD_TO_EMAIL",
  "LEAD_FROM_EMAIL",
]) {
  if (!process.env[nome]) erros.push(`${nome} não definida`);
}

const fase = process.env.NEXT_PUBLIC_SITE_PHASE;
if (fase && fase !== "pre" && fase !== "full") {
  erros.push(`NEXT_PUBLIC_SITE_PHASE deve ser pre ou full (veio "${fase}")`);
}

const url = process.env.NEXT_PUBLIC_SITE_URL;
if (url && url.replace(/\/$/, "") !== "https://kaluanaecohotel.com.br") {
  erros.push(`NEXT_PUBLIC_SITE_URL deve ser https://kaluanaecohotel.com.br (veio "${url}")`);
}

const remetente = process.env.LEAD_FROM_EMAIL;
if (remetente && !remetente.endsWith("@kaluanaecohotel.com.br")) {
  avisos.push("LEAD_FROM_EMAIL fora do domínio do hotel: o Resend só envia de domínio verificado");
}

if (!process.env.NEXT_PUBLIC_GTM_ID)
  avisos.push("NEXT_PUBLIC_GTM_ID vazio: o site vai ao ar sem medição");

for (const a of avisos) process.stdout.write(`check-env: aviso: ${a}\n`);
if (erros.length) {
  for (const e of erros) process.stderr.write(`check-env: ${e}\n`);
  process.stderr.write("check-env: build de produção interrompido. Ver docs/deploy.md.\n");
  process.exit(1);
}
process.stdout.write("check-env: variáveis de produção conferidas\n");
