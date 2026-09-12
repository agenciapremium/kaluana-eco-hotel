/**
 * Usos das árvores para o filtro do 3º andar (5.14: madeira, óleo, fruta, sombra).
 *
 * O documento mestre pede o filtro, mas os YAML não trazem esse campo estruturado: a
 * informação está espalhada na ficha e na história de cada árvore. As tags abaixo foram
 * derivadas desse conteúdo e ficam aqui, num módulo sem JSON (pode ser importado pelo
 * componente cliente), para validação com o cliente.
 * TODO(copy): confirmar a classificação com o responsável.
 */
export const usosDeArvore = [
  { id: "madeira", label: "Madeira" },
  { id: "oleo", label: "Óleo" },
  { id: "fruta", label: "Fruta" },
  { id: "sombra", label: "Sombra" },
] as const;

export type UsoArvore = (typeof usosDeArvore)[number]["id"];

export const usosPorArvore: Record<string, UsoArvore[]> = {
  samauma: ["madeira", "sombra"],
  castanheira: ["fruta", "sombra"],
  copaiba: ["oleo", "madeira"],
  andiroba: ["oleo", "madeira"],
  acai: ["fruta"],
  cumaru: ["madeira", "oleo"],
  cedro: ["madeira"],
  mogno: ["madeira"],
  ipe: ["madeira", "sombra"],
  jatoba: ["madeira", "fruta"],
  bacaba: ["fruta", "oleo"],
  tucuma: ["fruta", "oleo"],
  angelim: ["madeira"],
  macaranduba: ["madeira"],
  jenipapo: ["fruta"],
  itauba: ["madeira"],
  seringueira: ["madeira", "sombra"],
  jequitiba: ["madeira", "sombra"],
};

export function usosDe(id: string): UsoArvore[] {
  return usosPorArvore[id] ?? [];
}
