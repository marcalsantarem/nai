# BRF-001 — AG03 (Arte) — T-002 Código legível do mockup

**Objetivo:** deixar o código do mockup legível para todos os agentes, sem precisarem abrir o arquivo de 846 KB.

**Fonte:** `docs/referencia/mockup-mobile.html`. É um pacote: `<script type="__bundler/manifest">` tem um JSON `{uuid: {mime, compressed, data}}` (data em base64, gzip quando `compressed`); `<script type="__bundler/template">` tem o HTML da página como string JSON, que referencia os recursos pelos uuids. Leia só o necessário para decodificar.

**Pronto quando:**
- `docs/referencia/mockup-src/index.html`: o template decodificado, legível (sem os dados binários embutidos).
- Scripts e estilos inline do template também salvos como arquivos separados (`.js`, `.css`) na mesma pasta, se forem grandes.
- Fontes e outros binários **não** entram (a T-003 cuida das fontes); liste no README os uuids, mime e tamanho de cada recurso binário.
- `docs/referencia/mockup-src/README.md` (curto): o que é cada arquivo e um **índice das funções de desenho** (nome, arquivo:linha, o que desenha) e onde ficam paleta, telas e componentes.
- `docs/referencia/mockup-src/_extrair.py` (ou `.mjs`): script que refaz a extração. Python com `-I`, só biblioteca padrão.

**Arquivos permitidos:** só `docs/referencia/mockup-src/`. Não altere `docs/referencia/mockup-mobile.html`.

**Validação:** o script roda do zero e gera os mesmos arquivos; o `index.html` extraído é HTML válido e legível.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), dizendo o que **não** foi verificado.
