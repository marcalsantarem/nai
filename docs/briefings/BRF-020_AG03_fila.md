# BRF-020 — AG03 (Arte) — T-053 Fila sem sobreposição

**Objetivo:** corrigir D1 e D2 de `docs/qa/qa-M2.md`: cliente sentado no banquinho 1 (ou a caminho) cobre o 2º da fila.

**Pronto quando:** as posições de `ROOM` em `js/data.js` (**alteração autorizada**: `queue`, `entry`, `hub`, `exit`; não mexa em `seats`, `door`, `barista` nem no resto do arquivo) deixam, na tela:
- os 3 da fila em frente ao balcão, sem cobrir nem serem cobertos por quem está sentado nos 2 banquinhos, pela mesa ou por quem anda de Q1 até um banquinho ou até a saída;
- a fila fora da porta, do tapete redondo se possível, e dentro do piso;
- o caminho porta → fila → balcão → banquinho/saída natural (sem atravessar móveis).
Cada lugar da fila continua num ladrilho livre e não reservado (veja `reservedTiles`).

**Validação:** página de teste temporária fora do repositório com `drawScene` e entidades de exemplo: fila de 3 + 2 sentados + 1 andando em vários pontos do trajeto. Informe as posições finais e as distâncias na tela (px) entre personagens vizinhos.

**Arquivos permitidos:** só `js/data.js` (campo `ROOM`). **Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
