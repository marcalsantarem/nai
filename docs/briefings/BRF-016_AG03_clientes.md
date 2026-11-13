# BRF-016 — AG03 (Arte) — T-018 Arte dos clientes

**Objetivo:** `js/art.js` desenha as entidades da simulação junto com a sala.

**Ler:** `docs/arquitetura.md` (entidades e `drawScene`); `js/data.js` (aparências, `BARISTA_LOOK`); `js/icons.js` (`drawIcon`); especificação, Ilustração isométrica (Personagens) e Telas (Cafeteria, item Cena). Mockup: `01-cafeteria.html` linhas 46–391 (clientes, balão do pedido, cliente sentado).

**Pronto quando:**
- `drawScene(ctx, { time, entities })` desenha móveis e personagens na mesma ordem de profundidade (`gx + gy`). Sem `entities`, desenha a sala como hoje, mas sem a barista fixa (ela passa a vir como entidade).
- Personagem por aparência (pele, cabelo liso/curto/comprido/coque/**cacheado**, cor, blusa): andando (balanço leve pelo `time`, virado para a direção), parado, sentado no banquinho, com copo na mão.
- Barista com a aparência da decisão 15 (pele levemente morena, cabelo cacheado castanho-escuro).
- Balão de pedido sobre o primeiro da fila: ícone da bebida (`drawIcon`) e nome, como no mockup.
- Coração subindo e sumindo (parâmetro de progresso 0–1 vindo da entidade).
- `drawPortrait(ctx, look, size)` para o retrato do cartão do pedido (viewBox 64 do mockup).
- 60 fps com 6 personagens.

**Arquivos permitidos:** `js/art.js` (e `js/iso.js` se precisar). O AG01 mexe em `js/state.js` e `js/sim.js` ao mesmo tempo: não toque. Não altere `js/screens/`.

**Validação:** página de teste temporária fora do repositório, com entidades de exemplo (fila de 3 com balão, 2 sentados, 1 andando com copo, barista): compare com o mockup lado a lado. Console sem erros.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
