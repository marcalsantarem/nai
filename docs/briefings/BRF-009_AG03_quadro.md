# BRF-009 — AG03 (Arte) — T-012 Quadro-negro com o nome

**Objetivo:** o quadro-negro da sala mostra “Nai's Cafe” em vez de “Cardápio” (decisão 17; relatório `docs/qa/qa-M1.md`, D1).

**Pronto quando:** `drawScene` desenha o quadro com o título “Nai's Cafe”, cabendo no quadro com folga, na mesma fonte e cor do título atual. Se não couber no tamanho atual, reduza a fonte; não aumente o quadro.

**Arquivos permitidos:** só `js/art.js`. O AG02 mexe ao mesmo tempo em `js/screens/` e `css/`.

**Validação:** desenhe num canvas à parte e confira que o texto não vaza do quadro.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
