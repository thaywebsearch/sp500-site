#!/usr/bin/env python3
"""
Atualiza em tempo real os dados de mercado (marketCap, dividendYield) dos
JSONs que alimentam o site, reutilizando o pipeline existente.

Fluxo:
  1. Lê os JSONs canônicos de cada setor (fonte única em frontend/<setor>/)
  2. Busca marketCap e dividendYield ao vivo via yfinance (Yahoo Finance),
     com fallback cookie+crumb (yahoo_quotes) quando o yfinance esta bloqueado
  3. Regrava os JSONs canônicos preservando todos os demais campos
  4. Sincroniza a cópia derivada: backend/data (API)

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
import yahoo_quotes  # fallback de cotacoes (cookie + crumb do Yahoo)


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


def _ok(symbol, market_cap, dividend_yield):
    return {
        "symbol": symbol,
        "ok": True,
        "marketCap": market_cap,
        "dividendYield": dividend_yield,
        "error": None,
    }


def _fail(symbol, error):
    return {
        "symbol": symbol,
        "ok": False,
        "marketCap": None,
        "dividendYield": None,
        "error": error,
    }


# O Yahoo expõe o dividendYield em unidades diferentes conforme o endpoint: o
# quoteSummary usado pelo fallback devolve uma fração decimal (0.015 = 1.5%),
# enquanto o endpoint consumido pelo yfinance (>= 0.2.55) devolve já a
# percentagem (2.11 = 2.11%). Cada fonte faz a sua própria conversão para
# percentagem na origem, para o dataset ficar sempre na mesma unidade.
MAX_DIVIDEND_YIELD_PERCENT = 100.0


def _normalize_dividend_yield(value):
    """Normaliza o dividendYield do yfinance para percentagem.

    O yfinance (>= 0.2.55) devolve ``info['dividendYield']`` já em percentagem
    (2.11 -> 2.11%), pelo que NÃO deve ser multiplicado por 100. Valores fora
    do intervalo plausível (0, 100%] são descartados para não propagar dados
    corrompidos (ex.: um ×100 acidental) para os JSONs.
    """
    if isinstance(value, (int, float)) and not _is_nan(value):
        value = float(value)
        if 0 < value <= MAX_DIVIDEND_YIELD_PERCENT:
            return round(value, 2)
    return None


def _dividend_yield_from_info(info):
    """dividendYield (em %) a partir do ``info`` do yfinance, com fallback.

    ``info['dividendYield']`` pode vir ausente/zero mesmo para pagadores
    (ex.: SWKS), pelo que se usa ``trailingAnnualDividendYield`` como segunda
    fonte. Nota de unidades: ``dividendYield`` ja vem em percentagem, mas
    ``trailingAnnualDividendYield`` vem como fracao decimal (0.0359 = 3.59%),
    logo e a unica conversao x100 deste caminho.
    """
    value = _normalize_dividend_yield(info.get("dividendYield"))
    if value is not None:
        return value

    trailing = info.get("trailingAnnualDividendYield")
    if (
        isinstance(trailing, (int, float))
        and not _is_nan(trailing)
        and 0 < trailing <= 1
    ):
        return _normalize_dividend_yield(trailing * 100)
    return None


def _quote_from_yfinance(symbol):
    """marketCap/dividendYield via yfinance (uma requisicao por ticker)."""
    info = yf.Ticker(symbol).info

    cap = info.get("marketCap")
    if cap is None:  # marketCap nem sempre vem no info -> fallback leve
        cap = _safe_fast_info(symbol, "market_cap")

    return cap, _dividend_yield_from_info(info)


# O yfinance pode estar bloqueado por rate limit (HTTP 429). Faz-se uma unica
# sondagem no inicio da execucao para nao multiplicar o backoff por 500+ tickers.
_yfinance_enabled = True


def _probe_yfinance():
    """Testa se o yfinance esta operacional antes de processar todos os tickers."""
    try:
        yf.Ticker("AAPL").info.get("marketCap")
        return True
    except Exception:
        return False


def fetch_quote(symbol, retries=3, base_delay=2):
    """
    Busca marketCap e dividendYield atuais de um ticker.

    Tenta primeiro o yfinance (uma requisicao por ticker). Se estiver
    indisponivel, usa o fallback `yahoo_quotes` (cookie + crumb do Yahoo), que
    contorna o rate limit HTTP 429. Em ambos os casos o dividendYield devolvido
    esta em percentagem (2.11 -> 2.11%); empresas sem dividendo devolvem None.
    """
    if _yfinance_enabled:
        for attempt in range(retries + 1):
            try:
                cap, div_yield = _quote_from_yfinance(symbol)
                if cap is not None:
                    return _ok(symbol, cap, div_yield)
                break  # sem marketCap -> tenta o fallback
            except Exception:  # noqa: BLE001
                if attempt < retries:
                    time.sleep(base_delay * (2 ** attempt))  # backoff exponencial
                    continue
                break

    try:
        cap, div_yield = yahoo_quotes.fetch_market_data(symbol)
    except Exception as exc:  # noqa: BLE001
        return _fail(symbol, str(exc))

    if cap is None:
        return _fail(symbol, "sem marketCap (yfinance e fallback)")

    return _ok(symbol, cap, div_yield)


def _safe_fast_info(symbol, attr, default=None):
    """Fallback pontual para o fast_info (só quando o info não trouxer o dado)."""
    try:
        value = getattr(yf.Ticker(symbol).fast_info, attr)
        return default if value in (None, "") else value
    except Exception:
        return default


def fetch_all_quotes(symbols, workers):
    """Busca as cotações de todos os símbolos em paralelo."""
    global _yfinance_enabled

    _yfinance_enabled = _probe_yfinance()
    if _yfinance_enabled:
        print("[INFO] Fonte primaria: yfinance")
    else:
        print(
            "[WARN] yfinance indisponivel (rate limit) - a usar fallback Yahoo (cookie+crumb)"
        )

    quotes = {}
    total = len(symbols)

    with ThreadPoolExecutor(max_workers=workers) as pool:
        futures = {pool.submit(fetch_quote, symbol): symbol for symbol in symbols}
        done = 0
        for future in as_completed(futures):
            result = future.result()
            quotes[result["symbol"]] = result
            done += 1
            status = "OK" if result["ok"] else f"ERRO ({result['error']})"
            print(
                f"\r  [INFO] {result['symbol']}: {status} ({done}/{total})",
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

        # A chave dividendYield tem de existir sempre (o esquema representa
        # "sem dividendo" como null) e hasDividend tem de estar em sincronia.
        #
        # ``div_yield is None`` significa tanto "nao paga dividendo" como
        # "dado indisponivel" (yfinance em rate limit / fallback sem o campo).
        # Para nao perder o dividendo de pagadores conhecidos (ex.: SWKS), so se
        # marca "Não" quando a empresa nunca teve um yield conhecido; caso
        # contrario preserva-se o valor anterior.
        if div_yield is not None:
            company["dividendYield"] = div_yield
            company["hasDividend"] = "Sim"
        elif company.get("dividendYield") is None:
            company["dividendYield"] = None
            company["hasDividend"] = "Não"
        else:
            # Ja havia yield conhecido -> mantem (indisponibilidade temporaria)
            # e garante o par coerente.
            company["hasDividend"] = "Sim"

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