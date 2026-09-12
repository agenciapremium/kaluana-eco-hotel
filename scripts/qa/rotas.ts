/**
 * Rotas de página do build atual, lidas de `.next/server/app`. Serve aos scripts de QA da
 * etapa 6 (Lighthouse em lote, acessibilidade), para que "todas as rotas" seja o que o build
 * de fato gerou, e não uma lista escrita à mão que envelhece.
 *
 * `index.html` vira `/`, `universo/rios/rio-machado.html` vira `/universo/rios/rio-machado`.
 * A 404 entra como uma rota inexistente, para ser medida com o status real. Ficam de fora a
 * página de erro global do Next e a `/dev/audio`, que só existe em desenvolvimento.
 */
import { existsSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const ROTA_404 = "/rota-que-nao-existe";

export function rotasDoBuild(root = process.cwd()): string[] {
  const dir = join(root, ".next/server/app");
  if (!existsSync(dir)) throw new Error("rode npm run build antes");
  const rotas: string[] = [];
  const pilha = [dir];
  while (pilha.length) {
    const atual = pilha.pop() as string;
    for (const nome of readdirSync(atual)) {
      const p = join(atual, nome);
      if (statSync(p).isDirectory()) {
        pilha.push(p);
        continue;
      }
      if (!nome.endsWith(".html") || nome === "_global-error.html") continue;
      const rel = relative(dir, p).replace(/\.html$/, "");
      if (rel.startsWith("dev/")) continue;
      if (rel === "_not-found") rotas.push(ROTA_404);
      else rotas.push(rel === "index" ? "/" : `/${rel}`);
    }
  }
  return rotas.sort((a, b) => (a === "/" ? -1 : b === "/" ? 1 : a.localeCompare(b)));
}

/** Nome de arquivo para uma rota: `/` é `home`, `/a/b` é `a-b`. */
export const nomeDaRota = (rota: string) =>
  rota === "/" ? "home" : rota.replace(/^\/|\/$/g, "").replace(/\//g, "-");

/** Lê `--chave=valor` da linha de comando. */
export const arg = (k: string, d: string) =>
  process.argv.find((a) => a.startsWith(`--${k}=`))?.slice(k.length + 3) ?? d;
