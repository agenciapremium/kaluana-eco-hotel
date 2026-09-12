# Registro de áudio

Origem e licença de cada loop de som ambiente em `public/audio/<andar>/`. Regras na seção 8 do CLAUDE.md: nunca toca sem clique, bancos por andar, Opus com fallback AAC, mono, 48 kbps.

## Etapa 1: placeholders sintetizados

Os cinco loops abaixo foram gerados por `scripts/build-audio.ts` com o ffmpeg (fonte `anoisesrc`, ruído marrom ou rosa filtrado, com uma "respiração" lenta em tremolo). Não há gravação de terceiros nem licença envolvida. Servem só para exercitar o componente `AmbientAudio` (crossfade, fades, pausa ao perder foco, estado na sessão). Devem ser substituídos na etapa 3.

| Andar | Arquivo | Duração | Origem | Licença | Status |
|---|---|---|---|---|---|
| Rios | `rios/exemplo-1.webm` e `.m4a` | 30 s | Síntese (ffmpeg, ruído marrom, passa-baixa 900 Hz) | Própria | Placeholder, substituir na etapa 3 |
| Peixes | `peixes/exemplo-1.webm` e `.m4a` | 30 s | Síntese (ruído marrom, passa-baixa 500 Hz) | Própria | Placeholder, substituir na etapa 3 |
| Árvores | `arvores/exemplo-1.webm` e `.m4a` | 30 s | Síntese (ruído rosa, passa-baixa 2,5 kHz) | Própria | Placeholder, substituir na etapa 3 |
| Aves | `aves/exemplo-1.webm` e `.m4a` | 30 s | Síntese (ruído rosa, passa-baixa 4 kHz) | Própria | Placeholder, substituir na etapa 3 |
| Guardiões | `guardioes/exemplo-1.webm` e `.m4a` | 30 s | Síntese (ruído marrom, passa-baixa 300 Hz) | Própria | Placeholder, substituir na etapa 3 |

## Etapa 3: bancos reais (a preencher)

Ordem de preferência (CLAUDE.md, seção 8): gravações de campo da Premium em Rondônia; bibliotecas CC0 (Freesound com filtro CC0, Pixabay); cantos de aves do xeno-canto com a licença de cada gravação; por último, geração em serviço dedicado de efeitos sonoros. Cada arquivo entra aqui com autor, URL, licença e data.

| Andar | Arquivo | Duração | Autor | URL | Licença | Data |
|---|---|---|---|---|---|---|
| | | | | | | |
