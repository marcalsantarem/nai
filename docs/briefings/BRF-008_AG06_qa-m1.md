# BRF-008 — AG06 (QA) — T-010 Validação do M1

**Objetivo:** dizer se o M1 (Base visual) passa, comparando o jogo com o mockup e a especificação.

**Ler:** `docs/00_biblia_projeto.md` (escopo do M1); especificação, seções Direção de arte, Telas (Regras comuns e Cafeteria), Plataforma e Critérios de aceite (só os que valem para o M1). Referência visual: `docs/referencia/mockup-src/01-cafeteria.html` (o mockup tem clientes e balões; no M1 eles **não** devem aparecer).

**Onde testar:**
- Local: `python -m http.server <porta livre, não 8123>` na raiz, ou o servidor `naicafe` do `.claude/launch.json`.
- Publicado: https://dev--naicafe.netlify.app (já contém a versão a validar).
- Larguras: 390 × 844 (referência), 360 × 780, 430 × 932 e uma janela larga (≥ 1200).
- Se a captura de tela falhar porque o painel do navegador está oculto, a animação (rAF) para e a cena fica vazia: registre isso como limitação e confira o que puder por código (posições, cores computadas, fontes carregadas, `drawScene` desenhando num canvas à parte).

**Verificar:**
1. Topo, cena, cartão vazio e navegação batem com o mockup em posição, tamanho, cores, fontes, contornos e sombras.
2. Sala completa (lista na especificação, Ilustração isométrica), sem clientes; chuva, luzinhas e gato animando.
3. “Nai's Cafe” no topo e no título da página; nenhum “Nossa Cafeteria”.
4. Nenhum arquivo de imagem na cena e na interface; sem gradientes, desfoques e emoji.
5. Coluna ≤ 430 com fundo ao redor; sem rolagem horizontal; 56 pt no topo e 28 pt na base; alvos ≥ 44 pt.
6. Console sem erros, local e publicado. `html[data-version]` presente.
7. Pontos para opinar: a 360, “Aguardando o próximo cliente” quebra em 3 linhas; o quadro-negro mostra “Cardápio” (a especificação pede “Nai's Cafe” no quadro-negro nos critérios de aceite).

**Entrega:** `docs/qa/qa-M1.md` com veredito (passa / passa com ressalvas / não passa), tabela de diferenças (onde · esperado · obtido · gravidade) e o que não pôde ser testado. Resposta ao AG00 no formato padrão (máx. 10 linhas).

**Arquivos permitidos:** só `docs/qa/`. Não altere código.

**Regras:** sem commit, push ou branch; fique no escopo. Pare servidores e feche abas que abrir.
