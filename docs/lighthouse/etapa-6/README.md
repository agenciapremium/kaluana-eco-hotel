# Lighthouse, etapa 6

Todas as rotas do build de produção, nas duas fases, em celular e desktop. Lighthouse 13.4.1, throttling simulado, como nas etapas anteriores. Cada rota é medida como primeira visita, com a abertura de sessão. Quando o desempenho fica abaixo de 90, a rota é medida mais duas vezes e vale a mediana. Os relatórios HTML só existem para as medições que ficaram abaixo de 90; o resto está nos arquivos `resumo-pre.json` e `resumo-full.json`.

## Por grupo de página

### Fase `pre`, celular (100 rotas)

| Grupo                                    | Rotas | Desempenho           | Acessibilidade | Boas práticas | SEO               | LCP maior | Peso maior |
| ---------------------------------------- | ----- | -------------------- | -------------- | ------------- | ----------------- | --------- | ---------- |
| Home                                     | 1     | 91 (mediana 91)      | 100            | 100           | 100               | 3,4 s     | 660 KB     |
| Hub do Universo                          | 1     | 93 (mediana 93)      | 100            | 100           | 100               | 3,2 s     | 439 KB     |
| Hubs de andar (5)                        | 5     | 90 a 92 (mediana 90) | 100            | 100           | 100               | 3,7 s     | 1690 KB    |
| Páginas de elemento (70)                 | 70    | 90 a 96 (mediana 94) | 100            | 100           | 100               | 3,6 s     | 516 KB     |
| Acomodações e categorias (8)             | 8     | 91 a 93 (mediana 93) | 100            | 100           | 66 a 69 (noindex) | 3,4 s     | 576 KB     |
| O Kaluanã, Restaurante, Ji-Paraná        | 3     | 91 a 93 (mediana 92) | 100            | 100           | 69 (noindex)      | 3,3 s     | 588 KB     |
| Eventos (fora do índice)                 | 1     | 94 (mediana 94)      | 100            | 100           | 66 (noindex)      | 3,0 s     | 460 KB     |
| Histórias e posts (4)                    | 4     | 93 a 94 (mediana 94) | 100            | 100           | 69 (noindex)      | 3,2 s     | 529 KB     |
| Reservas, Contato, FAQ, Trabalhe conosco | 4     | 94 (mediana 94)      | 100            | 100           | 66 (noindex)      | 3,0 s     | 467 KB     |
| Legais (2)                               | 2     | 96 a 97 (mediana 97) | 100            | 100           | 100               | 2,8 s     | 430 KB     |
| Obrigado e 404                           | 1     | 97 (mediana 97)      | 100            | 100           | 63 (noindex)      | 2,6 s     | 432 KB     |

Nenhuma rota abaixo de 90 em desempenho, acessibilidade, boas práticas ou SEO indexável.

Auditorias reprovadas fora de desempenho: `seo:is-crawlable`.

Orçamento de peso: Home com 660 KB (limite 2.500 KB); páginas de elemento entre 321 e 516 KB (limite 700 KB), todas dentro.

### Fase `pre`, desktop (100 rotas)

| Grupo                                    | Rotas | Desempenho             | Acessibilidade | Boas práticas | SEO               | LCP maior | Peso maior |
| ---------------------------------------- | ----- | ---------------------- | -------------- | ------------- | ----------------- | --------- | ---------- |
| Home                                     | 1     | 98 (mediana 98)        | 100            | 100           | 100               | 0,7 s     | 686 KB     |
| Hub do Universo                          | 1     | 100 (mediana 100)      | 100            | 100           | 100               | 0,7 s     | 538 KB     |
| Hubs de andar (5)                        | 5     | 100 (mediana 100)      | 100            | 100           | 100               | 0,7 s     | 1793 KB    |
| Páginas de elemento (70)                 | 70    | 99 a 100 (mediana 100) | 100            | 100           | 100               | 0,8 s     | 596 KB     |
| Acomodações e categorias (8)             | 8     | 99 (mediana 99)        | 100            | 100           | 66 a 69 (noindex) | 0,7 s     | 630 KB     |
| O Kaluanã, Restaurante, Ji-Paraná        | 3     | 99 (mediana 99)        | 100            | 100           | 69 (noindex)      | 0,7 s     | 615 KB     |
| Eventos (fora do índice)                 | 1     | 99 (mediana 99)        | 100            | 100           | 66 (noindex)      | 0,6 s     | 491 KB     |
| Histórias e posts (4)                    | 4     | 99 a 100 (mediana 100) | 100            | 100           | 69 (noindex)      | 0,7 s     | 579 KB     |
| Reservas, Contato, FAQ, Trabalhe conosco | 4     | 99 (mediana 99)        | 100            | 100           | 66 (noindex)      | 0,7 s     | 496 KB     |
| Legais (2)                               | 2     | 100 (mediana 100)      | 100            | 100           | 100               | 0,6 s     | 430 KB     |
| Obrigado e 404                           | 1     | 100 (mediana 100)      | 100            | 100           | 63 (noindex)      | 0,6 s     | 432 KB     |

Nenhuma rota abaixo de 90 em desempenho, acessibilidade, boas práticas ou SEO indexável.

Auditorias reprovadas fora de desempenho: `seo:is-crawlable`.

Orçamento de peso: Home com 686 KB (limite 2.500 KB); páginas de elemento entre 321 e 596 KB (limite 700 KB), todas dentro.

### Fase `full`, celular (100 rotas)

| Grupo                                    | Rotas | Desempenho           | Acessibilidade | Boas práticas | SEO          | LCP maior | Peso maior |
| ---------------------------------------- | ----- | -------------------- | -------------- | ------------- | ------------ | --------- | ---------- |
| Home                                     | 1     | 90 (mediana 90)      | 100            | 100           | 100          | 3,3 s     | 553 KB     |
| Hub do Universo                          | 1     | 93 (mediana 93)      | 100            | 100           | 100          | 3,2 s     | 452 KB     |
| Hubs de andar (5)                        | 5     | 90 a 92 (mediana 91) | 100            | 100           | 100          | 3,7 s     | 1636 KB    |
| Páginas de elemento (70)                 | 70    | 90 a 95 (mediana 94) | 100            | 100           | 100          | 3,6 s     | 528 KB     |
| Acomodações e categorias (8)             | 8     | 91 a 93 (mediana 93) | 100            | 100           | 100          | 3,4 s     | 587 KB     |
| O Kaluanã, Restaurante, Ji-Paraná        | 3     | 92 a 93 (mediana 92) | 100            | 100           | 100          | 3,3 s     | 600 KB     |
| Eventos (fora do índice)                 | 1     | 94 (mediana 94)      | 100            | 100           | 66 (noindex) | 3,0 s     | 472 KB     |
| Histórias e posts (4)                    | 4     | 93 a 94 (mediana 94) | 100            | 100           | 100          | 3,2 s     | 540 KB     |
| Reservas, Contato, FAQ, Trabalhe conosco | 4     | 94 (mediana 94)      | 100            | 100           | 100          | 3,0 s     | 478 KB     |
| Legais (2)                               | 2     | 96 (mediana 96)      | 100            | 100           | 100          | 2,8 s     | 441 KB     |
| Obrigado e 404                           | 1     | 97 (mediana 97)      | 100            | 100           | 63 (noindex) | 2,6 s     | 496 KB     |

Nenhuma rota abaixo de 90 em desempenho, acessibilidade, boas práticas ou SEO indexável.

Auditorias reprovadas fora de desempenho: `seo:is-crawlable`.

Orçamento de peso: Home com 553 KB (limite 2.500 KB); páginas de elemento entre 333 e 528 KB (limite 700 KB), todas dentro.

### Fase `full`, desktop (100 rotas)

| Grupo                                    | Rotas | Desempenho             | Acessibilidade | Boas práticas | SEO          | LCP maior | Peso maior |
| ---------------------------------------- | ----- | ---------------------- | -------------- | ------------- | ------------ | --------- | ---------- |
| Home                                     | 1     | 98 (mediana 98)        | 100            | 100           | 100          | 0,7 s     | 669 KB     |
| Hub do Universo                          | 1     | 100 (mediana 100)      | 100            | 100           | 100          | 0,7 s     | 606 KB     |
| Hubs de andar (5)                        | 5     | 100 (mediana 100)      | 100            | 100           | 100          | 0,7 s     | 1853 KB    |
| Páginas de elemento (70)                 | 70    | 99 a 100 (mediana 100) | 100            | 100           | 100          | 0,8 s     | 656 KB     |
| Acomodações e categorias (8)             | 8     | 99 (mediana 99)        | 100            | 100           | 100          | 0,7 s     | 683 KB     |
| O Kaluanã, Restaurante, Ji-Paraná        | 3     | 99 (mediana 99)        | 100            | 100           | 100          | 0,7 s     | 684 KB     |
| Eventos (fora do índice)                 | 1     | 99 (mediana 99)        | 100            | 100           | 66 (noindex) | 0,7 s     | 560 KB     |
| Histórias e posts (4)                    | 4     | 99 a 100 (mediana 100) | 100            | 100           | 100          | 0,7 s     | 641 KB     |
| Reservas, Contato, FAQ, Trabalhe conosco | 4     | 99 (mediana 99)        | 100            | 100           | 100          | 0,7 s     | 564 KB     |
| Legais (2)                               | 2     | 100 (mediana 100)      | 100            | 100           | 100          | 0,6 s     | 498 KB     |
| Obrigado e 404                           | 1     | 100 (mediana 100)      | 100            | 100           | 63 (noindex) | 0,6 s     | 562 KB     |

Nenhuma rota abaixo de 90 em desempenho, acessibilidade, boas práticas ou SEO indexável.

Auditorias reprovadas fora de desempenho: `seo:is-crawlable`.

Orçamento de peso: Home com 669 KB (limite 2.500 KB); páginas de elemento entre 381 e 656 KB (limite 700 KB), todas dentro.

## Todas as rotas

Notas na ordem desempenho, acessibilidade, boas práticas e SEO. Asterisco: página com noindex, em que o SEO reprova de propósito no critério `is-crawlable`.

| Rota                                           | pre, celular   | pre, desktop    | full, celular  | full, desktop   |
| ---------------------------------------------- | -------------- | --------------- | -------------- | --------------- |
| `/acomodacoes`                                 | 91 100 100 69* | 99 100 100 69*  | 91 100 100 100 | 99 100 100 100  |
| `/acomodacoes/duplo-king`                      | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/acomodacoes/suite-presidencial-onca-pintada` | 93 100 100 66* | 99 100 100 66*  | 93 100 100 100 | 99 100 100 100  |
| `/acomodacoes/suite-terraco-lateral-aberto`    | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/acomodacoes/suite-terraco-lateral-fechado`   | 92 100 100 69* | 99 100 100 69*  | 92 100 100 100 | 99 100 100 100  |
| `/acomodacoes/superior-acessivel`              | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/acomodacoes/superior-familia`                | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/acomodacoes/superior-familia-com-terraco`    | 92 100 100 69* | 99 100 100 69*  | 92 100 100 100 | 99 100 100 100  |
| `/contato`                                     | 94 100 100 66* | 99 100 100 66*  | 94 100 100 100 | 99 100 100 100  |
| `/eventos`                                     | 94 100 100 66* | 99 100 100 66*  | 94 100 100 66* | 99 100 100 66*  |
| `/historias`                                   | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/historias/construido-a-vista`                | 94 100 100 69* | 100 100 100 69* | 94 100 100 100 | 100 100 100 100 |
| `/historias/o-rio-que-da-nome-a-cidade`        | 93 100 100 69* | 100 100 100 69* | 93 100 100 100 | 100 100 100 100 |
| `/historias/por-que-kaluana`                   | 94 100 100 69* | 100 100 100 69* | 94 100 100 100 | 100 100 100 100 |
| `/ji-parana`                                   | 93 100 100 69* | 99 100 100 69*  | 93 100 100 100 | 99 100 100 100  |
| `/o-kaluana`                                   | 91 100 100 69* | 99 100 100 69*  | 92 100 100 100 | 99 100 100 100  |
| `/obrigado`                                    | 97 100 100 63* | 100 100 100 63* | 97 100 100 63* | 100 100 100 63* |
| `/perguntas-frequentes`                        | 94 100 100 66* | 99 100 100 66*  | 94 100 100 100 | 99 100 100 100  |
| `/politica-de-privacidade`                     | 96 100 100 100 | 100 100 100 100 | 96 100 100 100 | 100 100 100 100 |
| `/reservas`                                    | 94 100 100 66* | 99 100 100 66*  | 94 100 100 100 | 99 100 100 100  |
| `/restaurante`                                 | 92 100 100 69* | 99 100 100 69*  | 92 100 100 100 | 99 100 100 100  |
| `/termos-de-uso`                               | 97 100 100 100 | 100 100 100 100 | 96 100 100 100 | 100 100 100 100 |
| `/trabalhe-conosco`                            | 94 100 100 66* | 99 100 100 66*  | 94 100 100 100 | 99 100 100 100  |
| `/universo/arvores/acai`                       | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/arvores/andiroba`                   | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/arvores/castanheira`                | 94 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/arvores/ipe`                        | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/arvores/itauba`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/jatoba`                     | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/arvores/jenipapo`                   | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/seringueira`                | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/arvores/tucuma`                     | 93 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/aves/andorinha`                     | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/anu-preto`                     | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/arara`                         | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/beija-flor`                    | 94 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/carcara`                       | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/cardeal-da-amazonia`           | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/coruja`                        | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/curio`                         | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/garca`                         | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/gaviao-real`                   | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/maracana`                      | 93 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/aves/mutum`                         | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/papagaio`                      | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/tangara`                       | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/aves/tucano`                        | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/aves/uirapuru`                      | 95 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/guardioes/jaguatirica`              | 93 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/guardioes/onca-pintada`             | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/bodo`                        | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/cachara`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/caparari`                    | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/curimata`                    | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/curvina`                     | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/filhote`                     | 96 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/jau`                         | 93 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/peixes/lambari`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/matrinxa`                    | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/piau`                        | 94 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/pintado`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/pirarara`                    | 93 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/peixes/pirarucu`                    | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/poraque`                     | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/peixes/sardinha-da-amazonia`        | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/surubim`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/peixes/tambaqui`                    | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/peixes/tucunare`                    | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios`                               | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-amazonas`                  | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-araguaia`                  | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-guapore`                   | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-jamari`                    | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-jurua`                     | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-machado`                   | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-madeira`                   | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-mamore`                    | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-negro`                     | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-purus`                     | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-roosevelt`                 | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-solimoes`                  | 92 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-tapajos`                   | 95 100 100 100 | 100 100 100 100 | 95 100 100 100 | 100 100 100 100 |
| `/universo/rios/rio-xingu`                     | 94 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/arvores`                            | 90 100 100 100 | 100 100 100 100 | 90 100 100 100 | 100 100 100 100 |
| `/universo/aves`                               | 90 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/arvores/angelim`                    | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
| `/universo/arvores/bacaba`                     | 93 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/cedro`                      | 93 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/copaiba`                    | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/arvores/cumaru`                     | 93 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/macaranduba`                | 90 100 100 100 | 100 100 100 100 | 90 100 100 100 | 100 100 100 100 |
| `/universo/arvores/mogno`                      | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/arvores/samauma`                    | 91 100 100 100 | 99 100 100 100  | 91 100 100 100 | 99 100 100 100  |
| `/universo/aves/colhereiro`                    | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/universo/guardioes/jacare-acu`               | 94 100 100 100 | 100 100 100 100 | 94 100 100 100 | 100 100 100 100 |
| `/`                                            | 91 100 100 100 | 98 100 100 100  | 90 100 100 100 | 98 100 100 100  |
| `/universo`                                    | 93 100 100 100 | 100 100 100 100 | 93 100 100 100 | 100 100 100 100 |
| `/universo/peixes`                             | 90 100 100 100 | 100 100 100 100 | 90 100 100 100 | 100 100 100 100 |
| `/universo/arvores/jequitiba`                  | 91 100 100 100 | 100 100 100 100 | 91 100 100 100 | 100 100 100 100 |
| `/universo/guardioes`                          | 92 100 100 100 | 100 100 100 100 | 92 100 100 100 | 100 100 100 100 |
