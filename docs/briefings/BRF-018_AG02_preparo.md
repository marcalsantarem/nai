# BRF-018 — AG02 (UI) — T-020 Tela Preparo

**Objetivo:** a tela Preparo completa, igual ao mockup, no lugar da tela mínima da T-019.

**Ler:** especificação, Telas (Preparo da bebida) e Conteúdo (Receitas, Ingredientes e camadas na xícara); `docs/arquitetura.md` (fluxo entre telas, `startOrder`/`deliver`); `js/data.js` (receitas, ingredientes, `ART_STEP`); `js/icons.js`; decisões 13 e 24. Mockup: `docs/referencia/mockup-src/02-preparo.html` (inteiro; a xícara é o SVG da linha 69).

**Pronto quando** `js/screens/preparo.js`:
1. Topo: voltar, “<Bebida> da/do <Nome>” (use “de <Nome>” se não souber o gênero), “Passo N de M”, moedas.
2. Passos: círculos ligados por traços; concluído verde com visto, atual amarelo com halo, futuros lilás.
3. Palco: parede menta, balcão de madeira e a xícara grande; cada passo adiciona a camada do ingrediente (altura e cor de `data.js`) com animação de enchimento de ~0,8 s; “Moer” não cria camada; o sachê tinge a água; o desenho mostra coração, flor ou estrela na espuma.
4. Dica de uma linha com o texto do passo atual.
5. Grade 2 × 4 de ingredientes com ícone e nome; o próximo em amarelo com halo. Toque errado: o botão balança e a dica repete o passo certo, sem punição.
6. Quando o passo é o desenho, três opções (coração, flor, estrela) substituem a dica.
7. “Entregar”: desativado com “faltam N passos” até o fim; depois verde. Ao entregar, chama `deliver({ art })` e volta à Cafeteria.
8. Voltar fecha a tela, mantém o cliente e guarda os passos feitos (decisão 24).
- Funciona para as 8 receitas (teste todas, mesmo as ainda bloqueadas, forçando o pedido no teste).
- Sem imagens, gradientes, desfoques nem emoji; alvos ≥ 44 pt; animações só com CSS/canvas.

**Arquivos permitidos:** `js/screens/preparo.js`, `css/ui.css`; `js/screens/cafeteria.js` e `js/main.js` só se for preciso para a navegação. Não altere `sim`, `state`, `data`, `art`, `icons`: se faltar algo, registre na entrega.

**Validação:** a 390 × 844 compare com o mockup no passo 3 de 4 do Latte (posições, tamanhos, cores); prepare as 8 receitas até entregar; teste erro, voltar e retomar; 360 e 430 sem rolagem; console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).

**Nota do AG00:** a simulação tem `sim.saveProgress(id, progress)` e `startOrder` devolve `progress` (passos guardados ou `null`): use isso para a decisão 24. O nível vem de `state.getLevel()`.
