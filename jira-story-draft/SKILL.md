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

## Specificity (required)

Include wherever relevant:

- **Copy**: Page title, button labels, menu labels, **tooltip** text.
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

- [ ] …
- [ ] …

---

**AC2 — {ShortTitle}**

- [ ] …

---

**Optional**

- [ ] …
```

## Additional examples

For full worked examples (list page + node toolbar), see [examples.md](examples.md).
