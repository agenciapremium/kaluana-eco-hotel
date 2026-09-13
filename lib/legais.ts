/**
 * Minutas dos textos legais (5.27 e 5.28).
 *
 * A Parte 8, item 19, prevê "textos jurídicos de privacidade e termos, ou aprovação de uma
 * minuta da Premium". Estas são as minutas, escritas a partir dos fatos que o projeto já
 * tem: controlador, CNPJ, os formulários do site, as ferramentas de medição contratadas e o
 * motor de reservas. Não substituem revisão jurídica.
 *
 * TODO(copy): texto a validar com o jurídico do cliente antes da inauguração.
 */
import { eventosAutorizado, site } from "./site";

export type BlocoLegal = { titulo: string; paragrafos: string[]; itens?: string[] };

export const atualizadoEm = "2026-09-12";

export const politicaDePrivacidade: BlocoLegal[] = [
  {
    titulo: "Quem trata os seus dados",
    paragrafos: [
      `O controlador dos dados é ${site.legalName}, inscrita no CNPJ ${site.cnpj}, com endereço na ${site.address.street}, ${site.address.locality}, ${site.address.region}.`,
      "Esta política explica quais dados o site coleta, para que servem, com quem são compartilhados e quais são os seus direitos, conforme a Lei Geral de Proteção de Dados, a Lei 13.709 de 2018.",
    ],
  },
  {
    titulo: "Quais dados coletamos",
    paragrafos: [
      "O site coleta apenas o que você escreve nos formulários e o que a medição registra.",
    ],
    itens: [
      "Formulário de pré-reserva e de aviso de abertura: nome, e-mail, telefone, datas previstas e empresa, quando informada.",
      "Formulário de contato: nome, e-mail, telefone, assunto e mensagem.",
      ...(eventosAutorizado
        ? [
            "Pedido de proposta de evento: nome, empresa, e-mail, telefone, tipo de evento, data, número de pessoas e necessidades de hospedagem e alimentação.",
          ]
        : []),
      "Envio de currículo: nome, e-mail, telefone, área de interesse, experiência e o arquivo que você anexar.",
      "Medição de audiência: páginas visitadas, origem da visita, tipo de dispositivo e identificadores de cookies, apenas com o seu consentimento.",
    ],
  },
  {
    titulo: "Para que usamos",
    paragrafos: [
      "Os dados dos formulários servem para responder você, preparar a reserva ou a proposta e, no caso do currículo, avaliar a candidatura. A base legal é a execução de procedimentos preliminares ao contrato e o legítimo interesse no atendimento.",
      "Os dados de medição servem para entender como as pessoas chegam ao site e o que procuram nele. A base legal é o seu consentimento, dado no banner que aparece na primeira visita.",
    ],
  },
  {
    titulo: "Cookies e medição",
    paragrafos: [
      "Nenhum cookie de medição ou de publicidade é gravado antes do seu consentimento. Enquanto você não escolher, o site funciona normalmente e nada é enviado às ferramentas.",
      "Com o consentimento, o site usa o Google Analytics 4 e o Google Tag Manager para medir audiência, e o Pixel e a API de Conversões da Meta para medir o resultado dos anúncios. Você pode mudar a escolha a qualquer momento, limpando os dados do site no navegador.",
    ],
  },
  {
    titulo: "Com quem compartilhamos",
    paragrafos: [
      "Compartilhamos dados apenas com quem precisa deles para prestar o serviço: o provedor de hospedagem do site, o serviço de envio de e-mail que entrega as mensagens dos formulários à equipe, as ferramentas de medição citadas acima e, quando existir, o motor de reservas contratado, que trata os dados da sua reserva sob a política dele.",
      "Não vendemos dados pessoais e não os cedemos para uso de terceiros fora dessas finalidades.",
    ],
  },
  {
    titulo: "Por quanto tempo guardamos",
    paragrafos: [
      "As mensagens dos formulários ficam no e-mail da equipe pelo tempo necessário ao atendimento e ao cumprimento de obrigações legais. Currículos ficam guardados enquanto a operação estiver sendo montada e podem ser apagados a pedido. O arquivo do currículo não é armazenado no site: ele segue anexado no e-mail para a equipe.",
    ],
  },
  {
    titulo: "Seus direitos",
    paragrafos: [
      "Você pode pedir confirmação de tratamento, acesso, correção, anonimização, portabilidade ou eliminação dos seus dados, além de revogar o consentimento da medição. O pedido é feito pelo formulário de contato do site e respondido nos prazos da lei.",
    ],
  },
  {
    titulo: "Segurança e mudanças",
    paragrafos: [
      "O site usa conexão cifrada e limita o acesso aos dados a quem precisa deles para atender você.",
      "Quando esta política mudar, a data de atualização no topo muda junto.",
    ],
  },
];

export const termosDeUso: BlocoLegal[] = [
  {
    titulo: "Quem publica este site",
    paragrafos: [
      `Este site é publicado por ${site.legalName}, CNPJ ${site.cnpj}, em ${site.address.locality}, ${site.address.region}. Ao navegar nele, você concorda com estes termos.`,
    ],
  },
  {
    titulo: "O que o site oferece",
    paragrafos: [
      // No corpo, "o Kaluanã"; os espaços de evento só com a autorização do cliente (veto 3).
      `O site apresenta o Kaluanã, as categorias de acomodação, o restaurante, ${eventosAutorizado ? "os espaços de evento, " : ""}o conteúdo do Universo Kaluanã e os canais de contato. A inauguração está prevista para ${site.openingLabel}.`,
      "Enquanto o motor de reservas não estiver no ar, o site capta interesse de reserva por formulário. O envio do formulário não gera reserva nem garante disponibilidade ou tarifa.",
    ],
  },
  {
    titulo: "Reservas e tarifas",
    paragrafos: [
      "Quando o motor de reservas entrar no ar, a reserva será feita por ele e valerão as regras de tarifa, pagamento e cancelamento exibidas no momento da compra.",
      "Preços, disponibilidade e condições podem mudar sem aviso até a confirmação da reserva.",
    ],
  },
  {
    titulo: "Conteúdo e uso",
    paragrafos: [
      "Os textos, as fotos, os vídeos, os desenhos e a marca deste site pertencem ao hotel ou a quem os licenciou. Você pode citar trechos com atribuição a Kaluanã Eco Hotel, Ji-Paraná, e link para a página de origem.",
      "As gravações de sons de animais usadas no Universo Kaluanã, como cantos de ave e o esturro da onça, vêm de acervos com licença Creative Commons e trazem o crédito do autor na própria página.",
      "Não é permitido copiar o conteúdo em escala, reaproveitá-lo como se fosse próprio ou usar a marca sem autorização.",
    ],
  },
  {
    titulo: "Informações sujeitas a confirmação",
    paragrafos: [
      "O hotel está em construção. Metragens, horários, capacidades e políticas aparecem no site apenas quando confirmados. Onde ainda não há confirmação, a informação não é publicada, e nenhuma estimativa é apresentada como se fosse definitiva.",
    ],
  },
  {
    titulo: "Links para outros sites",
    paragrafos: [
      "O site pode levar a serviços de terceiros, como mapa, motor de reservas e redes sociais. O uso desses serviços segue os termos e a privacidade de cada um deles.",
    ],
  },
  {
    titulo: "Foro e mudanças",
    paragrafos: [
      `Estes termos seguem a lei brasileira, com foro na comarca de ${site.address.locality}, ${site.address.region}.`,
      "Quando os termos mudarem, a data de atualização no topo muda junto.",
    ],
  },
];
