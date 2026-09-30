# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Vault rules

This is an Obsidian vault (a personal notes/knowledge base), not a software project — there is no build, lint, or test suite. The only tooling is the note-management script below. Follow these rules when creating or editing notes here.

## Layout
- This directory is the vault root (`.obsidian/` lives directly inside it).
- `test/` — the organized note structure (see Folders below).
- `Attachments/` — personal reference notes, not managed by `scripts/vault.mjs`:
  - `about_me.md` — professional profile + a "Physical Fitness & Personal Conditioning" section with biometrics (170cm/63kg) and a 1,890 kcal daily nutrition target (252g carb/126g protein/44g fat). **Whenever asked about remaining daily nutrients, calculate against this target using that day's Food section in `test/01-Daily/`.**
  - `academic-calendar.md` — semester dates, formatted as one table per semester.
- Obsidian wikilinks resolve by unique basename vault-wide, so `[[about_me]]`, `[[workout-progress]]`, etc. work fine across the `test/`/`Attachments/` split — no need for full paths.

## Format
- Every note is plain Markdown with YAML frontmatter at the top (`type`, `date`, `tags` at minimum).
- Link related notes with `[[wikilinks]]`, not raw Markdown links, so Obsidian's graph and backlinks work.

## Filenames
- Lowercase, kebab-case (e.g. `bench-press-notes.md`), **except** daily notes.
- Daily notes are named by date: `YYYY-MM-DD.md`.

## Deleting things
- Never delete notes. Move anything unwanted to `test/Archive/` instead.

## Off-limits
- Never modify or delete anything inside `.obsidian/` or `.git/`.

## Folders (under `test/`)
- `00-Inbox` — quick unsorted captures
- `01-Daily` — daily notes
- `02-Study` — `theory/`, `java/`, `web/`, `dsa/`, `swe-skills/` (modern SWE skills for internships), `chinese/` (HSK3 goal)
- `03-Health` — `gym/`, `sports/`, `diet/`
- `04-Life` — `clubs/`, `photography/`, `games/`
- `05-Career` — `hackathons/`, `interviews/`, `applications/`, plus top-level notes like `lessons-learned.md`
- `99-Templates` — note templates used by `scripts/vault.mjs`
- `Archive` — retired notes (never permanently delete)
- `scripts` — vault tooling (`vault.mjs`)

## Tooling
Zero-dependency Node script, run from the vault root as `node test/scripts/vault.mjs <command>` (or `node scripts/vault.mjs <command>` from inside `test/`):

| Command | Usage | Effect |
|---|---|---|
| `init` | `vault.mjs init` | Creates the full `FOLDERS` structure under `test/` (see script for the list) if missing |
| `sync` | `vault.mjs sync` | Repairs missing folders only — safe to re-run anytime, never touches notes |
| `daily` | `vault.mjs daily` | Creates today's `test/01-Daily/YYYY-MM-DD.md` from the `daily` template |
| `gym` | `vault.mjs gym [title]` | Creates `test/03-Health/gym/YYYY-MM-DD-<slug>.md` from the `gym` template |
| `sport` | `vault.mjs sport [title]` | Creates `test/03-Health/sports/YYYY-MM-DD-<slug>.md` from the `sport` template |
| `study` | `vault.mjs study <topic> <title>` | Creates `test/02-Study/<topic>/<slug>.md`; topic must be one of `theory, java, web, dsa, swe-skills, chinese` |
| `lc` | `vault.mjs lc <id> <title>` | Creates `test/02-Study/dsa/<0000-id>-<slug>.md` from the `lc` template |
| `save` | `vault.mjs save [message]` | `git add -A` + commit (if changes exist) + `pull --rebase` + `push` |

- Templates live in `test/99-Templates/*.md` and use `{{var}}` placeholders (`readTemplate`/`render` in the script).
- `writeNote` never deletes or overwrites an existing note — a name collision is skipped with a console message, not an error.

## Claude behavior rules
- Read `about_me.md` for my biometrics, targets and goals.
- Only state facts found in my notes, and cite file + date.
- A missing daily note means "no data", never "did nothing".
- List days with no entry before any review.
- Don't guess my schedule — ask me.
