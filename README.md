# S&P 500 — Plataforma de Dados e Dashboard

Plataforma para explorar o índice **S&P 500** por setor GICS: datasets atualizados automaticamente, dashboard estático interativo e API REST.

## Componentes

| Componente | Stack | Descrição |
|------------|-------|-----------|
| `frontend/` | Python + Vite | Datasets por setor (`<setor>/<setor>.json` — fonte única) + dashboard interativo |
| `frontend/dashboard/` | Vite + Vanilla JS | Dashboard com tabela, treemap, heatmap e bubble chart |
| `backend/` | Express + Streamlit | API REST (`/api/setores`, `/api/setor/:setor`) + apps de busca em tempo real |
| `backend/dowjones/` | Streamlit | Dashboard do Dow Jones (30 empresas) |
| `backend/dividend-aristocrats/` | — | 69 Aristocratas de Dividendos |
| `backend/dividend-kings/` | — | Kings de Dividendos (50+ anos) |

## Deploy

- **Dashboard estático** → GitHub Pages (`/docs`) e Netlify
- **API Express** → Railway (`https://sp500-site-production.up.railway.app`)
- **Apps Streamlit** → Streamlit Cloud

## Arquitetura de Dados (fonte única)

O pipeline centraliza o dataset em `frontend/<setor>/<setor>.json`:

```
CSV (GitHub datasets)
        │  frontend/scripts/update_sectors.py  (semanal via GitHub Actions)
        ▼
frontend/<setor>/<setor>.json   ← fonte única (canônica)
        │  sync automático no mesmo script
        ├──▶ backend/data/              (API Railway)
        └──▶ frontend/dashboard/public/data/  (dashboard)
```

O README de cada setor e o consolidado `TOP50-MARKET-CAP.md` são gerados pelo mesmo pipeline, preservando o enriquecimento (marketCap, dividendYield) existente.

## Pipelines (GitHub Actions)

As workflows ficam em `.github/workflows/` (raiz do repositório):

| Workflow | Horário | Ação |
|----------|---------|------|
| `update-sectors.yml` | Segunda 06:00 | Regenera JSONs/READMEs dos setores + sincroniza cópias |
| `update-sp500-table.yml` | Segunda 00:00 | Atualiza `backend/sp500-table/sp500-table.csv` |
| `deploy-dashboard.yml` | Após push + Segunda 07:00 | Builda o dashboard em `frontend/docs/` |

## API (Railway)

```
GET /api/health        → status
GET /api/setores       → lista dos 11 setores
GET /api/setor/:setor  → empresas do setor
```

Rota raiz `/` documenta os endpoints.

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

- **Dashboard**: ESLint + Prettier + Vitest (`npm run lint`, `npm run format`, `npm test`)
- **Python**: sem framework de testes configurado ainda

## Licença

Dados públicos do S&P 500. Consulte a [fonte original](https://github.com/datasets/s-and-p-500-companies) para detalhes de licenciamento.