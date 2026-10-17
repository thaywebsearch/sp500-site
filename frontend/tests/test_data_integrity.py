"""Verificacao de integridade dos datasets S&P 500 (11 setores x 2 copias).

Apanha regressoes como o bug de 2026-10-13 (``dividendYield`` x100) e garante que
o espelho usado pela API em ``backend/data`` esta em sincronia com o dataset
canonico do frontend.

Invariantes verificadas (confirmadas nos dados reais em 2026-10-17):

* ``count`` igual ao numero de empresas e o JSON analisa sem erro;
* ``sector`` e o nome de apresentacao (ex.: "Health Care"), nao o slug da pasta;
* ``dividendYield`` e ``None`` ou um float em ``(0, 25]%``;
* ``dividendYield is None`` <-> ``hasDividend == "Não"`` (e vice-versa "Sim");
* ``marketCap`` e ``None`` ou um inteiro positivo;
* a copia em ``backend/data`` e identica, empresa a empresa, a do frontend.
"""

import re
import unittest

import helpers

EXPECTED_COMPANY_KEYS = {
    "cik",
    "dateAdded",
    "dividendYield",
    "founded",
    "hasDividend",
    "headquarters",
    "marketCap",
    "marketCapClassification",
    "name",
    "sector",
    "subIndustry",
    "symbol",
}
DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

# Nenhuma empresa do S&P 500 paga perto disto (o maior yield real fica < 8%).
MAX_YIELD_PERCENT = 25.0


class SectorDataIntegrityTests(unittest.TestCase):
    def _iter_files(self):
        for folder in helpers.SECTOR_FOLDERS:
            yield folder, helpers.sector_json(helpers.FRONTEND_DIR, folder)

    def test_json_canonico_integro(self):
        for folder, path in self._iter_files():
            with self.subTest(setor=folder):
                self.assertTrue(path.exists(), "JSON em falta: %s" % path)
                data = helpers.load_json(path)
                self.assertEqual(data["count"], len(data["companies"]))
                self.assertTrue(data["companies"])
                self.assertEqual(data["sector"], folder.replace("-", " ").title())
                self.assertIn("source", data)
                self.assertRegex(str(data["generatedAt"]), DATE_RE)

    def test_empresas_tem_esquema_esperado(self):
        for folder, path in self._iter_files():
            for company in helpers.load_json(path)["companies"]:
                with self.subTest(setor=folder, symbol=company.get("symbol")):
                    self.assertEqual(set(company), EXPECTED_COMPANY_KEYS)
                    self.assertTrue(company["symbol"])
                    self.assertTrue(company["name"])
                    self.assertTrue(company["subIndustry"])
                    self.assertTrue(company["headquarters"])

    def test_dividend_yield_sempre_plausivel(self):
        # Guarda principal contra a regressao do bug x100.
        for folder, path in self._iter_files():
            for company in helpers.load_json(path)["companies"]:
                with self.subTest(setor=folder, symbol=company["symbol"]):
                    dy = company["dividendYield"]
                    if dy is None:
                        continue
                    self.assertIsInstance(dy, (int, float))
                    self.assertGreater(dy, 0)
                    self.assertLessEqual(
                        dy,
                        MAX_YIELD_PERCENT,
                        "yield %.2f%% implausivel (bug x100 regrediu?)" % dy,
                    )

    def test_has_dividend_coincide_com_yield(self):
        for folder, path in self._iter_files():
            for company in helpers.load_json(path)["companies"]:
                with self.subTest(setor=folder, symbol=company["symbol"]):
                    if company["dividendYield"] is None:
                        self.assertEqual(company["hasDividend"], "Não")
                    else:
                        self.assertEqual(company["hasDividend"], "Sim")

    def test_market_cap_sempre_positivo(self):
        for folder, path in self._iter_files():
            for company in helpers.load_json(path)["companies"]:
                with self.subTest(setor=folder, symbol=company["symbol"]):
                    cap = company["marketCap"]
                    if cap is None:
                        continue
                    self.assertIsInstance(cap, int)
                    self.assertGreater(cap, 0)

    def test_espelho_backend_em_sincronia(self):
        for folder in helpers.SECTOR_FOLDERS:
            with self.subTest(setor=folder):
                be_path = helpers.BACKEND_DATA_DIR / (folder + ".json")
                self.assertTrue(be_path.exists(), "espelho em falta: %s" % be_path)
                front = helpers.load_json(
                    helpers.sector_json(helpers.FRONTEND_DIR, folder)
                )["companies"]
                back = helpers.load_json(be_path)["companies"]
                front_by_symbol = {c["symbol"]: c for c in front}
                back_by_symbol = {c["symbol"]: c for c in back}
                self.assertEqual(set(front_by_symbol), set(back_by_symbol))
                for symbol, row in front_by_symbol.items():
                    self.assertEqual(
                        row,
                        back_by_symbol[symbol],
                        "%s divergente entre frontend e backend" % symbol,
                    )


if __name__ == "__main__":
    unittest.main()
