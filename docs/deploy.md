# Deploy na Vercel

Como o site vai do repositório para a pré-visualização e, depois da aprovação da etapa 6, para o domínio kaluanaecohotel.com.br. Escrito em 12/09/2026 e atualizado em 13/09/2026, com o site no ar. As seções marcadas com "a conferir no painel" dependem de uma tela da Vercel que a CLI não mostra.

## 1. Onde o projeto está

| Item               | Valor                                                                                                    |
| ------------------ | -------------------------------------------------------------------------------------------------------- |
| Time               | Agencia Premium (`team_RL6FAFkzvecSE4DDJIjymkKJ`)                                                        |
| Projeto            | `kaluana-eco-hotel` (`prj_LUw0DYNsSRxLvff6fe5WcST9S1Ca`)                                                 |
| Repositório        | `agenciapremium/kaluana-eco-hotel`, raiz do repositório = pasta `site/`                                  |
| Framework          | Next.js (fixado em `vercel.json`), Node 24                                                               |
| Branch de produção | `main`                                                                                                   |
| Proteção           | Vercel Authentication em todos os deploys, exceto domínios próprios                                      |
| Domínio            | kaluanaecohotel.com.br e www, registrados no Registro.br e associados ao projeto; no ar desde 13/09/2026 |

**Atenção: a `main` publica em produção.** Todo push na `main` gera um deploy de produção. Por isso o trabalho das etapas fica em `etapa-N` e a `main` local só é enviada depois da aprovação da etapa 6.

## 2. Pré-visualização

Todo push numa branch que não é a `main` gera um deploy de pré-visualização com as variáveis do ambiente Preview:

```bash
git push origin etapa-6
vercel ls kaluana-eco-hotel        # a linha mais recente, ambiente Preview
```

A pré-visualização fica atrás do login da Vercel (time Agencia Premium) e leva `X-Robots-Tag: noindex`. Para mostrar ao cliente sem login, use o botão **Share** do deploy no painel. Ele gera um link temporário.

Na pré-visualização, as notas internas aparecem de propósito: minuta jurídica, post a revisar e página de Eventos fora do menu. No deploy de produção elas saem (`lib/site.ts`, `notasInternas`).

## 3. Variáveis de ambiente

As variáveis estão cadastradas como **sensíveis**: a Vercel não mostra o valor depois de gravado. Para conferir, olhe o comportamento do deploy (fase, canônica, formulário), não o painel.

| Variável                         | Production                                           | Preview                          | Obrigatória em produção    | Quem fornece                                                        |
| -------------------------------- | ---------------------------------------------------- | -------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_PHASE`         | `pre`                                                | `pre`                            | Sim                        | Premium (`full` na inauguração)                                     |
| `NEXT_PUBLIC_SITE_URL`           | `https://kaluanaecohotel.com.br`                     | `https://kaluanaecohotel.com.br` | Sim, exatamente esse valor | Premium                                                             |
| `NEXT_PUBLIC_EVENTOS_AUTORIZADO` | `false`                                              | `false`                          | Não (padrão `false`)       | Cliente autoriza                                                    |
| `LEAD_FROM_EMAIL`                | `kaluana@agpremium.com.br` (temporário, decisão 113) | `site@kaluanaecohotel.com.br`    | Sim                        | Premium                                                             |
| `RESEND_API_KEY`                 | gravada em 13/09/2026                                | vazia (envio simulado)           | **Sim**                    | Premium (conta Resend)                                              |
| `LEAD_TO_EMAIL`                  | `kaluana@agpremium.com.br` (temporário)              | vazia                            | **Sim**                    | Cliente (e-mail do hotel). Aceita mais de um, separados por vírgula |
| `NEXT_PUBLIC_GTM_ID`             | pendente                                             | opcional                         | Recomendada                | Premium (setup técnico)                                             |
| `NEXT_PUBLIC_RESERVAS_URL`       | vazio                                                | vazio                            | Não                        | Cliente, quando o motor for contratado                              |
| `NEXT_PUBLIC_BLOQUEAR_TREINO_IA` | vazio                                                | vazio                            | Não (padrão libera)        | Cliente decide                                                      |

Para gravar uma variável:

```bash
vercel env add RESEND_API_KEY production      # cola o valor quando pedir
vercel env add LEAD_TO_EMAIL production
vercel env add NEXT_PUBLIC_GTM_ID production
```

**O build de produção para quando falta variável obrigatória.** O `scripts/check-env.ts` roda no `prebuild`. No build de produção da Vercel, sem `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, a fase ou a URL certa, o deploy falha com a lista do que falta e o deploy anterior continua no ar. É de propósito: sem essas variáveis, os formulários perderiam contatos. Em pré-visualização e em build local, a conferência não se aplica.

Sem `RESEND_API_KEY` na pré-visualização, os formulários funcionam, mas o envio é simulado: nenhum e-mail sai.

## 4. E-mail dos formulários (Resend)

Estado em 13/09/2026: no Resend, o único domínio verificado é `agpremium.com.br`, e o remetente previsto, `site@kaluanaecohotel.com.br`, seria recusado. Por isso remetente e destino estão temporariamente em `kaluana@agpremium.com.br` (decisão 113). Para passar ao domínio do hotel, seguir os passos abaixo, trocar `LEAD_FROM_EMAIL` para `site@kaluanaecohotel.com.br` e `LEAD_TO_EMAIL` para o e-mail do hotel e fazer um redeploy de produção: variável nova só vale a partir do deploy seguinte.

1. Criar a conta ou o time da Premium no Resend e adicionar o domínio `kaluanaecohotel.com.br`.
2. Criar no Registro.br os registros que o Resend pedir (SPF e DKIM em TXT, e o MX de retorno). Sem domínio verificado, a API recusa o envio.
3. Gerar a chave de API com permissão só de envio e gravar em `RESEND_API_KEY` (Production).
4. Gravar em `LEAD_TO_EMAIL` o e-mail do hotel que recebe os contatos.

Todo e-mail sai com "responder para" apontando para quem escreveu. O currículo vai anexado, até 4 MB, e não é guardado em lugar nenhum.

Se a API recusar um envio, o visitante vê "Não conseguimos enviar agora. Tente de novo em instantes." e o motivo fica no log da função na Vercel (`vercel logs`), sem dados pessoais.

## 5. Domínio

Estado em 13/09/2026: os dois domínios estão associados ao projeto, com HTTPS, e servem o deploy de produção. **A configuração ficou invertida:** `kaluanaecohotel.com.br` redireciona (308) para `https://www.kaluanaecohotel.com.br`, enquanto a canônica, o sitemap e o `robots.txt` usam o domínio sem `www`, como pede a Parte 4.2. Para acertar, no painel, em Settings, Domains: editar `www.kaluanaecohotel.com.br` para redirecionar com 308 para `kaluanaecohotel.com.br` e deixar o domínio sem `www` sem redirecionamento. Depois, repetir a conferência do passo 4.

Para referência, a associação feita:

```bash
vercel domains add kaluanaecohotel.com.br kaluana-eco-hotel
vercel domains add www.kaluanaecohotel.com.br kaluana-eco-hotel
# no painel, em Settings, Domains: www com redirecionamento 308 para kaluanaecohotel.com.br
```

Passos, **o DNS só depois da aprovação da etapa 6 e do deploy de produção**:

1. No projeto, adicionar `kaluanaecohotel.com.br` e `www.kaluanaecohotel.com.br`, com o `www` redirecionando para o domínio sem `www` (Parte 4.2, item 1).
2. No Registro.br, criar os registros que a Vercel mostrar para o projeto (a conferir no painel, em Settings, Domains): um A para o domínio raiz e um CNAME para o `www`.
3. Esperar a verificação e o certificado. A Vercel emite o HTTPS sozinha.
4. Conferir `https://kaluanaecohotel.com.br`, `http://kaluanaecohotel.com.br` e `https://www.kaluanaecohotel.com.br`: os dois últimos devem redirecionar para o primeiro.

## 6. Ida para produção

Em 13/09/2026, a pedido do responsável, o último build da `etapa-6` foi promovido direto para produção (`vercel promote`), sem passar pela `main`. **Enquanto a `etapa-6` não for integrada, não envie a `main`:** o push publicaria código anterior, e o `check-env` já não segura, porque as variáveis estão gravadas.

O caminho normal, depois do "aprovado":

1. Resolver os bloqueios da lista em `docs/etapas.md` (etapa 6, "Antes de apontar o domínio"): variáveis de e-mail, validação jurídica das minutas e revisão dos três posts.
2. Integrar a etapa na `main` e enviar:
   ```bash
   git checkout main
   git merge --no-ff etapa-6
   git push origin main
   ```
3. Acompanhar o build (`vercel ls`, `vercel inspect <url>`). Se o `check-env` parar o build, gravar as variáveis e usar **Redeploy** no painel.
4. Conferir o deploy de produção em `https://kaluana-eco-hotel.vercel.app` (a URL leva `noindex` por causa do cabeçalho de `next.config.ts`).
5. Apontar o domínio (seção 5).
6. No Google Search Console, adicionar a propriedade de domínio e enviar `https://kaluanaecohotel.com.br/sitemap.xml`.
7. Rodar o QA de fumaça no domínio: Home, um andar, uma página de elemento, `/q/112`, envio real de um formulário para o e-mail do hotel.

**Voltar atrás:** no painel, em Deployments, escolher o deploy anterior e usar **Instant Rollback**, ou pela CLI, `vercel rollback`.

## 7. Fase completa, na inauguração

1. `vercel env rm NEXT_PUBLIC_SITE_PHASE production` e `vercel env add NEXT_PUBLIC_SITE_PHASE production` com `full`.
2. Se o motor de reservas estiver contratado, gravar `NEXT_PUBLIC_RESERVAS_URL`.
3. Redeploy de produção. Entram o menu completo, Acomodações, as páginas institucionais no índice, os números de quarto no Universo e as contagens.
4. Gerar a tabela das placas com `npm run qa:qr -- --phase=full --url=<servidor> --csv` (grava `docs/qr-codes.csv`, fora do git porque lista as 70 UHs) e imprimir os QR Codes. O endereço de cada placa é `https://kaluanaecohotel.com.br/q/<número>` e não muda se o nome do quarto mudar.

## 8. O que está no ar

Em 13/09/2026, às 08:35, a produção passou a ser a pré-visualização da `etapa-6` promovida (deploy `nitr623o9`, commit `e990a0a`), na fase `pre`. No mesmo dia, os ajustes pedidos depois dessa publicação (cabeçalho, filtro, som e fotos) foram promovidos da mesma forma; o deploy atual aparece em `vercel ls kaluana-eco-hotel --environment production`. Ele responde em `https://www.kaluanaecohotel.com.br` e, com `noindex`, em `https://kaluana-eco-hotel.vercel.app`.

Conferido no ar: Home indexável, com a canônica `https://kaluanaecohotel.com.br` e o cabeçalho da fase `pre`; nenhum campo pendente, TODO ou telefone provisório; páginas legais sem o aviso de minuta; `robots.txt` bloqueando `/q/`, `/obrigado` e `/eventos`; `sitemap.xml` com 77 endereços; `llms.txt` sem auditório; `/q/101` com 301 para o rio Amazonas; 404 real; Eventos e Acomodações com `noindex`; `http` e domínio sem `www` redirecionando.

Falta conferir: o envio real de um formulário e a inversão do domínio principal (seção 5).

**Voltar atrás:** Instant Rollback no painel ou `vercel rollback` para o deploy anterior: `nitr623o9`, a primeira publicação da etapa 6, ou, se preciso, `kmziqaa4b`, a etapa 1.
