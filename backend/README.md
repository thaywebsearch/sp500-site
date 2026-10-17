# Backend — API S&P 500

API REST (**Express**) que serve os dados do S&P 500 por setor e o resumo do dia.
Os dados ficam em `data/*.json` e são regerados a partir da fonte canônica
(`frontend/<setor>/<setor>.json`) no boot, via `scripts/sync-data.mjs`
(hook `prestart`).

## Endpoints

```
GET /api/health             → status + versão
GET /api/setores            → lista dos 11 setores
GET /api/setor/:setor       → empresas do setor
GET /api/curiosidades       → curiosidade do dia
GET /api/historico/:symbol  → histórico de preços (últimos 2 anos)
GET /api/resumo-dia         → maiores altas e baixas do dia
```

A rota raiz `/` documenta os endpoints. A versão é lida do ficheiro `VERSION`
e exposta em `/` e em `/api/health`.

Os JSONs de `data/` são lidos uma única vez e mantidos em cache de memória; a
cache é invalidada automaticamente por `mtime`/tamanho, pelo que alterações aos
ficheiros (ou ao diretório) são refletidas sem reiniciar o servidor.

## CORS

Por defeito o CORS é **restritivo**: sem `CORS_ORIGINS` definido, nenhuma
origem externa é aceite (o arranque regista um aviso). Para autorizar o
dashboard, defina `CORS_ORIGINS` com as origens permitidas separadas por
vírgula (ex.: `CORS_ORIGINS=https://thaywebsearch.github.io`). Apenas
`GET`/`HEAD` são anunciados no preflight e pedidos sem `Origin` (curl, health
checks, same-origin) continuam aceites.

> Nota: o CORS é verificado pelo browser, não pela API. Se a origem não estiver
> em `CORS_ORIGINS`, o dashboard em GitHub Pages é bloqueado no cliente.

## Deploy

O repositório não tem `package.json` na raiz, pelo que qualquer serviço de
hospedagem tem de usar **`backend` como diretório raiz**.

### Render (plano gratuito) — recomendado

O Render lê o Blueprint `render.yaml` na raiz do repositório.

Checklist:

1. Render Dashboard → **New → Blueprint** → ligar a
   `thaywebsearch/sp500-site`, branch `main`.
2. Confirmar o serviço `sp500-api` (Root Directory `backend`,
   `npm ci` → `npm start`, health check em `/api/health`).
3. Quando pedido, definir `CORS_ORIGINS` com a origem do frontend
   (ex.: `https://thaywebsearch.github.io,https://<site>.netlify.app`).
   **Obrigatório** — por omissão o CORS é restritivo.
4. Confirmar `GET https://<servico>.onrender.com/api/health` → `200`.

> No plano gratuito o serviço **dorme após 15 minutos sem tráfego** e leva
> cerca de 1 minuto a acordar no pedido seguinte.

### Railway (legado / rollback)

Alternativa mantida. Requer **Root Directory = `backend`**; o Railway lê
`railway.toml` (Nixpacks → `npm start`, `healthcheckPath` em `/api/health`).
Criar/reabrir o serviço, confirmar Root Directory, domínio e `CORS_ORIGINS`, e
validar `GET https://<dominio>/api/health` → `200`.

### Repontar o frontend (sem alterar código)

- **Dashboard** (`index.html`): definir `VITE_API_URL` (variável de repositório
  em Settings → Secrets and variables → Actions → Variables, ou variável de
  ambiente no painel da Netlify se for esse o alojamento) e reconstruir.
- **`sector.html`** (estático): acrescentar `?api=<url>` ao abrir a página.

## Executar localmente

```bash
cd backend
npm install
npm start              # http://localhost:5001
```

## Estrutura

- `server.js` — servidor Express
- `data/` — JSONs por setor (cópia derivada, sincronizada no boot)
- `scripts/sync-data.mjs` — sincroniza a fonte canônica para `data/`
- `VERSION` — versão da API
- `sp500-table/` — dataset CSV do S&P 500 (atualizado semanalmente via GitHub Actions)
- `dowjones/`, `dividend-aristocrats/`, `dividend-kings/` — datasets auxiliares
