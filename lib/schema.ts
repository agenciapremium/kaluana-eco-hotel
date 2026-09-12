/**
 * Dados estruturados (schema.org). Regra: só declarar o que está visível na página.
 * Telefone, geo, redes e CEP entram quando o cliente fornecer e a página mostrar.
 */
import { site, siteUrl, eventosAutorizado } from "./site";
import type { Faq } from "./content-schema";

type JsonLd = Record<string, unknown>;

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
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
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
