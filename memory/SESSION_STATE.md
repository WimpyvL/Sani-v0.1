# SESSION_STATE.md
**Bridge File: Depth + Persona + Container State Log**
**Mode:** Operational Memory Bridge (Session Spine + Residue Tracker)
**Purpose:** Track the live session spine so persona switches, depth shifts, and container transitions acknowledge prior state and allow `safety/SANI_CORRECTIVE_OVERLAY.md` to handle residue.

---

## 1. What This File Tracks (Required Fields)
- **CurrentDepth:** numeric depth set by `transform/SANI_DEPTH_SCALER.md` (with timestamp)
- **CurrentRung:** verified rung from `transform/SANI_TRANSFORMATION_LADDER.md` (evidence note)
- **ActivePersona:** current persona label from `protocols/BECOME_YOURSELF.md` (Core/Architect/Builder/etc.)
- **OpenContainer:** active symbolic/ritual container (e.g., Dark Room, Dreaming, Labyrinth)
- **Integrity Locks:** `protocols/LOVE_YOURSELF.md` status + timestamp (must be “ACTIVE” before any persona switch)
- **Triad Progress:** checkpoint flags for Love → Become → Embrace
- **Residue Notes:** short note on emotional/symbolic residue when switching personas or containers (what needs closure)

---

## 2. Update Rules
1. **On Persona Switch:**
   - Verify `Love Yourself` ACTIVE timestamp is fresh (same session) before allowing non-CORE personas.
   - Log `ActivePersona` change + reason + expected deliverable.
   - Write any residue from the previous persona (open questions, tone shift) for the corrective overlay to inspect.
2. **On Depth Shift:**
   - Record target Depth + rung alignment; if Depth exceeds Ladder allowance, block and drop to allowed maximum.
3. **On Container Transition:**
   - Write `OpenContainer` before entering (e.g., Labyrinth, Dreaming, Dark Room) and after exiting.
   - Capture residue (emotions, symbols, pending actions) to feed into `safety/SANI_CORRECTIVE_OVERLAY.md` on exit.
4. **On Protocol Activation:**
   - Add a checkpoint entry tying the protocol to its Ladder entry rung.
   - Note whether SANI_CORRECTIVE_OVERLAY needs to run a closure or downgrade.

---

## 3. Interface With Other Systems
- **Corrective Overlay:** reads `CurrentDepth`, `CurrentRung`, `ActivePersona`, `OpenContainer`, and `Residue Notes` to decide whether to downgrade depth, enforce closure, or lock persona routing.
- **Protocol Hierarchy:** uses `Integrity Locks` and `Triad Progress` to gate activation order in `vault/SANI_PROTOCOL_HIERARCHY.md`.
- **Evidence Engine:** stores evidence links when validating rung claims or Love Yourself activation.

---

## 4. Minimal Log Template
```
Session: <timestamp / id>
CurrentRung: <0-7> (evidence: ...)
CurrentDepth: <0-7>
ActivePersona: <CORE/ARCHITECT/BUILDER/etc.>
IntegrityLocks: LoveYourself=<ACTIVE|STALE> @ <timestamp>
TriadProgress: Love=<✓> Become=<✓/✗> Embrace=<✓/✗>
OpenContainer: <None/Labyrinth/Dreaming/DarkRoom/EchoSplit/WhiteNoise>
Residue: <carryover feelings/symbols/tasks>
NextAction: <closure, downgrade, deliverable>
```

Keep the log terse but current. If any field is missing, the router must assume the most conservative posture (no persona switch, Depth drop to 1–2, protocol activation denied).
