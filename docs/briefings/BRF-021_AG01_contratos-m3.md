# BRF-021 — AG01 (Gameplay) — T-023 Contratos da decoração

**Objetivo:** acrescentar a `docs/arquitetura.md` os contratos do M3, para AG01, AG02 (UI) e AG03 (Arte) trabalharem em paralelo.

**Ler:** especificação, seções Mecânicas (Decoração), Telas (Decorar), Conteúdo (Decoração), Dados salvos e Cores da sala; `docs/arquitetura.md` atual (itens 9.6 e 9.7); `ROOM` em `js/data.js`; `INITIAL_LAYOUT` e `drawScene` em `js/art.js` (trechos); backlog do M3 (T-024 a T-030). Mockup: `docs/referencia/mockup-src/03-decorar.html` (só o README dela e trechos).

**Pronto quando** `docs/arquitetura.md` ganha uma seção “M3 — Decoração” (máx. ~120 linhas) com:
1. **Layout como estado:** a sala deixa de ser fixa. Formato de `items` (chão: tipo + ladrilho), `wallItems` (tipo + parede + posição), `stock`, `wall`, `floor`, igual aos campos salvos da especificação. Tabela com o ladrilho/posição inicial de cada móvel do mockup (resolve o item 9.6), incluindo o que é fixo e não é item (balcão, máquina, porta, quadro-negro, janela, luminárias pendentes).
2. **Ocupação:** 1 ladrilho por item de chão; tapete por baixo sem bloquear; espaços de parede (quantos por parede e onde); `reservedTiles` e paredes reservadas, incluindo o ladrilho (1,2) da fila (item 9.7) e os pontos de passagem; limite de 1 caminha.
3. **API das regras** (em `state.js` ou módulo novo `js/decor.js`, decida e justifique em 1 linha): comprar, iniciar colocação, ladrilhos livres para um tipo, colocar, levantar para mover, guardar, trocar cor de parede e piso; o que cada chamada devolve e que eventos dispara.
4. **Efeito na simulação:** lugares das mesas passam a vir do layout (mesa = 2 lugares, com as posições dos banquinhos relativas à mesa); o que acontece com cliente sentado ou andando quando um móvel é movido ou guardado; o gato vem com a caminha.
5. **Contrato com a arte:** `drawScene(ctx, { time, entities, layout, wall, floor, placing })` — como `art` recebe o layout, o destaque dos ladrilhos livres, o ladrilho escolhido e o móvel em transparência; função de miniatura por tipo (`drawItemThumb(ctx, type, size)`).
6. **Salvamento:** chave `nais-cafe-v1`, formato, quando grava, tolerância a falha, versão do formato e o que **não** é salvo.
7. **Fluxo da tela Decorar:** estados (navegando, colocando, movendo) e a relação com a loja.
8. Pontos [A definir], sem inventar regra de produto.

**Arquivos permitidos:** só `docs/arquitetura.md` (autorizado). Não escreva código.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
