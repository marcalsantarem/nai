# BRF-005 — AG03 (Arte) — T-005 Base isométrica

**Objetivo:** `js/iso.js` com a projeção e as formas básicas que toda a arte vai usar.

**Ler:** especificação, seção Ilustração isométrica. Referência: `docs/referencia/mockup-src/README.md` (partes da cena) e `01-cafeteria.html` linhas 46–391 (trechos). O mockup é SVG estático: deduza as funções a partir das coordenadas.

**Pronto quando** `js/iso.js` (módulo ES, funções puras sobre `CanvasRenderingContext2D`, sem estado global) exporta:
- `project(gx, gy, h = 0)` → `{x, y}` e `unproject(x, y)` → `{gx, gy}` (inversa no plano do chão), com a fórmula da especificação.
- Cores: `shade(hex, k)` (multiplica RGB).
- Formas: caixa de três faces (topo × 1,06, esquerda × 0,86, direita × 0,70), cilindro (elipse r × 42 por r × 21, lateral × 0,78), elipse, sombra de contato (`#2a1b3d` a 16%), retângulo arredondado, paredes com cisalhamento ±0,5 (listras, lambri, rodapé), losango de ladrilho.
- Ordem de desenho: utilitário para ordenar por `gx + gy`.
- Coordenadas no mesmo sistema do viewBox do mockup (`-186 -132 372 330`): a origem é o canto do fundo da sala.

**Arquivos permitidos:** só `js/iso.js`.

**Validação:** conferir numericamente que `project` bate com 3 ou mais pontos do SVG do mockup (piso, caixa do balcão, mesa) e que `unproject(project(p)) ≈ p`. Pode usar uma página de teste temporária fora do repositório.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores que abrir.
