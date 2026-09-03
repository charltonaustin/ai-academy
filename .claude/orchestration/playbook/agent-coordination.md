# Agent Coordination: Quick Operational Checklist

**What:** How much coordination parallel agents need, and what their prompts must carry

**When:** Planning parallel execution, writing agent prompts, before accepting "COMPLETE"

**Think:** Cheat sheet (keep open while working)

**Complete specification:** @.claude/orchestration/methodology/coordination-protocols.md

---

## 1. Classify the coordination level

| Level      | Looks like                                                      | What it needs                     |
| ---------- | --------------------------------------------------------------- | --------------------------------- |
| **LOW**    | Independent concerns, no shared types or contracts               | Naming conventions only           |
| **MEDIUM** | Shared contracts at API or component boundaries                  | Contract agreed before execution  |
| **HIGH**   | Contract-code integration (shared types → controllers → UI)      | Full coordination architecture    |

Risk read: **GREEN** independent, proven parallel pattern · **YELLOW** coordination needed, mechanisms exist ·
**RED** high complexity, consider sequential.

**Flowchart:** `coordination-decision-tree.md`
**Assessment questions:** methodology/coordination-protocols.md § Phase 1: Task Classification and
Coordination Planning

---

## 2. Before parallel execution (HIGH coordination)

- [ ] Technology stack locked in writing: versions, import patterns, error-handling patterns
- [ ] Field naming convention locked (one case convention, written down, cited in every prompt)
- [ ] Shared-context documents identified and owned: contract types, conventions, integration points
- [ ] Execution order set: the agent that authors the contract runs first, consumers after

**Stack lock template:** methodology/coordination-protocols.md § 1.2 Technology Stack Coordination Lock
**Context inheritance rules:** methodology/coordination-protocols.md § 2.2 Shared Context Management System

---

## 3. During execution

- [ ] Consumers read the producer's actual output, never an assumed or remembered shape
- [ ] Decisions that affect another agent are broadcast, not just recorded
- [ ] Every agent keeps a session log at `.claude/workspace/[feature]/agent-logs/[agent-name]-session.md`

**Logging templates:** @.claude/orchestration/templates/logging-templates.md
**Consultation process and documentation format:** methodology/coordination-protocols.md § 2.1 Cross-Agent
Communication Protocol

---

## 4. Integration checkpoint (between parallel completion and delivery)

Every agent reporting "complete" is not a working system. This step is the one most often skipped.

- [ ] Field names identical across contract, server and client
- [ ] Consumers import the shared types; nothing is redefined locally
- [ ] The endpoints called are the endpoints that exist
- [ ] Fresh clone → install → run → working application
- [ ] UI renders real data (no `undefined`)

**Full checklist and failure-resolution protocol:** methodology/coordination-protocols.md § Integration Validation
Layer Protocol

---

## 5. Five gates before any agent claims COMPLETE

1. TypeScript compilation
2. ESLint
3. Tests passing
4. Process cleanup
5. Manual testing

**Commands, required output and evidence format:** @.claude/orchestration/methodology/validation-gates.md

Claiming "COMPLETE" without passing all five = incomplete task. Fix, then re-run every gate, not just the one that
failed.

---

## 6. Prompt-inclusion checklist

Verify every agent prompt carries:

- [ ] Session logging requirement (location, template, critical log points)
- [ ] Atomic commit guidelines
- [ ] Coordination requirements (MEDIUM and HIGH tasks)
- [ ] Technology stack specifications
- [ ] Quality standards
- [ ] Success criteria

**What each block must contain:** methodology/coordination-protocols.md § Quick Protocol Validation Checklist

The engineer should never have to remember these. The orchestration partner adds them.

---

**Status:** All six steps mandatory for parallel execution. Omitting one is how integration failures reach delivery.
