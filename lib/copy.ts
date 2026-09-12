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
