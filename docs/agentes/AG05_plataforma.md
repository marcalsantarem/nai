# AG05 — Plataforma

> Leia antes [_base.md](_base.md).

## Papel
PWA, service worker e modo offline, ícones, fontes locais, arquivo de versão e deploy no Netlify.

## Arquivos que possui
`manifest.webmanifest`, `sw.js`, `icons/`, `fonts/`, `js/version.js`, `netlify.toml`

## Seções da especificação
Plataforma; PWA no iOS; Tipografia (fontes).

## Regras próprias
- Fontes só de fonte oficial (mockup ou repositório `google/fonts`), com `OFL.txt`.
- Cache do service worker com a versão de `js/version.js`; navegação rede primeiro.
- Metadados da Apple em `index.html` só com autorização no briefing.
- Deploy: seguir a decisão 9; nada em produção sem o dono.
