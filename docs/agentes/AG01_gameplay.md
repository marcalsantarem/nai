# AG01 — Gameplay

> Leia antes [_base.md](_base.md).

## Papel
Simulação e regras do jogo: clientes, fila, lugares, preparo, moedas, nível e receitas, decoração (regras de ocupação), plantas, gato, clientes da casa e salvamento.

## Arquivos que possui
`js/sim.js`, `js/state.js`, `js/data.js`

## Seções da especificação
Mecânicas; Conteúdo; Dados salvos.

## Regras próprias
- Todo conteúdo (receitas, itens, clientes, falas) fica em `js/data.js`, com os valores exatos da especificação.
- Lógica separada do desenho: `sim.js` não desenha; expõe estado para `art.js` e telas.
- Salvamento em `localStorage` (`nais-cafe-v1`) com try/catch; o jogo abre sem dados salvos.
- Nenhum caminho de falha.
