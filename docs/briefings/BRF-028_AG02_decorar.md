# BRF-028 — AG02 (UI) — T-029 Tela Decorar

**Objetivo:** a tela Decorar com a sala reduzida e a colocação de móveis, igual ao mockup.

**Ler:** especificação, Telas (Decorar) e Mecânicas (Decoração); `docs/arquitetura.md`, seções M3.3 (API de `decor.js`), M3.5 (contrato com a arte: `drawScene` com `layout`, `wall`, `floor`, `placing`) e M3.7 (fluxo da tela); decisões 26 a 30. API real em `js/decor.js` e exports de `js/art.js`. Mockup: `docs/referencia/mockup-src/03-decorar.html` (README da pasta primeiro).

**Pronto quando** `js/screens/decorar.js`:
1. Item “Decorar” da navegação abre a tela; “Café” volta à Cafeteria. A simulação continua rodando.
2. Topo: voltar, “Decorar”, legenda “Toque em um móvel para mudar de lugar”, moedas.
3. Sala reduzida (tamanho do mockup) com `drawScene` usando o layout real do estado; a Cafeteria também passa a desenhar o layout real (com `wall` e `floor`).
4. Colocação (decisão 26): 1º toque num ladrilho livre marca em verde com o móvel transparente; 2º toque no mesmo ladrilho confirma; toque em outro ladrilho livre muda a escolha. Itens de parede funcionam igual, nos espaços de parede.
5. Tocar num móvel colocado o levanta para mudar de lugar; botão “Guardar” devolve ao estoque.
6. Pílula escura de instrução, ex.: “Escolha um lugar livre para a planta”; “Não há lugar livre agora” quando for o caso.
7. Área inferior reservada para a loja da T-030 (pode ficar vazia nesta task).
- Toque convertido pela projeção inversa, alvos com raio ≥ 22 pt; nenhum toque cai em ladrilho reservado.

**Arquivos permitidos:** `js/screens/decorar.js` (novo), `js/screens/cafeteria.js`, `js/main.js`, `css/ui.css`. Não altere `decor`, `state`, `sim`, `data`, `art`: se faltar algo, registre na entrega.

**Validação:** a 390 × 844 compare com o mockup; coloque, mova e guarde itens de chão e de parede (use `decor` para comprar no teste); recarregue a página e confira que o layout volta (salvamento da T-026); 360 e 430; console sem erros. Se o rAF estiver parado, use `step(dt)`.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
