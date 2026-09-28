#!/usr/bin/env node
// Zero-dependency vault helper for this Obsidian vault.
// Works on Windows and macOS using only Node's built-in modules.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const TEMPLATES = path.join(ROOT, "99-Templates");

const FOLDERS = [
  "00-Inbox",
  "01-Daily",
  "02-Study/theory",
  "02-Study/java",
  "02-Study/web",
  "02-Study/dsa",
  "02-Study/swe-skills",
  "02-Study/chinese",
  "03-Health/gym",
  "03-Health/sports",
  "03-Health/diet",
  "04-Life/clubs",
  "04-Life/photography",
  "04-Life/games",
  "05-Career/hackathons",
  "05-Career/interviews",
  "05-Career/applications",
  "99-Templates",
  "Archive",
  "scripts",
];

const STUDY_TOPICS = ["theory", "java", "web", "dsa", "swe-skills", "chinese"];

function todayStr(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function slugify(input) {
  const slug = String(input)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "untitled";
}

function ensureFolders() {
  const created = [];
  for (const rel of FOLDERS) {
    const full = path.join(ROOT, rel);
    if (!fs.existsSync(full)) {
      fs.mkdirSync(full, { recursive: true });
      created.push(rel);
    }
  }
  return created;
}

function readTemplate(name) {
  const file = path.join(TEMPLATES, `${name}.md`);
  if (!fs.existsSync(file)) {
    throw new Error(`Missing template: ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

function render(template, vars) {
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) =>
    key in vars ? vars[key] : ""
  );
}

function writeNote(fullPath, content) {
  if (fs.existsSync(fullPath)) {
    console.log(`Skipped (already exists): ${path.relative(ROOT, fullPath)}`);
    return false;
  }
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, "utf8");
  console.log(`Created: ${path.relative(ROOT, fullPath)}`);
  return true;
}

function cmdInit() {
  const created = ensureFolders();
  if (created.length) {
    console.log("Created folders:");
    for (const f of created) console.log(`  - ${f}`);
  } else {
    console.log("All folders already exist.");
  }
  console.log("Vault ready at:", ROOT);
}

function cmdSync() {
  // Safe to re-run any time: repairs missing folders, never touches notes.
  const created = ensureFolders();
  console.log(
    created.length
      ? `Sync complete. Recreated ${created.length} missing folder(s).`
      : "Sync complete. Nothing was missing."
  );
}

function gitRoot() {
  return execFileSync("git", ["rev-parse", "--show-toplevel"], {
    cwd: ROOT,
    encoding: "utf8",
  }).trim();
}

function git(args, cwd) {
  execFileSync("git", args, { cwd, stdio: "inherit" });
}

function cmdSave(args) {
  let repoRoot;
  try {
    repoRoot = gitRoot();
  } catch {
    console.error("Not inside a git repository.");
    process.exitCode = 1;
    return;
  }

  const status = execFileSync("git", ["status", "--porcelain"], {
    cwd: repoRoot,
    encoding: "utf8",
  });

  if (status.trim()) {
    git(["add", "-A"], repoRoot);
    const message =
      args.join(" ") || `vault save: ${new Date().toISOString()}`;
    git(["commit", "-m", message], repoRoot);
  } else {
    console.log("No local changes to commit.");
  }

  git(["pull", "--rebase"], repoRoot);
  git(["push"], repoRoot);
}

function cmdDaily() {
  const date = todayStr();
  const template = readTemplate("daily");
  const content = render(template, { date });
  const target = path.join(ROOT, "01-Daily", `${date}.md`);
  writeNote(target, content);
}

function cmdGym(args) {
  const title = args.join(" ") || "session";
  const date = todayStr();
  const template = readTemplate("gym");
  const content = render(template, { date, title });
  const target = path.join(
    ROOT,
    "03-Health/gym",
    `${date}-${slugify(title)}.md`
  );
  writeNote(target, content);
}

function cmdSport(args) {
  const title = args.join(" ") || "session";
  const date = todayStr();
  const template = readTemplate("sport");
  const content = render(template, { date, title });
  const target = path.join(
    ROOT,
    "03-Health/sports",
    `${date}-${slugify(title)}.md`
  );
  writeNote(target, content);
}

function cmdStudy(args) {
  const [topic, ...rest] = args;
  if (!STUDY_TOPICS.includes(topic)) {
    console.error(
      `Usage: vault study <topic> <title>\nTopic must be one of: ${STUDY_TOPICS.join(
        ", "
      )}`
    );
    process.exitCode = 1;
    return;
  }
  const title = rest.join(" ");
  if (!title) {
    console.error("Usage: vault study <topic> <title>");
    process.exitCode = 1;
    return;
  }
  const date = todayStr();
  const template = readTemplate("study");
  const content = render(template, { date, title, topic });
  const target = path.join(ROOT, "02-Study", topic, `${slugify(title)}.md`);
  writeNote(target, content);
}

function cmdLc(args) {
  const [id, ...rest] = args;
  const title = rest.join(" ");
  if (!id || !title) {
    console.error("Usage: vault lc <id> <title>");
    process.exitCode = 1;
    return;
  }
  const paddedId = String(id).padStart(4, "0");
  const date = todayStr();
  const template = readTemplate("lc");
  const content = render(template, { date, id, title });
  const target = path.join(
    ROOT,
    "02-Study/dsa",
    `${paddedId}-${slugify(title)}.md`
  );
  writeNote(target, content);
}

function printHelp() {
  console.log(`Vault helper - usage: node scripts/vault.mjs <command> [args]

Commands:
  init                       Create the folder structure and check templates
  daily                      Create (or open) today's daily note
  gym [title]                Create a new gym log note for today
  sport [title]              Create a new sport log note for today
  study <topic> <title>      Create a study note (topic: ${STUDY_TOPICS.join(
    ", "
  )})
  lc <id> <title>            Create a LeetCode/DSA problem note
  sync                       Repair missing folders (never touches notes)
  save [message]             git add + commit + pull --rebase + push
`);
}

function main() {
  const [command, ...args] = process.argv.slice(2);
  switch (command) {
    case "init":
      return cmdInit();
    case "sync":
      return cmdSync();
    case "save":
      return cmdSave(args);
    case "daily":
      return cmdDaily();
    case "gym":
      return cmdGym(args);
    case "sport":
      return cmdSport(args);
    case "study":
      return cmdStudy(args);
    case "lc":
      return cmdLc(args);
    default:
      printHelp();
      if (command) process.exitCode = 1;
  }
}

main();
