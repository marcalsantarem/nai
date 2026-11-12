# BRF-007 — AG02 (UI) — T-007 Tela Cafeteria

**Objetivo:** trocar a tela provisória pela tela Cafeteria real do mockup, ainda sem clientes.

**Ler:** especificação, seções Telas (Regras comuns e Cafeteria), Renderização e Nível e receitas. Referência: `docs/referencia/mockup-src/01-cafeteria.html` (topo, cartão do pedido, navegação; a cena é o SVG da linha 46, com 440 × 390 na tela).

**Ao mesmo tempo:** o AG03 está escrevendo `js/iso.js` e `js/art.js`. **Não toque nesses arquivos.** Programe contra este contrato:
- `import { SCENE_VIEWBOX, drawScene } from '../art.js'`; `SCENE_VIEWBOX = { x: -186, y: -132, w: 372, h: 330 }`.
- `drawScene(ctx, { time })` desenha em coordenadas do viewBox. A tela cuida do canvas: tamanho em CSS igual ao do mockup (a sala ocupa a largura toda e pode cortar até 18 px das pontas das paredes), resolução com o DPR do aparelho até 3×, transformação do viewBox para o canvas, limpeza e chamada a cada quadro no `update(dt)`. Espere `document.fonts.ready` antes do primeiro desenho.
- Se `art.js` ainda não existir quando você testar, deixe a área da cena vazia sem erro e informe.

**Pronto quando:**
- Topo: selo amarelo de nível (nível 1), “Nai's Cafe”, barra de progresso com “Faltam 6 bebidas para liberar o Mocha”, pílula com 40 moedas, botão redondo de ajustes (sem ação ainda).
- Cena no centro, conforme acima.
- Cartão do pedido no estado vazio: “Aguardando o próximo cliente” e botão “Preparar” desativado.
- Navegação: Café (ativo), Decorar, Cardápio, Clientes; os outros itens ainda sem ação.
- Valores iniciais vêm de constantes no topo de `cafeteria.js` (o estado real é do AG01, no M2).
- Versão: importe `VERSION` de `js/version.js` e grave em `document.documentElement.dataset.version`. Não mostre na tela.
- Remova as amostras provisórias da T-004 que não fazem parte da tela.

**Arquivos permitidos:** `js/screens/cafeteria.js`, `css/ui.css`, `index.html` e `js/main.js` só se necessário.

**Validação:** a 390 × 844, compare com o mockup extraído (posições, tamanhos, textos); confira 360 e 430; console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores que abrir (use uma porta diferente de 8123).
