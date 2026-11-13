# BRF-037 — AG01 (Gameplay) — T-056 Resto do D1 e mesa sem acesso

**Pronto quando:** `js/decor.js` e `regulars` em `js/state.js` só aceitam ids próprios (sem protótipo); `decor` recusa colocar ou mover um item se isso deixar algum lugar de mesa, a fila ou a saída sem rota a partir do corredor (mesma busca de `findRoute`), devolvendo um motivo (ex.: `reason: 'blocks-path'`) para a tela mostrar “Esse lugar fecha a passagem”.

**Arquivos permitidos:** `js/decor.js`, `js/state.js`, `js/sim.js` (só para expor a busca), `docs/arquitetura.md` (até 3 linhas).

**Validação (Node):** mesa cercada é recusada; casos normais continuam aceitos; ids estranhos descartados.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
