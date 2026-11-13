# BRF-047 — AG02 (UI) — T-047 Áreas seguras e gestos

**Ler:** especificação, PWA no iOS (Viewport, Gestos do sistema, Campos de texto) e Telas (Regras comuns).

**Pronto quando:** todas as telas e o painel de Ajustes respeitam `env(safe-area-inset-*)` no topo, na base e nas laterais (o entalhe não cobre o topo; a barra de navegação fica acima do indicador de início), sem perder os 56/28 pt do layout em telas sem entalhe; sem zoom por toque duplo ou pinça, sem seleção de texto (exceto no campo de nome), sem menu de toque longo, sem efeito elástico de rolagem fora das listas que rolam; campos de texto com pelo menos 16 px; o teclado ao editar o nome não deixa a tela deslocada depois de fechar.

**Arquivos permitidos:** `css/`, `js/screens/`, `js/main.js`. Não toque em `index.html` (o AG05 mexe no `<head>`) nem em `js/art.js` (o AG03 mexe ao mesmo tempo).

**Validação:** navegador local simulando insets (ex.: variáveis CSS de teste ou `@supports`), a 390 × 844, 360 e 430; console sem erros. Diga o que só dá para confirmar no iPhone.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
