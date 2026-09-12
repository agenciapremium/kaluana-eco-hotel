/**
 * Ajustes de SEO sobre a copy do documento mestre.
 *
 * A Parte 4.2, item 5, manda descrições entre 120 e 160 caracteres. Três descrições escritas
 * no próprio documento mestre ficam abaixo disso: Reservas com 115, Política de privacidade
 * com 115 e Termos de uso com 79. As versões abaixo estendem cada uma com informação que já
 * está na página, sem mudar o sentido nem o tom.
 *
 * TODO(copy): três descrições estendidas pela Premium, a revisar pelo responsável.
 */
import { phase } from "./site";

const descricoes: Record<string, string> = {
  // Sem "e eventos": o bloqueio de quartos para eventos só é divulgado com a autorização (veto 3).
  reservas:
    "Reserve sua estadia no Kaluanã Eco Hotel, em Ji-Paraná. Tarifas, disponibilidade, conta corporativa e bloqueio de quartos para grupos.",
  "politica-de-privacidade":
    "Como o Kaluanã Eco Hotel coleta, usa e protege os dados pessoais de hóspedes e visitantes do site, conforme a LGPD: cookies, formulários e direitos.",
  "termos-de-uso":
    "Termos de uso do site e das reservas online do Kaluanã Eco Hotel, em Ji-Paraná: conteúdo, marca, tarifas e informações sujeitas a confirmação.",
};

/** Descrição da página, com o ajuste de tamanho quando houver. */
export function descricaoDe(id: string, original: string): string {
  return descricoes[id] ?? original;
}

/**
 * Páginas que a Parte 3.5 põe na fase 1 (inauguração): O Kaluanã, Restaurante, Ji-Paraná,
 * Histórias, Reservas, Contato, Perguntas frequentes e Trabalhe conosco. Na pré-inauguração
 * elas existem (pré-visualização, atalho da Home para Histórias), mas ficam fora do índice e
 * do sitemap, como Acomodações (decisão 27). A fase 0 indexa a Home, o Universo e as duas
 * páginas legais, que o formulário de interesse e o banner de consentimento citam.
 */
export const foraDoIndiceNaPre = phase === "pre" ? { robots: { index: false, follow: false } } : {};
