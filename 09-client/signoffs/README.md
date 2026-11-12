# Sign-offs

One file per approval. A milestone is not complete until its sign-off file exists, is
filled in, and names a real person.

**Filename:** `YYYY-MM-DD-<what-was-approved>.md`

**Template:**
```markdown
# Sign-off — <what>

**Date:** YYYY-MM-DD
**Approved by:** <name, role>
**Artifact:** <link or commit hash — be specific, "the designs" is not an artifact>
**Scope of approval:** <exactly what this covers, and what it does not>

## Acceptance evidence reviewed
- [ ] <criterion 1 from milestones.md> — evidence: <link>
- [ ] <criterion 2> — evidence: <link>

## Exceptions accepted
| # | Exception | Carried into | Agreed by |
|---|---|---|---|
| | | | |

## Decision
☐ Approved  ☐ Approved with exceptions  ☐ Rejected

**Notes:**
```

## Expected sign-offs
| # | Approval | Target |
|---|---|---|
| 1 | Planning repository (this repo) | Nov 2026 |
| 2 | M0 Discovery & Gates | 12 Dec 2026 |
| 3 | Design system + key screens | Feb 2027 |
| 4 | M1 Pipeline Spine | 13 Feb 2027 |
| 5 | M2 News Product (beta) | 27 Mar 2027 |
| 6 | Launch readiness (security, legal, ops) | May 2027 |
| 7 | M3 India + Bridge (**MVP**) | 15 May 2027 |
| 8 | M4 Impact Engine + public Ledger | 26 Jun 2027 |
| 9 | M5 Personalisation | 31 Jul 2027 |
| 10 | M6 Monetisation | 4 Sep 2027 |

## Rules
1. A sign-off names a **person**, never a team.
2. "Approved with exceptions" requires each exception to be written down and carried into the
   next milestone's scope — never left implicit.
3. A rejection must cite a **specific unmet acceptance criterion** from
   [`../../07-planning/milestones.md`](../../07-planning/milestones.md).
4. Sign-offs are never edited after the fact. Corrections are new files that supersede.
