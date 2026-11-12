# BRF-013 — AG01 (Gameplay) — T-015 Dados do jogo

**Objetivo:** `js/data.js` com todo o conteúdo e as constantes do M2.

**Ler:** `docs/arquitetura.md` (seção de Dados e a grade da sala); especificação, seções Conteúdo (Receitas, Ingredientes e camadas) e Mecânicas (Clientes e fila, Preparo e moedas, Nível e receitas); decisões 13, 15, 19, 21 e 25 em `docs/decisoes.md`.

**Pronto quando** `js/data.js` (módulo ES, só dados, sem lógica) exporta, no formato da arquitetura:
- 8 receitas com id, nome, preço, passos em ordem e marco de liberação (Café com leite batido: Moer, Espresso, Espuma, Leite; 12 moedas; libera com 10). Marcos: 6, 10, 14, 24.
- Ingredientes: id, nome do botão, texto da dica (“Agora coloque…”, no tom do mockup `02-preparo.html`), camada (altura em %, cor) e o passo de desenho na espuma (coração, flor, estrela).
- Constantes do ciclo: primeira chegada ~2 s, chegada 7–14 s, fila máx. 3, 1,7 ladrilho/s, mesa 14–26 s, 40 moedas iniciais, gorjeta 0–2, +1 com desenho, marcos de nível.
- Grade da sala (porta, fila, pontos de passagem, lugares), conforme a arquitetura.
- Clientes comuns: lista de nomes brasileiros comuns (sem Marina, Téo, Lúcia, Jorge, Bia) e aparências variadas (pele, cabelo, estilo, blusa) dentro da paleta do jogo.
- `BARISTA_LOOK`: pele levemente morena, cabelo cacheado castanho-escuro.

**Arquivos permitidos:** só `js/data.js`.

**Validação:** `node --input-type=module -e "import('./js/data.js')..."` importa sem erro; confira preços, passos e marcos contra a especificação.

**Regras:** sem commit, push ou branch; fique no escopo; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
