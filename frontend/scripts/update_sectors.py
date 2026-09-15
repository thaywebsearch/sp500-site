#!/usr/bin/env python3
"""
Atualiza automaticamente o dataset S&P 500 por setores GICS.

Pipeline único:
  1. Baixa os constituintes do S&P 500 (fonte pública do GitHub)
  2. Gera o JSON canônico de cada setor (preservando o enriquecimento existente)
  3. Gera os READMEs de cada setor (ordenados por Market Cap)
  4. Gera o consolidado TOP50-MARKET-CAP.md
  5. Sincroniza cópias derivadas (backend/data e dashboard/public/data)

Execução: python scripts/update_sectors.py
"""

import csv
import json
import shutil
import sys
from datetime import datetime
from pathlib import Path
from urllib.request import urlopen

SOURCE_URL = "https://raw.githubusercontent.com/datasets/s-and-p-500-companies/main/data/constituents.csv"
ROOT_DIR = Path(__file__).resolve().parent.parent
SECTORS_DIR = ROOT_DIR
BACKEND_DATA_DIR = ROOT_DIR.parent / "backend" / "data"
DASHBOARD_DATA_DIR = ROOT_DIR / "dashboard" / "public" / "data"
GENERATED_AT = datetime.now().strftime("%Y-%m-%d")

SECTOR_ORDER = [
    "Communication Services",
    "Consumer Discretionary",
    "Consumer Staples",
    "Energy",
    "Financials",
    "Health Care",
    "Industrials",
    "Information Technology",
    "Materials",
    "Real Estate",
    "Utilities",
]

SECTOR_FOLDER_MAP = {
    "Communication Services": "communication-services",
    "Consumer Discretionary": "consumer-discretionary",
    "Consumer Staples": "consumer-staples",
    "Energy": "energy",
    "Financials": "financials",
    "Health Care": "health-care",
    "Industrials": "industrials",
    "Information Technology": "information-technology",
    "Materials": "materials",
    "Real Estate": "real-estate",
    "Utilities": "utilities",
}

ENRICHMENT_FIELDS = ("marketCap", "marketCapClassification", "dividendYield", "hasDividend")


def fetch_csv():
    print(f"[INFO] Baixando dados de {SOURCE_URL}...")
    with urlopen(SOURCE_URL) as response:
        content = response.read().decode("utf-8")
    return content


def load_existing_enrichment():
    """Carrega campos enriquecidos (marketCap, dividendYield) dos JSONs atuais
    para preservá-los quando o CSV bruto não os contém."""
    enrichment = {}
    for folder in SECTOR_FOLDER_MAP.values():
        json_path = SECTORS_DIR / folder / f"{folder}.json"
        if not json_path.exists():
            continue
        try:
            data = json.loads(json_path.read_text(encoding="utf-8"))
        except Exception:
            continue
        for company in data.get("companies", []):
            symbol = company.get("symbol")
            if symbol and any(company.get(f) is not None for f in ENRICHMENT_FIELDS):
                enrichment[symbol] = {f: company.get(f) for f in ENRICHMENT_FIELDS}
    return enrichment


def parse_csv(content, enrichment):
    reader = csv.DictReader(content.splitlines())
    companies = []
    for row in reader:
        company = {
            "symbol": row["Symbol"],
            "name": row["Security"],
            "sector": row["GICS Sector"],
            "subIndustry": row["GICS Sub-Industry"],
            "headquarters": row["Headquarters Location"],
            "dateAdded": row["Date added"],
            "cik": int(row["CIK"]) if row["CIK"] else None,
            "founded": row["Founded"] if row["Founded"] else None,
        }
        if row["Symbol"] in enrichment:
            company.update(enrichment[row["Symbol"]])
        companies.append(company)
    return companies


def group_by_sector(companies):
    sectors = {}
    for company in companies:
        sector = company["sector"]
        sectors.setdefault(sector, []).append(company)
    return sectors


def write_json(sector_name, companies):
    folder = SECTOR_FOLDER_MAP[sector_name]
    folder_path = SECTORS_DIR / folder
    folder_path.mkdir(exist_ok=True)

    data = {
        "sector": sector_name,
        "count": len(companies),
        "generatedAt": GENERATED_AT,
        "source": SOURCE_URL,
        "companies": companies,
    }

    json_path = folder_path / f"{folder}.json"
    json_path.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"  [OK] {json_path} ({len(companies)} empresas)")


def format_market_cap(market_cap):
    if market_cap is None:
        return "N/A"
    if market_cap >= 1_000_000_000_000:
        return f"${market_cap / 1_000_000_000_000:.2f}T"
    if market_cap >= 1_000_000_000:
        return f"${market_cap / 1_000_000_000:.2f}B"
    if market_cap >= 1_000_000:
        return f"${market_cap / 1_000_000:.2f}M"
    return f"${market_cap:,.0f}"


def format_dividend(dividend_yield):
    return f"{dividend_yield:.2f}%" if dividend_yield is not None else "—"


def write_readme(sector_name, companies):
    folder = SECTOR_FOLDER_MAP[sector_name]
    folder_path = SECTORS_DIR / folder

    sorted_companies = sorted(
        companies, key=lambda c: c.get("marketCap") or 0, reverse=True
    )

    lines = [
        f"# S&P 500 — Setor {sector_name}",
        "",
        f"> Fonte: `{folder}.json` · Ordenado por Market Cap (maior para menor) · Total: {len(companies)} empresas",
        "",
        "| # | Símbolo | Empresa | Market Cap | Subindústria | Sedes | Dividend Yield |",
        "|---|---------|---------|------------|--------------|-------|----------------|",
    ]

    for idx, company in enumerate(sorted_companies, 1):
        lines.append(
            f"| {idx} | {company['symbol']} | {company['name']} | "
            f"{format_market_cap(company.get('marketCap'))} | {company['subIndustry']} | "
            f"{company['headquarters']} | {format_dividend(company.get('dividendYield'))} |"
        )

    readme_path = folder_path / "README.md"
    readme_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"  [OK] {readme_path}")


def write_top50(sectors):
    all_companies = []
    for sector_name in SECTOR_ORDER:
        for company in sectors.get(sector_name, []):
            company = dict(company)
            company["sector"] = sector_name
            all_companies.append(company)

    top50 = sorted(
        all_companies, key=lambda c: c.get("marketCap") or 0, reverse=True
    )[:50]

    lines = [
        "# S&P 500 — Top 50 por Market Cap (Consolidado)",
        "",
        f"> Gerado em: {GENERATED_AT} · Total de empresas no S&P 500: {len(all_companies)}",
        "",
        "| # | Símbolo | Empresa | Setor | Market Cap | Subindústria | Dividend Yield |",
        "|---|---------|---------|-------|------------|--------------|----------------|",
    ]

    for i, company in enumerate(top50, 1):
        lines.append(
            f"| {i} | {company['symbol']} | {company['name']} | {company['sector']} | "
            f"{format_market_cap(company.get('marketCap'))} | {company['subIndustry']} | "
            f"{format_dividend(company.get('dividendYield'))} |"
        )

    path = SECTORS_DIR / "TOP50-MARKET-CAP.md"
    path.write_text("\n".join(lines), encoding="utf-8")
    print(f"[OK] {path}")


def write_root_readme(sectors):
    lines = [
        "# S&P 500 por Setores GICS",
        "",
        "Repositório de dados limpos e organizados do S&P 500 divididos nos **11 setores GICS** "
        "(Global Industry Classification Standard).",
        "",
        "## Estrutura do Projeto",
        "",
        "```",
        "sp500-by-sector/",
    ]

    for sector in SECTOR_ORDER:
        folder = SECTOR_FOLDER_MAP[sector]
        count = len(sectors.get(sector, []))
        lines.append(f"├── {folder}/     # {sector} ({count} empresas)")

    lines.extend([
        "└── README.md                   # Este arquivo",
        "```",
        "",
        "Cada pasta de setor contém:",
        "- **`dados.json`** — Dados estruturados completos (símbolo, nome, subindústria, sede, CIK, data de adição, ano de fundação)",
        "- **`README.md`** — Tabela formatada renderizável no GitHub",
        "",
        "## Setores GICS",
        "",
        "| Setor | Pasta | Empresas | Descrição |",
        "|-------|-------|----------|-----------|",
    ])

    sector_descriptions = {
        "Communication Services": "Mídia, telecom, entretenimento interativo",
        "Consumer Discretionary": "Varejo, automóveis, lazer, bens duráveis",
        "Consumer Staples": "Alimentos, bebidas, produtos de higiene",
        "Energy": "Petróleo, gás, equipamentos energéticos",
        "Financials": "Bancos, seguros, gestão de ativos",
        "Health Care": "Farmacêuticas, biotecnologia, equipamentos médicos",
        "Industrials": "Aeroespacial, construção, maquinaria, transporte",
        "Information Technology": "Software, hardware, semicondutores, serviços de TI",
        "Materials": "Químicos, construção, embalagens, metais",
        "Real Estate": "REITs, gestão imobiliária, desenvolvimento",
        "Utilities": "Elétricas, gás, água, energias renováveis",
    }

    for sector in SECTOR_ORDER:
        folder = SECTOR_FOLDER_MAP[sector]
        count = len(sectors.get(sector, []))
        desc = sector_descriptions.get(sector, "")
        lines.append(f"| **{sector}** | [`{folder}/`]({folder}/) | {count} | {desc} |")

    lines.extend([
        "",
        "## Fonte dos Dados",
        "",
        f"- **Origem**: [datasets/s-and-p-500-companies]({SOURCE_URL}) no GitHub",
        "- **Classificação**: GICS (Global Industry Classification Standard)",
        f"- **Atualização**: {GENERATED_AT}",
        "",
        "## Uso",
        "",
        "### Carregar dados em Python",
        "",
        "```python",
        "import json",
        "",
        "with open('communication-services/communication-services.json', 'r', encoding='utf-8') as f:",
        "    data = json.load(f)",
        "",
        "print(f\"Setor: {data['sector']}\")",
        "print(f\"Total de empresas: {data['count']}\")",
        "",
        "for company in data['companies']:",
        "    print(f\"{company['symbol']} - {company['name']} ({company['subIndustry']})\")",
        "```",
        "",
        "### Carregar dados em JavaScript/Node.js",
        "",
        "```javascript",
        "const fs = require('fs');",
        "",
        "const data = JSON.parse(fs.readFileSync('communication-services/communication-services.json', 'utf8'));",
        "console.log(`Setor: ${data.sector}`);",
        "console.log(`Total: ${data.count} empresas`);",
        "```",
        "",
        "## Licença",
        "",
        "Dados públicos do S&P 500. Consulte a [fonte original]("
        "https://github.com/datasets/s-and-p-500-companies) para detalhes de licenciamento.",
        "",
        "---",
        "",
        f"*Gerado automaticamente — Última atualização: {GENERATED_AT}*",
    ])

    readme_path = ROOT_DIR / "README.md"
    readme_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"[OK] {readme_path}")


def sync_derived_copies():
    """Copia os JSONs canônicos (fonte única) para as cópias derivadas
    usadas pela API (backend/data) e pelo dashboard (public/data)."""
    targets = [BACKEND_DATA_DIR, DASHBOARD_DATA_DIR]
    copied = 0
    for folder in SECTOR_FOLDER_MAP.values():
        source = SECTORS_DIR / folder / f"{folder}.json"
        if not source.exists():
            continue
        for target_dir in targets:
            target_dir.mkdir(parents=True, exist_ok=True)
            shutil.copy2(source, target_dir / source.name)
            copied += 1
    print(f"[INFO] Cópias sincronizadas: {copied} arquivos")
    return copied


def main():
    print(f"[INFO] Atualizando dataset S&P 500 por setores -- {GENERATED_AT}")
    print("=" * 60)

    try:
        content = fetch_csv()
        enrichment = load_existing_enrichment()
        if enrichment:
            print(f"[INFO] Preservando enriquecimento de {len(enrichment)} empresas")
        companies = parse_csv(content, enrichment)
        print(f"[INFO] Total de empresas: {len(companies)}")

        sectors = group_by_sector(companies)
        print(f"[INFO] Setores encontrados: {len(sectors)}")

        for sector in SECTOR_ORDER:
            if sector in sectors:
                sector_companies = sectors[sector]
                print(f"\n[INFO] Processando: {sector} ({len(sector_companies)} empresas)")
                write_json(sector, sector_companies)
                write_readme(sector, sector_companies)
            else:
                print(f"\n[WARN] Setor não encontrado nos dados: {sector}")

        write_top50(sectors)
        write_root_readme(sectors)
        sync_derived_copies()

        print("\n" + "=" * 60)
        print("[INFO] Atualizacao concluida com sucesso!")
        return 0

    except Exception as e:
        print(f"\n[ERROR] Erro: {e}")
        return 1


if __name__ == "__main__":
    sys.exit(main())