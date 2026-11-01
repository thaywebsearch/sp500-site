# Relatório Final — Fase 0 (Quick Wins)

**Projeto:** `C:\FirstDemo\data\sp500-site`  
**Branch:** `feature/audit-phase-0`  
**Commit da fase:** `56e3339`  
**Data:** 31 de outubro de 2026  
**Estado:** implementado, testado, integrado em `main` e implantado

---

## 1. Resumo executivo

A Fase 0 foi concluída sem alterar a arquitetura existente:

**Yahoo Finance + GitHub Actions + JSON + Express/Render + Netlify/GitHub Pages**

Foram corrigidos problemas de segurança, cache, pedidos duplicados, alertas, resiliência e observabilidade, mantendo todas as abas e funcionalidades.

- Branch criada, commitada e publicada.
- Merge fast-forward para `main`.
- Deploy automático concluído em GitHub Pages, Netlify e Render.
- Backend e frontend validados em produção após o deploy.

---

## 2. Alterações

### 2.1 Ficheiros criados

| Ficheiro | Objetivo |
|---|---|
| `frontend/dashboard/src/sector-store.js` | Store único de setores com TTL e dedupe de promises |
| `frontend/dashboard/src/sector-store.test.js` | Testes do store |
| `backend/test/api-hardening.test.js` | Testes de cache, path traversal, timeout/retry, degradação e `/api/cotacoes` |
| `frontend/dashboard/public/_headers` | Cache de assets e cabeçalhos de segurança na Netlify |
| `RELATORIO-FASE-0.md` | Este relatório |

### 2.2 Ficheiros modificados

| Ficheiro | Alteração |
|---|---|
| `backend/server.js` | `Cache-Control`, allowlist de setores, timeout/retry, degradação graciosa, `/api/cotacoes`, mensagens seguras |
| `frontend/dashboard/src/api.js` | Timeout em todos os helpers, `getQuotes`, `encodeURIComponent` no histórico |
| `frontend/dashboard/src/main.js` | Store no carregamento inicial, badge de frescura com idade, alertas em lote com polling de 5 min |
| `frontend/dashboard/src/treemap.js` | Consome o store; `topCompany` passa a ser a maior empresa por market cap |
| `frontend/dashboard/src/heatmap.js` | Consome o store; remove awaits sequenciais e mutação de arrays |
| `frontend/dashboard/src/sector-intelligence.js` | Fallback passa a usar o store |
| `frontend/dashboard/src/test-setup.js` | Reset do store entre testes |
| `frontend/dashboard/src/dom.test.js` | Testes ajustados ao store e cache |
| `frontend/dashboard/src/main.dom.test.js` | Testes de polling, batch e store |
| `frontend/dashboard/index.html` | Footer com disclaimers |
| `frontend/dashboard/src/styles/dashboard.css` | Estilos dos disclaimers |
| `frontend/dashboard/public/sector-weights.html` | API como fonte principal, ficheiro relativo como fallback |
| `netlify.toml` | Documentado como fonte única de configuração |
| `render.yaml` | Documentação do impacto do `autoDeploy` (sem alteração funcional) |
| `.github/workflows/update-daily-summary.yml` | Job `report-failure` |
| `.github/workflows/update-market-data.yml` | Job `report-failure` |
| `.github/workflows/update-sectors.yml` | Job `report-failure` |
| `.github/workflows/update-sp500-table.yml` | Job `report-failure` |

### 2.3 Removidos

Nenhum.

### 2.4 Alterado localmente mas ignorado pelo Git

- `.netlify/netlify.toml` — alinhado com a raiz; é artefacto local do `netlify link`.

---

## 3. Q1 a Q10

| Item | Estado | Detalhe |
|---|---|---|
| **Q1 — Cache HTTP** | ✅ Implementado | `public, max-age=300, stale-while-revalidate=86400` em `/api/setores`, `/api/setor/:setor`, `/api/inteligencia-setorial`, `/api/curiosidades` e `/api/resumo-dia`. `/api/historico`: `max-age=120, swr=600`. `/api/cotacoes`: `max-age=60, swr=300`. `/api/health`, erros e 404: `no-store`. ETags nativos preservados. |
| **Q2 — Path traversal** | ✅ Implementado | `SETORES_VALIDOS` + `SETOR_RE` antes de qualquer acesso a ficheiro. Malformado → `400 SETOR_INVALIDO`; válido inexistente → `404 SETOR_NAO_ENCONTRADO`; sem caminhos internos nas respostas. |
| **Q3 — Store único de setores** | ✅ Implementado | `sector-store.js` com TTL de 15 min, dedupe de promises em curso e `force` para refresh. Home, treemap, heatmap e fallback da inteligência setorial partilham os mesmos 11 setores. |
| **Q4 — Alertas de preço** | ✅ Implementado | Batch `/api/cotacoes` (1 pedido por ciclo, máx. 25 símbolos), polling de 5 min, sem timers duplicados, sem ciclos sobrepostos, arranque também ao criar alerta. |
| **Q5 — Timeout/retry/degradação** | ✅ Implementado | `AbortController` (8 s configurável), 1 retry com backoff em timeout/rede/5xx, distinção `timeout`/`fonte`/`sem-dados`, último resultado bom por símbolo e mensagens seguras. |
| **Q6 — Netlify unificado** | ✅ Implementado | `netlify.toml` da raiz é a fonte de verdade. `.netlify/netlify.toml` alinhado localmente. `sector-weights.html` corrigido. `_headers` publicado. |
| **Q7 — Disclaimers** | ✅ Implementado | Footer discreto: não é recomendação financeira, fonte/frescura dos dados e marcas de terceiros. |
| **Q8 — autoDeploy Render** | ⚠️ Parcial (por desenho) | Documentado em `render.yaml`; não alterado funcionalmente. Ação manual recomendada na secção 7. |
| **Q9 — Frescor dos dados** | ✅ Implementado | Badge baseado em `generatedAt`, com data, idade, classes `fd-fresh`/`fd-aging`/`fd-stale` e atributos `data-idade-dias`/`data-frescura`. |
| **Q10 — Falhas CI visíveis** | ✅ Implementado | Job `report-failure` nos 4 workflows de dados. Abre uma issue por workflow ou comenta na existente, com link da execução. Requer `issues: write`. |

---

## 4. Resultados

### 4.1 Redução de pedidos

| Cenário | Antes | Depois |
|---|---|---|
| Home + treemap + heatmap + inteligência | ~48 pedidos (12 por vista) | 12 pedidos únicos partilhados pelo store |
| Alertas com 5 símbolos | 5 pedidos de 2 anos de histórico a cada 60 s | 1 pedido batch a cada 5 min |
| Repetição em menos de 5 min | Chegava sempre ao Render | Servida pelo browser/CDN, com revalidação por ETag |

### 4.2 Segurança

- Path traversal eliminado por allowlist.
- Removidas mensagens internas (`erro.message`) das respostas da API.
- Rota 404 deixou de expor `rota` e `metodo`.
- Body parsing removido de uma API apenas de leitura.

### 4.3 Alertas

- Intervalo: 60 s → 300 s.
- 2 anos de histórico por alerta → 1 pedido batch de cotações.
- Alertas criados depois do arranque passam a ser monitorizados.
- Sem loops duplicados nem ciclos sobrepostos.

### 4.4 Netlify

- Uma única configuração efetiva.
- `sector-weights.html` deixa de depender de JSON não publicado.
- `_headers` aplicado em produção.

---

## 5. Testes

### 5.1 Executados e aprovados

| Verificação | Resultado |
|---|---|
| Backend `npm test` | 37/37 |
| Frontend `npm test` | 289/289 |
| Integridade de dados Python | 28/28 |
| ESLint | Sem erros |
| Prettier nos ficheiros alterados | Aprovado |
| Build Vite para diretório temporário | Aprovado |
| JSON existentes | 24 ficheiros válidos, nenhum alterado |
| YAML dos workflows e `render.yaml` | Válido |
| CORS | Testes existentes aprovados |
| Segredos | Nenhum token/chave introduzido |
| `git diff --check` | Sem problemas |
| Navegação entre abas, reload, cache, `/api/setor` inválido e alertas | Coberto por testes de integração/DOM |

### 5.2 Executados e falhados

Nenhum.

### 5.3 Não executados

- Network tab em browser real (sem browser automatizado no ambiente).
- Chamadas reais ao Yahoo durante os testes (usado stub local).
- Teste provocado de falha dos workflows (o job só corre em falha real).

> `npm run format:check` global assinala `agent.md`, ficheiro untracked pré-existente que não foi alterado. Todos os ficheiros desta fase passam no Prettier.

---

## 6. Integração e deploy

### 6.1 Git

| Passo | Resultado |
|---|---|
| Push da branch | `feature/audit-phase-0` publicada |
| Merge | Fast-forward para `main` — commit `56e3339` |
| Push de `main` | `874c271..56e3339` |
| Sincronização final | `main` em `1ad87e2` (rebuild automático de `docs`) |

### 6.2 Plataformas

| Plataforma | Estado | Verificação |
|---|---|---|
| GitHub Pages | ✅ Deploy concluído | Site `200`, disclaimer presente |
| Netlify | ✅ Deploy automático do commit `56e3339` | `200`, disclaimer, `X-Content-Type-Options: nosniff` |
| Render | ✅ Novo código em produção | Cache-Control correto |
| Workflow Build do Dashboard | ✅ Sucesso | Lint, testes, build e commit de `docs/` |

### 6.3 Verificações em produção

| Verificação | Resultado |
|---|---|
| `GET /api/setor/..%2f..%2fpackage` | **400** `SETOR_INVALIDO` |
| `GET /api/setores` | **200** com `public, max-age=300, stale-while-revalidate=86400` |
| `GET /api/cotacoes?symbols=AAPL` | **200** com cotação real (`AAPL: 344.63`, `2026-10-30`) |
| `sector-weights.html` | **200**, usa a API como fonte principal |
| GitHub Pages e Netlify | **200** com disclaimers |

---

## 7. Ações manuais recomendadas

### Render

1. **Settings → Build & Deploy → Auto-Deploy**: definir `No` ou `After CI checks pass`.
   - Evita reinícios da API causados apenas por commits automáticos de dados.
   - Deploys de código passam a ser manuais (`Deploy latest commit`) ou por deploy hook.
2. Confirmar `CORS_ORIGINS`.
3. Opcional: definir `YAHOO_TIMEOUT_MS` (por omissão 8000).

### GitHub

1. **Settings → Actions → General → Workflow permissions**: garantir `Read and write permissions`.
   - Necessário para o job `report-failure` criar/comentar issues.
2. Opcional: criar o label `data-update-failure`.
3. Confirmar que as Issues estão ativas no repositório.

### Netlify

1. Confirmar que o site usa o `netlify.toml` do repositório.
2. Remover overrides manuais no painel, se existirem.

> Estas ações dependem de painéis externos e **não foram executadas**.

---

## 8. Limitações conhecidas

- **Alertas:** `/api/cotacoes` usa o último fecho diário disponível no Yahoo, com cache de 60 s. A latência máxima é de 5 min e não é uma cotação intradiária em tempo real.
- **Degradação:** se o Yahoo falhar, `/api/historico` pode servir o último resultado válido em memória (até 24 h) com cabeçalho `Warning`.
- **Cache de setores:** TTL de 15 min por sessão; o carregamento inicial do dashboard força refresh explícito.
- **AutoDeploy:** o Render reiniciou a API com este push porque a opção continua ativa; a alteração depende do painel.
- **Falhas CI:** o job `report-failure` só será exercitado numa falha real e depende das permissões de Actions.

---

## 9. Ficheiros não versionados

Continuam untracked, como antes da fase:

- `AUDITORIA-TECNICA.md`
- `AUDITORIA-TECNICA.html`
- `frontend/dashboard/agent.md`
- `RELATORIO-FASE-0.md` (este relatório)
