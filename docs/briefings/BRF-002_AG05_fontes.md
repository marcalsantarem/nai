# BRF-002 — AG05 (Plataforma) — T-003 Fontes locais

**Objetivo:** servir Baloo 2 e Nunito do próprio site, para funcionar offline.

**Pesos usados (especificação, Tipografia):** Baloo 2 700 e 800; Nunito 600, 700 e 800. Basta cobrir o subconjunto latino (pt-BR: acentos, ç, aspas curvas, travessão, reticências).

**Origem (só estas):**
1. Preferida: os arquivos de fonte embutidos no mockup (`docs/referencia/mockup-mobile.html`, `<script type="__bundler/manifest">`: JSON `{uuid: {mime, compressed, data}}`, base64 e gzip quando `compressed`). Use os do subconjunto latino.
2. Se faltar peso ou subconjunto: repositório oficial `google/fonts` no GitHub (`ofl/baloo2`, `ofl/nunito`). Informe a URL usada.

**Pronto quando:**
- `fonts/` com os arquivos `.woff2` (nomes claros, ex.: `baloo2-latin.woff2`), `OFL.txt` de cada família e `fonts/fonts.css` com os `@font-face` (`font-display: swap`, `unicode-range` quando houver, caminhos relativos a `fonts/`).
- Nenhum outro arquivo do projeto alterado (o `index.html` ainda não existe; a T-004 vai importar `fonts/fonts.css`).

**Validação:** informe tamanho total e confirme os pesos e caracteres cobertos (ex.: “Ação Café Chá — …”). Se puder, abra uma página de teste temporária em scratch (fora do repositório) e veja se as fontes carregam.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), dizendo o que **não** foi verificado.
