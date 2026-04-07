---
name: md-to-adf
description: >-
  Convert Markdown to Atlassian Document Format (ADF) JSON. Pre-bundled — no npm
  install needed. Use when another skill or the user needs to produce ADF from
  markdown (e.g. for Jira custom fields that require ADF).
---

# Markdown to ADF converter

## When to apply

Use this skill when you need to convert a Markdown file to ADF JSON — typically
called by [jira-story-publish](../jira-story-publish/SKILL.md), but can be used
standalone for any markdown-to-ADF conversion.

## Prerequisites

- Node.js 18+ installed on the machine.
- No other dependencies needed — the script is pre-bundled.

## Tools used in this skill

| Tool | Purpose |
|------|---------|
| Shell | Run conversion script |

## Workflow

1. **Convert** (Shell):
   ```bash
   node ~/.cursor/skills/cursor-skills/md-to-adf/md_to_adf.bundle.cjs --compact <input.md>
   ```
   Output: ADF JSON to stdout. Capture and parse the JSON for use in MCP calls.

## Conversion mapping

| Markdown | ADF |
|----------|-----|
| `**ACn — Title**` | `paragraph` with `strong` mark |
| `---` | `rule` node |
| `- [ ]` / `- [x]` | `taskItem` inside `taskList` |
| `**bold**` inline | `text` with `strong` mark |
| `` `code` `` inline | `text` with `code` mark |
| `- item` | `bulletList` / `listItem` |
| Links, headings, etc. | Full Atlaskit markdown spec supported |

The converter is **WYSIWYG** — it faithfully translates the input markdown without normalization. Section titles must already be bold (`**…**`) and use em dash (`—`) in the source; separators must be explicit `---` lines.

After conversion, `content` alternates like: `paragraph` (bold title) → `taskList` → `rule` → … → `paragraph` → `taskList` (no trailing `rule`).

## Guardrails

- Do NOT modify the input markdown.
- Do NOT hand-author ADF; always use this script.
- Pipe the **parsed JSON object** (not the file path string) into the MCP call.
