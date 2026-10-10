# S&P 500 — Plataforma de Dados e Dashboard

Plataforma para explorar o índice **S&P 500** por setor GICS: datasets atualizados automaticamente, dashboard estático interativo e API REST.

## Componentes

| Componente | Stack | Descrição |
|------------|-------|-----------|
| `frontend/` | Python + Vite | Datasets por setor (`<setor>/<setor>.json` — fonte única) + dashboard interativo |
| `frontend/dashboard/` | Vite + Vanilla JS | Dashboard com tabela, treemap, heatmap e bubble chart |
| `backend/` | Express | API REST (`/api/setores`, `/api/setor/:setor`, `/api/resumo-dia`) + datasets |
| `backend/dowjones/` | — | Dataset do Dow Jones (30 empresas) |
| `backend/dividend-aristocrats/` | — | 69 Aristocratas de Dividendos |
| `backend/dividend-kings/` | — | Kings de Dividendos (50+ anos) |

## Deploy

- **Dashboard estático** → GitHub Pages (`/docs`) e Netlify
- **API Express** → Railway (`https://sp500-site-production.up.railway.app`)

## Arquitetura de Dados (fonte única)

O pipeline centraliza o dataset em `frontend/<setor>/<setor>.json`:

```
CSV (GitHub datasets)
        │  frontend/scripts/update_sectors.py  (semanal via GitHub Actions)
        ▼
frontend/<setor>/<setor>.json   ← fonte única (canônica)
        │  sync automático no mesmo script
        └──▶ backend/data/              (API Railway)
```

A cópia `backend/data/` é regerada antes do boot da API (`npm start` → hook
`prestart` → `backend/scripts/sync-data.mjs`) a partir da fonte canônica quando
ela está disponível, evitando divergência entre as cópias.

O README de cada setor e o consolidado `TOP50-MARKET-CAP.md` são gerados pelo mesmo pipeline, preservando o enriquecimento (marketCap, dividendYield) existente.

## Dashboard (`frontend/dashboard`)

SPA em JavaScript puro (Vite) que consome a API. Abas:

| Aba | Descrição |
|-----|-----------|
| 📋 Dashboard | Tabela paginada com filtros (setor, país, busca, dividend yield mín.), ordenação, seleção múltipla, estatísticas e exportação CSV/JSON |
| 🌟 Curiosidade do Dia | Curiosidade rotativa diária de uma empresa do índice |
| 🎯 Ação do Dia | Análise heurística de uma ação (com alternativas e disclaimer), determinística por data |
| 🗺️ Mapa de Setores | Visão por setor com market cap relativo, nº de empresas e dividendos |
| 🔥 Heatmap | Top 4 empresas por market cap em cada setor |
| 🫧 Bubble Chart | Dispersão market cap × dividend yield, com tooltip e legenda |
| 💰 Dividendos | Painel de renda: resumo, top por yield, distribuição por faixa e yield médio por setor |

Funcionalidades transversais:

- **Menu de navegação**: botão ☰ no cabeçalho abre/fecha as abas; fecha com `Esc` ou clique fora.
- **Frescura dos dados**: badge no cabeçalho com a data mais recente (`generatedAt`) e classificação por idade.
- **Alertas de preço**: por ação (acima/abaixo de um alvo), verificados a cada 60 s via `/api/historico/:symbol` e notificados quando atingidos; persistidos em `localStorage`.
- **Cache por aba**: Curiosidade, Mapa de Setores e Heatmap só carregam uma vez por sessão.
- **Exportação**: tabela filtrada em CSV ou JSON.

## Pipelines (GitHub Actions)

As workflows ficam em `.github/workflows/` (raiz do repositório):

| Workflow | Horário | Ação |
|----------|---------|------|
| `update-sectors.yml` | Segunda 06:00 | Regenera JSONs/READMEs dos setores + sincroniza cópias |
| `update-sp500-table.yml` | Segunda 00:00 | Atualiza `backend/sp500-table/sp500-table.csv` |
| `deploy-dashboard.yml` | Após push + Segunda 07:00 | Builda o dashboard em `frontend/docs/` |

## API (Railway)

```
GET /api/health             → status + versão
GET /api/setores            → lista dos 11 setores
GET /api/setor/:setor       → empresas do setor
GET /api/curiosidades       → curiosidade do dia
GET /api/historico/:symbol  → histórico de preços (últimos 2 anos)
GET /api/resumo-dia         → maiores altas e baixas do dia
```

A rota raiz `/` documenta os endpoints. A versão é lida de `backend/VERSION`
e exposta em `/` e em `/api/health`. Para restringir o CORS, defina
`CORS_ORIGINS` (ver `backend/README.md`).

## Desenvolvimento Local

```bash
# Dashboard estático
cd frontend/dashboard
npm install
npm run dev            # http://localhost:5173

# API Express
cd backend
node server.js         # http://localhost:5001

# Atualizar dataset manualmente
cd frontend
python scripts/update_sectors.py
```

## Testes e Qualidade

- **Dashboard**: ESLint + Prettier + Vitest — `npm run lint`, `npm run format`, `npm test`, `npm run test:coverage`, `npm run build`
- **Python**: sem framework de testes configurado ainda

## Licença

Dados públicos do S&P 500. Consulte a [fonte original](https://github.com/datasets/s-and-p-500-companies) para detalhes de licenciamento.