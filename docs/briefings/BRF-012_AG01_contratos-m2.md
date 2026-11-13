# BRF-012 — AG01 (Gameplay) — T-014 Contratos do M2

**Objetivo:** escrever os contratos que AG01, AG02 (UI) e AG03 (Arte) vão seguir em paralelo no M2, para ninguém depender do código do outro.

**Ler:** especificação, seções Mecânicas (Clientes e fila, Preparo e moedas), Telas (Cafeteria, Preparo), Conteúdo (Receitas, Ingredientes), Arquitetura técnica e Dados salvos. Decisões 13, 15, 19 e 20 em `docs/decisoes.md`. Backlog do M2 (T-015 a T-020). Código atual: `js/art.js` (só a lista de exports e `INITIAL_LAYOUT`/`drawScene`), `js/main.js` e `js/screens/cafeteria.js` (trechos).

**Pronto quando** `docs/arquitetura.md` existe, curto (máx. ~150 linhas), com:
1. **Módulos e donos:** quem importa quem (`data`, `state`, `sim`, `art`, `icons`, `screens/*`, `main`); `sim` não desenha, `art` não altera estado.
2. **Estado** (`js/state.js`): forma do objeto em memória no M2 (moedas, servidas, contagem), já compatível com os campos salvos da especificação para o M3; como as telas leem e são avisadas de mudanças (ex.: `subscribe`/eventos).
3. **Grade da sala:** ladrilhos de chão 6 × 6, porta, ladrilhos da fila (3), lugares das mesas a partir de `INITIAL_LAYOUT`, caminhos permitidos; reservados (balcão, corredor da fila, porta, quadro, janela).
4. **API da simulação** (`js/sim.js`): criação, `update(dt)`, consulta do primeiro da fila, `startOrder`/`deliver({ art })` com pagamento (preço + gorjeta 0–2 + 1 com desenho), RNG injetável para testes.
5. **Entidades para a cena:** formato que `sim` expõe e `art` desenha (id, tipo, `gx`/`gy` contínuos, direção, pose: andando/parado/sentado, aparência, copo, balão com receita, coração) e a nova assinatura `drawScene(ctx, { time, entities })`, mantendo a ordem por `gx + gy` entre móveis e personagens.
6. **Toque na cena:** como a tela converte o toque (`unproject`, raio mínimo de 22 pt) e descobre se tocou no primeiro cliente.
7. **Fluxo entre telas:** Cafeteria → Preparo (com o pedido) → Entregar → Cafeteria; voltar mantém o cliente.
8. **Dados** (`js/data.js`): formato de receitas (8, decisão 13), ingredientes, constantes do ciclo, nomes e aparências de clientes comuns (decisão 19); a barista com a aparência da decisão 15.
9. Pontos [A definir] que você encontrar, sem inventar regra de produto.

**Arquivos permitidos:** só `docs/arquitetura.md` (autorizado neste briefing). Não escreva código.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
