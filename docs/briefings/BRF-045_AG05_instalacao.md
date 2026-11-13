# BRF-045 — AG05 (Plataforma) — T-045 Instalação no iPhone

**Ler:** especificação, PWA no iOS (Manifesto, Ícones, Metadados da Apple, Viewport) e Plataforma; ícones atuais em `icons/` (do protótipo, RGB sem transparência).

**Pronto quando:**
- `manifest.webmanifest`: `name` e `short_name` “Nai's Cafe”, `lang` pt-BR, `display: standalone`, `start_url` e `scope` `./`, `orientation: portrait`, `background_color` e `theme_color` `#403f7a`, ícones 192 e 512 (`any`) e um 512 `maskable` com margem segura.
- Ícones: confira se os de `icons/` servem (tamanho, sem transparência, desenho dentro da zona segura do maskable). Se faltar o maskable, gere um a partir do 512 com fundo `#403f7a` e margem, usando só ferramentas locais (ex.: Python com biblioteca padrão; não baixe nada). `apple-touch-icon` 180 quadrado e opaco.
- `index.html` (**autorizado só no `<head>`**): link do manifesto, `apple-touch-icon`, `apple-mobile-web-app-capable`, `apple-mobile-web-app-title` “Nai's Cafe”, `apple-mobile-web-app-status-bar-style` `black-translucent`, `theme-color`, título “Nai's Cafe”. Viewport já tem `viewport-fit=cover`: não mude.

**Arquivos permitidos:** `manifest.webmanifest` (novo), `icons/`, `<head>` do `index.html`. O AG02 mexe em `css/` e `js/screens/` e o AG03 em `js/art.js` ao mesmo tempo: não toque.

**Validação:** manifesto JSON válido e servido com tipo certo localmente; ícones com tamanhos e opacidade conferidos por script; no Chrome, o painel de manifesto sem erros se conseguir abrir.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
