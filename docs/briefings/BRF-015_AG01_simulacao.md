# BRF-015 — AG01 (Gameplay) — T-017 Estado e simulação

**Objetivo:** `js/state.js` e `js/sim.js` fazendo o ciclo do cliente funcionar, sem desenhar nada.

**Ler:** `docs/arquitetura.md` (estado, grade, API da simulação, entidades); `js/data.js`; especificação, Mecânicas (Clientes e fila, Preparo e moedas, Nível e receitas); decisões 20 a 25.

**Pronto quando:**
- `js/state.js`: estado em memória (moedas 40, servidas, contagem) com a API e os avisos de mudança da arquitetura. Sem `localStorage` (é do M3).
- `js/sim.js`: `createSim({ rng, store })` com `update(dt)`: primeira chegada ~2 s, depois 7–14 s com a fila abaixo de 3; cliente comum com nome e aparência sorteados; anda da porta até a fila a 1,7 ladrilho/s; o primeiro mostra o pedido (só receitas liberadas: as 4 iniciais no M2) e espera sem limite; `startOrder`/`deliver({ art })` paga preço + gorjeta 0–2 + 1 com desenho e conta a servida; servido senta num lugar livre por 14–26 s, solta coração e sai; sem lugar, sai com o copo e solta coração (decisão 22); a fila anda.
- A barista é uma entidade fixa atrás do balcão.
- Nível calculado pelos marcos (decisão 23). Progresso do Preparo guardado por cliente ao voltar (decisão 24), se a arquitetura puser isso na simulação.
- `entities()` no formato da arquitetura. Nenhum caminho de falha, nenhum travamento com muitos clientes.

**Arquivos permitidos:** `js/state.js`, `js/sim.js`. Ajuste em `js/data.js` só se faltar um dado. O AG03 mexe em `js/art.js` ao mesmo tempo: não toque. `js/main.js` não (a ligação é da T-019).

**Validação:** teste em Node com RNG fixo, fora do repositório: simule 30 minutos em passos de 50 ms e 16 ms, entregando sempre que houver primeiro da fila; confira 20+ clientes servidos, fila ≤ 3, lugares ≤ 2, moedas = soma dos pagamentos, nenhum cliente parado para sempre e nenhuma exceção.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
