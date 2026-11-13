# BRF-025 — AG03 (Arte) — T-054 Espaços na parede direita

**Objetivo:** dar mais lugar para itens de parede (decisão 30). Hoje a sala inicial usa 3 dos 4 espaços médios da esquerda, e sobram só 1 médio e 1 alto para 6 tipos de item.

**Pronto quando:**
- A parede direita ganha espaços de decoração onde couber sem cobrir o quadro-negro nem a janela nem as cortinas, nas faixas alta e média (meta: pelo menos 3 espaços novos; diga quantos couberam e por quê).
- `WALL_SLOTS` e `ROOM.reservedWall` em `js/data.js` refletem os novos espaços (**alteração autorizada só nesses dois campos**); `js/art.js` desenha cada item de parede corretamente em cada espaço novo, no plano da parede direita, sem invadir a outra parede nem o teto.
- O `decor.js` aceita os espaços novos sem mudança de código (se precisar mudar, não mude: registre na entrega).

**Validação:** página de teste temporária fora do repositório com cada um dos 6 itens de parede em cada espaço novo, e o `placing` de parede mostrando os novos espaços livres. No Node: `decor.js` coloca um item em cada espaço novo e recusa os reservados. Console sem erros.

**Arquivos permitidos:** `js/art.js`, `js/data.js` (só `WALL_SLOTS` e `ROOM.reservedWall`). **Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123). Use uma pasta de teste própria no scratchpad (não `t/`).
