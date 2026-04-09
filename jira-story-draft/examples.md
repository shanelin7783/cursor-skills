# Jira story draft — examples

Each example below shows the *content* of the `/tmp/{slug}-story-draft.md` file that the skill produces. The file is written by the AI and presented to the user for review before any Jira ticket is created.

Short references. Same requirements can be written as **narrative bullets** or **checklist ACs**; this skill defaults to checklist.

## Example A — Workflow list (fragment)

As a system user,  
I want to view, search, filter, and manage all Workflows from a centralized list page,  
So that I can quickly locate target Workflows and perform actions such as edit, duplicate, activate/deactivate to improve operational efficiency.

**Narrative AC snippet (bullets)**

AC1: Workflow List Display

• **Page title** displays `Workflows`

• **"+ Add Workflow" button** is displayed (design ref: top-right corner); clicking it navigates to the Workflow creation page

• **Table columns** include: Name, Used By, Status, Created Date, Last Updated Date, Action

**Checklist AC snippet (preferred)**

**AC1 — Workflow List Display**

The main list page presents all workflows in a sortable table with quick-access actions.

- [ ] **Page title** displays `Workflows`
- [ ] **"+ Add Workflow" button** is displayed (design ref: top-right corner); clicking it navigates to the Workflow creation page
- [ ] **Table columns** include: Name, Used By, Status, Created Date, Last Updated Date, Action
- [ ] **Empty state** — when no workflows exist, the table body shows `No workflows found`
- [ ] **Created Date / Last Updated Date** format is `YYYY-MM-DD HH:mm:ss`

---

**AC2 — Search and Filter**

Users can narrow down the workflow list using keyword search and status filter.

- [ ] **Search field** placeholder text is `Search workflows…`
- [ ] **Search** filters the list by workflow name (case-insensitive partial match)
- [ ] **Status filter** dropdown options include: `All`, `Active`, `Inactive`
- [ ] **Filter behavior** reflects current selection:
  - [ ] When `All` is selected → all workflows are displayed
  - [ ] When `Active` is selected → only workflows with Status = Active are displayed
  - [ ] When `Inactive` is selected → only workflows with Status = Inactive are displayed
- [ ] **Results count** badge updates to reflect the filtered total

---

## Example B — Node hover toolbar (fragment)

As a workflow editor user,  
I want a floating toolbar when I hover over a workflow node with Execute step, Activate/Deactivate, and Delete,  
So that I can run, toggle, or remove that node on the canvas without leaving the editor.

**Checklist ACs**

**AC1 — Hover Toolbar — Show and Hide**

A floating toolbar appears above the node on hover, providing quick actions in a consistent order.

- [ ] **Toolbar** appears above (or adjacent to) the node when the user hovers over it
- [ ] **Toolbar button order** left-to-right: Execute step, Activate/Deactivate, Delete (design ref: play icon, power icon, trash icon)
- [ ] **Execute step** icon tooltip text is `Execute step`
- [ ] **Delete** icon tooltip text is `Delete`; icon uses destructive styling (design ref: red)
- [ ] **Toolbar dismissal** — moving the pointer away from both the node and the toolbar hides the toolbar

---

**AC2 — Execute Step**

- [ ] **Execute step** triggers execution and provides feedback:
  - [ ] Given the toolbar is visible, when the user clicks **Execute step**, then execution is triggered for that node only
  - [ ] Given execution is in progress, when it completes, then the loading indicator is removed and the node displays the result

---

**AC3 — Activate / Deactivate Toggle**

The toolbar power icon lets the user toggle the node between active and deactivated states. Visual feedback updates immediately without a page reload.

- [ ] **Power icon** click toggles the node between active and deactivated
- [ ] **Status toggle** reflects current node state:
  - [ ] When active → tooltip shows `Deactivate`
  - [ ] When inactive → tooltip shows `Activate`
  - [ ] When inactive → a gray `(Deactivated)` label appears directly below the node title
  - [ ] When active → `(Deactivated)` label is hidden
- [ ] **UI update** — after toggle, the node state updates without a full page reload

---

**AC4 — Delete**

- [ ] **Delete** button click removes the node from the canvas
- [ ] **Connections** — upstream and downstream connections linked to the deleted node are also removed

---

**Optional**

- [ ] **Delete confirmation** — clicking `Delete` shows a confirmation dialog before removing the node (pending product decision)
- [ ] **Execute step disabled** — `Execute step` button is disabled while the node is already executing
- [ ] **Error feedback** — if execution fails, the node displays an error indicator with a tooltip showing the error message
