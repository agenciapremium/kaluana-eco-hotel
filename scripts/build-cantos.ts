/**
 * Cantos de ave para o Andar das Aves (CLAUDE.md, seção 8, item 3).
 *
 * Origem: xeno-canto, republicado no Wikimedia Commons (autor, licença e link no metadado), ou
 * baixado direto da API v3 do xeno-canto com a chave XENO_CANTO_API_KEY do .env.local. Só entram
 * gravações com licença que permita uso comercial e obra derivada (CC BY, CC BY-SA ou CC0), e o
 * crédito aparece no rodapé da página do elemento e em docs/registro-audio.md.
 *
 * Critério de espécie, o mesmo da regra 6 do CLAUDE.md para imagens: a gravação só é aceita
 * se a espécie estiver dentro do táxon que o YAML declara para aquele quarto. Onde o YAML
 * nomeia uma espécie (Harpia harpyja, Caracara plancus, Crotophaga ani, Primolius maracana),
 * gravação de espécie vizinha é descartada, ainda que exista no Commons.
 *
 * Outros animais entram pela mesma tabela, com o andar indicado. Gravação curta demais para loop
 * (o esturro da onça tem 1,4 s) entra por cima de um loop do andar, em segundos marcados.
 *
 * Saída: public/audio/<andar>/canto-<slug>.webm (Opus) e .m4a (AAC), mono, 48 kbps, normalizados
 * em -30 LUFS (25 s, ou 45 s sobre o fundo), mais content/cantos.json. Precisa de ffmpeg. Use: npm run build:cantos
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const UA = "KaluanaEcoHotel/1.0 (https://kaluanaecohotel.com.br)";
const API = "https://commons.wikimedia.org/w/api.php";

/** Arquivo no Commons por elemento, e a espécie realmente gravada. */
type Aceito = {
  /** Arquivo no Wikimedia Commons. */
  arquivoCommons?: string;
  /** Número da gravação no xeno-canto (XC), baixada pela API v3. */
  xenoCanto?: number;
  especie: string;
  taxon: string;
  /** Andar da página; aves quando omitido. */
  grupo?: "aves" | "guardioes";
  /** Gravação curta: entra por cima de um loop do andar, nos segundos indicados. */
  sobreFundo?: { loop: string; segundos: number[] };
};

const aceitos: Record<string, Aceito> = {
  arara: {
    arquivoCommons: "File:Scarlet macaw 01.wav",
    especie: "Ara macao (araracanga)",
    taxon: "Ara spp.",
  },
  tucano: {
    arquivoCommons: "File:Ramphastos tucanus - White-throated Toucan XC251458.mp3",
    especie: "Ramphastos tucanus (tucano-grande-de-papo-branco)",
    taxon: "Ramphastos spp.",
  },
  papagaio: {
    arquivoCommons: "File:Amazona farinosa - Mealy Amazon XC250466.mp3",
    especie: "Amazona farinosa (papagaio-moleiro)",
    taxon: "Amazona spp.",
  },
  uirapuru: {
    arquivoCommons: "File:Cyphorhinus arada - Musician Wren XC242525.mp3",
    especie: "Cyphorhinus arada (uirapuru-verdadeiro)",
    taxon: "Cyphorhinus arada",
  },
  "beija-flor": {
    arquivoCommons: "File:Phaethornis guy - Green Hermit XC251325.mp3",
    especie: "Phaethornis guy (rabo-branco-verde)",
    taxon: "Trochilidae",
  },
  coruja: {
    arquivoCommons: "File:Megascops choliba - Tropical Screech Owl XC428741.mp3",
    especie: "Megascops choliba (corujinha-do-mato)",
    taxon: "Strigiformes",
  },
  tangara: {
    arquivoCommons: "File:Chiroxiphia pareola - Blue-backed Manakin XC249078.mp3",
    especie: "Chiroxiphia pareola (tangará-falso)",
    taxon: "Pipridae",
  },
  curio: {
    arquivoCommons: "File:Oryzoborus angolensis - Chestnut-bellied Seed Finch XC242912.mp3",
    especie: "Sporophila angolensis (curió)",
    taxon: "Sporophila angolensis",
  },
  andorinha: {
    arquivoCommons: "File:Progne chalybea - Grey-breasted Martin XC243000.mp3",
    especie: "Progne chalybea (andorinha-grande)",
    taxon: "Hirundinidae",
  },
  "cardeal-da-amazonia": {
    arquivoCommons: "File:Paroaria gularis - Red-capped Cardinal XC242921.mp3",
    especie: "Paroaria gularis (cardeal-da-amazônia)",
    taxon: "Paroaria gularis",
  },
  garca: {
    xenoCanto: 705918,
    especie: "Ardea alba (garça-branca), gritos de alarme e de voo",
    taxon: "Ardea alba e Ardea cocoi",
    sobreFundo: { loop: "entardecer", segundos: [4, 19, 34] },
  },
  "anu-preto": {
    xenoCanto: 912265,
    especie: "Crotophaga ani (anu-preto)",
    taxon: "Crotophaga ani",
    sobreFundo: { loop: "amanhecer", segundos: [3, 18, 33] },
  },
  "onca-pintada": {
    arquivoCommons: "File:Jaguar saw.flac",
    especie: "Panthera onca (onça-pintada), esturro gravado no Attica Zoological Park",
    taxon: "Panthera onca",
    grupo: "guardioes",
    sobreFundo: { loop: "noite-na-floresta", segundos: [6, 21, 36] },
  },
};

/** Sem gravação aceitável: a página cai no banco do andar. Motivo registrado. */
export const semCanto: Record<string, string> = {
  "gaviao-real":
    "xeno-canto: 80 gravações de Harpia harpyja, todas com cláusula NC ou ND (13/09/2026)",
  mutum:
    "xeno-canto: Crax fasciolata, Crax globulosa e Mitu tuberosum sem gravação com licença comercial",
  carcara:
    "xeno-canto: a única gravação com licença comercial (XC497349, qualidade D) tem outras espécies da América Central por cima",
  maracana:
    "xeno-canto: Primolius maracana e Orthopsittaca manilatus sem gravação com licença comercial",
  colhereiro: "xeno-canto: 32 gravações de Platalea ajaja, todas com cláusula NC ou ND",
};

const limpa = (s?: string) =>
  (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type Meta = {
  url: string;
  ext: string;
  autor: string;
  licenca: string;
  licencaUrl: string;
  credito: string;
  pagina: string;
};

async function metadados(titulo: string): Promise<Meta> {
  const u = new URL(API);
  for (const [k, v] of Object.entries({
    action: "query",
    format: "json",
    titles: titulo,
    prop: "imageinfo",
    iiprop: "url|mime|extmetadata",
  })) {
    u.searchParams.set(k, v);
  }
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  const j = (await r.json()) as {
    query: {
      pages: Record<
        string,
        { imageinfo?: { url: string; extmetadata: Record<string, { value: string }> }[] }
      >;
    };
  };
  const p = Object.values(j.query.pages)[0];
  const ii = p.imageinfo?.[0];
  if (!ii) throw new Error(`sem metadado no Commons: ${titulo}`);
  const em = ii.extmetadata;
  const credito = limpa(em.Credit?.value);
  return {
    url: ii.url.split("?")[0],
    ext: ii.url.split("?")[0].split(".").pop() ?? "mp3",
    autor: limpa(em.Artist?.value),
    licenca: limpa(em.LicenseShortName?.value),
    licencaUrl: limpa(em.LicenseUrl?.value),
    credito,
    pagina: `https://commons.wikimedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, "_"))}`,
  };
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

const root = process.cwd();
/** Chave da API v3 do xeno-canto: variável de ambiente ou .env.local, que não vai para o git. */
function chaveXenoCanto() {
  if (process.env.XENO_CANTO_API_KEY) return process.env.XENO_CANTO_API_KEY;
  const env = resolve(process.cwd(), ".env.local");
  const achada = existsSync(env)
    ? readFileSync(env, "utf8").match(/^XENO_CANTO_API_KEY=\s*"?([^"\n]+)"?\s*$/m)
    : null;
  if (!achada)
    throw new Error("XENO_CANTO_API_KEY ausente: a chave vem da conta em xeno-canto.org");
  return achada[1].trim();
}

/** Nome do autor como vai no crédito: o que vem todo em maiúsculas passa a nome próprio. */
function nomeDoAutor(nome: string) {
  if (nome !== nome.toUpperCase()) return nome;
  const minusculas = new Set(["de", "da", "do", "das", "dos", "del", "la", "e", "y"]);
  return nome
    .toLowerCase()
    .split(/\s+/)
    .map((p, i) => (i > 0 && minusculas.has(p) ? p : p.charAt(0).toUpperCase() + p.slice(1)))
    .join(" ");
}

/** Nome curto da licença a partir da URL: CC BY 4.0, CC BY-SA 3.0, CC0 1.0. */
function licencaCurta(url: string) {
  const zero = url.match(/publicdomain\/zero\/([\d.]+)/);
  if (zero) return `CC0 ${zero[1]}`;
  const cc = url.match(/licenses\/([a-z-]+)\/([\d.]+)/);
  return cc ? `CC ${cc[1].toUpperCase()} ${cc[2]}` : url;
}

async function metadadosXenoCanto(id: number): Promise<Meta> {
  const u = `https://xeno-canto.org/api/3/recordings?query=${encodeURIComponent(`nr:${id}`)}&key=${chaveXenoCanto()}`;
  const r = await fetch(u, { headers: { "User-Agent": UA } });
  const j = (await r.json()) as {
    recordings?: { file: string; "file-name": string; rec: string; lic: string }[];
  };
  const rec = j.recordings?.[0];
  if (!rec) throw new Error(`gravação XC${id} não encontrada no xeno-canto`);
  const licencaUrl = rec.lic.startsWith("//") ? `https:${rec.lic}` : rec.lic;
  // Site comercial: licença com cláusula não comercial (NC) ou sem obra derivada (ND) não serve.
  if (/-nc|-nd/.test(licencaUrl))
    throw new Error(`XC${id} tem licença incompatível: ${licencaUrl}`);
  return {
    url: rec.file,
    ext: rec["file-name"].split(".").pop()?.toLowerCase() ?? "mp3",
    autor: nomeDoAutor(rec.rec),
    licenca: licencaCurta(licencaUrl),
    licencaUrl,
    credito: `xeno-canto XC${id}`,
    pagina: `https://xeno-canto.org/${id}`,
  };
}

(async () => {
  const saida: Record<string, unknown> = {};
  const registro: string[] = [];

  for (const [id, cfg] of Object.entries(aceitos)) {
    // Pausa entre consultas: o Commons recusa rajadas de requisições.
    await new Promise((r) => setTimeout(r, 1500));
    const meta = cfg.xenoCanto
      ? await metadadosXenoCanto(cfg.xenoCanto)
      : await metadados(cfg.arquivoCommons ?? "");
    const grupo = cfg.grupo ?? "aves";
    const fonte = resolve(root, "media-src/audio", grupo);
    const destino = resolve(root, "public/audio", grupo);
    mkdirSync(fonte, { recursive: true });
    mkdirSync(destino, { recursive: true });
    const ext = meta.ext;
    const original = resolve(fonte, `${id}.${ext}`);
    if (!existsSync(original)) {
      const res = await fetch(meta.url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`falha ao baixar ${meta.url}: ${res.status}`);
      writeFileSync(original, Buffer.from(await res.arrayBuffer()));
    }
    // Mono, normalizado em -30 LUFS como os loops do andar (o player toca bem baixo), com fade de
    // 1 s nas pontas para o loop não estalar.
    let entrada: string[];
    if (cfg.sobreFundo) {
      // A gravação curta fica um pouco acima do fundo e se repete nos segundos marcados.
      const fundo = resolve(destino, `${cfg.sobreFundo.loop}.m4a`);
      const marcas = cfg.sobreFundo.segundos;
      const copias = marcas.map((_, i) => `[e${i}]`).join("");
      const atrasos = marcas
        .map((s, i) => `[e${i}]adelay=delays=${s * 1000}:all=1[d${i}]`)
        .join(";");
      const atrasadas = marcas.map((_, i) => `[d${i}]`).join("");
      entrada = [
        "-i",
        fundo,
        "-i",
        original,
        "-filter_complex",
        `[1:a]aformat=channel_layouts=mono,loudnorm=I=-24:TP=-9,asplit=${marcas.length}${copias};${atrasos};[0:a]aformat=channel_layouts=mono[f];[f]${atrasadas}amix=inputs=${marcas.length + 1}:duration=first:normalize=0,loudnorm=I=-30:TP=-9:LRA=11,afade=t=in:st=0:d=1,afade=t=out:st=44:d=1`,
      ];
    } else {
      entrada = [
        "-i",
        original,
        "-vn",
        "-af",
        "atrim=0:25,aformat=channel_layouts=mono,loudnorm=I=-30:TP=-9:LRA=11,afade=t=in:st=0:d=1,afade=t=out:st=24:d=1",
      ];
    }
    const webm = resolve(destino, `canto-${id}.webm`);
    const m4a = resolve(destino, `canto-${id}.m4a`);
    ffmpeg([...entrada, "-c:a", "libopus", "-b:a", "48k", "-ar", "48000", webm]);
    ffmpeg([
      ...entrada,
      "-c:a",
      "aac",
      "-b:a",
      "48k",
      "-ar",
      "48000",
      "-movflags",
      "+faststart",
      m4a,
    ]);
    saida[id] = {
      arquivo: `canto-${id}`,
      autor: meta.autor,
      licenca: meta.licenca,
      licencaUrl: meta.licencaUrl,
      fonte: meta.pagina,
      especie: cfg.especie,
    };
    registro.push(
      `| ${id} | ${cfg.especie} | ${cfg.taxon} | ${meta.autor} | ${meta.licenca} | ${meta.pagina} |`,
    );
    process.stdout.write(`canto: ${id} (${cfg.especie}) ${meta.licenca}, ${meta.autor}\n`);
  }

  writeFileSync(resolve(root, "content/cantos.json"), JSON.stringify(saida, null, 2) + "\n");
  writeFileSync(resolve(root, "docs/registro-cantos.md"), registro.join("\n") + "\n");
  process.stdout.write(
    `cantos: ${Object.keys(saida).length} gravações; ${Object.keys(semCanto).length} sem canto\n`,
  );
})().catch((e: unknown) => {
  process.stderr.write(`cantos: ${e instanceof Error ? e.message : String(e)}\n`);
  process.exit(1);
});
