# cursor-skills

Personal Cursor agent skills for Jira story workflow.

## Skills

| Skill | Description |
|-------|-------------|
| [jira-story-draft](jira-story-draft/SKILL.md) | Draft Jira user stories with checklist-style acceptance criteria |
| [jira-story-publish](jira-story-publish/SKILL.md) | Publish a drafted story to Jira via Atlassian MCP |
| [jira-story-lookup](jira-story-lookup/SKILL.md) | Look up acceptance criteria from an existing Jira ticket |
| [md-to-adf](md-to-adf/SKILL.md) | Convert Markdown to Atlassian Document Format (ADF) JSON |

## Installation

### Option A: Cursor Remote Rule (recommended)

1. Open **Cursor Settings** (Cmd+Shift+J)
2. Go to **Rules** → **Add Rule** → **Remote Rule (Github)**
3. Paste: `https://github.com/shanelin7783/cursor-skills`

### Option B: Git clone

```bash
git clone git@github.com:shanelin7783/cursor-skills.git ~/.cursor/skills/cursor-skills
```

Restart Cursor after installation. All 4 skills will be available.

## Requirements

- Node.js 18+ (for md-to-adf)
- Atlassian MCP server configured in Cursor (for jira-story-publish and jira-story-lookup)
