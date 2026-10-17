"""Testes de regressao das unidades de ``dividendYield`` (stdlib unittest).

Historico: no commit 873b307 (2026-10-13) o ``dividendYield`` foi inflado 100x
porque o ``yfinance`` (>= 0.2.55) devolve o valor **ja em percentagem**, mas o
codigo voltava a multiplicar por 100. Um yield de 2.11% passava a aparecer
como 211.0.

Contrato de unidades fixado aqui (ambos os caminhos de dados):

* ``update_live_data._normalize_dividend_yield`` -> caminho yfinance
  (valor JA em % -- nao pode ser multiplicado);
* ``yahoo_quotes._parse`` -> caminho fallback cookie+crumb
  (fracao decimal -> %, com a unica multiplicacao ``x100`` correta).

Os dois partilham o mesmo teto plausivel (100%).
"""

import unittest

import helpers

helpers.add_scripts_to_path()

import yahoo_quotes as yq

try:
    import update_live_data as uld

    _ULD_ERROR = None
except (ImportError, SystemExit) as exc:  # yfinance ausente neste ambiente
    uld = None
    _ULD_ERROR = exc


def _quote(market_cap=None, forward=None, trailing=None):
    """Constroi a resposta do quoteSummary consumida por ``yahoo_quotes._parse``."""
    summary = {}
    if forward is not None:
        summary["dividendYield"] = {"raw": forward}
    if trailing is not None:
        summary["trailingAnnualDividendYield"] = {"raw": trailing}
    price = {}
    if market_cap is not None:
        price["marketCap"] = {"raw": market_cap}
    return {"price": price, "summaryDetail": summary}


@unittest.skipIf(uld is None, "update_live_data indisponivel: %r" % (_ULD_ERROR,))
class NormalizeDividendYieldTests(unittest.TestCase):
    """Caminho yfinance: o valor chega JA em percentagem."""

    def test_percentagem_passa_intacta(self):
        for valor in (2.11, 1.21, 4.67):
            with self.subTest(valor=valor):
                self.assertEqual(uld._normalize_dividend_yield(valor), valor)

    def test_arredonda_a_duas_casas(self):
        self.assertEqual(uld._normalize_dividend_yield(0.56789), 0.57)

    def test_faixa_plausivel(self):
        self.assertEqual(uld._normalize_dividend_yield(0.01), 0.01)
        self.assertEqual(uld._normalize_dividend_yield(100.0), 100.0)  # limite inclusivo

    def test_rejeita_valores_inflados_100x(self):
        # REGRESSAO: 211.0 = 2.11*100; 467.0 = 4.67*100
        for inflado in (211.0, 186.0, 467.0, 122.0, 100.01, 1e6):
            with self.subTest(valor=inflado):
                self.assertIsNone(uld._normalize_dividend_yield(inflado))

    def test_rejeita_nao_positivos_e_tipos_invalidos(self):
        for invalido in (0, -1, -0.5, None, "2.11", [], {}):
            with self.subTest(valor=invalido):
                self.assertIsNone(uld._normalize_dividend_yield(invalido))

    def test_rejeita_nan(self):
        self.assertIsNone(uld._normalize_dividend_yield(float("nan")))

    def test_teto_coincide_entre_os_dois_modulos(self):
        # Simetria: os dois caminhos de dados partilham o mesmo limite.
        self.assertEqual(uld.MAX_DIVIDEND_YIELD_PERCENT, yq.MAX_DIVIDEND_YIELD_PERCENT)


class YahooQuotesParseTests(unittest.TestCase):
    """Caminho fallback: a fracao decimal do Yahoo -> percentagem."""

    def test_converte_fracao_em_percentagem(self):
        cap, dy = yq._parse(_quote(market_cap=59624759296, forward=0.0207))
        self.assertEqual(cap, 59624759296)
        self.assertEqual(dy, 2.07)  # 0.0207 -> 2.07%

    def test_usa_trailing_quando_forward_e_zero(self):
        _, dy = yq._parse(_quote(market_cap=1, forward=0.0, trailing=0.0461))
        self.assertEqual(dy, 4.61)

    def test_sem_dividendo_devolve_none(self):
        _, dy = yq._parse(_quote(market_cap=1, forward=0.0, trailing=0.0))
        self.assertIsNone(dy)

    def test_guarda_corta_percentagem_ja_convertida(self):
        # Se o Yahoo devolvesse percentagem direta (2.0 = 200%), a guarda >100% corta.
        _, dy = yq._parse(_quote(market_cap=1, forward=2.0))
        self.assertIsNone(dy)

    def test_sem_market_cap_devolve_none(self):
        cap, _ = yq._parse(_quote(forward=0.02))
        self.assertIsNone(cap)


class PositiveNumberTests(unittest.TestCase):
    def test_aceita_positivos(self):
        for valor in (1, 2.5, 0.0001):
            with self.subTest(valor=valor):
                self.assertTrue(yq._is_positive_number(valor))

    def test_rejeita_nao_positivos_e_nao_numericos(self):
        for valor in (0, -1, -0.5, None, "1", [], {}, float("nan")):
            with self.subTest(valor=valor):
                self.assertFalse(yq._is_positive_number(valor))


if __name__ == "__main__":
    unittest.main()
