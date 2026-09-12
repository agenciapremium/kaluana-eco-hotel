# Decisões técnicas

Registro das decisões que não estão no CLAUDE.md nem no documento mestre, com o motivo. Toda dependência nova entra aqui.

## Etapa 1

### Dependências

| Pacote | Uso | Motivo |
|---|---|---|
| `next` 16.3 | Framework | App Router, TypeScript, geração estática. Versão estável no início da etapa (12/09/2026). |
| `tailwindcss` 4 + `@tailwindcss/postcss` | Estilo | Tokens da marca em `@theme`, exigido pelo CLAUDE.md. |
| `motion` 13 | Movimento | Biblioteca pedida no CLAUDE.md. Usada na cortina de transição e no `useInView` das entradas por interseção. |
| `zod` 4 | Validação | Schemas dos YAML e dos formulários. |
| `yaml` 2 | Pipeline de conteúdo | Leitura dos arquivos de DOCS/SITE/dados. |
| `sharp` | Pipeline de imagens | WebP e AVIF em quatro larguras, posters, PNG da marca. |
| `resend` | Formulários | Envio de e-mail das server actions, conforme CLAUDE.md. |
| `tsx` (dev) | Scripts | Roda os scripts TypeScript de pipeline sem build. |
| `playwright` (dev) | QA | Capturas de tela desktop e mobile. |
| `lighthouse` (dev) | QA | Auditoria de desempenho, acessibilidade, boas práticas e SEO. |
| `prettier` + `prettier-plugin-tailwindcss` (dev) | Formatação | Padrão de código. |

### Arquitetura

1. **Conteúdo e mídia versionados.** `content/*.json`, `public/media/` e `public/audio/` são gerados localmente (precisam de `../DOCS` e do ffmpeg) e entram no git. Na Vercel não existem DOCS nem ffmpeg: `build-content` detecta a ausência de DOCS e usa os JSON versionados; `build-media` e `build-audio` só rodam localmente. O `prebuild` roda só tokens e conteúdo.
2. **Um arquivo de tokens.** `lib/tokens.ts` é a única fonte de cores, acentos, tipografia, espaçamento e movimento. `scripts/build-tokens.ts` gera `app/tokens.css` (o `@theme` do Tailwind) a partir dele. Componentes de movimento importam os mesmos valores do TS.
3. **Movimento em CSS, disparado por JavaScript.** As entradas por interseção, o título palavra a palavra e o traço do símbolo são CSS puro, ligados pela classe `html.js` que um script inline põe antes da primeira pintura. Sem JavaScript, nada fica invisível (critério de aceite). O `motion` entra onde há estado: cortina de transição e `useInView`.
4. **Abertura de sessão decidida antes da pintura.** O mesmo script inline decide `data-opening` no `html` (uma vez por sessão, nunca com movimento reduzido, nunca em `/universo` ou `/q/`). As fontes do vídeo só são anexadas quando a abertura toca, para não baixar 180 KB nas outras visitas. Formatos: WebM VP9 com alfa (Chrome, Firefox), HEVC com alfa (Safari) e MP4 H.264 sobre bege como último recurso.
5. **Imagens em `<picture>` estático, não em `next/image`.** O pipeline já gera AVIF e WebP em 640, 1024, 1600 e 1920 px. Servir esses arquivos direto evita reprocessar na borda da Vercel (custo e latência) e mantém as dimensões declaradas (sem deslocamento de layout). `next/image` continua disponível para importações estáticas.
6. **Faixas de andar com `grid-template-columns` animado.** A regra geral é animar só `opacity`, `transform` e `clip-path`. A expansão da faixa (20% para 40%) pedida no documento mestre não é possível só com transformações sem distorcer a foto; usa-se a transição de `grid-template-columns`, o mesmo mecanismo que o documento libera para acordeões (`grid-template-rows`). Só no desktop; no mobile são cards empilhados.
7. **Kicker em café com traço sálvia.** Verde sálvia sobre bege fica em 2,6:1, abaixo dos 4,5:1 exigidos. O kicker usa a cor do texto corrente e um traço curto em sálvia como acento, preservando a regra da Parte 2.7.
8. **Marrom da interface.** Os SVGs do logo horizontal usam #421C14; os demais, #552F22. Os componentes de marca (`components/brand/`) usam `currentColor`, e a interface usa só #552F22, como recomenda o documento mestre (1.7).
9. **Logo horizontal reconstruída.** `logomarca_horicontal.svg` tem "ECO HOTEL" como texto vivo (depende da fonte Candara instalada). O cabeçalho usa `simbolo.svg` + `logotipo.svg`, ambos com o texto em curvas.
10. **Página de formulário enviado (`/obrigado`).** O envio redireciona para uma página estática, o que funciona com e sem JavaScript e mantém a Home totalmente estática (sem `searchParams`). Ela fica com `noindex` e bloqueada no `robots.txt`, como a Parte 4.2 prevê para "páginas de formulário enviado". O evento `lead_pre_inauguracao` dispara nela, uma vez por sessão.
11. **Limite por IP em memória.** O anti-spam usa honeypot mais 5 envios por IP a cada 10 minutos, guardados em memória da instância. Na Vercel isso vale por instância; é suficiente para o volume esperado e não exige serviço externo.
12. **Prefetch só de rotas construídas.** `lib/routes.ts` lista as rotas existentes; `SiteLink` desliga o prefetch das demais para não gerar 404 no console enquanto as etapas seguintes não chegam.
13. **Vídeo do hero.** O `BG - KALUAMÃ.mp4` original é vertical (1080 x 1920) e tem 2,5 s. O pipeline recorta o centro em 16:9, escala para 1280 x 720 e faz loop ida e volta até 14,8 s. Como o conteúdo é quase branco, o MP4 fica em 25 KB e o WebM em 22 KB. Decisão do responsável: manter na etapa 1; um loop novo no Higgsfield fica como opção.
14. **FAQPage na pré-inauguração.** O bloco de SEO da 5.30 pede FAQPage com 3 perguntas, mas a copy da página não traz perguntas. Usam-se três da página Perguntas frequentes (5.25) que não têm campos pendentes: onde fica, quando abre e o que significa Kaluanã. Elas ficam visíveis na página, como a regra do schema exige.
15. **Copy fora do documento mestre.** Marcada com `TODO(copy)` no código: banner de consentimento, página `/obrigado`, texto de apoio do formulário ("Seus dados ficam com o hotel."). Escritas no padrão do brandbook, a revisar.
16. **Áudio com placeholders sintetizados.** Ver `registro-audio.md`. Sem licença de terceiros na etapa 1.
17. **Página de teste `/dev/audio`.** Só existe em desenvolvimento (retorna 404 em produção). Serve para ouvir o `AmbientAudio` antes de o Universo existir.
