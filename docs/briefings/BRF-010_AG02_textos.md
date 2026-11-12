# BRF-010 — AG02 (UI) — T-013 Textos da tela Cafeteria

**Objetivo:** corrigir D2 e D3 do relatório `docs/qa/qa-M1.md`.

**Pronto quando:**
- D2: o título do cartão sem cliente passa a ser só “Aguardando” (decisão 18). A 360 o cartão fica com a mesma altura que a 390 (111 px).
- D3: a 430, a legenda “Faltam 6 bebidas para liberar o Mocha” não deixa uma palavra sozinha na última linha (ex.: `text-wrap: balance` ou espaço inseparável antes do nome da receita). Continue certo a 360 e 390.

**Arquivos permitidos:** `js/screens/cafeteria.js` e `css/ui.css`. O AG03 mexe ao mesmo tempo em `js/art.js`: não toque.

**Validação:** medir altura do cartão e linhas da legenda a 360, 390 e 430; console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
