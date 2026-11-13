# BRF-043 — AG01 (Gameplay) — T-058 Setters oficiais de ajustes

**Objetivo:** o painel de Ajustes (T-042) hoje muda `get().settings` e `get().name` direto e chama `save()`, sem avisar os ouvintes do estado.

**Pronto quando:** `js/state.js` exporta `setSettings(patch)` (mescla `music`/`rain`, valida booleanos) e `setName(text)` (corta em 24, vazio = “Nai's Cafe”), ambos gravando e avisando os ouvintes (evento `settings` / `name`); `js/screens/ajustes.js` passa a usar esses setters (**alteração autorizada só nas chamadas**); o topo da Cafeteria e o áudio reagem pelo evento. Registre em `docs/arquitetura.md` M4.2 (1–2 linhas).

**Arquivos permitidos:** `js/state.js`, `js/screens/ajustes.js` (só as chamadas), `docs/arquitetura.md`.

**Validação (Node):** setters gravam, avisam e validam; salvo recarregado igual.

**Regras:** sem commit, push ou branch; entrega no formato padrão (máx. 10 linhas), com o que **não** foi verificado.
