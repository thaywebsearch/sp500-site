# S&P 500 por Setores GICS

Repositório de dados limpos e organizados do S&P 500 divididos nos **11 setores GICS** (Global Industry Classification Standard).

## Estrutura do Projeto

```
sp500-by-sector/
├── communication-services/     # Communication Services (22 empresas)
├── consumer-discretionary/     # Consumer Discretionary (47 empresas)
├── consumer-staples/     # Consumer Staples (34 empresas)
├── energy/     # Energy (21 empresas)
├── financials/     # Financials (76 empresas)
├── health-care/     # Health Care (60 empresas)
├── industrials/     # Industrials (83 empresas)
├── information-technology/     # Information Technology (75 empresas)
├── materials/     # Materials (24 empresas)
├── real-estate/     # Real Estate (30 empresas)
├── utilities/     # Utilities (31 empresas)
└── README.md                   # Este arquivo
```

Cada pasta de setor contém:
- **`dados.json`** — Dados estruturados completos (símbolo, nome, subindústria, sede, CIK, data de adição, ano de fundação)
- **`README.md`** — Tabela formatada renderizável no GitHub

## Setores GICS

| Setor | Pasta | Empresas | Descrição |
|-------|-------|----------|-----------|
| **Communication Services** | [`communication-services/`](communication-services/) | 22 | Mídia, telecom, entretenimento interativo |
| **Consumer Discretionary** | [`consumer-discretionary/`](consumer-discretionary/) | 47 | Varejo, automóveis, lazer, bens duráveis |
| **Consumer Staples** | [`consumer-staples/`](consumer-staples/) | 34 | Alimentos, bebidas, produtos de higiene |
| **Energy** | [`energy/`](energy/) | 21 | Petróleo, gás, equipamentos energéticos |
| **Financials** | [`financials/`](financials/) | 76 | Bancos, seguros, gestão de ativos |
| **Health Care** | [`health-care/`](health-care/) | 60 | Farmacêuticas, biotecnologia, equipamentos médicos |
| **Industrials** | [`industrials/`](industrials/) | 83 | Aeroespacial, construção, maquinaria, transporte |
| **Information Technology** | [`information-technology/`](information-technology/) | 75 | Software, hardware, semicondutores, serviços de TI |
| **Materials** | [`materials/`](materials/) | 24 | Químicos, construção, embalagens, metais |
| **Real Estate** | [`real-estate/`](real-estate/) | 30 | REITs, gestão imobiliária, desenvolvimento |
| **Utilities** | [`utilities/`](utilities/) | 31 | Elétricas, gás, água, energias renováveis |

## Fonte dos Dados

- **Origem**: [datasets/s-and-p-500-companies](https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv) no GitHub
- **Classificação**: GICS (Global Industry Classification Standard)
- **Atualização**: 2026-10-13

## Uso

### Carregar dados em Python

```python
import json

with open('communication-services/communication-services.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

print(f"Setor: {data['sector']}")
print(f"Total de empresas: {data['count']}")

for company in data['companies']:
    print(f"{company['symbol']} - {company['name']} ({company['subIndustry']})")
```

### Carregar dados em JavaScript/Node.js

```javascript
const fs = require('fs');

const data = JSON.parse(fs.readFileSync('communication-services/communication-services.json', 'utf8'));
console.log(`Setor: ${data.sector}`);
console.log(`Total: ${data.count} empresas`);
```

## Testes

Os scripts de dados têm testes em `tests/` — apenas **stdlib** (`unittest`), sem pytest:

```bash
cd frontend
python -m unittest discover -s tests -v
```

- **`tests/test_dividend_yield.py`** — regressão do bug de 2026-10-13 (dividendYield inflado 100×). Fixa o contrato de unidades dos **dois** caminhos de dados: o *yfinance* já devolve percentagem (`update_live_data._normalize_dividend_yield`, sem ×100) e o *fallback* cookie+crumb devolve uma fração (`yahoo_quotes._parse`, com a única multiplicação ×100 e guarda >100%).
- **`tests/test_data_integrity.py`** — integridade dos 22 datasets (11 setores × frontend/backend): esquema de empresa estável, `count` coerente, `dividendYield ∈ (0, 25]%` ou `null`, `hasDividend` em sincronia com o yield, `marketCap` inteiro positivo e espelho `backend/data` idêntico empresa a empresa.

## Licença

Dados públicos do S&P 500. Consulte a [fonte original](https://github.com/datasets/s-and-p-500-companies) para detalhes de licenciamento.

---

*Gerado automaticamente — Última atualização: 2026-10-13*