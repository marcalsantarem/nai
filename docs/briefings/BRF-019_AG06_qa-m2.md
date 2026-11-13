# BRF-019 — AG06 (QA) — T-021 Validação do M2

**Objetivo:** dizer se o M2 (Ciclo principal) passa.

**Ler:** `docs/00_biblia_projeto.md` (escopo do M2); especificação, Telas (Cafeteria, Preparo), Mecânicas (Clientes e fila, Preparo e moedas), Conteúdo (Receitas, Ingredientes); decisões 13, 15 e 18 a 25 em `docs/decisoes.md`; `docs/arquitetura.md` só se precisar. Mockup: `docs/referencia/mockup-src/01-cafeteria.html` e `02-preparo.html`.

**Onde testar:** local (porta livre, não 8123) e https://dev--naicafe.netlify.app, a 390 × 844, 360 × 780 e 430 × 932. Se o painel estiver oculto o rAF para: use `step(dt)` exportado por `js/main.js` para avançar o jogo e registre a limitação.

**Verificar:**
1. Ciclo: primeiro cliente em ~2 s; fila de até 3 em frente ao balcão; balão no primeiro; cartão “<Nome> quer um <Bebida>” com retrato e valor; “Preparar” e toque no cliente abrem o Preparo; entregar paga preço + gorjeta 0–2 + 1 com desenho; cliente senta (máx. 2) ou sai com o copo; coração; a fila anda.
2. **20 clientes seguidos** sem travar, sem erro e sem nenhuma forma de perder.
3. Preparo contra o mockup (passo 3 de 4 do Latte): topo, passos, palco e xícara, dica, grade 2 × 4, Entregar. As 4 receitas iniciais até o fim; ordem errada não pune; desenho na espuma com as 3 opções; voltar mantém o cliente e os passos.
4. Só as 4 receitas iniciais são pedidas. Barra: “Faltam N…”, e com 6 “O Mocha chega em breve”; nível sobe.
5. Barista: pele levemente morena, cabelo cacheado castanho-escuro. Clientes com nomes brasileiros variados.
6. Visual: nenhum personagem sobreposto a móvel de forma estranha (em especial o 3º da fila e o banquinho), ordem de profundidade certa ao andar atrás/à frente dos móveis.
7. Entrega em dobro: toque rápido repetido em “Entregar”/“Preparar” não paga duas vezes.
8. Regressão do M1: topo, navegação, sem rolagem horizontal, sem imagens/gradientes/emoji, alvos ≥ 44 pt, console sem erros.

**Entrega:** `docs/qa/qa-M2.md` com veredito, tabela de diferenças (onde · esperado · obtido · gravidade) e o que não pôde ser testado. Resposta ao AG00 no formato padrão (máx. 10 linhas).

**Arquivos permitidos:** só `docs/qa/`. **Regras:** sem commit, push ou branch; não altere código; pare servidores e feche abas.
