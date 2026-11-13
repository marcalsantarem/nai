# BRF-026 — AG01 (Gameplay) — T-026 Salvar o progresso

**Objetivo:** o progresso fica salvo no aparelho e volta ao reabrir o jogo.

**Ler:** `docs/arquitetura.md`, seção M3.6 (salvamento) e M3.1 (layout como estado); especificação, Dados salvos; decisões 16 e 27.

**Pronto quando:**
- `js/state.js` carrega na inicialização e grava a cada mudança em `localStorage`, chave `nais-cafe-v1`, no formato da arquitetura (com versão do formato): `coins`, `served`, `count`, `name` (padrão “Nai's Cafe”, decisão 16), `wall`, `floor`, `items`, `wallItems`, `stock`, `regulars` (vazio por enquanto), `settings` (música e chuva ligadas por padrão).
- Item “Quadro” salvo com `variant` (o 2º da sala inicial é `'small'`, decisão 27); o desenho deve continuar igual depois de mover e recarregar.
- Clientes, fila e colocação em andamento **não** são salvos.
- Toda leitura e gravação tolera falha (sem `localStorage`, cota cheia, JSON quebrado, versão desconhecida, campos faltando ou de tipo errado): o jogo abre normalmente com os valores padrão ou com o que for válido, sem exceção.
- Gravação sem exagero: agrupe gravações no mesmo quadro (ex.: no máximo uma por quadro ou com pequeno atraso), sem perder a última mudança.
- `reset()` apaga o salvo e volta ao início (será usado por “Recomeçar do zero” no M4).

**Arquivos permitidos:** `js/state.js`, e `js/decor.js`/`js/data.js` só se faltar algo para o `variant`. O AG03 mexe em `js/art.js` ao mesmo tempo: não toque. Não altere `js/main.js` nem `js/screens/`; se a inicialização precisar de mudança no `main.js`, descreva na entrega.

**Validação (Node, com um `localStorage` falso, fora do repositório):** salvar, recarregar e comparar; cada caso de falha acima; mover o 2º Quadro e recarregar mantém `'small'`; simulação de 30 min gravando sem erro e com número razoável de gravações.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
