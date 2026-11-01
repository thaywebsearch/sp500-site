# OpenCode Instructions — S&P 500 Dashboard (Vite + JS/HTML)

Estás a atuar como assistente de IA sénior no desenvolvimento da aplicação web
**S&P 500 Dashboard**. O frontend principal é publicado em **GitHub Pages**
(`https://thaywebsearch.github.io/sp500-site/frontend/docs/`) a partir do build
em `frontend/docs/`; a Netlify (`https://sp500-dashboard.netlify.app`) é um alvo
secundário com os deploys de produção suspensos por limite de crédito da conta.

## 1. Stack Tecnológico & Arquitetura

- **Build Tool / Bundler:** **Vite 5** (`vite.config.js`: `base: './'`, `outDir: '../docs'`).
- **Linguagem:** JavaScript moderno (ES6+, módulos ES) e HTML5, sem framework de UI.
- **Estilização:** CSS modular em `src/styles/globals.css` e `src/styles/dashboard.css`.
  **Não** há Tailwind, CDN de CSS nem build de estilos.
- **API:** Express em `https://sp500-api.onrender.com`, centralizada em `src/config.js`
  (`API_BASE_URL`, repontável com a variável `VITE_API_URL`; `localhost:5001` em dev).
- **Dados estáticos:** `src/data/*.json` com envelope
  `{ schemaVersion, updatedAt, source, items }`, validado por
  `scripts/validate-static-data.mjs`.
- **Estrutura:** um módulo por aba/funcionalidade em `src/`, com teste Vitest ao lado.

## 2. Diretrizes de Desenvolvimento de Novas Abas / Módulos

- **Modularidade:** cria cada nova aba ou secção num ficheiro isolado em `src/`,
  registada em `src/main.js`; evita concentrar lógica no ficheiro principal.
- **UI/UX fintech:** mantém a consistência visual (dark mode em tons slate,
  números com `font-variant-numeric: tabular-nums`, cartões de KPI e gráficos limpos).
- **Dados de mercado:** usa `src/sector-store.js` (`getSnapshot`, `getSectorData`,
  `getResumoDia`). O arranque faz **1 pedido** a `/api/snapshot`, com TTL de 15 min
  e deduplicação de pedidos em curso — não introduzas `fetch` direto às rotas por
  setor sem necessidade.
- **Assincronismo:** trata sempre erros e estados de carregamento; o `fetch` já tem
  timeout explícito em `src/api.js`.

## 3. Segurança e Integridade

- **Não quebrar o existente:** ao adicionar abas ou funcionalidades, **nunca**
  alteres a lógica, rotas ou comportamento das abas anteriores sem autorização
  explícita.
- **Compatibilidade com o build:** todos os imports/asset paths devem ser relativos,
  para que `vite build` continue a funcionar sob o subcaminho do GitHub Pages.
- **`frontend/docs/` é gerado:** é reconstruído pelo workflow `deploy-dashboard.yml`.
  Não edites esses ficheiros à mão.
- **CORS:** a API é restritiva; as origens autorizadas vêm de `CORS_ORIGINS`
  (`https://thaywebsearch.github.io`, `https://sp500-dashboard.netlify.app`).
- **Leveza:** evita dependências ou bibliotecas pesadas desnecessárias.

## 4. Qualidade

```bash
npm run lint            # ESLint
npm run format:check    # Prettier
npm test                # Vitest (o pretest valida os dados estáticos)
npm run validate:data   # schema dos src/data/*.json
npm run build           # escreve em ../docs
```

## 5. Formato de Resposta

- Sê direto e claro; entrega blocos de código prontos a usar, indicando sempre o
  ficheiro que deve ser criado ou atualizado.
