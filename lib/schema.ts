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

export function hotelSchema(opts: { description: string; restaurante?: boolean; image?: string }): JsonLd {
  const containsPlace: JsonLd[] = [];
  if (opts.restaurante) {
    containsPlace.push({ "@type": "Restaurant", name: "Restaurante Kaluanã", address: postalAddress() });
  }
  if (eventosAutorizado) {
    containsPlace.push({ "@type": "EventVenue", name: "Centro de convenções Kaluanã", address: postalAddress() });
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
