/**
 * Dados fixos do hotel e configuração por ambiente.
 * Tudo o que é NAP (nome, endereço, telefone) precisa ser idêntico à ficha do Google.
 * Campos ainda não fornecidos pelo cliente ficam como null e são tratados por
 * components/Placeholder.tsx (visíveis em desenvolvimento, ocultos em produção).
 */

export type SitePhase = "pre" | "full";

export const phase: SitePhase = process.env.NEXT_PUBLIC_SITE_PHASE === "full" ? "full" : "pre";

export const isProduction = process.env.NODE_ENV === "production";

/** Página Eventos e menções ao auditório só entram com autorização do cliente (veto 3). */
export const eventosAutorizado = process.env.NEXT_PUBLIC_EVENTOS_AUTORIZADO === "true";

/**
 * Avisos internos (minuta jurídica, post a revisar, página fora do menu) aparecem em
 * desenvolvimento e na pré-visualização da Vercel, para quem revisa, e nunca no deploy de
 * produção. VERCEL_ENV é definida pela Vercel no build.
 */
export const notasInternas = process.env.VERCEL_ENV !== "production";

/** URL do motor de reservas. Enquanto não houver, o botão Reservar leva a /reservas. */
export const reservasUrl = process.env.NEXT_PUBLIC_RESERVAS_URL || "/reservas";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://kaluanaecohotel.com.br"
).replace(/\/$/, "");

export const site = {
  name: "Kaluanã Eco Hotel",
  shortName: "Kaluanã",
  legalName: "KALUANA ECO HOTEL LTDA",
  cnpj: "47.562.282/0001-84",
  url: siteUrl,
  openingDate: "2026-12",
  openingLabel: "dezembro de 2026",
  city: "Ji-Paraná",
  state: "Rondônia",
  stateCode: "RO",
  address: {
    street: "Rodovia Pastor Severo Antonio de Araujo, 2015, lote 2",
    locality: "Ji-Paraná",
    region: "RO",
    country: "BR",
    /** ⟨CEP⟩ pendente com o cliente. */
    postalCode: null as string | null,
  },
  /** ⟨lat, long⟩ pendentes com o cliente. */
  geo: null as { latitude: number; longitude: number } | null,
  /** ⟨número oficial⟩ pendente (prazo 31/10). O provisório não entra no site. */
  phone: null as string | null,
  whatsapp: null as string | null,
  /** ⟨contato@kaluanaecohotel.com.br⟩ a confirmar. */
  email: null as string | null,
  /** Handles pendentes (Parte 8.2, item 18). */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    linkedin: null as string | null,
    googleMaps: null as string | null,
  },
  /** Usado no rodapé como assinatura. */
  signature: "Feito em Ji-Paraná",
} as const;

/** Menu do cabeçalho na fase completa. Eventos só com autorização. */
export const mainNav = [
  { href: "/o-kaluana", label: "O Kaluanã" },
  { href: "/acomodacoes", label: "Acomodações" },
  { href: "/universo", label: "Universo" },
  { href: "/restaurante", label: "Restaurante" },
  ...(eventosAutorizado ? [{ href: "/eventos", label: "Eventos" }] : []),
  { href: "/ji-parana", label: "Ji-Paraná" },
  { href: "/historias", label: "Histórias" },
] as const;

/** Páginas fixas listadas no rodapé (coluna O site). */
export const footerSiteLinks = [
  { href: "/o-kaluana", label: "O Kaluanã" },
  { href: "/acomodacoes", label: "Acomodações" },
  { href: "/universo", label: "Universo Kaluanã" },
  { href: "/restaurante", label: "Restaurante" },
  ...(eventosAutorizado ? [{ href: "/eventos", label: "Eventos" }] : []),
  { href: "/ji-parana", label: "Ji-Paraná" },
  { href: "/historias", label: "Histórias" },
  { href: "/reservas", label: "Reservas" },
  { href: "/contato", label: "Contato" },
  { href: "/perguntas-frequentes", label: "Perguntas frequentes" },
  { href: "/trabalhe-conosco", label: "Trabalhe conosco" },
] as const;

export const legalLinks = [
  { href: "/politica-de-privacidade", label: "Política de privacidade" },
  { href: "/termos-de-uso", label: "Termos de uso" },
] as const;
