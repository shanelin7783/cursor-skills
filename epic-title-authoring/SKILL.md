---
name: epic-title-authoring
description: Drafts and harmonizes Agile epic titles for ANY backlog (product-agnostic). Supply the project's glossary and existing epics; the skill picks among capability, outcome, config, runtime, and lifecycle patterns, keeps parallel grammar within a family, and enforces domain vocabulary. Use when writing or reviewing epic titles, backlog wording, capability labels, or when the user attaches an epic list for consistency.
disable-model-invocation: true
---

# Epic Title Authoring (product-agnostic)

A reusable **design pattern** for naming Agile epics in **any** project and domain. The
*method* (patterns, selection heuristic, house-style discipline, output format) lives here; the
*content* (domain vocabulary, family grammars, example set) is loaded per project in Step 0 — this
skill is not bound to any one product.

## When to apply

Authoring or refactoring **epic titles** for any backlog: capabilities, initiatives, or epic
groupings — frontend, backend, or full-stack.

Do **not** use it for **story/task** titles (epics stay broader — see Anti-Patterns), release/version
labels, or marketing copy, unless the user explicitly asks for the same wording rules.

---

## Step 0 — Load the project profile (REQUIRED before drafting)

A title must fit the project's language and read consistently beside its sibling epics. Before
proposing anything, gather three inputs:

1. **Canonical glossary** — the project's domain terms (a `CONTEXT.md`, glossary doc, data model, or
   ask the user). Titles **reuse these exact nouns**; never introduce a synonym for a concept the
   project already names.
2. **Existing / neighbouring epics** — the current backlog rows, for **parallel grammar** and to
   avoid **duplicate** epics.
3. **House style** — verb-led, noun-led, or mixed; plus any convention the team already follows.

If the project keeps a **profile file** (house style + family grammars + example set — see the
Appendix template), read it and follow it. If no glossary or profile exists, derive the vocabulary
with the user first, and offer to save a profile so future titles stay consistent.

> Without Step 0 you will invent terms and break parallelism. Do it every time.

---

## Patterns — pick by the epic's nature, not by a fixed opening word

There is **no single mandatory opener**. Choose the pattern that fits what the epic *is*; keep one
family internally parallel. (Examples below are illustrative across domains — swap for the project's
own vocabulary.)

| # | Template | Use when | Illustrative example |
|---|----------|----------|----------------------|
| **P1** | `Enable users to <config/CRUD verb> <object>` | A human operator configures/manages something in an admin/authoring UI | `Enable users to create and edit tax-rule sets` |
| **P2** | `Support <runtime/build-time capability>` | The platform/engine gains a capability; often no human subject | `Support order fulfilment triggered by payment capture` |
| **P3** | `<Capability noun phrase>` (noun-led label) | A cohesive capability area or **grouping/initiative-level** row where a verb adds nothing | `Version history`, `Publish & unpublish`, `Fraud scoring` |
| **P4** | `<Outcome verb> <object> so that <benefit>` | The benefit is not obvious from the capability alone and is worth stating | `Retire a customer account so that data-retention rules are honoured` |
| **P5** | `<Gerund> <X> as a <domain unit>` (family grammar) | One of a **parallel set** (e.g. actions, connectors) where sibling consistency matters most | `Support sending email as a workflow action` |
| **P6** | `<Verb> a <domain object> <mode/scope>` (mode family) | Run-mode / scope epics that should read as a set | `Support running a complete workflow graph` |
| **P7** | `Manage <lifecycle object>` (lifecycle) | Lifecycle/state-management epics that are neither CRUD nor a single runtime capability | `Manage the subscription billing lifecycle` |

**Selection heuristic**

- Capability grouping / initiative-level → **P3**
- A human configures something → **P1**
- The system can now do X at run/build time → **P2 / P5 / P6**
- The benefit needs spelling out → **P4**
- A true lifecycle / state machine → **P7** (use sparingly — "Manage" drifts vague)

**Family grammar rule (applies to P2/P5/P6):** when several epics form a set (all triggers, all
actions, all run modes), fix **one subject noun** and **one verb cluster** across the whole family
and vary only the specific. Parallel grammar across siblings beats picking the "best" wording per
row.

---

## Rule checklist

**Do**
- Name an **outcome or capability**, not a task ("Publish & unpublish", not "Add a publish button").
- Stay **broad** — an epic is deliberately not sprint-ready; if it reads like a story, it's a story.
- Keep **parallel grammar within a family**.
- Use the project's **canonical vocabulary** (Step 0) — never mix synonyms for one concept.
- Keep it **short and scannable** — roughly **3–9 words / under ~60 characters**; front-load the
  distinguishing noun.
- Make it **observable** — a reader can tell what "done" broadly looks like.

**Don't**
- No **implementation detail** — framework names, "add API", ticket numbers, engine internals.
- No **UI-surface names** in the title (`… with a name modal`, `… on the history button`); surfaces
  go stale — push them to the epic **description**.
- No **release / fix-version** info in the title — that belongs in its own field.
- Don't force **"As a … I want …"** at epic level — that's a story shape; epics stay broader.
- Don't force a **verb** when a noun-phrase capability (P3) is clearer, or force a **noun** when the
  value is an action.
- No **synonyms across neighbouring rows** for the same concept.

---

## Anti-patterns

- **Vague integrators:** `Integrate X into Y` without stating the observable capability.
- **Implementation in the title:** framework names, ticket numbers, "add endpoint".
- **Duplicate epics:** overlapping rows that a reader can't tell apart — disambiguate the distinction
  in the wording (e.g. an *entry trigger* vs a *mid-run invocation*).
- **UI-only phrasing** for epics that also include engine/contract work; put "primary surface is the
  authoring UI" in the description, not the title.
- **Fixed-opener monoculture:** forcing every title through one or two opening verbs when the epic's
  nature calls for a different pattern.

---

## Output format (when asked for titles)

Return **3–5 candidate titles** spanning the fitting patterns, then **one recommended** line with a
one-sentence **rationale**. If the user is splitting work, suggest the **epic vs story** boundary in
prose — not by cramming scope into the title.

## Clarifying questions (grill-style — one at a time)

If the epic's nature is ambiguous, ask one question, then refine before the next:

1. Is this primarily **admin configuration** or **runtime/platform behaviour**?
2. Is it a **single capability** or an **epic grouping / initiative** (which favours a noun label)?
3. Does it **duplicate** an existing epic — and if so, what's the distinction to surface?
4. Does the **benefit** need to be explicit in the title, or is it self-evident?

---

## Worked example — a workflow-automation backlog (illustrative, not canonical)

Shows how to build **parallel families** in one domain. Treat as an example of the method, not a set
of terms to reuse verbatim.

- **Triggers** (P2 family — subject `workflow execution`, verb `triggered`):
  `Support workflow execution triggered by <domain event>` · `… triggered manually` · `… triggered
  on a schedule` · `… triggered by another workflow`
- **Actions** (P5 family): `Support sending email as a workflow action` · `Support updating user
  tiers as a workflow action`
- **Flow nodes** (P3/P6): `Support conditional branching with an If workflow step` · `Support pausing
  workflow execution until configured wait rules are satisfied`
- **Groupings** (P3, noun-led): `Draft & autosave` · `Version history` · `Publish & unpublish`

Note the **layering**: the *epic* takes a broad capability label (P3), while its *stories* stay
user-value framed ("Publish the current draft to production as a named version"). Epic = capability;
story = user goal.

---

## Appendix — project profile template

Drop this into a project (e.g. `docs/epic-title-profile.md` or the repo's skill folder) so Step 0 has
a concrete profile to load:

```markdown
# Epic-title profile — <project>

- **House style:** <verb-led | noun-led | mixed>
- **Canonical nouns:** <the 5–15 domain terms titles must use; link the glossary>
- **Family grammars in use:**
  - <family> → `<fixed template>` (e.g. triggers → `Support <subject> triggered by <event>`)
- **Current epic list (for parallelism):** <link or list>
- **Example set (canonical, keep aligned as the product renames):**
  - `<title>` — <pattern id>
```
