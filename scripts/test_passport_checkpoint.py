"""Multi-process tests for the local Passport checkpoint helper."""

import json
import os
import stat
import subprocess
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
from typing import Dict, Optional


SCRIPT = Path(__file__).with_name("passport_checkpoint.sh")
LOCK_NAME = ".events.write-lock"


def write_rename_preload(
    path: Path,
    body: str,
) -> None:
    path.write_text(
        "const fs = require('node:fs');\n"
        "const { syncBuiltinESMExports } = require('node:module');\n"
        f"{body}\n"
        "syncBuiltinESMExports();\n"
    )


def write_slow_rename_preload(path: Path) -> None:
    write_rename_preload(
        path,
        "const originalRenameSync = fs.renameSync;\n"
        "const waitArray = new Int32Array(new SharedArrayBuffer(4));\n"
        "fs.renameSync = (source, target) => {\n"
        "  if (target === process.env.PASSPORT_TEST_RENAME_TARGET) {\n"
        "    fs.writeFileSync(process.env.PASSPORT_TEST_RENAME_ENTERED, '');\n"
        "    while (!fs.existsSync(process.env.PASSPORT_TEST_RENAME_RELEASE)) {\n"
        "      Atomics.wait(waitArray, 0, 0, 50);\n"
        "    }\n"
        "  }\n"
        "  return originalRenameSync(source, target);\n"
        "};",
    )


def preload_env(preload: Path, **extra: str) -> Dict[str, str]:
    current = os.environ.get("NODE_OPTIONS", "")
    options = f"{current} --require={preload}".strip()
    return {"NODE_OPTIONS": options, **extra}


def invoke(
    data_dir: Path,
    command: str,
    batch: Optional[bytes] = None,
    timeout: int = 5,
    generation: Optional[str] = None,
    env: Optional[Dict[str, str]] = None,
) -> subprocess.CompletedProcess:
    command_env = os.environ.copy()
    if env:
        command_env.update(env)
    args = [
        str(SCRIPT),
        "--data-dir",
        str(data_dir),
        "--lock-timeout",
        str(timeout),
    ]
    if generation is not None:
        args.extend(["--generation", generation])
    args.append(command)
    return subprocess.run(
        args,
        input=batch,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=command_env,
        check=False,
    )


def read_generation(data_dir: Path, timeout: int = 5) -> str:
    result = invoke(data_dir, "generation", timeout=timeout)
    assert result.returncode == 0, result.stderr.decode()
    token = result.stdout.decode().strip()
    assert token
    return token


def read_events(
    data_dir: Path,
    generation: str,
    timeout: int = 5,
    env: Optional[Dict[str, str]] = None,
) -> subprocess.CompletedProcess:
    return invoke(
        data_dir,
        "read",
        timeout=timeout,
        generation=generation,
        env=env,
    )


def append(
    data_dir: Path,
    batch: bytes,
    generation: Optional[str] = None,
    timeout: int = 5,
    env: Optional[Dict[str, str]] = None,
) -> subprocess.CompletedProcess:
    token = generation if generation is not None else read_generation(data_dir)
    return invoke(
        data_dir,
        "append",
        batch,
        timeout=timeout,
        generation=token,
        env=env,
    )


def wait_for_path(path: Path, timeout: float = 5.0) -> None:
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        if path.exists():
            return
        time.sleep(0.01)
    raise AssertionError(f"timed out waiting for {path}")


def assert_runtime_preflight_is_fail_closed(
    data_dir: Path,
    result: subprocess.CompletedProcess,
    original: bytes,
) -> None:
    assert result.returncode == 69
    assert b"Node.js 22+" in result.stderr
    assert b"synthetic-private-payload" not in result.stderr
    assert b"synthetic-private-payload" not in result.stdout
    assert (data_dir / "events.jsonl").read_bytes() == original
    assert not (data_dir / "generation").exists()
    assert not (data_dir / LOCK_NAME).exists()
    assert not list(data_dir.glob(".*.tmp.*"))


def test_missing_node_runtime_fails_closed_before_touching_passport(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    original = b'{"existing":true}\n'
    (data_dir / "events.jsonl").write_bytes(original)
    empty_path = tmp_path / "empty-path"
    empty_path.mkdir()

    result = invoke(
        data_dir,
        "append",
        b'{"synthetic-private-payload":true}\n',
        generation="00000000-0000-4000-8000-000000000000",
        env={"PATH": str(empty_path)},
    )

    assert_runtime_preflight_is_fail_closed(data_dir, result, original)


def test_old_node_runtime_fails_closed_before_touching_passport(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    original = b'{"existing":true}\n'
    (data_dir / "events.jsonl").write_bytes(original)
    fake_bin = tmp_path / "fake-bin"
    fake_bin.mkdir()
    fake_node = fake_bin / "node"
    fake_node.write_text(
        "#!/bin/sh\n"
        "if [ \"$1\" = \"-p\" ]; then printf '20\\n'; exit 0; fi\n"
        "exit 99\n"
    )
    fake_node.chmod(0o755)

    result = invoke(
        data_dir,
        "append",
        b'{"synthetic-private-payload":true}\n',
        generation="00000000-0000-4000-8000-000000000000",
        env={"PATH": str(fake_bin)},
    )

    assert_runtime_preflight_is_fail_closed(data_dir, result, original)


def test_cold_start_writes_batch_with_private_permissions(tmp_path):
    data_dir = tmp_path / "new-passport"
    batch = b'{"batch":"cold","seq":1}\n{"batch":"cold","seq":2}\n'

    generation = read_generation(data_dir)
    result = append(data_dir, batch, generation)

    assert result.returncode == 0, result.stderr.decode()
    events = data_dir / "events.jsonl"
    assert events.read_bytes() == batch
    assert stat.S_IMODE(data_dir.stat().st_mode) == 0o700
    assert stat.S_IMODE(events.stat().st_mode) == 0o600
    assert stat.S_IMODE((data_dir / "generation").stat().st_mode) == 0o600
    assert not (data_dir / LOCK_NAME).exists()


def test_locked_read_returns_exact_snapshot_and_missing_log_is_empty(tmp_path):
    data_dir = tmp_path / "passport"
    generation = read_generation(data_dir)

    missing = read_events(data_dir, generation)
    assert missing.returncode == 0, missing.stderr.decode()
    assert missing.stdout == b""
    assert not (data_dir / "events.jsonl").exists()

    snapshot = b'{"valid":true}\n{"malformed":\n'
    (data_dir / "events.jsonl").write_bytes(snapshot)
    existing = read_events(data_dir, generation)

    assert existing.returncode == 0, existing.stderr.decode()
    assert existing.stdout == snapshot
    assert not (data_dir / LOCK_NAME).exists()


def test_existing_data_directory_is_tightened_to_private_permissions(tmp_path):
    data_dir = tmp_path / "existing-passport"
    data_dir.mkdir(mode=0o755)

    result = append(data_dir, b'{"private":true}\n')

    assert result.returncode == 0, result.stderr.decode()
    assert stat.S_IMODE(data_dir.stat().st_mode) == 0o700


def test_real_concurrent_batches_are_complete_and_adjacent(tmp_path):
    data_dir = tmp_path / "passport"
    writer_count = 16
    barrier = threading.Barrier(writer_count)
    generation = read_generation(data_dir)

    def write_batch(writer_id: int) -> subprocess.CompletedProcess:
        batch = (
            json.dumps({"writer": writer_id, "seq": 1}, separators=(",", ":"))
            + "\n"
            + json.dumps({"writer": writer_id, "seq": 2}, separators=(",", ":"))
            + "\n"
        ).encode()
        barrier.wait()
        return append(
            data_dir, batch, generation=generation, timeout=20
        )

    with ThreadPoolExecutor(max_workers=writer_count) as pool:
        results = list(pool.map(write_batch, range(writer_count)))

    assert all(result.returncode == 0 for result in results), [
        result.stderr.decode() for result in results if result.returncode
    ]
    rows = [
        json.loads(line)
        for line in (data_dir / "events.jsonl").read_text().splitlines()
    ]
    assert len(rows) == writer_count * 2
    assert {row["writer"] for row in rows} == set(range(writer_count))
    for writer_id in range(writer_count):
        positions = [
            index for index, row in enumerate(rows) if row["writer"] == writer_id
        ]
        assert positions[1] == positions[0] + 1
        assert [rows[index]["seq"] for index in positions] == [1, 2]


def test_held_lock_times_out_without_changes_or_stale_reclaim(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    passport = data_dir / "passport.md"
    original_events = b'{"existing":true}\n'
    original_passport = b"# existing view\n"
    events.write_bytes(original_events)
    passport.write_bytes(original_passport)
    generation = read_generation(data_dir)
    lock = data_dir / LOCK_NAME
    lock.mkdir()
    (lock / "owner").write_text("foreign-owner\n")

    append_result = append(
        data_dir,
        b'{"new":true}\n',
        generation=generation,
        timeout=0,
    )
    delete_result = invoke(data_dir, "delete", timeout=0)

    assert append_result.returncode == 75
    assert delete_result.returncode == 75
    assert events.read_bytes() == original_events
    assert passport.read_bytes() == original_passport
    assert (lock / "owner").read_text() == "foreign-owner\n"

    (lock / "owner").unlink()
    lock.rmdir()
    retry = append(
        data_dir, b'{"new":true}\n', generation=generation
    )
    assert retry.returncode == 0, retry.stderr.decode()
    assert events.read_bytes() == original_events + b'{"new":true}\n'


def test_waiting_writer_retries_after_lock_is_released(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    generation = read_generation(data_dir)
    lock = data_dir / LOCK_NAME
    lock.mkdir()
    (lock / "owner").write_text("temporary-holder\n")

    process = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--lock-timeout",
            "3",
            "--generation",
            generation,
            "append",
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    assert process.stdin is not None
    process.stdin.write(b'{"after":"wait"}\n')
    process.stdin.close()
    time.sleep(0.2)
    (lock / "owner").unlink()
    lock.rmdir()
    returncode = process.wait(timeout=5)
    stderr = process.stderr.read() if process.stderr is not None else b""

    assert returncode == 0, stderr.decode()
    assert (data_dir / "events.jsonl").read_bytes() == b'{"after":"wait"}\n'


def test_waiting_writer_rereads_only_after_it_acquires_lock(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    initial = b'{"writer":"initial"}\n'
    intervening = b'{"writer":"lock-holder"}\n'
    pending = b'{"writer":"waiter"}\n'
    events.write_bytes(initial)
    generation = read_generation(data_dir)
    lock = data_dir / LOCK_NAME
    lock.mkdir()
    (lock / "owner").write_text("active-holder\n")

    waiter = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--lock-timeout",
            "3",
            "--generation",
            generation,
            "append",
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    assert waiter.stdin is not None
    waiter.stdin.write(pending)
    waiter.stdin.close()
    time.sleep(0.5)
    assert waiter.poll() is None

    # Simulate the current lock owner completing its checkpoint while the
    # second writer is blocked. A pre-lock read would lose this line.
    events.write_bytes(initial + intervening)
    (lock / "owner").unlink()
    lock.rmdir()
    returncode = waiter.wait(timeout=5)
    stderr = waiter.stderr.read() if waiter.stderr is not None else b""

    assert returncode == 0, stderr.decode()
    assert events.read_bytes() == initial + intervening + pending


def test_malformed_unterminated_tail_is_preserved_and_separated(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    malformed = b'{"old":1}\n{"broken":'
    events.write_bytes(malformed)

    result = append(data_dir, b'{"new":2}\n')

    assert result.returncode == 0, result.stderr.decode()
    assert events.read_bytes() == malformed + b'\n{"new":2}\n'


def test_failed_atomic_replace_keeps_original_and_releases_lock(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    original = b'{"existing":true}\n'
    events.write_bytes(original)
    generation = read_generation(data_dir)
    preload = tmp_path / "fail-rename.cjs"
    write_rename_preload(
        preload,
        "fs.renameSync = () => {\n"
        "  const error = new Error('forced rename failure');\n"
        "  error.code = 'EIO';\n"
        "  throw error;\n"
        "};",
    )

    result = append(
        data_dir,
        b'{"lost":false}\n',
        generation=generation,
        env=preload_env(preload),
    )

    assert result.returncode == 74
    assert events.read_bytes() == original
    assert not (data_dir / LOCK_NAME).exists()
    assert list(data_dir.glob(".events.*")) == []

    retry = append(
        data_dir,
        b'{"lost":false}\n',
        generation=generation,
    )
    assert retry.returncode == 0, retry.stderr.decode()
    assert events.read_bytes() == original + b'{"lost":false}\n'


def test_delete_removes_both_files_under_the_lock(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    (data_dir / "events.jsonl").write_text('{"existing":true}\n')
    (data_dir / "passport.md").write_text("# cached view\n")

    result = invoke(data_dir, "delete")

    assert result.returncode == 0, result.stderr.decode()
    assert not (data_dir / "events.jsonl").exists()
    assert not (data_dir / "passport.md").exists()
    assert not (data_dir / LOCK_NAME).exists()


def test_delete_linearizes_after_an_inflight_append(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    (data_dir / "events.jsonl").write_text('{"existing":true}\n')
    (data_dir / "passport.md").write_text("# cached view\n")
    generation = read_generation(data_dir)

    entered = tmp_path / "rename-entered"
    release = tmp_path / "rename-release"
    preload = tmp_path / "slow-rename.cjs"
    write_slow_rename_preload(preload)
    append_env = preload_env(
        preload,
        PASSPORT_TEST_RENAME_TARGET=str(data_dir / "events.jsonl"),
        PASSPORT_TEST_RENAME_ENTERED=str(entered),
        PASSPORT_TEST_RENAME_RELEASE=str(release),
    )

    append_process = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--lock-timeout",
            "5",
            "--generation",
            generation,
            "append",
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=append_env,
    )
    assert append_process.stdin is not None
    append_process.stdin.write(b'{"appended":true}\n')
    append_process.stdin.close()
    wait_for_path(entered)

    delete = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--lock-timeout",
            "5",
            "delete",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(0.2)
    assert delete.poll() is None

    release.touch()
    append_returncode = append_process.wait(timeout=5)
    delete_stdout, delete_stderr = delete.communicate(timeout=5)
    append_stderr = (
        append_process.stderr.read()
        if append_process.stderr is not None
        else b""
    )

    assert append_returncode == 0, append_stderr.decode()
    assert delete.returncode == 0, (delete_stdout + delete_stderr).decode()
    assert not (data_dir / "events.jsonl").exists()
    assert not (data_dir / "passport.md").exists()
    assert not (data_dir / LOCK_NAME).exists()


def test_sigkill_residue_is_removed_by_delete_after_manual_lock_recovery(
    tmp_path,
):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    passport = data_dir / "passport.md"
    events.write_text('{"existing":true}\n')
    passport.write_text("# cached view\n")
    generation = read_generation(data_dir)
    entered = tmp_path / "rename-entered"
    release = tmp_path / "never-released"
    preload = tmp_path / "slow-rename.cjs"
    write_slow_rename_preload(preload)
    process = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--generation",
            generation,
            "append",
        ],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={
            **os.environ,
            **preload_env(
                preload,
                PASSPORT_TEST_RENAME_TARGET=str(events),
                PASSPORT_TEST_RENAME_ENTERED=str(entered),
                PASSPORT_TEST_RENAME_RELEASE=str(release),
            ),
        },
    )
    assert process.stdin is not None
    process.stdin.write(b'{"pending":"private"}\n')
    process.stdin.close()
    wait_for_path(entered)

    process.kill()
    process.wait(timeout=5)
    lock = data_dir / LOCK_NAME
    assert lock.exists()
    assert list(data_dir.glob(".events.jsonl.tmp.*"))

    (lock / "owner").unlink()
    lock.rmdir()
    deleted = invoke(data_dir, "delete")

    assert deleted.returncode == 0, deleted.stderr.decode()
    assert not events.exists()
    assert not passport.exists()
    assert not list(data_dir.glob(".events.jsonl.tmp.*"))
    assert not lock.exists()


def test_empty_or_non_object_batch_is_rejected_before_locking(tmp_path):
    data_dir = tmp_path / "passport"
    generation = read_generation(data_dir)

    empty = append(data_dir, b"", generation=generation)
    array = append(data_dir, b"[]\n", generation=generation)

    assert empty.returncode == 65
    assert array.returncode == 65
    assert not (data_dir / "events.jsonl").exists()
    assert not (data_dir / LOCK_NAME).exists()


def test_malformed_mixed_batch_is_rejected_then_retries_cleanly(tmp_path):
    data_dir = tmp_path / "passport"
    generation = read_generation(data_dir)
    seed = b'{"seed":true}\n'
    seeded = append(data_dir, seed, generation=generation)
    assert seeded.returncode == 0, seeded.stderr.decode()

    malformed = b'{"valid":true}\n{"summary":}\n'
    rejected = append(data_dir, malformed, generation=generation)

    assert rejected.returncode == 65
    assert (data_dir / "events.jsonl").read_bytes() == seed

    retry = append(data_dir, b'{"valid":true}\n', generation=generation)
    assert retry.returncode == 0, retry.stderr.decode()
    assert (data_dir / "events.jsonl").read_bytes() == (
        seed + b'{"valid":true}\n'
    )


def test_delete_cleans_orphan_helper_temps(tmp_path):
    data_dir = tmp_path / "passport"
    generation = read_generation(data_dir)
    written = append(
        data_dir, b'{"private":"synthetic"}\n', generation=generation
    )
    assert written.returncode == 0, written.stderr.decode()
    residues = [
        data_dir
        / ".events.jsonl.tmp.1234.00000000-0000-4000-8000-000000000001",
        data_dir
        / ".generation.tmp.5678.00000000-0000-4000-8000-000000000002",
    ]
    for residue in residues:
        residue.write_text("synthetic private residue\n")
    unrelated = [
        data_dir / ".events.batch.ABC123",
        data_dir / ".events.jsonl.tmp.backup",
        data_dir / ".generation.tmp.manual",
    ]
    for path in unrelated:
        path.write_text("unrelated fixture\n")

    result = invoke(data_dir, "delete")

    assert result.returncode == 0, result.stderr.decode()
    assert not (data_dir / "events.jsonl").exists()
    assert all(not residue.exists() for residue in residues)
    assert all(path.read_text() == "unrelated fixture\n" for path in unrelated)


def test_delete_generation_blocks_pre_delete_pending_batch(tmp_path):
    data_dir = tmp_path / "passport"
    old_generation = read_generation(data_dir)
    first = append(
        data_dir, b'{"before":"delete"}\n', generation=old_generation
    )
    assert first.returncode == 0, first.stderr.decode()

    deleted = invoke(data_dir, "delete")
    assert deleted.returncode == 0, deleted.stderr.decode()
    assert not (data_dir / "events.jsonl").exists()

    stale = append(
        data_dir, b'{"stale":"pending"}\n', generation=old_generation
    )
    assert stale.returncode == 76
    assert b"PASSPORT_GENERATION_MISMATCH" in stale.stderr
    assert not (data_dir / "events.jsonl").exists()
    stale_read = read_events(data_dir, old_generation)
    assert stale_read.returncode == 76
    assert b"PASSPORT_GENERATION_MISMATCH" in stale_read.stderr
    assert stale_read.stdout == b""

    new_generation = read_generation(data_dir)
    assert new_generation != old_generation
    fresh = append(
        data_dir, b'{"after":"delete"}\n', generation=new_generation
    )
    assert fresh.returncode == 0, fresh.stderr.decode()
    assert (data_dir / "events.jsonl").read_bytes() == b'{"after":"delete"}\n'


def test_relative_data_directory_is_rejected(tmp_path):
    result = subprocess.run(
        [str(SCRIPT), "--data-dir", "relative-passport", "delete"],
        cwd=tmp_path,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )

    assert result.returncode == 64
    assert not (tmp_path / "relative-passport").exists()


def test_explicit_empty_data_directory_never_falls_back_to_home(tmp_path):
    fake_home = tmp_path / "home"
    default_data = fake_home / ".ct-gym"
    default_data.mkdir(parents=True)
    events = default_data / "events.jsonl"
    original = b'{"must":"survive"}\n'
    events.write_bytes(original)
    command_env = {**os.environ, "HOME": str(fake_home)}

    separate = subprocess.run(
        [str(SCRIPT), "--data-dir", "", "delete"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=command_env,
        check=False,
    )
    equals = subprocess.run(
        [str(SCRIPT), "--data-dir=", "delete"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env=command_env,
        check=False,
    )

    assert separate.returncode == 64
    assert equals.returncode == 64
    assert events.read_bytes() == original
    assert not (default_data / "generation").exists()
    assert not (default_data / LOCK_NAME).exists()


def test_data_directory_symlink_is_rejected_before_delete(tmp_path):
    target = tmp_path / "target"
    target.mkdir()
    events = target / "events.jsonl"
    original = b'{"must":"survive"}\n'
    events.write_bytes(original)
    data_dir = tmp_path / "passport-link"
    data_dir.symlink_to(target, target_is_directory=True)

    result = invoke(data_dir, "delete")

    assert result.returncode == 64
    assert events.read_bytes() == original
    assert not (target / "generation").exists()
    assert not (target / LOCK_NAME).exists()


def test_events_symlink_is_rejected_without_touching_target(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    target = tmp_path / "outside-events.jsonl"
    original = b'{"outside":true}\n'
    target.write_bytes(original)
    (data_dir / "events.jsonl").symlink_to(target)
    generation = read_generation(data_dir)

    read_result = read_events(data_dir, generation)
    append_result = append(
        data_dir,
        b'{"must_not_write":true}\n',
        generation=generation,
    )

    assert read_result.returncode == 74
    assert read_result.stdout == b""
    assert append_result.returncode == 74
    assert target.read_bytes() == original
    assert (data_dir / "events.jsonl").is_symlink()
    assert not (data_dir / LOCK_NAME).exists()


def test_events_fifo_is_rejected_without_blocking(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    generation = read_generation(data_dir)
    os.mkfifo(data_dir / "events.jsonl")

    result = read_events(data_dir, generation)

    assert result.returncode == 74
    assert result.stdout == b""
    assert not (data_dir / LOCK_NAME).exists()


def test_read_linearizes_before_delete_when_it_holds_the_lock(tmp_path):
    data_dir = tmp_path / "passport"
    data_dir.mkdir()
    events = data_dir / "events.jsonl"
    snapshot = b'{"visible":"before-delete"}\n'
    events.write_bytes(snapshot)
    (data_dir / "passport.md").write_text("# cached view\n")
    generation = read_generation(data_dir)
    entered = tmp_path / "open-entered"
    release = tmp_path / "open-release"
    preload = tmp_path / "slow-open.cjs"
    write_rename_preload(
        preload,
        "const originalOpenSync = fs.openSync;\n"
        "const waitArray = new Int32Array(new SharedArrayBuffer(4));\n"
        "fs.openSync = (target, ...args) => {\n"
        "  if (target === process.env.PASSPORT_TEST_OPEN_TARGET) {\n"
        "    fs.writeFileSync(process.env.PASSPORT_TEST_OPEN_ENTERED, '');\n"
        "    while (!fs.existsSync(process.env.PASSPORT_TEST_OPEN_RELEASE)) {\n"
        "      Atomics.wait(waitArray, 0, 0, 50);\n"
        "    }\n"
        "  }\n"
        "  return originalOpenSync(target, ...args);\n"
        "};",
    )
    read_process = subprocess.Popen(
        [
            str(SCRIPT),
            "--data-dir",
            str(data_dir),
            "--generation",
            generation,
            "read",
        ],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        env={
            **os.environ,
            **preload_env(
                preload,
                PASSPORT_TEST_OPEN_TARGET=str(events),
                PASSPORT_TEST_OPEN_ENTERED=str(entered),
                PASSPORT_TEST_OPEN_RELEASE=str(release),
            ),
        },
    )
    wait_for_path(entered)

    delete_process = subprocess.Popen(
        [str(SCRIPT), "--data-dir", str(data_dir), "delete"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    time.sleep(0.2)
    assert delete_process.poll() is None

    release.touch()
    read_stdout, read_stderr = read_process.communicate(timeout=5)
    delete_stdout, delete_stderr = delete_process.communicate(timeout=5)

    assert read_process.returncode == 0, read_stderr.decode()
    assert read_stdout == snapshot
    assert delete_process.returncode == 0, (
        delete_stdout + delete_stderr
    ).decode()
    assert not events.exists()
    assert not (data_dir / "passport.md").exists()
    assert not (data_dir / LOCK_NAME).exists()
