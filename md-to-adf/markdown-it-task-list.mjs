/**
 * markdown-it core rule plugin: transforms GFM-style checkbox lists
 * (- [ ] / - [x]) into task_list / task_item tokens that Atlaskit's
 * mdToPmMapping can consume natively.
 *
 * Also restructures nesting: markdown puts sublists inside list_item,
 * but Jira ADF requires nested taskList as a sibling of taskItem
 * inside the parent taskList (taskItem.content = 'inline*' only).
 */

const CHECKBOX_RE = /^\[([xX ])\]\s*/;

export function markdownItTaskList(md) {
  md.core.ruler.after("inline", "task_lists", (state) => {
    const tokens = state.tokens;

    const taskListOpens = identifyTaskLists(tokens);
    if (taskListOpens.size === 0) return;

    transformTokens(tokens, taskListOpens);
    state.tokens = hoistNestedTaskLists(
      stripParagraphsInTaskItems(tokens),
      state.Token,
    );
  });
}

/**
 * Identify which bullet_list_open tokens represent task lists.
 * A bullet_list is a task list when every direct list_item child
 * has an inline starting with [ ] or [x].
 * Returns a Set of token indices.
 */
function identifyTaskLists(tokens) {
  const result = new Set();

  for (let i = 0; i < tokens.length; i++) {
    if (tokens[i].type !== "bullet_list_open") continue;

    const listLevel = tokens[i].level;
    let allCheckbox = true;
    let itemCount = 0;

    for (let j = i + 1; j < tokens.length; j++) {
      if (tokens[j].type === "bullet_list_close" && tokens[j].level === listLevel) break;
      if (tokens[j].type === "list_item_open" && tokens[j].level === listLevel + 1) {
        itemCount++;
        if (!firstInlineHasCheckbox(tokens, j)) {
          allCheckbox = false;
          break;
        }
      }
    }

    if (itemCount > 0 && allCheckbox) result.add(i);
  }

  return result;
}

function firstInlineHasCheckbox(tokens, listItemIdx) {
  const itemLevel = tokens[listItemIdx].level;
  for (let k = listItemIdx + 1; k < tokens.length; k++) {
    if (tokens[k].type === "list_item_close" && tokens[k].level === itemLevel) return false;
    if (tokens[k].type === "inline") return CHECKBOX_RE.test(tokens[k].content);
  }
  return false;
}

/**
 * In-place rename bullet_list → task_list, list_item → task_item
 * for identified task lists. Also strips the [ ]/[x] prefix from
 * inline content and sets task_item_open.meta to the checked state.
 */
function transformTokens(tokens, taskListOpens) {
  const closeMap = new Set();

  for (const openIdx of taskListOpens) {
    const listLevel = tokens[openIdx].level;
    tokens[openIdx].type = "task_list_open";

    for (let j = openIdx + 1; j < tokens.length; j++) {
      const t = tokens[j];

      if (t.type === "bullet_list_close" && t.level === listLevel) {
        t.type = "task_list_close";
        closeMap.add(j);
        break;
      }

      if (t.type === "list_item_open" && t.level === listLevel + 1) {
        t.type = "task_item_open";
        const inlineIdx = findInline(tokens, j, t.level);
        if (inlineIdx !== -1) {
          const state = stripCheckbox(tokens[inlineIdx]);
          t.meta = state;
        }
      }

      if (t.type === "list_item_close" && t.level === listLevel + 1) {
        t.type = "task_item_close";
      }
    }
  }
}

function findInline(tokens, fromIdx, itemLevel) {
  for (let k = fromIdx + 1; k < tokens.length; k++) {
    if (tokens[k].type === "task_item_close" && tokens[k].level === itemLevel) return -1;
    if (tokens[k].type === "list_item_close" && tokens[k].level === itemLevel) return -1;
    if (tokens[k].type === "inline") return k;
  }
  return -1;
}

/**
 * Strip the [ ]/[x] prefix from an inline token's content and children.
 * Returns the checked state string for Atlaskit ("TODO" or "DONE").
 */
function stripCheckbox(inlineTok) {
  const m = inlineTok.content.match(CHECKBOX_RE);
  if (!m) return "TODO";

  const state = m[1].toLowerCase() === "x" ? "DONE" : "TODO";
  inlineTok.content = inlineTok.content.slice(m[0].length);

  if (inlineTok.children && inlineTok.children.length > 0) {
    const first = inlineTok.children[0];
    if (first.type === "text") {
      const cm = first.content.match(CHECKBOX_RE);
      if (cm) first.content = first.content.slice(cm[0].length);
    }
  }

  return state;
}

/**
 * Strip paragraph_open / paragraph_close inside task_item ranges.
 * taskItem.content = 'inline*' — ProseMirror needs inline tokens
 * directly, not wrapped in paragraph blocks.
 */
function stripParagraphsInTaskItems(tokens) {
  const result = [];
  let inTaskItem = 0;
  let inListItem = 0;

  for (const tok of tokens) {
    if (tok.type === "task_item_open") inTaskItem++;
    if (tok.type === "task_item_close") inTaskItem--;
    if (tok.type === "list_item_open") inListItem++;
    if (tok.type === "list_item_close") inListItem--;

    if (inTaskItem > 0 && inListItem === 0 && (tok.type === "paragraph_open" || tok.type === "paragraph_close")) {
      continue;
    }
    result.push(tok);
  }

  return result;
}

/**
 * Restructure nesting: when a task_item contains a nested task_list,
 * close the task_item before the nested list and place the nested list
 * as a sibling. This matches Jira's ADF schema where taskList.content
 * allows (taskItem | taskList)* but taskItem.content is inline* only.
 */
function hoistNestedTaskLists(tokens, TokenClass) {
  const result = [];
  let i = 0;

  while (i < tokens.length) {
    if (tokens[i].type !== "task_item_open") {
      result.push(tokens[i]);
      i++;
      continue;
    }

    const itemLevel = tokens[i].level;
    const itemOpenIdx = i;

    let nestedStart = -1;
    let itemCloseIdx = -1;
    let depth = 0;

    for (let j = i + 1; j < tokens.length; j++) {
      if (tokens[j].type === "task_item_open" || tokens[j].type === "list_item_open") depth++;
      if (tokens[j].type === "task_item_close" || tokens[j].type === "list_item_close") {
        if (depth === 0) { itemCloseIdx = j; break; }
        depth--;
      }
      if (tokens[j].type === "task_list_open" && tokens[j].level === itemLevel + 1 && nestedStart === -1 && depth === 0) {
        nestedStart = j;
      }
    }

    if (nestedStart === -1 || itemCloseIdx === -1) {
      result.push(tokens[i]);
      i++;
      continue;
    }

    result.push(tokens[itemOpenIdx]);
    for (let k = itemOpenIdx + 1; k < nestedStart; k++) {
      result.push(tokens[k]);
    }

    const closeTok = new TokenClass("task_item_close", "", -1);
    closeTok.level = itemLevel;
    result.push(closeTok);

    for (let k = nestedStart; k < itemCloseIdx; k++) {
      tokens[k].level -= 1;
      result.push(tokens[k]);
    }

    i = itemCloseIdx + 1;
  }

  return result;
}
