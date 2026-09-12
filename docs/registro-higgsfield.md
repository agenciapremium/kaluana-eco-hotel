# Registro Higgsfield

Toda geração de mídia na conta da agência (plano Ultra), conforme a seção 7 do CLAUDE.md. Custo confirmado com `get_cost` antes da leva. Saídas selecionadas ficam em `media-src/higgsfield/` (originais PNG convertidos para JPEG q92, ver decisões) e passam pelo pipeline como qualquer imagem. As demais continuam na galeria da conta pelos IDs abaixo.

Regras aplicadas em todos os prompts: sem pessoas identificáveis (sem rostos), sem texto, sem logotipos, luz natural, paleta terrosa com verde-oliva, sem saturação exagerada. Nenhum ambiente do hotel (quarto, lobby, fachada, restaurante), só detalhes.

## Saldo

| Data | Saldo antes | Gasto | Saldo depois |
|---|---|---|---|
| 12/09/2026 | 8.815,6 | 24 | 8.791,6 |

## Etapa 1: detalhes da Home

**Preflight:** 12/09/2026, `seedream_v4_5`, 4:3, basic, `get_cost: true` → 1 crédito por imagem.
**Leva:** 24 gerações em duas remessas (`generate_image_batch`), 8 assuntos × 3 variações, 1 crédito cada, `use_unlim: false`. Total: 24 créditos.

Status: **selecionada** (na Home, aguardando aprovação do responsável), **alternativa** (explorada, disponível na galeria), **descartada** (motivo indicado).

| # | Assunto | Modelo e parâmetros | Prompt (resumo) | Créditos | Job | Arquivo | Status |
|---|---|---|---|---|---|---|---|
| 0 | Mãos no balcão | seedream_v4_5, 4:3, basic | Duas mãos sobre balcão de madeira escura, uma com chave, luz lateral de janela, verde-oliva ao fundo | 1 | f507fe3b-951b-4eef-9ddc-5b41b5343302 | `media-src/higgsfield/maos-no-balcao.jpg` | selecionada |
| 1 | Mãos no balcão | seedream_v4_5, 4:3, basic | Vista de cima, mão entregando papel dobrado sobre balcão | 1 | 875f215b-739e-4ca2-94d7-990c6aefd2d8 | galeria | alternativa |
| 2 | Mãos no balcão | seedream_v4_5, 4:3, basic | Mãos na borda do balcão, samambaia, contraluz | 1 | c03838e4-950d-4e43-ac77-f534a1b6d9e4 | galeria | alternativa |
| 3 | Mesa com café | seedream_v4_5, 4:3, basic | Mesa de madeira, notebook fechado, caneca verde-oliva, bloco e caneta, luz de manhã | 1 | 58b7c6f0-69c6-45b7-bd08-e12322138fb0 | `media-src/higgsfield/mesa-com-cafe.jpg` | selecionada |
| 4 | Mesa com café | seedream_v4_5, 4:3, basic | Xícara com vapor ao lado de caderno aberto, janela com folhagem | 1 | c17e6455-0970-4876-aeff-bfe2f1a96dc2 | galeria | alternativa |
| 5 | Mesa com café | seedream_v4_5, 4:3, basic | Vista de cima, canto de mesa com café, óculos e guardanapo de linho | 1 | a5e22e9b-1398-4666-86e7-490266b3193f | galeria | alternativa |
| 6 | Cadeira na varanda | seedream_v4_5, 4:3, basic | Poltrona de madeira com almofada de linho, folhagem tropical desfocada, fim de tarde | 1 | 94bdd0be-f8a2-4962-b0b9-67f3a2ec18c2 | `media-src/higgsfield/cadeira-na-varanda.jpg` | selecionada |
| 7 | Cadeira na varanda | seedream_v4_5, 4:3, basic | Encosto e braço de cadeira ripada com manta de linho, luz entre folhas | 1 | 7e0d318c-d9f6-4010-b0cb-7f351cdc2693 | galeria | alternativa |
| 8 | Cadeira na varanda | seedream_v4_5, 4:3, basic | Cadeira e mesinha com copo d'água em varanda com guarda-corpo | 1 | 411fde8a-ab3a-4f48-959b-3fafce5b6590 | galeria | descartada: guarda-corpo lê como ambiente |
| 9 | Textura de madeira | seedream_v4_5, 16:9, basic | Macro de tábuas de madeira tropical avermelhada, luz rasante | 1 | 37caba64-bd1e-410a-84fa-c7bd1de733fb | galeria | alternativa |
| 10 | Textura de madeira | seedream_v4_5, 16:9, basic | Tábuas serradas empilhadas, topo e face | 1 | eb19cee3-6050-4e83-9bca-552b0554e259 | galeria | alternativa |
| 11 | Textura de madeira | seedream_v4_5, 16:9, basic | Superfície de madeira escura polida com feixe de luz diagonal | 1 | add3783a-4d52-49b6-afc8-e9580105b798 | `media-src/higgsfield/textura-madeira.jpg` | selecionada (reserva, sem uso na Home) |
| 12 | Textura de terra | seedream_v4_5, 21:9, basic | Terra vermelha molhada após chuva, luz dourada rasante | 1 | 33d8891a-54d6-4c75-ac0f-8bd688b9a6cb | galeria | descartada: marca de pneu |
| 13 | Textura de terra | seedream_v4_5, 21:9, basic | Laterita seca rachada vista de cima com folhas secas | 1 | 23b1e7e2-bd4c-45a2-b5fe-98565a039b62 | `media-src/higgsfield/textura-terra.jpg` | selecionada |
| 14 | Textura de terra | seedream_v4_5, 21:9, basic | Terra escura com raízes e broto verde | 1 | ee6519ad-e244-4628-8bfb-1547f2fd2160 | galeria | descartada: broto é clichê eco |
| 15 | Luz de janela | seedream_v4_5, 3:2, basic | Linho bege com dobras e faixas de luz de janela | 1 | 0c47df97-0865-439d-a76f-1ff4f8d39e95 | `media-src/higgsfield/luz-de-janela.jpg` | selecionada (reserva, sem uso na Home) |
| 16 | Luz de janela | seedream_v4_5, 3:2, basic | Borda de lençol dobrado sobre manta, cortina | 1 | 17d790b2-1478-4732-a2ff-7f380a0a497c | galeria | descartada: mostra cama, lê como quarto |
| 17 | Luz de janela | seedream_v4_5, 3:2, basic | Sol através de cortina de linho | 1 | 18a4b44c-416d-4c94-b787-f151529267e4 | galeria | alternativa |
| 18 | Prato de peixe | seedream_v4_5, 4:3, basic | Peixe grelhado em prato de cerâmica, farofa, vinagrete e limão, mesa de madeira | 1 | b0d61979-6122-4e52-b036-2908a35341ac | `media-src/higgsfield/prato-de-peixe.jpg` | selecionada |
| 19 | Prato de peixe | seedream_v4_5, 4:3, basic | Mesa posta vista de cima: peixe, farofa, vinagrete, copo, linho | 1 | 9018a55e-a92d-41c2-b983-c553978a211a | galeria | alternativa |
| 20 | Prato de peixe | seedream_v4_5, 4:3, basic | Garfo com lasca de peixe, folhas ao fundo | 1 | 35f64954-085b-441e-ac76-895ce5f9dc42 | galeria | alternativa |
| 21 | Mãos na obra | seedream_v4_5, 4:3, basic | Mãos com luvas segurando tábua, terra vermelha ao fundo | 1 | ae4dd8cb-6d4f-429d-8dea-a3155512c7e8 | galeria | descartada: madeira tratada esverdeada |
| 22 | Mãos na obra | seedream_v4_5, 4:3, basic | Mão com trena sobre viga, serragem no solo vermelho | 1 | ae85d8ba-c065-4c9c-ae2b-c040998537c2 | galeria | descartada: números da trena são texto na imagem |
| 23 | Mãos na obra | seedream_v4_5, 4:3, basic | Mãos com punhado de terra vermelha, folhas de palmeira ao fundo | 1 | 8505c0ef-3015-4f22-b239-112894fcfa79 | `media-src/higgsfield/maos-na-obra.jpg` | selecionada |

Prompts completos (em inglês, como enviados) estão no histórico da conta por job. Estilo comum a todos: "photorealistic, natural daylight, warm earthy palette with olive green accents, muted matte tones, no faces, no text, no logos".

## Não gerado nesta etapa

- Loop novo de vídeo para o hero: o `BG - KALUAMÃ.mp4` foi mantido (decisão do responsável no plano). Custo previsto se for pedido: 2 testes de 5 s no `cinematic_studio_video_v2` (10 créditos) ou 1 loop de 10 s em 1080p no `seedance_2_5` (90 créditos).
