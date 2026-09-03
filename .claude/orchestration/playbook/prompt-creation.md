# Prompt Creation: Operational Workflow

**What:** How to assemble an agent prompt from the templates, and what every prompt must carry

**When:** Before launching any agent, after the pre-execution checklist has cleared

**Think:** Cheat sheet (keep open while working)

**Templates (copy-paste ready):** @.claude/orchestration/methodology/prompt-templates.md

---

## Step 1 — Pick the template

| Situation                                                           | Template                                                       |
| ------------------------------------------------------------------- | -------------------------------------------------------------- |
| Infrastructure task, no shared contract (database, API scaffolding)  | prompt-templates.md § Infrastructure-Independent Agent Prompts   |
| Contract-code integration (types → controllers → UI)                 | prompt-templates.md § Schema-Code Integration Prompts            |
| Fixing a bug rather than building a feature                          | @.claude/orchestration/methodology/bugfix-prompt-template.md     |

Unsure which agent the work needs at all: @.claude/orchestration/methodology/agent-specs-library.md

**Coordination level drives this choice.** Determine it first — `agent-coordination.md` step 1.

---

## Step 2 — Fill in the six mandatory blocks

Every prompt, without exception:

- [ ] **Session logging** — log path, which template, the critical points this agent must record
- [ ] **Atomic commit guidelines** — the four principles and a suggested commit sequence
- [ ] **Coordination requirements** — for MEDIUM and HIGH tasks: dependencies, integration points, field naming
- [ ] **Technology stack** — exact versions, import patterns, framework patterns, language standards
- [ ] **Quality standards** — type safety, tests, error handling, accessibility where relevant
- [ ] **Success criteria** — specific and verifiable, never "feature works"

**What each block must contain:** methodology/coordination-protocols.md § Quick Protocol Validation Checklist
**Turning vague criteria into testable ones:** @.claude/orchestration/methodology/success-criteria.md
**Logging templates:** @.claude/orchestration/templates/logging-templates.md

---

## Step 3 — Append the universal additions

- [ ] The five validation gates, stated as a precondition of claiming "COMPLETE"
- [ ] Manual verification, named for the surface: browser for frontend, request-level checks for backend
- [ ] The instruction to paste gate output into the session log

**Gate commands, required output and evidence format:** @.claude/orchestration/methodology/validation-gates.md
**Why manual verification is separate from the test suite:** validation-gates.md § Gate 5: Manual Testing

Automated tests passing is not the same as the feature working. A suite can be green while the schema was never
applied — that is the failure Gate 5 exists to catch, and a prompt that omits it makes the gate optional in
practice.

---

## Step 4 — Check before you launch

- [ ] All six blocks present
- [ ] Success criteria name specific observable outcomes
- [ ] Coordination section matches the level determined in step 1
- [ ] Blockers removed in pre-execution are stated in the prompt as "X is FIXED"

---

## What makes prompts work

- **Specificity over completeness.** A short prompt naming exact files, exact field names and exact commands beats a
  long one describing intent.
- **Coordination stated, not implied.** If another agent's output is an input, name the file and the fields.
- **Standards inline.** An agent will not go and look up a standard the prompt only alludes to.

**Full guidance:** methodology/prompt-templates.md § Agent Prompt Best Practices

---

**Status:** The six blocks and the universal additions are mandatory. A prompt missing one is an incomplete prompt.
