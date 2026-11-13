# BRF-031 — AG01 (Gameplay) — T-055 Clientes desviam dos móveis e D1

**Objetivo:** corrigir as ressalvas do `docs/qa/qa-M3.md` antes de fechar o M3.

**Pronto quando:**
1. **Caminhos (D3):** clientes andam pela grade desviando de móveis colocados (busca de caminho simples, ex.: BFS/A* em 6 × 6, com passos diagonais só quando os dois ladrilhos vizinhos estão livres). Valem os trajetos porta → fila, fila → lugar na mesa, lugar → saída, fila → saída. Tapete não bloqueia. O ladrilho de destino (banquinho) e o de origem são permitidos. O movimento continua suave (pode suavizar os cantos) e na mesma velocidade.
   - Se não houver caminho (sala muito cheia), o cliente vai pelo caminho reto como hoje, sem travar.
   - Quando um móvel é colocado ou movido no meio do trajeto, quem está andando recalcula a rota.
2. **D1:** `state.js` só aceita tipos próprios do catálogo (`Object.hasOwn` ou equivalente), em `items`, `wallItems` e `stock`; `constructor`, `__proto__`, `toString` são descartados.
3. Atualize `docs/arquitetura.md` (seção da grade/caminhos) em até 5 linhas (**autorizado**).

**Arquivos permitidos:** `js/sim.js`, `js/state.js`, `docs/arquitetura.md`; `js/decor.js` só se precisar expor ocupação. Não altere `art`, `screens`, `main`, `data`.

**Validação (Node, fora do repositório):** salas de teste com móveis no caminho (ex.: mesa em canto oposto, estante e poltrona entre o hub e a mesa): nenhum ponto do trajeto dentro de um ladrilho ocupado (exceto origem e destino); sala lotada sem travar; simulação de 30 min com a sala decorada e móveis sendo movidos: sem exceção, ninguém preso, moedas corretas; salvo com `constructor`/`__proto__` descartados.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
