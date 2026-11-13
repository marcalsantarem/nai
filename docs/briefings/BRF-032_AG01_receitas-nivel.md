# BRF-032 — AG01 (Gameplay) — T-033 Nível e liberação de receitas

**Ler:** especificação, Nível e receitas; decisões 13, 20, 23 e 25; `docs/arquitetura.md` (M4).

**Pronto quando:** receitas liberam aos 6, 10, 14 e 24 servidas (Mocha, Café com leite batido, Chocolate quente, Café gelado) e passam a ser pedidas; o estado expõe as liberadas, a próxima receita e quantas faltam; a barra da Cafeteria usa isso (“Faltam N bebidas para liberar X”; depois da última, barra cheia e “Todas as receitas liberadas” [Proposta]); nível pelos marcos. Salvo continua compatível. Registre a API em `docs/arquitetura.md` M4.2 (autorizado, até 5 linhas).

**Arquivos permitidos:** `js/state.js`, `js/sim.js`, `js/data.js`, `docs/arquitetura.md`, e `js/screens/cafeteria.js` só na legenda e na barra.

**Validação (Node):** marcos exatos; pedidos só de receitas liberadas; 30 min de simulação sem erro.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
