#!/usr/bin/env python3
"""
Atualiza em tempo real os dados de mercado (marketCap, dividendYield) dos
JSONs que alimentam o site, reutilizando o pipeline existente.

Fluxo:
  1. Lê os JSONs canônicos de cada setor (fonte única em frontend/<setor>/)
  2. Busca marketCap e dividendYield ao vivo via yfinance (Yahoo Finance)
  3. Regrava os JSONs canônicos preservando todos os demais campos
  4. Sincroniza as cópias derivadas: backend/data (API) e dashboard/public/data

Como a API Express lê os arquivos do backend/data a cada requisição, os dados
novos ficam disponíveis no site imediatamente (sem reiniciar o servidor).

Modos de execução:
  Daemon (padrão):
    python scripts/update_live_data.py --interval 300     # a cada 5 min
  Execução única:
    python scripts/update_live_data.py --once
  Testar um subconjunto:
    python scripts/update_live_data.py --once --symbols AAPL,MSFT,CVX

Observação: o Yahoo Finance pode limitar requisições em massa. Para 500+
tickers, recomende intervalos de 5 a 15 minutos (300–900 s).
"""

import argparse
import json
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

try:
    import yfinance as yf
except ImportError:  # pragma: no cover
    sys.exit("[ERROR] yfinance não instalado. Rode: pip install yfinance")

import update_sectors as us  # reutiliza paths, mapas de setores e sync_derived_copies


# ============ CLASSIFICAÇÃO DE MARKET CAP ============

def classify_market_cap(cap):
    """Classifica o market cap seguindo os valores já usados no dataset."""
    if cap is None:
        return "Unknown"
    if cap >= 200_000_000_000:
        return "Mega"
    if cap >= 10_000_000_000:
        return "Large"
    if cap >= 2_000_000_000:
        return "Mid"
    if cap >= 250_000_000:
        return "Small"
    return "Micro"


# ============ LEITURA DOS SETORES ============

def load_sectors():
    """Carrega os JSONs canônicos de cada setor (fonte única)."""
    sectors = {}
    for folder in us.SECTOR_FOLDER_MAP.values():
        path = us.SECTORS_DIR / folder / f"{folder}.json"
        if not path.exists():
            print(f"[WARN] JSON canônico ausente: {path}")
            continue
        try:
            sectors[folder] = {
                "path": path,
                "data": json.loads(path.read_text(encoding="utf-8")),
            }
        except Exception as exc:
            print(f"[WARN] Não foi possível ler {path}: {exc}")
    return sectors


def collect_symbols(sectors, symbol_filter=None):
    """Recolhe os símbolos únicos de todos os setores (ou só os filtrados)."""
    if symbol_filter:
        return sorted(symbol_filter)
    symbols = set()
    for sector in sectors.values():
        for company in sector["data"].get("companies", []):
            if company.get("symbol"):
                symbols.add(company["symbol"])
    return sorted(symbols)


# ============ BAIXANDO DADOS AO VIVO ============

def _is_nan(value):
    return isinstance(value, float) and value != value


def fetch_quote(symbol, retries=3, base_delay=2):
    """
    Busca marketCap e dividendYield atuais de um ticker via yfinance.

    Usa exclusivamente `Ticker.info` (uma única requisição por ticker) para
    minimizar requisições ao Yahoo Finance e contornar rate limits. O marketCap
    vem da própria resposta; o dividendYield é uma fração decimal (0.015 → 1.5%).
    Em caso de rate limit, faz backoff exponencial (2s → 4s → 8s).
    """
    for attempt in range(retries + 1):
        try:
            info = yf.Ticker(symbol).info

            cap = info.get("marketCap")
            if cap is None:  # marketCap nem sempre vem no info → fallback leve
                cap = _safe_fast_info(symbol, "market_cap")

            div_yield = info.get("dividendYield")
            if isinstance(div_yield, (int, float)) and not _is_nan(div_yield):
                div_yield = round(float(div_yield) * 100, 2)
            else:
                div_yield = None

            return {
                "symbol": symbol,
                "ok": True,
                "marketCap": cap,
                "dividendYield": div_yield,
                "error": None,
            }
        except Exception as exc:
            if attempt < retries:
                time.sleep(base_delay * (2 ** attempt))  # backoff exponencial
                continue
            return {
                "symbol": symbol,
                "ok": False,
                "marketCap": None,
                "dividendYield": None,
                "error": str(exc),
            }


def _safe_fast_info(symbol, attr, default=None):
    """Fallback pontual para o fast_info (só quando o info não trouxer o dado)."""
    try:
        value = getattr(yf.Ticker(symbol).fast_info, attr)
        return default if value in (None, "") else value
    except Exception:
        return default


def fetch_all_quotes(symbols, workers):
    """Busca as cotações de todos os símbolos em paralelo."""
    quotes = {}
    total = len(symbols)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(fetch_quote, symbol): symbol for symbol in symbols}
        done = 0
        for future in as_completed(futures):
            result = future.result()
            quotes[result["symbol"]] = result
            done += 1
            print(
                f"\r  [INFO] {result['symbol']}: "
                f"{'OK' if result['ok'] else f'ERRO ({result['error']})'} "
                f"({done}/{total})",
                end="",
                flush=True,
            )
    print()

    ok = sum(1 for q in quotes.values() if q["ok"])
    print(f"  [INFO] Cotações obtidas: {ok}/{total}")
    return quotes


# ============ ATUALIZAÇÃO DOS JSONs ============

def apply_quotes(sector, quotes, now):
    """Aplica as cotações ao JSON de um setor, preservando os demais campos."""
    updated = 0
    for company in sector["data"].get("companies", []):
        symbol = company.get("symbol")
        quote = quotes.get(symbol)
        if not quote or not quote["ok"]:
            continue

        cap = quote["marketCap"]
        div_yield = quote["dividendYield"]

        if cap is not None:
            company["marketCap"] = int(cap)
            company["marketCapClassification"] = classify_market_cap(cap)

        if div_yield is not None:
            company["dividendYield"] = div_yield
            company["hasDividend"] = "Sim"
        elif cap is not None:
            company["hasDividend"] = "Não"

        updated += 1

    sector["data"]["generatedAt"] = now.strftime("%Y-%m-%d")
    sector["data"]["liveUpdatedAt"] = now.astimezone().strftime("%Y-%m-%d %H:%M:%S %z")
    return updated


def write_sector(sector):
    """Regrava o JSON canônico de um setor no disco."""
    payload = json.dumps(sector["data"], ensure_ascii=False, indent=2) + "\n"
    sector["path"].write_text(payload, encoding="utf-8")
    count = len(sector["data"].get("companies", []))
    print(f"  [OK] {sector['path'].name} ({count} empresas)")


def run_once(symbol_filter=None, workers=4):
    """Executa uma rodada completa de atualização. Retorna números de alterados."""
    now = datetime.now()
    print(f"\n[{now.strftime('%Y-%m-%d %H:%M:%S')}] Iniciando atualização ao vivo...")

    sectors = load_sectors()
    if not sectors:
        print("[ERROR] Nenhum JSON de setor encontrado.")
        return False

    symbols = collect_symbols(sectors, symbol_filter)
    print(f"[INFO] Atualizando {len(symbols)} símbolos...")

    quotes = fetch_all_quotes(symbols, workers)

    total_updated = 0
    for folder, sector in sectors.items():
        updated = apply_quotes(sector, quotes, now)
        total_updated += updated
        if updated > 0:
            write_sector(sector)
        else:
            print(f"  [WARN] {sector['path'].name}: nenhuma cotação aplicada")

    synced = us.sync_derived_copies()

    print(f"[INFO] Empresas atualizadas: {total_updated} | Cópias sincronizadas: {synced}")
    return total_updated


# ============ MODO DAEMON ============

def daemon_loop(interval, symbols, workers):
    print(f"[INFO] Modo daemon ativo — atualizando a cada {interval} segundos.")
    print("[INFO] Pressione Ctrl+C para encerrar.")
    while True:
        try:
            run_once(symbol_filter=symbols, workers=workers)
        except Exception as exc:
            print(f"\n[ERROR] Falha na rodada: {exc}")
        try:
            print(f"[INFO] Aguardando {interval}s até a próxima atualização...")
            time.sleep(interval)
        except KeyboardInterrupt:
            print("\n[INFO] Encerrando daemon.")
            break


# ============ CLI ============

def parse_args():
    parser = argparse.ArgumentParser(
        description="Atualiza os dados de mercado do site em tempo real (marketCap, dividendYield)."
    )
    parser.add_argument(
        "--interval",
        type=int,
        default=600,
        help="Intervalo entre atualizações em segundos no modo daemon (padrão: 600).",
    )
    parser.add_argument(
        "--once",
        action="store_true",
        help="Executa uma única atualização e encerra (ideal para cron).",
    )
    parser.add_argument(
        "--symbols",
        type=str,
        default="",
        help="Lista de símbolos separados por vírgula para atualizar (testes).",
    )
    parser.add_argument(
        "--workers",
        type=int,
        default=4,
        help="Número de threads para buscar cotações em paralelo (padrão: 4).",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    symbol_filter = None
    if args.symbols:
        symbol_filter = {s.strip().upper() for s in args.symbols.split(",") if s.strip()}
        print(f"[INFO] Restringindo atualização aos símbolos: {sorted(symbol_filter)}")

    if args.once:
        run_once(symbol_filter=symbol_filter, workers=args.workers)
        return 0

    daemon_loop(args.interval, symbol_filter, args.workers)
    return 0


if __name__ == "__main__":
    sys.exit(main())