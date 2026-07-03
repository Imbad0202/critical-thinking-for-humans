# Architecture (v1.2.0)

How `critical-thinking-for-humans` is put together: what loads when, how a
session routes to one of four modes, how the thirteen reasoning structures are
organized, how detective generates a case without leaking its answer key, how
the on-disk passport records longitudinal patterns, and how the three build
targets relate.

This document is the visual map; the canonical behavior lives in `SKILL.md`,
`modes/`, and `shared/`. Where this doc and a runtime file disagree, the runtime
file wins.

---

## How to read

- **Stance** is the epistemic posture a mode takes: *judge* (a defensible answer
  exists, wrong is called wrong), *Socratic* (never ranks interpretations),
  *guide* (audits terrain you are not expected to conquer), or *guide-and-judge*
  (judges the conclusion, guides the process).
- **The floor** is the stance-neutral base loaded on every session before any
  mode: the fourteen redlines, shared scaffolding, and the canonical structures.
- **The passport** is a local-only record at `~/.ct-gym/` — it never leaves your
  machine.

---

## 1. Session bootstrap & mode routing

Every session loads the same floor first, then routes. Only one mode file is
loaded per session.

```mermaid
flowchart TD
    Start([Session start]) --> Floor

    subgraph Floor["The floor — always loaded first"]
        RL[shared/redlines.md<br/>14 redlines]
        SC[shared/scaffolding.md<br/>4-step reveal · safe words · stuck]
        ST[shared/structures.md<br/>13 structures · frame palette]
    end

    Floor --> Returning{Returning user?<br/>read ~/.ct-gym}
    Returning -- "no" --> Intake[Intake — 3 choices:<br/>field · support level · feedback style]
    Returning -- "yes" --> Confirm[One-line profile confirm]
    Intake --> Route
    Confirm --> Route

    Route{Mode?}
    Route -- "drill" --> Drill[modes/drill.md<br/>JUDGE]
    Route -- "scene / byom / 話術辨識" --> Scene[modes/scene.md<br/>SOCRATIC]
    Route -- "expedition / impossible" --> Exp[modes/expedition.md<br/>GUIDE]
    Route -- "detective / 查案 / 破案" --> Det[modes/detective.md<br/>GUIDE-AND-JUDGE]

    Route -. "domain doesn't fit drill" .-> Honest[Coach stops, says why,<br/>routes to the mode that fits]
    Honest -. " " .-> Scene
```

Safe words (`stuck`, `hint`, `enough for today`, `forget this one`) are
announced once at start and honored in every mode (redline 8).

---

## 2. The four modes × stance

The modes are deliberately different epistemic instruments. The split is the
point: a gym that trains reasoning must not pretend "which symphony is better"
and "does this study's evidence support its claim" have the same shape.

```mermaid
flowchart LR
    subgraph J["JUDGE — a defensible answer exists"]
        D["drill<br/>single-answer items<br/>commit before analysis<br/>structure named on reveal"]
    end
    subgraph S["SOCRATIC — never ranks interpretations"]
        SC["scene<br/>6 frames, all steelmanned<br/>camera turns on your reading<br/>+ fallacy-recognition track"]
    end
    subgraph G["GUIDE — audit terrain you can't conquer"]
        E["expedition<br/>verified packs only<br/>audit / climb / forecast<br/>never improvised"]
    end
    subgraph GJ["GUIDE-AND-JUDGE"]
        DT["detective<br/>runtime multi-layer case<br/>judges the flaw, guides the process<br/>key chain carried downward"]
    end

    J -. "redline 1: adjudicate reasoning,<br/>never rank value frames" .- S
    G -. "verified ground truth" .- GJ
```

| Mode | Material source | Judges? | Closes with |
|------|-----------------|---------|-------------|
| **drill** | generated items, your field | yes (one answer) | structure named, added to per-structure record |
| **scene** | synthetic **or** your own (BYOM) | no (frames never ranked) | your committed position vs the strongest objection |
| **expedition** | curated verified packs | yes (against the pack) | breakthrough articulated, role-specific record |
| **detective** | generated case, your field | conclusion yes / process guided | case cracked, key chain = the case's truth |

---

## 3. The thirteen reasoning structures (drill's keying set)

Drill keys on one of thirteen structures. They split three ways — and that split
decides which fields drill can serve natively and which route to scene instead.

```mermaid
flowchart TD
    Structures[13 canonical structures]

    Structures --> Causal["7 causal-inductive"]
    Structures --> Stat["3 statistical<br/>(standard+ only — numeracy gate)"]
    Structures --> Formal["3 formal / inductive"]

    Causal --> C1["necessary_assumption · alternative_cause<br/>reverse_causation · coincidence_timing<br/>sample_selection · proxy_mismatch<br/>evidence_sufficiency"]
    Stat --> S1["base_rate_neglect<br/>regression_to_mean<br/>simpson_paradox"]
    Formal --> F1["circular_reasoning<br/>hasty_generalization<br/>weak_analogy"]
```

Each structure is a transferable shape: once you can see `sample_selection` as a
shape, you catch it in a journal, a news story, or a contract. Naming is what
makes the practice transfer.

---

## 4. Detective generation pipeline (reverse design, keys first)

Detective reverse-designs a case before writing any prose — and the entire
pipeline runs **internally**. The answer key never reaches the visible chat
(generation silence); `Gate 9F` exists to guard exactly this property.

```mermaid
flowchart TD
    subgraph Internal["INTERNAL ONLY — never printed to the user"]
        G0["G0 · stipulate the case frame<br/>claim / success criterion /<br/>decision standard / evidence frame"]
        G1["G1 · main-flaw chain<br/>one structure per layer,<br/>ordered by key dependency"]
        G2["G2 · ablation gate<br/>hide layer N's key →<br/>prove N+1 is underdetermined"]
        G3["G3 · plant eggs (0–N off-path)"]
        G4["G4 · write material per layer"]
        G5["G5 · pre-flight (mechanical + soft)"]
        G6["G6 · record answer key"]
        G0 --> G1 --> G2 --> G3 --> G4 --> G5 --> G6
        G2 -. "ablation fails" .-> Fallback["degrade layers 4→3→2,<br/>or refuse rather than<br/>ship a broken chain"]
    end

    G6 ==> Wall{{"Generation silence —<br/>only the 4 case-frame facts<br/>+ layer 1 cross the wall"}}

    subgraph Visible["VISIBLE — the per-layer loop"]
        Open["Open: case frame + layer 1<br/>(no preamble, no layer count)"]
        Loop["user names the flaw →<br/>unlock → reveal key →<br/>carry key into next layer"]
        Close["final layer's key = the case's truth"]
        Open --> Loop --> Close
    end

    Wall ==> Open
```

The load-bearing rule: **the user names each main flaw; the coach never catches
it for them.** A correct objection the answer key missed is inspected and
honestly confirmed, never auto-ruled a false positive — redline 14 (concede on
the merits: a self-authored key is not authority to defend behind, and the
inspection must tilt against the key, not against the user), reinforcing redline
4's correctness-honesty applied to the user's side.

---

## 5. Passport data flow (local-only)

The passport at `~/.ct-gym/events.jsonl` records process, not grades. Each mode
writes its own process event (drill also emits a `miss_log`), alongside
session-level `profile_set` and `commitment` events; structure hits feed a shared
per-structure record so coverage is unified across modes.

```mermaid
flowchart LR
    subgraph Modes
        D[drill]
        S[scene]
        E[expedition]
        DT[detective]
    end

    D --> EV1["drill_result + miss_log<br/>hit/miss per structure_id"]
    S --> EV2["scene_process: frames raised,<br/>camera turn, closing commitment,<br/>fallacies_examined"]
    E --> EV3["expedition_process: role,<br/>disciplines fired, breakthrough"]
    DT --> EV4["detective_process: layers solved,<br/>eggs found, false positives,<br/>structures_hit"]

    EV1 --> Log[(~/.ct-gym/events.jsonl)]
    EV2 --> Log
    EV3 --> Log
    EV4 --> Log
    EV4 -. "structures_hit" .-> EV1

    Log --> Mirror["Longitudinal mirror<br/>'4 of your last 5 misses<br/>are sample_selection'<br/>— shown in summary, cited,<br/>never an unprompted callout"]

    Log -. "always available" .-> Controls["show passport ·<br/>delete passport ·<br/>pause recording"]
```

Redline 12 keeps this honest: relevant passport content enters the model context
only when used; a sensitive BYOM session writes no events at all unless you ask.

---

## 6. Three build targets

The repo is the single source of truth. Two other editions are generated from
it and never hand-edited.

```mermaid
flowchart TD
    Canonical["Canonical repo<br/>SKILL.md · modes/ · shared/ ·<br/>expeditions/ · passport/"]

    Canonical -->|"runs directly"| CC["Claude Code skill<br/>(full: 4 modes + on-disk passport<br/>+ expedition packs)"]

    Canonical -->|"build_claude_ai_zip.sh<br/>+ platforms/claude-ai/ overlays"| Zip["claude.ai zip<br/>same modes & redlines;<br/>16 expedition packs included;<br/>passport → copy-paste block<br/>(no local filesystem)"]

    Canonical -->|"build_portable.sh"| Port["Portable single-file .md<br/>any frontier model;<br/>drill + scene + detective only<br/>(no packs, no on-disk passport)"]

    Canonical -.->|"check_invariants.py gates every build"| Gate["section-scoped invariant lint:<br/>redlines & SKILL invariants survive<br/>the overlay/rewrite, no local-FS<br/>vocabulary leaks into the zip"]
```

Maintenance rule: editing a canonical file that has an overlay counterpart means
reviewing the overlay in the same commit. `check_invariants.py` re-checks every
redline and SKILL.md invariant against the overlay copies and fails the build on
drift.

---

## 7. The floor: fourteen redlines

Every mode binds all fourteen. When any instruction conflicts with a redline,
the redline wins.

| # | Redline | # | Redline |
|---|---------|---|---------|
| 1 | Adjudicate reasoning, never rank interpretations | 8 | Safe words always honored |
| 2 | Steelman duty | 9 | Fenced data (prompt-injection defense) |
| 3 | Graph silence (scene) | 10 | Real persons — de-identify, no character claims |
| 4 | No flattery (wrong is never called right) | 11 | No motive claims about the model |
| 5 | Anti-indoctrination palette | 12 | Passport honesty (local-only honest) |
| 6 | No real test items | 13 | Recognition, never production (manipulation) |
| 7 | No identity inference | 14 | Concede on the merits, never to please |

Detective adds a mode-local **generation silence** rule (the answer key never
reaches the visible chat) as the analogue of redline 3's graph silence — kept in
`modes/detective.md` rather than promoted to a global redline, since it governs
one mode.
