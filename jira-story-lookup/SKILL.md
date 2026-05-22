---
name: jira-story-lookup
description: >-
  Fetches a Jira user story's acceptance criteria (DoR/AC/DoD), description,
  or Remark field. Use when the user asks to look up, read, show, or check
  the ACs, DoR/AC/DoD, acceptance criteria, description, or Remark of a
  Jira ticket.
---

# Jira: Look up story fields (AC, Description, Remark)

## When to apply

Use this skill when the user asks to **look up**, **read**, **show**, or **check**:

- ACs / DoR/AC/DoD / acceptance criteria (e.g. "show me TSWE-105's ACs")
- **Description** (user story: As a / I want / So that)
- **Remark** (e.g. "read TSWE-235's Remark")

## Tools used in this skill

| Tool | Purpose |
|------|---------|
| MCP `getJiraIssue` (server: `plugin-atlassian-atlassian`) | Fetch issue fields |

**No other tools are used.** This is a **read-only** skill — do NOT create, edit, or modify any Jira issue.

## MCP call template

Include only the fields the user asked for (plus `summary` for the header).

### Acceptance criteria (default)

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "issueIdOrKey": "<issue key, e.g. TSWE-105>",
  "fields": ["summary", "description", "customfield_10115"],
  "responseContentFormat": "markdown"
}
```

### Description only

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "issueIdOrKey": "<issue key>",
  "fields": ["summary", "description"],
  "responseContentFormat": "markdown"
}
```

### Remark only

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "issueIdOrKey": "<issue key>",
  "fields": ["summary", "customfield_10178"],
  "responseContentFormat": "markdown"
}
```

### Multiple fields (e.g. Description + Remark)

Add each field id to the `fields` array in one call — do not make separate API calls unless the user only asked for one field.

```jsonc
{
  "cloudId": "d6d0669c-de5c-489c-a712-6e3ebf62d37a",
  "issueIdOrKey": "<issue key>",
  "fields": ["summary", "description", "customfield_10178"],
  "responseContentFormat": "markdown"
}
```

### Critical field mapping

| UI label | Field id | Notes |
|----------|----------|-------|
| DoR/AC/DoD | `customfield_10115` | ADF document; markdown when `responseContentFormat` is `"markdown"` |
| Description | `description` | Plain string; user story only on TSWE Stories (ACs live in DoR/AC/DoD) |
| Remark | `customfield_10178` | ADF rich text; markdown when `responseContentFormat` is `"markdown"` |

**WARNING — DoR/AC/DoD:** Use `customfield_10115`. Do **NOT** use `customfield_11878` — that is a different field.

**WARNING — Remark:** Use `customfield_10178` (UI label **Remark**). Do **NOT** confuse with:

| UI label | Field id |
|----------|----------|
| Remarks | `customfield_10108` |
| Dev Internal Remark | `customfield_11802` |
| Flagged Remark | `customfield_11863` |

## Workflow: Acceptance criteria

1. **Call `getJiraIssue`** with the AC template, filling in the user-provided issue key.

2. **Check `customfield_10115`** (DoR/AC/DoD):
   - If **non-null and non-empty**: present this content as the acceptance criteria. Label it as **DoR/AC/DoD**.

3. **Fallback — check `description`** (only if `customfield_10115` is null/empty):
   - Scan the `description` field for AC-like patterns: `AC1`, `**AC`, `Acceptance Criteria`, checklist items (`- [ ]`), numbered criteria.
   - If found: extract and present the AC sections. Label them as **from Description (no DoR/AC/DoD field set)**.
   - If not found: report that **no acceptance criteria were found** on this ticket.

4. **Output format**: Always include:
   - Issue key and summary as a header (with Jira link: `https://arcadie.atlassian.net/browse/<key>`)
   - The source label (DoR/AC/DoD vs Description)
   - The AC content in readable markdown

## Workflow: Description

1. **Call `getJiraIssue`** with `fields`: `["summary", "description"]`.

2. **Present `description`** as **Description**. If null or empty, report that the Description field is empty.

3. **Output format**: Header + link + **Description** label + content. Do not pull ACs from Description unless the user asked for acceptance criteria.

## Workflow: Remark

1. **Call `getJiraIssue`** with `fields`: `["summary", "customfield_10178"]` and `responseContentFormat`: `"markdown"`.

2. **Check `customfield_10178`**:
   - If **non-null and non-empty** (ADF `content` array has blocks, or markdown string is non-blank): present as **Remark**.
   - If the API returns ADF JSON instead of markdown, extract plain text from `content[].content[].text` nodes — do not dump raw ADF to the user unless extraction fails.
   - If **null or empty**: report that the **Remark** field is empty on this ticket.

3. **Output format**: Always include:
   - Issue key and summary as a header (with Jira link: `https://arcadie.atlassian.net/browse/<key>`)
   - Label **Remark** (source: `customfield_10178`)
   - The remark content in readable markdown

## Guardrails

- Do **NOT** create, edit, or modify any Jira issue.
- Do **NOT** call `getAccessibleAtlassianResources` or any other discovery tool — use the hardcoded `cloudId`.
- Do **NOT** guess or fabricate field content. Only present what is returned by the API.
- If the API call fails, **STOP** and report the error to the user.

## Reference

The `cloudId` and field IDs are site-specific to the Arcadie Jira Cloud instance. See [`../jira-story-publish/reference.md`](../jira-story-publish/reference.md) for the shared field mapping table.
