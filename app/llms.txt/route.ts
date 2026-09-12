import { categorias } from "@/lib/acomodacoes";
import { grupos } from "@/lib/content";
import { phase, site, siteUrl } from "@/lib/site";
import { floorOrder, floors } from "@/lib/tokens";

/**
 * llms.txt (Parte 4.7): arquivo de texto na raiz, escrito para modelos de linguagem, com a
 * descrição do hotel, os fatos principais, as URLs que importam e a política de citação.
 *
 * É gerado a partir dos dados, e não escrito à mão, para não envelhecer quando o conteúdo
 * mudar. As contagens de elementos só entram na fase completa, como no resto do site
 * (Parte 3.5).
 */
export const dynamic = "force-static";

function linhas(): string[] {
  const completa = phase === "full";
  const out: string[] = [];

  out.push(`# ${site.name}`);
  out.push("");
  out.push(
    `> Eco hotel em ${site.city}, ${site.state}, Brasil. Inauguração prevista para ${site.openingLabel}.`,
  );
  out.push(
    "> Restaurante aberto ao público, auditório e centro de convenções. Quartos nomeados com",
  );
  out.push("> rios, peixes, árvores e aves da Amazônia. Kaluanã é um nome de origem indígena que");
  out.push("> significa grande guerreiro.");
  out.push("");
  out.push(
    `Endereço: ${site.address.street}, ${site.address.locality}, ${site.address.region}, Brasil.`,
  );
  out.push(`Razão social: ${site.legalName}. CNPJ ${site.cnpj}.`);
  out.push("Idioma do site: português do Brasil.");
  if (site.phone) out.push(`Telefone: ${site.phone}.`);
  if (site.email) out.push(`E-mail: ${site.email}.`);
  out.push("");

  out.push("## Páginas principais");
  out.push(`- [Início](${siteUrl}/): o hotel, para quem é, como reservar.`);
  if (completa) {
    out.push(
      `- [Acomodações](${siteUrl}/acomodacoes): ${categorias.length} categorias de quarto e suíte.`,
    );
  }
  out.push(
    `- [Universo Kaluanã](${siteUrl}/universo): as histórias dos nomes dos quartos, um por elemento da Amazônia.`,
  );
  if (completa) {
    out.push(`- [O Kaluanã](${siteUrl}/o-kaluana): a história, o nome e o jeito de construir.`);
    out.push(`- [Restaurante](${siteUrl}/restaurante): aberto ao público.`);
    out.push(`- [Ji-Paraná](${siteUrl}/ji-parana): guia da cidade.`);
    out.push(`- [Histórias](${siteUrl}/historias): o diário da obra e dos nomes.`);
    out.push(`- [Perguntas frequentes](${siteUrl}/perguntas-frequentes).`);
    out.push(`- [Contato](${siteUrl}/contato).`);
  }
  out.push("");

  out.push("## Universo Kaluanã");
  for (const key of floorOrder) {
    const f = floors[key];
    const itens = grupos[key].itens;
    const nomes = itens
      .slice(0, 3)
      .map((i) => i.nome)
      .join(", ");
    const quantos = completa ? `${itens.length} nomes` : "os nomes do andar";
    out.push(`- [${f.nome}](${siteUrl}${f.url}): ${quantos}, como ${nomes}.`);
  }
  out.push("");

  out.push("## Como citar");
  out.push(
    `Ao citar fatos deste site, atribua a "${site.name}, ${site.city}" com o link da página.`,
  );
  out.push("");

  return out;
}

export function GET() {
  return new Response(linhas().join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
