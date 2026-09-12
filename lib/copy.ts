/**
 * Utilidades de copy: parágrafos, campos ⟨entre colchetes⟩ e frases.
 * Os campos entre colchetes são dados que o cliente ainda não deu (documento mestre).
 * Em produção eles somem; em desenvolvimento ficam visíveis (components/Placeholder.tsx).
 */

export const PLACEHOLDER_RE = /⟨[^⟩]*⟩/g;

export function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

export function hasPlaceholder(text: string): boolean {
  return /⟨[^⟩]*⟩/.test(text);
}

/** Remove os campos pendentes e limpa a pontuação que sobra. */
export function stripPlaceholders(text: string): string {
  return text
    .replace(PLACEHOLDER_RE, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([.,;:])/g, "$1")
    .replace(/\(\s*\)/g, "")
    .replace(/\.(\s*\.)+/g, ".")
    .trim();
}

/**
 * Uma frase como ela vai ao ar em produção, sem os campos ⟨pendentes⟩ (veto 5).
 *
 * Se o campo é o complemento do fim da frase ("Banheiro privativo com ⟨amenidades⟩"), sobra
 * a frase sem ele. Se a frase depende do campo ("Café da manhã das ⟨hora⟩ às ⟨hora⟩"), ela
 * sai inteira: melhor não dizer do que dizer pela metade.
 */
export function frasePublicavel(frase: string): string | null {
  const f = frase.trim();
  if (!f) return null;
  if (!hasPlaceholder(f)) return f;
  const complemento = f.match(/^(.*\S)\s+(?:com|e|de|a|em|por)\s+(?:⟨[^⟩]*⟩[\s,]*)+\.?$/);
  if (complemento) {
    const sobra = `${complemento[1].replace(/[\s,]+$/, "")}.`;
    // Se o que sobrou ainda tem campo pendente, a frase sai inteira: nenhum ⟨colchete⟩
    // pode chegar à produção (veto 5).
    return hasPlaceholder(sobra) ? null : sobra;
  }
  // Campo isolado entre pontos ("⟨Museu ou memorial⟩."): a frase inteira sai.
  return null;
}

/**
 * O texto como ele vai ao ar em produção: frase a frase, tirando o que depende de campo
 * pendente. Em desenvolvimento o texto volta inteiro, com os campos visíveis.
 */
export function copyDeProducao(texto: string): string {
  return texto
    .split(/(?<=\.)\s+/)
    .map(frasePublicavel)
    .filter((f): f is string => Boolean(f))
    .join(" ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

/** Divide um texto em segmentos de texto normal e de campo pendente. */
export function segmentPlaceholders(
  text: string,
): { kind: "text" | "placeholder"; value: string }[] {
  const out: { kind: "text" | "placeholder"; value: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(PLACEHOLDER_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ kind: "text", value: text.slice(last, i) });
    out.push({ kind: "placeholder", value: m[0].slice(1, -1) });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ kind: "text", value: text.slice(last) });
  return out;
}

/** "Chegou cansado. Veio de estrada..." -> ["Chegou cansado.", "Veio de estrada..."] */
export function splitLead(paragraph: string): [string, string] {
  const m = paragraph.match(/^([\s\S]+?[.!?])\s+([\s\S]*)$/);
  if (!m) return [paragraph, ""];
  return [m[1], m[2]];
}

/** Hash determinístico de string (djb2), para escolhas estáveis por slug. */
export function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * Espalha os bits do hash (finalizador do MurmurHash3). O djb2 puro, tirado o resto por um
 * número pequeno, agrupa slugs parecidos no mesmo balde: sem isto, nove dos catorze rios
 * caíam no mesmo loop de som. Continua determinístico.
 */
export function mixHash(h: number): number {
  let x = h >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x85ebca6b);
  x ^= x >>> 13;
  x = Math.imul(x, 0xc2b2ae35);
  x ^= x >>> 16;
  return x >>> 0;
}

/** Índice estável e bem distribuído dentro de uma lista, a partir de um slug. */
export function escolhaEstavel(slug: string, total: number): number {
  return total > 0 ? mixHash(hashString(slug)) % total : 0;
}
