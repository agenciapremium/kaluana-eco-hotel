/**
 * Rotas já construídas. Links para rotas de etapas futuras não fazem prefetch,
 * para não gerar requisições 404 enquanto as páginas não existem.
 *
 * Este módulo é importado por componentes cliente (SiteLink, TrackedLink), então não pode
 * importar os JSON de content/: a lista das 70 páginas do Universo viraria 96 KB de bundle
 * no navegador. As rotas do Universo entram por padrão, não por enumeração.
 * Atualizar a cada etapa.
 */
const exatas = new Set<string>([
  "/",
  "/obrigado",
  "/acomodacoes",
  "/acomodacoes/superior-familia",
  "/acomodacoes/duplo-king",
  "/acomodacoes/superior-acessivel",
  "/acomodacoes/superior-familia-com-terraco",
  "/acomodacoes/suite-terraco-lateral-aberto",
  "/acomodacoes/suite-terraco-lateral-fechado",
  "/acomodacoes/suite-presidencial-onca-pintada",
  "/universo",
  "/o-kaluana",
  "/restaurante",
  "/eventos",
  "/ji-parana",
  "/historias",
  "/reservas",
  "/contato",
  "/perguntas-frequentes",
  "/trabalhe-conosco",
  "/politica-de-privacidade",
  "/termos-de-uso",
]);

/** Hubs de andar, páginas de elemento e posts, todos gerados no build. */
const padroes = [
  /^\/universo\/(rios|peixes|arvores|aves|guardioes)$/,
  /^\/universo\/(rios|peixes|arvores|aves|guardioes)\/[a-z0-9-]+$/,
  /^\/historias\/[a-z0-9-]+$/,
];

export function isBuilt(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  return exatas.has(path) || padroes.some((re) => re.test(path));
}
