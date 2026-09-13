# QA final, etapa 6

Relatório do QA final do site, feito em 12/09/2026 sobre o build de produção da fase `pre` (a que vai ao ar primeiro) e da fase `full`. Cada frente tem um script que pode ser rodado de novo; os comandos estão no `README.md` do projeto.

| Frente                     | Resultado                                                                 | Arquivo                                                 |
| -------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------- |
| QR Codes                   | 70 de 70 UHs e 5 casos de borda                                           | `qr-pre.json`, `qr-full.json` (locais, fora do git)     |
| Formulários                | 30 de 30 (pre) e 21 de 21 (full)                                          | `formularios-pre.json`, `formularios-full.json`         |
| Acessibilidade, axe        | 213 medições por fase, nenhuma violação                                   | `a11y-pre.json`, `a11y-full.json`                       |
| Acessibilidade, teclado    | 42 percursos e 13 roteiros por fase, todos aprovados                      | `a11y-pre.json`, `a11y-full.json`                       |
| Leitor de tela             | árvores gravadas; conferência humana pendente                             | `aria/`, `leitor-de-tela.md`                            |
| Texto contra os vetos      | 103 páginas e todo o conteúdo-fonte revisados                             | abaixo                                                  |
| Contraste sobre foto       | 495 textos por fase em 77 páginas, nenhum abaixo do mínimo (menor 4,72:1) | `contraste-cenas-pre.json`, `contraste-cenas-full.json` |
| Lighthouse                 | 400 medições, nenhuma abaixo de 90                                        | `../../lighthouse/etapa-6/`                             |
| Pré-visualização na Vercel | build limpo, 179 páginas                                                  | abaixo                                                  |

## 1. QR Codes

`npm run qa:qr` testa as 70 UHs de `content/qr-map.json` em duas camadas:

- **HTTP:** `/q/<uh>` responde 301, com `Location` relativo igual a `<canônica>?uh=<uh>`; o destino responde 200 e declara a canônica sem o parâmetro.
- **Navegador:** abrir `/q/<uh>` termina na página certa, com a barra de hóspede saudando o quarto pelo nome, sem o número na fase `pre` e com o número na `full`, com os atalhos (Wi-Fi e recepção, Restaurante, Check-out), o link da categoria, o próximo quarto e o botão de som; o evento `qr_scan` chega à camada de dados com a UH e o nome.

Casos de borda, todos aprovados: UH inexistente e UH não numérica caem no hub do Universo (301 para `/universo`); `/q/101/` com barra final chega ao mesmo destino; recarregar a página não repete o `qr_scan` na sessão; sem `?uh=` a barra não aparece; o `robots.txt` bloqueia `/q/`.

A tabela das placas, com o endereço de cada QR e o destino, sai com `npm run qa:qr -- --csv` em `docs/qr-codes.csv`. Ela fica fora do git, assim como `qr-pre.json` e `qr-full.json`: os três listam as 70 UHs, e o repositório é público.

## 2. Formulários

`npm run qa:formularios` envia os cinco formulários de ponta a ponta contra um servidor local que imita a API do Resend. Nenhum e-mail de verdade sai.

Defeitos que o teste encontrou e que foram corrigidos (decisões 81 a 88):

| Defeito                              | Onde                                     | Como estava                                                 |
| ------------------------------------ | ---------------------------------------- | ----------------------------------------------------------- |
| Recusa da API de e-mail engolida     | os quatro formulários                    | o visitante via "Recebemos seu contato" e o e-mail não saía |
| Currículo acima de 1 MB              | Trabalhe conosco                         | erro 500, nada na tela; a página prometia até 5 MB          |
| Campo obrigatório em passo escondido | Eventos                                  | o envio travava em silêncio                                 |
| Painéis escondidos sem JavaScript    | Eventos                                  | impossível preencher o formulário                           |
| Segunda conversão da sessão          | medição                                  | Contato e depois Pré-reserva geravam só o primeiro evento   |
| E-mails sem "responder para"         | Contato, Pré-reserva, Currículo, Eventos | a equipe precisava copiar o endereço                        |

Resultado final: **30 de 30 casos na fase `pre` e 21 de 21 na `full`**. A fase `full` não tem o formulário da pré-inauguração, então os nove casos dele não se aplicam.

Os casos cobrem, em cada formulário: envio válido com o e-mail conferido (destinatário, "responder para", assunto, corpo e anexo), erro de validação no campo com `aria-invalid`, honeypot, recusa da API de e-mail e envio sem JavaScript. No aviso da pré-inauguração, também o limite de cinco envios por IP. No currículo, arquivos de 40 KB a 6 MB, DOCX, formato errado e arquivo acima de 4 MB sem JavaScript, recusado pelo servidor. No pedido de proposta, os três passos, o salto pelo indicador de passos com campo pendente e o envio sem JavaScript. A medição confere `lead_pre_inauguracao`, `lead_corporativo`, `lead_evento` e `reservar_click`, inclusive dois formulários na mesma sessão.

Um caso (E2) falhou em duas rodadas por tempo do próprio teste: o clique automático no indicador de passos saía durante a animação de entrada do formulário e caía no `form`. Com o formulário parado, os três botões levam ao passo certo; o teste passou a esperar a entrada terminar.

## 3. Acessibilidade

`npm run qa:a11y` trabalha em três camadas. Resultado da fase `pre`:

- **axe-core 4.13**, com as regras WCAG 2.0, 2.1 e 2.2 nos níveis A e AA e as boas práticas. São 213 medições: as 101 rotas no desktop e no celular, mais 11 medições de estados que só existem com interação (banner de consentimento, cabeçalho da fase `pre` no celular, barra de hóspede num quarto de cada andar, elevador parado no andar das Aves, acordeões abertos, erros de formulário e movimento reduzido). **Nenhuma violação.**
- **Teclado:** percurso com Tab e depois Shift+Tab em 21 modelos de página, no desktop e no celular, conferindo em cada parada se o foco está visível, se o contorno contrasta com o que está atrás dele, se não está recortado, fora da tela ou coberto por outro elemento. **42 percursos, 751 paradas, todos aprovados.** E 13 roteiros, **todos aprovados**: atalho para o conteúdo; menu do celular (vale na fase `full`); cabeçalho depois de navegar de uma página com hero para uma sem (contraste 9,27:1); banner de consentimento (4 Tabs até o primeiro botão); acordeão; filtro (`aria-pressed` e região viva "Mostrando: Madeira"); busca (região viva "8 resultados", Escape limpa o campo); barra de hóspede e som (um som por vez, o foco fica no botão, a ação do cabeçalho continua visível ao rolar); mapa sob demanda (o foco vai para a moldura do mapa); passos de Eventos (o foco vai para o primeiro campo de cada passo); foco depois de erro (o campo com erro recebe o foco e a mensagem fica ligada por `aria-describedby`); movimento reduzido (sem abertura e nenhum vídeo tocando); som ao abrir a página (nada toca antes de um gesto, o primeiro Tab liga um som só, o da barra de hóspede, e silenciar vale para a página seguinte).
- **Leitor de tela:** árvore de acessibilidade dos 21 modelos gravada em `aria/`, a mesma que o VoiceOver e o NVDA leem: um H1 por página, nenhum salto de nível de título e marcos com nome. **21 de 21.** A conferência humana segue o roteiro de `leitor-de-tela.md`.

Na fase `full`, que tem o menu completo e o número do quarto nos cards e na barra de hóspede, o resultado final é o mesmo: 213 medições do axe sem violação, 42 percursos com 1.568 paradas, os 13 roteiros e as 21 árvores aprovados. As rodadas dessa fase acharam dois defeitos que só existem nela, as cores de andar abaixo de 4,5:1 e o Tab saindo do menu aberto do celular; os dois foram corrigidos e medidos de novo. As duas fases foram medidas depois do véu atrás do texto.

**Contraste de texto sobre foto.** Quando o texto fica sobre imagem, vídeo ou gradiente, o axe marca o caso como incompleto e não reprova. `npm run qa:contraste` mede esses casos: fotografa a caixa de cada texto claro na Home, no hub do Universo, nos 5 hubs de andar e nas 70 páginas de elemento, no desktop e no celular, e compara a cor do texto com a parte mais clara do fundo, o percentil 95 dos pixels (decisão 112). Na primeira medição, com 93 textos, 19 ficavam abaixo do mínimo na fase `full`: o texto do hero e dos painéis da Home, os ordinais e os nomes dos blocos do hub do Universo, o "2º andar" do hub de Peixes e o kicker do hero do pirarucu e da samaúma. Um véu local atrás do texto resolveu (decisão 111); depois de ver o site no ar, o responsável preferiu um filtro na seção inteira, a 50% (decisão 115). Resultado final: **495 textos por fase, nenhum abaixo do mínimo**; o menor contraste é 4,72:1, num kicker de texto pequeno da sardinha-da-amazônia.

Achados corrigidos (decisões 95 a 104, 107, 109, 111, 114, 115 e 117):

| Achado                                                                                | Onde                                                    | WCAG                |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------- | ------------------- |
| Contorno de foco café sobre fundo escuro, de 1:1 a 1,6:1                              | cenas, painéis, andares, rodapé, cabeçalho transparente | 2.4.7, 1.4.11       |
| Contorno cortado pela máscara de entrada                                              | cards de elemento, categoria e post                     | 2.4.7               |
| Cabeçalho bege sobre bege depois de navegar                                           | posts, páginas legais, 404                              | 1.4.3               |
| Cabeçalho escondido com foco dentro; foco parando por baixo do cabeçalho fixo         | todas                                                   | 2.4.11              |
| Botão focado coberto pelo painel empilhado seguinte                                   | Home                                                    | 2.4.11              |
| Barra de hóspede por cima do cabeçalho                                                | páginas abertas pelo QR                                 | 2.4.11              |
| Campos de data sem contorno no ícone do calendário                                    | Reservas, Eventos                                       | 2.4.7               |
| Atalho para o conteúdo com contorno café sobre o hero                                 | todas                                                   | 2.4.7               |
| Menu do celular sem fundo inerte; Escape sem devolver o foco                          | fase `full`                                             | 2.4.3               |
| Tab saindo do menu aberto para o atalho de conteúdo, que leva a um main inerte        | fase `full`                                             | 2.4.3               |
| Texto claro sobre a parte clara da foto, 19 de 93 abaixo do mínimo                    | Home, hub do Universo, hub de Peixes, pirarucu, samaúma | 1.4.3               |
| Cabeçalho encolhido até o conteúdo e colado à esquerda                                | todas, visível na fase `pre` no ar                      | layout              |
| Logo em café sobre a foto com o cabeçalho transparente                                | páginas com hero                                        | 1.4.11              |
| Botão "Ouvir o ambiente" em café sobre a foto do hero                                 | 70 páginas de elemento                                  | 1.4.3               |
| Número do quarto e barra de hóspede nas cores de Peixes, Árvores e Aves (3,8:1 a 4:1) | hubs de andar e páginas abertas pelo QR, fase `full`    | 1.4.3               |
| Erro de formulário sem ligação com o campo e foco perdido                             | cinco formulários                                       | 1.3.1, 3.3.1, 2.4.3 |
| Pedido de proposta travado em silêncio; troca de passo sem anúncio                    | Eventos                                                 | 3.3.1, 4.1.3        |
| Botão de som com rótulo e `aria-pressed` contraditórios; dois sons ao mesmo tempo     | Universo                                                | 4.1.2               |
| Foco perdido quando o botão "Ver mapa" some                                           | Contato                                                 | 2.4.3               |
| Trilho do elevador com texto bege sobre seções claras                                 | hub do Universo                                         | 1.4.3               |
| Rótulos dos mapas em sálvia sobre bege (2,4:1); texto de exemplo dos campos a 45%     | Ji-Paraná, formulários                                  | 1.4.3               |
| Nomes científicos sem `lang`; grupos da FAQ em `h2` dentro de seção com `h2`          | Universo, FAQ                                           | 3.1.2, 1.3.1        |

Fica para decisão de design: os vídeos de fundo em loop não têm botão de pausa (WCAG 2.2.2) e só param com a preferência de movimento reduzido.

## 4. Texto contra os vetos

Revisão de 103 páginas servidas pelo build `pre` (texto visível, títulos, descriptions, Open Graph, `alt`, `aria-label` e JSON-LD), mais `llms.txt`, `robots.txt`, `sitemap.xml`, o banner de consentimento, `content/*.json`, `posts/*.yaml` e as strings de `lib/`, `components/` e `app/`.

Sem ocorrência: travessão, emoji, hífen usado como travessão, telefone provisório, campo ⟨pendente⟩ visível, sobra de desenvolvimento ("TODO", "undefined"), "Kaluana" sem til no texto, "o Eco Hotel", valores e preços, `alt` que descreva quarto, lobby ou fachada, e as expressões eco vetadas ("refúgio", "paraíso", "harmonia", "no verde", "conexão com a natureza" e variações).

Corrigido na etapa 6 (decisões 89 a 94):

| Achado                                                                                                                                                                                                      | Veto      |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| Número do quarto nas 67 meta descriptions do Universo, no Open Graph e no JSON-LD da fase `pre`                                                                                                             | Parte 3.5 |
| "leva o nome de catorze rios" e equivalentes no rodapé dos hubs de andar; "quatro quartos" no surubim                                                                                                       | Parte 3.5 |
| Números dos quartos na lista da busca do hub e da 404                                                                                                                                                       | Parte 3.5 |
| "auditório e centro de convenções" no `llms.txt`; link para `/eventos` em Reservas; espaços de evento nos termos; formulário de eventos na política de privacidade; resposta com auditório na Home completa | 3         |
| Temas ausentes (eventos, animais) na descrição de Perguntas frequentes                                                                                                                                      | Parte 4.3 |
| Avisos internos (minuta, post a revisar, página fora do menu) no deploy de produção                                                                                                                         | 5         |
| "o que sustentabilidade quer dizer na prática" na copaíba                                                                                                                                                   | 1         |
| Nome completo no corpo dos termos de uso                                                                                                                                                                    | nome      |
| Páginas da fase 1 indexáveis na fase `pre`                                                                                                                                                                  | Parte 3.5 |

O `check:copy` passou a conferir no build a fase, a autorização de Eventos e os avisos internos, para esses achados não voltarem.

Listado para decisão do cliente, sem troca: menções genéricas a eventos no texto do mestre, contagens parciais dos guardiões e das suítes, planta esquemática de Eventos, duas frases de tom e o nome completo nas respostas de AEO (ver `docs/etapas.md`, etapa 6).

## 5. Lighthouse

`npm run lighthouse:lote` mede todas as rotas do build de produção, nas duas fases, no celular e no desktop: 400 medições com Lighthouse 13.4.1 e throttling simulado, como nas etapas anteriores. A 404 fica de fora, porque o Lighthouse não mede página que responde 404; ela entra no teste de acessibilidade. Quando o desempenho fica abaixo de 90, a rota é medida mais duas vezes e vale a mediana. As tabelas por grupo e por rota estão em `../../lighthouse/etapa-6/README.md`.

| Fase e tela   | Rotas | Desempenho             | Acessibilidade | Boas práticas | SEO das indexáveis | LCP maior |
| ------------- | ----- | ---------------------- | -------------- | ------------- | ------------------ | --------- |
| pre, celular  | 100   | 90 a 97 (mediana 94)   | 100            | 100           | 100                | 3,7 s     |
| pre, desktop  | 100   | 98 a 100 (mediana 100) | 100            | 100           | 100                | 0,8 s     |
| full, celular | 100   | 90 a 97 (mediana 94)   | 100            | 100           | 100                | 3,7 s     |
| full, desktop | 100   | 98 a 100 (mediana 100) | 100            | 100           | 100                | 0,8 s     |

**Nenhuma rota abaixo de 90.** CLS máximo de 0,001 e bloqueio total da thread principal de no máximo 79 ms. As páginas com `noindex` (21 na fase `pre`, 2 na `full`: Eventos e Obrigado) reprovam só o critério `is-crawlable` do SEO, de propósito.

Na primeira rodada, jequitibá, samaúma e copaíba ficaram entre 86 e 89 no celular, nas três medições de cada, e as duas primeiras passaram dos 700 KB no desktop. A causa era a foto de abertura, de folhagem densa; com o teto de peso por largura no `build-media` (decisão 110), as três foram para 91. Depois do véu atrás do texto (decisão 111), foram medidas de novo 19 rotas da fase `full` e 5 da `pre`: Home, hub do Universo, hubs de andar, O Kaluanã, Restaurante e as páginas de elemento com as fotos refeitas. Todas continuaram a partir de 90. Depois dos ajustes de 13/09/2026 (filtro na seção inteira, largura do original e upscale das 96 fotos pequenas, decisões 115 e 116), foram medidas de novo, nas duas fases, as páginas com fotos novas e as mais pesadas: desempenho de 90 a 95 no celular e 100 no desktop; a página de elemento mais pesada continua a do Rio Amazonas, com 657 KB no desktop da fase `full`.

O LCP simulado do celular fica entre 2,6 e 3,7 s, acima dos 2,5 s da meta. Como nas etapas 1 a 5, o simulador soma ao LCP tudo o que é pedido antes dele, inclusive o JavaScript; com throttling real de rede e CPU, o LCP da Home fica abaixo de 1 s (decisões 20 e 24).

Peso por página: Home entre 553 e 686 KB (limite 2.500 KB); as 70 páginas de elemento entre 321 e 656 KB (limite 700 KB), todas dentro. Os hubs de andar ficam acima dos 700 KB por causa do vídeo de fundo: Guardiões com 684 a 830 KB, Aves com 807 a 867 KB, Rios com 1,2 a 1,3 MB, Peixes com 1,3 a 1,4 MB e Árvores com 1,6 a 1,9 MB. Cada vídeo cabe sozinho em 700 KB (decisão 46), e o desempenho dos hubs fica entre 90 e 92 no celular. Se o limite de 700 KB valer também para os hubs, e não só para as páginas de elemento, é preciso uma decisão de design sobre o vídeo.

## 6. Pré-visualização na Vercel

Deploy de pré-visualização da branch `etapa-6`, criado pelo push de 12/09/2026:

- Endereço da branch: `https://kaluana-eco-hotel-git-etapa-6-agencia-premium.vercel.app`
- Build: `check-env` pulado por ser pré-visualização, conteúdo dos JSON versionados, TypeScript e compilação limpos, 179 páginas estáticas.
- Proteção: pede login no time Agencia Premium; responde com `X-Robots-Tag: noindex`.

Em 12/09/2026, às 22:52 e às 22:53 (horário de Rondônia), a pré-visualização da `etapa-6` foi promovida a produção duas vezes pela conta agenciapremium, fora da sessão que fez este QA. Os dois builds pararam no `check-env`, porque faltam `RESEND_API_KEY` e `LEAD_TO_EMAIL`, e a produção continuou no deploy da etapa 1. Depois que as variáveis de e-mail forem gravadas, essa trava deixa de segurar: uma promoção passa a publicar o site. Em 13/09/2026, com as variáveis gravadas, o último build (commit `e990a0a`) foi promovido a pedido do responsável e está no ar em `https://www.kaluanaecohotel.com.br`. A conferência no domínio está em `docs/deploy.md`, seção 8.

A ferramenta de leitura da Vercel desta sessão não passa pelo login, então o conteúdo da pré-visualização não foi lido daqui. O comportamento foi conferido no build local equivalente. Ao abrir a pré-visualização, confira três coisas: o cabeçalho mostra só o logo e "Quero ser avisado" (fase `pre`); o código-fonte da Home tem `<link rel="canonical" href="https://kaluanaecohotel.com.br">`; a página de privacidade mostra o aviso de minuta (ele some só em produção).

## 7. Ambiente dos testes

- Build de produção local (`next build` e `next start`), Node 24, Chrome estável e Chromium do Playwright 1.63.
- Fase `pre` construída com `VERCEL_ENV=production`, para reproduzir o deploy de produção (sem avisos internos).
- axe-core 4.13 e Lighthouse 13.4, os mesmos das etapas anteriores.
