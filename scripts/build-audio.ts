/**
 * Loops de exemplo do som ambiente, um por andar, em public/audio/<andar>/.
 *
 * Etapa 1: placeholders sintetizados por ffmpeg (ruído filtrado com respiração lenta),
 * sem licença de terceiros, só para exercitar o AmbientAudio. A etapa 3 substitui pelos
 * bancos reais (gravações da Premium ou CC0), registrados em docs/registro-audio.md.
 *
 * Formatos: Opus (WebM) com fallback AAC (M4A), mono, 48 kbps, 30 s.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { floorOrder } from "../lib/tokens";

const root = process.cwd();
const seconds = 30;

// Cor do ruído e frequência da "respiração" por andar, só para diferenciar os placeholders.
const perfil: Record<string, { color: string; lowpass: number; lfo: number }> = {
  rios: { color: "brown", lowpass: 900, lfo: 0.1 },
  peixes: { color: "brown", lowpass: 500, lfo: 0.12 },
  arvores: { color: "pink", lowpass: 2500, lfo: 0.11 },
  aves: { color: "pink", lowpass: 4000, lfo: 0.14 },
  guardioes: { color: "brown", lowpass: 300, lfo: 0.1 },
};

for (const andar of floorOrder) {
  const dir = resolve(root, "public/audio", andar);
  mkdirSync(dir, { recursive: true });
  const p = perfil[andar];
  const filter = `anoisesrc=color=${p.color}:seed=${andar.length * 7}:amplitude=0.4,lowpass=f=${p.lowpass},tremolo=f=${p.lfo}:d=0.5,afade=t=in:d=2,afade=t=out:st=${seconds - 2}:d=2,volume=0.5`;
  const webm = resolve(dir, "exemplo-1.webm");
  const m4a = resolve(dir, "exemplo-1.m4a");
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-t", String(seconds), "-i", filter, "-ac", "1", "-c:a", "libopus", "-b:a", "48k", webm], { stdio: "inherit" });
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", "-f", "lavfi", "-t", String(seconds), "-i", filter, "-ac", "1", "-c:a", "aac", "-b:a", "48k", "-movflags", "+faststart", m4a], { stdio: "inherit" });
  process.stdout.write(`audio: ${andar}/exemplo-1 webm ${Math.round(statSync(webm).size / 1024)} KB, m4a ${Math.round(statSync(m4a).size / 1024)} KB\n`);
}
