# BRF-006 — AG03 (Arte) — T-006 Sala inicial

**Objetivo:** `js/art.js` desenha a sala inicial idêntica à do mockup, usando `js/iso.js`.

**Ler:** especificação, seções Cores da sala, Ilustração isométrica (composição inicial) e Clientes da casa (aparência, só para a função de personagem). Referência: `docs/referencia/mockup-src/01-cafeteria.html` linhas 46–391 e o índice de partes no README.

**Contrato com a tela (o AG02 está construindo a T-007 ao mesmo tempo, contando com isto):**
- `export const SCENE_VIEWBOX = { x: -186, y: -132, w: 372, h: 330 };`
- `export function drawScene(ctx, { time = 0 } = {})`: desenha a sala inteira em coordenadas do viewBox. O chamador já aplicou escala, DPR e translação; `drawScene` não mexe no tamanho do canvas nem limpa fora do viewBox. `time` em segundos, para animações leves (chuva na janela, brilho das luzinhas); sem `time` desenha estático.

**Pronto quando:**
- A sala do mockup completa: paredes com listras, lambri e rodapé, piso em xadrez, balcão com máquina vermelha e redoma de bolo, duas luminárias pendentes, quadro-negro, janela com chuva e cortinas, luzinhas, bandeirinhas, porta, estante, tapete redondo, mesa com dois banquinhos, costela-de-adão, poltrona, luminária de chão, caminha do gato (com o gato) e a barista atrás do balcão.
- **Sem clientes** (os do mockup ficam para o M2) e sem balões de pedido.
- Onde o mockup diz “Nossa Cafeteria”, escreva “Nai's Cafe” (inclusive no quadro-negro, se houver). Texto no canvas em Baloo 2/Nunito.
- Funções separadas e reutilizáveis por objeto (ex.: `drawTable`, `drawPlant`, `drawCharacter(ctx, look)`), para servirem depois a miniaturas da loja e retratos. Desenho em ordem crescente de `gx + gy`.
- Leve o suficiente para 60 fps redesenhando a cada quadro.

**Arquivos permitidos:** `js/art.js` e, se precisar ajustar, `js/iso.js`.

**Validação:** compare lado a lado com o SVG do mockup no navegador (mesmo viewBox, mesma escala), com uma página de teste temporária fora do repositório. Informe as diferenças que restaram.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores que abrir.
