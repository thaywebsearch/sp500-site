#!/usr/bin/env python3
"""
Cliente de cotacoes do Yahoo Finance via cookie + crumb.

Usado como fallback do yfinance quando este e bloqueado por rate limit
(HTTP 429). Devolve marketCap e dividendYield no mesmo formato consumido
pelo update_live_data.py.

Endpoint: query1.finance.yahoo.com/v10/finance/quoteSummary

Execucao avulsa (debug):
  python scripts/yahoo_quotes.py AAPL MSFT BRK.B
"""

import sys
import threading
import time

import requests

BASE_URL = "https://query1.finance.yahoo.com"
MODULES = "price,summaryDetail"
COOKIE_URL = "https://fc.yahoo.com"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
)

# Limite superior plausivel para um dividend yield (nenhuma empresa do S&P 500
# paga perto de 100%). Guarda contra erros de unidade (fracao vs. percentagem).
MAX_DIVIDEND_YIELD_PERCENT = 100.0

# Cada thread tem a sua propria sessao (cookies e crumb isolados).
_local = threading.local()


def _get_session():
    session = getattr(_local, "session", None)
    if session is None:
        session = requests.Session()
        # Nao definir "Accept: application/json" na sessao: /v1/test/getcrumb
        # responde 406 e o crumb resultante da 401. O Accept JSON e definido
        # apenas no pedido ao quoteSummary.
        session.headers.update(
            {"User-Agent": USER_AGENT, "Accept-Language": "en-US,en;q=0.9"}
        )
        _local.session = session
        _local.crumb = None
    return session


def _refresh_crumb(session):
    """Obtem um crumb novo (o Yahoo invalida os antigos periodicamente)."""
    try:
        session.get(COOKIE_URL, timeout=15)
    except requests.RequestException:
        pass  # o cookie A3 tanto e devolvido com 200 como com 404
    resp = session.get(f"{BASE_URL}/v1/test/getcrumb", timeout=15)
    if resp.status_code != 200:
        raise RuntimeError(f"getcrumb HTTP {resp.status_code}")
    crumb = resp.text.strip()
    if not crumb:
        raise RuntimeError("crumb vazio")
    return crumb


def _get_crumb(session):
    crumb = getattr(_local, "crumb", None)
    if not crumb:
        crumb = _refresh_crumb(session)
        _local.crumb = crumb
    return crumb


def _is_positive_number(value):
    return isinstance(value, (int, float)) and value == value and float(value) > 0


def _summary(symbol):
    """Pedido ao quoteSummary, renovando o crumb em caso de 401/403/406."""
    session = _get_session()
    url = f"{BASE_URL}/v10/finance/quoteSummary/{symbol}"
    headers = {"Accept": "application/json"}
    params = {"modules": MODULES, "crumb": _get_crumb(session)}

    resp = session.get(url, params=params, headers=headers, timeout=20)
    if resp.status_code in (401, 403, 406):
        _local.crumb = _refresh_crumb(session)
        params["crumb"] = _local.crumb
        resp = session.get(url, params=params, headers=headers, timeout=20)
    if resp.status_code != 200:
        raise RuntimeError(f"HTTP {resp.status_code}")

    result = resp.json().get("quoteSummary", {}).get("result")
    if not result:
        raise RuntimeError("resposta sem resultado")
    return result[0]


def _parse(result):
    """Extrai (marketCap, dividendYield em %) de uma resposta do quoteSummary."""
    price = result.get("price") or {}
    detail = result.get("summaryDetail") or {}

    market_cap = (price.get("marketCap") or {}).get("raw")

    # O dividendYield "forward" vem 0.0 em alguns pagadores (ex.: SWKS);
    # nesse caso usa-se o trailingAnnualDividendYield. O dataset representa
    # empresas sem dividendo como null/None.
    # Aqui o Yahoo devolve uma fracao decimal (0.0207 = 2.07%), ao contrario do
    # yfinance (>= 0.2.55), que ja devolve percentagem. A conversao para
    # percentagem e feita so nesta origem, uma unica vez.
    forward = (detail.get("dividendYield") or {}).get("raw")
    trailing = (detail.get("trailingAnnualDividendYield") or {}).get("raw")
    dividend_yield = forward if _is_positive_number(forward) else trailing
    if _is_positive_number(dividend_yield):
        dividend_yield = round(float(dividend_yield) * 100, 2)
        if dividend_yield > MAX_DIVIDEND_YIELD_PERCENT:
            dividend_yield = None
    else:
        dividend_yield = None

    return market_cap, dividend_yield


def fetch_market_data(symbol, retries=2, base_delay=1.0):
    """
    Devolve (marketCap, dividendYield) de um ticker.

    dividendYield em percentagem (0.0345 -> 3.45) ou None se a empresa nao
    distribuir dividendo. Levanta RuntimeError se o Yahoo nao responder.
    """
    query = symbol.replace(".", "-")  # o Yahoo usa hifen (BRK.B -> BRK-B)
    last_error = None

    for attempt in range(retries + 1):
        try:
            try:
                result = _summary(query)
            except RuntimeError as exc:
                if "404" in str(exc) and query != symbol:
                    result = _summary(symbol)
                else:
                    raise
            return _parse(result)
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            if attempt < retries:
                time.sleep(base_delay * (2 ** attempt))

    raise RuntimeError(f"fallback Yahoo falhou para {symbol}: {last_error}")


def main(argv):
    symbols = argv or ["AAPL"]
    for symbol in symbols:
        try:
            cap, div = fetch_market_data(symbol)
            print(f"{symbol}: marketCap={cap} dividendYield={div}")
        except Exception as exc:  # noqa: BLE001
            print(f"{symbol}: ERRO {exc}")
    return 0


if __name__ == "__main__":
    if sys.platform == "win32":
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.exit(main(sys.argv[1:]))
