#!/usr/bin/env python3
"""
Gera o "Calendário de Dividendos" do S&P 500: próximos pagamentos estimados
por empresa, com cadência, última data ex-dividendo e valor por ação.

Fluxo:
  1. Lê os JSONs canônicos de cada setor (fonte única em frontend/<setor>/)
  2. Busca o histórico de dividendos de cada ticker via Yahoo Finance
     (yfinance `Ticker.dividends` — datas ex-dividendo e valores por ação)
  3. Deriva cadência (mensal/trimestral/semestral/anual), última data ex e
     a próxima data estimada a partir do intervalo médio recente
  4. Ordena os próximos eventos por data futura estimada
  5. Grava `dividend-calendar.json` nas cópias derivadas
     (backend/data → API e dashboard/public/data → dashboard)

Execução: python scripts/update_dividend_calendar.py [--once] [--symbols ...]
"""

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from statistics import median

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

try:
    import yfinance as yf
except ImportError:  # pragma: no cover
    sys.exit("[ERROR] yfinance não instalado. Rode: pip install yfinance")

import update_sectors as us  # reutiliza paths, mapas de setores e cópias derivadas

WORKERS = 8
RETRIES = 3
BASE_DELAY = 2
HORIZON_DAYS = 180          # janela de visualização dos próximos dividendos
DIVIDEND_SERIES_TAIL = 8   # quantos dividendos recentes usar p/ cadência


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


# ============ BAIXANDO DIVIDENDOS ============

def classify_cadence(avg_days):
    """Classifica a cadência a partir do intervalo médio entre dividendos."""
    if avg_days is None:
        return "indefinida"
    if avg_days <= 40:
        return "mensal"
    if avg_days <= 100:
        return "trimestral"
    if avg_days <= 200:
        return "semestral"
    return "anual"


def _fetch_dividends(symbol, retries=RETRIES, base_delay=BASE_DELAY):
    """
    Busca o histórico de dividendos via yfinance (`Ticker.dividends`).
    Retorna a série de datas ex-dividendo e valores por ação. Backoff
    exponencial em caso de rate limit.
    """
    for attempt in range(retries + 1):
        try:
            dividends = yf.Ticker(symbol).dividends
            if dividends is None or len(dividends) == 0:
                return {"ok": True, "hasDividend": False, "error": None}

            return {"ok": True, "hasDividend": True, "error": None,
                    "days": dividends, "count": int(len(dividends))}
        except Exception as exc:
            if attempt < retries:
                time.sleep(base_delay * (2 ** attempt))
                continue
            return {"ok": False, "hasDividend": None, "error": str(exc)}


def derive_dividend_info(dividends):
    """Deriva cadência, última data ex e próxima data de pagamento."""
    # dividends: Series indexada por data (Timestamp ex-dividendo)
    if dividends is None or len(dividends) == 0:
        return {"lastExDate": None, "lastAmount": None, "cadence": "indefinida",
                "nextEstimatedDate": None, "nextEstimatedAmount": None}

    sorted_dates = dividends.index.sort_values()
    tail_dates = sorted_dates[-DIVIDEND_SERIES_TAIL:].tolist()
    tail_values = dividends.loc[tail_dates].tolist() if len(tail_dates) > 1 else []

    last_date = tail_dates[-1].to_pydatetime()
    last_amount = float(tail_values[-1]) if tail_values else None

    # Intervalo médio (dias) entre os últimos pagamentos
    intervals = [
        (tail_dates[i + 1] - tail_dates[i]).days
        for i in range(len(tail_dates) - 1)
        if (tail_dates[i + 1] - tail_dates[i]).days > 0
    ]
    avg_days = median(intervals) if intervals else None
    cadence = classify_cadence(avg_days)

    # Próxima data estimada = última + intervalo médio
    from datetime import timedelta
    next_date = None
    amount = None
    if avg_days is not None and last_date is not None:
        next_date = (last_date + timedelta(days=avg_days)).strftime("%Y-%m-%d")
        amount = last_amount

    return {
        "lastExDate": last_date.strftime("%Y-%m-%d") if last_date else None,
        "lastAmount": last_amount,
        "cadence": cadence,
        "avgIntervalDays": round(avg_days) if avg_days else None,
        "nextEstimatedDate": next_date,
        "nextEstimatedAmount": amount,
    }


def fetch_all_dividends(symbols, companies):
    """Busca os dividendos de todos os símbolos em paralelo."""
    results = {}
    total = len(symbols)

    with ThreadPoolExecutor(max_workers=WORKERS) as pool:
        futures = {pool.submit(_fetch_dividends, symbol): symbol for symbol in symbols}
        done = 0
        for future in as_completed(futures):
            symbol = futures[future]
            result = future.result()
            info = derive_dividend_info(result.get("days"))
            results[symbol] = {
                **companies[symbol],
                **info,
                "hasDividend": result["hasDividend"],
                "ok": result["ok"],
                "error": result.get("error"),
            }
            done += 1
            status = "OK" if result["ok"] else f"ERRO ({result.get('error')})"
            print(
                f"\r  [INFO] {symbol}: {status} ({done}/{total})",
                end="",
                flush=True,
            )
    print()

    ok = sum(1 for r in results.values() if r["ok"])
    print(f"  [INFO] Dividendos obtidos: {ok}/{total}")
    return results


# ============ AGENDA ============

def build_calendar(companies_dividend):
    """Compila os próximos eventos estimados dentro do horizonte."""
    upcoming = []
    for symbol, div in companies_dividend.items():
        if not div["ok"] or not div["hasDividend"]:
            continue
        if not div.get("nextEstimatedDate"):
            continue

        from datetime import date
        try:
            next_date = date.fromisoformat(div["nextEstimatedDate"])
        except ValueError:
            continue

        today = date.today()
        days_ahead = (next_date - today).days
        if days_ahead < 0 or days_ahead > HORIZON_DAYS:
            continue

        upcoming.append({
            "symbol": symbol,
            "name": div["name"],
            "sector": div["sector"],
            "cadence": div["cadence"],
            "lastExDate": div["lastExDate"],
            "lastAmount": div["lastAmount"],
            "nextEstimatedDate": div["nextEstimatedDate"],
            "nextEstimatedAmount": div["nextEstimatedAmount"],
            "daysAhead": days_ahead,
        })

    upcoming.sort(key=lambda e: e["nextEstimatedDate"])

    return {
        "horizonDays": HORIZON_DAYS,
        "count": len(upcoming),
        "events": upcoming,
    }


# ============ GRAVAÇÃO ============

def sync_derived_copies(payload):
    """Grava o JSON nas cópias derivadas (backend/data e dashboard/public/data)."""
    filename = "dividend-calendar.json"
    copied = 0
    for target in (us.BACKEND_DATA_DIR, us.DASHBOARD_DATA_DIR):
        target.mkdir(parents=True, exist_ok=True)
        out = target / filename
        out.write_text(
            json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
        print(f"[OK] {out} ({payload['count']} eventos)")
        copied += 1
    return copied


def main():
    now = datetime.now(timezone.utc)

    sectors = load_sectors()
    if not sectors:
        print("[ERROR] Nenhum JSON de setor encontrado.")
        return 1

    companies = collect_companies(sectors)
    symbols = sorted(companies)
    print(f"[INFO] {len(symbols)} empresas encontradas.")

    dividends = fetch_all_dividends(symbols, companies)

    calendar = build_calendar(dividends)

    payload = {
        "generatedAt": now.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "referenceDate": now.strftime("%Y-%m-%d"),
        **calendar,
    }

    copied = sync_derived_copies(payload)
    print(f"[INFO] Eventos no horizonte de {payload['horizonDays']} dias: {payload['count']}")
    if payload["events"]:
        first = payload["events"][0]
        print(f"[INFO] Próximo dividendo estimado: {first['symbol']} "
              f"({first['nextEstimatedDate']}, R${first['nextEstimatedAmount']})")
    print(f"[INFO] Cópias sincronizadas: {copied}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
