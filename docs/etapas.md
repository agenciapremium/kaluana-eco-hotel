# Etapas

Checklist de cada etapa, com o que foi feito, o que ficou pendente e os créditos do Higgsfield gastos. Nenhuma etapa avança sem "aprovado" do responsável da Premium.

## Etapa 1: fundação e Home

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`.
**Branch:** `etapa-1`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 42 (teto: 250). Saldo: 8.773,6.
**Revisão de 12/09/2026:** direção visual refeita a pedido do responsável (cenas em tela cheia, referência resortkaskady.com). Ver `decisoes.md`, itens 21 a 24.

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
| Home `pre`, mobile | 92 | 100 | 100 | 100 | 3,3 s | 0 |
| Home `pre`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |
| Home `full`, mobile | 93 | 100 | 100 | 100 | 3,1 s | 0 |
| Home `full`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |

O LCP simulado no mobile (foto do hero, 14 KB em AVIF) é inflado pelo simulador do Lighthouse, que soma tudo o que é pedido antes do LCP observado, inclusive todo o JavaScript. Com throttling real de rede e CPU (Playwright), o LCP fica abaixo de 1 s. Detalhe em `decisoes.md`, itens 20 e 24. Relatórios HTML em `docs/lighthouse/etapa-1/`.

### O que foi feito

1. Projeto Next.js 16 (App Router, TypeScript estrito, Turbopack), Tailwind 4 com tokens em `@theme`, `motion`, `next/font` (Source Sans 3 e Cormorant Garamond provisória), ESLint, Prettier, Node 24.
2. `lib/tokens.ts` como fonte única de cores, acentos por andar, tipografia, espaçamento e movimento; `app/tokens.css` gerado.
3. Pipeline de conteúdo: `scripts/build-content.ts` valida os 7 YAML com Zod e grava `content/` (5 andares, 70 elementos, 30 páginas, `qr-map.json` com as 70 UHs e `universo-index.json`). Roda em `prebuild`.
4. Pipeline de mídia: `scripts/build-media.ts` gera WebP e AVIF em 640, 1024, 1600 e 1920 px, o vídeo do hero (MP4 25 KB, WebM 22 KB, 14,8 s, 1280 px, sem áudio, poster) e a abertura com alfa (WebM VP9, HEVC para Safari, MP4 sobre bege, 1,8 s), mais logo em PNG, imagem Open Graph e ícones.
5. Layout base: cabeçalho (transparente sobre o hero, sólido ao rolar, some ao rolar para baixo, menu conforme a fase, menu mobile em cascata, Reservar), rodapé (símbolo em traço, NAP, colunas, redes, legais, assinatura, CNPJ), migalhas de pão com BreadcrumbList, cortina bege de transição, abertura de sessão (uma vez por sessão, 1,8 s, Pular, nunca no Universo), `prefers-reduced-motion`.
6. Movimento: entradas por interseção uma vez só (fade, subida, máscara, traço), título palavra a palavra, símbolo em traço, molduras desenhadas por dentro das fotos, parallax de 8% e palavra em contorno ligados à rolagem (CSS nativo), painéis de andar empilhados com sticky, botões com seta e clique a 0,98.
7. Áudio: `AmbientAudio` com Web Audio (dois buffers em crossfade, fade-in 1,5 s, fade-out 0,8 s, 25%, pausa ao perder foco, estado na sessão, escolha determinística por elemento, evento `audio_play`), cinco loops de exemplo em `public/audio/` e página de teste `/dev/audio` (só em desenvolvimento).
8. Analytics: camada de dados com os 9 eventos, GTM só após consentimento (Consent Mode com tudo negado antes), banner de consentimento.
9. Home `pre` (5.30): hero em foto, o nome em cena escura com o símbolo, os andares em quatro painéis, empresas em cena com card emoldurado, formulário "Avisamos você primeiro" (server action, Zod, honeypot, limite por IP, Resend, redireciona para `/obrigado`), três perguntas com FAQPage. JSON-LD: Hotel (openingDate), Organization, WebSite, FAQPage, BreadcrumbList.
10. Home `full` (5.1): hero em foto, três jeitos de chegar em cards emoldurados, o nome em cena escura, quatro painéis de andar, restaurante, eventos (só com `NEXT_PUBLIC_EVENTOS_AUTORIZADO=true`), Ji-Paraná em cena com mapa esquemático, histórias, chamada final em cena com card emoldurado. JSON-LD: Hotel (com Restaurant), Organization, WebSite, BreadcrumbList.
11. Mídias: 42 explorações no Higgsfield (`seedream_v4_5`, 1 crédito cada): 8 detalhes e 7 atmosferas selecionadas para a Home, registradas em `registro-higgsfield.md`.
12. QA: `scripts/check-copy.ts` (vetos), `scripts/screenshots.ts` (Playwright), `scripts/lighthouse.ts`, `scripts/qa.sh` (build, servidor, capturas e Lighthouse por fase).
13. Também: `sitemap.ts` (só a Home por enquanto), `robots.ts` (bloqueia `/q/` e `/obrigado`), 404 mínima com a copy da 5.29, `/obrigado`.

### Pendente ou aguardando decisão

| Item | Depende de | Onde |
|---|---|---|
| Aprovar as 15 imagens selecionadas, 8 detalhes e 7 atmosferas (ou trocar por uma alternativa da galeria) | Responsável | `registro-higgsfield.md` |
| Telefone oficial, e-mail, CEP, coordenadas, handles das redes, link da ficha do Google | Cliente (Parte 8) | `lib/site.ts` |
| ID do GTM, chave e destino do Resend, URL do motor de reservas | Agência e cliente | `.env.example` |
| Autorização de Eventos | Cliente | `NEXT_PUBLIC_EVENTOS_AUTORIZADO` |
| Licença web da Guton (senão, manter Cormorant) e aprovação dos 5 acentos por andar | Design e cliente | `app/layout.tsx`, `lib/tokens.ts` |
| Copy fora do documento mestre, marcada com `TODO(copy)`: banner de consentimento, `/obrigado`, apoio do formulário | Responsável | `components/analytics/ConsentBanner.tsx`, `app/obrigado/page.tsx`, `components/forms/LeadForm.tsx` |
| Loops reais de som ambiente | Etapa 3 | `registro-audio.md` |
| Páginas ligadas pela Home (`/universo`, `/historias`, `/o-kaluana`, legais etc.) | Etapas 2 a 5 | Links caem na 404 até lá |
| Versão final da 404 (símbolo em loop, busca) | Etapa 5 | `app/not-found.tsx` |
| Vídeo BG - KALUAMÃ: saiu do hero na direção visual nova; o pipeline continua gerando os arquivos (25 KB) caso volte a ser usado | Responsável | `public/media/video/` |

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

**Status:** aguardando "aprovado" do responsável da Premium.
**Branch:** `etapa-2`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 28 (teto: 90). Saldo: 8.745,6. Acumulado do projeto: 70.

### Critérios de aceite

| Critério | Status | Evidência |
|---|---|---|
| Build limpo (`npm run build`) | Feito | Sem erros nem avisos; `typecheck` e `lint` limpos |
| Lighthouse acima de 90 nos quatro eixos em mobile no hub e em uma categoria | Feito | Ver tabela abaixo |
| Hub e as sete páginas de categoria (5.3 a 5.10) com a copy do documento mestre | Feito | `app/acomodacoes/` |
| UHs importadas do YAML e cada nome ligado à página do Universo | Feito | `lib/acomodacoes.ts` cruza `paginas.json` com `qr-map.json`; 70 UHs, 0 sem categoria |
| Filtro por perfil (chegou cansado, precisa produzir, precisa parar) | Feito | `FiltroPerfil.tsx`; sem JavaScript mostra tudo |
| Schema HotelRoom e Product com Offer para o motor de reservas por variável de ambiente | Feito | `lib/schema.ts`; `NEXT_PUBLIC_RESERVAS_URL` |
| Mídias só com detalhes abstratos, 4 variações por categoria em 1 crédito | Feito | 28 gerações, 26 aproveitadas, 2 descartadas; `registro-higgsfield.md` |
| Nenhuma animação automática além das previstas pelo mestre | Feito | Só a deriva de luz de 12 s do Terraço Aberto (5.8), desktop e sem movimento reduzido |
| `prefers-reduced-motion` respeitado; Superior Acessível sem movimento por padrão | Feito | `data-variante="superior-acessivel"` em `globals.css` |
| Nenhuma frase vetada | Feito | `npm run check:copy` sem ocorrências |
| Nenhum campo ⟨entre colchetes⟩ nem número de UH visível em produção | Feito | `FichaList` (decisão 28); `NomesUh` mostra só nomes |
| Tokens sem valores soltos | Feito | Novos tokens `filter`, `lightDrift`, `slowFade`, `parallaxTerraco`, `hoverDarkenPhoto` |
| Docs atualizados | Feito | `etapas.md`, `decisoes.md` (26 a 38), `registro-higgsfield.md` |
| Capturas desktop e mobile em `docs/screenshots/etapa-2/` | Feito | 16 capturas (hub e sete categorias, fase `full`) |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado, fase `full`)

| Página | Desempenho | Acessibilidade | Boas práticas | SEO | LCP | CLS |
|---|---|---|---|---|---|---|
| `/acomodacoes`, mobile | 92 | 100 | 100 | 100 | 3,3 s | 0 |
| `/acomodacoes`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |
| `/acomodacoes/superior-familia`, mobile | 93 | 100 | 100 | 100 | 3,1 s | 0 |
| `/acomodacoes/superior-familia`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |
| `/acomodacoes/suite-presidencial-onca-pintada`, mobile | 94 | 100 | 100 | 100 | 3,0 s | 0 |
| `/acomodacoes/suite-presidencial-onca-pintada`, desktop | 99 | 100 | 100 | 100 | 0,7 s | 0 |
| Home `pre`, mobile (regressão após a decisão 39) | 92 | 100 | 100 | 100 | 3,3 s | 0 |

Como na etapa 1, o LCP simulado no mobile é a abertura de sessão da primeira visita, inflado pelo simulador (decisões 20 e 24). Zero avisos no console nas 16 capturas. Relatórios HTML em `docs/lighthouse/etapa-2/`.

### O que foi feito

1. `lib/acomodacoes.ts`: as sete categorias a partir de `content/paginas.json` (código, capacidade, UHs), cada UH cruzada com `content/qr-map.json` (nome, andar, URL do Universo) e agrupada por andar; tags de perfil (decisão 26) em `lib/perfis.ts`.
2. Hub `/acomodacoes` (5.3): hero em foto, migalhas, filtro com três chips e grade de cards grandes (véu sálvia no hover com nome e frase de perfil; faixa com snap no celular), "Sete categorias. Muitas histórias." com a resposta direta, regras da casa, chamada final. JSON-LD: CollectionPage com ItemList de HotelRoom, BreadcrumbList.
3. Sete páginas `/acomodacoes/[slug]` (5.4 a 5.10), estáticas: hero com a foto de detalhe, migalhas, faixa de detalhes arrastável, ficha item a item com a resposta direta, seções de texto com foto (Perfis, Como chegar ao quarto, Ocasiões), os nomes dos quartos por andar com link para o Universo, chamada final. JSON-LD: HotelRoom (Suite nas suítes), Product com Offer (PreOrder, sem preço), BreadcrumbList.
4. Variações de movimento do mestre (decisão 32): Acessível sem movimento e com foco maior; Família com Terraço com parallax de 6%; Terraço Aberto com deriva de luz; Terraço Fechado com segunda foto em fade pela rolagem; Presidencial com nome gigante em fade de 1,2 s, pilha de cenas com sticky e durações no teto.
5. Botões Reservar com `reservar_click` e o código da categoria; "Hospedagem corporativa" e "Falar com o hotel" levam a `/contato`.
6. Fase `pre`: hub e categorias com `noindex` e fora do sitemap (Parte 3.5); fase `full`: no sitemap e no menu.
7. 28 explorações no Higgsfield (`seedream_v4_5`, 4:3, 1 crédito): hero provisório e faixa de detalhes por categoria; folhas de contato em `docs/higgsfield/etapa-2/`.
8. Scripts de QA com rotas e pasta por etapa; `build:media -- --grupo=`.

### Pendente ou aguardando decisão

| Item | Depende de | Onde |
|---|---|---|
| Escolher a variação final de cada categoria (hoje a primeira de cada folha de contato é o hero) | Responsável | `docs/higgsfield/etapa-2/`, `lib/acomodacoes.ts` (ordem da `galeria`) |
| Validar as tags de perfil por categoria | Cliente | decisão 26 |
| Metragem, camas, amenidades, largura de porta, banco de banho, serviços exclusivos da Presidencial | Cliente | campos ⟨pendentes⟩ nos YAML, ocultos em produção |
| Horários e políticas das regras da casa (validar com o Adriano) | Cliente | nota da 5.3 |
| Hipótese UH 403 = Apartamento Luxo Jacaré-Açu | Cliente | nota da 5.8 |
| A rede da variação 4 do Terraço pode ser lida como amenidade; confirmar se existe | Cliente | `registro-higgsfield.md`, item 15 |
| URL do motor de reservas | Cliente e agência | `NEXT_PUBLIC_RESERVAS_URL` |
| Fotos reais das categorias após a inauguração (substituem a faixa de detalhes) | Cliente | `media-src/manifest.json` |
| Páginas ligadas (`/universo/...`, `/contato`, `/reservas`) | Etapas 3 a 5 | Links sem prefetch até lá |
