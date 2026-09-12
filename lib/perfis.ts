/**
 * Os três perfis do filtro de Acomodações (5.3). Módulo sem importações de conteúdo,
 * porque é usado no client component do filtro: importar lib/acomodacoes.ts levaria
 * os JSON de conteúdo inteiros para o bundle do navegador.
 */
export const perfis = ["chegou-cansado", "precisa-produzir", "precisa-parar"] as const;
export type Perfil = (typeof perfis)[number];

export const perfilLabel: Record<Perfil, string> = {
  "chegou-cansado": "Chegou cansado",
  "precisa-produzir": "Precisa produzir",
  "precisa-parar": "Precisa parar",
};

/** Frase curta de perfil que aparece no véu do card, tirada da copy do filtro (5.3). */
export const perfilFrase: Record<Perfil, string> = {
  "chegou-cansado": "Cama e silêncio",
  "precisa-produzir": "Mesa e internet",
  "precisa-parar": "Varanda e tempo",
};
