/**
 * Rotas já construídas. Links para rotas de etapas futuras não fazem prefetch,
 * para não gerar requisições 404 enquanto as páginas não existem.
 * Atualizar a cada etapa.
 */
export const builtRoutes = new Set<string>([
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
]);

export function isBuilt(href: string): boolean {
  const path = href.split(/[?#]/)[0];
  return builtRoutes.has(path);
}
