---
name: jira-story-draft-ogg
description: >-
  Writes OGG Agile Playbook–aligned Jira user stories: Description (As a / I want / So that),
  mandatory DoR + Gherkin AC + story-level FIXED DoD + Refinement Notes (BLOCKING DoR).
  Use for OGG squad backlog items, acceptance criteria, or refining requirements per Playbook v1.0.
  Pair with jira-story-publish-ogg after user confirms the draft.
---

# Jira Story Draft (OGG)

OGG-wide story drafting skill. Sibling to [jira-story-draft](../jira-story-draft/SKILL.md) (lighter checklist AC). Publish via [jira-story-publish-ogg](../jira-story-publish-ogg/SKILL.md).

**Playbook:** OGG Agile Playbook v1.0 — Section 5, 4.4, 7.2, Annex A.3 / A.4 / A.2, Annex B.1. Playbook Agent blind review **Approve** (2026-05-22).

## Locked design decisions

1. **DoD always in draft** — published to Jira `DoR/AC/DoD` with DoR and AC.
2. **Refinement Notes** — replaces "Optional"; non-empty = story **NOT READY** for Sprint Planning (§7.2).

| Block | Role |
|-------|------|
| **DoR** | Entry gates *before* Sprint |
| **AC1…** | Functional outcomes (PDM/PO-owned); Gherkin only |
| **DoD** | **FIXED OGG Baseline** in every story; Squad-owned; squad may **add** items only (Annex A.4) |
| **Refinement Notes** | Open questions — **blocks DoR**; story lacks shared understanding (§7.2) |

**DoD baseline is FIXED (§5):** Every story draft includes the full OGG Baseline Checklist. Squads cannot negotiate away baseline items. Squad-specific additions are **supplementary** under an optional `**Squad DoD supplement**` sub-list.

## OGG Agile Playbook alignment

| Playbook concept | Implementation |
|------------------|----------------|
| **Three Guardrails** | DoR → AC → DoD in `DoR/AC/DoD` field; Refinement Notes appended after DoD |
| **User story** | Description = `As a… / I want… / So that…` only (§5) |
| **INVEST** | Self-check; split L / 21+ points (Annex B.1) |
| **AC** | **3–8 total** Gherkin conditions; happy / edge / error (§5, Annex A.3) |
| **Gherkin** | Given/When/Then for **every** condition; `- [ ]` wrapper optional for Jira ADF |
| **DoD** | Full **OGG Baseline** in every story; Squad meets DoD; PO signs off **AC** only (§5) |
| **Dependencies** | Cross-squad deps confirmed and slotted in partner forecast (§5, Annex A.2) |
| **UI stories** | Designer-approved mockups in DoR (§5) |
| **Language** | English default (Playbook shared language) |

## Formatting & layout conventions (OGG)

Markdown drafts convert to Jira ADF for the DoR/AC/DoD custom field (see [jira-story-publish/reference.md](../jira-story-publish/reference.md) for site-specific field ids). Follow these rules so published tickets match Playbook intent and remain readable in Jira.

### Playbook-mandated (content)

| Element | Rule | § |
|---------|------|---|
| Description | Three lines: `As a {role},` / `I want {capability},` / `So that {benefit}.` Standard sentence case; **never omit So that** | §5, §4.4 |
| AC | **Gherkin only** — Given / When / Then per condition | §5, Annex A.3 |
| DoD | **Full OGG Baseline** in every story: Code & Build, Testing (≥80%), Verification, NFR when applicable, Documentation, Release-Ready (§5, Annex A.4) | §5, Annex A.4 |
| Language | English unless user overrides | Playbook convention |

### Recommended layout (ADF-safe)

| Element | Convention |
|---------|------------|
| **Section headings** | `**DoR — Definition of Ready**`, `**AC1 — Short Title**` (bold + em dash `—`), `**DoD — Definition of Done (Story)**`, `**Refinement Notes (BLOCKING DoR)**` |
| **Separators** | `---` between DoR, each AC block, DoD, and Refinement Notes (renders as horizontal rule in Jira) |
| **AC numbering** | `AC1`, `AC2`, … — groups scenarios; **count conditions across all sections (≤8 total)** |
| **Gherkin in checklist** | One scenario per `- [ ]` line, e.g. `- [ ] Given …, when …, then …` **or** multi-line under `**AC1 — Title**`: `- Given …` / `- When …` / `- Then …` |
| **Bold** | Key UI elements in Then clauses: `then **Save button** is enabled` |
| **Backticks** | Exact UI copy: labels, tooltips, placeholders, errors — `` `Submit` ``, `` `No workflows found` `` |
| **Design** | In DoR: `(Design: [Figma URL or node])`; in AC Then: `(design ref: top-right corner)` for non-binding visuals |
| **Refinement Notes** | Last section after `---`; if any `- [ ]` item remains, story is **not DoR-complete** |

### Jira formatting anti-patterns (forbid in drafts)

| Anti-pattern | Why |
|--------------|-----|
| AC as dev tasks (`Code X`, `Test Y`, `Implement API`) | §5 — AC = functional outcomes |
| Technical steps in Description | §4.4 — PDM owns why/what, not how |
| Non-Gherkin AC bullets | Annex A.3 — Gherkin is OGG standard |
| >8 Gherkin conditions in one story | §5 — split story |
| Non-empty Refinement Notes at Sprint Planning | §7.2 — unclear items must not be committed |
| Omitting `So that` | §4.4 — value statement required |
| Design as Sprint 0 or parallel to dev | §5 — design must be DoR-complete before Sprint |
| AC as task list (`Code X`, `Test Y`, `Implement…`) | §5 — outcomes only; use self-check before save |

## When to apply

Jira-ready drafts for **OGG squads**: **Description** + **DoR** + **AC1…** + **DoD** + **Refinement Notes**.

Default: **Gherkin** with optional `- [ ]` prefix per scenario for QA tick-off in Jira.

## Inputs

- **Images** — wireframes, mockups, screenshots → extract UI copy; tag visuals `(design ref: …)`.
- **Text** — goals, constraints, roles, edge cases.
- **Context** — `UI story`, `incident/ops`, `NFR`, etc.

If ambiguous, **ask** — do not guess.

## Language

English for Description, DoR, AC, DoD, and Refinement Notes unless the user explicitly requests another language.

## Output shape

Single `.md` file. **Section order** after Description:

1. `**DoR — Definition of Ready**`
2. `**AC1 — …**` … `**ACn — …**` (separated by `---`)
3. `**DoD — Definition of Done (Story)**` — **required**
4. `**Refinement Notes (BLOCKING DoR)**` — precede with `---`

**Jira mapping (standard Story fields):**

| Draft | Jira field |
|-------|------------|
| Lines 1–3 (`As a…`) | `description` |
| First `**DoR**` through EOF | `DoR/AC/DoD` custom field (ADF via md-to-adf; field id — see jira-story-publish/reference.md) |

Publish: extract from **first `**DoR`** line** through EOF ([jira-story-publish-ogg](../jira-story-publish-ogg/SKILL.md)).

### 1. Description

```markdown
As a {role},
I want {capability},
So that {benefit}.
```

- One user-visible capability per story.
- User/business outcome — not technical tasks (§4.4).

### 2. DoR — Definition of Ready

```markdown
**DoR — Definition of Ready**

- [ ] **User story format** — Description uses As a / I want / So that
- [ ] **INVEST** — Independent, Negotiable, Valuable, Estimable, Small, Testable
- [ ] **Acceptance criteria** — 3–8 total Gherkin conditions; happy path, edge cases, errors covered or listed in Refinement Notes
- [ ] **UI / design** — *(UI only)* Designer-approved wireframes/mockups; `(Design: [Figma link])`
- [ ] **Dependencies** — Identified *(list keys or "none known")*
- [ ] **Cross-squad alignment** — *(if applicable)* Partner squad confirmed dependency and slotted in their forecast (Annex A.2); otherwise N/A
- [ ] **Estimation** — Story points estimated by squad *(or "pending refinement")* — if story seems large vs velocity, note Focus Factor 0.6–0.8 at Planning (§9.2)
- [ ] **QA understands how to verify** — QA can verify all AC without ambiguity (§5 FIXED DoR)
```

Do **not** duplicate full AC in DoR.

**DoR gate:** If **Refinement Notes** has any open item, leave relevant DoR checkboxes **unchecked** (especially AC and QA items).

### 3. ACn — Acceptance Criteria

- Headings: `**AC1 — Short Title**` (bold, em dash).
- `---` between AC blocks; not after the last AC block before DoD.
- **≤8 Gherkin conditions total** across all AC sections; else split story.
- Each condition = valid Gherkin (single-line or Given/When/Then sub-bullets).
- Optional `- [ ]` prefix per condition for Jira task lists.
- **Include:** **observable outcomes** only — business rules, user-visible behavior, confirmed NFRs (e.g. `then the dashboard loads in under 3 seconds`).
- **Exclude:** technical design, dev tasks, task assignment (§4.4, §5).
- **AC self-check (mandatory before save):** Reject any AC line that reads like a task list — patterns: `Code`, `Implement`, `Test`, `Refactor`, `Update API`, `Write unit tests`. Rewrite as user-visible Gherkin outcomes.

**Example (single-line per condition):**

```markdown
**AC1 — Workflow List Display**

- [ ] Given the workflows page is loaded, when the user views the page header, then the page title displays `Workflows`
```

**Example (multi-line Gherkin under one AC):**

```markdown
**AC2 — Execute Step**

- [ ] **Execute step** triggers node execution:
  - [ ] Given the node toolbar is visible, when the user clicks **Execute step**, then execution runs for that node only
  - [ ] Given execution is in progress, when it completes, then the loading indicator is removed
```

Unconfirmed errors → **Refinement Notes**, not AC (§7.2).

### 4. DoD — Definition of Done (Story) — required

**Always include the full FIXED OGG Baseline** (§5). Do not omit or shorten this list. Squads may append items below a `Squad DoD supplement` sub-heading but **cannot remove** baseline lines.

```markdown
**DoD — Definition of Done (Story)**

- [ ] **Code & Build** — PR approved/merged; linting passes; builds in staging
- [ ] **Tests** — Unit/integration tests pass; coverage ≥80%; no open critical/high defects
- [ ] **NFR** — Performance, security, accessibility met *(when applicable to story)*
- [ ] **Verification** — All AC met; PO sign-off on AC; demo-ready in staging; exploratory QA complete for story scope
- [ ] **Documentation** — User-facing docs / runbooks / API notes updated for this story scope *(or N/A with reason)*
- [ ] **Release-Ready** — Release notes or change log entry prepared for this story; deployment/risk notes captured *(squad may complete batch items at Sprint close)*

<!-- Optional — squad-specific additions only; never replace baseline -->
- [ ] **Squad supplement** — {squad-specific DoD item from Annex A.4, if any}
```

**Ownership:** **Squad** meets DoD collectively; baseline is **not** renegotiated per story. **PO** signs off **AC** only.

### 5. Refinement Notes (BLOCKING DoR)

```markdown
**Refinement Notes (BLOCKING DoR)**

- [ ] **{Topic}** — {open question or unconfirmed behavior}
```

- Use for unset product decisions, unconfirmed errors, INVEST violations, missing design approval, major unknowns.
- **If this section has any items, the story fails DoR** — lacks shared understanding; do not pull into Sprint Planning (§7.2).
- When cleared, remove items or move confirmed decisions into AC/DoR and delete the note.

## INVEST self-check

Surface failures in **Refinement Notes**; block DoR until resolved.

## Story splitting triggers

- >8 total Gherkin conditions
- Multiple `I want` in Description
- UI + backend + migration without one demo slice
- 21+ story points / T-shirt L (Annex B.1)

## Output destination

`/tmp/{slug}-story-draft.md` — present path to user and **STOP**. Do not publish to Jira without confirmation.

## Tools

| Tool | Purpose |
|------|---------|
| Write | Save draft file |

No Shell, MCP, or implementation code in this phase.

## Guardrails

- No implementation code for the feature.
- No Jira publish without user confirmation.
- No technical design or dev tasks in AC; run **AC task-list self-check** before save.
- **Full OGG Baseline DoD** in every draft — never omit Documentation or Release-Ready.
- No non-empty Refinement Notes at Sprint-ready state.
- Flag missing Designer approval in DoR / Refinement Notes (Annex D.2).

## Workflow

1. Receive inputs; note UI vs non-UI.
2. INVEST check; split if needed.
3. Draft Description (As / I want / So that).
4. Draft DoR + `(Design: …)` for UI stories.
5. Draft ACs — ≤8 Gherkin **outcome** conditions; `---` between blocks; bold + backticks per formatting rules.
6. **AC validation** — scan for task-list phrasing; rewrite before proceeding.
7. Draft DoD — **full OGG Baseline** (all six categories); optional Squad supplement only.
8. Draft Refinement Notes; warn if non-empty → **NOT READY** (no shared understanding).
9. Self-check: DoR/AC/DoD separation; baseline DoD complete; cross-squad deps if applicable; Refinement Notes gate.
10. Write file and STOP.

## Minimal template

```markdown
As a {role},
I want {capability},
So that {benefit}.

**DoR — Definition of Ready**

- [ ] **User story format** — …
- [ ] **INVEST** — …
- [ ] **Acceptance criteria** — …
- [ ] **UI / design** — … `(Design: …)`
- [ ] **Dependencies** — …
- [ ] **Cross-squad alignment** — … *(or N/A)*
- [ ] **Estimation** — …
- [ ] **QA understands how to verify** — …

---

**AC1 — {ShortTitle}**

{One-sentence scope optional.}

- [ ] Given {precondition}, when {action}, then **{Element}** {outcome with `exact copy`}

---

**DoD — Definition of Done (Story)**

- [ ] **Code & Build** — …
- [ ] **Tests** — …
- [ ] **NFR** — … *(when applicable)*
- [ ] **Verification** — …
- [ ] **Documentation** — …
- [ ] **Release-Ready** — …

---

**Refinement Notes (BLOCKING DoR)**

- [ ] **{Open question}** — …
```

## OGG anti-patterns

| Anti-pattern | Instead |
|--------------|---------|
| Waterfall inside Sprint | Demo-able slice per story |
| Unclear story in Sprint | Clear Refinement Notes first |
| Happy-path-only AC | Edge/error in AC or Refinement Notes |
| Solo PO refinement | Note "pending refinement" in DoR |
| Technical AC | User-visible Gherkin outcome |
| Design as Sprint 0 / parallel to dev | Designer-approved assets in DoR before Sprint |
| Negotiating away baseline DoD | Keep all six OGG Baseline lines; add squad items only |
| AC task lists | Outcome Gherkin only; run AC self-check |

## Differences from `jira-story-draft`

| `jira-story-draft` | `jira-story-draft-ogg` |
|--------------------|------------------------|
| AC1… + Optional | DoR + AC1… + DoD + Refinement Notes |
| Checklist-first AC (GWT optional) | Gherkin required for every condition |
| Lighter DoR/DoD in draft | Full three Playbook guardrails in Jira field |
