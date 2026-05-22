---
name: jira-story-publish-ogg
description: >-
  Publishes jira-story-draft-ogg output to Jira via Atlassian MCP: Description (As/I want/So that),
  DoR + Gherkin AC + FIXED DoD + Refinement Notes as ADF. Requires projectKey; optional Epic.
  Warns if Refinement Notes block Sprint-ready. Pair with jira-story-draft-ogg after user confirms draft.
---

# Jira: Publish OGG story to Jira

## When to apply

Use after **[jira-story-draft-ogg](../jira-story-draft-ogg/SKILL.md)** has produced a **confirmed** draft `.md` file. This skill governs **field mapping**, **MCP calls**, **OGG pre-publish checks**, and **markdown → ADF** conversion — **not** rewriting the narrative.

Sibling to [jira-story-publish](../jira-story-publish/SKILL.md) (legacy checklist drafts).

**Draft shape (OGG — required structure):**

| Part | Content |
|------|---------|
| Description | As / I want / So that (only) |
| DoR/AC/DoD field | `**DoR — Definition of Ready**` through EOF: DoR + AC1… + **DoD** + **Refinement Notes (BLOCKING DoR)** |

## Prerequisites

The user must provide:

1. **Confirmed draft file** — from `jira-story-draft-ogg`, already reviewed and approved.
2. **Summary** (ticket title) — exact string for Jira `summary`.
3. **`projectKey`** (required) — Jira project for the squad, e.g. `TSWE`, `TSRE`, `INIT`.
4. **Epic key** (optional) — e.g. `TSWE-66`; sets `parent` and Epic Link when provided.

Optional overrides (if omitted, use defaults from [reference.md](../jira-story-publish/reference.md)):

- **Squad** — multiselect option ids for `customfield_18750`
- **Brand Markets** — multiselect option ids for `customfield_11476`

## OGG pre-publish checks

Run **before** any MCP call. Do **not** modify draft content.

### 1. Structure gate (hard STOP)

| Check | Action if fail |
|-------|----------------|
| File contains a line starting with `**DoR` (e.g. `**DoR — Definition of Ready**`) | **STOP** — draft is not OGG-shaped; re-draft with `jira-story-draft-ogg` or use `jira-story-publish` for legacy drafts |
| File contains `**DoD — Definition of Done` | **STOP** — missing story-level FIXED DoD |
| File contains `**Refinement Notes` | **STOP** — missing Refinement Notes section |

### 2. Refinement Notes gate (warn + confirm)

If the **Refinement Notes** section contains any unchecked item (`- [ ]` with non-empty text after it):

1. Tell the user: story is **NOT SPRINT-READY** per Playbook §7.2 (open questions = lacks shared understanding).
2. Ask explicitly: **"Publish to Jira anyway?"**
3. Proceed only after user confirms. In the final report, prefix with **`⚠ NOT SPRINT-READY`** when this applied.

Creating a Jira ticket for backlog tracking is allowed; do not imply the story is ready for Sprint Planning.

### 3. Description

- Extract only `As a …` / `I want …` / `So that …` lines before `**DoR`.
- **STOP** if `So that` line is missing.

## Tools & scripts used in this skill

Do **NOT** use any tool not listed here during execution.

### Markdown to ADF conversion

| Step | Tool | Purpose |
|------|------|---------|
| Convert DoR/AC/DoD markdown to ADF | **[md-to-adf](../md-to-adf/SKILL.md)** skill | Reads markdown, writes ADF JSON to stdout |

### MCP calls (server: `plugin-atlassian-atlassian`)

**A. `createJiraIssue`** — create the Story

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "projectKey": "<user-provided projectKey>",
  "issueTypeName": "Story",
  "summary": "<user-provided ticket title>",
  "description": "<Description three lines from draft>",
  "contentFormat": "markdown",
  "additional_fields": {
    "customfield_18750": [{"id": "26753"}],
    "customfield_11476": [
      {"id":"14237"},{"id":"14238"},{"id":"14239"},
      {"id":"14242"},{"id":"14243"},{"id":"14244"},{"id":"14245"}
    ],
    "parent": {"key": "<epic-key>"},
    "customfield_10014": "<epic-key>"
  }
}
```

Replace `customfield_18750` / `customfield_11476` values when the user supplied Squad or Brand Markets overrides. Omit `parent` and `customfield_10014` if no Epic. Response `key` (e.g. `TSWE-105`) is used in step B.

**B. `editJiraIssue`** — set DoR/AC/DoD

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "issueIdOrKey": "<key from step A>",
  "fields": {
    "customfield_10115": "<ADF JSON object from md-to-adf skill>"
  },
  "contentFormat": "adf"
}
```

**No other MCP tools or scripts are used.**

Field IDs: [reference.md](../jira-story-publish/reference.md) (Arcadie site snapshot; shared across OGG squads on this instance).

## Content rules

### Description

- **Only** the three user-story lines before the first `**DoR` line.
- **Do not** add screenshot / manual-upload hints.

### DoR/AC/DoD (`customfield_10115`)

- **Only** from the first `**DoR` line through EOF (includes DoR, all AC blocks, DoD, Refinement Notes).
- Must be **ADF** via **[md-to-adf](../md-to-adf/SKILL.md)** — WYSIWYG; no normalization.
- **Do not** hand-author large ADF in chat.

Markdown format: **[jira-story-draft-ogg](../jira-story-draft-ogg/SKILL.md)** → "Output shape".

## Workflow

1. **Read** the confirmed draft `.md` file.
2. **OGG pre-publish checks** — structure gate; Refinement Notes warn/confirm if needed.
3. **Extract Description** — lines from start until (but not including) the first line that starts with `**DoR`.
4. **Extract DoR/AC/DoD** — from that `**DoR` line through EOF. **Write** to `/tmp/{slug}-dor-ac-dod.md`.
5. **Convert to ADF** — md-to-adf on `/tmp/{slug}-dor-ac-dod.md`; capture ADF JSON.
6. **MCP `createJiraIssue`** — `projectKey` from user; defaults/overrides for Squad and Brand Markets per prerequisites.
7. **MCP `editJiraIssue`** — set `customfield_10115` with ADF from step 5.
8. **Report** issue key and URL; include `⚠ NOT SPRINT-READY` if Refinement Notes gate fired. **Shell** — `rm /tmp/{slug}-dor-ac-dod.md`.

If any MCP call fails: **STOP**, report error and full payload; do not swap field strategies silently.

## Guardrails

- Do **NOT** modify confirmed draft content.
- Do **NOT** publish without `**DoR` (no fallback to `**AC1` only).
- Do **NOT** skip Refinement Notes confirmation when unchecked items exist.
- Do **NOT** write custom scripts or implementation code.
- Do **NOT** call MCP tools not listed above.

## Reference

Site-specific field IDs and Brand Markets defaults: [jira-story-publish/reference.md](../jira-story-publish/reference.md).
