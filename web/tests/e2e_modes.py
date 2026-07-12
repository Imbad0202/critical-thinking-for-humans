import os
from pathlib import Path

from playwright.sync_api import sync_playwright


BASE_URL = os.environ.get('CASEBOOK_BASE_URL', 'http://127.0.0.1:4173/')
SCREENS = Path('/private/tmp/cth-casebook-modes')
SCREENS.mkdir(parents=True, exist_ok=True)


def assert_no_overflow(page):
    metrics = page.evaluate("""({
      viewport: innerWidth,
      html: document.documentElement.scrollWidth,
      body: document.body.scrollWidth,
    })""")
    assert metrics['html'] <= metrics['viewport'] + 1, metrics
    assert metrics['body'] <= metrics['viewport'] + 1, metrics


def assert_readable_text(page):
    tiny = page.evaluate("""[...document.querySelectorAll('body *')]
      .filter((el) => [...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && node.textContent.trim()))
      .filter((el) => !el.closest('.sr-only,[aria-hidden="true"]'))
      .map((el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return {
        text: el.textContent.trim().slice(0, 55), size: parseFloat(s.fontSize),
        visible: s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > .1 && r.width > 0 && r.height > 0
      }})
      .filter((item) => item.visible && item.size < 13.9)""")
    assert tiny == [], tiny


def assert_no_clipped_controls(page):
    clipped = page.evaluate("""[...document.querySelectorAll('button:not(:disabled), h1, h2, h3, p, strong')]
      .filter((el) => !el.closest('[aria-hidden="true"],.sr-only'))
      .map((el) => { const s = getComputedStyle(el); const r = el.getBoundingClientRect(); return {
        text: el.textContent.trim().slice(0, 55), left: r.left, right: r.right,
        visible: s.display !== 'none' && s.visibility !== 'hidden' && Number(s.opacity) > .1 && r.width > 0 && r.height > 0
      }})
      .filter((item) => item.visible && (item.left < -.5 || item.right > innerWidth + .5))""")
    assert clipped == [], clipped


def assert_touch_targets(page):
    small = page.evaluate("""[...document.querySelectorAll('button:not(:disabled), input[type="range"]')]
      .map((el) => { const r = el.getBoundingClientRect(); return ({text:el.innerText || el.id, w:r.width, h:r.height}) })
      .filter((item) => item.w > 0 && item.h > 0 && (item.w < 43.5 || item.h < 43.5))""")
    assert small == [], small


def choose_domain(page, domain='all'):
    if page.locator('.domain-grid').count() == 0:
        page.locator('[data-action="change-domain"]').click()
        page.wait_for_selector('.domain-grid')
    page.locator(f'.domain-grid [data-domain="{domain}"]').click()
    page.wait_for_selector(f'.domain-chooser--complete[data-domain="{domain}"]')


def choose(page, mode):
    page.locator(f'.mode-choice-card[data-mode="{mode}"]').click()
    page.wait_for_selector(f'.mode-brief[data-mode="{mode}"]')
    assert mode.upper() in page.locator('.brief-topbar').inner_text().upper()
    page.locator('[data-action="start-mode"]').click()
    page.wait_for_selector(f'.mode-play[data-mode="{mode}"]')


def finish_graded(page, answers):
    for index, answer in enumerate(answers):
        page.locator('[data-action="inspect"]').click()
        page.wait_for_selector('.play-choices')
        if index == 0:
            page.screenshot(path=str(SCREENS / 'state-graded-question.png'), full_page=True)
        assert page.locator('[data-action="lock-answer"]').is_disabled()
        page.locator(f'[data-answer="{answer}"]').click()
        page.locator('[data-action="lock-answer"]').click()
        page.wait_for_selector('.play-ruling')
        assert page.locator('.play-ruling[data-result="hit"]').count() == 1
        assert page.locator('.option-review article').count() >= 3
        page.locator('[data-action="next-step"]').click()
        if index < len(answers) - 1:
            page.wait_for_selector('.play-evidence[data-sealed]')
    page.wait_for_selector('.mode-complete__report')


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(viewport={'width': 1440, 'height': 1000}, locale='en-US')
    page = context.new_page()
    errors = []
    responses = []
    page.on(
        'console',
        lambda message: errors.append(f'console:{message.type}:{message.text}')
        if message.type == 'error' and not message.text.startswith('Failed to load resource:')
        else None,
    )
    page.on('pageerror', lambda error: errors.append(f'pageerror:{error}'))
    page.on('response', lambda response: responses.append((response.url, response.status)))

    page.goto(BASE_URL)
    page.wait_for_load_state('networkidle')
    page.evaluate('localStorage.clear()')
    page.goto(f'{BASE_URL}?lang=en')
    page.wait_for_selector('.domain-grid')

    # Domain choice is the real first gate; it changes the available content.
    assert page.locator('.mode-choice-card').count() == 0
    assert 'What kind of problem' in page.locator('#domain-title').inner_text()
    choose_domain(page, 'health')
    assert page.locator('.mode-choice-card').count() == 1
    assert page.locator('.mode-choice-card[data-mode="drill"]').count() == 1
    assert page.locator('#mode-choice-title').evaluate('(element) => element === document.activeElement')
    assert page.locator('#world-root').get_attribute('data-active-mode') == 'drill'
    choose(page, 'drill')
    assert page.locator('.play-progress i').count() == 1
    assert 'base-rate' in page.locator('.play-copy').inner_text().lower()
    page.locator('[data-action="exit-play"]').click()
    page.locator('[data-action="select"]').last.click()

    choose_domain(page, 'all')
    assert page.locator('.mode-choice-card').count() == 4
    assert 'Which door' in page.locator('#gateway-title').inner_text()
    assert page.locator('html').get_attribute('lang') == 'en'
    assert_no_overflow(page)
    assert_readable_text(page)
    assert_no_clipped_controls(page)
    assert_touch_targets(page)
    page.screenshot(path=str(SCREENS / '01-gateway-en.png'), full_page=True)

    # Language switching changes both interface and case content while preserving domain.
    page.locator('.language-switch [data-locale="zh-TW"]').first.click()
    page.wait_for_function("document.documentElement.lang === 'zh-Hant-TW'")
    assert page.locator('.language-switch [data-locale="zh-TW"]').first.evaluate('(element) => element === document.activeElement')
    assert '已選擇：綜合案件' in page.locator('#domain-title').inner_text()
    assert '推理快問' in page.locator('.mode-choice-card[data-mode="drill"]').inner_text()
    assert page.locator('.mode-choice-card').count() == 4
    assert page.evaluate("localStorage.getItem('critical-thinking-for-humans.casebook.domain')") == 'all'
    assert 'domain=all' in page.url and 'lang=zh-TW' in page.url
    page.screenshot(path=str(SCREENS / '01-gateway-zh.png'), full_page=True)

    # URL/localStorage persistence and the reversible domain gate are real behavior.
    page.goto(f'{BASE_URL}?lang=zh-TW')
    page.wait_for_selector('.domain-chooser--complete[data-domain="all"]')
    assert page.locator('.mode-choice-card').count() == 4
    assert 'domain=' not in page.url
    page.locator('[data-action="change-domain"]').click()
    page.wait_for_selector('.domain-grid')
    assert page.locator('#domain-title').evaluate('(element) => element === document.activeElement')
    assert page.locator('.mode-choice-card').count() == 0
    assert page.evaluate("localStorage.getItem('critical-thinking-for-humans.casebook.domain')") is None
    assert 'domain=' not in page.url
    choose_domain(page, 'all')

    page.locator('[data-action="providers"]').first.click()
    page.wait_for_selector('#provider-title')
    assert page.locator('.route-dialog-grid article').count() == 3
    assert '聊天訂閱不等於第三方 API 額度' in page.locator('.truth-card').inner_text()
    page.locator('.game-dialog [data-action="close"]').first.click()

    choose(page, 'drill')
    finish_graded(page, ['A', 'B', 'A'])
    assert '推理快問完成' in page.locator('#complete-title').inner_text()
    page.screenshot(path=str(SCREENS / '02-drill-complete.png'), full_page=True)
    page.locator('[data-action="select"]').last.click()

    choose(page, 'scene')
    page.locator('#scene-observation').fill('羅薇決定今晚刊登；程硯舟指出資料不完整；發行主任提到訂閱數據。')
    page.locator('[data-action="submit-observation"]').click()
    page.screenshot(path=str(SCREENS / 'state-scene-angle.png'), full_page=True)
    for _ in range(6):
        page.locator('[data-answer="0"]').click()
        page.locator('[data-action="lock-lens"]').click()
        assert '已看過這個角度' in page.locator('.scene-neutral-feedback').inner_text()
        assert page.locator('[data-result]').count() == 0
        page.locator('[data-action="next-lens"]').click()
    page.locator('[data-position="0"]').click()
    assert page.locator('[data-action="submit-camera"]').is_disabled()
    page.locator('#scene-blindspot').fill('可能低估公共安全消息的時效。')
    page.locator('[data-action="submit-camera"]').click()
    page.locator('[data-commitment="0"]').click()
    assert page.locator('[data-action="pressure-test"]').is_disabled()
    page.locator('#scene-decision-reason').fill('資料尚未完整，因此先降低版面並訂出更新時間。')
    page.locator('[data-action="pressure-test"]').click()
    assert '這個決定有什麼風險' in page.locator('.scene-pressure').inner_text()
    page.locator('[data-action="hold-commitment"]').click()
    page.wait_for_selector('.mode-complete__report')
    assert '六個角度' in page.locator('#complete-title').inner_text()
    page.screenshot(path=str(SCREENS / '03-scene-complete.png'), full_page=True)
    page.locator('[data-action="select"]').last.click()

    choose(page, 'expedition')
    finish_graded(page, ['B', 'B', 'B'])
    assert '校準' in page.locator('#complete-title').inner_text()
    page.screenshot(path=str(SCREENS / '04-expedition-complete.png'), full_page=True)
    page.locator('[data-action="select"]').last.click()

    choose(page, 'detective')
    finish_graded(page, ['A', 'B'])
    assert '第一步的線索' in page.locator('#complete-title').inner_text()
    page.screenshot(path=str(SCREENS / '05-detective-complete.png'), full_page=True)
    page.locator('[data-action="select"]').last.click()

    profile = page.evaluate("JSON.parse(localStorage.getItem('critical-thinking-for-humans.casebook.v3'))")
    assert profile['version'] == 3
    assert set(profile['dailyModes'].values().__iter__().__next__()) == {'drill', 'scene', 'expedition', 'detective'}
    assert profile['streak'] == 1
    assert all(profile['modeCompletions'][mode] == 1 for mode in ['drill', 'scene', 'expedition', 'detective'])
    assert len(profile['completedSessions']) == 4
    assert not any('資料尚未完整' in str(value) for value in profile.values())

    page.locator('[data-action="audio-settings"]').click()
    page.wait_for_selector('#audio-title')
    page.locator('#music-volume').fill('0.48')
    assert page.locator('.audio-volume output').inner_text() == '48%'
    page.locator('.audio-dialog [data-action="close"]').click()
    assert any(url.endswith('gaslight-inquiry.mp3') and status == 200 for url, status in responses), responses

    for width, height, name in [
        (320, 568, 'mobile-320'),
        (390, 844, 'mobile-390'),
        (768, 1024, 'tablet'),
        (844, 390, 'landscape'),
        (2560, 1440, 'wide'),
    ]:
        probe = context.new_page()
        probe.set_viewport_size({'width': width, 'height': height})
        probe.goto(f'{BASE_URL}?lang=en')
        probe.evaluate('localStorage.clear()')
        probe.reload()
        probe.wait_for_selector('.domain-grid')
        assert_no_overflow(probe)
        assert_readable_text(probe)
        assert_no_clipped_controls(probe)
        assert_touch_targets(probe)
        probe.screenshot(path=str(SCREENS / f'05-domain-gate-{name}.png'), full_page=True)
        choose_domain(probe, 'all')
        probe.wait_for_selector('.mode-choice-card')
        assert_no_overflow(probe)
        assert_readable_text(probe)
        assert_no_clipped_controls(probe)
        assert_touch_targets(probe)
        probe.screenshot(path=str(SCREENS / f'06-{name}.png'), full_page=True)
        choose(probe, 'scene')
        assert_no_overflow(probe)
        assert_readable_text(probe)
        assert_no_clipped_controls(probe)
        probe.close()

    browser.close()

    unexpected_http_errors = [
        (url, status)
        for url, status in responses
        if status >= 400 and not (status == 404 and url.endswith('/api/daily'))
    ]
    if unexpected_http_errors:
        errors.append(f'unexpected HTTP responses: {unexpected_http_errors}')
    if errors:
        raise AssertionError('\n'.join(errors))

print(f'PASS screenshots={SCREENS}')
