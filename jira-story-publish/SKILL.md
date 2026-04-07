---
name: jira-story-publish
description: >-
  Creates a Jira Story from jira-story-draft output using Atlassian MCP: Summary,
  Epic link, default Squad (Tech SaaS) and Brand Markets, Description (user story
  only), DoR/AC/DoD as ADF via md-to-adf skill. Use when the user wants to open a
  real Jira ticket from a drafted user story, TSWE Story, Epic parent, or
  automating createJiraIssue plus editJiraIssue for acceptance criteria.
---

# Jira: Publish story to Jira

## When to apply

Use after **[jira-story-draft](../jira-story-draft/SKILL.md)** (or equivalent) has produced a **confirmed** draft `.md` file containing **Description** + **AC1…** text. This skill governs **field mapping**, **defaults**, **MCP calls**, and **markdown → ADF** conversion — **not** rewriting the narrative.

## Prerequisites

The user must provide:

1. **Confirmed draft file** — a `.md` file from the jira-story-draft phase (e.g. `/tmp/node-modal-story-draft.md`) that the user has already reviewed and approved.
2. **Summary** (ticket title) — exact string for Jira `summary` (e.g. `[Editor]As a user, I want…`).
3. **Epic key** (optional) — e.g. `TSWE-66`, sets parent Epic on the Story.

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

- Contains **AC1…** and **Optional** sections only (everything after the Description block in the draft).
- Must be **ADF** — convert using the **[md-to-adf](../md-to-adf/SKILL.md)** skill, then pass the JSON object to `editJiraIssue`.
- **Do not** hand-author large ADF in chat.

### AC markdown conventions

The AC markdown format is defined in **[jira-story-draft](../jira-story-draft/SKILL.md)** → "Output shape". The md-to-adf skill faithfully converts it to ADF without normalization (WYSIWYG).

## Workflow

Execute these steps in order, using only the tools listed in "Tools & scripts used in this skill":

1. **Read** the confirmed draft `.md` file (Read tool).
2. **Extract Description** — all lines from the start of the file up to the first `**AC` line. This becomes the `description` string.
3. **Extract ACs** — everything from the first `**AC` line to the end of the file. **Write** to `/tmp/{slug}-ac.md` (Write tool).
4. **Convert ACs to ADF** — invoke the **[md-to-adf](../md-to-adf/SKILL.md)** skill on `/tmp/{slug}-ac.md` and capture stdout as ADF JSON.
5. **MCP `createJiraIssue`** — call with the exact argument template from above, filling in `summary`, `description`, and Epic fields as applicable.
6. **MCP `editJiraIssue`** — call with the exact argument template from above, using the `key` from step 5 and the parsed ADF JSON from step 4.
7. **Report** the created issue key and URL to the user. **Shell** — `rm /tmp/{slug}-ac.md` to clean up.

If **createJiraIssue** fails: **STOP**, report the error and full payload; do **not** silently swap field strategies. If **editJiraIssue** fails: **STOP** and report.

## Guardrails

- Do **NOT** modify the confirmed draft content (formatting, wording, ACs).
- Do **NOT** write custom scripts — use only the md-to-adf skill as documented.
- Do **NOT** write implementation code.
- Do **NOT** call any MCP tool not listed in "Tools & scripts used in this skill".
- If any MCP call fails, **STOP** and report the error and full payload to the user.

## Reference

See [reference.md](reference.md) for site-specific field IDs and Brand Markets option IDs.
