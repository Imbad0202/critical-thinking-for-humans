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


def complete_drill(page: Page, answers=("A", "B", "A"), verify_profile=True) -> None:
    page.locator('.mode-choice-card[data-mode="drill"]').click()
    page.wait_for_selector('.mode-brief[data-mode="drill"]')
    page.locator('[data-action="start-mode"]').click()
    page.wait_for_selector('.mode-play[data-mode="drill"]')

    for index, answer in enumerate(answers):
        page.locator('[data-action="inspect"]').click()
        page.wait_for_selector(".play-choices")
        page.locator(f'[data-answer="{answer}"]').click()
        assert page.locator(f'[data-answer="{answer}"]').get_attribute("aria-pressed") == "true"
        assert page.locator(f'[data-answer="{answer}"] i').inner_text() == "●"
        page.locator('[data-action="lock-answer"]').click()
        outcome = "hit" if answer == ("A", "B", "A")[index] else "miss"
        page.wait_for_selector(f'.play-ruling[data-result="{outcome}"]')
        assert page.locator('.play-ruling h2').evaluate('el => el === document.activeElement')
        page.locator('[data-action="next-step"]').click()
        if index < 2:
            page.wait_for_selector(".play-evidence[data-sealed]")

    page.wait_for_selector(".mode-complete__report")
    if verify_profile:
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
    page.locator('[data-action="audio-settings"]').click()
    page.wait_for_selector('[role="dialog"]')
    page.keyboard.press("Escape")
    assert page.locator('[data-action="audio-settings"]').evaluate("el => el === document.activeElement")

    complete_drill(page, answers=("B", "B", "A"))
    assert page.locator('[data-action="retry-misses"]').inner_text() == "Retry missed questions (1)"
    assert page.locator('[data-action="next-mode"]').get_attribute("data-next-mode") == "scene"
    page.locator('[data-action="retry-misses"]').click()
    assert page.locator('.play-progress i').count() == 1
    page.locator('.language-switch [data-locale="zh-TW"]').click()
    assert "錯題重練" in page.locator('.play-hud__title').inner_text()
    page.locator('[data-action="inspect"]').click()
    page.locator('[data-answer="A"]').click()
    page.locator('[data-action="lock-answer"]').click()
    page.locator('[data-action="next-step"]').click()
    page.wait_for_selector('.mode-complete__report')
    assert page.locator('[data-action="retry-misses"]').count() == 0
    profile = page.evaluate(f"JSON.parse(localStorage.getItem('{PASSPORT_KEY}'))")
    assert profile['xp'] == 82, profile  # 64 for the initial run; no second daily bonus.
    page.locator('[data-action="replay"]').click()
    assert page.locator('.play-progress i').count() == 3
    page.locator('[data-action="exit-play"]').click()
    page.locator('[data-action="select"]').last.click()
    complete_drill(page, verify_profile=False)
    page.locator('[data-action="next-mode"]').click()
    page.wait_for_selector('.mode-brief[data-mode="scene"]')
    context.close()


def run_storage_fallback_smoke(browser, errors: list[str], responses: list[tuple[str, int]]) -> None:
    context = browser.new_context(viewport={"width": 320, "height": 844})
    page = context.new_page()
    watch_page(page, errors, responses)
    page.route("**/api/daily", lambda route: fulfill_json(route, {}, status=503))
    page.add_init_script("""(() => {
      const malformed = {version:3, xp:'<invalid>', clues:-1, dailyModes:null,
        dailyCases:[], completedSessions:null, modeCompletions:null, structures:null,
        musicVolume:'invalid'};
      Storage.prototype.getItem = function(key) {
        return key.endsWith('.v3') ? JSON.stringify(malformed) : null;
      };
      Storage.prototype.setItem = function() { throw new DOMException('Storage full', 'QuotaExceededError'); };
      Storage.prototype.removeItem = function() { throw new DOMException('Storage disabled', 'SecurityError'); };
    })()""")
    page.goto(f"{BASE_URL}?lang=en&domain=all", wait_until="networkidle")
    page.wait_for_selector('.mode-choice-card')
    assert page.evaluate('document.documentElement.scrollWidth <= innerWidth + 1')
    page.locator('[data-action="audio-settings"]').click()
    page.locator('.audio-dialog [data-action="toggle-music"]').click()
    assert page.locator('.audio-dialog [data-action="toggle-music"]').get_attribute('aria-pressed') == 'false'
    assert page.locator('.audio-dialog [data-action="toggle-music"]').evaluate('el => el === document.activeElement')
    page.locator('.audio-dialog [data-action="close"]').click()
    complete_drill(page, verify_profile=False)
    assert "cannot save the Passport" in page.locator('.mode-complete__report').inner_text()
    page.locator('[data-action="select"]').last.click()
    page.locator('[data-action="passport"]').click()
    page.locator('[data-action="reset-profile"]').click()
    assert "could not delete" in page.locator('.game-toast').inner_text()
    assert page.locator('[role="dialog"]').count() == 1
    context.close()


def run_world_lifecycle_smoke(browser, errors: list[str], responses: list[tuple[str, int]]) -> None:
    context = browser.new_context(viewport={"width": 1100, "height": 850}, reduced_motion="reduce")
    page = context.new_page()
    watch_page(page, errors, responses)
    page.route("**/api/daily", lambda route: fulfill_json(route, {}, status=503))
    page.add_init_script("""(() => {
      window.worldDraws = 0;
      const draw = WebGLRenderingContext.prototype.drawArrays;
      WebGLRenderingContext.prototype.drawArrays = function(...args) {
        window.worldDraws += 1;
        return draw.apply(this, args);
      };
    })()""")
    page.goto(f"{BASE_URL}?lang=en&domain=all", wait_until="networkidle")
    page.mouse.move(100, 100)
    page.wait_for_function("window.worldDraws > 0 || document.querySelector('#world-root.world-fallback')")
    if page.locator('#world-root.world-fallback').count():
        context.close()
        print('WebGL unavailable: verified fallback; draw-loop assertions skipped')
        return
    draws = page.evaluate('window.worldDraws')
    page.mouse.move(200, 200)
    page.wait_for_timeout(200)
    assert page.evaluate('window.worldDraws') == draws
    page.emulate_media(reduced_motion="no-preference")
    page.wait_for_function('(previous) => window.worldDraws > previous', arg=draws)
    page.locator('.mode-choice-card[data-mode="drill"]').click()
    page.wait_for_selector('.mode-brief')
    draws = page.evaluate('window.worldDraws')
    page.wait_for_timeout(200)
    assert page.evaluate('window.worldDraws') == draws
    page.locator('[data-action="select"]').first.click()
    page.wait_for_function('(previous) => window.worldDraws > previous', arg=draws)
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
    run_storage_fallback_smoke(browser, page_errors, http_responses)
    run_world_lifecycle_smoke(browser, page_errors, http_responses)
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

print("PASS static fallback + replay + keyboard + storage + Daily server-ruling smoke")
