"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import {
  criarLimitador,
  enviarEmail,
  errosPorCampo,
  ipDaRequisicao,
  registrarFalha,
  type Anexo,
} from "@/lib/formularios";
import { CURRICULO_MAX_BYTES, curriculoAceito } from "@/lib/curriculo";

/**
 * Formulários de conversão da etapa 5: mensagem do Contato (5.24), pré-reserva (5.23) e
 * currículo (5.26). Os três seguem a mesma proteção dos anteriores: validação com Zod,
 * honeypot e limite por IP, sem CAPTCHA visível.
 *
 * O currículo vai anexado no e-mail e não é gravado em lugar nenhum: o site não guarda
 * arquivo de terceiro (ver docs/decisoes.md).
 */

const base = {
  nome: z.string().trim().min(2, "Escreva seu nome.").max(120),
  email: z.string().trim().email("Confira o e-mail.").max(200),
  telefone: z.string().trim().min(8, "Confira o telefone.").max(40),
};

const assuntos = {
  reserva: "Reserva",
  evento: "Evento",
  restaurante: "Restaurante",
  imprensa: "Imprensa",
  outro: "Outro",
} as const;

const areas = {
  recepcao: "Recepção",
  governanca: "Governança",
  restaurante: "Restaurante",
  cozinha: "Cozinha",
  manutencao: "Manutenção",
  eventos: "Eventos",
  outra: "Outra",
} as const;

const chaves = <T extends Record<string, string>>(o: T) =>
  Object.keys(o) as [keyof T & string, ...(keyof T & string)[]];

const ContatoSchema = z.object({
  ...base,
  assunto: z.enum(chaves(assuntos)),
  mensagem: z.string().trim().min(5, "Escreva sua mensagem.").max(3000),
});

const PreReservaSchema = z.object({
  ...base,
  entrada: z.string().trim().max(40).optional().default(""),
  saida: z.string().trim().max(40).optional().default(""),
  empresa: z.string().trim().max(120).optional().default(""),
});

const CurriculoSchema = z.object({
  ...base,
  area: z.enum(chaves(areas)),
  experiencia: z.string().trim().max(2000).optional().default(""),
});

export type EstadoFormulario = { erro?: string; campos?: Record<string, string> };

/** Um limite por IP compartilhado pelos três formulários desta página de actions. */
const passouDoLimite = criarLimitador();

const FALHA = { erro: "Não conseguimos enviar agora. Tente de novo em instantes." };
const LIMITE = { erro: "Muitos envios em pouco tempo. Tente de novo em alguns minutos." };

/** Mensagem do formulário de Contato (5.24). */
export async function enviarMensagem(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=contato");
  const r = ContatoSchema.safeParse(Object.fromEntries(form));
  if (!r.success) {
    return { erro: "Confira os campos marcados.", campos: errosPorCampo(r.error.issues) };
  }
  if (passouDoLimite(await ipDaRequisicao())) return LIMITE;
  const d = r.data;
  try {
    await enviarEmail({
      assunto: `Contato pelo site: ${assuntos[d.assunto]}, ${d.nome}`,
      responderPara: d.email,
      linhas: [
        `Nome: ${d.nome}`,
        `E-mail: ${d.email}`,
        `Telefone: ${d.telefone}`,
        `Assunto: ${assuntos[d.assunto]}`,
        `Mensagem: ${d.mensagem}`,
      ],
    });
  } catch (e) {
    registrarFalha("contato", e);
    return FALHA;
  }
  redirect("/obrigado?perfil=contato");
}

/** Pré-reserva, enquanto o motor de reservas não existir (5.23). */
export async function enviarPreReserva(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=pre-reserva");
  const r = PreReservaSchema.safeParse(Object.fromEntries(form));
  if (!r.success) {
    return { erro: "Confira os campos marcados.", campos: errosPorCampo(r.error.issues) };
  }
  if (passouDoLimite(await ipDaRequisicao())) return LIMITE;
  const d = r.data;
  try {
    await enviarEmail({
      assunto: `Pré-reserva pelo site: ${d.nome}`,
      responderPara: d.email,
      linhas: [
        `Nome: ${d.nome}`,
        `E-mail: ${d.email}`,
        `Telefone: ${d.telefone}`,
        d.entrada ? `Entrada prevista: ${d.entrada}` : null,
        d.saida ? `Saída prevista: ${d.saida}` : null,
        d.empresa ? `Empresa: ${d.empresa}` : null,
      ],
    });
  } catch (e) {
    registrarFalha("pre-reserva", e);
    return FALHA;
  }
  redirect("/obrigado?perfil=pre-reserva");
}

/** Currículo de Trabalhe conosco (5.26). */
export async function enviarCurriculo(
  _estado: EstadoFormulario,
  form: FormData,
): Promise<EstadoFormulario> {
  if (String(form.get("website") ?? "")) redirect("/obrigado?perfil=curriculo");
  const r = CurriculoSchema.safeParse(Object.fromEntries(form));
  if (!r.success) {
    return { erro: "Confira os campos marcados.", campos: errosPorCampo(r.error.issues) };
  }

  const arquivo = form.get("curriculo");
  let anexo: Anexo | undefined;
  if (arquivo instanceof File && arquivo.size > 0) {
    if (arquivo.size > CURRICULO_MAX_BYTES) {
      return {
        erro: "O arquivo passa de 4 MB.",
        campos: { curriculo: "Envie um arquivo de até 4 MB." },
      };
    }
    if (!curriculoAceito(arquivo)) {
      return {
        erro: "Envie o currículo em PDF ou DOCX.",
        campos: { curriculo: "Formato não aceito." },
      };
    }
    anexo = {
      filename: arquivo.name.replace(/[^\w.\- ]+/g, "_").slice(0, 120),
      content: Buffer.from(await arquivo.arrayBuffer()),
    };
  }

  if (passouDoLimite(await ipDaRequisicao())) return LIMITE;
  const d = r.data;
  try {
    await enviarEmail({
      assunto: `Currículo pelo site: ${areas[d.area]}, ${d.nome}`,
      responderPara: d.email,
      linhas: [
        `Nome: ${d.nome}`,
        `E-mail: ${d.email}`,
        `Telefone: ${d.telefone}`,
        `Área: ${areas[d.area]}`,
        d.experiencia ? `Experiência: ${d.experiencia}` : null,
        anexo ? `Currículo em anexo: ${anexo.filename}` : "Sem arquivo anexado.",
      ],
      anexos: anexo ? [anexo] : undefined,
    });
  } catch (e) {
    registrarFalha("curriculo", e);
    return FALHA;
  }
  redirect("/obrigado?perfil=curriculo");
}
