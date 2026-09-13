# Kaluanã Eco Hotel · Site

Site do Kaluanã Eco Hotel, Ji-Paraná, Rondônia. Projeto Next.js (App Router, TypeScript) hospedado na Vercel.

As fontes de verdade (documento mestre, dados em YAML, fotos, logos) ficam em `../DOCS/`, fora deste repositório. As regras do projeto estão em `../CLAUDE.md`.

## Rodar

```bash
nvm use            # Node 24
npm install
cp .env.example .env.local   # preencher as variáveis
npm run dev        # http://localhost:3000
```

`npm run build` roda `prebuild` (variáveis de produção, tokens, conteúdo e posts) e depois o build do Next.

## Fases

`NEXT_PUBLIC_SITE_PHASE=pre` publica a página de pré-inauguração e o Universo; as páginas da fase 1 existem, mas ficam fora do índice. `full` publica o site completo.

## QA

```bash
npm run check:copy                 # vetos no conteúdo, no código e no build (fase, eventos, notas internas)
npm run check:schema               # H1, title, description, canônica e JSON-LD do build
PORT=3100 bash scripts/qa.sh pre etapa-1 / /   # build, servidor, capturas (Playwright) e Lighthouse
npm run build:media                # imagens, vídeo do hero e abertura (local, precisa de ffmpeg)
npm run build:audio                # loops de exemplo do som ambiente (local)
```

Por etapa e rota: `PORT=3100 bash scripts/qa.sh full etapa-2 "/acomodacoes,/acomodacoes/duplo-king" "/acomodacoes"` (fase, pasta da etapa, rotas das capturas, rotas do Lighthouse). Relatórios em `docs/lighthouse/<etapa>/` e capturas em `docs/screenshots/<etapa>/`.

QA completo da etapa 6, com um build de produção no ar (`npx next start -p 3100`):

```bash
npm run qa:qr -- --phase=pre --url=http://localhost:3100             # os 70 QR Codes
npm run qa:a11y -- --phase=pre --url=http://localhost:3100           # axe em todas as rotas, teclado, árvore de acessibilidade
npm run lighthouse:lote -- --phase=pre --url=http://localhost:3100   # Lighthouse em todas as rotas, mobile e desktop

# formulários: servidor apontado para a API de e-mail simulada que o próprio script sobe
RESEND_API_KEY=re_teste LEAD_TO_EMAIL=qa@kaluana.test RESEND_BASE_URL=http://127.0.0.1:3999 npx next start -p 3101
npm run qa:formularios -- --url=http://localhost:3101
```

Resultados em `docs/qa/etapa-6/` e `docs/lighthouse/etapa-6/`.

## Deploy

Projeto `kaluana-eco-hotel` no time Agencia Premium da Vercel, conectado a este repositório. A `main` publica em produção; as etapas ficam em `etapa-N`, que geram pré-visualizações. Variáveis, domínio, ida para produção e volta atrás estão em `docs/deploy.md`.

## Documentação

- `docs/etapas.md`: checklist de cada etapa
- `docs/decisoes.md`: decisões técnicas e dependências
- `docs/deploy.md`: Vercel, variáveis, domínio e ida para produção
- `docs/qa/etapa-6/`: resultados do QA final e roteiro de leitor de tela
- `docs/qr-codes.csv`: endereço de cada placa de quarto, gerado por `npm run qa:qr -- --csv` (fora do git: lista as 70 UHs)
- `docs/registro-higgsfield.md`: toda geração de mídia
- `docs/registro-audio.md`: origem e licença de cada loop de som
