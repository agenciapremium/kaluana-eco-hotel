"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/analytics";
import { audioBanks, audioUrl } from "@/lib/audio/banks";
import { AmbientPlayer, pickAudioExt } from "@/lib/audio/ambient-player";
import type { FloorKey } from "@/lib/content-schema";
import { hashString } from "@/lib/copy";
import { audio as audioTokens } from "@/lib/tokens";

const SESSION_KEY = "kaluana:audio";

type Props = {
  andar: FloorKey;
  elemento: string;
  /** Loop específico da página (por exemplo, o canto da ave). Entra no banco do andar. */
  extraLoops?: string[];
  className?: string;
  /** Na barra de hóspede o botão ganha destaque. */
  variant?: "discreto" | "destaque";
};

type State = "off" | "loading" | "on";

/**
 * Botão "Ouvir o ambiente" (CLAUDE.md, seção 8). Nunca toca sem clique. O loop é
 * escolhido de forma determinística pelo elemento, começa em um ponto aleatório e com
 * leve variação de volume. Pausa quando a aba perde o foco. Estado lembrado na sessão.
 */
export function AmbientAudio({ andar, elemento, extraLoops = [], className, variant = "discreto" }: Props) {
  const [state, setState] = useState<State>("off");
  const playerRef = useRef<AmbientPlayer | null>(null);
  const stateRef = useRef<State>("off");
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const loop = useMemo(() => {
    const bank = [...audioBanks[andar], ...extraLoops];
    return bank[hashString(elemento) % bank.length];
  }, [andar, elemento, extraLoops]);

  const getPlayer = () => {
    if (!playerRef.current) {
      const jitter = 1 + (Math.random() * 2 - 1) * audioTokens.volumeJitter;
      playerRef.current = new AmbientPlayer(audioUrl(andar, loop, pickAudioExt()), audioTokens.volume * jitter);
    }
    return playerRef.current;
  };

  const play = async (fromUser: boolean) => {
    setState("loading");
    try {
      await getPlayer().start(Math.random());
      setState("on");
      try {
        window.sessionStorage.setItem(SESSION_KEY, "on");
      } catch {
        // sem armazenamento de sessão
      }
      if (fromUser) track("audio_play", { andar, elemento });
    } catch {
      setState("off");
    }
  };

  const stop = async (remember: boolean) => {
    setState("off");
    if (remember) {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "off");
      } catch {
        // sem armazenamento de sessão
      }
    }
    await playerRef.current?.stop();
  };

  useEffect(() => {
    // Retoma se o visitante já tinha ligado nesta sessão. O navegador pode bloquear
    // sem gesto novo; nesse caso o botão volta a "Ouvir o ambiente".
    let wanted = false;
    try {
      wanted = window.sessionStorage.getItem(SESSION_KEY) === "on";
    } catch {
      wanted = false;
    }
    // fora do corpo do efeito, para não encadear renderizações
    const retomar = wanted ? window.setTimeout(() => void play(false), 0) : null;

    const onVisibility = () => {
      if (document.hidden) {
        if (stateRef.current === "on") void stop(false);
      } else {
        let again = false;
        try {
          again = window.sessionStorage.getItem(SESSION_KEY) === "on";
        } catch {
          again = false;
        }
        if (again && stateRef.current === "off") window.setTimeout(() => void play(false), 0);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      if (retomar !== null) window.clearTimeout(retomar);
      document.removeEventListener("visibilitychange", onVisibility);
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- executa uma vez por montagem
  }, []);

  const on = state === "on";
  const label = state === "loading" ? "Carregando o som" : on ? "Silenciar" : "Ouvir o ambiente";

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
      aria-pressed={on}
      disabled={state === "loading"}
      onClick={() => (on ? void stop(true) : void play(true))}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
        <path d="M4 12h2M8 8v8M12 5v14M16 8v8M20 11v2" />
      </svg>
      {label}
    </button>
  );
}
