"""Browser contract tests for the optional server-backed Daily feature.

Run against the same dependency-free static server used by e2e_modes.py:

    python -m http.server 4173 --directory web
    CASEBOOK_BASE_URL=http://127.0.0.1:4173/ python web/tests/e2e_daily.py

The API calls are intercepted in the browser.  This keeps the tests useful for
the static/offline entry point while exercising success, degradation, date, and
request-race behavior with the production frontend code.
"""

from __future__ import annotations

import copy
import json
import os
import re
import time
from pathlib import Path
from typing import Any, Optional

from playwright.sync_api import Page, Route, sync_playwright


ROOT = Path(__file__).resolve().parents[2]
BASE_URL = os.environ.get("CASEBOOK_BASE_URL", "http://127.0.0.1:4173/")
PASSPORT_KEY = "critical-thinking-for-humans.casebook.v3"
CASE_PATH = (
    ROOT
    / "web/content/daily/cases/daily-2026-07-12-measurement-gap.json"
)
PUBLIC_CASE = json.loads(CASE_PATH.read_text(encoding="utf-8"))
SCENE_CASE_PATH = (
    ROOT
    / "web/content/daily/cases/daily-2026-07-13-unanswered-reply.json"
)
PUBLIC_SCENE_CASE = json.loads(SCENE_CASE_PATH.read_text(encoding="utf-8"))

PUBLIC_FORBIDDEN_TOKENS = {
    "answer",
    "correct",
    "expected",
    "explanation",
    "feedback",
    "grade",
    "grading",
    "hint",
    "key",
    "miss",
    "rationale",
    "reveal",
    "reward",
    "score",
    "scoring",
    "solution",
    "success",
    "verdict",
}
ANSWER_RESPONSE_FORBIDDEN_KEYS = {
    "answerKey",
    "answers",
    "correct",
    "correctOptionId",
    "solution",
    "verdicts",
}


def field_tokens(name: str) -> set[str]:
    spaced = re.sub(r"([a-z0-9])([A-Z])", r"\1 \2", name)
    return {
        part.lower()
        for part in re.split(r"[^A-Za-z0-9]+", spaced)
        if part
    }


def walk_keys(value: Any, path: str = "$"):
    if isinstance(value, dict):
        for key, nested in value.items():
            yield path, key
            yield from walk_keys(nested, f"{path}.{key}")
    elif isinstance(value, list):
        for index, nested in enumerate(value):
            yield from walk_keys(nested, f"{path}[{index}]")


def assert_public_case_has_no_reveal_fields(case: dict[str, Any]) -> None:
    leaks = []
    for path, key in walk_keys(case):
        matched = field_tokens(key) & PUBLIC_FORBIDDEN_TOKENS
        if matched:
            leaks.append((path, key, sorted(matched)))
    assert leaks == [], leaks


def assert_answer_response_has_no_key_map(response: dict[str, Any]) -> None:
    leaks = [
        (path, key)
        for path, key in walk_keys(response)
        if key in ANSWER_RESPONSE_FORBIDDEN_KEYS
    ]
    assert leaks == [], leaks


def daily_envelope(
    date: str,
    *,
    daily_case: Optional[dict[str, Any]] = None,
    answerable: bool = True,
    grading_available: bool = True,
) -> dict[str, Any]:
    case = copy.deepcopy(daily_case or PUBLIC_CASE)
    return {
        "schemaVersion": 1,
        "date": date,
        "timeZone": "Asia/Taipei",
        "rotationId": "public-demo-seven-day-v1",
        "contentId": case["id"],
        "answerable": answerable,
        "gradingAvailable": grading_available,
        "case": case,
    }


def selected_option(body: dict[str, Any]) -> str:
    return body.get("answer") or body.get("selectedOptionId")


def submitted_content_id(body: dict[str, Any]) -> str:
    return body.get("contentId") or body.get("caseId")


def answer_response(body: dict[str, Any], date: str) -> dict[str, Any]:
    """Return a hit for C, deliberately differing from the bundled demo key."""
    selected = selected_option(body)
    response = {
        "schemaVersion": 1,
        "date": date,
        "timeZone": "Asia/Taipei",
        "caseId": submitted_content_id(body),
        "itemId": body["itemId"],
        "selectedOptionId": selected,
        "outcome": "hit" if selected == "C" else "miss",
        "xp": 37 if selected == "C" else 11,
        "reveal": {
            "heading": "伺服器判決：第三項命中",
            "feedback": "這段文字只來自模擬的 /api/answer 回應。",
            "verdict": None,
            "structure": "server_authority",
            "structureLabel": "伺服器判決",
            "reward": "遠端封條" if selected == "C" else None,
            "hint": None if selected == "C" else "回到主張真正量到的結果。",
        },
    }
    assert_answer_response_has_no_key_map(response)
    return response


def fulfill_json(route: Route, body: dict[str, Any], status: int = 200) -> None:
    route.fulfill(
        status=status,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "Cache-Control": "no-store",
        },
        body=json.dumps(body, ensure_ascii=False),
    )


def install_ready_api(
    page: Page,
    envelope_source,
    submissions: list[dict[str, Any]],
    *,
    answer_delay: float = 0,
) -> None:
    def serve_daily(route: Route) -> None:
        envelope = envelope_source() if callable(envelope_source) else envelope_source
        assert_public_case_has_no_reveal_fields(envelope["case"])
        fulfill_json(route, envelope)

    def serve_answer(route: Route) -> None:
        assert route.request.method == "POST"
        body = route.request.post_data_json
        assert isinstance(body, dict), body
        submissions.append(copy.deepcopy(body))
        if answer_delay:
            time.sleep(answer_delay)
        envelope = envelope_source() if callable(envelope_source) else envelope_source
        fulfill_json(route, answer_response(body, envelope["date"]))

    page.route("**/api/daily", serve_daily)
    page.route("**/api/answer", serve_answer)


def open_home(page: Page) -> None:
    separator = "&" if "?" in BASE_URL else "?"
    page.goto(f"{BASE_URL}{separator}lang=zh-TW", wait_until="domcontentloaded")
    page.wait_for_selector('.domain-grid [data-domain="all"]')
    page.locator('.domain-grid [data-domain="all"]').click()
    page.wait_for_selector(".mode-choice-card")
    assert page.locator(".mode-choice-card").count() == 4


def wait_daily(page: Page, state: str) -> None:
    page.wait_for_selector(f'.daily-feature[data-state="{state}"]')
    assert page.locator(".mode-choice-card").count() == 4


def start_daily_question(page: Page, envelope: dict[str, Any]) -> None:
    wait_daily(page, "ready")
    feature = page.locator('.daily-feature[data-state="ready"]')
    assert envelope["case"]["title"] in feature.inner_text()
    feature.locator('[data-action="start-daily"]').click()
    play = page.locator(".daily-play")
    play.wait_for()
    assert play.get_attribute("data-case-id") == envelope["contentId"]
    assert play.get_attribute("data-date") == envelope["date"]
    play.locator('[data-action="inspect-daily"]').click()
    play.locator("[data-daily-answer]").first.wait_for()


def answer_daily(page: Page, option: str = "C") -> None:
    play = page.locator(".daily-play")
    lock = play.locator('[data-action="lock-daily-answer"]')
    assert lock.is_disabled()
    play.locator(f'[data-daily-answer="{option}"]').click()
    assert not lock.is_disabled()
    lock.click()


def complete_daily(page: Page, option: str = "C") -> None:
    answer_daily(page, option)
    expected_result = "hit" if option == "C" else "miss"
    ruling = page.locator(f'.daily-ruling[data-result="{expected_result}"]')
    ruling.wait_for()
    assert "伺服器判決" in ruling.inner_text()
    page.locator('[data-action="next-daily"]').click()
    page.wait_for_selector(".daily-complete")


def assert_submission(body: dict[str, Any], envelope: dict[str, Any], option: str) -> None:
    assert submitted_content_id(body) == envelope["contentId"], body
    assert body["itemId"] == "measurement-gap", body
    assert selected_option(body) == option, body
    if "date" in body:
        assert body["date"] == envelope["date"], body


def choose_mode(page: Page, mode: str) -> None:
    assert page.locator(".mode-choice-card").count() == 4
    page.locator(f'.mode-choice-card[data-mode="{mode}"]').click()
    page.wait_for_selector(f'.mode-brief[data-mode="{mode}"]')
    page.locator('[data-action="start-mode"]').click()
    page.wait_for_selector(f'.mode-play[data-mode="{mode}"]')


def finish_graded_mode(page: Page, answers: list[str]) -> None:
    for index, answer in enumerate(answers):
        page.locator('[data-action="inspect"]').click()
        page.locator(f'[data-answer="{answer}"]').click()
        page.locator('[data-action="lock-answer"]').click()
        page.wait_for_selector('.play-ruling[data-result="hit"]')
        page.locator('[data-action="next-step"]').click()
        if index < len(answers) - 1:
            page.wait_for_selector(".play-evidence[data-sealed]")
    page.wait_for_selector(".mode-complete__report")


def finish_scene_mode(page: Page) -> None:
    page.locator("#scene-observation").fill("觀察記錄不應寫入護照。")
    page.locator('[data-action="submit-observation"]').click()
    for _ in range(6):
        page.locator('[data-answer="0"]').click()
        page.locator('[data-action="lock-lens"]').click()
        page.locator('[data-action="next-lens"]').click()
    page.locator('[data-position="0"]').click()
    page.locator("#scene-blindspot").fill("可能低估公共安全消息的時效。")
    page.locator('[data-action="submit-camera"]').click()
    page.locator('[data-commitment="0"]').click()
    page.locator("#scene-decision-reason").fill("資料尚未完整，先降低版面並訂出更新時間。")
    page.locator('[data-action="pressure-test"]').click()
    page.locator('[data-action="hold-commitment"]').click()
    page.wait_for_selector(".mode-complete__report")


def walk_all_existing_modes(page: Page) -> None:
    plans = [
        ("drill", ["A", "B", "A"]),
        ("scene", None),
        ("expedition", ["B", "B", "B"]),
        ("detective", ["A", "B"]),
    ]
    for mode, answers in plans:
        choose_mode(page, mode)
        if mode == "scene":
            finish_scene_mode(page)
        else:
            finish_graded_mode(page, answers)
        page.locator('[data-action="select"]').last.click()
        page.wait_for_selector(".mode-choice-card")
        assert page.locator(".mode-choice-card").count() == 4


def profile(page: Page) -> Optional[dict[str, Any]]:
    return page.evaluate(
        "key => JSON.parse(localStorage.getItem(key) || 'null')", PASSPORT_KEY
    )


def test_success_and_existing_modes(browser, page_errors: list[str]) -> None:
    context = browser.new_context(viewport={"width": 1280, "height": 900})
    page = context.new_page()
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    envelope = daily_envelope("2031-02-03")
    submissions: list[dict[str, Any]] = []
    install_ready_api(page, envelope, submissions)
    open_home(page)
    start_daily_question(page, envelope)
    complete_daily(page, "C")

    assert len(submissions) == 1, submissions
    assert_submission(submissions[0], envelope, "C")
    saved = profile(page)
    assert saved is not None
    assert saved["lastCompleted"] == envelope["date"], saved
    assert saved["streak"] == 1, saved

    page.locator('[data-action="exit-daily"]').click()
    page.wait_for_selector(".mode-choice-card")
    walk_all_existing_modes(page)
    context.close()


def assert_daily_degrades_but_modes_remain(browser, install_route, page_errors) -> None:
    context = browser.new_context(viewport={"width": 1100, "height": 800})
    page = context.new_page()
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    install_route(page)
    open_home(page)
    wait_daily(page, "unavailable")
    assert page.locator('[data-action="start-daily"]').is_disabled()

    # A failed Daily request must not block the original four-mode router.
    choose_mode(page, "drill")
    assert page.locator('.mode-play[data-mode="drill"]').count() == 1
    context.close()


def test_failure_states(browser, page_errors: list[str]) -> None:
    def service_unavailable(page: Page) -> None:
        page.route(
            "**/api/daily",
            lambda route: fulfill_json(
                route,
                {"error": {"code": "DAILY_UNAVAILABLE", "message": "later"}},
                status=503,
            ),
        )

    assert_daily_degrades_but_modes_remain(
        browser, service_unavailable, page_errors
    )

    def invalid_payload(page: Page) -> None:
        invalid = daily_envelope("2031-02-03")
        invalid["case"]["content"]["items"][0]["correctOptionId"] = "A"
        page.route("**/api/daily", lambda route: fulfill_json(route, invalid))

    assert_daily_degrades_but_modes_remain(browser, invalid_payload, page_errors)

    def never_resolves(page: Page) -> None:
        # Leaving the route unresolved exercises the frontend AbortController.
        page.route("**/api/daily", lambda _route: None)

    assert_daily_degrades_but_modes_remain(browser, never_resolves, page_errors)


def test_authoritative_date_rollover(browser, page_errors: list[str]) -> None:
    context = browser.new_context(viewport={"width": 1200, "height": 850})
    page = context.new_page()
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    current = {"envelope": daily_envelope("2031-02-03")}
    submissions: list[dict[str, Any]] = []
    install_ready_api(page, lambda: current["envelope"], submissions)

    open_home(page)
    start_daily_question(page, current["envelope"])
    complete_daily(page, "C")
    first = profile(page)
    assert first is not None
    assert first["lastCompleted"] == "2031-02-03", first
    assert first["streak"] == 1, first

    # The public fixture still says 2026-07-12.  Only the envelope date changes,
    # proving the UI/progress code does not mistake publishDate for today's date.
    current["envelope"] = daily_envelope("2031-02-04")
    page.reload(wait_until="domcontentloaded")
    wait_daily(page, "ready")
    start_daily_question(page, current["envelope"])
    complete_daily(page, "C")
    second = profile(page)
    assert second is not None
    assert second["lastCompleted"] == "2031-02-04", second
    assert second["streak"] == 2, second
    assert len(submissions) == 2, submissions
    assert_submission(submissions[0], daily_envelope("2031-02-03"), "C")
    assert_submission(submissions[1], daily_envelope("2031-02-04"), "C")
    context.close()


def test_daily_scene_is_neutral_and_never_posts_an_answer(
    browser, page_errors: list[str]
) -> None:
    context = browser.new_context(viewport={"width": 1200, "height": 850})
    page = context.new_page()
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    envelope = daily_envelope(
        "2031-02-05",
        daily_case=PUBLIC_SCENE_CASE,
        grading_available=False,
    )
    submissions: list[dict[str, Any]] = []
    install_ready_api(page, envelope, submissions)

    open_home(page)
    start_daily_question(page, envelope)
    for index in range(6):
        page.locator('[data-daily-answer="0"]').click()
        page.locator('[data-action="lock-daily-answer"]').click()
        page.wait_for_selector('.daily-ruling[data-result="neutral"]')
        page.locator('[data-action="next-daily"]').click()
        if index < 5:
            page.wait_for_selector('[data-daily-answer="0"]')
    page.wait_for_selector(".daily-complete")
    assert submissions == [], submissions
    saved = profile(page)
    assert saved is not None
    assert saved["lastCompleted"] == envelope["date"], saved
    context.close()


def test_double_submit_and_stale_response(browser, page_errors: list[str]) -> None:
    envelope = daily_envelope("2031-02-03")

    context = browser.new_context(viewport={"width": 1100, "height": 800})
    page = context.new_page()
    page.on("pageerror", lambda error: page_errors.append(str(error)))
    submissions: list[dict[str, Any]] = []
    install_ready_api(page, envelope, submissions, answer_delay=0.25)
    open_home(page)
    start_daily_question(page, envelope)
    page.locator('[data-daily-answer="C"]').click()
    page.eval_on_selector(
        '[data-action="lock-daily-answer"]',
        "button => { button.click(); button.click(); }",
    )
    page.wait_for_selector('.daily-ruling[data-result="hit"]')
    assert len(submissions) == 1, submissions
    context.close()

    stale_context = browser.new_context(viewport={"width": 1100, "height": 800})
    stale_page = stale_context.new_page()
    stale_page.on("pageerror", lambda error: page_errors.append(str(error)))
    stale_submissions: list[dict[str, Any]] = []
    install_ready_api(stale_page, envelope, stale_submissions, answer_delay=0.25)
    open_home(stale_page)
    start_daily_question(stale_page, envelope)
    stale_page.locator('[data-daily-answer="C"]').click()
    stale_page.evaluate(
        """() => {
          document.querySelector('[data-action="lock-daily-answer"]').click()
          document.querySelector('[data-action="exit-daily"]').click()
        }"""
    )
    stale_page.wait_for_selector(".mode-choice-card")
    stale_page.wait_for_timeout(500)
    assert len(stale_submissions) == 1, stale_submissions
    assert stale_page.locator(".daily-play").count() == 0
    assert stale_page.locator(".daily-ruling").count() == 0
    stale_profile = profile(stale_page)
    assert stale_profile is None or (
        stale_profile["xp"] == 0 and stale_profile["lastCompleted"] is None
    ), stale_profile
    stale_context.close()


assert_public_case_has_no_reveal_fields(PUBLIC_CASE)

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page_errors: list[str] = []
    test_success_and_existing_modes(browser, page_errors)
    test_failure_states(browser, page_errors)
    test_authoritative_date_rollover(browser, page_errors)
    test_daily_scene_is_neutral_and_never_posts_an_answer(browser, page_errors)
    test_double_submit_and_stale_response(browser, page_errors)
    browser.close()

if page_errors:
    raise AssertionError("\n".join(page_errors))

print("PASS daily API success/fallback/date/race/leak contracts")
