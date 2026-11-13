# BRF-029 — AG02 (UI) — T-030 Loja

**Objetivo:** o painel da loja na tela Decorar, igual ao mockup.

**Ler:** especificação, Telas (Decorar: Loja e estados do botão) e Conteúdo (Decoração); `docs/arquitetura.md` M3.3 (`shopState`, comprar, colocar do estoque, cores); `js/data.js` (`DECOR_ITEMS`, `SHOP_TABS`, `WALL_COLORS`, `FLOORS`); `js/art.js` (`drawItemThumb`, `drawWallThumb`, `drawFloorThumb`, convenção de DPR); decisões 29 e 32. Mockup: `03-decorar.html`.

**Pronto quando:**
- Painel creme com abas Salão, Paredes e Cores; grade de 3 colunas; cada cartão com miniatura (canvas nítido com o DPR), nome e botão.
- Estados do botão: preço em amarelo; “Colocando” em verde enquanto escolhe o lugar; “Colocar · N” em menta quando há unidades no estoque; desativado quando faltam moedas; “Já tem” (ou equivalente) para a caminha no limite.
- Comprar desconta as moedas e entra na colocação da T-029; “Colocar · N” coloca do estoque sem cobrar.
- Aba Cores: 5 paredes e 3 pisos, grátis, com o atual marcado; troca na hora.
- Rolagem só dentro do painel, se a grade não couber; a sala fica visível.

**Arquivos permitidos:** `js/screens/decorar.js`, `css/ui.css`. Não altere `decor`, `state`, `sim`, `data`, `art`.

**Validação:** a 390 × 844 compare com o mockup; compre e coloque 1 item de cada aba; botão desativado com poucas moedas; estoque e “Colocar · N”; troque paredes e pisos e recarregue; 360 e 430; console sem erros.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
