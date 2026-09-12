/** Mensagem de erro de um campo, com o papel de alerta para leitores de tela. */
export function CampoErro({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p className="field-error" role="alert">
      {mensagem}
    </p>
  );
}
