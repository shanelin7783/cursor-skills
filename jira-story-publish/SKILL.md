---
name: jira-story-publish
description: >-
  Creates a Jira Story from jira-story-draft output using Atlassian MCP: Summary,
  Epic link, default Squad (Tech SaaS) and Brand Markets, Description (user story
  only), DoR/AC/DoD as ADF via md-to-adf skill. Use when publishing legacy
  checklist-style drafts. For OGG Playbook drafts, use jira-story-publish-ogg instead.
---

# Jira: Publish story to Jira (legacy draft)

## When to apply

Use after **[jira-story-draft](../jira-story-draft/SKILL.md)** has produced a **confirmed** draft `.md` file. This skill governs **field mapping**, **defaults**, **MCP calls**, and **markdown → ADF** conversion — **not** rewriting the narrative.

For drafts from **[jira-story-draft-ogg](../jira-story-draft-ogg/SKILL.md)**, use **[jira-story-publish-ogg](../jira-story-publish-ogg/SKILL.md)** instead.

**Draft shape (legacy):**

| Part | Content |
|------|---------|
| Description | As / I want / So that |
| DoR/AC/DoD field | DoR + AC1… + DoD + Optional — from first `**DoR` or `**AC` through EOF |

## Prerequisites

The user must provide:

1. **Confirmed draft file** — from `jira-story-draft` (e.g. `/tmp/node-modal-story-draft.md`), already reviewed and approved.
2. **Summary** (ticket title) — exact string for Jira `summary` (e.g. `[Editor]As a user, I want…`).
3. **Epic key** (optional) — e.g. `TSWE-66`, sets parent Epic on the Story.

Defaults: `projectKey` **TSWE**, Squad **Tech SaaS**, full Brand Markets set — see [reference.md](reference.md).

## Tools & scripts used in this skill

Every external tool, script, and MCP call is listed below. Do **NOT** use any tool not listed here during execution.

### Markdown to ADF conversion

| Step | Tool | Purpose |
|------|------|---------|
| Convert AC markdown to ADF | **[md-to-adf](../md-to-adf/SKILL.md)** skill | Reads markdown, writes ADF JSON to stdout |

### MCP calls (server: `plugin-atlassian-atlassian`)

**A. `createJiraIssue`** — create the Story

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "projectKey": "TSWE",
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

Omit `parent` and `customfield_10014` from `additional_fields` if no Epic is provided. Response contains `key` (e.g. `TSWE-105`) used in the next call.

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

**No other MCP tools or scripts are used.** Do NOT call `getJiraIssue`, `getAccessibleAtlassianResources`, or any other discovery/query tools during execution.

Field IDs and option IDs are site-specific. See [reference.md](reference.md) for full tables and notes.

## Content rules

### Description

- **Only** the three user-story lines: `As a …` / `I want …` / `So that …` (taken directly from the top of the draft file).
- **Do not** add screenshot / manual-upload hints.

### DoR/AC/DoD (`customfield_10115`)

- Contains **DoR**, **AC1…**, **DoD**, and **Optional** (everything from the first `**DoR` or `**AC` line through end of file). Legacy drafts without `**DoR` may start at `**AC1`.
- Must be **ADF** — convert using the **[md-to-adf](../md-to-adf/SKILL.md)** skill, then pass the JSON object to `editJiraIssue`.
- **Do not** hand-author large ADF in chat.

### AC markdown conventions

Defined in **[jira-story-draft](../jira-story-draft/SKILL.md)** → "Output shape". The md-to-adf skill faithfully converts it to ADF without normalization (WYSIWYG).

## Workflow

Execute these steps in order, using only the tools listed in "Tools & scripts used in this skill":

1. **Read** the confirmed draft `.md` file (Read tool).
2. **Extract Description** — all lines from the start of the file up to the first `**DoR` or `**AC` line. This becomes the `description` string.
3. **Extract DoR/AC/DoD** — everything from the first `**DoR` or `**AC` line to the end of the file. **Write** to `/tmp/{slug}-dor-ac-dod.md` (Write tool).
4. **Convert to ADF** — invoke the **[md-to-adf](../md-to-adf/SKILL.md)** skill on `/tmp/{slug}-dor-ac-dod.md` and capture stdout as ADF JSON.
5. **MCP `createJiraIssue`** — call with the exact argument template from above, filling in `summary`, `description`, and Epic fields as applicable.
6. **MCP `editJiraIssue`** — call with the exact argument template from above, using the `key` from step 5 and the parsed ADF JSON from step 4.
7. **Report** the created issue key and URL to the user. **Shell** — `rm /tmp/{slug}-dor-ac-dod.md` to clean up.

If **createJiraIssue** fails: **STOP**, report the error and full payload; do **not** silently swap field strategies. If **editJiraIssue** fails: **STOP** and report.

## Guardrails

- Do **NOT** modify the confirmed draft content (formatting, wording, ACs).
- Do **NOT** write custom scripts — use only the md-to-adf skill as documented.
- Do **NOT** write implementation code.
- Do **NOT** call any MCP tool not listed in "Tools & scripts used in this skill".
- If any MCP call fails, **STOP** and report the error and full payload to the user.

## Reference

See [reference.md](reference.md) for site-specific field IDs and Brand Markets option IDs.
