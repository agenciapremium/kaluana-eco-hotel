/**
 * Reprodutor de som ambiente com Web Audio API.
 *
 * Dois buffers alternados em crossfade fazem o loop sem emenda: antes de um terminar,
 * o próximo começa com ganho subindo enquanto o atual desce. Fade-in de 1,5 s ao ligar,
 * fade-out de 0,8 s ao desligar. Nunca toca sem uma chamada explícita de start().
 */
import { audio as audioTokens } from "@/lib/tokens";

type Playing = { source: AudioBufferSourceNode; gain: GainNode; endsAt: number };

const rodando = (ctx: AudioContext) => ctx.state === "running";

export class AmbientPlayer {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private buffer: AudioBuffer | null = null;
  private timer: number | null = null;
  private playing: Playing[] = [];
  private stopped = true;

  constructor(
    private readonly url: string,
    private readonly volume: number,
  ) {}

  get isPlaying() {
    return !this.stopped;
  }

  /**
   * Diz se o navegador deixa tocar agora, sem gesto do visitante. Sem essa permissão, o Chrome
   * deixa o resume() pendente até o primeiro gesto; o limite de tempo evita que o botão fique
   * preso em "Carregando o som".
   */
  async podeTocar(limiteMs = 300) {
    const ctx = this.ctx ?? (this.ctx = new AudioContext());
    if (ctx.state === "running") return true;
    await Promise.race([ctx.resume(), new Promise((r) => window.setTimeout(r, limiteMs))]);
    // Lido por função: depois do return acima, o TypeScript acharia que o estado não muda.
    return rodando(ctx);
  }

  /** Começa a tocar a partir de uma fração do loop (0 a 1). Resolve quando o áudio está agendado. */
  async start(offsetFraction = 0) {
    const ctx = this.ctx ?? (this.ctx = new AudioContext());
    if (ctx.state === "suspended") await ctx.resume();
    if (ctx.state !== "running") throw new Error("audio bloqueado pelo navegador");
    if (!this.master) {
      this.master = ctx.createGain();
      this.master.gain.value = 0;
      this.master.connect(ctx.destination);
    }
    if (!this.buffer) {
      const res = await fetch(this.url);
      if (!res.ok) throw new Error(`áudio não encontrado: ${this.url}`);
      this.buffer = await ctx.decodeAudioData(await res.arrayBuffer());
    }
    this.clear();
    this.stopped = false;
    const now = ctx.currentTime;
    const g = this.master.gain;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(this.volume, now + audioTokens.fadeInMs / 1000);
    const offset = Math.min(offsetFraction, 0.9) * this.buffer.duration;
    this.schedule(now, offset);
  }

  private schedule(at: number, offset: number) {
    const ctx = this.ctx;
    const buffer = this.buffer;
    const master = this.master;
    if (!ctx || !buffer || !master) return;
    const cf = audioTokens.crossfadeMs / 1000;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    source.connect(gain).connect(master);
    const endsAt = at + (buffer.duration - offset);
    if (offset === 0 && this.playing.length) {
      gain.gain.setValueAtTime(0, at);
      gain.gain.linearRampToValueAtTime(1, at + cf);
    } else {
      gain.gain.setValueAtTime(1, at);
    }
    gain.gain.setValueAtTime(1, Math.max(at, endsAt - cf));
    gain.gain.linearRampToValueAtTime(0, endsAt);
    source.start(at, offset);
    source.stop(endsAt + 0.05);
    const entry: Playing = { source, gain, endsAt };
    this.playing.push(entry);
    source.addEventListener("ended", () => {
      this.playing = this.playing.filter((p) => p !== entry);
      try {
        source.disconnect();
        gain.disconnect();
      } catch {
        // já desconectado
      }
    });
    const nextAt = endsAt - cf;
    const delayMs = Math.max(0, (nextAt - ctx.currentTime) * 1000 - 250);
    this.timer = window.setTimeout(() => {
      this.timer = null;
      if (!this.stopped) this.schedule(nextAt, 0);
    }, delayMs);
  }

  /** Desliga com fade-out e suspende o contexto. */
  async stop() {
    const ctx = this.ctx;
    const master = this.master;
    this.stopped = true;
    if (this.timer !== null) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
    if (!ctx || !master) return;
    const now = ctx.currentTime;
    const fade = audioTokens.fadeOutMs / 1000;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(0, now + fade);
    await new Promise((r) => window.setTimeout(r, audioTokens.fadeOutMs + 20));
    if (!this.stopped) return; // religado durante o fade
    this.clear();
    if (ctx.state === "running") await ctx.suspend();
  }

  private clear() {
    for (const p of this.playing) {
      try {
        p.source.stop();
      } catch {
        // já parado
      }
    }
    this.playing = [];
  }

  destroy() {
    this.stopped = true;
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.clear();
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}

/** Formato suportado: Opus em WebM, com fallback AAC. */
export function pickAudioExt(): "webm" | "m4a" {
  if (typeof document === "undefined") return "m4a";
  const a = document.createElement("audio");
  return a.canPlayType('audio/webm; codecs="opus"') ? "webm" : "m4a";
}
