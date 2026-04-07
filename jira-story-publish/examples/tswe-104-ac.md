**AC1 — Open modal (double-click)**

- [ ] **Double-clicking** a workflow node on the Editor canvas opens a modal centered over the canvas
- [ ] Single-click (or interactions not specified here) does **not** open this modal by default

---

**AC2 — Modal — header, title edit, and close**

- [ ] Modal header shows the node type icon on the left (e.g. wrench for the illustrated node type)
- [ ] Header shows the node title in **bold**
- [ ] A pencil icon is shown next to the title when the node name is editable (per product behavior)
- [ ] Clicking the modal title (or the title area as designed) allows editing the node title
- [ ] Whether the canvas node label updates while the modal is still open is implementation-defined; live update on the canvas during editing is **not** required
- [ ] After the user closes the modal (via **X** or any dismiss action that ends the session), the node on the canvas must display the saved/edited title correctly
- [ ] Top-right **X** closes the modal; unsaved-changes behavior follows the product standard

---

**AC3 — Tabs — Parameters and Settings**

- [ ] Two tabs are shown: **Parameters** and **Settings**
- [ ] **Parameters** tab shows a document/edit-style icon; **Settings** tab shows a gear icon
- [ ] Active tab has a blue underline (or equivalent primary emphasis) per design
- [ ] Default selected tab on open is **Parameters** (unless product specifies otherwise)

---

**AC4 — Parameters tab (node-type fields or empty state)**

- [ ] **Parameters** content depends on node type: only fields applicable to that node type are shown
- [ ] When the node type has no configurable parameters, the body shows centered helper text: `This node does not have any parameters.`

---

**AC5 — Settings tab (common for all nodes)**

- [ ] **Retry on Fail:** toggle; helper text: `Retry execution if this node fails`
- [ ] **On Error:** dropdown with exactly two options: **Stop Workflow**, **Continue**
- [ ] **Notes:** multi-line text area; placeholder: `Add notes about this node...`
- [ ] **Display Notes in Flow?:** toggle; helper text: `Show the notes content below this node on the canvas`

---

**AC6 — Canvas — notes under title**

- [ ] When **Display Notes in Flow?** is enabled and **Notes** is non-empty, the note text is shown directly below the node title on the canvas in smaller, secondary styling (e.g. lighter gray)
- [ ] When **Display Notes in Flow?** is disabled or **Notes** is empty, no note line is shown under the title
- [ ] After saving the workflow (per product save behavior), changes to **Settings**/ **Notes** and the on-canvas note line persist and match the modal values
