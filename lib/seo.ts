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
const descricoes: Record<string, string> = {
  reservas:
    "Reserve sua estadia no Kaluanã Eco Hotel, em Ji-Paraná. Tarifas, disponibilidade, conta corporativa e bloqueio de quartos para grupos e eventos.",
  "politica-de-privacidade":
    "Como o Kaluanã Eco Hotel coleta, usa e protege os dados pessoais de hóspedes e visitantes do site, conforme a LGPD: cookies, formulários e direitos.",
  "termos-de-uso":
    "Termos de uso do site e das reservas online do Kaluanã Eco Hotel, em Ji-Paraná: conteúdo, marca, tarifas e informações sujeitas a confirmação.",
};

/** Descrição da página, com o ajuste de tamanho quando houver. */
export function descricaoDe(id: string, original: string): string {
  return descricoes[id] ?? original;
}
