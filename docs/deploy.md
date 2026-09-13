# Deploy na Vercel

Como o site vai do repositório para a pré-visualização e, depois da aprovação da etapa 6, para o domínio kaluanaecohotel.com.br. Escrito em 12/09/2026. As seções marcadas com "a conferir no painel" dependem de uma tela da Vercel que a CLI não mostra.

## 1. Onde o projeto está

| Item               | Valor                                                                               |
| ------------------ | ----------------------------------------------------------------------------------- |
| Time               | Agencia Premium (`team_RL6FAFkzvecSE4DDJIjymkKJ`)                                   |
| Projeto            | `kaluana-eco-hotel` (`prj_LUw0DYNsSRxLvff6fe5WcST9S1Ca`)                            |
| Repositório        | `agenciapremium/kaluana-eco-hotel`, raiz do repositório = pasta `site/`             |
| Framework          | Next.js (fixado em `vercel.json`), Node 24                                          |
| Branch de produção | `main`                                                                              |
| Proteção           | Vercel Authentication em todos os deploys, exceto domínios próprios                 |
| Domínio            | kaluanaecohotel.com.br, registrado no Registro.br, com o DNS do próprio Registro.br |

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

| Variável                         | Production                       | Preview                          | Obrigatória em produção    | Quem fornece                                                        |
| -------------------------------- | -------------------------------- | -------------------------------- | -------------------------- | ------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_PHASE`         | `pre`                            | `pre`                            | Sim                        | Premium (`full` na inauguração)                                     |
| `NEXT_PUBLIC_SITE_URL`           | `https://kaluanaecohotel.com.br` | `https://kaluanaecohotel.com.br` | Sim, exatamente esse valor | Premium                                                             |
| `NEXT_PUBLIC_EVENTOS_AUTORIZADO` | `false`                          | `false`                          | Não (padrão `false`)       | Cliente autoriza                                                    |
| `LEAD_FROM_EMAIL`                | `site@kaluanaecohotel.com.br`    | igual                            | Sim                        | Premium                                                             |
| `RESEND_API_KEY`                 | pendente                         | opcional                         | **Sim**                    | Premium (conta Resend)                                              |
| `LEAD_TO_EMAIL`                  | pendente                         | opcional                         | **Sim**                    | Cliente (e-mail do hotel). Aceita mais de um, separados por vírgula |
| `NEXT_PUBLIC_GTM_ID`             | pendente                         | opcional                         | Recomendada                | Premium (setup técnico)                                             |
| `NEXT_PUBLIC_RESERVAS_URL`       | vazio                            | vazio                            | Não                        | Cliente, quando o motor for contratado                              |
| `NEXT_PUBLIC_BLOQUEAR_TREINO_IA` | vazio                            | vazio                            | Não (padrão libera)        | Cliente decide                                                      |

Para gravar uma variável:

```bash
vercel env add RESEND_API_KEY production      # cola o valor quando pedir
vercel env add LEAD_TO_EMAIL production
vercel env add NEXT_PUBLIC_GTM_ID production
```

**O build de produção para quando falta variável obrigatória.** O `scripts/check-env.ts` roda no `prebuild`. No build de produção da Vercel, sem `RESEND_API_KEY`, `LEAD_TO_EMAIL`, `LEAD_FROM_EMAIL`, a fase ou a URL certa, o deploy falha com a lista do que falta e o deploy anterior continua no ar. É de propósito: sem essas variáveis, os formulários perderiam contatos. Em pré-visualização e em build local, a conferência não se aplica.

Sem `RESEND_API_KEY` na pré-visualização, os formulários funcionam, mas o envio é simulado: nenhum e-mail sai.

## 4. E-mail dos formulários (Resend)

1. Criar a conta ou o time da Premium no Resend e adicionar o domínio `kaluanaecohotel.com.br`.
2. Criar no Registro.br os registros que o Resend pedir (SPF e DKIM em TXT, e o MX de retorno). Sem domínio verificado, a API recusa o envio.
3. Gerar a chave de API com permissão só de envio e gravar em `RESEND_API_KEY` (Production).
4. Gravar em `LEAD_TO_EMAIL` o e-mail do hotel que recebe os contatos.

Todo e-mail sai com "responder para" apontando para quem escreveu. O currículo vai anexado, até 4 MB, e não é guardado em lugar nenhum.

Se a API recusar um envio, o visitante vê "Não conseguimos enviar agora. Tente de novo em instantes." e o motivo fica no log da função na Vercel (`vercel logs`), sem dados pessoais.

## 5. Domínio

Estado em 12/09/2026: o domínio usa o DNS do Registro.br e não tem registro A. Nada responde em kaluanaecohotel.com.br. O domínio **ainda não está associado ao projeto** na Vercel: a associação é uma mudança de domínio que pede autorização explícita do responsável da Premium, e ficou para ele fazer ou autorizar.

A associação pode ser feita antes da aprovação, porque sem o DNS apontado nada vai ao ar. Só não aponte o DNS antes do deploy de produção da etapa 6: o domínio passaria a mostrar o deploy de produção atual, que ainda é o da etapa 1.

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

Só depois do "aprovado" da etapa 6:

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

## 8. O que já está no ar e precisa de atenção

Os pushes da `main` da etapa 1 geraram deploys de produção. O último, de 12/09/2026, responde publicamente em `https://kaluana-eco-hotel.vercel.app` com a Home da etapa 1 e sem `noindex`. Não há domínio apontado e nenhum link público leva a ele. O cabeçalho `X-Robots-Tag: noindex` para endereços `*.vercel.app` entra no próximo deploy de produção. Se quiser tirar esse endereço do ar antes, a opção é pausar o projeto no painel (Settings, General), que também pausa as pré-visualizações.
