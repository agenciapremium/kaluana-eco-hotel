import { SiteLink as Link } from "@/components/ui/SiteLink";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

export type Crumb = { name: string; url: string };

/** Migalhas de pão com schema BreadcrumbList. Usar em toda página abaixo da Home (Parte 3.3). */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ name: "Início", url: "/" }, ...items];
  return (
    <nav aria-label="Você está em" className="text-sm">
      <ol className="flex flex-wrap items-center gap-2">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <li key={c.url} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page">{c.name}</span>
              ) : (
                <Link href={c.url} className="underline-offset-4 hover:underline">
                  {c.name}
                </Link>
              )}
              {!last ? <span aria-hidden="true">›</span> : null}
            </li>
          );
        })}
      </ol>
      <JsonLd data={breadcrumbSchema(all)} />
    </nav>
  );
}
