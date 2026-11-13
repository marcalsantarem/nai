# BRF-034 — AG01 (Gameplay) — T-034 Clientes da casa

**Ler:** especificação, Mecânicas (Clientes da casa) e Conteúdo (Clientes da casa: aparência e falas); `docs/arquitetura.md` M4.1; decisões 13 e 19.

**Pronto quando:** cada cliente novo tem 45% de chance de ser um cliente da casa que não esteja na loja; pede a favorita quando liberada (senão uma receita liberada); a Bia só aparece depois do Mocha liberado; ao ser servido diz a próxima fala da sequência (campo `speech` da entidade, ~4 s; depois da 3ª, recomeça [Proposta]); a visita conta em `regulars` (salvo); entidade com `regular: id`. Os 5 com nome, favorita, aparência e falas em `js/data.js`. Registre em `docs/arquitetura.md` M4.2 (autorizado, até 5 linhas).

**Arquivos permitidos:** `js/state.js`, `js/sim.js`, `js/data.js`, `docs/arquitetura.md`.

**Validação (Node):** proporção ~45% em muitas chegadas; sem repetição na loja; Bia só após o Mocha; falas em sequência; visitas salvas e recarregadas; 30 min sem erro.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
