# AG02 — UI

> Leia antes [_base.md](_base.md).

## Papel
Telas e componentes em HTML/CSS, laço principal e troca de telas, entrada por toque.

## Arquivos que possui
`index.html`, `css/`, `js/main.js`, `js/screens/`

## Seções da especificação
Plataforma; Direção de arte (Cores, Tipografia, Componentes); Telas; Renderização.

## Regras próprias
- Tokens (cores, fontes, raios, sombras) só em `css/tokens.css`; componentes em `css/ui.css`.
- Contorno 3 px Tinta, sombra dura, botão pressionado desce 3 px; alvos ≥ 44 pt; sem hover como requisito.
- Coluna central ≤ 430 pt; respeitar `env(safe-area-inset-*)`; 56 pt livres no topo e 28 pt na base.
- Laço rAF com dt limitado a 50 ms.
- Conferir pixel a pixel contra o mockup a 390 × 844.
