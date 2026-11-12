# BRF-003 — AG05 (Plataforma) — T-008 Arquivo de versão

**Objetivo:** uma fonte única da versão do jogo (decisão 11).

**Pronto quando:**
- `js/version.js` com `export const VERSION = '0.0.0';` (o AG00 sobe para `0.1.0` no fechamento do M1) e um comentário curto dizendo que é o único lugar da versão e que o `sw.js` (M5) vai usá-lo no nome do cache.
- Proposta, na entrega, de como o `sw.js` vai ler a versão sem módulos ES no service worker (ex.: `importScripts` de um arquivo clássico ou geração manual). Não implemente o `sw.js`.
- A exibição da versão na tela fica para a T-007 (AG02); não crie `index.html`.

**Arquivos permitidos:** só `js/version.js`.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), dizendo o que **não** foi verificado.
