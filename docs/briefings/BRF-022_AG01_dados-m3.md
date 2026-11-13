# BRF-022 — AG01 (Gameplay) — T-024 Dados da decoração

**Objetivo:** acrescentar a `js/data.js` o conteúdo do M3, no formato da seção “M3 — Decoração” de `docs/arquitetura.md` (BRF-021).

**Ler:** especificação, Conteúdo (Decoração) e Cores da sala; `docs/arquitetura.md` (M3).

**Pronto quando** `js/data.js` exporta:
- Os 17 itens com id, nome, onde (chão/parede), preço e marcações (regável, tapete por baixo, emite brilho, +2 lugares, limite 1, mostra a hora, pisca, solta notas), com os valores exatos da especificação, e a aba da loja de cada um.
- 5 cores de parede (verde sálvia, rosa, azul céu, amarelo manteiga, lilás) e 3 pisos (madeira clara, xadrez, madeira escura), gratuitos, com as cores de cada um. As cores da sala atual da especificação são o padrão (identifique qual parede e qual piso são); para as demais, proponha tons na paleta do jogo e marque como [Proposta] num comentário.
- O layout inicial (itens de chão e de parede com ladrilho/posição) e as áreas reservadas atualizadas, conforme a arquitetura.
- Nada do que já existe muda de nome; `ROOM.seats` só muda se a arquitetura mandar.

**Arquivos permitidos:** só `js/data.js`.

**Validação:** importar no Node sem erro; 17 itens, soma e preços conferidos contra a especificação; nenhum item do layout inicial em ladrilho reservado ou repetido; rode de novo o teste de 30 min da simulação.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
