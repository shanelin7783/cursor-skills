---
name: jira-story-draft
description: >-
  Writes Jira user stories with Description (As a / I want / So that), numbered acceptance
  criteria with short titles, nested bullets, and checklist-style verifiable items.
  Use when the user asks for Jira tickets, user stories, acceptance criteria, AC,
  backlog items, PRD story format, QA checklists, or refining requirements into
  testable criteria.
---

# Jira Story Draft (checklist-friendly)

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

3. **Acceptance content** — Prefer **one verifiable behavior per checklist line**. Group related lines under the same AC.

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

## Checklist mode (default)

Use Markdown task items:

```markdown
- [ ] …
```

Rules:

- Each `- [ ]` maps to **one** testable outcome (or one clearly bounded UI rule).
- Put **unset decisions** under **`Optional`** with `- [ ]` items (e.g. confirm dialog for delete, extra "More" menu).
- Keep the same ordering as the UI (e.g. left-to-right toolbar buttons).

## Inline formatting (readability)

Apply the following formatting **inside** each checklist line to help readers scan and understand quickly. These all survive ADF conversion (bold → `strong`, backtick → `code`).

### Bold the subject

Start each checklist line by **bolding the UI element, component, or concept** being verified. This gives the reader an instant visual anchor.

```markdown
- [ ] **Page title** displays "Workflows"
- [ ] **"+ Add Workflow" button** is displayed in the top-right corner
- [ ] **Table columns** include Name, Used By, Status, Created Date, Last Updated Date, Action
```

### Inline code for exact UI copy

Wrap **exact labels, tooltip text, placeholder text, field names, and error messages** in backticks so they stand out as literal copy that must match.

```markdown
- [ ] **Execute step** icon tooltip text is `Execute step`
- [ ] **Delete** icon tooltip text is `Delete`
- [ ] **Search field** placeholder text is `Search workflows…`
- [ ] When validation fails, error message shows `Name is required`
```

### Nested items for conditions

When a single behavior has **conditional branches or multiple states**, use a parent line describing the scope, followed by indented sub-items for each branch:

```markdown
- [ ] **Status toggle** reflects current node state:
  - [ ] When active → tooltip shows `Deactivate`
  - [ ] When inactive → tooltip shows `Activate`
  - [ ] When inactive → a gray `(Deactivated)` label appears below the node title
```

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

Include wherever relevant:

- **Copy**: Page title, button labels, menu labels, **tooltip** text — wrap in backticks (`` ` ``).
- **Tables**: Column names, empty states (e.g. `—`), badges/counts.
- **Formats**: Dates (`YYYY-MM-DD HH:mm:ss`), `{username}` placeholders if needed.
- **Visuals**: Label colors (e.g. green/gray), destructive styling (e.g. red outline for delete).
- **State**: What shows when active vs inactive; secondary lines under titles (e.g. `(Deactivated)`).

## Workflow

1. **Receive inputs**: images and/or text descriptions from the user.
2. **Analyse images**: extract visible UI text, layout, states, interactions, icons, and visual cues.
3. **Draft Description**: single coherent "As a … / I want … / So that …".
4. **Decompose ACs**: group by screen area or user task (display → filters → primary actions → secondary/menus → post-conditions). Separate AC sections with `---`.
5. **Expand**: checklist lines first; add **Optional** for open questions.
6. **Self-check**: every branch and post-action refresh is covered; no ambiguous "works correctly."
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
- [ ] **{Another element}** {behavior}

---

**AC2 — {ShortTitle}**

- [ ] **{Element}** reflects current state:
  - [ ] When {condition A} → {outcome with `label`}
  - [ ] When {condition B} → {outcome with `label`}

---

**Optional**

- [ ] **{Element}** {open question or unconfirmed behavior}
```

## Additional examples

For full worked examples (list page + node toolbar), see [examples.md](examples.md).
