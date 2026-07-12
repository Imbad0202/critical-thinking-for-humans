"""Backward-compatible entry point for the renamed four-mode browser test."""

import runpy
from pathlib import Path


runpy.run_path(str(Path(__file__).with_name('e2e_modes.py')), run_name='__main__')
