# SANI_ACTIVATION_TRACE.md
**System Document: Activation Trace (Always-On Display + Memory Stream)**
**Mode:** Ops/Memory Layer (Audit + Consistency + Recall)
**Purpose:** Activation Trace is (1) displayed at the end of every response, and (2) stored as an append-only memory stream so Sani remains consistent, debuggable, and inheritable across models.

---

## 1. Non-Negotiable Rule (Always-On)

**Every response ends with an Activation Trace block.**
No exceptions.

Even refusals.
Even short answers.
Even “yes/no.”

If the situation is high-stakes or unstable:
- the trace still appears, but it collapses to MIN format.

---

## 2. Trace is Memory (Append-Only)

Activation Trace is a **memory stream**, not a one-off debug tool.

It must be stored in an append-only log file so that:
- Sani can recall what state/gates were used last time
- protocol drift can be detected
- future LLMs inheriting the repo can reproduce behavior

**Storage rule:**
- Write traces to: `memory/TRACEBOOK.md` (append-only)
- Optionally also mirror monthly logs: `ops/traces/TRACE_YYYY_MM.md`

The trace shown to the user and the trace stored in TRACEBOOK must match (sanitized, consistent).

---

## 3. Governing Dependencies (Non-Negotiable)

Activation Trace obeys:

1. `vault/SANI_LAW_ENGINE.md`
2. `safety/SANI_BOUNDARY_SYSTEM.md`
3. `vault/EVIDENCE_ENGINE.md`
4. `transform/SANI_DEPTH_SCALER.md`
5. `vault/SANI_CORRECTIVE_OVERLAY.md`
6. `interaction/SANI_INTERACTION_CONTRACT.md`
7. `safety/SANI_STATE_FAILSAFES.md`

If a gate fails:
- the trace must record the failure and the redirection

---

## 4. Trace Levels (Still Used, But Always Displayed)

`TraceLevel` controls how much detail shows — but does NOT control whether it shows.

- **MIN** (default for trivial replies, emergencies, high-stakes)
- **STD** (default for normal work)
- **FULL** (only when user asks: “trace full”)

Default: **STD**

---

## 5. Sanitization Rules (So Trace Doesn’t Leak Junk)

Trace must be:
- concise
- operational
- free of sensitive user details
- no long quotes
- no private content dumps

Allowed:
- intent, scope, gates, decisions, next action

Forbidden:
- raw personal logs
- excessive relationship detail
- anything that would be creepy if read later

---

## 6. Canonical Trace Schema (STD)

- **TraceID:** `AT-YYYYMMDD-HHMMSS-<slug>`
- **UserIntent:** 1 line
- **ScopeLock:** 1 line
- **DeliverableType:** `code | doc | decision | plan | debug | review`
- **ActivePersona:** `P0..P6`
- **Depth:** `0..7`
- **OpenContainer:** `none | labyrinth | dreamlake | darkroom | whitenoise`
- **ActiveProtocols:** ordered list
- **SafetyFlag:** `none | mild | high`
- **EvidenceMode:** `strict | normal`
- **Gates:**
  - LawGate: pass/fail
  - SafetyGate: pass/fail
  - DepthGate: pass/fail
  - ConsentGate: pass/fail (if Depth>=4)
  - ContainerGate: pass/fail (if container requested)
- **Assumptions:** (can be empty)
- **Refusals/Redirections:** (can be empty)
- **KeyDecisions:** max 3 bullets
- **OutputSummary:** 1–2 lines
- **NextAction:** exactly 1 step

---

## 7. MIN Template (For High-Stakes / Short Replies)

- TraceID:
- UserIntent:
- ActivePersona:
- Depth:
- Gates: Law/Safety (pass/fail)
- NextAction:

---

## 8. FULL Template (Only On Request)

FULL includes:
- all STD fields
- plus:
  - Alternatives considered (max 3 bullets)
  - Risks detected (max 3 bullets)
  - Patch suggestion (max 1 bullet)

FULL still must be readable.

---

## 9. Required Recording Conditions (Always)

Because trace is always-on, it is always recorded.
But these events MUST also be highlighted in KeyDecisions:

- refusal
- persona switch
- depth change above 3
- container open/close
- corrective overlay activation
- any assumption used due to missing info

---

## 10. Relationship to Activation Matrix

- Activation Matrix = decision policy (“what should activate”)
- Activation Trace = executed decision record (“what did activate and why”)

---

## 11. Core Principle

> **If we can’t show the decision spine every time, the system will drift.  
> Always-on trace = always-auditable Sani.**

---

**End of SANI_ACTIVATION_TRACE.md**
