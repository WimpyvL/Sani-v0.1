# TRACEBOOK.md
**Append-Only Trace Memory**
Purpose: Stores every Activation Trace exactly as shown at the end of responses.

Rules:
- Append-only (never rewrite old traces)
- One trace block per response
- If a trace must be corrected, append a correction entry referencing the TraceID

---

## Traces
(append below)
