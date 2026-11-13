# Registro de decisões

Estados: **Decidido** (regra) · **Proposta** (não aprovada) · **A definir** (em aberto).
Ao mudar uma decisão, atualize esta tabela e, se for o caso, o `CLAUDE.md`.

| # | Tema | Estado | Decisão / opções | Origem |
|---|---|---|---|---|
| 1 | Coordenação | Decidido | O Claude principal é o AG00 (líder), único interlocutor do dono; gerencia e não implementa | Dono, 2026-11-12 |
| 2 | Forma dos agentes | Decidido | Subagents em `.claude/agents/`, instruções em `docs/agentes/`, acionados por briefing | Dono, 2026-11-12 |
| 3 | Git | Decidido | Ver [git-workflow.md](git-workflow.md) | Dono, 2026-11-12 |
| 4 | Idioma | Decidido | Docs, commits e conversa em pt-BR; código em inglês; jogo em pt-BR | Dono |
| 5 | Economia de tokens | Decidido | Mínimo gasto em todas as interações | Dono |
| 6 | Stack | Decidido | HTML, CSS, JS puro (módulos ES), sem framework e sem build | Especificação |
| 7 | Referências | Decidido | `docs/especificacao.md` e `docs/referencia/mockup-mobile.html` (nome do mockup troca para “Nai's Cafe”) | Especificação |
| 8 | Protótipo antigo | Decidido | Descartado; os ícones ficam em `icons/` (mesmo caminho previsto na especificação). O código continua no histórico do git | Dono, 2026-11-12 |
| 9 | Deploy | Decidido | Já configurado no Netlify, sem build: push na `dev` atualiza https://dev--naicafe.netlify.app; merge de PR na `main` atualiza https://naicafe.netlify.app | Dono, 2026-11-12 |
| 10 | Marcos | Proposta | Os marcos seguem as 5 etapas da especificação (ver [roadmap.md](roadmap.md)) | AG00 |
| 11 | Arquivo de versão | Proposta | `js/version.js` é o único lugar da versão. No M5 o AG05 propõe virar script clássico (`self.VERSION`) lido pelo `sw.js` via `importScripts` | AG00, AG05 |
| 12 | Time de agentes | Proposta | AG01–AG06, ver [00_biblia_projeto.md](00_biblia_projeto.md) | AG00 |
| 13 | Bebidas favoritas da Nai | Decidido | Café com leite batido e cappuccino (já existe). “Café com leite batido” é a 8ª receita: Moer, Espresso, Espuma, Leite; 12 moedas; libera com 10 bebidas. O cardápio passa a ter 8 receitas (critério de aceite “7 receitas” vira 8) | Dono, 2026-11-12 |
| 14 | Recadinhos do cliente especial | A definir | 4 a 8 frases; o dono escreve depois. Trava a T-035 | Dono, 2026-11-12 |
| 15 | Aparência da barista | Decidido | Parecida com a Nai: pele levemente morena, cabelo cacheado castanho-escuro | Dono, 2026-11-12 |
| 16 | Nome da cafeteria editável | Decidido | Editável em Ajustes (até 24 caracteres; padrão “Nai's Cafe”) | Dono, 2026-11-12 |
| 17 | Quadro-negro | Decidido | Mostra “Nai's Cafe”, como no critério de aceite (diverge do mockup, que mostra “Cardápio”) | Dono, 2026-11-12 |
| 18 | Cartão sem cliente | Decidido | Título só “Aguardando” (a especificação dizia “Aguardando o próximo cliente”) | Dono, 2026-11-12 |
| 19 | Clientes comuns | Decidido | Têm nomes brasileiros comuns, sorteados de uma lista em `js/data.js` | Dono, 2026-11-12 |
| 20 | Barra de progresso no M2 | Decidido | Conta as servidas e fica parada ao atingir 6 até a liberação de receitas no M4 | Dono, 2026-11-12 |
| 21 | Primeiro cliente | Decidido | Chega cerca de 2 s depois de abrir; os seguintes seguem 7–14 s | Dono, 2026-11-12 |
| 22 | Cliente sem lugar | Decidido | Sai com o copo e também solta um coração | Dono, 2026-11-12 |
| 23 | Barra e nível no M2 | Decidido | Com 6 servidas a legenda diz “O Mocha chega em breve”; o nível já sobe nos marcos desde o M2 | Dono, 2026-11-12 |
| 24 | Voltar do Preparo | Decidido | Guarda os passos já feitos; o cliente continua na fila | Dono, 2026-11-12 |
| 25 | Marcos de receita | Decidido | 6, 10, 14 e 24 servidas (decisão 13 vale sobre o texto antigo da especificação) | AG00, 2026-11-12 |
