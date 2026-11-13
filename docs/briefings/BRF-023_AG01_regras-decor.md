# BRF-023 — AG01 (Gameplay) — T-025 Regras da decoração

**Objetivo:** implementar as regras do M3 em `js/decor.js` e ligar o layout ao estado e à simulação, sem desenhar nada.

**Ler:** `docs/arquitetura.md`, seção “M3 — Decoração” (M3.1 a M3.8); decisões 26 a 30 em `docs/decisoes.md`; especificação, Mecânicas (Decoração).

**Pronto quando:**
- `js/data.js`: `INITIAL_DECOR` ajustado às decisões 27 (quadrinho azul = 2º “Quadro”) e 29 (sem caminha nem gato no início).
- `js/state.js`: guarda o layout (`items`, `wallItems`, `stock`, `wall`, `floor`) em memória com os avisos de mudança; o salvamento é da T-026, não agora.
- `js/decor.js`, com a API da arquitetura: comprar (desconta moedas, entra em colocação; recusa sem moedas ou no limite), ladrilhos/espaços livres para um tipo, escolher e confirmar com dois toques (decisão 26), levantar para mover, guardar no estoque, colocar do estoque, trocar cor de parede e piso (grátis). Ocupação: 1 ladrilho por item de chão, tapete por baixo, ladrilhos dos banquinhos bloqueados (decisão 28), reservados, parede com os espaços da decisão 30, limite de 1 caminha.
- `js/sim.js`: os lugares das mesas vêm do layout (mesa = 2 lugares); o que acontece com quem está sentado ou a caminho quando a mesa muda segue a arquitetura; nenhum cliente fica preso.
- Nada de `localStorage` ainda.

**Arquivos permitidos:** `js/decor.js` (novo), `js/state.js`, `js/sim.js`, `js/data.js`. O AG03 mexe em `js/art.js` ao mesmo tempo: não toque. Não altere `js/main.js` nem `js/screens/`.

**Validação (Node, fora do repositório):** compre e coloque os 17 itens (com moedas suficientes), mova e guarde cada um, tente ladrilho ocupado/reservado/banquinho, tente a 2ª caminha, troque paredes e pisos; mesa nova soma 2 lugares; rode a simulação de 30 min com uma 2ª mesa e movendo a mesa durante o jogo: sem exceção, ninguém preso, moedas corretas.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
