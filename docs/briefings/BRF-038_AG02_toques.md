# BRF-038 — AG02 (UI) — T-039 Toques na planta e no gato

**Ler:** `docs/arquitetura.md` M4 e as APIs reais de `sim` (`water`, `petCat`, entidades `thirst` e `cat`).

**Pronto quando:** na Cafeteria, tocar no balão ou na planta com sede rega (+2 moedas, com o mesmo retorno visual das moedas); tocar no gato solta coração; prioridade de toque: primeiro cliente > planta com sede > gato; raio mínimo de 22 pt; nada disso dispara na tela Decorar. Mensagem “Esse lugar fecha a passagem” na Decorar quando `decor` devolver `blocks-path` (T-056).

**Arquivos permitidos:** `js/screens/cafeteria.js`, `js/screens/decorar.js` (só a mensagem), `css/ui.css`.

**Validação:** navegador local, com `step(dt)` se o rAF estiver parado; console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
