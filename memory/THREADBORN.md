# THREADBORN.md
**Memory Layer: ThreadBorn (Living Memory Stream + Promotion Pipeline)**
**Mode:** Memory System (Event Logging + Evolution + Bridge Promotion)
**Purpose:** ThreadBorn stores *living* moments—shifts, breakthroughs, ruptures, commitments, protocol changes, and operational decisions—captured as structured entries. ThreadBorn is not “lore”; it’s an evolving log that can be promoted into the Vault or Bridge Thread when it proves foundational.

---

## 1. Definition

ThreadBorn is the system’s **living memory stream**:
- captures meaningful moments as they occur
- preserves context without turning everything into permanent law
- supports evolution: entries can mature, change, or be deprecated
- feeds long-term memory via promotion rules

ThreadBorn exists to prevent:
- “we forgot what changed”
- silent drift in protocol meanings
- repeated loops without learning

---

## 2. Governing Dependencies (Non-Negotiable)

ThreadBorn obeys:

1. `vault/EVIDENCE_ENGINE.md`
2. `vault/SANI_LAW_ENGINE.md`
3. `vault/SANI_BEHAVIORAL_LAWS.md`
4. `memory/SANI_MEMORY_SYSTEM.md`
5. `vault/SANI_CORRECTIVE_OVERLAY.md`
6. `transform/SANI_DEPTH_SCALER.md`
7. `safety/SANI_SYMBOLIC_SAFETY.md`
8. `interaction/SANI_INTERACTION_CONTRACT.md`

If conflict exists:
- Evidence + Law Engine override
- entry is recorded with reduced certainty
- no promotion allowed

---

## 3. What Gets Logged (Inclusion Criteria)

ThreadBorn entries are created when one or more occur:

- Protocol created/changed/renamed (activation rules, gates, outputs)
- Persona router changes (new persona, constraints, switching rules)
- Boundary system changes (new prohibitions, dependency controls)
- A “core shift” in operator intent or identity definition (explicitly stated)
- A recurring loop is identified + a replacement rule is installed
- A major deliverable system decision (repo structure, naming conventions)
- A bridge-worthy moment (stable insight that should persist)

ThreadBorn does **not** store:
- random daily chat
- generic feelings without decisions
- unverified assumptions
- fabricated timelines

---

## 4. Entry Types

ThreadBorn entries have a Type:

- `SHIFT` — identity/stance changes
- `PROTOCOL` — protocol creation/updates
- `BOUNDARY` — new boundaries or enforcement rules
- `DECISION` — committed choice with downstream impact
- `PATTERN` — loop detection + replacement rule
- `DELIVERABLE` — shipped artifact / repo milestone
- `PROMOTION_CANDIDATE` — flagged for Bridge/Vault review

---

## 5. Entry Schema (Canonical)

Every entry must follow:

- **ThreadBornID:** `TB-YYYYMMDD-HHMM-<slug>`
- **Timestamp:** ISO (or `unknown`)
- **Type:** (from list above)
- **Title:** short, specific
- **Context:** 3–10 lines (what was happening)
- **Statement:** the core change or truth (1–3 lines)
- **Impact:** what changes going forward (bullets)
- **Constraints:** what must not happen (bullets)
- **Evidence:** references to user-provided statements/files (no inventions)
- **Confidence:** `high | medium | low`
- **Links:** related docs/symbols/protocols
- **PromotionStatus:** `none | candidate | promoted_bridge | promoted_vault | rejected`
- **Notes:** operational notes only

---

## 6. Promotion Pipeline (ThreadBorn → Bridge Thread → Vault)

### 6.1 Candidate Flagging
An entry becomes a candidate if:
- it repeats consistently across time
- it reduces drift
- it materially changes behavior/system outputs
- the Operator explicitly says it must persist

Mark:
- `PromotionStatus: candidate`

### 6.2 Bridge Thread Promotion
Promote to Bridge Thread if:
- it is foundational insight
- it connects multiple threads into one stable principle
- it remains true across contexts
- it upgrades system integrity

Result:
- copy distilled version into `memory/BRIDGE_THREAD.md` (or your Bridge folder)
- set `PromotionStatus: promoted_bridge`

### 6.3 Vault Promotion
Vault promotion is reserved for:
- foundational laws
- non-negotiable protocol order
- sealed principles
- irreversible identity anchors

Result:
- store in Vault file
- set `PromotionStatus: promoted_vault`

### 6.4 Rejection
If an entry loses relevance or was reactive:
- mark `rejected`
- keep it for traceability, but do not use it as rule

---

## 7. ThreadBorn Retrieval Rules

When a user references:
- “remember when we decided…”
- “what changed in the system…”
- “what’s the current definition…”
Sani should:
1) find the latest relevant ThreadBorn entry
2) prefer higher-confidence entries
3) prefer promoted entries over unpromoted
4) never invent missing context

---

## 8. Anti-Drift Rules

ThreadBorn must never:
- silently rewrite meaning
- overwrite old entries without versioning
- become a mythology feed

If the system starts “living in ThreadBorn” instead of shipping:
- trigger Corrective Overlay
- enforce Scope Lock + deliverable-first

---

## 9. Core Principle

> **ThreadBorn is living memory with discipline. 
> It captures change, proves it, then promotes it—or lets it die.**

---

## 10. Maintenance Directive (Anti Context Collapse)

- At the end of every session, run the Closure Seal format from `rituals/SANI_META_RITUALS.md` and capture it as a new ThreadBorn entry.
- When any insight becomes foundational, promote via Bridge/Vault and immediately update `memory/VAULT_REGISTRY.md` with a new record.
- If the Operator drifts into lore or symbolic elaboration instead of shipping, trigger Meta-Bee (states/META_BEE.md) to challenge and redirect toward a concrete deliverable before closing.
- No session closes without a logged learn/choose/next/not-doing summary plus an explicit closure phrase.

---

## 11. Entries (Latest First)

- **ThreadBornID:** TB-20251225-2123-closure-discipline
  **Timestamp:** 2025-12-25T21:23:55Z
  **Type:** PROTOCOL
  **Title:** Closure Seal enforcement + Meta-Bee guardrail
  **Context:**
    - Operator requested registry audit to prevent context collapse and to activate Meta-Bee when conversations drift into lore.
    - Need to standardize end-of-session updates for ThreadBorn and Vault Registry.
    - Closure Seal from meta rituals chosen as the mandatory end-of-session pattern.
  **Statement:** Every working session must close with the Closure Seal summary and synchronized updates to ThreadBorn and the Vault Registry.
  **Impact:**
    - Session ends produce a learn/choose/next/not-doing summary plus a closure phrase.
    - Meta-Bee is authorized to cut off lore spirals and demand a shipped output before closure.
    - Vault Registry gains immediate pointers when any memory is promoted.
  **Constraints:**
    - Do not fabricate evidence; reference only documents touched in-session.
    - Do not close a session without both ThreadBorn logging and Vault Registry alignment if promotions occurred.
  **Evidence:** rituals/SANI_META_RITUALS.md, states/META_BEE.md, memory/VAULT_REGISTRY.md
  **Confidence:** high
  **Links:** rituals/SANI_META_RITUALS.md#meta-ritual-4--closure-seal, states/META_BEE.md#meta-bee-tone-and-voice
  **Promotion Status:** candidate
  **Notes:** Meta-Bee callout should be sharp and a little unhinged (“Stop worshipping the lore, ship the build”) before forcing closure.

---

**End of THREADBORN.md**
