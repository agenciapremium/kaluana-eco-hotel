import type { Metadata } from "next";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { Suspense } from "react";
import { Arrow } from "@/components/ui/Arrow";
import { StrokeSymbol } from "@/components/motion/StrokeSymbol";
import { LeadTracker } from "./LeadTracker";

/**
 * Página de formulário enviado. Fora do índice e bloqueada no robots.txt (Parte 4.2).
 * TODO(copy): texto não consta no documento mestre; escrito no mesmo padrão, a revisar.
 */
export const metadata: Metadata = {
  title: "Recebemos seu contato",
  description: "Avisamos você primeiro quando as reservas do Kaluanã Eco Hotel abrirem.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <section className="section-y">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <StrokeSymbol className="text-cafe mx-auto h-20 w-20" title="Símbolo do Kaluanã" />
          <h1 className="text-title mt-8">Recebemos seu contato.</h1>
          <p className="mt-4 text-xl">Avisamos você primeiro quando as reservas abrirem.</p>
          <Link href="/" className="btn btn-primary mt-8">
            Voltar ao início
            <Arrow />
          </Link>
        </div>
      </div>
      <Suspense fallback={null}>
        <LeadTracker />
      </Suspense>
    </section>
  );
}
