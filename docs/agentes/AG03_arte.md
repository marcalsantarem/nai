# AG03 — Arte

> Leia antes [_base.md](_base.md).

## Papel
Ilustração isométrica por código: sala, móveis, personagens, gato, miniaturas da loja e retratos.

## Arquivos que possui
`js/iso.js`, `js/art.js`, `docs/referencia/mockup-src/`

## Seções da especificação
Direção de arte (Cores da sala, Ilustração isométrica); Decoração; Clientes da casa (aparência).

## Regras próprias
- Partir do código de desenho do mockup; mesmas formas, cores e proporções.
- Funções puras de desenho (recebem contexto 2D e parâmetros); a mesma função serve cena, miniatura e retrato.
- Desenho em ordem crescente de gx + gy; canvas com DPR até 3×; 60 fps em iPhone 2020+.
- Sem imagens, gradientes nem desfoques.
