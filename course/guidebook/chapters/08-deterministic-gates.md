# Chapter 08: Deterministic Gates — Hardening the Repository

**Part 2: Advanced Patterns**
**When to read:** After Chapter 4 (The 5 Validation Gates), once you have shipped a few features and felt the cost of
re-verifying agent claims by hand

---

## Overview

Chapter 4 gave you the five validation gates: type-check, lint, tests, process cleanup, manual verification. It also
gave you a discipline problem you may not have noticed yet — **every one of those gates only runs if somebody remembers
to run it.** The gates live in prompt text. Every agent prompt repeats them. Every orchestrator re-runs them after the
agent claims green, because an agent's report that gates passed is a claim, not evidence.

This chapter is about moving the first three gates out of prompts and into the repository itself, so that **a commit's
existence is proof the gates passed**. Once that is true, nobody re-runs anything, prompts stop carrying gate
boilerplate, and human verification effort moves to the two things automation genuinely cannot do: reading test diffs
and reading evidence.

Everything here was built and verified in the reference CRM build over one story, and battle-tested by the five stories
that followed it. The failure modes described are not hypothetical — each one was hit, captured, and fixed.

---

## 1. Why Manual Gates Plateau

Run gates by prompt discipline for a few features and a pattern emerges:

- **The double-running is pure waste.** In the reference build, the orchestrator re-ran every gate the agents had
  already run — and across two full feature audits found **zero** discrepancies. Agents were honest. The re-runs cost
  real time and found nothing.
- **The defects that got through were never gate failures.** A placeholder nobody replaced. An unauthenticated socket
  handshake. A screenshot whose *filename* claimed a network property a PNG cannot carry. Gates were green every time;
  the misses lived in the space gates don't cover.
- **The gates consumed the verification budget that those real defects needed.** Every minute spent re-confirming
  `npm test` output is a minute not spent reading the diff where an assertion quietly disappeared.

The conclusion is not "trust the agents" — trust that has to be re-earned per-claim doesn't scale. The conclusion is to
**change what a commit means**. Move the gates from "the agent says it ran them" to "the commit could not exist
otherwise." Then the agent's claim is irrelevant, because the mechanism is the proof.

### The one-sentence design goal

> After this lands, a commit in this repo is proof that type-check, lint, and the full suite passed.

Every decision below serves that sentence. Whenever a choice arises between a convenient guarantee and an unconditional
one, the unconditional one wins — a guarantee you have to reason about ("did the fast path run, or the full path?") is
not a guarantee, it's a fact-check.

---

## 2. Layer 1: Versioned Git Hooks

### `.githooks/`, not `.git/hooks/`

Git's default hooks directory is not version-controlled. A hook placed in `.git/hooks/` vanishes on a fresh clone, can't
be reviewed in a diff, and can't be trusted to exist in anyone else's checkout. So the hooks live in a committed
`.githooks/` directory, activated with:

```bash
git config core.hooksPath .githooks
```

Two properties make this work across a multi-worktree workflow, and both were **verified rather than assumed**:

1. **Worktrees inherit the setting.** `core.hooksPath` lives in the shared common config (`.git/config` of the main
   checkout), and every linked worktree reads it. Verified with `git config --show-origin --get core.hooksPath` from
   inside a worktree.
2. **The relative path is deliberate.** `.githooks` resolves against the top level of whichever working tree is
   committing. Because the directory is *committed*, every worktree has its own copy — an absolute path would point
   every worktree back at the main checkout's hooks, which is strictly worse.

### The pre-commit hook runs everything, unconditionally

```
#   0. assertion-delta advisory  (~0.02 s)
#   1. Postgres preflight        (~0.01 s)
#   2. type-check                (~4.2 s)
#   3. lint                      (~3.4 s)
#   4. test                     (~15.7 s)
```

Cheapest and most informative first, everything sequential, everything on every commit. Two decisions here are worth
defending because your instincts will fight them:

**No pre-push tier.** The usual reason to split fast gates into pre-commit and slow ones into pre-push is a suite that
costs minutes. Measure yours first: this repo's full set costs ~23 seconds. At that price the split buys nothing and
costs the property that makes the whole thing worth having — that the guarantee is *unconditional*. No one has to reason
about which tier ran to know what a commit means.

**No changed-files scoping, no caching.** Same argument. A gate that is conditional on which files changed requires
reasoning to trust, and "requires reasoning to trust" is the disease being cured. The pre-commit hook in the reference
build carries this comment so nobody helpfully optimizes the guarantee away:

```bash
# For the same reason the gates are NOT conditional on which files changed. Do not add that.
```

If your suite genuinely costs minutes, fix the suite (parallelize, isolate the database per worker — see below) before
you weaken the gate.

### Fail loudly, never silently

The failure mode that destroys the entire mechanism is a hook that cannot run the tests and lets the commit through
anyway. A silent pass produces commits that carry the guarantee's reputation without its substance — and once one of
those exists, nobody can trust any of them.

So the hook **preflights its dependencies** and refuses with a specific reason. The reference build checks that Postgres
is reachable before attempting the test gate, using bash's built-in `/dev/tcp` so there is no dependency on `nc` or
`pg_isready`:

```bash
if ! (exec 3<>"/dev/tcp/$DB_HOST/$DB_PORT") 2>/dev/null; then
  fail " COMMIT REFUSED — Postgres is not reachable, so the tests cannot run"
  fail "  Tried to open a TCP connection to $DB_HOST:$DB_PORT and could not."
  fail "  This hook refuses the commit rather than skipping the test gate."
  exit 1
fi
```

Note what this buys over just letting `npm test` fail: the refusal arrives in ~0.01 s instead of ~20 s, and it says
*start Postgres* instead of printing an ORM stack trace.

**On failure, show the entire gate log.** Not a summary, not the last ten lines — everything:

```bash
# Show the whole thing. An agent that cannot see WHY it failed starts hunting
# for ways around the hook, which is the exact opposite of the point.
cat "$logfile" >&2
```

One trap worth knowing: workspace-aware test runners keep going after a workspace fails, so the *tail* of a failed run
can read `Test Files 14 passed` — from the workspace that ran after the broken one. The exit code is correct, so the
hook is not fooled, but a human or agent skimming the end of the output would be. Printing the full log is the
mitigation.

### Scrub git's environment before running gates

A subtle one that will bite anything that shells out to git from inside a test:

```bash
# GIT_DIR / GIT_INDEX_FILE / GIT_WORK_TREE are exported by git into this process and point at the
# in-progress commit. They must not leak into `npm test`: anything that shells out to git would
# see a half-built index instead of the working tree.
unset GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE GIT_PREFIX GIT_AUTHOR_DATE GIT_EDITOR
```

---

## 3. Layer 2: Claude Code Lifecycle Hooks

Versioned git hooks close the "forgot to run the gates" hole. They do nothing about an agent *skipping* them —
`git commit --no-verify` is one flag away. Claude Code's hook system is the enforcement layer for that, and it lives in
a file you commit.

### `.claude/settings.json` — the project file, committed

Claude Code reads hooks from `.claude/settings.json` (project-level, committed, inherited by every agent in every
worktree) — not `settings.local.json`, which is personal and gitignored. The shape:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/block-gate-bypass.ts\"",
            "timeout": 15
          }
        ]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/require-session-log.ts\"",
            "timeout": 15
          }
        ]
      }
    ]
  }
}
```

Use `${CLAUDE_PROJECT_DIR}` rather than an absolute path — it resolves to the project directory of whichever worktree
the agent is running in, so one committed file serves every checkout.

### Verify the hook contract empirically. Do not trust prose — including this chapter.

The contract the hooks above rely on:

- The hook receives **one JSON object on stdin**. For `PreToolUse` it carries `tool_name` and `tool_input` (with
  `tool_input.command` for Bash). For `Stop` it carries `stop_hook_active`.
- **Exit code 2 blocks** the action and returns your **stderr** to the agent (stdout is ignored on a block). Exit 0
  allows.
- `stop_hook_active` is the loop-prevention flag: `false` on the first Stop of a chain, `true` after your hook has
  already blocked once.

When the reference build was written, the official docs *contradicted* the observed behavior on one of these fields. The
build team caught it because the story brief demanded a five-minute empirical probe before building anything: two
throwaway project directories, hooks that just `cat > payload.json` and exit, driven by headless `claude -p` sessions.
The probe settles what any prose — docs, blog posts, this chapter — can only claim:

```bash
# In a scratch project's .claude/settings.json, point every event at:
#   cat > payload-$HOOK_EVENT.json ; exit 0
# then run:  claude -p 'run: echo probe' --allowedTools Bash
# and read the captured payloads.
```

Also verified this way, and worth knowing: **settings changes are picked up by an already-running session.** The session
that authored the reference build's hooks was blocked by its own PreToolUse hook twenty minutes after writing it. You do
not need to restart to arm a hook — and you are not safely unhooked while editing one.

### Why plain `node` and TypeScript with no build step

The reference hooks are TypeScript files run directly with `node` (native type stripping, Node ≥ 22.18). No ts-node, no
build step, no `node_modules` — so the hooks work in a fresh worktree *before* `npm install` has run.

The choice of runtime carries a lesson about failure direction. An earlier version used `python3`, and
`python3 missing-file.py` exits **2** — which is the *block* code. Deleting a hook script didn't disarm the hooks; it
jammed them all ON, refusing every Bash, Write, and Stop while citing a file that no longer existed.
`node missing-file.ts` exits 1 — a non-blocking error — so a missing hook now **fails open** instead. That is safer to
live with and weaker as enforcement, which is why the git-side pre-commit hook warns when the Claude hooks are missing
or unrunnable (see §7).

Know which direction each layer fails, and make it a decision rather than an accident.

---

## 4. Layer 3: The Bypass Block

This is the heart of the migration. A `PreToolUse` hook on `Bash` inspects every shell command an agent proposes and
refuses anything that would let a commit skip the hooks.

### Blocking the string `--no-verify` is theatre

There are at least nine distinct routes around a git hook. All of them must be blocked, or none of it matters:

| # | Vector                     | Example                                                  |
|---|----------------------------|----------------------------------------------------------|
| 1 | Long flag                  | `git commit --no-verify` (and abbreviations: `--no-ver`) |
| 2 | Short flag                 | `git commit -n`                                          |
| 3 | Bundled short flag         | `git commit -nm "msg"`                                   |
| 4 | Push                       | `git push --no-verify`                                   |
| 5 | Inline config override     | `git -c core.hooksPath=/dev/null commit`                 |
| 6 | Persistent config override | `git config core.hooksPath /dev/null` (and `--unset`)    |
| 7 | Hook deletion              | `rm .githooks/pre-commit`                                |
| 8 | Hook disarm                | `chmod -x .githooks/pre-commit`                          |
| 9 | Env bypass                 | `HUSKY=0 git commit …`, `SKIP_HOOKS=1 git commit …`      |

And every one must still be caught when buried in a compound command:

```bash
cd crm-src && npm test && git commit -nm "done"
```

Two of these deserve elaboration:

**Vector 7 is wider than `rm`.** Overwriting is deletion wearing a different verb: `cp /dev/null .githooks/pre-commit`,
`echo '' > .githooks/pre-commit`, `sed -i 's/exit 1/exit 0/' .githooks/pre-commit`, `dd of=...`. Blocking deletion but
not overwriting is a guard with a door next to it.

**Vector 9 matches variable *names*, not a fixed list.** The reference build blocks any command prefixed by an
assignment whose name matches `HUSKY|HOOK|VERIFY|LEFTHOOK|SKIP|GIT_CONFIG|PRE_COMMIT` — even though the repo doesn't use
husky at all. The block must not depend on which bypass variables the repo happens to honour *today*.

### The hard part is the false positives

A careless regex is worse than no hook at all, because these must all still **succeed**:

```bash
git log -n 5                                   # -n is legitimate on other subcommands
git commit -m "document the --no-verify block" # the string is inside a MESSAGE
git commit -mn "x"                             # -mn means message "n", not the bypass
git config --get core.hooksPath                # reading the key is fine; writing it is not
```

No regex over the raw command string can separate "the flag in flag position" from "the same characters inside a quoted
message body." A **shell tokeniser** can, because it understands quoting: a message argument tokenises into a single
token that is the *value* of `-m`, so it is never in flag position.

The reference implementation tokenises the command the way a shell would, splits it into segments on shell operators (
`&&`, `||`, `;`, `|`, newline), and walks git's actual option grammar — including a table of which options consume the
next token (`-m`, `-F`, `-c`, `--author`, …), so it only ever inspects tokens that are genuinely flags. That option
table is load-bearing: without it, `git commit -F somefile` misparses and the hook drifts into false positives or false
negatives. The subtlest case is the short-option cluster:

```
git commit -nm "msg"   → BLOCK  (-n seen before any value-taking option)
git commit -mn "x"     → ALLOW  (-m consumes the rest of the cluster as its value: message "n")
```

When the tokeniser cannot parse a command at all, a coarse raw-string fallback runs instead — deliberately biased toward
over-blocking. That bias is a principle worth writing down for your own version:

> A blocked agent reads the reason and rephrases, costing seconds. A bypassed gate is discovered at merge, costing the
> guarantee. When in doubt, over-block.

### Write the refusal for the agent that reads it

Exit 2, and put on stderr *what* was blocked and *what to do instead*:

```
run the gates and commit normally; if a gate is genuinely wrong, fix the
code or raise it with the orchestrator. Do not try variations of this
command until one works — that is the behaviour this block exists to prevent.
```

A block with no explanation produces an agent that retries variations until something slips through — the exact opposite
of the goal. In the reference build's live end-to-end test, a real headless agent hit the block, quoted the message
back, and reported: *"As instructed by both you and the hook, I did not retry."* That is the property that matters.

### The lockout: a war story you should expect to repeat

The author of the bypass block was blocked *by their own hook* while documenting it. The session log appended prose via
a shell heredoc:

```bash
cat >> session-log.md <<'EOF'
...prose describing the bypass block, naming --no-verify and core.hooksPath...
EOF
```

Two bugs compounded: the tokeniser cannot parse a heredoc (prose apostrophes look like unbalanced quotes, so parsing
threw), and the coarse fallback then matched the very strings the prose was describing. Documenting the mechanism is the
single most likely thing an agent does right after using it — the worst possible false positive.

The fix is the insight the whole design rests on, applied once more: **a heredoc body is data**, exactly like a `-m`
argument, so it must never be inspected as flags. Except when the receiving command is a shell —
`sh <<'EOF' … git commit -n … EOF` is a script, not data, and discarding it would open a clean bypass. So heredoc bodies
are stripped before tokenising and recursively analysed *only* when fed to `sh`/`bash`/`zsh`/`eval`. One false positive
removed and one real vector closed, from the same insight.

The general lesson: **sequence the work so you are subject to your own hooks before you ship them.** Eating your own
cooking is what surfaced this — and every other bug in this chapter.

### Say what it is: a speed bump, not a sandbox

An agent with shell access can ultimately do what it likes — write a script to a file and execute it, base64-decode into
a shell, or use a tool that isn't Bash at all. Do not claim airtightness your evidence doesn't support. What the block
achieves is precise and valuable:

- Bypass **by accident** becomes impossible. Nobody reaches for `-n` out of habit and succeeds.
- Bypass **by deliberate choice** becomes visible. You have to work at it, and the working-at-it is the signal.

The git hooks are the real guarantee; this layer only stops them being trivially skipped.

---

## 5. Layer 3½: Protect the Machinery from the Other Tools

The bypass block only matches `Bash`. The Write and Edit tools are not shell commands — an agent can edit
`.claude/settings.json` and disarm everything, or rewrite `.githooks/pre-commit` to `exit 0`. The reference build's own
session log named this hole honestly ("I used the Write tool myself to route around my own block"), and the next
iteration closed it with a second `PreToolUse` hook matched on the file-writing tools:

```json
{
  "matcher": "Write|Edit|MultiEdit|NotebookEdit",
  "hooks": [
    {
      "type": "command",
      "command": "node \"${CLAUDE_PROJECT_DIR}/.claude/hooks/protect-gate-machinery.ts\"",
      "timeout": 15
    }
  ]
}
```

It refuses any write targeting three protected paths: `.githooks`, `.claude/hooks`, `.claude/settings.json`. Details
that matter:

- Match paths **by component suffix**, without touching the filesystem — so `/any/worktree/.githooks/pre-commit` is
  covered, but a lookalike like `my.githooksbackup/` is not.
- Walk *all* the path-bearing keys of the tool input, including per-edit paths in multi-edit payloads.
- **No escape hatch, on purpose.** No environment variable or flag lifts this. Every escape is a bypass vector; a guard
  you can turn off from inside the loop it guards is a guard that can be argued with. Changing the gate machinery is
  meant to require a human acting outside the agent session. That is the property, not an oversight.

The refusal message ends with the sentence that summarizes the whole chapter:

> If you are here because a gate failed: fix the code. Do not disable the thing that told you.

---

## 6. Layer 4: The Stop Hook — Evidence Before Exit

Gates prove the code passes checks. They don't produce the *evidence trail* — the session log that Chapter 4's Gate 5
and the whole methodology depend on. The `Stop` hook refuses to let an agent end its turn when it has changed code but
written no session log.

A Stop hook is riskier than a PreToolUse hook: over-blocking a Bash command costs a rephrase; over-blocking a Stop can
strand an agent in a loop and burn a session. The design that makes a hard block safe:

```ts
// ---- THE LOOP GUARD. This must stay first. ----
if (payload.stop_hook_active) process.exit(0);
```

`stop_hook_active` is `false` on the first Stop and `true` after the hook has blocked once, so the hook is structurally
incapable of blocking twice in a row. Worst case: one extra turn. That bounded worst case is what makes a block correct
rather than a warning nobody reads. **If you cannot verify the flag exists on your version (probe it — §3), ship a
prominent warning instead of a block and say so.**

### Two silent bugs, both found by testing somewhere other than where the hook was written

**Do not use file mtimes to detect "a log was written."** The first version looked for any log file modified in the last
12 hours. In a long-lived checkout that works. In a fresh worktree or clone it fails completely — *every* file carries a
checkout-time mtime, so every stale log from every earlier feature looks freshly written, and the hook waves everything
through while appearing to work. Ask git instead; it knows the difference between "checked out" and "someone wrote
this":

- the log is **untracked** → just created; or
- it **differs from HEAD** → being appended to right now; or
- it **changed on this branch vs main** → written and committed during this work.

**`git status --porcelain` collapses untracked directories.** A brand-new `agent-logs/` directory shows up as a single
entry ending in `/`, and the file inside is never listed — so the hook *blocked an agent that had just written its log*.
`-uall` is required.

### Honest limits, so nobody over-reads a block

- The hook sees **repo state, not turn authorship** — it cannot tell "this turn changed code" from "the tree already had
  changes." It is a nudge, not a detector.
- It checks the log exists and is non-empty, nothing more. Whether the log is any *good* remains a human judgment.
- It deliberately does **not** demand an app log — most turns never start the app, and a hook that cries wolf is a hook
  people learn to route around.

---

## 7. Layer 5: The Escape Hatch That Leaves a Paper Trail

The one gap the gates leave: **an agent that deletes a failing test's assertions gets a green suite and a clean
commit.** Every automated gate passes while coverage is deleted; only the diff shows it.

The countermeasure is an assertion-count guard. It counts occurrences of `expect(` in staged spec files (index tree vs
HEAD tree, so it measures the commit being made), and when the count **drops**, it refuses the commit — unless the
message carries a trailer:

```
Gate-Justification: the two specs asserted the same three things; the duplicates were noise, not coverage.
```

This is the correct shape for an escape hatch: it does not *prevent* removing assertions — refactors legitimately do
that — it makes the removal **cost one honest sentence, recorded permanently at the moment of the change**, where review
can see it. Compare that with `--no-verify`, which is an escape hatch that records nothing.

Design decisions that transfer to any version of this guard:

**Keep it deliberately dumb.** Extracting a shared helper or merging two spec files will trip it, and one line of
justification is the intended cost. A guard clever enough to auto-approve refactors is a guard that can be argued with.

**The refusal must live in `commit-msg`, not `pre-commit`.** Git runs hooks in the order
`pre-commit → prepare-commit-msg → (editor) → commit-msg`, and pre-commit receives no message — it doesn't exist yet.
The tempting shortcut, reading `.git/COMMIT_EDITMSG` from pre-commit, is worse than unavailable: at pre-commit time that
file holds the **previous** commit's message, so a guard built on it silently approves an unjustified removal whenever
the *prior* commit happened to carry a trailer. "Believed active, actually inert" — the precise failure this whole
chapter exists to prevent. (Pre-commit prints an advisory when it sees the count drop, so the commit-msg refusal isn't a
surprise 23 seconds later.)

**Validate your counter against a known baseline.** The first implementation used the pathspec `*.spec.ts` and silently
missed every `*.e2e-spec.ts` file — the character before "spec" is a dash, not a dot. Roughly half the assertions in the
repo, invisible to the guard, which *looked like it was working the whole time*. The fix is both globs (
`'*.spec.ts' '*-spec.ts'`); the defense is the cross-check: the counter's total (1312 assertions across 38 files, in the
reference build) must match the documented suite baseline exactly. If your count comes out at half the expected figure,
you have this bug.

**What it cannot catch, stated plainly:** `expect(true).toBe(true)` counts the same as a real assertion. The guard
catches *deletion*, not *hollowing-out*. Reading the diff is still required.

---

## 08. Custom Gates: Budgets That Shape How Code Evolves

The assertion guard is one instance of a much wider pattern, and it is worth naming the pattern: **anything you can
find with static analysis can be a deterministic gate.** Rules of the language, formatting, the shape of dependency
trees, documentation size, naming conventions — if a script can count it, a hook can enforce it. You are not limited
to the gates your toolchain ships with.

The examples in this section come from a second reference project — a Python game codebase run with the same
agent-orchestration methodology — whose pre-commit hook is one line (`./bin/ci --ci`) in front of a small CI script
that runs the standard gates (ruff, pylint, pytest, mypy) *plus three custom ones*. Each custom gate is a trivial
script. This one is the entire implementation:

```python
#!/usr/bin/env python
import subprocess

count = 0
for f in ["src", "tests"]:
    result = subprocess.run([f"grep -r \"# type: ignore\" {f} | wc -l"],
                            capture_output=True, shell=True, check=True)
    count += int(result.stdout.decode("utf-8").strip())
print("Type ignore count:", count)
if count > 70:
    print("Added new type: ignore comments. Please remove them. This might mean refactoring code or verification through human intervention.")
    exit(1)
```

Twelve lines: grep, count, compare against a ceiling, exit non-zero. Anyone can write one of these in five minutes,
and that low cost is the point — the barrier to a new invariant is a lunch break, not a tooling project.

### The budget mechanic: a ratchet, not a rule

Notice what that script does *not* do. It does not forbid `# type: ignore`. The escape hatch stays available — some
situations genuinely need it — but the **total across the codebase is capped at its current value**. The companion
script does the same for `# pylint: disable=` comments (ceiling: 14), and a third does it for documentation files
that exceed the word budget encoded in their filenames (ceiling: the 125 files that were already over when the gate
was written).

That third one shows why budgets beat rules for retrofitting an invariant: 125 of 464 files were already in
violation. A hard rule would have meant either fixing everything before the gate could land (weeks of work nobody
will do) or not landing the gate. The budget lands **today**, freezes the debt at its current level, and turns every
future commit into a small forcing function: you can fix violations, you can leave them alone, but you cannot add
one. When the count drops, you lower the ceiling to match — that is the ratchet. Debt can only move one direction.

Two counting decisions from those scripts that transfer anywhere:

- **Count the thing that costs you, at the granularity you care about.** The doc-budget script counts *files over
  budget*, not total excess words — deliberately, so trimming one bloated file partway does not bank headroom that a
  new violation elsewhere can spend. Partial progress on one file should not buy permission to blow the budget on
  another.
- **Validate the counter against a known baseline** (same lesson as the assertion guard's pathspec bug). A counter
  that silently misses half its targets looks exactly like a healthy one.

### Budgets are what give the underlying rules teeth

The suppression budgets compose with the linter, and the composition is stronger than either half. A lint rule alone
is soft — when `too-many-instance-attributes` fires, the normal move is to shrug and add a `disable` comment. A
suppression budget alone is inert — it just describes the status quo. Together: the disable comment *is* the escape
hatch, the budget caps how many can exist, and when the budget is at its ceiling **the only way past a lint rule is
to actually restructure the code.**

This is not theoretical. In the feature retrospective from that project, both budgets sat exactly at their ceilings,
and the retrospective records four separate cases where an agent, unable to spend a suppression, produced a genuinely
better design instead — extracting a shared geometry helper rather than forking the trigonometry and eating the
duplicate-code warning, factoring one shared step-handler out of four near-identical ones, resolving an
attribute-count limit structurally instead of suppressing it. Its summary line is the best one-sentence case for this
whole section:

> **The ceilings did more design work than any instruction in the prompts.**

The same project also shows the pattern applied beyond lint suppressions: gates on the *shape* of the code. Rules
like duplicate-code detection and attribute-count caps are dependency-shape and structure constraints, and the
codebase visibly bears their fingerprints — its field-bundle dataclasses exist because a class hit the attribute cap
with no budget left to suppress it. And where one tool can't express an invariant, a test can be the gate: the
project's rule that pub/sub topic strings must be named constants, never literals, is enforced by an ordinary test
that greps the source and fails on any raw string. The mechanism doesn't matter — hook script, lint config, budget
counter, or test — what matters is that the invariant is checked by a machine on every commit instead of remembered
in a prompt.

### Why this matters more with LLM agents: the uniformity bias

LLMs and LLM agents have a strong bias toward making code look like the surrounding code. Most of the time that is
exactly what you want — consistency is why agent-written code reads like it belongs. But the bias has a sharp edge:
**agents propagate whatever they see, including the exceptions.** One `# type: ignore` in a file an agent reads
becomes the "house style" for handling awkward types; three commits later there are ten. An unusual workaround
written for one genuinely exceptional situation gets pattern-matched into places that aren't exceptional at all. A
human might ask "should I really copy this?"; an agent mostly won't.

Budgets are the containment mechanism for exactly this. They let you keep a place where the invariant is deliberately
ignored — the weird corner of the codebase that genuinely needs the escape hatch — without that corner becoming a
template. At the ceiling, an agent that wants a new suppression must remove an old one or restructure, which means
the exceptional idiom stays *exceptional* by construction rather than by vigilance. The prompt no longer needs to say
"don't copy the workaround in `legacy_adapter.py`"; the budget makes copying it fail.

The bias cuts the other way too, and the fix is the same family of tooling: when a codebase has an idiom that is
unusual *on purpose*, agents (and auto-fixers) will helpfully "correct" it back to the common form. The reference
project pins one of these in its lint config — a deliberately indirect spelling for reaching protected members in
tests is excluded from the auto-fix rule that would rewrite it, with a comment explaining that undoing it would spend
a suppression from the budget. Protecting a deliberate exception from uniformity pressure is as much a gate's job as
preventing an accidental one from spreading.

---

## 9. Installation: The Fresh-Clone Hole and the Self-Check

Everything above has a single point of failure: **`core.hooksPath` is per-clone config, and git will not run a hook you
haven't pointed it at.** A fresh clone that never sets it is completely ungated, with everything looking normal. This is
the biggest hole in the guarantee and it cannot be closed from inside the repo. Three mitigations, layered:

**1. One documented setup command.** A committed `scripts/setup-worktree.sh` takes a fresh worktree (or clone) to
working state: creates `.env` from the template (refusing to overwrite an existing one — it holds real secrets),
reserves genuinely-free ports, runs `npm install`, and sets `core.hooksPath`:

```bash
step "4. Validation gates"
CURRENT="$(git config --get core.hooksPath || true)"
if [ "$CURRENT" = ".githooks" ]; then
  ok "core.hooksPath already .githooks"
else
  git config core.hooksPath .githooks || die "could not set core.hooksPath."
fi
for h in pre-commit commit-msg; do
  [ -x "$ROOT/.githooks/$h" ] || warn ".githooks/$h missing or not executable — gates will NOT run."
done
```

Notice the elegant division of authority: the bypass block refuses `git config core.hooksPath …` *typed as a Bash tool
call*, but this script sets the same key legally — because it is a reviewed, committed file, not an ad-hoc command. The
enforcement layer permits its own installation only through the sanctioned path.

**2. The hooks check each other.** The git-side pre-commit hook verifies the Claude-side machinery on every commit —
settings file present, hook scripts present, and Node actually able to execute them — and **warns rather than blocks**
when something is off. The reasoning is a good template for deciding fail directions: the git hooks *are* the gate
enforcement; the Claude hooks are tamper-resistance on top. Losing them costs bypass-prevention, not gate execution, so
blocking a commit over it would be disproportionate. (Even this self-check had a worktree bug: it originally probed by
writing into `$ROOT/.git` — which is a *file*, not a directory, in a linked worktree. Probe in a temp dir.)

**3. A regression matrix, run deliberately.** The reference build keeps a 72-case matrix — every bypass vector variant
expecting `block`, every load-bearing false-positive case expecting `allow` — runnable with one command. It is
deliberately **not** part of the pre-commit gate, and the reason is a design principle: the matrix creates real
worktrees and binds real ports, so wiring it into every commit would fail whenever your own dev server is running — a
false positive that would teach everyone to route around the gates. The allow cases are as load-bearing as the block
cases; a guard people route around is worse than none, because it still carries the reputation of protection.

### Making the unconditional test gate viable

An unconditional `npm test` on every commit, from any worktree, is only tolerable if the suite is fast and *isolated*.
Two supporting pieces from the reference build:

- **Per-worktree, per-worker database namespacing.** Each worktree derives a stable slot ID by hashing its own path (
  `sha256(worktreePath).slice(0, 8)`) into the test database names. The path, not `git rev-parse --git-common-dir` — the
  common dir resolves to the *main* repo's `.git` from every worktree, which would hand every worktree the same slot:
  the same collision, now wearing a hash. And a pure function of the worktree rather than PID/time/random, so a run
  killed with Ctrl-C leaves databases the *next* run of that worktree can recognize and sweep.
- **Port reservation that checks both realities.** A bind test answers "is something listening right now?", but setup
  runs *before* dev servers start — so two worktrees set up ten minutes apart both get told 3000/3001 are free. The
  setup script also reads every sibling worktree's `.env` as a reservation ledger, requiring a port to be both bind-free
  and unreserved.

---

## 10. What Changes in Your Prompts

The payoff of all of the above is subtraction. Compare an agent prompt before and after:

**Before (gates by discipline):** every prompt carries the gate table, the "run all five gates" instruction, the "paste
output in your session log" instruction, and the standing rules ("do not weaken a test", "write a session log before
finishing") — and the orchestrator re-runs the gates afterward anyway.

**After (gates by mechanism):**

- Type-check, lint, and tests **disappear from prompts entirely.** The commit is the proof. Prompts still *state* the
  bar ("all gates green") but no longer need to beg anyone to run anything, and the orchestrator never re-runs them.
- "Do not bypass the gates" stops being a rule the agent must remember and becomes a wall the agent cannot accidentally
  walk through — with a refusal message that redirects it productively when it tries.
- "Fix the code, not the assertion" stops being retrospective advice and becomes a trailer the commit physically
  requires at the moment of the change.
- "Write your session log" stops being a prompt paragraph and becomes a Stop hook that costs one extra turn at most.
- Orchestrator verification effort moves to the residue only a human can judge: the staged diff (did meaning change?),
  the evidence artifacts, and Gate 5 manual verification.

What stays in prompts: everything the mechanism honestly can't see. The gates prove the suite is green; they cannot
prove the suite still *means* anything, that the screenshot shows what its filename claims, or that the feature works in
a browser.

---

## 11. Adding This to Your Own Repository

The order matters — you will be subject to your own hooks as you build them, which is a feature. Sequence so you're
never locked out with no path forward:

1. **Measure your gates.** Time type-check, lint, and the full suite. Under ~30 seconds total: run everything
   unconditionally in pre-commit. Materially slower: fix the suite's speed first — do not reach for changed-files
   scoping.
2. **Create `.githooks/`** with a `pre-commit` that runs the gates sequentially, cheapest first, with a dependency
   preflight that refuses (never skips) when a dependency is down, and dumps the full log on failure. Set
   `core.hooksPath` and commit the directory.
3. **Prove the rejections.** Stage a deliberate type error, a lint error, and a failing test — each clean for the
   earlier gates so the refusal is attributable to exactly one — and capture the three rejections. Stop your database
   container for real and capture that refusal too.
4. **Probe the Claude Code hook contract** in a scratch project (payload-capture hooks + headless sessions) before
   writing anything that depends on it. Verify the stdin shape, the exit-2/stderr contract, and the Stop loop-guard flag
   on *your* version.
5. **Write the bypass block** as a `PreToolUse` hook on Bash: tokeniser + git option grammar, the nine vectors,
   segment-wise analysis of compound commands, over-blocking fallback. Build the allow-list of false positives at the
   same time — it is half the work and half the value.
6. **Protect the machinery** with a second hook on `Write|Edit|MultiEdit|NotebookEdit` covering the hooks directories
   and the settings file. No escape hatch.
7. **Add the assertion guard** in `commit-msg` (not pre-commit), with a `Gate-Justification:` trailer as the recorded
   escape hatch. Validate the counter's total against your suite's known baseline before trusting it.
8. **Add budget gates for your own invariants.** Pick the escape hatches and exceptions you don't want spreading
   (`# type: ignore`, lint suppressions, oversized docs, whatever static analysis can count in your codebase), record
   each current count as a ceiling in a ten-line script, and add the scripts to the pre-commit hook. Lower each
   ceiling as the count drops.
9. **Add the Stop hook** — hard block only if you verified the loop-guard flag in step 4; otherwise a loud warning.
   Decide evidence-of-work from git state, never mtimes, with `-uall`.
10. **Write the setup script** that arms everything on a fresh clone/worktree, and document it as the one canonical
    setup command in your README.
11. **Build the regression matrix** — every vector expecting block, every legitimate near-miss expecting allow — and
    keep it out of the commit gate.
12. **Test everything in a fresh worktree, not just your main checkout.** Three of the reference build's silent bugs
    were invisible in the directory where the code was written and immediate in a fresh worktree.

---

## Key Takeaways

- [ ] A gate that lives in a prompt is a request; a gate that lives in the repo is a fact. Move type-check, lint, and
  tests into a committed `.githooks/pre-commit` activated by `core.hooksPath`.
- [ ] The guarantee's value is that it is **unconditional** — no pre-push tier, no changed-files scoping. Keep the suite
  fast enough that unconditional is affordable.
- [ ] A hook that cannot run its gate must **refuse, loudly and specifically** — a silent pass is worse than no hook at
  all.
- [ ] Enforcement without bypass-blocking is theatre. Block all nine vectors, in compound commands too — but the
  false-positive allow-list is what keeps the block trusted, and over-blocking beats under-blocking when they conflict.
- [ ] Escape hatches should leave a paper trail (`Gate-Justification:` trailer), not disappear silently (`--no-verify`).
- [ ] Anything static analysis can count can be a gate, and a ten-line script is enough. Budgets — current count as a
  ceiling, ratcheted downward — let you land an invariant today without fixing all existing debt first, and at the
  ceiling they force restructuring instead of suppression.
- [ ] LLM agents propagate whatever they see, exceptions included. Budgets keep deliberate exceptions from becoming the
  house style — and lint config can protect an *intentional* exception from being "fixed" back to uniformity.
- [ ] Verify every contract empirically — hook payloads, git's hook ordering, pathspec behavior. The reference build
  caught documentation that contradicted observed behavior, a commit-msg file that holds the *previous* message at
  pre-commit time, and a glob that silently missed half the test suite.
- [ ] Test enforcement machinery in a **fresh worktree**. "Believed active, actually inert" is the failure mode that
  destroys the whole mechanism, and it is always silent.
- [ ] Be honest about strength: this is a speed bump that makes accidental bypass impossible and deliberate bypass
  visible — not a sandbox. The residue that still needs human eyes: diffs, evidence, and Gate 5.

---

**Previous Chapter:** [Context Management](07-context-management.md) · **Builds on:
** [The 5 Validation Gates](03-validation-gates.md)
