# BRF-014 — AG02 (UI) — T-016 Ícones

**Objetivo:** `js/icons.js` com os ícones de traço do jogo, tirados do mockup, usáveis em HTML e no canvas.

**Ler:** `docs/arquitetura.md` (módulos); `docs/referencia/mockup-src/README.md` (índice dos SVGs) e os trechos dos ícones em `02-preparo.html` (voltar, passos, 8 ingredientes), `01-cafeteria.html` (ajustes, navegação, balão do pedido) e `04-clientes.html` (ícone de bebida). Especificação: Componentes (Ícones).

**Pronto quando** `js/icons.js` exporta:
- Um mapa de ícones por id (os 8 ingredientes com os mesmos ids de `docs/arquitetura.md`, bebidas/xícara, voltar, visto, ajustes, os 4 da navegação, moeda se houver, coração, flor, estrela), cada um com os dados de caminho do SVG (viewBox 24).
- `iconSvg(id, { size = 24 })` → string `<svg>` de traço (2,2 px, pontas e cantos redondos, `currentColor`).
- `drawIcon(ctx, id, x, y, size, color)` → desenha o mesmo ícone no canvas (via `Path2D`), para o balão de pedido.
- A tela Cafeteria passa a usar `iconSvg` no lugar dos SVGs embutidos, sem mudar a aparência.

**Arquivos permitidos:** `js/icons.js`, `js/screens/cafeteria.js`. O AG01 escreve `js/data.js` ao mesmo tempo: não toque.

**Validação:** a 390 × 844, a Cafeteria fica igual a antes; console sem erros; cada ícone confere com o do mockup.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
