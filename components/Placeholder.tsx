import { isProduction } from "@/lib/site";

/**
 * Campo ⟨entre colchetes⟩ que depende do cliente. Visível em desenvolvimento,
 * oculto em produção (veto 5 do CLAUDE.md).
 */
export function Placeholder({ label }: { label: string }) {
  if (isProduction) return null;
  return (
    <span className="placeholder-dev" title="Campo pendente com o cliente">
      ⟨{label}⟩
    </span>
  );
}
