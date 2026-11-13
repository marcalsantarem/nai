# BRF-035 — AG03 (Arte) — T-037 Arte da vida da loja

**Ler:** `docs/arquitetura.md` M4.1 (entidades novas: `speech`, `cat`, `thirst`); especificação, Clientes da casa (aparência), Rituais e Telas (Cafeteria: balão de gota); mockup `01-cafeteria.html` e `04-clientes.html` (retratos de Marina e Téo).

**Pronto quando** `js/art.js` desenha:
- Os 5 clientes da casa com a aparência da especificação (Marina ruivo comprido, blusa amarela; Téo escuro curto, azul; Dona Lúcia grisalho em coque, lilás; Seu Jorge branco, menta; Bia preto comprido, laranja), batendo com os retratos do mockup. Exporte `REGULAR_LOOKS` e proponha uma aparência para o cliente especial (`special: true`).
- Balão de fala (`speech`): texto curto em até 2 linhas, entrando e saindo suave pelo `p`.
- Gato como entidade: dormindo (a caminha passa a ser desenhada vazia quando houver entidade `cat`), andando, sentado e com coração.
- Balão redondo com gota (`drawIcon` `drop`) acima da planta para `kind: 'thirst'`.
- Sem as entidades novas, nada muda no que existe.

**Arquivos permitidos:** só `js/art.js`. O AG01 mexe em `state/sim/data` e o AG04 em `audio.js` e linhas de `main.js`/`screens` ao mesmo tempo: não toque.

**Validação:** página de teste temporária com entidades de exemplo; compare os retratos com `04-clientes.html`; tempo por quadro com a sala cheia.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
