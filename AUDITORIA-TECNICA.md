# Auditoria Técnica — sp500-site

**Projeto:** `C:\FirstDemo\data\sp500-site`
**Data:** 31 de outubro de 2026
**Escopo:** análise estática do repositório + sondagem somente-leitura da API em produção (`https://sp500-api.onrender.com`)
**Natureza:** auditoria read-only — nenhum arquivo do projeto foi alterado durante a investigação

---

## 1. Resumo executivo

O sistema é um dashboard estático (Vite / JavaScript puro) servido pela Netlify, alimentado por uma API Express no Render (free tier), cujos dados são arquivos JSON commitados no próprio repositório por GitHub Actions.

A única fonte de dados de mercado ao vivo é o **Yahoo Finance**, acessado por endpoints não oficiais (`yfinance` + `query1.finance.yahoo.com` com cookie/crumb). Não há provedor pago, banco de dados, cache HTTP ou camada de persistência externa: **o Git é o banco de dados**.

**Veredito:** funciona e custa **US$ 0 em dinheiro**, mas é frágil em quatro eixos simultâneos:

| Eixo | Situação |
|---|---|
| **Confiabilidade** | API dorme após 15 min (cold start de 30–60 s); cada commit do bot reinicia o serviço (`autoDeploy: true`) |
| **Performance** | 13 requisições no load inicial, ~39 numa navegação completa; nenhum `Cache-Control`, CDN em `DYNAMIC` |
| **Conformidade** | Yahoo ToS proíbe uso comercial/coleta automatizada; não há licença de exibição para S&P 500, GICS, Dow, Nasdaq-100 |
| **Frescor** | `daily-summary` com `referenceDate` um dia atrás; cron `*/2` não significa "a cada 48 h" |

**Custo real:** ~US$ 0/mês em caixa, com passivo jurídico não precificado e dívida operacional crescente.

**Caminho recomendado:** quick wins de cache/segurança/duplicação (uma tarde) → consolidação em snapshot único (1–2 semanas) → migração para FMP + Netlify Functions com Blobs (2–4 semanas).

---

## 2. Arquitetura atual

```
┌─────────────────────────── FONTES EXTERNAS ────────────────────────────┐
│  GitHub: datasets/s-and-p-500-companies (CSV, PDDL-1.0)                 │
│  Yahoo Finance (endpoints NÃO oficiais)                                 │
│    • /v8/finance/chart          (séries de preço)                       │
│    • /v10/finance/quoteSummary  (cookie + crumb)                        │
│    • yfinance >= 0.2.55                                                 │
└───────────────┬──────────────────────────────────┬──────────────────────┘
                │ GitHub Actions (cron)            │ HTTPS não oficial
                ▼                                  ▼
   ┌────────────────────────────┐      ┌───────────────────────────────┐
   │ update_sectors.py          │      │ update_live_data.py           │
   │ update_sp500_table.py      │      │ update_daily_summary.py       │
   │ (JSON + README + TOP50)    │      │ (marketCap, dividendYield,    │
   └────────────┬───────────────┘      │  daily-summary.json)          │
                │                      └──────────────┬────────────────┘
                ▼                                     ▼
   ┌──────────────────────────────────────────────────────────────────┐
   │  frontend/<setor>/<setor>.json   ← CANÔNICO (fonte da verdade)   │
   │  backend/data/*.json             ← espelho (sync-data.mjs)        │
   │  backend/data/daily-summary.json                                 │
   └────────────┬─────────────────────────────────────────────────────┘
                │ git commit + push (bot)
                ▼
   ┌────────────────────────────┐        ┌──────────────────────────────┐
   │ Render (autoDeploy: true)  │        │ Netlify                      │
   │ Express server.js          │◄───────│ publica frontend/dashboard   │
   │ • cache em memória (mtime) │  HTTPS │ SPA consome VITE_API_URL     │
   │ • rate limit 300/15min     │        │ (fallback p/ Render)         │
   │ • /api/historico → Yahoo   │        └──────────────────────────────┘
   └────────────────────────────┘
```

### Observações estruturais

- O `prestart` (`backend/scripts/sync-data.mjs`) copia `frontend/` → `backend/data`. Se o canônico não existir, preserva a versão versionada. Há **duas cópias do mesmo dado** no repositório, hoje idênticas byte a byte, mas sem verificação em runtime.
- Não existe etapa de build de dados: o dashboard lê JSON cru em runtime, não um snapshot com hash/versão.
- Não há banco, fila, cache distribuído ou storage de objetos. Persistência = commits.
- `netlify.toml` (raiz) publica `frontend/docs`, enquanto `.netlify/netlify.toml` aponta para `frontend/dashboard/docs` — **duas configurações conflitantes**. `frontend/docs/sector-weights.html` referencia `../<setor>/<setor>.json`, provável 404 quando apenas `docs/` é publicado.

---

## 3. Inventário de dados

### 3.1 Setores (canônico + espelho)

11 arquivos GICS, **503 empresas**, **207.734 bytes** no total (≈ 203 KB):

| Setor | Bytes |
|---|---:|
| information-technology | 31.398 |
| industrials | 34.221 |
| financials | 31.143 |
| health-care | 24.341 |
| consumer-discretionary | 19.564 |
| consumer-staples | 14.172 |
| utilities | 12.461 |
| real-estate | 12.229 |
| materials | 9.950 |
| communication-services | 9.548 |
| energy | 8.707 |
| **Total** | **207.734** |

Cada arquivo contém identidade, classificação setorial e métricas derivadas (`marketCap`, `dividendYield`, pesos). `backend/data/` mantém cópias idênticas.

### 3.2 Outros conjuntos

| Arquivo | Conteúdo | Atualização |
|---|---|---|
| `backend/data/daily-summary.json` | Resumo diário (gerado 2026-10-31 00:58 UTC, `referenceDate` 2026-10-29) | Workflow dias úteis 21:30 UTC |
| `frontend/src/data/curiosidades.json` | Curiosidades (617 B) | Manual/estático |
| `frontend/dashboard/src/{dow-jones,dividend-kings,dividend-aristocrats,nasdaq-100}.js` | Arrays hardcoded no bundle | Manual |
| `frontend/docs/*` | Páginas estáticas auxiliares | Manual |

### 3.3 Qualidade dos dados estáticos

| Conjunto | Registros | Campos | Lacuna |
|---|---:|---|---|
| Dow Jones | 30 | `company, ticker, sector` | Sem peso, preço ou variação |
| Dividend Kings | 38 | identidade, setor, anos | Sem métricas financeiras |
| Dividend Aristocrats | 71 | identidade, setor, anos | Sem métricas financeiras |
| Nasdaq-100 | 100 | `rank, ticker, company, sector, weight, cap, category, cumulative, concentration` | **Congelado** — pesos e ranks não são recalculados |

Por estarem compilados no bundle, não têm `updatedAt`, não passam por teste de integridade e só mudam com rebuild do frontend.

---

## 4. Mapa aba → fonte de dados

| Aba / componente | Fonte | Chamadas | Cache | Risco |
|---|---|---:|---|---|
| Visão geral / cards | `/api/setores` | 1 | Nenhum header | — |
| S&P 500 (tabela) | 11× `/api/setor/<setor>` | 11 | Nenhum | 12 chamadas só na home |
| Resumo do dia | `/api/resumo-dia` | 1 | Nenhum | Dado com 1 dia de atraso |
| Curiosidades | `/api/curiosidades` | 0–1 | Nenhum | Estático |
| Treemap | 11× `/api/setor/<setor>` (**repetido**) | 11 | Nenhum | Duplica o fetch da home |
| Heatmap | 11× `/api/setor/<setor>` (**repetido, sequencial**) | 11 | Nenhum | Duplica + waterfall |
| Sector Intelligence | `/api/setores` + fallback 11 setores | 1 (ou 12) | Nenhum | Fallback caro |
| Histórico / gráfico | `/api/historico?symbol=…` (proxy Yahoo) | sob demanda | **Nenhum** | Sem timeout/retry |
| Dow Jones | array no bundle | 0 | Bundle | Estático |
| Dividend Kings | array no bundle | 0 | Bundle | Estático |
| Dividend Aristocrats | array no bundle | 0 | Bundle | Estático |
| Nasdaq-100 | array no bundle | 0 | Bundle | Congelado |
| Alertas de preço | `/api/historico` por alerta, a cada 60 s | 1/alerta/min | Nenhum | Ver §6.3 |

**Contagem:** load inicial = **13**; tour completo ≈ **39**; desses, **33 são o mesmo payload de setor** (11 × 3 consumidores).

---

## 5. Dependências externas

| Dependência | Uso | Criticidade | Observação |
|---|---|---|---|
| **Yahoo Finance** (não oficial) | Preços, histórico, market cap, yield | **Crítica** | Sem SLA nem contrato; ToS restritivo; quebra sem aviso |
| `yfinance >= 0.2.55` | Coleta em lote (4 workers) | Crítica | Depende de scraping; muda com frequência |
| `yahoo_quotes.py` (cookie + crumb) | Fallback de cotação | Alta | Mais frágil que o `yfinance` |
| GitHub `datasets/s-and-p-500-companies` | Constituintes e setores | Média | PDDL-1.0, estável |
| **Render** (free) | Hospedagem da API | Crítica | Sleep 15 min; cold start 30–60 s |
| **Netlify** (free) | Hospedagem do SPA | Crítica | Limites de build/banda |
| **GitHub Actions** | Agendamento e persistência | Crítica | Repo público = gratuito |
| CDNs de UI / fontes | Assets | Baixa | — |

**Não existe:** FMP, Alpha Vantage, Polygon, Tiingo, Finnhub, IEX, banco de dados, Redis, Sentry ou analytics de erro.

---

## 6. Pipelines, agendamentos e backend

### 6.1 Workflows

| Workflow | Cron | Função | Commita? |
|---|---|---|---|
| `update-sectors.yml` | `0 6 * * 1` | Regenera 11 JSONs + README + TOP50 | Sim |
| `update-market-data.yml` | `0 6 */2 * *` | marketCap + dividendYield, 503 tickers, 4 workers | Sim |
| `update-daily-summary.yml` | `30 21 * * 1-5` | `/v8/chart` 5d/1d, grava `daily-summary.json` | Sim |
| `update-sp500-table.yml` | `0 0 * * 1` | Lista/tabela de constituintes | Sim |
| `deploy-dashboard.yml` | `0 7 * * 1` + push | Rebuild/deploy Netlify | Não |
| `tests.yml` | em `paths` | `test_data_integrity.py` | Não |

### 6.2 Problemas nos agendamentos

1. **`0 6 */2 * *` não é "a cada 48 h".** O cron reinicia no dia 1; em meses de 31 dias há intervalo de 24 h, em fevereiro até 72 h.
2. **Defasagem do resumo diário.** Agendado para 21:30 UTC, mas gerado às 00:58 UTC (~3,5 h de atraso), com `referenceDate` um pregão atrás.
3. **Cada commit do bot dispara `autoDeploy`** no Render, reiniciando a API — inclusive em horário de pico.
4. **Acoplamento Git↔dados:** force-push, rebase ou conflito quebra a ingestão silenciosamente, sem alerta.
5. **`deploy-dashboard` semanal ≠ dados semanais:** rebuild só às segundas 07:00 ou em push no dashboard.

### 6.3 Backend (Express / Render)

| Rota | Função |
|---|---|
| `GET /api/setores` | Lista de setores + metadados |
| `GET /api/setor/:setor` | JSON do setor |
| `GET /api/resumo-dia` | `daily-summary.json` |
| `GET /api/curiosidades` | Curiosidades |
| `GET /api/historico?symbol=` | Proxy Yahoo (séries) |

**Cache e HTTP**

- Cache em memória por `mtime` + `size`: evita releitura de disco, não evita transferência nem latência de rede.
- **Nenhum `Cache-Control`** → navegador e CDN não reutilizam nada.
- ETags fracos (`W/`) presentes, inúteis sem `Cache-Control`.
- `cf-cache-status: DYNAMIC` → Cloudflare não cacheia; todo request chega ao Render.
- `/api/historico` sem cache algum.

**Alertas de preço (bug crítico)**

- Polling a cada 60 s, 1 request de 2 anos de histórico por alerta, sequencial.
- 5 alertas → **75 req/15 min**, acima do limite de **60/15 min** → 429 garantido.
- `startPriceAlertPolling()` retorna cedo quando não há alertas no boot: alertas criados depois **nunca são pollados** até reload.
- Para checar preço atual, busca-se 2 anos de série — custo desnecessário.

**Rate limiting**

| Escopo | Limite |
|---|---|
| Global | 300 req / 15 min / IP |
| `/api/historico` | 60 req / 15 min / IP |

Um load inicial (13) + tour (39) consome ~17% da cota global; F5 e troca de abas esgotam rápido. Usuários atrás de NAT compartilham o limite.

**Segurança**

- **Path traversal / information disclosure:** `/api/setor/:setor` interpola entrada do usuário em `path.join` **sem allowlist** — entradas com `..` escapam do diretório de dados.
- **Sem timeout/retry** em chamadas externas: um hang do Yahoo prende a request.
- **CORS** restrito, mas com URL de produção hardcoded como fallback em `VITE_API_URL`.
- **Sem autenticação** em nenhuma rota (aceitável para dados públicos, mas `/api/historico` é amplificador de scraping).
- `express.json()` habilitado num serviço somente GET (superfície desnecessária).

### 6.4 Frontend

- `main.js` concentra load inicial e dispatch de abas; `heatmap.js`, `treemap.js` e `sector-intelligence.js` refazem o fetch dos 11 setores.
- Heatmap é sequencial (11 awaits em cadeia) → waterfall perceptível.
- `api.js` expõe helpers não usados em produção (código morto).
- Sem `AbortController`, retry, estado de erro global ou skeleton consistente.

---

## 7. Custos atuais

| Item | Plano | Custo/mês | Limite relevante |
|---|---|---:|---|
| Render | Free | **US$ 0** | Sleep 15 min; cold start 30–60 s |
| Netlify | Free | **US$ 0** | 100 GB banda, 300 min build |
| GitHub Actions | Repo público | **US$ 0** | Ilimitado no padrão |
| Yahoo Finance | "Grátis" | **US$ 0** | **Sem contrato; uso não autorizado** |
| **Total em caixa** | | **≈ US$ 0** | |

**Custo oculto**

- **US$ 7/mês** para eliminar cold start (Render pago).
- **US$ 9–20/mês** se a Netlify sair do Free (modelo de créditos 2026: 300 / 1.000 / 3.000).
- **Passivo jurídico** por dados Yahoo + marcas indexadas — não quantificável.
- **Tempo de engenharia:** cada quebra do Yahoo exige patch manual sem observabilidade.

---

## 8. Riscos

### 8.1 Técnicos

| # | Risco | Sev. | Prob. | Impacto |
|---|---|---|---|---|
| T1 | Yahoo bloqueia/altera endpoint; dados param sem alerta | **Alta** | Alta | Dashboard congela silenciosamente |
| T2 | Path traversal em `/api/setor/:setor` | **Alta** | Média | Vazamento de arquivos |
| T3 | 429 nos alertas (75 > 60 req/15 min) | Média | **Certa** | Alertas param de funcionar |
| T4 | Cold start + restart a cada commit do bot | Média | Alta | UX ruim, timeouts |
| T5 | Sem `Cache-Control`; todo tráfego no Render | Média | **Certa** | Custo, latência, rate limit |
| T6 | `referenceDate` defasado no resumo | Média | Alta | Informação incorreta |
| T7 | Cron `*/2` com deriva em virada de mês | Baixa | Certa | Frescor irregular |
| T8 | Configs Netlify conflitantes; `sector-weights.html` 404 | Média | Alta | Deploy publica árvore errada |
| T9 | Sem timeout/retry em outbound | Média | Média | Requests penduradas |
| T10 | Dados estáticos congelados no bundle | Baixa | Certa | Pesos/ranks desatualizados |
| T11 | Sem observabilidade | **Alta** | Certa | Falhas descobertas pelo usuário |
| T12 | Canônico/espelho sem verificação em runtime | Baixa | Baixa | Divergência silenciosa |

### 8.2 Licenciamento e conformidade

| # | Risco | Detalhe |
|---|---|---|
| L1 | **Yahoo ToS** | Proíbe coleta automatizada e reuso comercial; não há API oficial contratada |
| L2 | **S&P 500 / GICS** | Marcas da S&P Dow Jones Indices; exibição pública exige licença |
| L3 | **Dow Jones / Nasdaq-100** | Uso de pesos e composição não é coberto por uso nominativo |
| L4 | **"Dividend Aristocrats/Kings"** | Marcas registradas; a lista pode ser conteúdo proprietário |
| L5 | **FMP** | Exibição pública exige Data Display and Licensing Agreement — o preço da API não inclui redistribuição |
| L6 | **Constituintes** | Base PDDL-1.0 é ok, mas o enriquecimento com Yahoo contamina a licença do conjunto |
| L7 | **Sem disclaimers** | Falta aviso de "não é recomendação", "dados não oficiais" e "marcas de terceiros" |

---

## 9. Comparação: atual vs. FMP + Netlify Functions

| Critério | Atual (Yahoo + Render + Git) | Proposta (FMP + Functions + Blobs) |
|---|---|---|
| Fonte | Yahoo não oficial | FMP contratado |
| Coleta | 503 requisições individuais | **1–poucas chamadas em batch** |
| Frequência | Cron GitHub (48 h nominal) | Function agendada (15 min / 1 h) |
| Persistência | Commits no Git | **Netlify Blobs** (snapshot versionado) |
| Leitura | Express no Render (sleep) | Function HTTP + **CDN** |
| Cache | Nenhum | `Cache-Control` + `ETag` + `stale-while-revalidate` |
| Cold start | 30–60 s | ~0 (edge) |
| Load inicial | 13 requests | **1–2** |
| Conformidade | Frágil | Depende de contrato de exibição |
| Custo | US$ 0 (+ passivo) | US$ 19–49 + US$ 0–9 |
| Observabilidade | Nenhuma | Logs + alarme de frescor |
| Manutenção | Patch manual quando Yahoo quebra | Estável sob contrato |

### 9.1 Preços FMP (consultados em 2026-10-31)

| Plano | Anual | Mensal | Calls/min | Cobertura | Histórico |
|---|---:|---:|---:|---|---|
| Basic | US$ 0 | US$ 0 | — | 250 calls/**dia** | Limitado |
| **Starter** | **US$ 19** | US$ 29 | 300 | EUA | 5 anos |
| **Premium** | **US$ 49** | US$ 69 | 750 | Global | 30 anos + intraday |
| Ultimate | US$ 99 | US$ 139 | — | Global | Completo |

> **Atenção:** o endpoint de batch quote é descrito como recurso premium/pago. No Starter, validar se o multi-símbolo atende 503 tickers por chamada ou se será necessário fatiar.

### 9.2 Limites Netlify Functions (2026)

| Tipo | Timeout | Payload |
|---|---:|---:|
| Síncrona (HTTP) | 60 s | 6 MB |
| Agendada | 30 s | — |
| Background | 15 min | — |

- Function agendada exige deploy publicado.
- Functions não persistem arquivos: é obrigatório usar **Blobs**, Netlify DB ou snapshots em build.
- 207 KB cabe folgado em qualquer modo.

### 9.3 Desenho proposto

```
FMP (batch quotes + profiles + ratios TTM)
        │  1–N chamadas/dia (background function, 15 min de folga)
        ▼
Netlify Background Function  ──►  Netlify Blobs (snapshot.json + versão)
                                        │
                                        ▼
                              Netlify Function HTTP (GET /api/snapshot)
                                        │  Cache-Control: public, max-age=300,
                                        │  stale-while-revalidate=86400
                                        ▼
                                     CDN Netlify
                                        │
                                        ▼
                                   Dashboard (1 fetch)
```

Ganhos: elimina 503 loops, elimina cold start, elimina commits de dados, reduz load inicial de 13 → 1 e torna o frescor auditável.

---

## 10. Recomendações priorizadas

### Fase 0 — Quick wins (1–3 dias)

| # | Ação | Impacto | Esforço |
|---|---|---|---|
| Q1 | `Cache-Control` + ETag fortes (`public, max-age=300, stale-while-revalidate=86400`) | Mata T5; habilita CDN | Baixo |
| Q2 | Allowlist de setores em `/api/setor/:setor` | Fecha T2 | Baixo |
| Q3 | Store único de setores no frontend (promise compartilhada) | 39 → ~15 requests | Baixo |
| Q4 | Corrigir alertas: polling na criação, cotação atual, 5 min, batch | Fecha T3 e o bug de "não polla" | Baixo/Médio |
| Q5 | Timeout + retry com backoff; servir último snapshot bom | T9 + degradação graciosa | Baixo |
| Q6 | Unificar config Netlify e corrigir caminho de `sector-weights.html` | T8 | Baixo |
| Q7 | Disclaimers (não é recomendação, dados não oficiais, marcas) | L7 | Baixo |
| Q8 | Desligar `autoDeploy` para commits de dados | T4 | Baixo |
| Q9 | Expor frescor na UI (`generatedAt`, `referenceDate`, badge "atrasado") | T6/T11 | Baixo |
| Q10 | Alerta de falha de workflow (issue/e-mail) | T1/T11 | Baixo |

### Fase 1 — Consolidação (1–2 semanas)

- **Snapshot único** gerado em CI com setores + resumo + metadados + hash, servido com URL versionada → load inicial de 1 request e cache imutável.
- **Migrar dados estáticos para JSON gerado** (Dow, Kings, Aristocrats, Nasdaq-100) com `updatedAt` e validação por schema.
- **Schema + validação no CI**, incluindo o guard de yield (`MAX_YIELD_PERCENT = 25.0`) e checagem de frescor (`referenceDate` ≤ 2 dias úteis).
- **Remover código morto** em `api.js` e `express.json()`.
- **Corrigir cron** de mercado para execução diária em dia útil.

### Fase 2 — Arquitetura (2–4 semanas)

- **Contratar FMP** (Starter para validar; Premium se precisar de histórico longo/intraday) **e** negociar a licença de exibição.
- **Migrar ingestão para Netlify Background Function + Blobs**; aposentar commits de dados e o Render.
- **Function HTTP com cache CDN** como única porta de leitura.
- **Substituir o proxy `/api/historico`** por chamadas cacheadas ou histórico pré-materializado no snapshot.
- **Observabilidade:** logs estruturados, alarme de frescor > 24 h, métrica de erro por endpoint.

### O que não fazer

- Trocar Yahoo por outro scraping gratuito (Alpha Vantage free, Stooq): resolve o sintoma, não o risco legal.
- Colocar Redis/banco relacional para 200 KB de JSON: Blobs/arquivo versionado basta.
- Aumentar o rate limit para "resolver" os alertas: o problema é o padrão de polling.

---

## 11. Conclusão

O projeto é um protótipo bem organizado com ambição de produto: pipeline claro, testes de integridade, separação canônico/espelho e UI consistente. O que o impede de ser produção não é código — é a ausência de uma fonte licenciada, de cache HTTP e de observabilidade.

Sequência de melhor retorno:

1. **Q1 + Q2 + Q3 + Q4** — uma tarde de trabalho resolve cache, segurança, duplicação e alertas.
2. **Fase 1** — transforma o carregamento em 1 request e torna o frescor auditável.
3. **Fase 2** — única etapa que resolve o risco jurídico e o acoplamento Yahoo/Git.

Enquanto a Fase 2 não acontece, o sistema continua funcionando a US$ 0/mês — mas com uma data de validade que ninguém controla.

---

*Auditoria somente-leitura. Nenhum arquivo do repositório foi modificado durante a investigação; `git status` permaneceu com apenas o `frontend/dashboard/agent.md` não rastreado pré-existente. O clone local está atrás do remoto (dados ao vivo mais recentes que o HEAD).*
