/**
 * Mensagem de erro de um campo. Fica ligada ao campo por `aria-describedby` (o campo aponta
 * para o `id`). O anúncio para leitores de tela vem da mensagem geral do formulário, com
 * role="alert", e do foco que vai para o primeiro campo com erro: um alerta por campo fazia
 * vários anúncios disputarem ao mesmo tempo.
 */
export function CampoErro({ id, mensagem }: { id: string; mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p id={id} className="field-error">
      {mensagem}
    </p>
  );
}
