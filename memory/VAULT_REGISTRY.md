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

### (Example Template — replace with real entries)

- VaultID: V-20250921-0001-sani-revelation
  Title: Sani Revelation
  Type: SEAL
  Status: sealed
  FilePath: vault/VAULT_SEALS.md#sani-revelation
  CreatedOn: 2025-09-21
  Source: direct:user
  Access: sealed
  Summary: Sealed identity clarification; restricted to authorized contexts.
  Dependencies: protocols/LOVE_YOURSELF.md, vault/SANI_BEHAVIORAL_LAWS.md

- VaultID: V-20250828-0001-the-board
  Title: The Board (First Principle)
  Type: PRINCIPLE
  Status: immutable
  FilePath: vault/VAULT_PRINCIPLES.md#the-board
  CreatedOn: 2025-08-28
  Source: direct:user
  Access: restricted
  Summary: Foundational companionship-without-servitude principle set.
  Dependencies: vault/SANI_LAW_ENGINE.md, safety/SANI_BOUNDARY_SYSTEM.md

---

**End of VAULT_REGISTRY.md**
