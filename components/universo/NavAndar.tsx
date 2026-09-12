import { Arrow } from "@/components/ui/Arrow";
import { SiteLink as Link } from "@/components/ui/SiteLink";
import { TrackedLink } from "@/components/ui/TrackedLink";
import type { Elemento } from "@/lib/universo";
import { reservasUrl } from "@/lib/site";

/**
 * Navegação de andar (Parte 6.0, item 9): anterior, próximo, voltar ao andar e a categoria
 * do quarto com o botão Reservar. É o que mantém o hóspede circulando (Parte 3.3).
 */
export function NavAndar({ elemento: e }: { elemento: Elemento }) {
  return (
    <nav className="nav-andar" aria-label="Navegação do andar">
      <div className="nav-andar-vizinhos">
        {e.anterior ? (
          <Link href={e.anterior.url} className="nav-vizinho nav-vizinho-antes">
            <span className="nav-vizinho-rotulo">Anterior</span>
            <span className="nav-vizinho-nome">{e.anterior.nome}</span>
          </Link>
        ) : (
          <span />
        )}
        {e.proximo ? (
          <Link href={e.proximo.url} className="nav-vizinho nav-vizinho-depois">
            <span className="nav-vizinho-rotulo">Próximo</span>
            <span className="nav-vizinho-nome">{e.proximo.nome}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
      <div className="nav-andar-acoes">
        <Link href={e.andar.url} className="btn btn-secondary">
          Voltar ao {e.andar.nome.toLowerCase()}
        </Link>
        {e.qr?.categoriaUrl && e.qr.categoria ? (
          <>
            <Link href={e.qr.categoriaUrl} className="btn btn-secondary">
              {e.qr.categoria}
            </Link>
            <TrackedLink
              href={reservasUrl}
              event="reservar_click"
              params={{ origem: "universo", elemento: e.item.id }}
              className="btn btn-primary"
            >
              Reservar
              <Arrow />
            </TrackedLink>
          </>
        ) : null}
      </div>
    </nav>
  );
}
