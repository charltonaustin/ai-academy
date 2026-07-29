# Session Continuity Protocol

**Purpose:** Maintain context across sessions for smooth multi-session feature development

**Source:** Consolidated from methodology-partner-workflow.md and meta/session-handoff-protocol.md

---

## Session Handoff System

### When to Create Handoff

**Create handoff file when:**

- Session needs to close (context limits, MCP installation, etc.)
- Feature continues across multiple sessions
- Complex work needs context preservation
- Blockers discovered that need async resolution

### Handoff File Location

```
.claude/meta/session-handoffs/{date}-{topic}.md
```

**Git status:** Can be gitignored (local context) or checked in (historical record)

---

## What to Include in Handoffs

### Critical Sections

1. **Current State Summary:**
    - What's complete ✅
    - What's in progress 🔄
    - What's blocked 🚫

2. **Bugs/Issues Discovered:**
    - Description, impact, status
    - Steps to reproduce/fix
    - Priority

3. **Key Decisions Made:**
    - What was decided
    - Why (reasoning)
    - Impact on future work

4. **Files Modified:**
    - List all changed files
    - Context for each change

5. **Next Steps (Priority Order):**
    - Immediate actions (P0)
    - Secondary tasks (P1)
    - Nice-to-have (P2)

6. **Critical Context Preservation:**
    - Blockers to fix before resuming
    - Infrastructure requirements
    - Dependencies

---

## Session Continuation

### For Next Session

**1. Read handoff file:**

```bash
/orchestration .claude/meta/session-handoffs/{handoff-file}.md
```

**2. Orchestration partner extracts:**

- Previous blockers → fix proactively
- In-progress work → continuation plan
- Decisions made → maintain consistency

**3. Resume with context:**

- Blockers removed
- Clear continuation path
- No repeated failures

---

## Handoff Template

**See:** `templates/session-handoff.md`

**Key sections:**

- Current state
- Bugs/issues
- Decisions made
- Files modified
- Next steps
- Critical context

---

**Status:** Core protocol for multi-session workflows
**Evidence:** Proven pattern (handoff → proactive fixes → completion)
