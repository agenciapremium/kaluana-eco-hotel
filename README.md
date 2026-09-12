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

`npm run build` roda `prebuild` (tokens, conteúdo e mídia) e depois o build do Next.

## Fases

`NEXT_PUBLIC_SITE_PHASE=pre` publica a página de pré-inauguração. `full` publica o site completo.

## QA

```bash
npm run check:copy                 # vetos de linguagem no conteúdo e no código
PORT=3100 bash scripts/qa.sh pre etapa-1 / /   # build, servidor, capturas (Playwright) e Lighthouse
npm run build:media                # imagens, vídeo do hero e abertura (local, precisa de ffmpeg)
npm run build:audio                # loops de exemplo do som ambiente (local)
```

Por etapa e rota: `PORT=3100 bash scripts/qa.sh full etapa-2 "/acomodacoes,/acomodacoes/duplo-king" "/acomodacoes"` (fase, pasta da etapa, rotas das capturas, rotas do Lighthouse). Relatórios em `docs/lighthouse/<etapa>/` e capturas em `docs/screenshots/<etapa>/`.

## Deploy

Projeto `kaluana-eco-hotel` no time Agencia Premium da Vercel, conectado a este repositório. A pasta local já está ligada (`.vercel/`, fora do git). Variáveis de ambiente em `.env.example`; as pendentes se definem com `vercel env add`. Produção (domínio kaluanaecohotel.com.br) só após a etapa 6.

## Documentação

- `docs/etapas.md`: checklist de cada etapa
- `docs/decisoes.md`: decisões técnicas e dependências
- `docs/registro-higgsfield.md`: toda geração de mídia
- `docs/registro-audio.md`: origem e licença de cada loop de som
