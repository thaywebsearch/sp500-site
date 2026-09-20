#!/usr/bin/env python3
"""
Gera o "Resumo do Dia" do S&P 500: maiores altas/baixas e desempenho por setor.

Fluxo:
  1. Lê os JSONs canônicos de cada setor (fonte única em frontend/<setor>/)
  2. Busca os últimos candles diários de cada ticker via Yahoo Finance
     (endpoint /v8/finance/chart — stdlib, sem dependências)
  3. Calcula a variação percentual do último pregão por empresa
  4. Agrega top altas, top baixas e desempenho médio por setor (market mood)
  5. Grava `daily-summary.json` nas cópias derivadas
     (backend/data → API e dashboard/public/data → dashboard)

Execução: python scripts/update_daily_summary.py
"""

import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from urllib.request import Request, urlopen

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

import update_sectors as us  # reutiliza paths, mapas de setores e cópias derivadas

TOP_N = 8
WORKERS = 4
BACKEND_TARGET = us.BACKEND_DATA_DIR
DASHBOARD_TARGET = us.DASHBOARD_DATA_DIR
CHART_URL = (
    "https://query1.finance.yahoo.com/v8/finance/chart/{ticker}?"
    "range=5d&interval=1d"
)


# ============ CARREGANDO SETORES ============

def load_sectors():
    """Carrega os JSONs canônicos de cada setor (fonte única)."""
    sectors = {}
    for sector_name, folder in us.SECTOR_FOLDER_MAP.items():
        path = us.SECTORS_DIR / folder / f"{folder}.json"
        if not path.exists():
            print(f"[WARN] JSON canônico ausente: {path}")
            continue
        try:
            sectors[sector_name] = json.loads(path.read_text(encoding="utf-8"))
        except Exception as exc:
            print(f"[WARN] Não foi possível ler {path}: {exc}")
    return sectors


def collect_companies(sectors):
    """Recolhe {symbol: {name, sector}} de todos os setores."""
    companies = {}
    for sector_name, data in sectors.items():
        for company in data.get("companies", []):
            symbol = company.get("symbol")
            if not symbol:
                continue
            companies[symbol] = {
                "name": company.get("name", symbol),
                "sector": sector_name,
            }
    return companies


# ============ BAIXANDO COTAÇÕES ============

def _fetch_price(symbol, retries=3, base_delay=2):
    """
    Busca os últimos 2 candles diários via Yahoo Finance (/v8/finance/chart).
    A variação do pregão é calculada entre o último e o penúltimo fechamento.
    Backoff exponencial em caso de rate limit.
    """
    ticker = symbol.replace(".", "-")
    url = CHART_URL.format(ticker=ticker)

    for attempt in range(retries + 1):
        try:
            request = Request(url, headers={"User-Agent": "Mozilla/5.0"})
            with urlopen(request, timeout=15) as response:
                payload = json.load(response)

            result = payload["chart"]["result"][0]
            timestamps = result.get("timestamp") or []
            closes = result["indicators"]["quote"][0].get("close") or []
            valid = [
                (ts, close)
                for ts, close in zip(timestamps, closes)
                if close is not None
            ]
            if len(valid) < 2:
                raise ValueError("histórico insuficiente")

            ts_prev, close_prev = valid[-2]
            ts_last, close_last = valid[-1]
            change = (
                round((close_last - close_prev) / close_prev * 100, 2)
                if close_prev
                else None
            )

            return {
                "symbol": symbol,
                "ok": True,
                "lastPrice": round(close_last, 2),
                "changePct": change,
                "quoteTime": ts_last,
                "error": None,
            }
        except Exception as exc:
            if attempt < retries:
                time.sleep(base_delay * (2 ** attempt))
                continue
            return {
                "symbol": symbol,
                "ok": False,
                "lastPrice": None,
                "changePct": None,
                "quoteTime": None,
                "error": str(exc),
            }


def fetch_all_prices(symbols):
    quotes = {}
    total = len(symbols)

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(_fetch_price, symbol): symbol for symbol in symbols}
        done = 0
        for future in as_completed(futures):
            result = future.result()
            quotes[result["symbol"]] = result
            done += 1
            status = "OK" if result["ok"] else f"ERRO ({result.get('error')})"
            print(
                f"\r  [INFO] {result['symbol']}: {status} ({done}/{total})",
                end="",
                flush=True,
            )
    print()

    ok = sum(1 for q in quotes.values() if q["ok"])
    print(f"  [INFO] Cotações obtidas: {ok}/{total}")
    return quotes


# ============ AGREGAÇÃO ============

def build_summary(companies, quotes):
    """Calcula altas, baixas e desempenho por setor a partir das cotações."""
    movers = []
    sector_groups = {}

    for symbol, meta in companies.items():
        quote = quotes.get(symbol)
        if not quote or not quote["ok"] or quote["changePct"] is None:
            continue

        movers.append({
            "symbol": symbol,
            "name": meta["name"],
            "sector": meta["sector"],
            "lastPrice": quote["lastPrice"],
            "changePct": quote["changePct"],
        })

        sector_groups.setdefault(meta["sector"], []).append(quote["changePct"])

    movers.sort(key=lambda m: m["changePct"], reverse=True)
    gainers = [m for m in movers if m["changePct"] > 0]
    losers = [m for m in movers if m["changePct"] < 0]
    neutral = len(movers) - len(gainers) - len(losers)

    if gainers or losers:
        ratio = len(gainers) / (len(gainers) + len(losers))
        market_mood = "bullish" if ratio >= 0.55 else ("bearish" if ratio <= 0.45 else "neutral")
    else:
        market_mood = "neutral"

    sector_performance = sorted(
        (
            {
                "name": sector,
                "avgChangePct": round(sum(changes) / len(changes), 2),
                "gainers": sum(1 for c in changes if c > 0),
                "losers": sum(1 for c in changes if c < 0),
                "total": len(changes),
            }
            for sector, changes in sector_groups.items()
        ),
        key=lambda s: s["avgChangePct"],
        reverse=True,
    )

    return {
        "topGainers": gainers[:TOP_N],
        "topLosers": losers[:TOP_N],
        "sectorPerformance": sector_performance,
        "marketMood": market_mood,
        "stats": {
            "gainers": len(gainers),
            "losers": len(losers),
            "neutral": neutral,
            "total": len(movers),
        },
    }


def latest_quote_time(quotes):
    """Último horário de cotação reportado pelos tickers (epoch, UTC)."""
    times = [q["quoteTime"] for q in quotes.values() if q["ok"] and q["quoteTime"]]
    return max(times) if times else None


# ============ GRAVAÇÃO ============

def write_summary(summary, quote_time):
    now = datetime.now(timezone.utc)
    payload = {
        "generatedAt": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "referenceDate": (
            datetime.fromtimestamp(quote_time, tz=timezone.utc).strftime("%Y-%m-%d")
            if quote_time
            else now.strftime("%Y-%m-%d")
        ),
        **summary,
    }

    content = json.dumps(payload, ensure_ascii=False, indent=2) + "\n"

    for target in (BACKEND_TARGET, DASHBOARD_TARGET):
        target.mkdir(parents=True, exist_ok=True)
        out = target / "daily-summary.json"
        out.write_text(content, encoding="utf-8")
        print(f"[OK] {out}")

    return payload


# ============ CLI ============

def main():
    print(f"\n[{datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}] "
          "Gerando Resumo do Dia S&P 500...")

    sectors = load_sectors()
    if not sectors:
        print("[ERROR] Nenhum JSON de setor encontrado.")
        return 1

    companies = collect_companies(sectors)
    symbols = sorted(companies)
    print(f"[INFO] {len(symbols)} empresas encontradas.")

    quotes = fetch_all_prices(symbols)
    if not quotes:
        print("[ERROR] Nenhuma cotação obtida.")
        return 1

    summary = build_summary(companies, quotes)
    payload = write_summary(summary, latest_quote_time(quotes))

    print(f"\n[INFO] Pregão: {payload['referenceDate']}")
    print(f"[INFO] Mood: {payload['marketMood']} | {payload['stats']}")
    print(f"[INFO] Top alta: {payload['topGainers'][0]['symbol'] if payload['topGainers'] else '—'}")
    print(f"[INFO] Top baixa: {payload['topLosers'][0]['symbol'] if payload['topLosers'] else '—'}")
    print("[INFO] Resumo do Dia gerado com sucesso!")
    return 0


if __name__ == "__main__":
    sys.exit(main())