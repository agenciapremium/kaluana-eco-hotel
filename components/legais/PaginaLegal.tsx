import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import type { Pagina } from "@/lib/content-schema";
import { atualizadoEm, type BlocoLegal } from "@/lib/legais";
import { webPageSchema } from "@/lib/schema";
import { motion as motionTokens } from "@/lib/tokens";

const porExtenso = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

/**
 * Página legal (5.27 e 5.28). Sem animação além da entrada padrão, leitura em coluna única.
 * O aviso de minuta fica visível até a validação jurídica do cliente.
 */
export function PaginaLegal({
  pagina,
  blocos,
  outra,
}: {
  pagina: Pagina;
  blocos: BlocoLegal[];
  outra: { url: string; nome: string };
}) {
  return (
    <>
      <JsonLd
        data={webPageSchema({
          url: pagina.url,
          nome: pagina.seo.h1,
          descricao: pagina.seo.resposta.trim(),
        })}
      />
      <div className="pagina-legal">
        <div className="container-site">
          <Breadcrumbs items={[{ name: pagina.seo.h1, url: pagina.url }]} />
          <h1 className="text-display mt-8">{pagina.seo.h1}</h1>
          <p className="post-meta">
            Atualizado em <time dateTime={atualizadoEm}>{porExtenso(atualizadoEm)}</time>
          </p>
          <p className="aviso-interno mt-6">
            Minuta preparada pela Agência Premium a partir dos dados do projeto, à espera de
            validação jurídica do cliente.
          </p>
        </div>

        <div id="conteudo-principal" className="container-site texto-legal">
          {blocos.map((b, i) => (
            <Reveal key={b.titulo} delay={Math.min(i, 4) * motionTokens.stagger.min}>
              <h2>{b.titulo}</h2>
              {b.paragrafos.map((p) => (
                <p key={p}>{p}</p>
              ))}
              {b.itens ? (
                <ul>
                  {b.itens.map((it) => (
                    <li key={it}>{it}</li>
                  ))}
                </ul>
              ) : null}
            </Reveal>
          ))}
          <Reveal className="mt-12">
            <Link href={outra.url} className="btn btn-secondary">
              {outra.nome}
              <Arrow />
            </Link>
          </Reveal>
        </div>
      </div>
    </>
  );
}
