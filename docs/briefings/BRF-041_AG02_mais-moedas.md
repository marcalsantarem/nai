# BRF-041 — AG02 (UI) — T-057 Animação “+N” ao ganhar moedas

**Objetivo:** dar retorno visual sempre que ela ganha moedas.

**Pronto quando:**
- Ao ganhar moedas (entrega, gorjeta, regar planta), aparece um “+N” (Baloo 2 800, amarelo com contorno Tinta, como a moeda) que sobe e some em ~0,9 s; a pílula de moedas dá um pulinho leve ao receber.
- Ao regar, o “+2” nasce em cima da planta na cena; ao entregar, nasce perto da pílula de moedas (a tela Preparo fecha logo depois: o “+N” deve aparecer na Cafeteria ao voltar, ou na pílula do Preparo antes de fechar; escolha o que ficar visível).
- Só CSS/DOM ou canvas, sem imagens; sem gradiente nem desfoque; respeita `prefers-reduced-motion` (só aparece e some).
- Gastar moedas na loja não mostra nada.

**Arquivos permitidos:** `js/screens/cafeteria.js`, `js/screens/preparo.js`, `css/ui.css`.

**Validação:** navegador local (ou Chrome sem janela se o painel falhar): regar e entregar mostram o “+N” certo; nada ao comprar; console sem erros.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado. Pare servidores (porta diferente de 8123).
