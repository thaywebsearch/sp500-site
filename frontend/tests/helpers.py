"""Utilitarios partilhados pelos testes Python (stdlib unittest, sem deps).

Este pacote de testes nao depende de pytest: corre com a stdlib.

Execucao (a partir de ``frontend/``):
    python -m unittest discover -s tests -v
"""

import sys
from pathlib import Path

TESTS_DIR = Path(__file__).resolve().parent
FRONTEND_DIR = TESTS_DIR.parent
SCRIPTS_DIR = FRONTEND_DIR / "scripts"
REPO_ROOT = FRONTEND_DIR.parent
BACKEND_DATA_DIR = REPO_ROOT / "backend" / "data"

# Setores GICS e respetivas pastas canonicas (mantido em sincronia com
# scripts/update_sectors.py -> SECTOR_FOLDER_MAP).
SECTOR_FOLDERS = [
    "communication-services",
    "consumer-discretionary",
    "consumer-staples",
    "energy",
    "financials",
    "health-care",
    "industrials",
    "information-technology",
    "materials",
    "real-estate",
    "utilities",
]


def add_scripts_to_path():
    """Torna os modulos de scripts/ importaveis nos testes."""
    if str(SCRIPTS_DIR) not in sys.path:
        sys.path.insert(0, str(SCRIPTS_DIR))


def sector_json(base_dir, folder):
    """Caminho para o JSON canonico de um setor numa dada base de dados."""
    return Path(base_dir) / folder / f"{folder}.json"


def load_json(path):
    import json

    return json.loads(Path(path).read_text(encoding="utf-8"))
