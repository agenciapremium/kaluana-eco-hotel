/**
 * Peças comuns das server actions dos formulários: IP da requisição, limite por IP e envio de
 * e-mail pelo Resend.
 *
 * O SDK do Resend não lança exceção quando a API recusa o envio (chave inválida, domínio não
 * verificado, limite de envio): ele devolve `{ error }`. Sem conferir esse retorno, o
 * visitante via a página de obrigado e o contato se perdia em silêncio. `enviarEmail`
 * transforma a recusa em exceção, e as actions mostram a mensagem de erro para o visitante
 * tentar de novo (docs/decisoes.md, etapa 6).
 *
 * Sem RESEND_API_KEY ou LEAD_TO_EMAIL o envio é simulado em desenvolvimento e na
 * pré-visualização. No deploy de produção isso é erro: o contato não pode sumir.
 */
import { headers } from "next/headers";
import { Resend } from "resend";

export async function ipDaRequisicao(): Promise<string> {
  const h = await headers();
  return (
    (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || h.get("x-real-ip") || "desconhecido"
  );
}

/**
 * Limite por IP guardado em memória da instância: `limite` envios aceitos a cada `janelaMs`.
 * Na Vercel vale por instância, o que basta para o volume esperado (decisão 11).
 */
export function criarLimitador(limite = 5, janelaMs = 10 * 60 * 1000) {
  const envios = new Map<string, number[]>();
  return function passouDoLimite(ip: string): boolean {
    const agora = Date.now();
    const recentes = (envios.get(ip) ?? []).filter((t) => agora - t < janelaMs);
    if (recentes.length >= limite) {
      envios.set(ip, recentes);
      return true;
    }
    recentes.push(agora);
    envios.set(ip, recentes);
    return false;
  };
}

/** Transforma os erros de validação do Zod em uma mensagem por campo. */
export function errosPorCampo(
  issues: { path: PropertyKey[]; message: string }[],
): Record<string, string> {
  const campos: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0] ?? "");
    if (k && !campos[k]) campos[k] = i.message;
  }
  return campos;
}

export type Anexo = { filename: string; content: Buffer };

export async function enviarEmail(mensagem: {
  assunto: string;
  linhas: (string | null | undefined)[];
  /** E-mail de quem escreveu, para a equipe responder direto. */
  responderPara?: string;
  anexos?: Anexo[];
}): Promise<void> {
  const chave = process.env.RESEND_API_KEY;
  const para = process.env.LEAD_TO_EMAIL;
  if (!chave || !para) {
    if (process.env.VERCEL_ENV === "production") {
      throw new Error("formulários: RESEND_API_KEY ou LEAD_TO_EMAIL ausente no deploy de produção");
    }
    return;
  }
  const { error } = await new Resend(chave).emails.send({
    from: process.env.LEAD_FROM_EMAIL || "site@kaluanaecohotel.com.br",
    // LEAD_TO_EMAIL aceita mais de um destino separado por vírgula (hotel e agência).
    to: para
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean),
    subject: mensagem.assunto,
    text: mensagem.linhas.filter(Boolean).join("\n"),
    ...(mensagem.responderPara ? { replyTo: mensagem.responderPara } : {}),
    ...(mensagem.anexos?.length
      ? {
          // Base64 é o formato documentado da API; um Buffer serializado em JSON vira uma
          // lista de números com quase quatro vezes o tamanho do arquivo.
          attachments: mensagem.anexos.map((a) => ({
            filename: a.filename,
            content: a.content.toString("base64"),
          })),
        }
      : {}),
  });
  if (error)
    throw new Error(`formulários: o Resend recusou o envio (${error.name}: ${error.message})`);
}

/** Registra no log da função a falha de envio, sem dados pessoais. */
export function registrarFalha(formulario: string, erro: unknown) {
  console.error(`[${formulario}]`, erro instanceof Error ? erro.message : erro);
}
