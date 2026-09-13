# Etapas

Checklist de cada etapa, com o que foi feito, o que ficou pendente e os créditos do Higgsfield gastos. Nenhuma etapa avança sem "aprovado" do responsável da Premium.

## Etapa 1: fundação e Home

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`.
**Branch:** `etapa-1`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 42 (teto: 250). Saldo: 8.773,6.
**Revisão de 12/09/2026:** direção visual refeita a pedido do responsável (cenas em tela cheia, referência resortkaskady.com). Ver `decisoes.md`, itens 21 a 24.

### Critérios de aceite

| Critério                                                                       | Status | Evidência                                                                          |
| ------------------------------------------------------------------------------ | ------ | ---------------------------------------------------------------------------------- |
| Build limpo (`npm run build`)                                                  | Feito  | Sem erros nem avisos nas duas fases                                                |
| Lighthouse acima de 90 nos quatro eixos na Home em mobile                      | Feito  | Ver tabela abaixo                                                                  |
| Nenhuma animação automática além do vídeo de fundo                             | Feito  | Entradas só por interseção ou hover; abertura de sessão toca uma vez por sessão    |
| Home funciona sem JavaScript no essencial (texto, links, formulário)           | Feito  | Movimento ligado por `html.js`; formulário faz POST e redireciona para `/obrigado` |
| `prefers-reduced-motion` respeitado                                            | Feito  | Tudo vira fade de 150 ms; vídeo do hero vira imagem; abertura não toca             |
| Nenhuma frase vetada                                                           | Feito  | `npm run check:copy` sem ocorrências                                               |
| Nenhum campo ⟨entre colchetes⟩ visível em produção                             | Feito  | `Placeholder` oculta em produção; a Home não usa campos pendentes                  |
| Tokens sem valores soltos                                                      | Feito  | Cores, durações e curvas vêm de `lib/tokens.ts` e `app/tokens.css`                 |
| `docs/etapas.md`, `decisoes.md`, `registro-higgsfield.md`, `registro-audio.md` | Feito  | Esta pasta                                                                         |
| Capturas desktop e mobile em `docs/screenshots/etapa-1/`                       | Feito  | 4 capturas (pre e full)                                                            |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado)

| Página               | Desempenho | Acessibilidade | Boas práticas | SEO | LCP   | CLS |
| -------------------- | ---------- | -------------- | ------------- | --- | ----- | --- |
| Home `pre`, mobile   | 92         | 100            | 100           | 100 | 3,3 s | 0   |
| Home `pre`, desktop  | 99         | 100            | 100           | 100 | 0,7 s | 0   |
| Home `full`, mobile  | 93         | 100            | 100           | 100 | 3,1 s | 0   |
| Home `full`, desktop | 99         | 100            | 100           | 100 | 0,7 s | 0   |

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

| Item                                                                                                                            | Depende de        | Onde                                                                                               |
| ------------------------------------------------------------------------------------------------------------------------------- | ----------------- | -------------------------------------------------------------------------------------------------- |
| Aprovar as 15 imagens selecionadas, 8 detalhes e 7 atmosferas (ou trocar por uma alternativa da galeria)                        | Responsável       | `registro-higgsfield.md`                                                                           |
| Telefone oficial, e-mail, CEP, coordenadas, handles das redes, link da ficha do Google                                          | Cliente (Parte 8) | `lib/site.ts`                                                                                      |
| ID do GTM, chave e destino do Resend, URL do motor de reservas                                                                  | Agência e cliente | `.env.example`                                                                                     |
| Autorização de Eventos                                                                                                          | Cliente           | `NEXT_PUBLIC_EVENTOS_AUTORIZADO`                                                                   |
| Licença web da Guton (senão, manter Cormorant) e aprovação dos 5 acentos por andar                                              | Design e cliente  | `app/layout.tsx`, `lib/tokens.ts`                                                                  |
| Copy fora do documento mestre, marcada com `TODO(copy)`: banner de consentimento, `/obrigado`, apoio do formulário              | Responsável       | `components/analytics/ConsentBanner.tsx`, `app/obrigado/page.tsx`, `components/forms/LeadForm.tsx` |
| Loops reais de som ambiente                                                                                                     | Etapa 3           | `registro-audio.md`                                                                                |
| Páginas ligadas pela Home (`/universo`, `/historias`, `/o-kaluana`, legais etc.)                                                | Etapas 2 a 5      | Links caem na 404 até lá                                                                           |
| Versão final da 404 (símbolo em loop, busca)                                                                                    | Etapa 5           | `app/not-found.tsx`                                                                                |
| Vídeo BG - KALUAMÃ: saiu do hero na direção visual nova; o pipeline continua gerando os arquivos (25 KB) caso volte a ser usado | Responsável       | `public/media/video/`                                                                              |

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

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`. As variações de imagem seguem as provisórias (a primeira de cada folha de contato); a escolha final continua pendente e pode ser trocada sem refazer as páginas.
**Branch:** `etapa-2`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 28 (teto: 90). Saldo: 8.745,6. Acumulado do projeto: 70.

### Critérios de aceite

| Critério                                                                               | Status | Evidência                                                                              |
| -------------------------------------------------------------------------------------- | ------ | -------------------------------------------------------------------------------------- |
| Build limpo (`npm run build`)                                                          | Feito  | Sem erros nem avisos; `typecheck` e `lint` limpos                                      |
| Lighthouse acima de 90 nos quatro eixos em mobile no hub e em uma categoria            | Feito  | Ver tabela abaixo                                                                      |
| Hub e as sete páginas de categoria (5.3 a 5.10) com a copy do documento mestre         | Feito  | `app/acomodacoes/`                                                                     |
| UHs importadas do YAML e cada nome ligado à página do Universo                         | Feito  | `lib/acomodacoes.ts` cruza `paginas.json` com `qr-map.json`; 70 UHs, 0 sem categoria   |
| Filtro por perfil (chegou cansado, precisa produzir, precisa parar)                    | Feito  | `FiltroPerfil.tsx`; sem JavaScript mostra tudo                                         |
| Schema HotelRoom e Product com Offer para o motor de reservas por variável de ambiente | Feito  | `lib/schema.ts`; `NEXT_PUBLIC_RESERVAS_URL`                                            |
| Mídias só com detalhes abstratos, 4 variações por categoria em 1 crédito               | Feito  | 28 gerações, 26 aproveitadas, 2 descartadas; `registro-higgsfield.md`                  |
| Nenhuma animação automática além das previstas pelo mestre                             | Feito  | Só a deriva de luz de 12 s do Terraço Aberto (5.8), desktop e sem movimento reduzido   |
| `prefers-reduced-motion` respeitado; Superior Acessível sem movimento por padrão       | Feito  | `data-variante="superior-acessivel"` em `globals.css`                                  |
| Nenhuma frase vetada                                                                   | Feito  | `npm run check:copy` sem ocorrências                                                   |
| Nenhum campo ⟨entre colchetes⟩ nem número de UH visível em produção                    | Feito  | `FichaList` (decisão 28); `NomesUh` mostra só nomes                                    |
| Tokens sem valores soltos                                                              | Feito  | Novos tokens `filter`, `lightDrift`, `slowFade`, `parallaxTerraco`, `hoverDarkenPhoto` |
| Docs atualizados                                                                       | Feito  | `etapas.md`, `decisoes.md` (26 a 38), `registro-higgsfield.md`                         |
| Capturas desktop e mobile em `docs/screenshots/etapa-2/`                               | Feito  | 16 capturas (hub e sete categorias, fase `full`)                                       |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado, fase `full`)

| Página                                                  | Desempenho | Acessibilidade | Boas práticas | SEO | LCP   | CLS |
| ------------------------------------------------------- | ---------- | -------------- | ------------- | --- | ----- | --- |
| `/acomodacoes`, mobile                                  | 92         | 100            | 100           | 100 | 3,3 s | 0   |
| `/acomodacoes`, desktop                                 | 99         | 100            | 100           | 100 | 0,7 s | 0   |
| `/acomodacoes/superior-familia`, mobile                 | 93         | 100            | 100           | 100 | 3,1 s | 0   |
| `/acomodacoes/superior-familia`, desktop                | 99         | 100            | 100           | 100 | 0,7 s | 0   |
| `/acomodacoes/suite-presidencial-onca-pintada`, mobile  | 94         | 100            | 100           | 100 | 3,0 s | 0   |
| `/acomodacoes/suite-presidencial-onca-pintada`, desktop | 99         | 100            | 100           | 100 | 0,7 s | 0   |
| Home `pre`, mobile (regressão após a decisão 39)        | 92         | 100            | 100           | 100 | 3,3 s | 0   |

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

| Item                                                                                               | Depende de        | Onde                                                                  |
| -------------------------------------------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------- |
| Escolher a variação final de cada categoria (hoje a primeira de cada folha de contato é o hero)    | Responsável       | `docs/higgsfield/etapa-2/`, `lib/acomodacoes.ts` (ordem da `galeria`) |
| Validar as tags de perfil por categoria                                                            | Cliente           | decisão 26                                                            |
| Metragem, camas, amenidades, largura de porta, banco de banho, serviços exclusivos da Presidencial | Cliente           | campos ⟨pendentes⟩ nos YAML, ocultos em produção                      |
| Horários e políticas das regras da casa (validar com o Adriano)                                    | Cliente           | nota da 5.3                                                           |
| Hipótese UH 403 = Apartamento Luxo Jacaré-Açu                                                      | Cliente           | nota da 5.8                                                           |
| A rede da variação 4 do Terraço pode ser lida como amenidade; confirmar se existe                  | Cliente           | `registro-higgsfield.md`, item 15                                     |
| URL do motor de reservas                                                                           | Cliente e agência | `NEXT_PUBLIC_RESERVAS_URL`                                            |
| Fotos reais das categorias após a inauguração (substituem a faixa de detalhes)                     | Cliente           | `media-src/manifest.json`                                             |
| Páginas ligadas (`/universo/...`, `/contato`, `/reservas`)                                         | Etapas 3 a 5      | Links sem prefetch até lá                                             |

## Etapa 3: Universo Kaluanã

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`.
**Branch:** `etapa-3`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 43,75 (teto: 400). Saldo: 8.701,85. Acumulado do projeto: 113,75.

### Critérios de aceite

| Critério                                                   | Status | Evidência                                                                           |
| ---------------------------------------------------------- | ------ | ----------------------------------------------------------------------------------- |
| Build limpo (`npm run build`)                              | Feito  | 164 rotas geradas; `typecheck`, `lint` e `check:copy` limpos                        |
| Lighthouse acima de 90 nos quatro eixos em mobile          | Feito  | Hub, hub de andar e página de elemento; ver tabela                                  |
| Hub, cinco hubs de andar e as 70 páginas de elemento       | Feito  | `app/universo/`                                                                     |
| `/q/[uh]` responde 301 para a canônica com `?uh=`          | Feito  | Testado nas 70 UHs e numa UH inexistente                                            |
| Barra de hóspede ao abrir pelo QR                          | Feito  | Testada de ponta a ponta com Playwright; `qr_scan` dispara com a UH                 |
| Navegação anterior, próximo, andar e categoria             | Feito  | `NavAndar.tsx`                                                                      |
| FAQPage e Article em JSON-LD                               | Feito  | Article com `about` BodyOfWater nos rios, FAQPage e BreadcrumbList                  |
| Som ambiente com bancos por andar e escolha determinística | Feito  | 19 loops em 5 andares, mais 10 cantos reais de ave                                  |
| Fotos do inventário conforme a coluna de uso               | Feito  | 137 imagens no pipeline, 68 heroes e 69 de galeria                                  |
| Nenhuma contagem nem número de quarto na fase `pre`        | Feito  | `lib/contagem.ts`; conferido no HTML servido                                        |
| Nenhuma frase vetada                                       | Feito  | `npm run check:copy` sem ocorrências                                                |
| Capturas em `docs/screenshots/etapa-3/`                    | Feito  | 18 capturas, desktop e mobile                                                       |
| Docs atualizados                                           | Feito  | `etapas.md`, `decisoes.md` (41 a 54), `registro-higgsfield.md`, `registro-audio.md` |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado, fase `pre`)

| Página                                | Desempenho | Acessibilidade | Boas práticas | SEO | LCP   | CLS |
| ------------------------------------- | ---------- | -------------- | ------------- | --- | ----- | --- |
| `/universo`, mobile                   | 93         | 100            | 100           | 100 | 3,2 s | 0   |
| `/universo`, desktop                  | 100        | 100            | 100           | 100 | 0,7 s | 0   |
| `/universo/rios`, mobile              | 91         | 100            | 100           | 100 | 3,5 s | 0   |
| `/universo/rios`, desktop             | 100        | 100            | 100           | 100 | 0,7 s | 0   |
| `/universo/rios/rio-machado`, mobile  | 94         | 100            | 100           | 100 | 3,1 s | 0   |
| `/universo/rios/rio-machado`, desktop | 100        | 100            | 100           | 100 | 0,7 s | 0   |

Como nas etapas anteriores, o LCP simulado no mobile é inflado pelo simulador do Lighthouse (decisões 20 e 24). Zero erro de console nas 18 capturas. Relatórios em `docs/lighthouse/etapa-3/`.

### O que foi feito

1. **Hub do Universo (5.11):** a página é um elevador. Indicador que acompanha a rolagem, trilho lateral no desktop e faixa de abas no celular, cada andar em tela cheia com a sua cor e a sua atmosfera, e busca com autocomplete sobre os 70 nomes (e as UHs, na fase completa).
2. **Cinco hubs de andar (5.12 a 5.16),** cada um com o movimento que o mestre pede: Rios com o mapa esquemático da bacia que se desenha e destaca o card ao passar o mouse; Peixes com os cards flutuando 4 px em 6 s, dessincronizados, só no desktop; Árvores com filtro por uso e as fotos verticais subindo mais rápido que o texto; Aves com o bando de pontos cruzando o topo uma vez só em 2 s; Guardiões em três painéis de tela cheia com snap.
3. **As 70 páginas de elemento (Parte 6.0),** todas no mesmo modelo: hero em zoom out de 1,05 para 1,0, abertura, por que está no Kaluanã, história, curiosidades, ficha linha a linha, três perguntas em acordeão, navegação de andar e rodapé de autoria com a data. JSON-LD: Article (com ImageObject e `about` BodyOfWater nos rios), FAQPage e BreadcrumbList.
4. **Atalho do QR:** `/q/[uh]` responde 301 com `Location` relativo para a canônica mais `?uh=`, gerado das 70 UHs. UH desconhecida cai no hub.
5. **Barra de hóspede:** aparece só com `?uh=`, sem tirar a página do estático. Saudação com o nome do quarto, Wi-Fi e recepção, restaurante, check-out, a categoria da acomodação, o próximo quarto e o botão de som em destaque. Dispara `qr_scan` com a UH.
6. **Som:** 19 loops de 45 s distribuídos em 5 andares, um por cena da seção 8, e 10 cantos reais de ave do xeno-canto via Wikimedia Commons, todos em CC BY-SA e creditados. A escolha por elemento ficou pareja depois de espalhar o hash.
7. **Mídia:** 137 fotos do inventário processadas em AVIF e WebP, e 5 loops de fundo gerados no Higgsfield a partir das atmosferas da etapa 1, cada um abaixo de 700 KB.
8. **Fases:** o Universo entra no sitemap nas duas fases, porque é conteúdo da fase 0. Contagens e números de quarto só aparecem em `full`.

### Pendente ou aguardando decisão

| Item                                                                                                     | Depende de                              | Onde                                                                          |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------- | ----------------------------------------------------------------------------- |
| Licença de uso das 137 fotos do inventário (pendência 24 da Parte 8)                                     | Cliente                                 | Bloqueia o upscale dos 17 heroes abaixo de 1.000 px, que custaria 34 créditos |
| Foto licenciada de Filhote (piraíba) e Maracanã                                                          | Cliente                                 | As duas páginas ficam com o fundo do andar                                    |
| Fotos de espécie errada (pendência 22): Corvina, curió, tangará, colhereiro, uirapuru                    | Cliente                                 | Substituir os arquivos e rodar o pipeline                                     |
| Grafia dos nomes nas placas (pendência 20)                                                               | Cliente                                 | Muda slug e QR, então decidir antes de imprimir                               |
| Gravações de campo em Rondônia para o som ambiente                                                       | Premium                                 | Trocam os 19 loops sintetizados                                               |
| Cantos das 7 aves sem gravação compatível                                                                | Conta no xeno-canto ou gravação própria | `registro-audio.md`                                                           |
| Validar as tags de uso das árvores                                                                       | Cliente                                 | `lib/usos.ts`                                                                 |
| Lista de madeiras da obra, com documento de origem                                                       | Cliente                                 | A seção "No hotel" do 3º andar só entra com ela                               |
| Hipótese da correspondência quarto/UH (Parte 6.0)                                                        | Cliente                                 | Vale para os 70 QR Codes                                                      |
| Páginas ligadas que ainda não existem (`/restaurante`, `/contato`, `/perguntas-frequentes`, `/reservas`) | Etapas 4 e 5                            | Links sem prefetch até lá                                                     |

## Etapa 4: O Kaluanã, Restaurante, Eventos, Ji-Paraná e Histórias

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`.
**Branch:** `etapa-4`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 24 (teto: 120). Saldo: 8.677,85. Acumulado do projeto: 137,75.

### Critérios de aceite

| Critério                                              | Status | Evidência                                                                 |
| ----------------------------------------------------- | ------ | ------------------------------------------------------------------------- |
| Build limpo (`npm run build`)                         | Feito  | 172 rotas; `typecheck`, `lint` e `check:copy` limpos                      |
| Lighthouse acima de 90 em mobile nas páginas públicas | Feito  | Ver tabela; Eventos tem SEO 66 por ser `noindex`, de propósito            |
| O Kaluanã (5.2)                                       | Feito  | Sem a seção "Como construímos", que depende de fatos do cliente           |
| Restaurante (5.18) com Restaurant no JSON-LD          | Feito  | Sem horário nem cardápio no schema, que são campos pendentes              |
| Eventos (5.19) fora do menu, com `noindex`            | Feito  | Testado: `noindex, nofollow`, zero links no menu, aviso interno na página |
| Formulário de eventos com `lead_evento`               | Feito  | Testado de ponta a ponta: envia, redireciona e dispara o evento           |
| Ji-Paraná (5.20) com FAQPage e mapa estilizado        | Feito  | Quatro perguntas, mapa que acende o ponto do bloco em leitura             |
| Histórias (5.21) com listagem e filtro por assunto    | Feito  | Três posts de partida, chips filtrando sem recarregar                     |
| Modelo de post (5.22) com BlogPosting                 | Feito  | Barra de progresso, blocos tipados, três relacionados                     |
| Nenhum campo ⟨entre colchetes⟩ em produção            | Feito  | `check:copy` varre as 97 páginas do build; pegou e corrigiu um vazamento  |
| Nenhuma frase vetada                                  | Feito  | `npm run check:copy` sem ocorrências                                      |
| Capturas em `docs/screenshots/etapa-4/`               | Feito  | 12 capturas, desktop e mobile                                             |
| Docs atualizados                                      | Feito  | `etapas.md`, `decisoes.md` (55 a 65), `registro-higgsfield.md`            |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado, fase `full`)

| Página                                         | Desempenho | Acessibilidade | Boas práticas | SEO |
| ---------------------------------------------- | ---------- | -------------- | ------------- | --- |
| `/o-kaluana`, mobile / desktop                 | 92 / 99    | 100            | 100           | 100 |
| `/restaurante`, mobile / desktop               | 92 / 99    | 100            | 100           | 100 |
| `/ji-parana`, mobile / desktop                 | 93 / 99    | 100            | 100           | 100 |
| `/historias`, mobile / desktop                 | 94 / 99    | 100            | 100           | 100 |
| `/historias/por-que-kaluana`, mobile / desktop | 94 / 100   | 100            | 100           | 100 |
| `/eventos`, mobile / desktop                   | 95 / 99    | 100            | 100           | 66  |

O 66 de SEO em Eventos é o `noindex` pedido pelo documento mestre e confirmado por você. É o único critério reprovado na página (`is-crawlable`). Sai junto com a autorização do cliente.

### O que foi feito

1. **O Kaluanã:** leitura longa com o traço de progresso na lateral, o nome em cena escura, o lugar, os andares, a linha do tempo alimentada pelos posts e a chamada final. JSON-LD: AboutPage e Organization.
2. **Restaurante:** hero com o prato em close, cozinha, horários em acordeão por refeição e mesa para empresas. JSON-LD: Restaurant com endereço do hotel, cozinhas e reservas aceitas.
3. **Eventos:** planta esquemática dos espaços em SVG sem escala, formatos, hospedagem para grupos e pedido de proposta em três passos, com server action, Zod, honeypot e limite por IP. Fora do menu e com `noindex` até a autorização.
4. **Ji-Paraná:** guia com o mapa estilizado pregado ao lado do texto, acendendo o ponto de cada bloco, as fotos reais do rio Machado e as quatro perguntas com FAQPage. JSON-LD: TouristDestination e FAQPage.
5. **Histórias:** listagem em duas colunas com capa 4 por 5, a data deslizando no hover, chips de assunto filtrando sem recarregar, e o modelo de post com barra de progresso, blocos tipados, bloco final e três relacionados.
6. **Pipeline de posts:** `posts/*.yaml` validados por Zod viram `content/posts.json` no prebuild. A agência escreve post novo criando um arquivo.
7. **Correção que vale para o site inteiro:** campo pendente agora tira a frase inteira em produção, e o `check:copy` passou a varrer o HTML do build atrás de ⟨colchetes⟩.

### Pendente ou aguardando decisão

| Item                                                              | Depende de         | Onde                                                                 |
| ----------------------------------------------------------------- | ------------------ | -------------------------------------------------------------------- |
| Práticas reais de obra, com data, para a seção "Como construímos" | Cliente (Adriano)  | Sem elas a seção não é publicada (nota da 5.2)                       |
| Horários do restaurante, cardápio, chef e preços                  | Cliente            | Liberam o schema de horário e o destaque da refeição do momento      |
| Autorização para divulgar auditório e centro de convenções        | Cliente            | `NEXT_PUBLIC_EVENTOS_AUTORIZADO=true` tira o `noindex` e põe no menu |
| Capacidades, equipamentos, área e vagas dos espaços               | Cliente            | Liberam a calculadora de formato (5.19)                              |
| Tempo do hotel até o aeroporto e até a rodoviária                 | Cliente            | Duas frases do guia e uma resposta do FAQ saem do ar sem isso        |
| Parque, praça, museu ou memorial de referência em Ji-Paraná       | Cliente e analista | Seção "O que fazer"                                                  |
| Nomes e cargos publicáveis da equipe, e fotos com autorização     | Cliente            | Seção "Quem faz"                                                     |
| Revisar os três posts de partida e as datas                       | Responsável        | `posts/*.yaml`, campo `revisar`                                      |
| Fotos próprias do canteiro                                        | Premium            | Os assuntos madeira e telhas saíram errados no Higgsfield            |

## Etapa 5: conversão, contato, legais e auditoria

**Status:** aprovada pelo responsável da Premium em 12/09/2026 e integrada à `main`.
**Branch:** `etapa-5`.
**Período:** 12/09/2026.
**Créditos Higgsfield gastos:** 0. Saldo: 8.677,85. Acumulado do projeto: 137,75.

### Critérios de aceite

| Critério                                           | Status | Evidência                                                             |
| -------------------------------------------------- | ------ | --------------------------------------------------------------------- |
| Build limpo nas duas fases                         | Feito  | 179 rotas em `full`, 172 em `pre`; `typecheck` e `lint` limpos        |
| Lighthouse acima de 90 em mobile nas páginas novas | Feito  | Ver tabela; 100 em acessibilidade, boas práticas e SEO em todas       |
| Reservas com modo pré-reserva (5.23)               | Feito  | Formulário testado; `ReserveAction` entra sozinho quando houver motor |
| Contato (5.24) com NAP e mapa sob demanda          | Feito  | Mapa só carrega no clique e dispara `mapa_click`                      |
| Perguntas frequentes (5.25) com busca e FAQPage    | Feito  | Busca filtra de 11 para 1 no termo "estacionamento"                   |
| Trabalhe conosco (5.26) com envio de arquivo       | Feito  | PDF aceito, PNG recusado com mensagem, nada é gravado                 |
| Legais (5.27 e 5.28)                               | Feito  | Minutas da Premium, com aviso de validação jurídica                   |
| 404 (5.29) com status 404 de verdade               | Feito  | Testado: `/rota-que-nao-existe` devolve 404                           |
| `sitemap.ts`, `robots.ts` e `llms.txt`             | Feito  | 98 URLs no sitemap; `llms.txt` gerado dos dados                       |
| Auditoria de todos os JSON-LD                      | Feito  | `npm run check:schema`: 100 páginas, nenhum problema                  |
| Auditoria de titles e descriptions                 | Feito  | Nenhum title acima de 60; quatro descriptions corrigidas              |
| Nenhum campo ⟨entre colchetes⟩ em produção         | Feito  | `check:copy` nas 103 páginas do build                                 |
| Capturas em `docs/screenshots/etapa-5/`            | Feito  | 12 capturas, desktop e mobile                                         |
| Docs atualizados                                   | Feito  | `etapas.md`, `decisoes.md` (66 a 77)                                  |

### Lighthouse (12/09/2026, Lighthouse 13.4, throttling simulado, fase `full`)

| Página                                       | Desempenho | Acessibilidade | Boas práticas | SEO |
| -------------------------------------------- | ---------- | -------------- | ------------- | --- |
| `/reservas`, mobile / desktop                | 94 / 99    | 100            | 100           | 100 |
| `/contato`, mobile / desktop                 | 94 / 99    | 100            | 100           | 100 |
| `/perguntas-frequentes`, mobile / desktop    | 94 / 99    | 100            | 100           | 100 |
| `/trabalhe-conosco`, mobile / desktop        | 94 / 99    | 100            | 100           | 100 |
| `/politica-de-privacidade`, mobile / desktop | 96 / 100   | 100            | 100           | 100 |

### O que foi feito

1. **Reservas:** modo pré-reserva com nome, contato e datas previstas, mais os três blocos de corporativo, grupos e políticas. O widget e o `ReserveAction` entram sozinhos quando o motor for contratado.
2. **Contato:** canais em cards, endereço, formulário com assunto e mapa que só carrega no clique. Telefone e e-mail entram quando o cliente definir.
3. **Perguntas frequentes:** as catorze perguntas agrupadas em quatro temas com âncora, busca filtrando em tempo real e FAQPage. Respostas que dependem de campo pendente saem do ar; a de eventos volta com a autorização.
4. **Trabalhe conosco:** currículo em PDF ou DOCX até 5 MB, anexado no e-mail e não guardado.
5. **Legais:** minutas de privacidade e termos escritas a partir dos fatos do projeto, com aviso de validação jurídica.
6. **404 definitiva:** símbolo em traço, atalhos e a busca sobre os setenta nomes do Universo.
7. **`llms.txt`, `robots.txt` e `sitemap.xml`:** o primeiro gerado dos dados; o robots libera robôs de IA, com interruptor para barrar treinamento; o sitemap cobre as 98 URLs indexáveis da fase completa.
8. **`check:schema`:** auditoria de H1, title, description, canônica, JSON-LD e referências `@id` sobre o HTML do build. Entrou no `qa.sh` e passa a rodar em todas as etapas.

### Pendente ou aguardando decisão

| Item                                                                 | Depende de            | Onde                                                            |
| -------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------- |
| Validação jurídica das duas minutas legais                           | Cliente               | `lib/legais.ts`; o aviso na página sai junto                    |
| Telefone oficial, WhatsApp, e-mail, CEP e coordenadas                | Cliente (prazo 31/10) | Liberam os canais do Contato e os campos do schema              |
| Handles de Instagram, Facebook e LinkedIn, e link da ficha do Google | Cliente               | Seção Redes e o `sameAs` do schema                              |
| Prazo de cancelamento e meios de pagamento                           | Cliente               | Bloco Políticas em Reservas                                     |
| Política para animais de estimação                                   | Cliente               | Uma pergunta do FAQ fica fora até lá                            |
| Motor de reservas contratado                                         | Cliente e agência     | `NEXT_PUBLIC_RESERVAS_URL` troca o modo pré-reserva pelo widget |
| Decisão sobre bloquear GPTBot e CCBot                                | Cliente               | `NEXT_PUBLIC_BLOQUEAR_TREINO_IA`; o padrão libera               |
| Revisão das três descrições estendidas                               | Responsável           | `lib/seo.ts`                                                    |

## Etapa 6: QA final e preparação do deploy

**Status:** aprovada pelo responsável da Premium em 13/09/2026 e integrada à `main`. No ar desde 13/09/2026, 08:35, com os ajustes pedidos depois da primeira publicação.
**Branch:** `etapa-6`, integrada à `main`, que volta a ser a origem do deploy de produção.
**Período:** 12 e 13/09/2026.
**Produção:** `https://www.kaluanaecohotel.com.br` (deploy `nitr623o9`, fase `pre`). O domínio sem `www` redireciona para o `www`, ao contrário da canônica (ver abaixo).
**Créditos Higgsfield gastos:** 192, no upscale das 96 fotos do Universo com original abaixo de 1600 px, aprovado pelo responsável em 13/09/2026. Saldo: 8.485,85. Acumulado do projeto: 329,75.
**Pré-visualização:** `https://kaluana-eco-hotel-git-etapa-6-agencia-premium.vercel.app` (alias da branch; pede login no time Agencia Premium da Vercel).

### Critérios de aceite

| Critério                              | Status                                                            | Evidência                                                                                                                                                                                  |
| ------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Build limpo                           | Feito                                                             | `typecheck`, `lint`, `build` nas duas fases; `check:copy` e `check:schema` limpos                                                                                                          |
| Lighthouse em todas as rotas          | Feito                                                             | 400 medições (100 rotas, duas fases, celular e desktop), nenhuma abaixo de 90 nos quatro eixos; hubs de andar acima de 700 KB por causa do vídeo (ver abaixo); `docs/lighthouse/etapa-6/`  |
| Acessibilidade: contraste sobre foto  | Feito                                                             | 495 textos por fase em 77 páginas (Home, hub do Universo, 5 hubs de andar, 70 elementos), nenhum abaixo do mínimo (menor 4,72:1); `contraste-cenas-pre.json` e `contraste-cenas-full.json` |
| Acessibilidade: axe em todas as rotas | Feito                                                             | 213 medições em cada fase, nenhuma violação; `docs/qa/etapa-6/a11y-pre.json` e `a11y-full.json`                                                                                            |
| Acessibilidade: teclado               | Feito                                                             | 42 percursos em cada fase (751 paradas na `pre`, 1.568 na `full`) e 13 roteiros, todos aprovados, entre eles o som ao abrir a página                                                       |
| Acessibilidade: leitor de tela        | Automatizado (21 de 21 em cada fase); conferência humana pendente | árvores em `docs/qa/etapa-6/aria/`; roteiro em `docs/qa/etapa-6/leitor-de-tela.md`                                                                                                         |
| Redirecionamento dos 70 QR Codes      | Feito                                                             | 70/70 nas duas fases, mais os casos de borda; `docs/qa/etapa-6/qr-pre.json` e `qr-full.json`, locais e fora do git (listam as 70 UHs)                                                      |
| Formulários                           | Feito                                                             | 30/30 na fase `pre` e 21/21 na `full`, com e sem JavaScript, contra uma API de e-mail simulada; `formularios-pre.json` e `formularios-full.json`                                           |
| Texto contra os vetos                 | Feito                                                             | revisão de 103 páginas e de todo o conteúdo-fonte; achados corrigidos ou listados abaixo                                                                                                   |
| Documentação final                    | Feito                                                             | `deploy.md`, `decisoes.md` (78 a 117), este checklist, `qa/etapa-6/`                                                                                                                       |
| Deploy de produção                    | Feito, com pendências                                             | promovido em 13/09/2026 a pedido do responsável e conferido no ar; domínio com o `www` como principal e formulário real ainda por testar (ver abaixo)                                      |

### O que foi feito

1. **QA automatizado e repetível:** `qa:qr`, `qa:formularios`, `qa:a11y`, `lighthouse:lote` e `check:env` (decisão 78). Todos leem as rotas do build.
2. **Formulários:** a recusa da API de e-mail deixava o visitante na página de obrigado com o contato perdido; currículo acima de 1 MB dava erro 500; o pedido de proposta travava em silêncio; a segunda conversão da sessão não contava. Tudo corrigido e testado de ponta a ponta contra uma API de e-mail simulada (decisões 81 a 88).
3. **Vetos da pré-inauguração:** número de quarto nas 67 descrições do Universo, contagens nos rodapés dos hubs, auditório e centro de convenções no `llms.txt`, em Reservas, nos termos, na privacidade e na Home completa, avisos internos em produção, a frase de sustentabilidade da copaíba, e as páginas da fase 1 indexáveis na fase `pre` (decisões 89 a 94). O `check:copy` passou a conferir tudo isso no build.
4. **Acessibilidade:** contorno de foco bege sobre fundo escuro e sem recorte, cabeçalho que ficava bege sobre bege depois de navegar, menu do celular com fundo inerte, barra de hóspede por cima do cabeçalho, painéis que cobriam o botão focado, campos de data sem foco, trilho do elevador sobre seções claras, botão de som, contrastes dos mapas, número do quarto e barra de hóspede nas cores de Peixes, Árvores e Aves (decisões 95 a 104, 107 a 109).
5. **Texto sobre foto:** o axe não mede contraste sobre imagem. O `qa:contraste`, novo, achou 19 de 93 textos claros abaixo do mínimo. Primeiro veio um véu local atrás do texto; depois de ver o site no ar, o responsável pediu o filtro na seção inteira, a 50%. Medido nas 77 páginas com texto sobre foto, nenhum texto fica abaixo do mínimo (decisões 111, 112 e 115).
6. **Fotos do Universo:** teto de peso por largura no `build-media` (decisão 110); o pipeline passou a servir a largura do próprio original, e 69 fotos ganharam resolução; as 96 fotos com original abaixo de 1600 px passaram por upscale no Higgsfield e foram conferidas contra o original (192 créditos, decisão 116).
7. **Deploy:** `noindex` no endereço `*.vercel.app` de produção, `check:env` que para o build de produção sem as variáveis de e-mail, Node fixo em 24.x, guia completo em `docs/deploy.md` (decisões 105 e 106).
8. **Ajustes de 13/09/2026, pedidos pelo responsável com o site no ar:** cabeçalho que encolhia e ficava colado à esquerda, logo claro sobre a foto (decisão 114), som que começa ao abrir as páginas do Universo, com o botão para silenciar (decisão 117), além do filtro e das fotos acima.

### Produção: pendências (13/09/2026)

| Item                                                                                                                                                                                                                                                                                  | Quem              | Onde                                |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------- |
| **Tornar o repositório do GitHub privado.** Ele é público desde a etapa 1 e expõe o `qr-map.json` com as 70 UHs (veto 2), as fotos do inventário com licença pendente e a documentação interna                                                                                        | Premium           | GitHub, Settings, Danger Zone       |
| Remetente e destino dos formulários temporários em `kaluana@agpremium.com.br`: no Resend só `agpremium.com.br` está verificado. Para usar o domínio do hotel, verificar `kaluanaecohotel.com.br` no Resend, trocar `LEAD_FROM_EMAIL` e `LEAD_TO_EMAIL` e fazer redeploy (decisão 113) | Premium e cliente | `docs/deploy.md`, seção 4           |
| ID do GTM (`NEXT_PUBLIC_GTM_ID`)                                                                                                                                                                                                                                                      | Premium           | recomendado                         |
| Validação jurídica das minutas de privacidade e de termos                                                                                                                                                                                                                             | Cliente           | `lib/legais.ts`                     |
| Revisão dos três posts de partida e das datas                                                                                                                                                                                                                                         | Responsável       | `posts/*.yaml`                      |
| **Inverter o domínio principal.** Hoje `kaluanaecohotel.com.br` redireciona (308) para o `www`, mas a canônica, o sitemap e o `robots.txt` usam o domínio sem `www`. No painel: domínio sem `www` sem redirecionamento e `www` com 308 para ele                                       | Responsável       | `docs/deploy.md`, seção 5           |
| Conferência humana com leitor de tela                                                                                                                                                                                                                                                 | Premium           | `docs/qa/etapa-6/leitor-de-tela.md` |
| Enviar um formulário real em produção e conferir a chegada em `kaluana@agpremium.com.br`; cadastrar o domínio no Google Search Console e enviar o sitemap                                                                                                                             | Premium           | `docs/deploy.md`, seção 6           |

### Decisões que ficam com o cliente

| Item                                                                                                                                                                                                                                                                | Onde                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Troca feita na copaíba ("mostrar, na prática, que dá para usar sem destruir")                                                                                                                                                                                       | `scripts/ajustes-de-veto.ts`           |
| Menções genéricas a eventos no texto do mestre, sem auditório nem centro de convenções: Home pré-inauguração ("espaços para eventos"), O Kaluanã ("Para eventos e hospedagem corporativa"), Restaurante ("coffee break para eventos"), tangará ("salão de eventos") | mestre, 5.30, 5.2, 5.18 e Parte 6      |
| Contagens parciais que o mestre escreveu: "Três guardiões. Três suítes.", "Um dos dois apartamentos de luxo", "Há um em cada andar" (Acomodações, fora do índice na fase `pre`)                                                                                     | decisão 41                             |
| Planta esquemática dos espaços em Eventos, que o mestre pede na 5.19 e o veto 2 proíbe até a inauguração (a página está fora do menu e do índice)                                                                                                                   | `components/eventos/PlantaEspacos.tsx` |
| Tom: "a melhor promessa deste hotel" (uirapuru), "porque é nosso" (rio Jamari)                                                                                                                                                                                      | mestre, Parte 6                        |
| Nome completo "Kaluanã Eco Hotel" nas respostas diretas de AEO, fora do padrão "o Kaluanã" do corpo                                                                                                                                                                 | mestre, blocos de SEO                  |
| Palavra-chave "hotel sustentável rondônia" em O Kaluanã                                                                                                                                                                                                             | mestre, 5.2                            |
| Vídeos de fundo em loop sem botão de pausa (WCAG 2.2.2); hoje só param com movimento reduzido                                                                                                                                                                       | design                                 |
| Som que começa ao abrir a página: contraria as seções 8 e 10 do CLAUDE.md, que precisam ser atualizadas                                                                                                                                                             | `CLAUDE.md`, decisão 117               |
| Fotos do inventário com marca d'água (Rio Jamari, bodó secundário) e de lugar ou espécie a confirmar (Rio Machado secundária, curvina)                                                                                                                              | `docs/registro-higgsfield.md`, etapa 6 |
| Peso dos hubs de andar com o vídeo de fundo, de 684 KB (Guardiões) a 1,9 MB (Árvores): acima dos 700 KB se o limite da página do Universo valer também para os hubs; as 70 páginas de elemento estão dentro, e cada vídeo sozinho cabe em 700 KB (decisão 46)       | `docs/qa/etapa-6/README.md`, seção 5   |
| Número de quarto no dado da barra de hóspede e atalho `/q/` ativo na fase `pre`: necessários para testar as placas, mas permitem descobrir a correspondência número e nome                                                                                          | decisão 90                             |

### Pendências herdadas que continuam abertas

Telefone, WhatsApp, e-mail, CEP e coordenadas (prazo 31/10); redes sociais e ficha do Google; horários e cardápio do restaurante; motor de reservas; autorização de Eventos; licença das 137 fotos do inventário; fotos de espécie errada e as de filhote e maracanã; grafia dos nomes nas placas; gravações de campo do som ambiente; tags de perfil e de uso; práticas de obra para "Como construímos"; licença web da Guton. Detalhe nas etapas 1 a 5 acima.

### Copy marcada com TODO(copy)

`/obrigado`; banner de consentimento; "Seus dados ficam com o hotel."; "Sete categorias. Muitas histórias."; as variantes sem contagem de `lib/contagem.ts`; as tags de uso das árvores; as minutas legais; as três descrições estendidas de `lib/seo.ts`; os três posts; a troca da copaíba.
