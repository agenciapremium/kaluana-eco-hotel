# Registro Higgsfield

Toda geração de mídia na conta da agência (plano Ultra), conforme a seção 7 do CLAUDE.md. Custo confirmado com `get_cost` antes da leva. Saídas selecionadas ficam em `media-src/higgsfield/` (originais PNG convertidos para JPEG q92, ver decisões) e passam pelo pipeline como qualquer imagem. As demais continuam na galeria da conta pelos IDs abaixo.

Regras aplicadas em todos os prompts: sem pessoas identificáveis (sem rostos), sem texto, sem logotipos, luz natural, paleta terrosa com verde-oliva, sem saturação exagerada. Nenhum ambiente do hotel (quarto, lobby, fachada, restaurante), só detalhes.

## Saldo

| Data | Saldo antes | Gasto | Saldo depois |
|---|---|---|---|
| 12/09/2026 | 8.815,6 | 24 | 8.791,6 |
| 12/09/2026 | 8.791,6 | 18 | 8.773,6 |
| 12/09/2026 | 8.773,6 | 28 | 8.745,6 |

## Etapa 1: detalhes da Home

**Preflight:** 12/09/2026, `seedream_v4_5`, 4:3, basic, `get_cost: true` → 1 crédito por imagem.
**Leva:** 24 gerações em duas remessas (`generate_image_batch`), 8 assuntos × 3 variações, 1 crédito cada, `use_unlim: false`. Total: 24 créditos. Total da etapa com a segunda leva abaixo: 42 créditos.

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

## Etapa 1, segunda leva: atmosferas para as cenas em tela cheia

Motivo: a nova direção visual (cenas em tela cheia, ver `decisoes.md`, item 21) pede fotos de fundo. A licença das fotos do inventário não está confirmada (Parte 8.3, item 24), então os fundos da Home são atmosferas geradas, sem espécie identificável (regra 6) e sem ambiente do hotel (regra 7). As fotos do inventário aparecem só como cards emoldurados, menores, nos painéis de andar.

**Preflight:** 12/09/2026, `seedream_v4_5`, 16:9, basic, `get_cost: true` → 1 crédito por imagem.
**Leva:** 18 gerações em duas remessas, 6 assuntos × 3 variações, 1 crédito cada, `use_unlim: false`. Total: 18 créditos. Saídas em 2560 x 1440.

| # | Assunto | Prompt (resumo) | Job | Arquivo | Status |
|---|---|---|---|---|---|
| 24 | Rio ao amanhecer | Rio amazônico calmo ao amanhecer, névoa baixa, margens em silhueta, luz quente | 89bca03d-aa21-4bc8-8537-84a9e2a00ccf | `media-src/higgsfield/rio-amanhecer.jpg` | selecionada (hero) |
| 25 | Rio ao amanhecer | Rio largo visto do barranco na hora dourada, bancos de areia, palmeiras | dc9c98a8-274d-472d-b653-65693bbd14eb | galeria | alternativa: muito cartão-postal |
| 26 | Rio ao amanhecer | Curva de rio dentro da mata, água parada, névoa fina, luz difusa | d1479865-fb85-438b-9fa5-bdfcb34da6a2 | `media-src/higgsfield/rio-mata.jpg` | selecionada (painel dos rios) |
| 27 | Água corrente | Água escura de rio correndo sobre pedras lisas | df13e08e-0391-4db2-abfc-baaff79b103d | galeria | alternativa |
| 28 | Água corrente | Raios de luz em água escura, partículas, raízes submersas | e397b1cb-e65c-4aeb-8f1f-b67571db79dc | `media-src/higgsfield/agua-corrente.jpg` | selecionada (painel dos peixes) |
| 29 | Água corrente | Superfície do rio ao entardecer com ondas concêntricas | 0cc88316-56d1-4dcd-83a6-5bc5bcde1a64 | galeria | alternativa |
| 30 | Copa da mata | Copa vista de baixo, troncos convergindo, luz entre as folhas | 59757619-beab-4b03-8982-9d1edfed0c32 | `media-src/higgsfield/copa-mata.jpg` | selecionada (painel das árvores) |
| 31 | Copa da mata | Sub-bosque com tronco de sapopemas, samambaias e névoa | fc47fd12-6e6e-49a5-8f1d-c4bf9d242c97 | galeria | alternativa |
| 32 | Copa da mata | Copa vista de cima ao amanhecer, névoa entre as árvores | 4ef3a799-68e9-491c-8567-618d0ad58a17 | galeria | alternativa |
| 33 | Céu de entardecer | Céu de entardecer sobre a linha escura da mata, sem aves | 34d0622c-7de0-493d-8b10-e966ca30276e | `media-src/higgsfield/ceu-entardecer.jpg` | selecionada (painel das aves) |
| 34 | Céu de entardecer | Névoa sobre a borda da mata com uma árvore emergente | 07ead826-2a1c-4ded-963e-544e0aebf6fd | galeria | descartada: a árvore é um pinheiro |
| 35 | Céu de entardecer | Fim de tarde com sol difuso atrás das nuvens, palmeiras em silhueta | c71cda83-0373-460c-a28e-c44ff3702d61 | galeria | alternativa |
| 36 | Névoa na mata | Chuva na mata escura, folhas molhadas em primeiro plano | 3f87fd84-a18e-4cba-858c-e8dabf6297fb | galeria | alternativa |
| 37 | Névoa na mata | Névoa entre troncos escuros, brilho quente baixo no horizonte | fa20ad66-8c5e-4370-af99-74a0ea7b9d1f | `media-src/higgsfield/nevoa-mata.jpg` | selecionada (cena O nome) |
| 38 | Névoa na mata | Folha grande molhada em close, fundo escuro | 6144b6d2-c5b5-4bfb-b039-86fbe64d69e2 | galeria | descartada: costela-de-adão, espécie ornamental |
| 39 | Estrada de terra | Estrada de terra vermelha reta entre a mata, sombras longas | 3fef485d-34a4-47fc-aece-d6940302e7e1 | `media-src/higgsfield/estrada-terra.jpg` | selecionada (Ji-Paraná e Empresas) |
| 40 | Estrada de terra | Estrada de laterita curvando sobre morro com pastagem | 63797e4f-8052-4ec4-9b93-3c1667376ddc | galeria | descartada: coníferas no alto do morro |
| 41 | Estrada de terra | Estrada de terra após chuva, poças refletindo o céu | 8c422ae2-161f-474d-9ed7-98f514e0a5be | galeria | alternativa |

## Etapa 2: detalhes abstratos das sete categorias

Regra 7 do CLAUDE.md: nenhum quarto, banheiro, fachada ou lobby; só detalhes (têxtil, madeira, luz, mesa, objetos). Nada que mostre cama.

**Preflight:** 12/09/2026, `seedream_v4_5`, 4:3, basic, `get_cost: true` → 1 crédito por imagem.
**Leva:** 28 gerações em três remessas (`generate_image_batch`), 7 categorias × 4 variações, 1 crédito cada, `use_unlim: false`. Total: 28 créditos (teto da etapa: 90). Saídas em 2304 × 1728.

**Final em 2K.** O `seedream_v4_5` em `basic` já entrega 2304 px de largura, acima de 2K, e o pipeline serve até 1920 px. A variação que o responsável aprovar não precisa de nova geração; se quiser 4K, é um `upscale_image` (custo a confirmar com `get_cost` na hora). As escolhas abaixo marcadas como **hero provisório** são a minha sugestão para o responsável escolher; as demais variações da categoria entram na faixa de detalhes da página. Folhas de contato em `docs/higgsfield/etapa-2/`.

| # | Categoria | Prompt (resumo) | Job | Arquivo | Status |
|---|---|---|---|---|---|
| 0 | Superior Família | Três lençóis de linho dobrados sobre madeira escura, luz de manhã | 4b455373-4101-4e21-a307-cb9b8100021c | `media-src/higgsfield/acomodacoes/superior-familia-1.jpg` | hero provisório |
| 1 | Superior Família | Três canecas em verde-oliva, areia e terracota numa bandeja, cortina de linho | b36f19df-fd1e-4b69-9dab-4f8293e0cbd6 | `superior-familia-2.jpg` | faixa de detalhes |
| 2 | Superior Família | Três mantas de algodão dobradas sobre um banco de madeira | f28316a7-5317-4c6d-a0ea-8ac2a39ec153 | `superior-familia-3.jpg` | faixa de detalhes |
| 3 | Superior Família | Três chapéus de palha em cabides de madeira, parede de barro | 45be4b25-405e-4952-a726-61568092db38 | `superior-familia-4.jpg` | faixa de detalhes |
| 4 | Duplo King | Luminária de latão apagada, caderno de couro e caneta, luz de janela | 4ab8da00-ea65-4b90-9be6-8c31913df2d2 | `duplo-king-1.jpg` | hero provisório |
| 5 | Duplo King | Caderno aberto em branco, lápis e café, vistos de cima | ebc7f6ee-a730-466a-8bd8-ece456ab23a6 | `duplo-king-2.jpg` | faixa e seção Perfis (foto com foco) |
| 6 | Duplo King | Caderno de couro, caneta-tinteiro e xícara verde, cortina de linho | dd2cb9dc-99bc-4105-bd59-c8871fa47730 | `duplo-king-3.jpg` | faixa de detalhes |
| 7 | Duplo King | Luminária acesa ao entardecer, notebook fechado, sombra de persiana | d79e9445-80d5-4e35-8896-611d35a84079 | `duplo-king-4.jpg` | faixa de detalhes (luz artificial, a única da leva) |
| 8 | Superior Acessível | Macro de barra de apoio em aço escovado sobre azulejo cor de areia | 69de6824-095c-4f4a-a3c0-6c262295e34d | `superior-acessivel-1.jpg` | hero provisório |
| 9 | Superior Acessível | Maçaneta de alavanca em metal escovado numa porta de carvalho | fd57e291-34ed-442b-b8b0-08c4c4142f91 | `superior-acessivel-2.jpg` | faixa e seção Como chegar ao quarto |
| 10 | Superior Acessível | Encontro sem degrau entre piso de pedra e piso de madeira | ac771f40-3f2d-43d1-b618-fe325f71339d | `superior-acessivel-3.jpg` | faixa de detalhes (confirmar leitura de "sem degrau") |
| 11 | Superior Acessível | Corrimão de madeira ao longo de parede de reboco | 2ed4f83b-61c7-4d26-8f34-07fdaf291c70 | `superior-acessivel-4.jpg` | faixa de detalhes |
| 12 | Superior Família com Terraço | Xícara e cafeteira de êmbolo em mesa de madeira ao ar livre, folhagem | 61fd9c17-0c98-4deb-9136-0dd31d7d8450 | `superior-familia-com-terraco-1.jpg` | hero provisório |
| 13 | Superior Família com Terraço | Canto de mesa externa com guardanapo de linho e copo de água, sombra de palmeira | 74709fb7-d396-44e8-9c2c-7c2a53360d7b | `superior-familia-com-terraco-2.jpg` | faixa e seção Perfis |
| 14 | Superior Família com Terraço | Tábuas de deck com orvalho e uma folha caída | d1ae8472-cbe6-4ff0-b136-c689acd8097d | `superior-familia-com-terraco-3.jpg` | faixa de detalhes |
| 15 | Superior Família com Terraço | Rede de algodão cru com listra verde-oliva, folhagem desfocada | d8d53e4d-5407-4139-891f-242187e690b5 | `superior-familia-com-terraco-4.jpg` | faixa de detalhes (rede pode ser lida como amenidade: confirmar com o cliente) |
| 16 | Suíte Terraço Lateral Aberto | Céu aberto ao fim da tarde entre folhas de palmeira | 2dcdf3cc-9b8b-45bc-990e-f3de7e45f807 | `suite-terraco-lateral-aberto-1.jpg` | hero provisório |
| 17 | Suíte Terraço Lateral Aberto | Encosto de cadeira de madeira com almofada de linho sob o céu | 3d8987ea-2ae7-46d1-8747-27a0f13d44bc | `suite-terraco-lateral-aberto-2.jpg` | faixa de detalhes |
| 18 | Suíte Terraço Lateral Aberto | Cortina de linho ao vento contra o céu claro | 8fd51b3c-b6ee-482e-b884-89f308d9999f | `suite-terraco-lateral-aberto-3.jpg` | faixa de detalhes |
| 19 | Suíte Terraço Lateral Aberto | Vaso de barro com samambaia num deck sob o céu | c521e664-f1b6-414a-a955-2f32209a8896 | galeria | descartada: beiral e pilar de varanda, lê como ambiente do hotel |
| 20 | Suíte Terraço Lateral Fechado | Sombras de veneziana sobre madeira escura polida, fim de tarde | ff245184-7e29-4f41-a2c0-8d4645465d3c | `suite-terraco-lateral-fechado-1.jpg` | hero provisório |
| 21 | Suíte Terraço Lateral Fechado | Veneziana entreaberta com folhagem iluminada do lado de fora | c7d07c30-26ce-4f69-b7d7-eeb5dc002d26 | `suite-terraco-lateral-fechado-2.jpg` | faixa e segunda foto do fade do hero |
| 22 | Suíte Terraço Lateral Fechado | Linho de poltrona com faixas de luz de veneziana | 38fc3431-e84d-482f-8a93-24980771e8e0 | `suite-terraco-lateral-fechado-3.jpg` | faixa de detalhes |
| 23 | Suíte Terraço Lateral Fechado | Tampo de vidro com reflexos de veneziana e uma xícara verde | 1ae3ea67-8b4e-45aa-8968-89a4e0635b5e | `suite-terraco-lateral-fechado-4.jpg` | faixa de detalhes |
| 24 | Suíte Presidencial | Linho escuro sobre braço de nogueira, luz dourada rasante | 2b560187-3414-4b8e-8de7-82db340653ce | `suite-presidencial-onca-pintada-1.jpg` | hero provisório |
| 25 | Suíte Presidencial | Copo de cristal sobre nogueira polida, luz dourada | 8ceac7ca-f234-4931-abf3-c4d39f8e941b | `suite-presidencial-onca-pintada-2.jpg` | pilha de cenas (a suíte) |
| 26 | Suíte Presidencial | Cortina de linho escuro com luz de pôr do sol | 43d056de-2994-4318-86be-0f4559f90258 | `suite-presidencial-onca-pintada-3.jpg` | pilha de cenas (o nome) |
| 27 | Suíte Presidencial | Cinto de couro com fivela de latão sobre mesa lateral | f3c785fb-26ac-4a67-85f5-a50331288f39 | galeria | descartada: objeto pessoal fora de contexto |

Arquivos em `media-src/higgsfield/acomodacoes/`, JPEG q92 como na etapa 1. Estilo comum: "photorealistic, natural daylight, warm earthy palette with olive green accents, muted matte tones, no people, no faces, no text, no logos, no full room visible". Créditos da etapa 2: 28 de 90.

## Não gerado nesta etapa

- Loop novo de vídeo para o hero: o `BG - KALUAMÃ.mp4` foi mantido (decisão do responsável no plano). Custo previsto se for pedido: 2 testes de 5 s no `cinematic_studio_video_v2` (10 créditos) ou 1 loop de 10 s em 1080p no `seedance_2_5` (90 créditos).
