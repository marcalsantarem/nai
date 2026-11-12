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
| 13 | Bebidas favoritas da Nai | A definir | Entram no cardápio ou viram favorita de um cliente? | Especificação |
| 14 | Recadinhos do cliente especial | A definir | 4 a 8 frases do dono | Especificação |
| 15 | Aparência da barista | A definir | Parecida com a Nai (cabelo, pele, roupa)? | Especificação |
| 16 | Nome da cafeteria editável | A definir | Editável em Ajustes ou fixo em “Nai's Cafe” | Especificação |
| 17 | Quadro-negro | Decidido | Mostra “Nai's Cafe”, como no critério de aceite (diverge do mockup, que mostra “Cardápio”) | Dono, 2026-11-12 |
| 18 | Cartão sem cliente | Decidido | Título só “Aguardando” (a especificação dizia “Aguardando o próximo cliente”) | Dono, 2026-11-12 |
