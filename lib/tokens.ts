/**
 * Tokens da marca Kaluanã Eco Hotel.
 *
 * Fonte única de cores, acentos por andar, tipografia, espaçamento e movimento.
 * O CSS em app/tokens.css é gerado a partir deste arquivo por scripts/build-tokens.ts.
 * Nenhum componente deve usar cor, duração ou curva fora daqui.
 *
 * Referências: DOCS/CORES/CORES.md, documento mestre Parte 1.7 e Parte 2.3.
 */

export const colors = {
  cafe: "#552F22",
  salvia: "#929777",
  bege: "#ECE5DF",
  branco: "#FFFFFF",
  preto: "#101010",
  /** Marrom Café escurecido 8% para hover de botão primário (Parte 2.4, Botões). */
  cafeEscuro: "#4E2B1F",
  /** Bege 6% mais escuro para linhas, bordas e fundos de card sobre bege. */
  begeEscuro: "#DED4CB",
} as const;

export type FloorKey = "rios" | "peixes" | "arvores" | "aves" | "guardioes";

export const floors: Record<
  FloorKey,
  { accent: string; nome: string; andar: number; ordinal: string; url: `/universo/${FloorKey}` }
> = {
  rios: { accent: "#3E5C6B", nome: "Andar dos Rios", andar: 1, ordinal: "1º andar", url: "/universo/rios" },
  peixes: { accent: "#4F7A6B", nome: "Andar dos Peixes", andar: 2, ordinal: "2º andar", url: "/universo/peixes" },
  arvores: { accent: "#6B7A3E", nome: "Andar das Árvores", andar: 3, ordinal: "3º andar", url: "/universo/arvores" },
  aves: { accent: "#8C6A3D", nome: "Andar das Aves", andar: 4, ordinal: "4º andar", url: "/universo/aves" },
  guardioes: { accent: "#552F22", nome: "Os Guardiões", andar: 4, ordinal: "Suítes", url: "/universo/guardioes" },
};

export const floorOrder: FloorKey[] = ["rios", "peixes", "arvores", "aves", "guardioes"];

/**
 * Tipografia. As famílias vêm de next/font (variáveis CSS declaradas em app/layout.tsx).
 * TODO(fonte): Cormorant Garamond é provisória até a licença web da Guton ser confirmada.
 */
export const fonts = {
  sans: "var(--font-source-sans), 'Source Sans 3', system-ui, sans-serif",
  display: "var(--font-cormorant), 'Cormorant Garamond', Georgia, serif",
} as const;

/** Escala tipográfica fluida (rem). */
export const typeScale = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  /** H1 de hero. */
  display: "clamp(2.25rem, 1.2rem + 4.5vw, 5rem)",
  /** H2 de seção. */
  title: "clamp(1.75rem, 1rem + 2.6vw, 3.25rem)",
  /** Nomes grandes (guardiões, suítes). */
  giant: "clamp(3rem, 1rem + 9vw, 9rem)",
} as const;

/** Espaçamento (rem). A escala base do Tailwind (0.25rem) continua válida. */
export const spacing = {
  gutter: "clamp(1rem, 4vw, 2.5rem)",
  section: "clamp(4rem, 9vw, 8rem)",
  sectionSm: "clamp(2.5rem, 6vw, 5rem)",
  measure: "38rem",
  container: "80rem",
} as const;

/** Sistema de movimento "respiração de floresta" (Parte 2.3). */
export const motion = {
  ease: {
    /** Entradas, hovers, transições de página. */
    standard: [0.22, 1, 0.36, 1] as const,
    /** Elementos que saem da tela. */
    exit: [0.55, 0, 1, 0.45] as const,
  },
  easeCss: {
    standard: "cubic-bezier(0.22, 1, 0.36, 1)",
    exit: "cubic-bezier(0.55, 0, 1, 0.45)",
  },
  /** Durações em milissegundos. */
  duration: {
    short: 220,
    medium: 500,
    long: 900,
    xlong: 1200,
    xlongMax: 1800,
    reduced: 150,
    curtainIn: 400,
    curtainOut: 500,
    mask: 700,
    accordion: 250,
    stroke: 1200,
    opening: 1800,
    press: 100,
    crossfade: 600,
  },
  /** Escalonamento entre itens, em milissegundos. */
  stagger: { min: 40, word: 60, item: 60, max: 90 },
  /** Deslocamento de entrada, em pixels. */
  offset: { min: 16, default: 20, max: 24 },
  /** Parallax máximo como fração da altura. */
  parallaxMax: 0.08,
  hoverScale: { min: 1.03, max: 1.04 },
  pressScale: 0.98,
  /** Fração do elemento visível para disparar a entrada. */
  inViewAmount: 0.25,
  /** Escurecimento do botão primário no hover. */
  hoverDarken: 0.08,
  /** Deslize da seta do botão no hover, em pixels. */
  arrowSlide: 4,
  /** Véu bege sobre o vídeo do hero, em repouso e após rolar. */
  veil: { hero: 0.2, heroScrolled: 0.35 },
  /** Perda de opacidade do vídeo ao rolar. */
  heroVideoFade: 0.15,
} as const;

/** Áudio ambiente (CLAUDE.md, seção 8). */
export const audio = {
  volume: 0.25,
  fadeInMs: 1500,
  fadeOutMs: 800,
  crossfadeMs: 1000,
  volumeJitter: 0.05,
} as const;

/** Larguras geradas pelo pipeline de imagens. */
export const imageWidths = [640, 1024, 1600, 1920] as const;

export const tokens = { colors, floors, fonts, typeScale, spacing, motion, audio, imageWidths };
export default tokens;
