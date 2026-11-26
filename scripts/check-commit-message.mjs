import { readFileSync } from "node:fs";

const messageFile = process.argv[2];
if (!messageFile) {
  console.error("Provide the commit message file path.");
  process.exit(1);
}

const message = readFileSync(messageFile, "utf8").replace(/\r\n/g, "\n");
const lines = message.split("\n");
const title = lines[0];
const validTitle = /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([^()\r\n]+\))?!?: \S.*$/.test(title);
const hasDescription = lines.slice(2).some((line) => line.trim() && !line.trimStart().startsWith("#"));

if (!validTitle || lines[1]?.trim() !== "" || !hasDescription) {
  console.error(`Commit message must contain a type, title, blank line, and description.

Allowed types: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
Optional scope and breaking-change marker are supported.

Example:
feat(facilities): add region filtering

Filter facilities by the signed-in user's region and enforce access on the API.`);
  process.exit(1);
}
