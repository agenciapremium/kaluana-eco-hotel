# Etapas

Checklist de cada etapa, com o que foi feito, o que ficou pendente e os créditos do Higgsfield gastos. Nenhuma etapa avança sem "aprovado" do responsável da Premium.

## Etapa 1: fundação e Home

**Branch:** `etapa-1` (será integrada à `main` após a aprovação).
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 24 (teto: 250). Saldo: 8.791,6.

### Critérios de aceite

| Critério | Status | Evidência |
|---|---|---|
| Build limpo (`npm run build`) | Feito | Sem erros nem avisos nas duas fases |
| Lighthouse acima de 90 nos quatro eixos na Home em mobile | Feito | Ver tabela abaixo |
| Nenhuma animação automática além do vídeo de fundo | Feito | Entradas só por interseção ou hover; abertura de sessão toca uma vez por sessão |
| Home funciona sem JavaScript no essencial (texto, links, formulário) | Feito | Movimento ligado por `html.js`; formulário faz POST e redireciona para `/obrigado` |
| `prefers-reduced-motion` respeitado | Feito | Tudo vira fade de 150 ms; vídeo do hero vira imagem; abertura não toca |
| Nenhuma frase vetada | Feito | `npm run check:copy` sem ocorrências |
| Nenhum campo ⟨entre colchetes⟩ visível em produção | Feito | `Placeholder` oculta em produção; a Home não usa campos pendentes |
| Tokens sem valores soltos | Feito | Cores, durações e curvas vêm de `lib/tokens.ts` e `app/tokens.css` |
| `docs/etapas.md`, `decisoes.md`, `registro-higgsfield.md`, `registro-audio.md` | Feito | Esta pasta |
| Capturas desktop e mobile em `docs/screenshots/etapa-1/` | Feito | 4 capturas (pre e full) |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado)

| Página | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| Home `pre`, mobile | 91 a 95 | 100 | 100 | 100 | 2,9 a 3,4 s | 0 |
| Home `pre`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |
| Home `full`, mobile | 94 a 96 | 100 | 100 | 100 | 2,7 a 3,0 s | 0 |
| Home `full`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |

O LCP simulado no mobile é dominado pela abertura de sessão (primeira visita). Com throttling real de rede e CPU (Playwright), o LCP fica em 0,8 s. Detalhe em `decisoes.md`, item 20. Relatórios HTML em `docs/lighthouse/etapa-1/`.

### O que foi feito

1. Projeto Next.js 16 (App Router, TypeScript estrito, Turbopack), Tailwind 4 com tokens em `@theme`, `motion`, `next/font` (Source Sans 3 e Cormorant Garamond provisória), ESLint, Prettier, Node 24.
2. `lib/tokens.ts` como fonte única de cores, acentos por andar, tipografia, espaçamento e movimento; `app/tokens.css` gerado.
3. Pipeline de conteúdo: `scripts/build-content.ts` valida os 7 YAML com Zod e grava `content/` (5 andares, 70 elementos, 30 páginas, `qr-map.json` com as 70 UHs e `universo-index.json`). Roda em `prebuild`.
4. Pipeline de mídia: `scripts/build-media.ts` gera WebP e AVIF em 640, 1024, 1600 e 1920 px, o vídeo do hero (MP4 25 KB, WebM 22 KB, 14,8 s, 1280 px, sem áudio, poster) e a abertura com alfa (WebM VP9, HEVC para Safari, MP4 sobre bege, 1,8 s), mais logo em PNG, imagem Open Graph e ícones.
5. Layout base: cabeçalho (some ao rolar para baixo, menu conforme a fase, menu mobile em cascata, Reservar), rodapé (símbolo em traço, NAP, colunas, redes, legais, assinatura, CNPJ), migalhas de pão com BreadcrumbList, cortina bege de transição, abertura de sessão (uma vez por sessão, 1,8 s, Pular, nunca no Universo), `prefers-reduced-motion`.
6. Movimento: entradas por interseção uma vez só (fade, subida, máscara, traço), título palavra a palavra, símbolo em traço, faixas de andar com expansão no hover, botões com seta e clique a 0,98.
7. Áudio: `AmbientAudio` com Web Audio (dois buffers em crossfade, fade-in 1,5 s, fade-out 0,8 s, 25%, pausa ao perder foco, estado na sessão, escolha determinística por elemento, evento `audio_play`), cinco loops de exemplo em `public/audio/` e página de teste `/dev/audio` (só em desenvolvimento).
8. Analytics: camada de dados com os 9 eventos, GTM só após consentimento (Consent Mode com tudo negado antes), banner de consentimento.
9. Home `pre` (5.30): hero com vídeo, o nome com o símbolo, os andares com as quatro faixas, empresas, formulário "Avisamos você primeiro" (server action, Zod, honeypot, limite por IP, Resend, redireciona para `/obrigado`), três perguntas com FAQPage. JSON-LD: Hotel (openingDate), Organization, WebSite, FAQPage, BreadcrumbList.
10. Home `full` (5.1): hero, três jeitos de chegar com imagens de detalhe, o nome, faixas de andar, restaurante, eventos (só com `NEXT_PUBLIC_EVENTOS_AUTORIZADO=true`), Ji-Paraná com mapa esquemático, histórias, chamada final. JSON-LD: Hotel (com Restaurant), Organization, WebSite, BreadcrumbList.
11. Mídias: 24 explorações no Higgsfield (`seedream_v4_5`, 1 crédito cada), 8 selecionadas para a Home, registradas em `registro-higgsfield.md`.
12. QA: `scripts/check-copy.ts` (vetos), `scripts/screenshots.ts` (Playwright), `scripts/lighthouse.ts`, `scripts/qa.sh` (build, servidor, capturas e Lighthouse por fase).
13. Também: `sitemap.ts` (só a Home por enquanto), `robots.ts` (bloqueia `/q/` e `/obrigado`), 404 mínima com a copy da 5.29, `/obrigado`.

### Pendente ou aguardando decisão

| Item | Depende de | Onde |
|---|---|---|
| Aprovar as 8 imagens selecionadas (ou trocar por uma alternativa da galeria) | Responsável | `registro-higgsfield.md` |
| Telefone oficial, e-mail, CEP, coordenadas, handles das redes, link da ficha do Google | Cliente (Parte 8) | `lib/site.ts` |
| ID do GTM, chave e destino do Resend, URL do motor de reservas | Agência e cliente | `.env.example` |
| Autorização de Eventos | Cliente | `NEXT_PUBLIC_EVENTOS_AUTORIZADO` |
| Licença web da Guton (senão, manter Cormorant) e aprovação dos 5 acentos por andar | Design e cliente | `app/layout.tsx`, `lib/tokens.ts` |
| Copy fora do documento mestre, marcada com `TODO(copy)`: banner de consentimento, `/obrigado`, apoio do formulário | Responsável | `components/analytics/ConsentBanner.tsx`, `app/obrigado/page.tsx`, `components/forms/LeadForm.tsx` |
| Loops reais de som ambiente | Etapa 3 | `registro-audio.md` |
| Páginas ligadas pela Home (`/universo`, `/historias`, `/o-kaluana`, legais etc.) | Etapas 2 a 5 | Links caem na 404 até lá |
| Versão final da 404 (símbolo em loop, busca) | Etapa 5 | `app/not-found.tsx` |
| Vídeo do hero: o BG original é vertical e tem 2,5 s (loop ida e volta). Gerar um loop novo no Higgsfield fica como opção | Responsável | `registro-higgsfield.md` |

### Como rodar

```bash
cd site
nvm use
npm install
cp .env.example .env.local   # NEXT_PUBLIC_SITE_PHASE=pre ou full
npm run dev                  # http://localhost:3000
```

QA de uma fase (build de produção, capturas e Lighthouse): `PORT=3100 bash scripts/qa.sh pre` ou `full`.
Pipelines locais (precisam de ../DOCS e ffmpeg): `npm run build:media`, `npm run build:audio`.

## Etapa 2: Acomodações

Aguardando "aprovado" da etapa 1.
