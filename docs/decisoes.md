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
| 11 | Arquivo de versão | Decidido | `js/version.js` (módulo ES) é o único lugar da versão. O `index.html` registra `sw.js?v=<VERSION>` e o `sw.js` lê `v` da própria URL para nomear o cache (`nais-cafe-<versão>`); caches antigos são apagados no `activate`. Trocar a versão a cada publicação | AG00, AG05 |
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
| 26 | Colocar móvel | Decidido | Dois toques: o 1º escolhe o ladrilho (verde, móvel transparente), o 2º no mesmo ladrilho confirma | Dono, 2026-11-13 |
| 27 | Quadrinho azul | Decidido | Fica na sala inicial como um 2º item “Quadro”, que pode ser movido e guardado | Dono, 2026-11-13 |
| 28 | Banquinhos | Decidido | Os ladrilhos dos banquinhos ao lado da mesa ficam bloqueados para outros itens | Dono, 2026-11-13 |
| 29 | Caminha do gato | Decidido | A sala começa sem a caminha; o gato chega quando ela for comprada (60 moedas, limite 1) | Dono, 2026-11-13 |
| 30 | Espaços de parede | Decidido | Esquerda: 2 altos e 4 médios. Direita: 1 médio novo entre o quadro-negro e a janela, que foram levemente afastados (diferença pequena do mockup aceita). Na sala inicial sobram 2 médios e 1 alto livres (T-054) | Dono, 2026-11-13 |
| 31 | Ideias para depois do v1.0 | Proposta | Sala que cresce como recompensa (ex.: ampliação com X bebidas servidas); câmera móvel com zoom (hoje fixa; exige rever a regra de só toque único) | Dono, 2026-11-13 |
| 32 | Cores de parede e piso | Decidido | Tons propostos para rosa, azul céu, amarelo manteiga, lilás, madeira clara e madeira escura aprovados como estão em `js/data.js` | Dono, 2026-11-13 |
| 33 | Tapete sob outro móvel | Decidido | O toque levanta o móvel de cima; para mover o tapete, primeiro tira-se o móvel de cima | AG00, 2026-11-13 |
| 34 | Cliente especial | Decidido | O M4 fecha sem o cliente especial; a T-035 passa para o M5 e sai quando o dono mandar os recadinhos | Dono, 2026-11-13 |
