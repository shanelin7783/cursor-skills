# Jira story draft — examples

Each example below shows the *content* of the `/tmp/{slug}-story-draft.md` file that the skill produces. The file is written by the AI and presented to the user for review before any Jira ticket is created.

Short references. Same requirements can be written as **narrative bullets** or **checklist ACs**; this skill defaults to checklist.

## Example A — Workflow list (fragment)

As a system user,  
I want to view, search, filter, and manage all Workflows from a centralized list page,  
So that I can quickly locate target Workflows and perform actions such as edit, duplicate, activate/deactivate to improve operational efficiency.

**Narrative AC snippet (bullets)**

AC1: Workflow List Display

• Page title displays "Workflows"

• A "+ Add Workflow" button is displayed in the top-right corner; clicking it navigates to the Workflow creation page

• The list is rendered as a table with columns: Name, Used By, Status, Created Date, Last Updated Date, Action

**Checklist AC snippet (preferred)**

**AC1 — Workflow List Display**

- [ ] Page title displays "Workflows"
- [ ] Top-right "+ Add Workflow" opens Workflow creation
- [ ] Table columns include Name, Used By, Status, Created Date, Last Updated Date, Action

---

## Example B — Node hover toolbar (fragment)

As a workflow editor user,  
I want a floating toolbar when I hover over a workflow node with Execute step, Activate/Deactivate, and Delete,  
So that I can run, toggle, or remove that node on the canvas without leaving the editor.

**Checklist ACs**

**AC1 — Hover Toolbar — Show and Hide**

- [ ] Hovering a node shows a floating toolbar above (or adjacent to) the node
- [ ] Toolbar order left-to-right: Execute step (play) → Activate/Deactivate (power) → Delete (trash)
- [ ] "Execute step" tooltip text is `Execute step`
- [ ] "Delete" tooltip text is `Delete`; icon uses destructive styling per design
- [ ] Pointer leaving the node/toolbar hides the toolbar (per agreed hover rules)

---

**AC2 — Execute Step**

- [ ] Clicking Execute step runs execution for that node only

---

**AC3 — Activate / Deactivate**

- [ ] Click toggles active vs deactivated
- [ ] When active: power icon tooltip shows `Deactivate`
- [ ] When deactivated: power icon tooltip shows `Activate`
- [ ] When deactivated: a gray `(Deactivated)` line appears directly under the node title
- [ ] When active: `(Deactivated)` line is hidden
- [ ] After toggle, UI updates without full page reload

---

**AC4 — Delete**

- [ ] Clicking Delete removes the node and updates connections

---

**Optional**

- [ ] Delete requires confirmation dialog (if product decides)
