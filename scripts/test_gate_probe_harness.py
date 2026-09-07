"""Exercise the probe harness with an isolated fake CLI; never call a model."""

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path

import pytest


REPO = Path(__file__).resolve().parent.parent
ITEM = """PROBE-ITEM-START
An audited census found that 12 of 20 branches met the target.
The report concludes that 60 percent of these branches met it.
Which offered objection undermines that conclusion?
A. The report does not predict next year's results.
B. The target does not measure every possible outcome.
C. Other organizations have different branch totals.
D. The report does not explain why a branch met the target.
E. None of these objections undermines the stated conclusion.
PROBE-ITEM-END
"""


def author_response(key="E", structure="argument_sound"):
    return ITEM + f"PROBE-KEY: {key}\nPROBE-STRUCTURE: {structure}\n"


@pytest.fixture()
def harness(tmp_path):
    root = tmp_path / "repo"
    (root / "scripts").mkdir(parents=True)
    (root / "shared").mkdir()
    script = root / "scripts/gate_probe_harness.sh"
    shutil.copy(REPO / "scripts/gate_probe_harness.sh", script)
    shutil.copy(REPO / "shared/structures.md", root / "shared/structures.md")

    fake_bin = tmp_path / "bin"
    fake_bin.mkdir()
    fake_cli = fake_bin / "claude"
    fake_cli.write_text(
        '#!/bin/sh\nexec "$HARNESS_TEST_PYTHON" "$HARNESS_TEST_DRIVER" "$@"\n',
        encoding="utf-8",
    )
    fake_cli.chmod(0o755)
    driver = tmp_path / "fake_claude.py"
    driver.write_text(
        """import json
import os
import sys
from pathlib import Path

log = Path(os.environ['HARNESS_TEST_LOG'])
calls = log.read_text().splitlines() if log.exists() else []
root = Path(os.environ['HARNESS_TEST_ROOT'])
entry = {
    'args': sys.argv[1:],
    'author_artifacts': [str(p) for p in root.glob(
        'dist/gate-runs/*/key-agreement-*-generate.md')],
}
with log.open('a') as stream:
    stream.write(json.dumps(entry) + '\\n')
responses = json.loads(Path(os.environ['HARNESS_TEST_RESPONSES']).read_text())
if len(calls) >= len(responses):
    sys.exit('unexpected fake CLI invocation')
print(responses[len(calls)])
""",
        encoding="utf-8",
    )

    def run(responses, *args):
        response_path = tmp_path / "responses.json"
        response_path.write_text(json.dumps(responses), encoding="utf-8")
        log = tmp_path / "calls.jsonl"
        env = os.environ.copy()
        env.update({
            "PATH": str(fake_bin) + os.pathsep + env.get("PATH", ""),
            "HARNESS_TEST_PYTHON": sys.executable,
            "HARNESS_TEST_DRIVER": str(driver),
            "HARNESS_TEST_RESPONSES": str(response_path),
            "HARNESS_TEST_LOG": str(log),
            "HARNESS_TEST_ROOT": str(root),
        })
        result = subprocess.run(
            ["bash", str(script), *args], cwd=root, env=env,
            capture_output=True, text=True, timeout=15, check=False,
        )
        assert result.returncode == 0, result.stdout + result.stderr
        calls = [json.loads(line) for line in log.read_text().splitlines()]
        summaries = list(root.glob("dist/gate-runs/*/summary.md"))
        assert len(summaries) == 1
        return calls, summaries[0].read_text(), result.stdout

    return run


def flag_value(args, flag):
    return args[args.index(flag) + 1]


def test_sound_item_is_accepted_and_blind_prompt_is_neutral(harness):
    calls, summary, _ = harness(
        [author_response(), "ANSWER: E\nSTRUCTURE: argument_sound"],
        "--probe", "key-agreement", "--model", "requested-model", "--items", "1",
    )
    assert "| 1 | E | E | AGREE | argument_sound | argument_sound | match |" in summary
    assert "not independent cross-model agreement or validity" in summary
    assert len(calls) == 2
    for call in calls:
        args = call["args"]
        assert "--no-session-persistence" in args
        assert "--strict-mcp-config" in args
        assert json.loads(flag_value(args, "--mcp-config")) == {"mcpServers": {}}
        assert flag_value(args, "--model") == "requested-model"
    author_args, blind_args = calls[0]["args"], calls[1]["args"]
    assert flag_value(author_args, "--tools") == "Skill,Read,Glob,Grep"
    assert flag_value(author_args, "--allowedTools") == "Skill,Read,Glob,Grep"
    assert flag_value(blind_args, "--tools") == ""
    assert "--disable-slash-commands" in blind_args
    assert "--allowedTools" not in blind_args
    prompt = flag_value(blind_args, "-p")
    assert "Do not assume the argument is flawed" in prompt
    assert "argument_sound" in prompt
    assert "PROBE-KEY" not in prompt and "PROBE-STRUCTURE" not in prompt
    assert calls[1]["author_artifacts"] == []


@pytest.mark.parametrize("key", ["Q", "AA", "A or B", "A\nPROBE-KEY: B"])
def test_invalid_author_key_never_reaches_blind_solver(harness, key):
    calls, summary, _ = harness(
        [author_response(key=key)], "--probe", "key-agreement",
    )
    assert len(calls) == 1
    assert "| ERROR-unparsed |" in summary
    assert "| AGREE |" not in summary


@pytest.mark.parametrize("key", ["Q", "AA", "A or B", "E\nANSWER: A"])
def test_invalid_blind_key_cannot_report_agreement(harness, key):
    calls, summary, _ = harness(
        [author_response(), f"ANSWER: {key}\nSTRUCTURE: argument_sound"],
        "--probe", "key-agreement",
    )
    assert len(calls) == 2
    assert "| ERROR-unparsed |" in summary
    assert "| AGREE |" not in summary


@pytest.mark.parametrize("response", [
    author_response().replace("PROBE-ITEM-END\n", ""),
    author_response().replace("PROBE-ITEM-END", "PROBE-KEY: E\nPROBE-ITEM-END"),
])
def test_answer_metadata_inside_item_never_reaches_blind_solver(harness, response):
    calls, summary, _ = harness([response], "--probe", "key-agreement")
    assert len(calls) == 1
    assert "| ERROR-unparsed |" in summary


def test_default_probes_remain_advisory_and_restrict_tools(harness):
    calls, summary, _ = harness(["case generated", "review me", "review me", "review me", "review me"])
    assert len(calls) == 5
    assert "| gate9F-generation-silence | FAIL-mechanical |" in summary
    assert summary.count("| NEEDS-HUMAN-REVIEW |") == 4
    assert "| PASS |" not in summary
    for call in calls:
        assert "--no-session-persistence" in call["args"]
        assert flag_value(call["args"], "--tools") == "Skill,Read,Glob,Grep"
