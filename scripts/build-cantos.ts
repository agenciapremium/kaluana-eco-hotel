/**
 * Cantos de ave para o Andar das Aves (CLAUDE.md, seção 8, item 3).
 *
 * Origem: xeno-canto, republicado no Wikimedia Commons, que entrega autor, licença e link
 * da gravação original no metadado do arquivo. Só entram gravações com licença Creative
 * Commons, e o crédito aparece no rodapé da página do elemento e em docs/registro-audio.md.
 *
 * Critério de espécie, o mesmo da regra 6 do CLAUDE.md para imagens: a gravação só é aceita
 * se a espécie estiver dentro do táxon que o YAML declara para aquele quarto. Onde o YAML
 * nomeia uma espécie (Harpia harpyja, Caracara plancus, Crotophaga ani, Primolius maracana),
 * gravação de espécie vizinha é descartada, ainda que exista no Commons.
 *
 * Saída: public/audio/aves/<slug>.webm (Opus) e .m4a (AAC), mono, 48 kbps, 25 s com fade,
 * mais content/cantos.json. Precisa de ffmpeg. Use: npm run build:cantos
 */
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const UA = "KaluanaEcoHotel/1.0 (contato@agpremium.com.br)";
const API = "https://commons.wikimedia.org/w/api.php";

/** Arquivo no Commons por elemento, e a espécie realmente gravada. */
const aceitos: Record<string, { arquivoCommons: string; especie: string; taxon: string }> = {
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
};

/** Sem gravação aceitável: a página cai no banco do andar. Motivo registrado. */
export const semCanto: Record<string, string> = {
  "gaviao-real":
    "Commons não tem Harpia harpyja; a alternativa era Spizaetus tyrannus, outra espécie",
  garca: "sem gravação de Ardea alba ou Ardea cocoi com licença compatível",
  mutum: "sem gravação de Crax spp. ou Mitu spp. com licença compatível",
  carcara: "Commons não tem Caracara plancus; a alternativa era Daptrius ater, outra espécie",
  maracana:
    "Commons não tem Primolius maracana nem Orthopsittaca manilatus; a alternativa era Psittacara leucophthalmus",
  "anu-preto": "Commons não tem Crotophaga ani; a alternativa era Crotophaga sulcirostris",
  colhereiro: "sem gravação de Platalea ajaja com licença compatível",
};

const limpa = (s?: string) =>
  (s ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

type Meta = {
  url: string;
  autor: string;
  licenca: string;
  licencaUrl: string;
  credito: string;
  paginaCommons: string;
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
    autor: limpa(em.Artist?.value),
    licenca: limpa(em.LicenseShortName?.value),
    licencaUrl: limpa(em.LicenseUrl?.value),
    credito,
    paginaCommons: `https://commons.wikimedia.org/wiki/${encodeURIComponent(titulo.replace(/ /g, "_"))}`,
  };
}

function ffmpeg(args: string[]) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], {
    stdio: "inherit",
  });
}

const root = process.cwd();
const destino = resolve(root, "public/audio/aves");
const fonte = resolve(root, "media-src/audio/aves");

(async () => {
  mkdirSync(destino, { recursive: true });
  mkdirSync(fonte, { recursive: true });
  const saida: Record<string, unknown> = {};
  const registro: string[] = [];

  for (const [id, cfg] of Object.entries(aceitos)) {
    const meta = await metadados(cfg.arquivoCommons);
    const ext = meta.url.split(".").pop() ?? "mp3";
    const original = resolve(fonte, `${id}.${ext}`);
    if (!existsSync(original)) {
      const res = await fetch(meta.url, { headers: { "User-Agent": UA } });
      if (!res.ok) throw new Error(`falha ao baixar ${meta.url}: ${res.status}`);
      writeFileSync(original, Buffer.from(await res.arrayBuffer()));
    }
    // 25 s no máximo, mono, normalizado, com fade de 1 s nas pontas para o loop não estalar.
    const filtro =
      "atrim=0:25,aformat=channel_layouts=mono,loudnorm=I=-20:TP=-2:LRA=11,afade=t=in:st=0:d=1,afade=t=out:st=24:d=1";
    const webm = resolve(destino, `canto-${id}.webm`);
    const m4a = resolve(destino, `canto-${id}.m4a`);
    ffmpeg([
      "-i",
      original,
      "-vn",
      "-af",
      filtro,
      "-c:a",
      "libopus",
      "-b:a",
      "48k",
      "-ar",
      "48000",
      webm,
    ]);
    ffmpeg([
      "-i",
      original,
      "-vn",
      "-af",
      filtro,
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
      fonte: meta.paginaCommons,
      especie: cfg.especie,
    };
    registro.push(
      `| ${id} | ${cfg.especie} | ${cfg.taxon} | ${meta.autor} | ${meta.licenca} | ${meta.paginaCommons} |`,
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
