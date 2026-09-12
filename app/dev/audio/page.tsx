import { notFound } from "next/navigation";
import { AmbientAudio } from "@/components/audio/AmbientAudio";
import { floorOrder, floors } from "@/lib/tokens";

/** Página de teste do som ambiente. Só existe em desenvolvimento. */
export default function Page() {
  if (process.env.NODE_ENV === "production") notFound();
  return (
    <section className="section-y">
      <div className="container-site">
        <h1 className="text-title">Teste do som ambiente</h1>
        <p className="mt-4 text-lg">Um loop de exemplo por andar. Nada toca sem clique.</p>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {floorOrder.map((key) => (
            <li key={key} className="flex items-center justify-between gap-4 rounded-xl bg-branco p-5">
              <span className="font-display text-2xl">{floors[key].nome}</span>
              <AmbientAudio andar={key} elemento={`teste-${key}`} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
