import { SiteLink as Link } from "@/components/ui/SiteLink";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { Placeholder } from "@/components/Placeholder";
import { floorOrder, floors } from "@/lib/tokens";
import { footerSiteLinks, legalLinks, phase, site } from "@/lib/site";

const redes = [
  { label: "Instagram", href: site.social.instagram },
  { label: "Facebook", href: site.social.facebook },
  { label: "LinkedIn", href: site.social.linkedin },
];

/**
 * Rodapé (Parte 3.3): símbolo em traço, nome completo, NAP; O site; Universo Kaluanã;
 * redes, legais e a assinatura. Abaixo, CNPJ e razão social.
 * Na fase de pré-inauguração, versão curta (5.30): nome, endereço, redes.
 */
export function Footer() {
  const full = phase === "full";
  return (
    <footer className="bg-cafe text-bege">
      <div className="container-site section-y-sm">
        <div
          className={
            full ? "grid gap-10 md:grid-cols-2 lg:grid-cols-4" : "grid gap-10 md:grid-cols-3"
          }
        >
          <div className="flex flex-col gap-4">
            <StrokeSymbol className="h-14 w-14" title="Símbolo do Kaluanã" />
            <p className="font-display text-2xl">{site.name}</p>
            <address className="text-bege/85 text-base leading-relaxed not-italic">
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}
              <br />
              {site.phone ? (
                <a href={`tel:${site.phone}`}>{site.phone}</a>
              ) : (
                <Placeholder label="telefone oficial" />
              )}
              <br />
              {site.email ? (
                <a href={`mailto:${site.email}`}>{site.email}</a>
              ) : (
                <Placeholder label="contato@kaluanaecohotel.com.br" />
              )}
            </address>
          </div>

          {full ? (
            <nav aria-label="O site">
              <h2 className="footer-heading">O site</h2>
              <ul className="footer-list">
                {footerSiteLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          {full ? (
            <nav aria-label="Universo Kaluanã">
              <h2 className="footer-heading">Universo Kaluanã</h2>
              <ul className="footer-list">
                {floorOrder.map((key) => (
                  <li key={key}>
                    <Link href={floors[key].url}>{floors[key].nome}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}

          <div className={full ? "" : "md:col-span-2 md:grid md:grid-cols-2 md:gap-10"}>
            <div>
              <h2 className="footer-heading">Siga</h2>
              <ul className="footer-list">
                {redes.map((r) => (
                  <li key={r.label}>
                    {r.href ? (
                      <a href={r.href} rel="noopener" target="_blank">
                        {r.label}
                        <span className="sr-only"> (abre em nova aba)</span>
                      </a>
                    ) : (
                      <span>
                        {r.label} <Placeholder label="link" />
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-8 md:mt-0">
              <ul className="footer-list">
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}>{l.label}</Link>
                  </li>
                ))}
              </ul>
              <p className="font-display text-bege/85 mt-6 text-xl italic">{site.signature}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-bege/15 border-t">
        <div className="container-site text-bege/70 flex flex-wrap justify-between gap-2 py-4 text-sm">
          <span>
            {site.legalName} · CNPJ {site.cnpj}
          </span>
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
        </div>
      </div>
    </footer>
  );
}
