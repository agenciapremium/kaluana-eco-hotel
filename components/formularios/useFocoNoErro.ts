import { useEffect, type RefObject } from "react";

/**
 * Depois de um envio recusado pelo servidor, leva o foco ao primeiro campo com erro, ou à
 * mensagem geral quando o erro não é de um campo (limite de envios, falha no e-mail). Sem
 * isso, quem usa teclado ou leitor de tela ficava com o foco perdido no documento, porque o
 * botão de envio é desabilitado durante o envio (WCAG 2.4.3 e 3.3.1).
 */
export function useFocoNoErro(
  estado: { erro?: string } | null | undefined,
  form: RefObject<HTMLFormElement | null>,
) {
  useEffect(() => {
    if (!estado?.erro) return;
    const alvo =
      form.current?.querySelector<HTMLElement>('[aria-invalid="true"]') ??
      form.current?.querySelector<HTMLElement>("[data-erro-geral]");
    alvo?.focus();
  }, [estado, form]);
}
