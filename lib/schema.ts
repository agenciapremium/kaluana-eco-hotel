/**
 * Dados estruturados (schema.org). Regra: só declarar o que está visível na página.
 * Telefone, geo, redes e CEP entram quando o cliente fornecer e a página mostrar.
 */
import { site, siteUrl, eventosAutorizado } from "./site";
import type { Faq } from "./content-schema";
import { copyDeProducao } from "./copy";

type JsonLd = Record<string, unknown>;

/**
 * Texto que vai para dados estruturados. Campos ⟨pendentes⟩ nunca entram, em nenhum
 * ambiente: o schema é lido por máquina e a Parte 4.3 exige que tudo nele esteja visível
 * na página, que por sua vez esconde esses campos em produção.
 */
const limpo = (texto: string) => copyDeProducao(texto);

export function postalAddress(): JsonLd {
  return {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    addressCountry: site.address.country,
    ...(site.address.postalCode ? { postalCode: site.address.postalCode } : {}),
  };
}

export function organizationSchema(): JsonLd {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: site.name,
    legalName: site.legalName,
    taxID: site.cnpj,
    url: siteUrl,
    logo: `${siteUrl}/media/marca/logo-vertical.png`,
    address: postalAddress(),
    ...(site.email ? { email: site.email } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteSchema(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: site.name,
    url: siteUrl,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function hotelSchema(opts: {
  description: string;
  restaurante?: boolean;
  image?: string;
}): JsonLd {
  const containsPlace: JsonLd[] = [];
  if (opts.restaurante) {
    containsPlace.push({
      "@type": "Restaurant",
      name: "Restaurante Kaluanã",
      address: postalAddress(),
    });
  }
  if (eventosAutorizado) {
    containsPlace.push({
      "@type": "EventVenue",
      name: "Centro de convenções Kaluanã",
      address: postalAddress(),
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${siteUrl}/#hotel`,
    name: site.name,
    alternateName: site.shortName,
    description: opts.description,
    url: siteUrl,
    logo: `${siteUrl}/media/marca/logo-vertical.png`,
    image: opts.image ?? `${siteUrl}/opengraph-image.png`,
    address: postalAddress(),
    openingDate: site.openingDate,
    ...(site.geo ? { geo: { "@type": "GeoCoordinates", ...site.geo } } : {}),
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(containsPlace.length ? { containsPlace } : {}),
    parentOrganization: { "@id": `${siteUrl}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${siteUrl}${item.url === "/" ? "/" : item.url}`,
    })),
  };
}

export function faqSchema(faq: Faq[]): JsonLd {
  const perguntas = faq.map((f) => ({ p: limpo(f.p), r: limpo(f.r) })).filter((f) => f.p && f.r);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: perguntas.map((f) => ({
      "@type": "Question",
      name: f.p,
      acceptedAnswer: { "@type": "Answer", text: f.r },
    })),
  };
}

/* ------------------------------------------------------------------
   Acomodações (etapa 2): CollectionPage com ItemList de HotelRoom no hub;
   HotelRoom e Product com Offer nas categorias. Só o que a página mostra.
   ------------------------------------------------------------------ */

export type RoomSchemaInput = {
  slug: string;
  url: string;
  nome: string;
  descricao: string;
  capacidade: number;
  cama: string | null;
  suite: boolean;
  /** Itens da ficha visíveis na página (sem campos pendentes), inclusive os de acessibilidade. */
  amenidades: string[];
  image?: string;
};

/** URL absoluta do motor de reservas (ou de /reservas enquanto não houver motor). */
export function reservasAbsoluta(reservas: string): string {
  return /^https?:\/\//.test(reservas) ? reservas : `${siteUrl}${reservas}`;
}

export function hotelRoomSchema(r: RoomSchemaInput): JsonLd {
  const amenityFeature = r.amenidades.map((name) => ({
    "@type": "LocationFeatureSpecification",
    name,
    value: true,
  }));
  return {
    "@context": "https://schema.org",
    "@type": r.suite ? ["HotelRoom", "Suite"] : "HotelRoom",
    "@id": `${siteUrl}${r.url}#quarto`,
    name: r.nome,
    description: r.descricao,
    url: `${siteUrl}${r.url}`,
    ...(r.image ? { image: r.image } : {}),
    occupancy: { "@type": "QuantitativeValue", maxValue: r.capacidade, unitCode: "C62" },
    ...(r.cama ? { bed: { "@type": "BedDetails", typeOfBed: r.cama, numberOfBeds: 1 } } : {}),
    ...(amenityFeature.length ? { amenityFeature } : {}),
    containedInPlace: { "@id": `${siteUrl}/#hotel` },
  };
}

/**
 * Product com Offer apontando para o motor de reservas. Sem preço até a inauguração
 * (veto 2): availability PreOrder e a URL do motor vêm de NEXT_PUBLIC_RESERVAS_URL.
 */
export function roomProductSchema(r: RoomSchemaInput, reservas: string): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${siteUrl}${r.url}#produto`,
    name: r.nome,
    description: r.descricao,
    url: `${siteUrl}${r.url}`,
    ...(r.image ? { image: r.image } : {}),
    brand: { "@id": `${siteUrl}/#organization` },
    category: "Hospedagem",
    offers: {
      "@type": "Offer",
      url: reservasAbsoluta(reservas),
      availability: "https://schema.org/PreOrder",
      itemOffered: { "@id": `${siteUrl}${r.url}#quarto` },
      seller: { "@id": `${siteUrl}/#organization` },
    },
  };
}

export function roomsCollectionSchema(opts: {
  url: string;
  nome: string;
  descricao: string;
  quartos: { url: string; nome: string; capacidade: number }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}${opts.url}#pagina`,
    name: opts.nome,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#hotel` },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: opts.quartos.length,
      itemListElement: opts.quartos.map((q, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}${q.url}`,
        item: {
          "@type": "HotelRoom",
          "@id": `${siteUrl}${q.url}#quarto`,
          name: q.nome,
          url: `${siteUrl}${q.url}`,
          occupancy: { "@type": "QuantitativeValue", maxValue: q.capacidade, unitCode: "C62" },
        },
      })),
    },
  };
}

/* ------------------------------------------------------------------
   Universo Kaluanã (etapa 3): Article por elemento, ImageObject e
   CollectionPage com ItemList nos hubs. Parte 4.3 e Parte 6.0.
   ------------------------------------------------------------------ */

export type ArticleSchemaInput = {
  url: string;
  titulo: string;
  descricao: string;
  /** Nome do elemento e nome científico, quando houver. */
  sobre: { nome: string; cientifico?: string | null; tipo: "BodyOfWater" | "Thing" };
  imagem?: { url: string; alt: string; width: number; height: number };
  /** Data de atualização, visível no rodapé de autoria da página. */
  atualizadoEm: string;
};

export function imageObjectSchema(img: {
  url: string;
  alt: string;
  width: number;
  height: number;
}): JsonLd {
  return {
    "@type": "ImageObject",
    url: img.url,
    contentUrl: img.url,
    caption: img.alt,
    width: img.width,
    height: img.height,
  };
}

export function articleSchema(a: ArticleSchemaInput): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteUrl}${a.url}#artigo`,
    headline: a.titulo,
    description: a.descricao,
    url: `${siteUrl}${a.url}`,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${siteUrl}${a.url}`,
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    dateModified: a.atualizadoEm,
    ...(a.imagem ? { image: imageObjectSchema(a.imagem) } : {}),
    about: {
      "@type": a.sobre.tipo,
      name: a.sobre.nome,
      ...(a.sobre.cientifico ? { alternateName: a.sobre.cientifico } : {}),
    },
    isPartOf: { "@id": `${siteUrl}/#website` },
  };
}

/** CollectionPage com ItemList genérica, usada nos seis hubs do Universo. */
export function colecaoSchema(opts: {
  url: string;
  nome: string;
  descricao: string;
  itens: { url: string; nome: string; imagem?: string }[];
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}${opts.url}#pagina`,
    name: opts.nome,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderAscending",
      numberOfItems: opts.itens.length,
      itemListElement: opts.itens.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${siteUrl}${it.url}`,
        name: it.nome,
        ...(it.imagem ? { image: it.imagem } : {}),
      })),
    },
  };
}

/* ------------------------------------------------------------------
   Etapa 4: institucional, restaurante, eventos, território e blog.
   Regra de sempre: só declarar o que está visível na página.
   ------------------------------------------------------------------ */

export function aboutPageSchema(opts: { url: string; nome: string; descricao: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${siteUrl}${opts.url}#pagina`,
    name: opts.nome,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${siteUrl}/#website` },
    mainEntity: { "@id": `${siteUrl}/#organization` },
  };
}

/**
 * Restaurante (5.18). Sem `openingHoursSpecification` e sem `menu` enquanto os horários e o
 * cardápio forem campos pendentes: o schema não declara o que a página não mostra.
 */
export function restaurantSchema(opts: {
  url: string;
  descricao: string;
  cozinhas: string[];
  image?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${siteUrl}${opts.url}#restaurante`,
    name: "Restaurante Kaluanã",
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    ...(opts.image ? { image: opts.image } : {}),
    address: postalAddress(),
    servesCuisine: opts.cozinhas,
    acceptsReservations: true,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.geo ? { geo: { "@type": "GeoCoordinates", ...site.geo } } : {}),
    containedInPlace: { "@id": `${siteUrl}/#hotel` },
    parentOrganization: { "@id": `${siteUrl}/#organization` },
  };
}

/** Eventos (5.19). Capacidade só entra quando o cliente confirmar. */
export function eventVenueSchema(opts: {
  url: string;
  descricao: string;
  capacidade?: number | null;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "EventVenue",
    "@id": `${siteUrl}${opts.url}#local`,
    name: "Centro de convenções Kaluanã",
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    address: postalAddress(),
    ...(opts.capacidade ? { maximumAttendeeCapacity: opts.capacidade } : {}),
    containedInPlace: { "@id": `${siteUrl}/#hotel` },
  };
}

export function serviceSchema(opts: { url: string; nome: string; descricao: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}${opts.url}#servico`,
    name: opts.nome,
    description: opts.descricao,
    serviceType: "Organização de eventos",
    provider: { "@id": `${siteUrl}/#organization` },
    areaServed: { "@type": "City", name: site.city },
  };
}

/** Ji-Paraná (5.20): a cidade como entidade, para o GEO. */
export function touristDestinationSchema(opts: {
  url: string;
  nome: string;
  descricao: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "TouristDestination",
    "@id": `${siteUrl}${opts.url}#destino`,
    name: opts.nome,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.stateCode,
      addressCountry: site.address.country,
    },
    containsPlace: { "@id": `${siteUrl}/#hotel` },
  };
}

export function blogSchema(opts: { url: string; nome: string; descricao: string }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${siteUrl}${opts.url}#blog`,
    name: opts.nome,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    publisher: { "@id": `${siteUrl}/#organization` },
  };
}

export function blogPostingSchema(opts: {
  url: string;
  titulo: string;
  descricao: string;
  publicadoEm: string;
  atualizadoEm: string;
  keywords: string[];
  imagem?: { url: string; alt: string; width: number; height: number };
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${siteUrl}${opts.url}#post`,
    headline: opts.titulo,
    description: opts.descricao,
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    mainEntityOfPage: `${siteUrl}${opts.url}`,
    datePublished: opts.publicadoEm,
    dateModified: opts.atualizadoEm,
    author: { "@id": `${siteUrl}/#organization` },
    publisher: { "@id": `${siteUrl}/#organization` },
    ...(opts.keywords.length ? { keywords: opts.keywords.join(", ") } : {}),
    ...(opts.imagem ? { image: imageObjectSchema(opts.imagem) } : {}),
    isPartOf: { "@id": `${siteUrl}/historias#blog` },
  };
}

/* ------------------------------------------------------------------
   Etapa 5: conversão, contato, legais e a página de respostas.
   ------------------------------------------------------------------ */

export function webPageSchema(opts: {
  url: string;
  nome: string;
  descricao: string;
  tipo?: "WebPage" | "ContactPage";
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": opts.tipo ?? "WebPage",
    "@id": `${siteUrl}${opts.url}#pagina`,
    name: opts.nome,
    description: limpo(opts.descricao),
    url: `${siteUrl}${opts.url}`,
    inLanguage: "pt-BR",
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#hotel` },
  };
}

/**
 * Hotel da página de Reservas (5.23). O `potentialAction` de reserva só entra quando existir
 * motor de verdade: apontar ReserveAction para a própria página de pré-reserva seria
 * declarar uma capacidade que o site ainda não tem.
 */
export function hotelReservaSchema(opts: { descricao: string; motorUrl: string | null }): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${siteUrl}/#hotel`,
    name: site.name,
    description: limpo(opts.descricao),
    url: siteUrl,
    address: postalAddress(),
    openingDate: site.openingDate,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(opts.motorUrl
      ? {
          potentialAction: {
            "@type": "ReserveAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: opts.motorUrl,
              actionPlatform: [
                "http://schema.org/DesktopWebPlatform",
                "http://schema.org/MobileWebPlatform",
              ],
            },
            result: { "@type": "LodgingReservation", name: "Reserva no Kaluanã Eco Hotel" },
          },
        }
      : {}),
  };
}

/**
 * Hotel da página de Contato (5.24), com o NAP completo. Telefone, geo, CEP e ficha do
 * Google entram quando o cliente fornecer: a Parte 4.4 exige que o site espelhe a ficha, e
 * declarar dado errado é pior do que não declarar.
 */
export function hotelContatoSchema(opts: { descricao: string }): JsonLd {
  const sameAs = Object.values(site.social).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `${siteUrl}/#hotel`,
    name: site.name,
    alternateName: site.shortName,
    description: limpo(opts.descricao),
    url: siteUrl,
    logo: `${siteUrl}/media/marca/logo-vertical.png`,
    address: postalAddress(),
    openingDate: site.openingDate,
    ...(site.phone ? { telephone: site.phone } : {}),
    ...(site.email ? { email: site.email } : {}),
    ...(site.geo ? { geo: { "@type": "GeoCoordinates", ...site.geo } } : {}),
    ...(site.social.googleMaps ? { hasMap: site.social.googleMaps } : {}),
    ...(sameAs.length ? { sameAs } : {}),
    parentOrganization: { "@id": `${siteUrl}/#organization` },
  };
}
