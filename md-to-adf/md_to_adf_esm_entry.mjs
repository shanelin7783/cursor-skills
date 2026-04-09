#!/usr/bin/env node
import { readFileSync } from "node:fs";
import MarkdownIt from "markdown-it";
import { defaultSchema } from "@atlaskit/adf-schema/dist/es2019/schema/default-schema.js";
import { MarkdownTransformer } from "@atlaskit/editor-markdown-transformer/dist/es2019/index.js";
import { JSONTransformer } from "@atlaskit/editor-json-transformer/dist/es2019/index.js";
import { markdownItTaskList } from "./markdown-it-task-list.mjs";

const tokenizer = MarkdownIt("zero", { html: false });
tokenizer.enable(["entity", "escape"]);
tokenizer.use(markdownItTaskList);

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

function convert(md) {
  const pmNode = new MarkdownTransformer(defaultSchema, tokenizer).parse(md);
  return new JSONTransformer().encode(pmNode);
}

const { compact, filePath } = parseArgs(process.argv);
const adf = convert(readInput(filePath));
process.stdout.write((compact ? JSON.stringify(adf) : JSON.stringify(adf, null, 2)) + "\n");
