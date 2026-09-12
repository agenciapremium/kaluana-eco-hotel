/**
 * Bancos de som ambiente por andar, em public/audio/<andar>/ (CLAUDE.md, seção 8).
 *
 * Cada andar tem de quatro a seis loops de 45 s. A escolha do loop é determinística por
 * elemento (lib/audio/banks.ts mais o hash do slug), com deslocamento inicial aleatório,
 * de forma que dois quartos do mesmo andar nunca soem iguais e o mesmo quarto soe sempre
 * parecido.
 *
 * Origem: os loops continuam sintetizados por ffmpeg (ruído filtrado, com movimento lento),
 * sem licença de terceiros. A ordem de preferência da seção 8 começa por gravações de campo
 * da Premium em Rondônia, que ainda não existem. Quando existirem, basta trocar os arquivos
 * e a linha correspondente em docs/registro-audio.md. Os cantos de ave, esses sim reais,
 * vêm do xeno-canto pelo scripts/build-cantos.ts.
 *
 * Formatos: Opus (WebM) com fallback AAC (M4A), mono, 48 kbps. Use: npm run build:audio
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { floorOrder, type FloorKey } from "../lib/tokens";

const root = process.cwd();
const segundos = 45;

type Loop = {
  slug: string;
  /** Cena descrita na seção 8 do CLAUDE.md. */
  cena: string;
  /** Cadeia de filtros do ffmpeg que sintetiza a cena. */
  filtro: string;
};

/** O filtro tremolo do ffmpeg não aceita frequência abaixo de 0,1 Hz. */
const hz = (v: number) => Math.max(0.1, v);

/** Ruído de base: cor, corte de graves/agudos e um movimento lento de amplitude. */
const base = (color: "brown" | "pink" | "white", lowpass: number, lfo: number, amp = 0.4) =>
  `anoisesrc=color=${color}:amplitude=${amp}:seed=SEED,lowpass=f=${lowpass},tremolo=f=${hz(lfo)}:d=0.5`;

/** Camada esparsa de "eventos" (gotas, estalos, bolhas) por modulação em frequência baixa. */
const pulsos = (freq: number, corte: number, ganho: number) =>
  `anoisesrc=color=white:amplitude=${ganho}:seed=SEED2,highpass=f=${corte},tremolo=f=${hz(freq)}:d=0.95`;

const bancos: Record<FloorKey, Loop[]> = {
  rios: [
    { slug: "correnteza", cena: "Correnteza", filtro: base("brown", 1100, 0.1, 0.45) },
    {
      slug: "margem-insetos",
      cena: "Margem com insetos",
      filtro: `${base("brown", 800, 0.12)}[a];${pulsos(7, 5200, 0.05)}[b];[a][b]amix=inputs=2:weights=1 0.35`,
    },
    {
      slug: "chuva-no-rio",
      cena: "Chuva no rio",
      filtro: `${base("pink", 3200, 0.15, 0.35)}[a];${pulsos(11, 3000, 0.08)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
    {
      slug: "barco-ao-longe",
      cena: "Barco ao longe",
      filtro: `${base("brown", 700, 0.1)}[a];sine=frequency=62:beep_factor=0,tremolo=f=2.2:d=0.6,volume=0.06[b];[a][b]amix=inputs=2:weights=1 0.6`,
    },
  ],
  peixes: [
    {
      slug: "agua-sob-a-superficie",
      cena: "Água corrente sob a superfície",
      filtro: base("brown", 420, 0.1, 0.5),
    },
    {
      slug: "bolhas",
      cena: "Bolhas",
      filtro: `${base("brown", 500, 0.11)}[a];${pulsos(3.5, 1400, 0.07)}[b];[a][b]amix=inputs=2:weights=1 0.45`,
    },
    {
      slug: "remo",
      cena: "Remo",
      filtro: `${base("brown", 600, 0.1)}[a];${pulsos(0.45, 900, 0.12)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
    {
      slug: "chuva-na-agua",
      cena: "Chuva na água",
      filtro: `${base("pink", 2600, 0.13, 0.35)}[a];${pulsos(13, 2400, 0.07)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
  ],
  arvores: [
    { slug: "folhas-ao-vento", cena: "Folhas ao vento", filtro: base("pink", 2800, 0.12, 0.4) },
    {
      slug: "cigarras",
      cena: "Cigarras",
      filtro: `${base("pink", 2200, 0.1, 0.3)}[a];anoisesrc=color=white:amplitude=0.09:seed=SEED2,bandpass=f=4800:width_type=h:w=900,tremolo=f=9:d=0.8[b];[a][b]amix=inputs=2:weights=1 0.6`,
    },
    {
      slug: "mata-ao-amanhecer",
      cena: "Mata ao amanhecer",
      filtro: `${base("pink", 3000, 0.09, 0.32)}[a];${pulsos(1.6, 3600, 0.06)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
    {
      slug: "chuva-leve-na-copa",
      cena: "Chuva leve na copa",
      filtro: `${base("pink", 3800, 0.14, 0.33)}[a];${pulsos(16, 4200, 0.06)}[b];[a][b]amix=inputs=2:weights=1 0.45`,
    },
  ],
  aves: [
    { slug: "mata-com-cantos", cena: "Mata com cantos", filtro: base("pink", 4200, 0.12, 0.32) },
    {
      slug: "amanhecer",
      cena: "Amanhecer",
      filtro: `${base("pink", 3600, 0.1, 0.3)}[a];${pulsos(2.3, 4800, 0.05)}[b];[a][b]amix=inputs=2:weights=1 0.55`,
    },
    {
      slug: "entardecer",
      cena: "Entardecer",
      filtro: `${base("pink", 2600, 0.11, 0.32)}[a];${pulsos(1.1, 3200, 0.05)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
    {
      slug: "vento-alto",
      cena: "Vento no andar mais alto",
      filtro: base("pink", 1800, 0.08, 0.42),
    },
  ],
  guardioes: [
    {
      slug: "noite-na-floresta",
      cena: "Noite na floresta",
      filtro: base("brown", 320, 0.09, 0.45),
    },
    {
      slug: "grilos",
      cena: "Grilos",
      filtro: `${base("brown", 500, 0.1, 0.3)}[a];anoisesrc=color=white:amplitude=0.07:seed=SEED2,bandpass=f=5600:width_type=h:w=500,tremolo=f=6:d=0.9[b];[a][b]amix=inputs=2:weights=1 0.6`,
    },
    {
      slug: "agua-parada",
      cena: "Água parada",
      filtro: `${base("brown", 260, 0.07, 0.4)}[a];${pulsos(0.3, 800, 0.05)}[b];[a][b]amix=inputs=2:weights=1 0.5`,
    },
  ],
};

function gerar(andar: FloorKey, loop: Loop, semente: number) {
  const dir = resolve(root, "public/audio", andar);
  mkdirSync(dir, { recursive: true });
  const filtro = loop.filtro
    .replace(/SEED2/g, String(semente + 991))
    .replace(/SEED/g, String(semente));
  const cadeia = `${filtro},afade=t=in:d=2,afade=t=out:st=${segundos - 2}:d=2,volume=0.5`;
  const webm = resolve(dir, `${loop.slug}.webm`);
  const m4a = resolve(dir, `${loop.slug}.m4a`);
  const comum = [
    "-hide_banner",
    "-loglevel",
    "error",
    "-y",
    "-f",
    "lavfi",
    "-t",
    String(segundos),
    "-i",
    cadeia,
    "-ac",
    "1",
  ];
  execFileSync("ffmpeg", [...comum, "-c:a", "libopus", "-b:a", "48k", webm], { stdio: "inherit" });
  execFileSync("ffmpeg", [...comum, "-c:a", "aac", "-b:a", "48k", "-movflags", "+faststart", m4a], {
    stdio: "inherit",
  });
  return Math.round(statSync(webm).size / 1024);
}

let semente = 17;
const linhas: string[] = [];
for (const andar of floorOrder) {
  for (const loop of bancos[andar]) {
    const kb = gerar(andar, loop, (semente += 13));
    linhas.push(
      `| ${andar} | \`${andar}/${loop.slug}\` | ${loop.cena} | ${segundos} s | ${kb} KB |`,
    );
    process.stdout.write(`audio: ${andar}/${loop.slug} (${loop.cena}) ${kb} KB\n`);
  }
}
process.stdout.write(
  `audio: ${Object.values(bancos).reduce((s, b) => s + b.length, 0)} loops em ${floorOrder.length} andares\n`,
);
process.stdout.write(`\n${linhas.join("\n")}\n`);
