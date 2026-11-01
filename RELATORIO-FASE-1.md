# Relatório Final — Fase 1 (Consolidação)

**Projeto:** `C:\FirstDemo\data\sp500-site`  
**Branch:** `feature/audit-phase-1` (integrada em `main` via PR #23)  
**Data:** 1 de novembro de 2026  
**Estado:** implementado, testado, integrado em `main` e implantado (API + GitHub Pages); Netlify pendente por crédito da conta

---

## 1. Resumo executivo

A Fase 1 foi implementada sem alterar a arquitetura base:

**Yahoo Finance + GitHub Actions + JSON + Express/Render + Netlify/GitHub Pages**

O dashboard passou a fazer o load inicial com **1 pedido** (`/api/snapshot`) em vez
de 13 (`/api/setores` + 11 `/api/setor/:id` + `/api/resumo-dia`). O snapshot junta
setores, resumo do dia, metadados, totais e um hash estável, servido também numa
URL versionada com cache imutável.

Foram ainda migrados os dados estáticos para JSON com `updatedAt` e validação de
schema, removido código morto e corrigido o cron de mercado para dias úteis.

---

## 2. Alterações

### 2.1 Ficheiros criados

| Ficheiro | Objetivo |
|---|---|
| `backend/scripts/build-snapshot.mjs` | Gera/valida o snapshot único (hash, schema, yield, frescor) |
| `backend/test/snapshot.test.js` | Testes de estrutura, hash, duplicados, yield e frescor |
| `frontend/dashboard/scripts/validate-static-data.mjs` | Valida os 4 datasets estáticos (envelope + schema) |
| `frontend/dashboard/src/data/dow-jones.json` | Dow Jones 30 + `updatedAt`/`source` |
| `frontend/dashboard/src/data/dividend-kings.json` | Dividend Kings + metadados |
| `frontend/dashboard/src/data/dividend-aristocrats.json` | Dividend Aristocrats + metadados |
| `frontend/dashboard/src/data/nasdaq-100.json` | Nasdaq-100 + metadados |
| `RELATORIO-FASE-1.md` | Este relatório |

### 2.2 Ficheiros modificados

| Ficheiro | Alteração |
|---|---|
| `backend/server.js` | `GET /api/snapshot` e `GET /api/snapshot/:versao`; loader com fallback em memória; rotas documentadas em `/` |
| `backend/package.json` | `prestart` gera snapshot; scripts `snapshot` e `validate:data`; `pretest` gera snapshot |
| `backend/test/api-hardening.test.js` | Cobertura de cache público, URL versionada e 404 sem cache |
| `frontend/dashboard/src/sector-store.js` | `getSnapshot`, `getResumoDia`, cache do snapshot e população dos caches de setores |
| `frontend/dashboard/src/main.js` | `carregarSetores` usa snapshot; fallback para rotas antigas |
| `frontend/dashboard/src/daily-summary.js` | Consome `getResumoDia` (sem pedido extra quando o snapshot já carregou) |
| `frontend/dashboard/src/api.js` | Removidos `getDailySummary` e `healthCheck` (sem consumidores) |
| `frontend/dashboard/src/{dow-jones,dividend-kings,dividend-aristocrats,nasdaq-100}.js` | Arrays passam a ser importados dos JSON |
| `frontend/dashboard/src/*.test.js` | Testes do snapshot e ajustes à migração |
| `frontend/dashboard/package.json` | `validate:data` e `pretest` |
| `frontend/dashboard/eslint.config.js` | Globals Node para `scripts/**/*.mjs` |
| `.github/workflows/update-market-data.yml` | Cron `0 6 * * 1-5` + validação do snapshot |
| `.github/workflows/update-daily-summary.yml` | Validação do snapshot |
| `.github/workflows/update-sectors.yml` | Validação do snapshot |
| `.github/workflows/tests.yml` | Validação do snapshot e dos dados estáticos |
| `.gitignore` | Ignora `backend/data/snapshot.json` (gerado) |
| `README.md`, `backend/README.md` | Documentação de endpoints, scripts e `SNAPSHOT_ALLOW_STALE` |

### 2.3 Removido

- `getDailySummary()` e `healthCheck()` de `frontend/dashboard/src/api.js` e respetivos testes.
- Duplicação dos arrays estáticos em JavaScript (passam a existir apenas nos JSON).

---

## 3. Snapshot único

### 3.1 Fluxo

```
backend/data/<setor>.json + daily-summary.json
                 │  backend/scripts/build-snapshot.mjs (prestart/CI)
                 ▼
        backend/data/snapshot.json  (gerado, não versionado)
                 │
                 ▼
   GET /api/snapshot           → 1 pedido, max-age=300 + SWR
   GET /api/snapshot/:versao   → max-age=31536000, immutable
                 │
                 ▼
   Dashboard: 1 fetch no arranque; abas reutilizam o store
```

### 3.2 Estrutura

```json
{
  "schemaVersion": 1,
  "versao": "0fdccba280a5",
  "generatedAt": "...",
  "referenceDate": "2026-10-30",
  "resumoDia": { "...": "..." },
  "setores": [
    { "id": "energy", "name": "Energy", "generatedAt": "...", "count": 21, "companies": [] }
  ],
  "totais": { "setores": 11, "empresas": 503 },
  "fontes": ["..."]
}
```

- `versao` = SHA-256 (12 caracteres) do **conteúdo** (setores + resumo).
- Timestamps (`generatedAt`, `liveUpdatedAt`) **não entram** no hash.
- Mesmo conteúdo ⇒ mesma versão, mesmo após regenerar o snapshot.

### 3.3 Validação

`node scripts/build-snapshot.mjs --check` verifica:

- 11 setores GICS, sem setores em falta/duplicados;
- empresas com `symbol`, `name`, `sector`, `marketCap`, `dividendYield`, `hasDividend`;
- símbolos duplicados e `count` por setor;
- guard de yield: `0 < dividendYield ≤ 25%`;
- `marketCap` positivo quando presente;
- `referenceDate` com no máximo **2 dias úteis**;
- hash recomputado igual ao `versao` guardado.

Escape documentado: `SNAPSHOT_ALLOW_STALE=1` desativa **apenas** o frescor.

---

## 4. Dados estáticos

Os quatro datasets passam a usar o envelope:

```json
{
  "schemaVersion": 1,
  "updatedAt": "2026-11-01",
  "source": "Dow Jones Industrial Average (componentes)",
  "items": []
}
```

O validador `frontend/dashboard/scripts/validate-static-data.mjs` verifica:

| Dataset | Itens | Regras adicionais |
|---|---:|---|
| Dow Jones 30 | 30 | `company`, `ticker`, `sector`, tickers únicos |
| Dividend Kings | 38 | idem |
| Dividend Aristocrats | 71 | `years` inteiro ≥ 25 |
| Nasdaq-100 | 100 | `rank` sequencial, `weight > 0`, `cumulative` coerente, soma 95–101% |

Os exports públicos (`DOW_JONES`, `DIVIDEND_KINGS`, etc.) mantêm-se, pelo que
componentes e testes não tiveram de mudar de API.

---

## 5. Cron e pipelines

| Workflow | Antes | Depois |
|---|---|---|
| `update-market-data.yml` | `0 6 */2 * *` (dia ímpar, podia saltar dias úteis) | `0 6 * * 1-5` (diário em dia útil) |

Os três workflows de dados e o `tests.yml` passam a correr:

```bash
node scripts/build-snapshot.mjs --check   # backend
node frontend/dashboard/scripts/validate-static-data.mjs
```

Assim, schema, hash, yield e frescor falham o CI antes de qualquer commit de dados.

---

## 6. Resultados

### 6.1 Pedidos no arranque

| Cenário | Antes | Depois |
|---|---|---|
| Dashboard (home) | 13 pedidos (1 lista + 11 setores + 1 resumo) | **1 pedido** (`/api/snapshot`) |
| Treemap/heatmap/inteligência após a home | 11 pedidos cada | **0 pedidos** (cache do snapshot) |
| Reabrir a home na mesma sessão | 1 + 11 (refresh explícito) | 1 (snapshot) |

### 6.2 Limpeza

- Nenhuma chamada a `express.json()` (API apenas de leitura).
- Removidos helpers sem consumidores.
- `backend/data/snapshot.json` é artefacto de build e está no `.gitignore`.

### 6.3 Validação em produção (após deploy)

Medições feitas em browser real (Chrome headless, cache desativada) depois do
merge em `main` e do deploy automático do Render:

| Alvo | Versão | Pedidos no arranque | Erros |
|---|---|---|---|
| API Render (`/api/snapshot`) | Fase 1 — `versao=0fdccba280a5`, 11 setores, 503 empresas | — | 0 |
| GitHub Pages (`index-BeDdHgnm.js`) | Fase 1 | **1** (`/api/snapshot → 200`) | 0 de consola, 0 de rede |
| Netlify (`index-BTTv6_ew.js`) | Fase 0 (deploy bloqueado) | 13 (todos `200`) | 0 de consola, 0 de rede |

Nas abas do dashboard em GitHub Pages: treemap **0** pedidos, heatmap **0**,
inteligência **1** (`/api/inteligencia-setorial`), curiosidade **1**
(`/api/curiosidades`) — o store populado pelo snapshot evita pedidos repetidos.

O frontend da Fase 0 que a Netlify continua a servir mantém-se funcional contra a
API da Fase 1 (retrocompatibilidade das rotas antigas).

---

## 7. Testes e validações

| Verificação | Resultado |
|---|---|
| Backend `npm test` | **50/50** |
| Frontend `npm test` (inclui `pretest` de dados) | **291/291** |
| Python `unittest` | **28/28** |
| `npm run lint` (dashboard) | OK |
| `prettier --check` (ficheiros alterados) | OK |
| `npm run validate:data` (dashboard) | OK |
| `npm run validate:data` (backend) | OK |
| `vite build` para diretório temporário | OK (26 módulos; `index-B4iRaAvx.js` 142,86 kB) |

Snapshot validado:

```
11 setores, 503 empresas, versão 0fdccba280a5, referência 2026-10-30
```

O build local de validação foi feito com `--outDir` temporário. Após o merge, o
workflow `deploy-dashboard` reconstruiu `frontend/docs` (commit `fd03281`),
publicado em GitHub Pages com o bundle `index-BeDdHgnm.js`.

---

## 8. Riscos e observações

1. **Netlify**: o último deploy publicado continua a ser `56e3339` (Fase 0). Os
   deploys de `8b23b92` e `fd03281` ficaram em `state=error` com `skipped=true`
   por limite de crédito da conta. A Fase 1 não altera essa situação; o novo
   código só será publicado quando os créditos forem repostos. Desde a tomada de
   decisão, o **GitHub Pages** é o frontend principal.
2. **Render**: o `prestart` gera o snapshot no arranque. Se `backend/data` não
   tiver os setores (contexto incompleto), o processo falha de forma explícita,
   como já acontecia com os datasets.
3. **Hash sem timestamps**: a versão identifica o conteúdo de dados. O campo
   `generatedAt` do topo pode variar entre builds com a mesma versão; os dados
   servidos são idênticos.
4. **Frescura**: o limite de 2 dias úteis pode falhar em feriados prolongados.
   O escape `SNAPSHOT_ALLOW_STALE=1` existe para cenários controlados e não deve
   ser usado em produção.
5. **Dados canónicos**: continuam em `frontend/<setor>/<setor>.json`; o espelho
   `backend/data` é sincronizado no `prestart` e pelos scripts Python.

---

## 9. Estado do Git

A Fase 1 está integrada em `main`:

| Commit | Conteúdo |
|---|---|
| `6763f66` | Backend: snapshot, rotas e testes |
| `9bcf0ad` | Frontend: snapshot no dashboard e dados estáticos em JSON |
| `c19e86d` | CI: validação do snapshot e dos dados nos workflows |
| `af00cc1` | Documentação: READMEs |
| `8b23b92` | Merge do PR #23 (`--merge`, preserva os 4 commits) |
| `fd03281` | Rebuild automático de `frontend/docs` pelo workflow |

---

## 10. Estado final e pendências

Concluído:

1. commit da Fase 1 na branch `feature/audit-phase-1`;
2. push e merge do PR #23 para `main`;
3. deploy automático do Render (API em Fase 1) e publicação em GitHub Pages
   (frontend principal, `index-BeDdHgnm.js`).

Pendente (fora do código):

- **Netlify**: desbloquear o crédito da conta e publicar o deploy `fd03281`, ou
  manter a Netlify como secundária. Não foi alterada faturação nem configuração.
