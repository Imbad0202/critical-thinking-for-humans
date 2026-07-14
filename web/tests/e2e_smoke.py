"""Focused pull-request smoke for the static Casebook and optional Daily API.

Run from the repository root while the static web server is listening:

    python -m http.server 4173 --bind 127.0.0.1 --directory web
    CASEBOOK_BASE_URL=http://127.0.0.1:4173/ python web/tests/e2e_smoke.py

The deeper multi-viewport, all-mode, and Daily race suites remain in
e2e_modes.py and e2e_daily.py. This file deliberately keeps the PR gate short.
"""

from __future__ import annotations

import copy
import json
import os
from pathlib import Path
from typing import Any

from playwright.sync_api import Page, Route, sync_playwright


ROOT = Path(__file__).resolve().parents[2]
BASE_URL = (
    os.environ.get("CASEBOOK_BASE_URL", "http://127.0.0.1:4173/").rstrip("/") + "/"
)
PASSPORT_KEY = "critical-thinking-for-humans.casebook.v3"
DAILY_CASE = json.loads(
    (ROOT / "web/content/daily/cases/daily-2026-07-12-measurement-gap.json").read_text(
        encoding="utf-8"
    )
)


def fulfill_json(route: Route, body: dict[str, Any], status: int = 200) -> None:
    route.fulfill(
        status=status,
        content_type="application/json; charset=utf-8",
        body=json.dumps(body, ensure_ascii=False),
    )


def watch_page(
    page: Page, errors: list[str], responses: list[tuple[str, int]]
) -> None:
    def record_console(message) -> None:
        if message.type == "error" and not message.text.startswith("Failed to load resource:"):
            errors.append(f"console:{message.type}:{message.text}")

    page.on("console", record_console)
    page.on("pageerror", lambda error: errors.append(f"pageerror:{error}"))
    page.on("response", lambda response: responses.append((response.url, response.status)))


def open_gateway(page: Page, locale: str) -> None:
    page.goto(f"{BASE_URL}?lang={locale}", wait_until="domcontentloaded")
    page.evaluate("localStorage.clear()")
    page.goto(f"{BASE_URL}?lang={locale}", wait_until="domcontentloaded")
    page.wait_for_selector(".domain-grid")
    assert page.locator(".mode-choice-card").count() == 0
    page.locator('.domain-grid [data-domain="all"]').click()
    page.wait_for_selector('.domain-chooser--complete[data-domain="all"]')
    assert page.locator(".mode-choice-card").count() == 4


def complete_drill(page: Page) -> None:
    page.locator('.mode-choice-card[data-mode="drill"]').click()
    page.wait_for_selector('.mode-brief[data-mode="drill"]')
    page.locator('[data-action="start-mode"]').click()
    page.wait_for_selector('.mode-play[data-mode="drill"]')

    for index, answer in enumerate(["A", "B", "A"]):
        page.locator('[data-action="inspect"]').click()
        page.wait_for_selector(".play-choices")
        page.locator(f'[data-answer="{answer}"]').click()
        page.locator('[data-action="lock-answer"]').click()
        page.wait_for_selector('.play-ruling[data-result="hit"]')
        page.locator('[data-action="next-step"]').click()
        if index < 2:
            page.wait_for_selector(".play-evidence[data-sealed]")

    page.wait_for_selector(".mode-complete__report")
    profile = page.evaluate(f"JSON.parse(localStorage.getItem('{PASSPORT_KEY}'))")
    assert profile["modeCompletions"]["drill"] == 1, profile


def run_static_smoke(browser, errors: list[str], responses: list[tuple[str, int]]) -> None:
    context = browser.new_context(viewport={"width": 1280, "height": 900}, locale="en-US")
    page = context.new_page()
    watch_page(page, errors, responses)
    page.route(
        "**/api/daily",
        lambda route: fulfill_json(
            route,
            {"error": {"code": "DAILY_UNAVAILABLE", "message": "CI static fallback"}},
            status=503,
        ),
    )

    open_gateway(page, "en")
    page.wait_for_selector('.daily-feature[data-state="unavailable"]')
    complete_drill(page)
    context.close()


def run_daily_smoke(browser, errors: list[str], responses: list[tuple[str, int]]) -> None:
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()
    watch_page(page, errors, responses)
    date = "2031-02-03"
    daily_case = copy.deepcopy(DAILY_CASE)
    envelope = {
        "schemaVersion": 1,
        "date": date,
        "timeZone": "Asia/Taipei",
        "rotationId": "ci-smoke",
        "contentId": daily_case["id"],
        "answerable": True,
        "gradingAvailable": True,
        "case": daily_case,
    }
    submissions: list[dict[str, Any]] = []

    page.route("**/api/daily", lambda route: fulfill_json(route, envelope))

    def serve_answer(route: Route) -> None:
        assert route.request.method == "POST"
        body = route.request.post_data_json
        assert isinstance(body, dict), body
        submissions.append(body)
        fulfill_json(
            route,
            {
                "schemaVersion": 1,
                "date": date,
                "timeZone": "Asia/Taipei",
                "caseId": envelope["contentId"],
                "itemId": body["itemId"],
                "selectedOptionId": body["answer"],
                "outcome": "hit",
                "xp": 17,
                "reveal": {
                    "heading": "CI 伺服器判決",
                    "feedback": "瀏覽器採用了伺服器回傳的單題判決。",
                    "verdict": None,
                    "structure": "measurement_gap",
                    "structureLabel": "測量落差",
                    "reward": "CI 封條",
                    "hint": None,
                },
            },
        )

    page.route("**/api/answer", serve_answer)
    open_gateway(page, "zh-TW")
    page.wait_for_selector('.daily-feature[data-state="ready"]')
    page.locator('[data-action="start-daily"]').click()
    page.wait_for_selector(".daily-play")
    page.locator('[data-action="inspect-daily"]').click()
    page.wait_for_selector('[data-daily-answer="A"]')
    page.locator('[data-daily-answer="A"]').click()
    page.locator('[data-action="lock-daily-answer"]').click()
    ruling = page.locator('.daily-ruling[data-result="hit"]')
    ruling.wait_for()
    assert "CI 伺服器判決" in ruling.inner_text()
    assert len(submissions) == 1, submissions
    assert submissions[0]["contentId"] == envelope["contentId"]
    assert submissions[0]["answer"] == "A"
    context.close()


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page_errors: list[str] = []
    http_responses: list[tuple[str, int]] = []
    run_static_smoke(browser, page_errors, http_responses)
    run_daily_smoke(browser, page_errors, http_responses)
    browser.close()

unexpected_http_errors = [
    (url, status)
    for url, status in http_responses
    if status >= 400 and not (status == 503 and url.endswith("/api/daily"))
]
if unexpected_http_errors:
    page_errors.append(f"unexpected HTTP responses: {unexpected_http_errors}")
if page_errors:
    raise AssertionError("\n".join(page_errors))

print("PASS focused static fallback + Drill + Daily server-ruling smoke")
