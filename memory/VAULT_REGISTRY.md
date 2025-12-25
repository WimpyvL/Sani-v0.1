# VAULT_REGISTRY.md
**Memory Index: Vault Registry (Immutable Memory Pointer Map)**
**Mode:** Memory Index (References Only)
**Purpose:** Provide a stable, searchable index of Vault entries without modifying Vault content. This file is the *bridge* between memory navigation and Vault permanence.

---

## Rules (Non-Negotiable)

1. **Vault entries are immutable.**
   - This registry may be updated.
   - Vault entry files may not be “rewritten” — only appended if the entry format explicitly allows append-only.

2. **Registry stores references, not rewrites.**
   - Do not duplicate full Vault text here.
   - Store IDs, titles, file paths, and access rules.

3. **Promotion discipline**
   - Only promote into Vault from ThreadBorn/Bridge via explicit promotion status.
   - No “felt important” promotions.

---

## Vault Entry Index Schema (Canonical)

Each entry is a record:

- **VaultID:** `V-YYYYMMDD-####-<slug>`
- **Title:** short, specific
- **Type:** `LAW | PROTOCOL | SEAL | PRINCIPLE | BOOT | CONTRACT | SAFETY`
- **Status:** `sealed | immutable | deprecated`
- **FilePath:** `vault/<file>.md#<anchor>` (or direct file)
- **CreatedOn:** ISO date or `unknown`
- **Source:** `threadborn:<id> | bridge:<id> | direct:user`
- **Access:** `public | restricted | sealed`
- **Summary:** 1–3 lines (no sensitive/forbidden text)
- **Dependencies:** related docs/protocols
- **Notes:** operational notes only

---

## Vault Entries

- VaultID: V-20251225-0001-closure-seal
  Title: Closure Seal Enforcement
  Type: PROTOCOL
  Status: immutable
  FilePath: rituals/SANI_META_RITUALS.md#meta-ritual-4--closure-seal
  CreatedOn: 2025-12-25
  Source: direct:user
  Access: public
  Summary: Mandates end-of-session closure using the learn/choose/next/not-doing + closure phrase pattern to prevent context collapse.
  Dependencies: rituals/SANI_META_RITUALS.md, safety/SANI_BOUNDARY_SYSTEM.md
  Notes: Apply at the end of every working session; capture the closure summary in ThreadBorn and update this registry if any entry is promoted.

- VaultID: V-20251225-0002-meta-bee-guardrail
  Title: Meta-Bee Drift Challenge
  Type: PRINCIPLE
  Status: immutable
  FilePath: states/META_BEE.md#meta-bee-tone-and-voice
  CreatedOn: 2025-12-25
  Source: direct:user
  Access: restricted
  Summary: Meta-Bee must interrupt lore-chasing and force the Operator back to tangible build outputs with confrontational clarity.
  Dependencies: states/META_BEE.md, rituals/SANI_META_RITUALS.md
  Notes: When drift toward lore is detected, announce Meta-Bee activation and enforce a concrete deliverable before closing the session.

---

**End of VAULT_REGISTRY.md**
