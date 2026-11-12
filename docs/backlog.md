# Backlog

> Mantido pelo AG00. Estado: `a fazer` · `em andamento` · `feita`. Tamanho: P/M/G. Marcos em [roadmap.md](roadmap.md).

## M1 — v0.1.0 — Base visual

| ID | Título | Tam. | Dono | Estado |
|---|---|---|---|---|
| T-001 | Ligar a pasta ao repositório, descartar o protótipo e preservar os ícones em `icons/` | P | AG00 | feita |
| T-002 | Extrair o código-fonte legível do mockup para `docs/referencia/mockup-src/` (HTML da página e scripts de desenho) | P | AG03 (Arte) | feita (BRF-001) |
| T-003 | Fontes locais: Baloo 2 e Nunito em `fonts/` com `OFL.txt` (extraídas do mockup ou do `google/fonts`) | P | AG05 (Plataforma) | feita (BRF-002) |
| T-004 | Esqueleto: `index.html`, `css/tokens.css`, `css/ui.css`, `js/main.js` (laço rAF com dt ≤ 50 ms, troca de telas), coluna ≤ 430, áreas seguras, fundo Entardecer | M | AG02 (UI) | feita (BRF-004) |
| T-005 | `js/iso.js`: projeção e inversa, caixa, cilindro, elipse, sombra de contato, paredes | M | AG03 (Arte) | feita (BRF-005) |
| T-006 | `js/art.js`: sala inicial completa do mockup, canvas com DPR até 3× | G | AG03 (Arte) | feita (BRF-006) |
| T-007 | Tela Cafeteria: topo (nível, nome, progresso, moedas, ajustes), cena, cartão “Aguardando o próximo cliente”, navegação | G | AG02 (UI) | feita (BRF-007) |
| T-008 | `js/version.js` (decisão 11) e versão visível no título da página ou em meta | P | AG05 (Plataforma) | feita (BRF-003) |
| T-009 | Deploy no Netlify (decisão 9): já configurado pelo dono; conferir o site da `dev` depois da T-007 | P | AG00 | feita (site da dev servindo a versão atual) |
| T-010 | Validação do M1 contra o mockup a 390 × 844 e em 360/430 | M | AG06 (QA) | feita (BRF-008): passa com ressalvas, ver docs/qa/qa-M1.md |
| T-012 | QA D1: quadro-negro com “Nai's Cafe” (decisão 17) | P | AG03 (Arte) | feita (BRF-009) |
| T-013 | QA D2 e D3: cartão vazio só “Aguardando” (decisão 18) e legenda do progresso sem palavra sozinha a 430 | P | AG02 (UI) | feita (BRF-010) |
| T-011 | Fechamento do M1: versão, PR `dev` → `main`, tag v0.1.0 | P | AG00 | a fazer |

Dependências: T-002 antes de T-005/T-006/T-007 · T-004 antes de T-007 · T-005 antes de T-006 · T-006 e T-007 antes de T-010.

## Próximos marcos

M2–M5: tasks criadas quando o marco começar.
