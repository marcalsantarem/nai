# BRF-017 — AG02 (UI) — T-019 Cafeteria ligada à simulação

**Objetivo:** a tela Cafeteria passa a mostrar o jogo vivo: clientes na cena, cartão do pedido real, moedas e progresso.

**Ler:** `docs/arquitetura.md` (estado, API da simulação, toque na cena, fluxo entre telas); as APIs reais em `js/state.js`, `js/sim.js` e os exports de `js/art.js` (`drawScene`, `drawPortrait`); decisões 18, 20, 23 e 24. Mockup: `01-cafeteria.html` (cartão com cliente: retrato, “PEDIDO”, “Marina quer um Latte”, valor, “Preparar”).

**Pronto quando:**
- `js/main.js` cria o estado e a simulação uma vez, chama `sim.update(dt)` em todo quadro (em qualquer tela) e passa o contexto às telas conforme a arquitetura (**alteração autorizada**).
- A cena chama `drawScene(ctx, { time, entities: sim.entities() })`.
- Cartão do pedido: com cliente na frente, retrato (`drawPortrait` num canvas pequeno), “<Nome> quer um <Bebida>”, valor em moedas e “Preparar” verde; sem cliente, “Aguardando” e botão desativado (como hoje). A altura do cartão não muda entre os dois estados.
- “Preparar” e o toque no primeiro cliente na cena (raio mínimo de 22 pt) abrem a tela `preparo` com o pedido. Enquanto a tela Preparo não existir (T-020), registre uma tela `preparo` mínima em `js/screens/preparo.js` que só mostra o pedido e tem “Entregar” e “Voltar”, para o ciclo fechar.
- Pílula de moedas, nível e barra de progresso seguem o estado: “Faltam N bebidas para liberar o Mocha”; com 6 ou mais, barra cheia e “O Mocha chega em breve” (decisões 20 e 23).
- Remova as constantes provisórias de `cafeteria.js`.

**Arquivos permitidos:** `js/main.js`, `js/screens/cafeteria.js`, `js/screens/preparo.js`, `css/ui.css`. Não altere `js/sim.js`, `js/state.js`, `js/data.js`, `js/art.js`: se faltar algo neles, registre na entrega.

**Validação:** servido localmente a 390 × 844 (se o painel estiver oculto o rAF para: nesse caso avance o jogo chamando o laço à mão e registre a limitação). Atenda 5 clientes seguidos; confira moedas, barra, cartão e que voltar do Preparo mantém o cliente. Console sem erros. Confira 360 e 430.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).

**Nota do AG00:** a simulação tem `sim.saveProgress(id, progress)` e `startOrder` devolve `progress` (passos guardados ou `null`): use isso para a decisão 24. O nível vem de `state.getLevel()`.
