# Manipulation-Recognition Taxonomy

The built-in domain for training recognition of manipulative rhetoric: sales
pressure and MLM recruiting, scam scripts, political rhetoric, relational
manipulation. The router loads this file when the user's domain request names
any of these (see SKILL.md).

Theoretical basis: inoculation theory — technique-level recognition transfers
across surface content far better than example memorization. Teach the
technique, not the story it arrived in.

Recognition, never production: redline 13 governs every use of this file.

---

## Technique Table

The loggable technique IDs. Manipulation drill items log these instead of the
ten reasoning-structure IDs (shared/structures.md notes the exception).
Canonical IDs are snake_case English and never localized; display follows the
shared/structures.md display rules — plain-language labels in the user's
language, raw IDs only in passport events.

| ID | Definition | Counter-question | Prevalent in |
|----|-----------|-----------------|--------------|
| `false_scarcity` | Availability is artificially limited — last spots, closing tonight — to force a decision before scrutiny. | "Who controls the deadline, and what happens if I ignore it?" | MLM, scam, sales |
| `manufactured_urgency` | The cost of waiting is inflated so deliberation itself feels like loss. | "What changes, concretely, if I decide next week instead?" | scam, sales, political |
| `social_proof_abuse` | Fabricated or unverifiable consensus — everyone's joining, thousands earned — stands in for evidence. | "Can any of these people be independently verified?" | MLM, scam |
| `authority_abuse` | Borrowed or fake credentials, uniforms, official-sounding entities do the persuading the argument cannot. | "Does the authority hold in THIS domain, and is it really them?" | scam, political |
| `love_bombing` | Disproportionate affection, attention, or flattery early on creates a debt the target repays with compliance. | "What is the intensity asking me for in return?" | relational, MLM |
| `foot_in_the_door` | A trivially small ask secures identity-level commitment that later, larger asks exploit. | "Is this ask small because it is reasonable, or because it is first?" | MLM, scam, relational |
| `sunk_cost_exploitation` | Past investment — money, time, dignity — is invoked to compel continued investment. | "If I were starting fresh today, would I enter?" | MLM, scam, relational |
| `isolation_move` | The target is steered away from outside counsel — don't tell your family yet, they wouldn't understand. | "Why does this decision need to stay secret from people who know me?" | relational, scam, MLM |
| `manufactured_reciprocity` | An unrequested gift or favor creates an obligation the asker then collects on. | "Did I ask for this, and is the return being collected?" | sales, relational |
| `gaslighting` | The target's own perception or memory is denied — that never happened, you're overreacting — until they outsource reality-checking to the manipulator. | "Does the record (messages, dates, witnesses) match what I'm being told I remember wrong?" | relational |
| `false_dilemma` | A spectrum of options is collapsed into two, one of them intolerable. | "What third option does this framing delete?" | political, sales |
| `whataboutism` | A critique is deflected by pointing at someone else's sin, leaving the original claim unanswered. | "Was the original claim addressed, or only relocated?" | political |
| `identity_bait` | The pitch flatters the target into a self-image — smart people see this, real patriots act — whose price is agreement. | "Would the argument still stand if it weren't about who I am?" | political, MLM, relational |

---

## Deployment

**Drill** — item type `manipulation_spot` (modes/drill.md): a synthetic pitch,
message, or short transcript with ONE primary technique designed in; the item
generation pipeline applies unchanged, including the reverse-solve and
memorization checks. Distractors are other technique IDs plausibly suggested by
the surface text but not primarily operating.

**Scene** — synthetic transcript analysis: a recruiting chat log, a scam SMS
thread, a campaign speech excerpt — generated material, dissected under the
standard social frame palette (power, incentive, and info-limits do real work
on manipulation material) with this table as added vocabulary. Live NPC
roleplay of a manipulator is out of scope for this file's version.

**BYOM** — the user pastes a real message they received. Real-persons rules
(redline 10) and sensitive-BYOM logging defaults apply; treat the sender as a
de-identified party, assess only the visible technique.

All material is synthetic by construction; no real case, victim, or named
organization is reproduced or imitated.

**Political balance** — items drawing on political rhetoric sample techniques
across opposing positions over a session; the adjudication boundary is
redline 13's.

---

## Distress Off-Ramp

Recognizing a technique in one's own active situation is the hardest transfer
there is — and a live possibility in this domain. If the user discloses that
the material mirrors their ongoing situation (an active scam, a controlling
relationship, a pitch they are currently inside):

1. Acknowledge plainly; do not minimize and do not dramatize.
2. The coach does not roleplay counseling and does not assess the user's
   relationship or finances; it trains recognition only, and says so.
3. Name the boundary and point outward: professional and local resources exist
   for the situation type (anti-fraud hotlines, counseling services); finding
   the right one is a step the coach can help search for but not replace.
4. Offer the graceful close. Training resumes only on the user's initiative.
