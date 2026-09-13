# Roteiro de conferência com leitor de tela

O `npm run qa:a11y` confere a árvore de acessibilidade, a mesma que os leitores de tela leem, e grava uma por modelo de página em `aria/`. Este roteiro é a conferência humana que complementa isso: ouvir o site. Leva cerca de 40 minutos por leitor. Faça no deploy de pré-visualização.

## Leitores e atalhos

| Leitor    | Onde                       | Liga e desliga           | Próximo item             | Lista de títulos                        | Lista de marcos           |
| --------- | -------------------------- | ------------------------ | ------------------------ | --------------------------------------- | ------------------------- |
| VoiceOver | macOS, Safari              | Cmd+F5                   | Ctrl+Option+Seta direita | Ctrl+Option+U, depois setas até Títulos | Ctrl+Option+U, até Marcos |
| VoiceOver | iPhone, Safari             | Ajustes, Acessibilidade  | Deslizar para a direita  | Rotor (girar dois dedos) em Títulos     | Rotor em Marcos           |
| TalkBack  | Android, Chrome            | Botões de volume por 3 s | Deslizar para a direita  | Menu do TalkBack, Títulos               | Menu do TalkBack, Marcos  |
| NVDA      | Windows, Firefox ou Chrome | Ctrl+Alt+N               | Seta para baixo          | H (próximo título), Insert+F7           | D (próximo marco)         |

## Roteiro

Marque cada item com "ok" ou descreva o que ouviu.

### 1. Home (fase `pre`)

1. Carregue a página e aperte Tab uma vez: o leitor anuncia "Pular para o conteúdo, link".
2. Na primeira visita, o banner aparece: com Tab, os botões "Só o essencial" e "Aceitar" vêm logo depois do atalho.
3. Liste os marcos: banner (cabeçalho), principal, informações de conteúdo (rodapé), região "Cookies e medição" enquanto o banner estiver aberto.
4. Liste os títulos: um único título de nível 1, com o nome da página; os blocos seguintes em nível 2.
5. Vá ao formulário "Avisamos você primeiro". Cada campo anuncia o rótulo: Nome, E-mail, Telefone, Sou, Empresa (se for o caso).
6. Preencha o telefone com letras e envie. O leitor anuncia "Confira os campos marcados." e o foco vai para o campo Telefone, que é lido como inválido, com "Confira o telefone.".

### 2. Hub do Universo (`/universo`)

1. O marco de navegação "Andares" lista os quatro andares; o andar em tela é anunciado como atual.
2. Na busca, digite "ma": o leitor anuncia a quantidade de resultados. Tab leva aos resultados, que são links com o nome e o andar. Escape limpa o campo.

### 3. Página de elemento aberta pelo QR (`/q/112`)

1. A página abre em Rio Machado. A região "Informações do seu quarto" traz "Você está no quarto Rio Machado" e os links Wi-Fi e recepção, Restaurante, Check-out, a categoria e o próximo quarto.
2. O botão "Ouvir o ambiente" é lido como botão. Ao acionar, passa a "Silenciar". Não pode ser lido como "pressionado".
3. O nome científico é lido em latim, quando o leitor tem a voz instalada.
4. As perguntas no fim da página são itens recolhíveis: o leitor anuncia "recolhido" e, ao abrir, "expandido".

### 4. Perguntas frequentes

1. A busca anuncia a quantidade de perguntas ao digitar.
2. Os temas são títulos de nível 3 e cada pergunta abre e fecha pelo teclado.

### 5. Contato

1. "Ver mapa" é um botão. Ao acionar, o foco vai para a região "Mapa", e o iframe é lido como "Mapa do Kaluanã Eco Hotel".
2. Envie o formulário vazio: cada campo obrigatório é anunciado como obrigatório.

### 6. Trabalhe conosco

1. O campo de arquivo anuncia "Currículo em PDF ou DOCX, até 4 MB (opcional)".
2. Escolha uma imagem PNG: a mensagem "Envie o currículo em PDF ou DOCX." fica ligada ao campo e é lida quando ele recebe foco.

### 7. Eventos (link direto, fora do menu)

1. Aperte "Continuar" sem escolher o tipo de evento: o leitor anuncia o campo obrigatório e o foco fica nele.
2. Escolha o tipo e continue: o leitor anuncia "Passo 2 de 3: Você" e o foco vai para Nome.

### 8. Menu do celular (fase `full`)

1. No celular, o botão "Abrir menu" é lido como recolhido. Ao abrir, passa a expandido e o foco vai para o primeiro link.
2. Deslizando, o leitor não sai do menu para o conteúdo atrás dele.
3. No teclado, Escape fecha e o foco volta ao botão.

### 9. Página que não existe (`/rota-que-nao-existe`)

1. Um título de nível 1, os atalhos e a busca do Universo, com a mesma leitura do item 2.

## Resultado

| Leitor           | Data | Quem conferiu | Itens ok | Observações |
| ---------------- | ---- | ------------- | -------- | ----------- |
| VoiceOver macOS  |      |               |          |             |
| VoiceOver iPhone |      |               |          |             |
| TalkBack         |      |               |          |             |
| NVDA             |      |               |          |             |
