# BRF-027 — AG03 (Arte) — T-028 Miniaturas da loja

**Objetivo:** cada cartão da loja mostra uma miniatura desenhada com as mesmas funções da sala.

**Ler:** `docs/arquitetura.md`, M3.5 (contrato `drawItemThumb`); `js/data.js` (`DECOR_ITEMS`, `SHOP_TABS`, `WALL_COLORS`, `FLOORS`); mockup `03-decorar.html` (cartões da loja; ex.: a miniatura da luminária, viewBox `-46 -72 92 92`, e o README da pasta).

**Pronto quando** `js/art.js` exporta:
- `drawItemThumb(ctx, type, size)`: desenha o item centrado num quadrado `size × size`, com sombra de contato, na mesma escala visual entre itens de chão (os de parede no próprio plano, levemente de lado), como no mockup. Usa `drawItem`; nada de desenho duplicado.
- Miniaturas para a aba Cores: `drawWallThumb(ctx, wallId, size)` (pedacinho de parede com listras e lambri) e `drawFloorThumb(ctx, floorId, size)` (losango de piso).
- Nítidas com o DPR do aparelho (o chamador escala o canvas; documente a convenção em 1 linha no comentário).
- Rápidas o bastante para desenhar a grade inteira da aba de uma vez.

**Arquivos permitidos:** só `js/art.js`. O AG01 mexe em `js/state.js` (e talvez `js/decor.js`/`js/data.js`) ao mesmo tempo: não toque.

**Validação:** página de teste temporária fora do repositório com a grade de 3 colunas das três abas (17 itens, 5 paredes, 3 pisos) ao lado do mockup; console sem erros; tempo para desenhar todas.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123). Pasta de teste própria no scratchpad.
