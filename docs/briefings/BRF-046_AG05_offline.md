# BRF-046 — AG05 (Plataforma) — T-046 Modo offline

**Ler:** especificação, PWA no iOS (Offline, Atualização, Fontes) e Plataforma (Offline); decisão 11 e `js/version.js` (é **módulo ES** importado por `js/screens/cafeteria.js`; não o transforme em script clássico).

**Pronto quando:**
- `sw.js` na raiz guarda tudo o que o jogo precisa para abrir sem internet: `index.html`, `manifest.webmanifest`, CSS, todos os `js/` (inclusive `js/screens/`), `fonts/`, `icons/`. Navegação: rede primeiro, cai para a cópia guardada. Demais recursos: cache primeiro, atualizando em segundo plano (ou outra estratégia segura que você justificar).
- Nome do cache com a versão. Proposta do AG00 para manter uma fonte única: registrar como `sw.js?v=<VERSION>` (importando `VERSION` de `js/version.js` no ponto de registro) e o `sw.js` ler `v` da própria URL para o nome do cache; caches antigos são apagados no `activate`. Se preferir outro caminho, justifique e atualize `docs/decisoes.md` decisão 11 (**autorizado**).
- Registro do service worker: num `<script type="module">` no fim do `<head>` ou do `<body>` do `index.html` (**autorizado só esse script**), sem tocar em `js/main.js`.
- Lista de arquivos do cache mantida num só lugar dentro do `sw.js`, com comentário dizendo para atualizá-la quando um arquivo for criado.
- Nunca guarda respostas com erro; o jogo continua funcionando se o service worker falhar.

**Arquivos permitidos:** `sw.js` (novo), script de registro no `index.html`, `docs/decisoes.md` (só a decisão 11). Não altere `js/`.

**Validação:** navegador local: o service worker instala e ativa sem erro; com a rede cortada (DevTools offline ou servidor parado) o jogo recarrega e funciona; trocar a versão cria cache novo e apaga o antigo. Liste os arquivos do cache e confira que nenhum arquivo do jogo ficou de fora.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
