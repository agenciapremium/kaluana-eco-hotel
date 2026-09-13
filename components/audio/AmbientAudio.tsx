"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { audioBanks, audioUrl } from "@/lib/audio/banks";
import { AmbientPlayer, pickAudioExt } from "@/lib/audio/ambient-player";
import type { FloorKey } from "@/lib/content-schema";
import { escolhaEstavel } from "@/lib/copy";
import { audio as audioTokens } from "@/lib/tokens";

/** "off" quando o visitante silenciou nesta sessão: as páginas seguintes não começam tocando. */
const SESSION_KEY = "kaluana:audio";

/** Avisa os outros botões da página que um som começou: um som por vez. */
const EVENTO_INICIO = "kaluana:audio-inicio";

/** Gestos que o navegador aceita como permissão para tocar som. Rolar a página não conta. */
const GESTOS = ["pointerdown", "keydown", "touchend"] as const;

type Props = {
  andar: FloorKey;
  elemento: string;
  /**
   * Som da própria espécie (o canto da ave). Quando existe, é ele que toca, e não um loop
   * sorteado do banco do andar.
   */
  somDaEspecie?: string;
  className?: string;
  /** Na barra de hóspede o botão ganha destaque. */
  variant?: "discreto" | "destaque";
};

type State = "off" | "loading" | "on";

type Candidato = { destaque: boolean; iniciar: () => void };

/**
 * Início automático: toca um botão por página, o da barra de hóspede quando existe. Os botões
 * se inscrevem na montagem, e a escolha sai depois que todos montaram.
 */
const candidatos = new Map<string, Candidato>();
let escolhaAgendada: number | null = null;
function agendarInicioAutomatico() {
  if (escolhaAgendada !== null) return;
  escolhaAgendada = window.setTimeout(() => {
    escolhaAgendada = null;
    const lista = [...candidatos.values()];
    (lista.find((c) => c.destaque) ?? lista[0])?.iniciar();
  }, 0);
}

function lembrar(valor: "on" | "off") {
  try {
    window.sessionStorage.setItem(SESSION_KEY, valor);
  } catch {
    // sem armazenamento de sessão
  }
}

function lido(): string | null {
  try {
    return window.sessionStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

/**
 * Som ambiente (CLAUDE.md, seção 8). Por decisão do responsável da Premium em 13/09/2026, a
 * página do Universo começa tocando e o botão serve para silenciar; o silêncio fica lembrado na
 * sessão. Os navegadores só liberam som depois de um gesto do visitante na página: numa visita
 * que chega de fora, como a leitura do QR, o som começa no primeiro toque, clique ou tecla; ao
 * navegar dentro do site, a página seguinte já abre tocando. O arquivo de áudio só é baixado
 * quando o som pode tocar. O loop é escolhido de forma determinística pelo elemento, começa em
 * um ponto aleatório e com leve variação de volume. Pausa quando a aba perde o foco.
 *
 * Acessibilidade (etapa 6): o rótulo visível diz a ação ("Ouvir o ambiente" ou "Silenciar"),
 * então o botão não usa aria-pressed, que somado ao rótulo que muda lia "Silenciar,
 * pressionado". Durante o carregamento o botão fica aria-disabled, e não disabled, para o
 * foco não se perder. A página aberta pelo QR tem dois botões (hero e barra de hóspede): quando
 * um começa, o outro para.
 */
export function AmbientAudio({
  andar,
  elemento,
  somDaEspecie,
  className,
  variant = "discreto",
}: Props) {
  const [state, setState] = useState<State>("off");
  const playerRef = useRef<AmbientPlayer | null>(null);
  const stateRef = useRef<State>("off");
  const id = useId();
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loop = useMemo(() => {
    if (somDaEspecie) return somDaEspecie;
    const bank = audioBanks[andar];
    return bank[escolhaEstavel(elemento, bank.length)];
  }, [andar, elemento, somDaEspecie]);

  const getPlayer = () => {
    if (!playerRef.current) {
      const jitter = 1 + (Math.random() * 2 - 1) * audioTokens.volumeJitter;
      playerRef.current = new AmbientPlayer(
        audioUrl(andar, loop, pickAudioExt()),
        audioTokens.volume * jitter,
      );
    }
    return playerRef.current;
  };

  const play = async (fromUser: boolean) => {
    setState("loading");
    try {
      await getPlayer().start(Math.random());
      setState("on");
      window.dispatchEvent(new CustomEvent(EVENTO_INICIO, { detail: id }));
      lembrar("on");
      if (fromUser) track("audio_play", { andar, elemento });
      return true;
    } catch {
      setState("off");
      return false;
    }
  };

  const stop = async (remember: boolean) => {
    setState("off");
    if (remember) lembrar("off");
    await playerRef.current?.stop();
  };

  useEffect(() => {
    let esperandoGesto = false;
    let esperandoAba = false;

    const soltarGestos = () => {
      if (!esperandoGesto) return;
      esperandoGesto = false;
      GESTOS.forEach((g) => window.removeEventListener(g, aoGesto, true));
    };
    // Sem permissão do navegador, o som começa no primeiro gesto na página. Um clique no próprio
    // botão fica com o botão, para não ligar e desligar no mesmo toque.
    const aoGesto = (e: Event) => {
      soltarGestos();
      const alvo = e.target instanceof Element ? e.target : null;
      if (alvo?.closest(".ambient-button")) return;
      if (stateRef.current === "off" && lido() !== "off") void play(false);
    };
    const esperarGesto = () => {
      if (esperandoGesto) return;
      esperandoGesto = true;
      GESTOS.forEach((g) => window.addEventListener(g, aoGesto, { capture: true, passive: true }));
    };

    const iniciar = () => {
      if (lido() === "off" || stateRef.current !== "off") return;
      if (document.hidden) {
        esperandoAba = true;
        return;
      }
      const ativacao = (navigator as { userActivation?: { hasBeenActive: boolean } })
        .userActivation;
      if (ativacao && !ativacao.hasBeenActive) {
        esperarGesto();
        return;
      }
      void getPlayer()
        .podeTocar()
        .then((pode) => {
          if (!pode) {
            esperarGesto();
            return;
          }
          void play(false).then((tocou) => {
            if (!tocou) esperarGesto();
          });
        });
    };

    if (lido() !== "off") {
      candidatos.set(id, { destaque: variant === "destaque", iniciar });
      agendarInicioAutomatico();
    }

    const onVisibility = () => {
      if (document.hidden) {
        if (stateRef.current === "on") void stop(false);
      } else if (esperandoAba) {
        esperandoAba = false;
        iniciar();
      } else if (lido() === "on" && stateRef.current === "off") {
        window.setTimeout(() => void play(false), 0);
      }
    };
    const onOutroInicio = (e: Event) => {
      if ((e as CustomEvent<string>).detail !== id && stateRef.current === "on") void stop(false);
    };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener(EVENTO_INICIO, onOutroInicio);
    return () => {
      candidatos.delete(id);
      soltarGestos();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener(EVENTO_INICIO, onOutroInicio);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- executa uma vez por montagem
  }, []);

  const on = state === "on";
  const carregando = state === "loading";
  const label = carregando ? "Carregando o som" : on ? "Silenciar" : "Ouvir o ambiente";

  return (
    <button
      type="button"
      className={[
        "ambient-button",
        variant === "destaque" ? "btn btn-primary" : "btn btn-secondary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-disabled={carregando || undefined}
      onClick={() => {
        if (carregando) return;
        void (on ? stop(true) : play(true));
      }}
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 11v2" />
      </svg>
      {label}
    </button>
  );
}
