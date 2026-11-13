# BRF-030 — AG06 (QA) — T-031 Validação do M3

**Objetivo:** dizer se o M3 (Decoração) passa.

**Ler:** `docs/00_biblia_projeto.md` (escopo do M3); especificação, Telas (Decorar), Mecânicas (Decoração), Conteúdo (Decoração), Dados salvos e os critérios de aceite de itens e de “fechar e reabrir”; decisões 26 a 30, 32 e 33. Mockup: `docs/referencia/mockup-src/03-decorar.html`.

**Onde testar:** local (porta livre, não 8123) e https://dev--naicafe.netlify.app, a 390 × 844, 360 × 780 e 430 × 932. Se o rAF estiver parado, use `step(dt)` de `js/main.js`. Para ter moedas no teste, use uma página auxiliar só no scratchpad (não altere o repositório) e zere o salvo no fim.

**Verificar:**
1. Tela Decorar e loja contra o mockup: topo, sala reduzida, pílula, painel, abas, grade de 3 colunas, cartões e miniaturas.
2. **Os 17 itens** podem ser comprados, colocados, movidos e guardados; “Colocar · N” usa o estoque sem cobrar; botão desativado sem moedas; “Já tem” na caminha.
3. Dois toques para colocar (decisão 26); ladrilhos reservados, ocupados e dos banquinhos recusados (decisão 28); tapete por baixo (decisão 33); itens de parede nos espaços da decisão 30, incluindo o novo da parede direita, sem cobrir quadro-negro e janela.
4. 5 paredes e 3 pisos trocam na hora e grátis.
5. Mesa nova dá mais 2 lugares (clientes passam a sentar nela); mover ou guardar uma mesa ocupada não trava ninguém; a caminha comprada traz o gato.
6. **Fechar e reabrir** mantém moedas, servidas, decoração, parede, piso e estoque; salvo corrompido não impede o jogo de abrir.
7. Regressão do M2: ciclo do cliente, Preparo, 20 clientes seguidos com a sala decorada; sem rolagem horizontal; alvos ≥ 44 pt; console sem erros.

**Entrega:** `docs/qa/qa-M3.md` com veredito, tabela de diferenças (onde · esperado · obtido · gravidade) e o que não pôde ser testado. Resposta ao AG00 no formato padrão (máx. 10 linhas).

**Arquivos permitidos:** só `docs/qa/`. **Regras:** sem commit, push ou branch; não altere código; pare servidores e feche abas.
