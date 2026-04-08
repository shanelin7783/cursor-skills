#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { defaultSchema } from "@atlaskit/adf-schema/dist/es2019/schema/default-schema.js";
import { MarkdownTransformer } from "@atlaskit/editor-markdown-transformer/dist/es2019/index.js";
import { JSONTransformer } from "@atlaskit/editor-json-transformer/dist/es2019/index.js";

function parseArgs(argv) {
  let compact = false;
  let filePath = null;
  for (const arg of argv.slice(2)) {
    if (arg === "--compact" || arg === "-c") compact = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write("Usage: md_to_adf [OPTIONS] [FILE]\n\nConvert Markdown to ADF JSON.\nReads FILE or stdin. Writes ADF JSON to stdout.\n\nOptions:\n  -c, --compact   Compact JSON\n  -h, --help      Show help\n\n");
      process.exit(0);
    } else if (!arg.startsWith("-")) filePath = arg;
    else { process.stderr.write(`Unknown option: ${arg}\n`); process.exit(1); }
  }
  return { compact, filePath };
}

function readInput(filePath) {
  return readFileSync(filePath || 0, "utf-8");
}

const CHECKBOX_RE = /^\[([xX ])\]\s*/;

function isCheckboxItem(li) {
  const p = li?.content?.[0];
  if (p?.type !== "paragraph") return false;
  const t = p.content?.[0];
  return t?.type === "text" && CHECKBOX_RE.test(t.text);
}

function convertCheckboxItem(li) {
  const para = li.content[0], ft = para.content[0];
  const m = ft.text.match(CHECKBOX_RE);
  const state = m[1].toLowerCase() === "x" ? "DONE" : "TODO";
  const rest = ft.text.slice(m[0].length);
  const inline = [];
  if (rest) inline.push({ ...ft, text: rest });
  if (para.content.length > 1) inline.push(...para.content.slice(1));
  if (!inline.length) inline.push({ type: "text", text: " " });
  const ti = { type: "taskItem", attrs: { state, localId: "" }, content: inline };
  if (li.content.length > 1) ti.content.push(...li.content.slice(1));
  return ti;
}

function patchCheckboxLists(node) {
  if (!node || typeof node !== "object") return node;
  if (Array.isArray(node.content))
    node.content = node.content.map(c => patchCheckboxLists(c));
  if (node.type === "bulletList" && Array.isArray(node.content)) {
    const all = node.content.every(i => i.type === "listItem" && isCheckboxItem(i));
    if (all && node.content.length > 0)
      return { type: "taskList", attrs: { localId: "" }, content: node.content.map(convertCheckboxItem) };
  }
  return node;
}

function convert(md) {
  const pmNode = new MarkdownTransformer(defaultSchema).parse(md);
  return patchCheckboxLists(new JSONTransformer().encode(pmNode));
}

const { compact, filePath } = parseArgs(process.argv);
const adf = convert(readInput(filePath));
process.stdout.write((compact ? JSON.stringify(adf) : JSON.stringify(adf, null, 2)) + "\n");
