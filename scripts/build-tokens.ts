/**
 * Gera app/tokens.css a partir de lib/tokens.ts.
 * Roda em predev e prebuild. O arquivo gerado não deve ser editado à mão.
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { colors, floors, fonts, typeScale, spacing, motion } from "../lib/tokens";

const lines: string[] = [];
lines.push("/* Gerado por scripts/build-tokens.ts a partir de lib/tokens.ts. Não editar à mão. */");
lines.push("@theme {");
for (const [name, value] of Object.entries(colors)) {
  lines.push(`  --color-${kebab(name)}: ${value};`);
}
for (const [key, floor] of Object.entries(floors)) {
  lines.push(`  --color-${key}: ${floor.accent};`);
}
lines.push(`  --font-sans: ${fonts.sans};`);
lines.push(`  --font-display: ${fonts.display};`);
for (const [name, value] of Object.entries(typeScale)) {
  lines.push(`  --text-${name}: ${value};`);
}
for (const [name, value] of Object.entries(spacing)) {
  lines.push(`  --spacing-${kebab(name)}: ${value};`);
}
lines.push(`  --container-site: ${spacing.container};`);
lines.push(`  --container-measure: ${spacing.measure};`);
lines.push(`  --ease-padrao: ${motion.easeCss.standard};`);
lines.push(`  --ease-saida: ${motion.easeCss.exit};`);
lines.push("}");
lines.push("");
lines.push(":root {");
for (const [name, value] of Object.entries(motion.duration)) {
  lines.push(`  --duration-${kebab(name)}: ${value}ms;`);
}
for (const [name, value] of Object.entries(motion.stagger)) {
  lines.push(`  --stagger-${kebab(name)}: ${value}ms;`);
}
for (const [name, value] of Object.entries(motion.offset)) {
  lines.push(`  --offset-${kebab(name)}: ${value}px;`);
}
lines.push(`  --parallax-max: ${motion.parallaxMax};`);
lines.push(`  --parallax-terraco: ${motion.parallaxTerraco};`);
lines.push(`  --hover-darken-photo: ${motion.hoverDarkenPhoto};`);
lines.push(`  --hero-zoom-from: ${motion.heroZoomFrom};`);
lines.push(`  --flutuacao-px: ${motion.flutuacaoPx}px;`);
lines.push(`  --hover-scale: ${motion.hoverScale.min};`);
lines.push(`  --hover-scale-max: ${motion.hoverScale.max};`);
lines.push(`  --press-scale: ${motion.pressScale};`);
lines.push(`  --arrow-slide: ${motion.arrowSlide}px;`);
lines.push(`  --veil-hero: ${motion.veil.hero};`);
lines.push(`  --veil-hero-scrolled: ${motion.veil.heroScrolled};`);
lines.push(`  --hero-video-fade: ${motion.heroVideoFade};`);
lines.push("}");
lines.push("");

const out = resolve(process.cwd(), "app/tokens.css");
mkdirSync(resolve(process.cwd(), "app"), { recursive: true });
writeFileSync(out, lines.join("\n"));
process.stdout.write(`tokens: ${out}\n`);

function kebab(s: string) {
  return s.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}
