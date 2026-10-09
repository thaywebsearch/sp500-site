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
