/**
 * Limites do currículo, compartilhados pelo formulário (checagem imediata no navegador) e pela
 * server action (checagem de verdade).
 *
 * 4 MB, e não 5: a Vercel recusa corpo de requisição acima de 4,5 MB antes de a função rodar,
 * e o arquivo viaja junto com os outros campos do formulário (docs/decisoes.md, etapa 6).
 * Módulo sem dependências, porque é importado por componente cliente.
 */
export const CURRICULO_MAX_BYTES = 4 * 1024 * 1024;

export const CURRICULO_TIPOS = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;

/** PDF, DOC ou DOCX. Alguns sistemas não informam o tipo do DOCX; nesse caso vale a extensão. */
export function curriculoAceito(arquivo: { name: string; type: string }): boolean {
  if ((CURRICULO_TIPOS as readonly string[]).includes(arquivo.type)) return true;
  const semTipo = arquivo.type === "" || arquivo.type === "application/octet-stream";
  return semTipo && /\.(pdf|docx?)$/i.test(arquivo.name);
}
