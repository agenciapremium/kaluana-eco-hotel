# Registro de áudio

Origem e licença de cada loop de som ambiente em `public/audio/<andar>/`. Regras na seção 8 do CLAUDE.md: nunca toca sem clique, bancos por andar, Opus com fallback AAC, mono, 48 kbps.

## Etapa 1: placeholders sintetizados

Os cinco loops abaixo foram gerados por `scripts/build-audio.ts` com o ffmpeg (fonte `anoisesrc`, ruído marrom ou rosa filtrado, com uma "respiração" lenta em tremolo). Não há gravação de terceiros nem licença envolvida. Servem só para exercitar o componente `AmbientAudio` (crossfade, fades, pausa ao perder foco, estado na sessão). Devem ser substituídos na etapa 3.

| Andar     | Arquivo                             | Duração | Origem                                             | Licença | Status                             |
| --------- | ----------------------------------- | ------- | -------------------------------------------------- | ------- | ---------------------------------- |
| Rios      | `rios/exemplo-1.webm` e `.m4a`      | 30 s    | Síntese (ffmpeg, ruído marrom, passa-baixa 900 Hz) | Própria | Placeholder, substituir na etapa 3 |
| Peixes    | `peixes/exemplo-1.webm` e `.m4a`    | 30 s    | Síntese (ruído marrom, passa-baixa 500 Hz)         | Própria | Placeholder, substituir na etapa 3 |
| Árvores   | `arvores/exemplo-1.webm` e `.m4a`   | 30 s    | Síntese (ruído rosa, passa-baixa 2,5 kHz)          | Própria | Placeholder, substituir na etapa 3 |
| Aves      | `aves/exemplo-1.webm` e `.m4a`      | 30 s    | Síntese (ruído rosa, passa-baixa 4 kHz)            | Própria | Placeholder, substituir na etapa 3 |
| Guardiões | `guardioes/exemplo-1.webm` e `.m4a` | 30 s    | Síntese (ruído marrom, passa-baixa 300 Hz)         | Própria | Placeholder, substituir na etapa 3 |

## Etapa 3: bancos por andar e cantos de ave

### O que mudou

Os cinco loops de exemplo da etapa 1 saíram. Cada andar passou a ter de três a quatro loops de 45 s, um por cena da seção 8 do CLAUDE.md, e o Andar das Aves ganhou dez cantos reais de espécie.

A escolha do loop por elemento também mudou: o hash djb2 puro, com resto por um número pequeno, agrupava slugs parecidos no mesmo balde (nove dos catorze rios caíam em "barco ao longe"). Agora o hash passa pelo finalizador do MurmurHash3 antes do resto, em `lib/copy.ts`. Continua determinístico: o mesmo quarto soa sempre igual, quartos vizinhos soam diferente.

### Ambiente por andar: ainda sintetizado

Gerados por `scripts/build-audio.ts` com o ffmpeg (ruído de cor filtrado, com movimento lento de amplitude e uma camada esparsa de eventos). Não há gravação de terceiros nem licença envolvida. A ordem de preferência da seção 8 começa por gravações de campo da própria equipe da Premium em Rondônia, que ainda não existem; quando existirem, basta trocar os arquivos em `public/audio/<andar>/` e a linha aqui.

| Andar     | Arquivo                        | Cena                           | Duração | Origem           | Licença | Status     |
| --------- | ------------------------------ | ------------------------------ | ------- | ---------------- | ------- | ---------- |
| Rios      | `rios/correnteza`              | Correnteza                     | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Rios      | `rios/margem-insetos`          | Margem com insetos             | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Rios      | `rios/chuva-no-rio`            | Chuva no rio                   | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Rios      | `rios/barco-ao-longe`          | Barco ao longe                 | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Peixes    | `peixes/agua-sob-a-superficie` | Água corrente sob a superfície | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Peixes    | `peixes/bolhas`                | Bolhas                         | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Peixes    | `peixes/remo`                  | Remo                           | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Peixes    | `peixes/chuva-na-agua`         | Chuva na água                  | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Árvores   | `arvores/folhas-ao-vento`      | Folhas ao vento                | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Árvores   | `arvores/cigarras`             | Cigarras                       | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Árvores   | `arvores/mata-ao-amanhecer`    | Mata ao amanhecer              | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Árvores   | `arvores/chuva-leve-na-copa`   | Chuva leve na copa             | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Aves      | `aves/mata-com-cantos`         | Mata com cantos                | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Aves      | `aves/amanhecer`               | Amanhecer                      | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Aves      | `aves/entardecer`              | Entardecer                     | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Aves      | `aves/vento-alto`              | Vento no andar mais alto       | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Guardiões | `guardioes/noite-na-floresta`  | Noite na floresta              | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Guardiões | `guardioes/grilos`             | Grilos                         | 45 s    | Síntese (ffmpeg) | Própria | Provisório |
| Guardiões | `guardioes/agua-parada`        | Água parada                    | 45 s    | Síntese (ffmpeg) | Própria | Provisório |

### Cantos de ave: gravações reais, com atribuição

Origem: xeno-canto, republicado no Wikimedia Commons, que traz autor, licença e link da gravação original no metadado do arquivo. Baixados e convertidos por `scripts/build-cantos.ts` (25 s, mono, 48 kbps, normalizados, com fade nas pontas). Todos em CC BY-SA: o crédito aparece no rodapé de autoria da página do elemento e nesta tabela. Autorizado pelo responsável da Premium em 12/09/2026.

**Critério de espécie.** O mesmo da regra 6 do CLAUDE.md para imagens: a gravação só entra se a espécie estiver dentro do táxon que o YAML declara para aquele quarto. Onde o YAML nomeia uma espécie e o Commons só tem uma vizinha, a página fica sem canto e usa o banco do andar.

| Ave                 | Espécie gravada                                   | Táxon do quarto       | Autor          | Licença      | Fonte                                                                                                      |
| ------------------- | ------------------------------------------------- | --------------------- | -------------- | ------------ | ---------------------------------------------------------------------------------------------------------- |
| arara               | Ara macao (araracanga)                            | Ara spp.              | Ganesh Mohan T | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AScarlet_macaw_01.wav                                             |
| tucano              | Ramphastos tucanus (tucano-grande-de-papo-branco) | Ramphastos spp.       | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3ARamphastos_tucanus_-_White-throated_Toucan_XC251458.mp3          |
| papagaio            | Amazona farinosa (papagaio-moleiro)               | Amazona spp.          | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AAmazona_farinosa_-_Mealy_Amazon_XC250466.mp3                     |
| uirapuru            | Cyphorhinus arada (uirapuru-verdadeiro)           | Cyphorhinus arada     | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3ACyphorhinus_arada_-_Musician_Wren_XC242525.mp3                   |
| beija-flor          | Phaethornis guy (rabo-branco-verde)               | Trochilidae           | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3APhaethornis_guy_-_Green_Hermit_XC251325.mp3                      |
| coruja              | Megascops choliba (corujinha-do-mato)             | Strigiformes          | Diego Cueva    | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AMegascops_choliba_-_Tropical_Screech_Owl_XC428741.mp3            |
| tangara             | Chiroxiphia pareola (tangará-falso)               | Pipridae              | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AChiroxiphia_pareola_-_Blue-backed_Manakin_XC249078.mp3           |
| curio               | Sporophila angolensis (curió)                     | Sporophila angolensis | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AOryzoborus_angolensis_-_Chestnut-bellied_Seed_Finch_XC242912.mp3 |
| andorinha           | Progne chalybea (andorinha-grande)                | Hirundinidae          | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AProgne_chalybea_-_Grey-breasted_Martin_XC243000.mp3              |
| cardeal-da-amazonia | Paroaria gularis (cardeal-da-amazônia)            | Paroaria gularis      | Niels Krabbe   | CC BY-SA 4.0 | https://commons.wikimedia.org/wiki/File%3AParoaria_gularis_-_Red-capped_Cardinal_XC242921.mp3              |

### Aves sem canto

O Commons não tem gravação com licença compatível da espécie certa. Estas páginas usam o banco do Andar das Aves. Para completar, a saída é uma conta gratuita no xeno-canto (a API v3 exige chave) ou gravação própria.

| Ave         | Espécie declarada                            | Motivo                                                                   |
| ----------- | -------------------------------------------- | ------------------------------------------------------------------------ |
| Gavião-real | Harpia harpyja                               | Commons não tem a espécie; a alternativa era Spizaetus tyrannus          |
| Garça       | Ardea alba e Ardea cocoi                     | sem gravação com licença compatível                                      |
| Mutum       | Crax spp. e Mitu spp.                        | sem gravação com licença compatível                                      |
| Carcará     | Caracara plancus                             | Commons não tem a espécie; a alternativa era Daptrius ater               |
| Maracanã    | Primolius maracana e Orthopsittaca manilatus | Commons não tem as espécies; a alternativa era Psittacara leucophthalmus |
| Anu-preto   | Crotophaga ani                               | Commons não tem a espécie; a alternativa era Crotophaga sulcirostris     |
| Colhereiro  | Platalea ajaja                               | sem gravação com licença compatível                                      |
