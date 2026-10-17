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

## Deploy (Railway)

O repositório não tem `package.json` na raiz, pelo que o serviço Railway tem de
usar **Root Directory = `backend`**. Com isso o Railway lê `backend/railway.toml`
(Nixpacks → `npm start`, `healthcheckPath` em `/api/health`).

Checklist:

1. Criar/reabrir o serviço no projeto Railway, apontado a
   `thaywebsearch/sp500-site`, branch `main`.
2. **Settings → Root Directory**: `backend`.
3. **Settings → Networking**: gerar/confirmar o domínio público
   (ex.: `sp500-site-production.up.railway.app`). Se o domínio tiver mudado,
   atualize o frontend — sem editar código (ver abaixo).
4. **Variables**: `CORS_ORIGINS=https://thaywebsearch.github.io`
   (**obrigatório** — por omissão o CORS é restritivo e o dashboard seria
   bloqueado).
5. Fazer deploy e confirmar `GET https://<dominio>/api/health` → `200`.

Repontar o frontend para outro domínio de API, sem alterar código:

- **Dashboard** (`index.html`): definir a variável de repositório
  `VITE_API_URL` (Settings → Secrets and variables → Actions → Variables) e
  reexecutar o workflow `deploy-dashboard` (`workflow_dispatch`).
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
