# BRF-033 — AG04 (Áudio) — T-038 Chuva, música e efeitos

**Ler:** especificação, Áudio (parâmetros exatos); `docs/arquitetura.md` M4.2 (API de `audio`).

**Pronto quando:** `js/audio.js` com a API do M4.2: chuva (ruído branco em laço, passa-alta 700 Hz, passa-baixa 5200 Hz, volume 0,07, entrada/saída de 0,6 s); música (Am7, Fmaj7, Cmaj7, G6, um tempo a cada 640 ms, baixo senoidal no 1º tempo, triangular nos demais, passa-baixa 1800 Hz, volume baixo); efeitos curtos e suaves `step`, `coins`, `place`. Começa só depois do primeiro toque; retoma ao voltar ao app (`visibilitychange`/`pageshow` e `resume()`). Liga/desliga lendo `settings` do estado (padrão: ligados). Leve em CPU.

**Ligação (autorizada):** em `js/main.js`, `unlock()` no primeiro `pointerdown`; `sfx('step')` ao concluir um passo em `js/screens/preparo.js`, `sfx('coins')` ao entregar, `sfx('place')` ao confirmar colocação em `js/screens/decorar.js`. Só essas linhas nesses arquivos.

**Arquivos permitidos:** `js/audio.js` (novo) e as linhas acima. O AG01 mexe em `state/sim/data` e o AG03 em `art.js` ao mesmo tempo: não toque.

**Validação:** navegador local: sem erro no console, sem som antes do toque, liga/desliga, trocar de aba e voltar. Não há como ouvir: valide pelo grafo de nós e pelos parâmetros, e diga isso na entrega.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
