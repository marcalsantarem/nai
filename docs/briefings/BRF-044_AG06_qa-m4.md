# BRF-044 — AG06 (QA) — T-043 Validação do M4

**Objetivo:** dizer se o M4 (Vida da loja) passa. O cliente especial está fora (decisão 34).

**Ler:** `docs/00_biblia_projeto.md` (escopo do M4); especificação, Telas (Clientes da casa, Cardápio, Ajustes), Mecânicas (Nível e receitas, Clientes da casa, Rituais), Conteúdo (Clientes da casa) e Áudio; decisões 13, 16, 20, 23, 25 e 34; `docs/arquitetura.md` M4. Mockup: `04-clientes.html`.

**Onde testar:** local (porta livre, não 8123) e https://dev--naicafe.netlify.app, a 390 × 844, 360 × 780 e 430 × 932. Se o painel falhar, use Chrome sem janela e `step(dt)` de `js/main.js`. Estado de teste só no scratchpad; zere o salvo no fim.

**Verificar:**
1. Receitas liberam aos 6, 10, 14 e 24 servidas e passam a ser pedidas; barra e legenda certas em cada faixa e depois da última; nível sobe; as 8 receitas preparáveis até o fim no Preparo.
2. Clientes da casa: aparecem (~45%), pedem a favorita, Bia só depois do Mocha, falam a próxima fala ao serem servidos (balão legível), visitas salvas.
3. Tela Clientes contra o mockup: “N de 5”, cartões, selo de visitas, última fala, “Cliente misterioso”.
4. Tela Cardápio: 8 receitas, preço, passos, bloqueadas tracejadas com o marco.
5. Plantas com sede (gota), tocar rega e mostra “+2”; gato (só com a caminha) dorme, passeia, senta, coração ao tocar; nada disso na Decorar.
6. “+N” ao entregar; nada ao comprar.
7. Ajustes: abre e fecha; música e chuva gravam e voltam; nome até 24 e vazio volta ao padrão; topo mostra o nome; recomeçar com dois toques.
8. Áudio: sem som antes do primeiro toque; sem erro no console ao ligar e desligar e ao trocar de aba (não é preciso ouvir).
9. “Esse lugar fecha a passagem” ao tentar fechar uma mesa na Decorar.
10. Regressão M1–M3: ciclo, Preparo, Decorar, loja, salvar e reabrir, 20 clientes seguidos; sem rolagem horizontal; alvos ≥ 44 pt; console sem erros.

**Entrega:** `docs/qa/qa-M4.md` com veredito, tabela de diferenças (onde · esperado · obtido · gravidade) e o que não pôde ser testado. Resposta ao AG00 no formato padrão (máx. 10 linhas).

**Arquivos permitidos:** só `docs/qa/`. **Regras:** sem commit, push ou branch; não altere código; pare servidores e feche abas.
