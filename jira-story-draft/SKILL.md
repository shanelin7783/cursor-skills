---
name: jira-story-draft
description: >-
  Writes Jira user stories with Description (As a / I want / So that), numbered acceptance
  criteria with short titles, checklist-style verifiable items, and GWT sub-items for
  complex flows. Use when the user asks for Jira tickets, user stories, acceptance criteria,
  AC, backlog items, PRD story format, QA checklists, or refining requirements into
  testable criteria.
---

# Jira Story Draft

## When to apply

Use this skill whenever the user wants **Jira-ready** text: a **Description** plus **AC1, AC2, …** with concrete UI behavior. Default to **checklist ACs** (`- [ ]`) so QA can tick items off. If the user explicitly wants narrative-only ACs, still follow the same content rules but use `•` / `◦` bullets instead of checkboxes.

## Inputs

The user provides one or more of:

- **Images** — screenshots, wireframes, Figma exports, or mockups. When provided, analyse them to extract visible UI text (titles, labels, buttons, tooltips), layout structure, states (active/inactive, hover, empty), icons, and color cues. Incorporate all observable details into the ACs.
- **Text descriptions** — feature goals, constraints, edge cases, user role context.

If requirements are **ambiguous** or the images leave questions open, ask the user rather than guessing.

## Language

- **Always write in English** — Description, all ACs, and Optional sections must be in English regardless of the language the user uses to describe the feature.
- Only switch to another language (e.g. Traditional Chinese) if the user **explicitly requests** it (e.g. "用中文寫", "write in Chinese").

## Output shape

The output is **standard Markdown** written to a **single `.md` file**. When the ticket is created via **[jira-story-publish](../jira-story-publish/SKILL.md)**, the AC portion is converted to ADF by the **[md-to-adf](../md-to-adf/SKILL.md)** skill which faithfully mirrors the markdown — what you write is what appears in Jira.

1. **Description** — Three lines at the top of the file (no label prefix):
   - `As a {role},`
   - `I want {capability},`
   - `So that {benefit}.`
   - One capability per story; split extra scope into another story.

2. **`**ACn — Short Title**`** — Number sequentially (`AC1`, `AC2`, …). Wrap the section line in `**…**` so it renders bold in Jira. Use an **em dash** (`—`) between the number and the short title (matching TSWE DoR/AC/DoD visible pattern).

3. **Acceptance content** — Prefer **one verifiable behavior per checklist line**. When a behavior has multiple scenarios (nested conditions or GWT), the parent `- [ ]` line states the behavior and each sub-item `- [ ]` is one testable scenario. Group related lines under the same AC.

4. **`---` between AC sections** — Put a horizontal rule (`---`) between each AC block (and before `**Optional**`). This becomes a visual separator (`rule`) in Jira's DoR/AC/DoD field. Do **not** add `---` after the last section.

## Output destination

Write the complete draft (Description + all ACs) to a file:

```
/tmp/{slug}-story-draft.md
```

where `{slug}` is a short kebab-case name derived from the feature (e.g. `node-modal`, `workflow-list`).

After writing, present the file path to the user and **STOP**. Do **not** proceed to Jira ticket creation until the user explicitly confirms the draft content.

## Tools used in this skill

| Tool | Purpose |
|------|---------|
| Write (file) | Save draft to `/tmp/{slug}-story-draft.md` |

**Not used in this phase:** No Shell commands, no MCP calls, no scripts. The AI only analyses inputs and produces a markdown file.

## Guardrails

- Do **NOT** write implementation code (frontend, backend, tests, etc.) for the feature being described.
- Do **NOT** execute scripts, shell commands, or MCP calls during this phase.
- Do **NOT** proceed to ticket creation without explicit user confirmation of the draft.
- If requirements are ambiguous, **ask** the user rather than guessing.

## Bullet conventions (narrative mode)

When not using checkboxes:

- Main items: `•`
- Sub-items: `◦`
- **Conditionals**: spell out branches (e.g. `When Status is Active, …` / `When Status is Inactive, …`).
- **After actions**: state whether the list/view **refreshes**, tooltips update, etc.
- **`(design ref)` and Optional rules still apply** — tag visual-only details from mockups and surface unconfirmed behaviors the same way as in checklist mode.

## Checklist mode (default)

Use Markdown task items:

```markdown
- [ ] …
```

Rules:

- Each `- [ ]` maps to **one** testable outcome (or one clearly bounded UI rule).
- Keep the same ordering as the UI (e.g. left-to-right toolbar buttons).
- Put the following under **`Optional`** with `- [ ]` items:
  - **Unset decisions** — features pending product confirmation (e.g. confirm dialog for delete, extra "More" menu).
  - **Error states** — what happens when API calls fail, network is down, or server returns an error.
  - **Boundary conditions** — edge cases whose expected behavior is **unconfirmed** (max limits, concurrent edits, duplicate entries).
  - **Negative paths** — actions that should be disabled or blocked under certain conditions.

## Inline formatting (readability)

Formatting is a **vocabulary, not decoration**: each mark carries **one fixed meaning** so a reader can scan by style alone. Overusing a mark destroys its signal — "if everything is bold, nothing stands out." All three marks survive ADF conversion (bold → `strong`, backtick → `code`, italic → `em`; verified via md-to-adf).

| Mark | Meaning | Rule |
|------|---------|------|
| **Bold** | The subject the line verifies — a named UI element, or a run-in concept anchor | **One bold span per line** = its subject. Bold an element on **every** reference *that is a line's subject* — never demote to plain on repeat mentions across lines (Google/MS convention); within a line, the one-bold tiebreak governs. **No bold** in context sentences or running prose. |
| `` `backtick` `` | Verbatim on-screen copy | Use when a string is the **character-for-character comparison target**: asserted to appear (labels, tooltip text, placeholder, error messages, field values), **or** referenced as an exact literal value in a Given/When condition (option value, typed input, state label). |
| *italic* | Non-normative aside | Parentheticals that are **not** a pass/fail assertion — cross-AC scope notes, soft clarifiers, and `(design ref: …)`. Signals "scannable, not testable." |

### Bold — one subject anchor per line

Start each checklist line by **bolding the UI element or subject** being verified — a per-line scan anchor (the "lead-in" convention). Keep it to **one bold span per line**; do not bold the same element twice in a line, and do not bold anything in the context sentence. The lead-in anchor applies to **top-level checklist lines**; indented sub-items (nested conditions, GWT) inherit the parent's anchor and start with `When` / `Given` instead.

Bold has exactly **two legitimate positions**:

1. **Naming a UI element** that is the line's subject (Google/MS convention).
2. **A run-in concept anchor** at the start of a line whose subject is not a named UI element (e.g. `**Empty state**`, `**Toolbar dismissal**`) — Google's style guide sanctions bold for run-in headings.

Never bold a concept mid-line or in running prose — the "no bold for concepts" rule (GitLab) applies to everything after the line's anchor.

**Bold span boundary:** bold exactly the element's **visible name** — no more (`**Execute step** button`, not `**Execute step button**`), and no quotes (bold already delimits the label). If the element has no visible label, bold the descriptive phrase you call it by (`**Search field**`, `**Power icon**`).

```markdown
- [ ] **Page title** displays `Workflows`
- [ ] **+ Add Workflow** button is displayed *(design ref: top-right corner)*
- [ ] **Table columns** include: `Name`, `Used By`, `Status`, `Created Date`, `Last Updated Date`, `Action`
- [ ] **Empty state** — when no workflows exist, the table body shows `No workflows found`
```

### Bold vs backtick — naming vs asserting

The boundary rule: **name a UI element → bold; assert an exact character string → backtick.** Button/menu/field names are "naming an element" (bold), *not* verbatim strings — **unless** the line verifies the characters match exactly (then backtick). The same text can take either mark depending on intent; the two marks can co-occur on different words in one line.

**Decision heuristic:** a verb acting on a **UI element** (click, disable, hover) → the text **names** the element (bold if it's the line's anchor, plain otherwise). A string standing for **exact characters** — copy asserted to display, or the precise option/input value in a Given/When condition — → backtick. So "clicking Delete" names a button (plain), while "when `Active` is selected" fixes a value (backtick).

**One-bold-per-line tiebreak:** when a line already has its bold subject anchor and references *another* UI element later in the same line, keep the anchor as the sole bold span. The secondary reference takes backtick if its exact label is being asserted, otherwise plain text — never a second bold. This preserves the one-anchor-per-line scan skeleton.

```markdown
- [ ] **Execute step** button is displayed              ← naming the element → bold
- [ ] **Execute step** icon tooltip text is `Execute step`  ← asserting exact copy → backtick
- [ ] **Search field** placeholder text is `Search workflows…`
- [ ] When validation fails, **error message** shows `Name is required`
- [ ] **Filter behavior** — when `Active` is selected, only active workflows display   ← condition references exact option value → backtick
- [ ] **Delete confirmation** — clicking Delete shows a confirmation dialog   ← secondary element, named not asserted → plain
```

### Italic — non-normative asides

Wrap any parenthetical that a tester could **skip without losing a pass/fail check** in italic: cross-AC scope notes, soft clarifiers, and all `(design ref: …)` tags (design refs are non-binding — "subject to change"). Never italicise a testable assertion.

```markdown
- [ ] **Validation timing** runs on every keystroke *(applies to AC1, AC2, AC3)*
- [ ] **Delete** icon uses destructive styling *(design ref: red)*
```

**Parentheses ≠ italic.** The test is skippability, not punctuation — a parenthetical that *specifies or widens the pass condition* is normative and stays plain:

```markdown
- [ ] **Search** filters the list by workflow name (case-insensitive partial match)   ← test spec → plain
- [ ] **Toolbar** appears above (or adjacent to) the node on hover                    ← widens the pass condition → plain
```

### Nested items for conditions

When a single element displays **differently depending on its current state** — without requiring a user action to observe — use a parent line describing the scope, followed by indented sub-items for each branch. This is for **static display differences** across states:

```markdown
- [ ] **Status toggle** reflects current node state:
  - [ ] When active → tooltip shows `Deactivate`
  - [ ] When inactive → tooltip shows `Activate`
  - [ ] When inactive → a gray `(Deactivated)` label appears below the node title
```

### GWT sub-items for complex flows

When the AC involves a **user action whose outcome depends on preconditions or triggers side effects**, use a parent `- [ ]` line summarizing the behavior, followed by indented `- [ ]` sub-items in **Given / When / Then** format. Each sub-item describes one scenario and is independently checkable.

Use GWT instead of nested conditions when: (1) the outcome depends on a **setup step or precondition** the tester must arrange, or (2) the behavior involves a **user-triggered action** (click, submit, delete) rather than passive display.

```markdown
- [ ] **Execute step** triggers execution and provides feedback:
  - [ ] Given the toolbar is visible, when the user clicks **Execute step**, then execution is triggered for that node only
  - [ ] Given execution is in progress, when it completes, then the loading indicator is removed and the node displays the result
```

Inside GWT sub-items there is **no lead-in anchor** (the parent line carries it), and still **at most one bold span per sub-item**: bold the UI element the action targets (e.g. clicks **Execute step**). Backtick exact UI copy as usual; a sub-item that names no element has no bold.

> GWT sub-items must use `- [ ]` (not plain `- `) so Jira renders them as a nested task list.

### Context sentence (optional)

For complex ACs, add a **brief plain-text sentence** between the AC heading and the checklist to set scope and intent. Keep it to one or two sentences.

```markdown
**AC3 — Activate / Deactivate Toggle**

The toolbar power icon lets the user toggle the node between active and deactivated states. Visual feedback updates immediately without a page reload.

- [ ] **Power icon** click toggles the node between active and deactivated
- [ ] **Status toggle** reflects current node state:
  - [ ] When active → tooltip shows `Deactivate`
  - [ ] When inactive → tooltip shows `Activate`
```

## Specificity (required)

### Behavioral (must-write)

Observable outcomes that define pass/fail — these are hard requirements:

- **Copy**: page title, button labels, menu labels, tooltip text — backtick whenever the exact string is **asserted to appear**; naming an element without asserting its characters follows the bold/plain rules (see Inline formatting).
- **Tables**: Column names, empty states (e.g. `—`), badges/counts.
- **Formats**: Dates (`YYYY-MM-DD HH:mm:ss`), `{username}` placeholders if needed.
- **State**: What shows when active vs inactive; secondary lines under titles (e.g. `(Deactivated)`).
- **Empty / boundary states**: What appears when a list is empty, a limit is reached, or input is invalid — include in ACs when the behavior is **confirmed by product**.

### Visual design reference

Layout and styling details extracted from mockups that **may change with design iterations**. Tag these with `(design ref)` so the team knows they come from the current mockup and are subject to change. Because design refs are non-binding, they are **italicised** as non-normative asides (see Inline formatting → Italic):

- Colors (e.g. destructive styling) → `*(design ref: red)*`
- Positions (e.g. button placement) → `*(design ref: top-right corner)*`
- Icon types → `*(design ref: play icon, trash icon)*`
- Spacing, sizing, layout direction

```markdown
- [ ] **Delete** icon tooltip text is `Delete`
- [ ] **Delete** icon uses destructive styling *(design ref: red)*
- [ ] **Toolbar button order** left-to-right: Execute step, Activate/Deactivate, Delete *(design ref: play icon, power icon, trash icon)*
```

## Workflow

1. **Receive inputs**: images and/or text descriptions from the user.
2. **Analyse images**: extract visible UI text, layout, states, interactions, icons, and visual cues.
3. **Draft Description**: single coherent "As a … / I want … / So that …".
4. **Decompose ACs**: group by screen area or user task (display → filters → primary actions → secondary/menus → post-conditions). Separate AC sections with `---`.
5. **Expand**: checklist lines first; use GWT sub-items where preconditions matter; add **Optional** for edge cases and open questions.
6. **Self-check**: every branch and post-action refresh is covered; no ambiguous "works correctly." Edge cases and error states are surfaced in **Optional** if not already covered in ACs.
7. **Write** the complete markdown to `/tmp/{slug}-story-draft.md` using the Write file tool.
8. **STOP**: present the file path to the user and wait for review and confirmation.

## Minimal template

```markdown
As a {role},
I want {capability},
So that {benefit}.

**AC1 — {ShortTitle}**

{Optional context sentence describing the scope of this AC.}

- [ ] **{UI element or concept}** {expected behavior with `exact labels` in backticks}
- [ ] **{Another element}** {behavior} *(design ref: {visual detail from mockup})*

---

**AC2 — {ShortTitle}**

- [ ] **{Element}** reflects current state:
  - [ ] When {condition A} → {outcome with `label`}
  - [ ] When {condition B} → {outcome with `label`}

---

**AC3 — {ShortTitle}**

- [ ] **{Element}** {summary of behavior with preconditions}:
  - [ ] Given {precondition A}, when {action}, then {outcome}
  - [ ] Given {precondition B}, when {action}, then {outcome}

---

**Optional**

- [ ] **{Element}** {open question or unconfirmed behavior}
- [ ] **{Error state}** — {what happens when something fails}
- [ ] **{Boundary condition}** — {edge case behavior}
```

## Additional examples

For full worked examples (list page + node toolbar), see [examples.md](examples.md).
