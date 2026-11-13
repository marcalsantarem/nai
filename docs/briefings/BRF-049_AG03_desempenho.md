# BRF-049 — AG03 (Arte) — T-049 Desempenho

**Ler:** especificação, Plataforma (Desempenho: 60 fps em iPhones de 2020 em diante) e Renderização.

**Pronto quando:** a cena mantém folga para 60 fps num iPhone de 2020 com a sala cheia (todos os itens, 6 clientes, gato, balões, chuva) e DPR 3:
- Meça o custo por quadro de `drawScene` no desktop com CPU limitada (ex.: Chrome DevTools com 4× ou 6× de throttling) e defina uma meta (ex.: ≤ 4 ms a 6×).
- Otimize sem mudar o visual: por exemplo, guardar em canvas fora da tela as partes estáticas (piso, paredes, móveis parados) e redesenhar só quando o layout, a parede, o piso ou o DPR mudarem; evitar criar objetos a cada quadro; `Path2D` reaproveitado.
- Mesmo resultado pixel a pixel (ou diferença mínima explicada) antes e depois, na sala inicial e na sala cheia.
- A API de `drawScene` não muda para quem chama.

**Arquivos permitidos:** `js/art.js`, `js/iso.js`. O AG02 mexe em `css/` e `js/screens/` e o AG05 no `index.html` ao mesmo tempo: não toque.

**Validação:** tabela antes/depois (ms por quadro, normal e com throttling) e comparação de pixels; console sem erros. Diga que o fps real no iPhone não foi medido.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123); pasta de teste própria no scratchpad.
