# BRF-036 — AG01 (Gameplay) — T-036 Plantas e gato

**Ler:** especificação, Rituais e Conteúdo (Decoração: “Pode ser regada”); `docs/arquitetura.md` M3 (caminha, `freeSpots`, rotas) e M4.

**Pronto quando:** cada planta regável colocada fica com sede a cada 60–120 s e vira entidade `thirst`; `water(itemId)` tira a sede e dá 2 moedas. Gato (só com a caminha): dorme, passeia por rota até um ladrilho livre, senta 5–11 s e volta; `petCat()` dá coração; caminha guardada ou movida tira ou reposiciona o gato. Nada disso é salvo. Registre a API em `docs/arquitetura.md` M4.2 (autorizado, até 5 linhas).

**Arquivos permitidos:** `js/sim.js`, `js/state.js`, `js/data.js`, `docs/arquitetura.md`.

**Validação (Node):** tempos de sede; regar dá 2; não regar não trava nada; gato nunca dentro de móvel; 30 min com móveis mudando, sem erro.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
