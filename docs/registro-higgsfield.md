# Registro Higgsfield

Toda geração de mídia na conta da agência (plano Ultra), conforme a seção 7 do CLAUDE.md. Custo confirmado com `get_cost` antes da leva. Saídas selecionadas ficam em `media-src/higgsfield/` (originais PNG convertidos para JPEG q92, ver decisões) e passam pelo pipeline como qualquer imagem. As demais continuam na galeria da conta pelos IDs abaixo.

Regras aplicadas em todos os prompts: sem pessoas identificáveis (sem rostos), sem texto, sem logotipos, luz natural, paleta terrosa com verde-oliva, sem saturação exagerada. Nenhum ambiente do hotel (quarto, lobby, fachada, restaurante), só detalhes.

## Saldo

| Data | Saldo antes | Gasto | Saldo depois |
|---|---|---|---|
| 12/09/2026 | 8.815,6 | 24 | 8.791,6 |
| 12/09/2026 | 8.791,6 | 18 | 8.773,6 |
| 12/09/2026 | 8.773,6 | 28 | 8.745,6 |
| 12/09/2026 | 8.745,6 | 43,75 | 8.701,85 |
| 12/09/2026 | 8.701,85 | 24 | 8.677,85 |

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

## Etapa 3: loops de fundo dos hubs de andar

Autorizado pelo responsável da Premium em 12/09/2026 ("pode gerar os vídeos sim, quanto mais dinâmico melhor").

**Preflight:** 12/09/2026, `kling3_0`, 5 s, modo `pro`, `sound: off`, `get_cost: true` → 8,75 créditos por vídeo (o mesmo com som sairia 10, e o modo `std` sem som, 7,5). Alternativa avaliada: `seedance_2_5` 1080p a 45 créditos, descartada porque a leva inteira em `kling3_0` custou menos que dois vídeos dela.

**Leva:** 5 gerações, imagem para vídeo, `use_unlim: false`. Total: **43,75 créditos** de 400. Cada vídeo parte da atmosfera do andar já aprovada na etapa 1, passada como `start_image` pelo id da geração original, o que dispensou novo upload e mantém a paleta.

| # | Andar | Imagem inicial | Movimento pedido | Job | Arquivo |
|---|---|---|---|---|---|
| 42 | Rios | `atmosfera/rio-mata` | Câmera avança rente à água, névoa subindo, margens passando | 3bbe2628-d407-4f70-aeec-a2c5e417d2a8 | `media-src/video-andares/rios.mp4` |
| 43 | Peixes | `atmosfera/agua-corrente` | Deriva subaquática, feixes de luz tremendo, partículas subindo | 51f05631-d3ce-4297-b10e-8b8908fa8f90 | `peixes.mp4` |
| 44 | Árvores | `atmosfera/copa-mata` | Câmera sobe pela copa, folhas ao vento, sol piscando entre galhos | 85541005-ac3a-4b42-93d2-d316caafc562 | `arvores.mp4` |
| 45 | Aves | `atmosfera/ceu-entardecer` | Nuvens correndo sobre a linha da mata, luz virando de ouro a âmbar | 17d869ed-6dd9-4a7b-8660-852855ddbbf1 | `aves.mp4` |
| 46 | Guardiões | `atmosfera/nevoa-mata` | Névoa rolando entre troncos escuros, avanço lento, brilho baixo no horizonte | 1099b6ff-783c-4401-af67-6e1d2f2b42d2 | `guardioes.mp4` |

Todos os cinco foram conferidos quadro a quadro antes de entrar: nenhum ambiente de hotel, nenhuma espécie identificável, nenhuma pessoa, nenhum texto. Os prompts pedem explicitamente "no people, no animals, no text, no logos" (nas aves, "no birds": ave gerada por texto violaria a regra 6).

Processamento (`scripts/build-media.ts --only=andares`): 1280 px, 24 fps, laço de ida e volta de 10,1 s, sem áudio, poster em WebP. A compressão sobe sozinha até caber no teto de 700 KB da Parte 2.6, porque a densidade das cenas varia muito: os rios fecharam em crf 36/46 e as árvores precisaram de crf 50 no WebM.

## Etapa 3: imagens

Nenhuma geração. As 137 fotos do inventário (68 heroes e 69 de galeria) entraram pelo pipeline como estão, conforme a coluna de uso. Os 17 heroes abaixo de 1.000 px ficaram sem upscale: o custo seria 34 créditos, mas o upscale envia a foto do cliente ao Higgsfield e a licença dessas imagens é a pendência 24 da Parte 8, ainda aberta. Recomendação: confirmar a licença antes, e então decidir.

Filhote e Maracanã continuam sem foto. A regra 6 proíbe gerar espécie só por texto, e o Commons não tem as espécies. As duas páginas ficam com o fundo do andar e uma nota de pendência, sem custo.

## Etapa 4: detalhes do Restaurante e da obra

**Preflight:** 12/09/2026, `seedream_v4_5`, 4:3, basic, `get_cost: true` → 1 crédito por imagem.
**Leva:** 24 gerações em duas remessas, 8 assuntos × 3 variações, 1 crédito cada, `use_unlim: false`. Total: **24 créditos** de 120. Saídas em 2304 × 1728. Folhas de contato em `docs/higgsfield/etapa-4/`.

Nenhuma imagem para a página de Eventos: auditório e centro de convenções são ambientes do hotel, vetados até a inauguração (regra 7). A página usa a planta esquemática em SVG, sem escala.

| # | Assunto | Prompt (resumo) | Job | Arquivo | Status |
|---|---|---|---|---|---|
| 47 | Prato de peixe | Peixe grelhado inteiro em tigela de cerâmica verde, limão e ervas, luz de janela | 00cdf80c-8403-44df-afbb-934ccf372bad | `restaurante/peixe-na-tigela` | selecionada (hero) |
| 48 | Prato de peixe | Peixe inteiro em travessa com rodelas de limão, visto de cima | 139c516d-07ae-48cc-83ba-3bf9237ef4ba | galeria | alternativa |
| 49 | Prato de peixe | Garfo levantando uma lasca, com vapor, prato escuro | 17b2710e-6db3-4078-a43f-402fae184027 | `restaurante/lasca-de-peixe` | selecionada |
| 50 | Farinha e pirão | Três tigelas de barro com farinha, pirão e vinagrete, de cima | bc154fdd-42fe-40c3-a328-ae446af6de76 | `restaurante/farinha-e-pirao` | selecionada |
| 51 | Farinha e pirão | Tigela de farinha com colher de pau e pano de linho | 8e899261-2432-483b-b38d-d67685deab7d | galeria | alternativa |
| 52 | Farinha e pirão | Pilha de tigelas de terracota com maço de ervas | 253ac40a-2912-448c-8e76-f8230f8aae68 | galeria | alternativa |
| 53 | Mesa ao meio-dia | Canto de mesa posta com guardanapo, talheres e copo, sol duro | 7a6ac465-ca6b-4557-bf77-165344b80a10 | `restaurante/mesa-ao-meio-dia` | selecionada |
| 54 | Mesa ao meio-dia | Dois lugares postos vistos de cima, com passadeira de linho | d619f6a8-dda4-45b3-98a7-ff70e67c2f27 | galeria | descartada: cadeiras e parede leem como salão do hotel |
| 55 | Mesa ao meio-dia | Guardanapos de linho em fila numa mesa longa, com jarra | 62f111e9-b51a-4e19-a786-0d2c30048f85 | `restaurante/guardanapos-em-fila` | selecionada |
| 56 | Café da manhã | Xícara de café e pão de queijo num balcão ao amanhecer | d8b0c9b6-e8c3-4bfe-9080-7b9d8bd357a6 | `restaurante/cafe-da-manha` | selecionada |
| 57 | Café da manhã | Frutas fatiadas numa tábua com bule de cerâmica | 68405af8-dd27-48fc-8d5a-807b91c32154 | galeria | alternativa |
| 58 | Café da manhã | Café sendo servido numa xícara, com vapor | d19e27d1-961b-4a17-ae3c-776b9764d8d4 | galeria | alternativa |
| 59 | Madeira bruta | Tábua serrada sobre cavalete, com serragem | 74202f37-7b35-46cb-ba65-9b9f19fec708 | galeria | descartada: madeira tratada esverdeada |
| 60 | Madeira bruta | Vigas empilhadas com poeira vermelha | b14c1952-024a-4e8f-bcf1-fc256ea20395 | galeria | descartada: madeira tratada esverdeada |
| 61 | Madeira bruta | Macro do topo de uma viga, com anéis de crescimento | 21495175-45bf-48d6-bb68-fe8c101b1693 | galeria | descartada: madeira tratada esverdeada |
| 62 | Terra vermelha | Terra revolvida com marca de lâmina, de cima | f5ff0d6b-8a1b-45cc-a514-3c7a42e2ca9b | galeria | descartada: marca de pneu, não de enxada |
| 63 | Terra vermelha | Enxada apoiada num monte de terra vermelha | fd4a1df7-607b-43b3-9c83-c8d5efe49d10 | `obra/terra-e-enxada` | selecionada (hero de O Kaluanã) |
| 64 | Terra vermelha | Camadas de terra numa vala rasa, com raízes e pedras | 9671acb2-36f1-4c88-a43c-0397cbe4063f | `obra/perfil-do-solo` | selecionada |
| 65 | Prumo e linha | Prumo pendurado num fio contra o céu | 57ffc8d2-6fa9-490c-ab53-d8a383fe31ef | `obra/prumo` | selecionada |
| 66 | Prumo e linha | Linha de pedreiro entre estacas sobre terra vermelha | 1841a3da-86ad-42c1-ab4a-8ef9dd3d75b8 | `obra/linha-e-estacas` | selecionada |
| 67 | Prumo e linha | Lápis de carpinteiro e trena sobre tábua | 44bbd8c2-e69a-4394-8b62-cf0fe9441651 | galeria | descartada: números da trena são texto na imagem |
| 68 | Telhas | Pilha de telhas de barro sobre terra vermelha | b72870b7-bc22-4664-b61d-e70d9771a48c | galeria | descartada: musgo, leem como telhas reaproveitadas |
| 69 | Telhas | Macro de telhas sobrepostas com musgo nas ranhuras | c234a1ba-bd4c-485f-a5b6-1d15af9f6404 | galeria | descartada: musgo |
| 70 | Telhas | Telha erguida contra o chão de terra | 8bbb9c71-1166-4c4b-b3a1-505a37cd5be2 | galeria | descartada: musgo |

Aproveitamento: 10 de 24. Os dois assuntos descartados inteiros (madeira e telhas) saíram com a mesma falha: o modelo entregou madeira tratada esverdeada e telhas velhas com musgo, quando a marca pede madeira amazônica de manejo e obra nova. Para uma próxima leva, o caminho é captação própria no canteiro, que a pendência 25 da Parte 8 já recomenda.

## Não gerado nesta etapa

- Loop novo de vídeo para o hero: o `BG - KALUAMÃ.mp4` foi mantido (decisão do responsável no plano). Custo previsto se for pedido: 2 testes de 5 s no `cinematic_studio_video_v2` (10 créditos) ou 1 loop de 10 s em 1080p no `seedance_2_5` (90 créditos).
