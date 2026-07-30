# jira-product-skills

Personal Cursor agent skills for Jira story workflow.

## Skills

| Skill | Description |
|-------|-------------|
| [jira-story-draft](jira-story-draft/SKILL.md) | Draft Jira user stories with checklist-style acceptance criteria |
| [jira-story-publish](jira-story-publish/SKILL.md) | Publish a confirmed draft to Jira (default `projectKey` TSWE) |
| [jira-story-lookup](jira-story-lookup/SKILL.md) | Look up acceptance criteria from an existing Jira ticket |
| [epic-title-authoring](epic-title-authoring/SKILL.md) | Draft and harmonize Agile epic titles for any backlog |
| [md-to-adf](md-to-adf/SKILL.md) | Convert Markdown to Atlassian Document Format (ADF) JSON |

## Installation

Run this in the root of the repo you want the skills available in:

```bash
npx skills add shanelin7783/jira-product-skills
```

The interactive prompts cover:

1. **Scope** — Project (default, writes to `./.agents/skills/`) or Global
2. **Skills** — multi-select from the 5 above
3. **Agents** — auto-detects installed agents; pick Cursor, Claude Code, Codex, etc.
4. **Method** — Symlink (default, recommended) or Copy

Installing writes a `skills-lock.json` you can commit so the whole team gets the same version.

### Scope

| Scope | Command | Cursor path | Use for |
|-------|---------|-------------|---------|
| **Project** (default) | `npx skills add shanelin7783/jira-product-skills` | `.agents/skills/` | Shared in a team repo, version-controlled |
| **Global** | `npx skills add shanelin7783/jira-product-skills -g` | `~/.cursor/skills/` | Available across all your projects |

### Agents and platforms

```bash
# Interactive agent selection (default)
npx skills add shanelin7783/jira-product-skills

# Install to several platforms at once
npx skills add shanelin7783/jira-product-skills -a cursor -a claude-code -a codex

# Install specific skills only
npx skills add shanelin7783/jira-product-skills -s jira-story-draft -s md-to-adf

# Preview without installing
npx skills add shanelin7783/jira-product-skills --list
```

With multiple agents, the canonical copy lives in `.agents/skills/<name>/` and directories like `.claude/skills/<name>/` symlink to it — one install, one source of truth.

On Windows, symlinks need Developer Mode or an elevated shell; add `--copy` if that is inconvenient.

### Non-interactive / CI

```bash
npx skills add shanelin7783/jira-product-skills \
  -s jira-story-draft \
  -s jira-story-publish \
  -s md-to-adf \
  -a cursor \
  -y
```

### Maintenance

```bash
npx skills list          # show installed skills
npx skills update        # update to latest
npx skills remove <name> # remove a skill
```

Full CLI reference: [vercel-labs/skills](https://github.com/vercel-labs/skills).

## Requirements

- Node.js 18+ (for md-to-adf)
- Atlassian MCP server configured in your agent (for jira-story-publish and jira-story-lookup)
- Site-specific settings (`cloudId`, custom field ids) — see [jira-story-publish/reference.md](jira-story-publish/reference.md). These are a snapshot of the Arcadie Jira Cloud instance; re-verify if your admin changes the field configuration.
