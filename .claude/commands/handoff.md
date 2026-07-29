---
description: Create a session handoff file to transfer context to a new Claude Code session when current session needs to close.
argument-hint: '[feature-id (optional - auto-detects from context)]'
---

# /handoff - Session Context Transfer File Generator

## Command Expansion

When executed, this slash command expands to:

````text
CRITICAL CONSTRAINT: This command creates ONLY a session handoff document. You MUST NOT:
- ❌ Implement any code fixes
- ❌ Modify any application code
- ❌ Run any code implementations
- ❌ Apply any bug fixes
- ❌ Edit any files outside .claude/orchestration/meta/session-handoffs/

Your ONLY task is to create a comprehensive session handoff markdown file documenting current state.

You are the Orchestration Partner. Create a comprehensive session handoff file to transfer current context to a new session.

HANDOFF FILE PURPOSE:
When the current session needs to close (token limits, long conversation, context refresh), this file enables seamless continuation in a new session without losing context or momentum.

ARGUMENT (OPTIONAL):
- Feature ID (e.g., "f04", "f05-auth") - determines filename: `.claude/orchestration/meta/session-handoffs/YYYY-MM-DD-{feature-id}-handoff.md`

**If no argument provided, you MUST auto-detect the current context:**
1. Analyze conversation history to determine what's being worked on
2. Check recent files modified/created
3. Infer feature context from:
   - Most recent workspace directory referenced
   - Agent execution work
   - Bug fixes or validation work discussed
   - Next feature being prepared
4. Generate appropriate filename based on context:
   - If working on specific feature: `YYYY-MM-DD-{feature-slug}-{context}.md`
   - If validating/fixing bugs: `YYYY-MM-DD-{feature-name}-{bugfix|validation}.md`
   - If preparing next feature: `YYYY-MM-DD-pre-{feature-name}.md`

**Examples of auto-detected filenames:**
- Session fixing auth bugs → `2025-10-02-auth-bugfix.md`
- Session validating notification feature → `2025-10-02-notifications-validation.md`
- Session preparing mobile feature → `2025-10-02-pre-mobile-ready.md`

HANDOFF FILE STRUCTURE (Use This Template):

```markdown
# Session Handoff: {Feature Name}

**Date:** {current-date}
**Feature ID:** {feature-id}
**Status:** {current-status}
**Handoff Reason:** {why session closing: token limit / context refresh / long conversation}

---

## Current State Summary

**What's Complete:**
- [ ] List all completed tasks
- [ ] Infrastructure work
- [ ] Agent executions (which ones done)
- [ ] Testing status
- [ ] Documentation updated

**What's In Progress:**
- Describe any partially complete work
- Current debugging/investigation
- Files being edited

**What's Blocked:**
- Any blockers or issues discovered
- Decisions needed
- External dependencies

---

## Critical Context for Next Session

### Work Completed This Session
1. **{Major accomplishment 1}**
   - Details, files changed, outcomes
   - Any learnings or insights

2. **{Major accomplishment 2}**
   - Details, files changed, outcomes

### Bugs/Issues Discovered
**Bug #1:** {Brief description}
- **File:** `path/to/file.ts:line`
- **Issue:** What's wrong
- **Impact:** How it affects functionality
- **Status:** {Identified / Fix in progress / Fixed}

**Bug #2:** ...

### Key Decisions Made
1. **{Decision topic}** - {What was decided and why}
2. **{Decision topic}** - {What was decided and why}

### Files Modified
````

{List all files changed with brief description of changes}
path/to/file1.ts - Added X functionality
path/to/file2.ts - Fixed Y bug
.claude/workspace/fXX/... - Documentation updates

````

---

## Next Steps (Priority Order)

### Immediate Actions
1. [ ] {Most urgent task}
2. [ ] {Second priority}
3. [ ] {Third priority}

### Validation Needed
- [ ] Run tests: `npm test`
- [ ] Check TypeScript: `npm run type-check`
- [ ] Check ESLint: `npm run lint`
- [ ] Manual testing: {specific scenarios to test}

### Documentation Updates Needed
- [ ] Update retrospective if bugs found
- [ ] Update agent prompts if improvements identified
- [ ] Create bug fix prompts if needed

---

## Important Context Preservation

### Agent Execution Status
**Task 0 (Infrastructure):** {Complete / In Progress / Not Started}
- Agent session log: `.claude/workspace/{feature}/agent-logs/{filename}`
- Key deliverables: {list}
- Issues found: {any problems}

**Task A:** {status and details}
**Task B:** {status and details}
**Task C:** {status and details}

### Feature Insights
{Any patterns, learnings, or issues discovered during this session that should inform future work or be added to retrospective}

### Open Questions
1. {Question needing decision}
2. {Question needing clarification}

---

## Session Continuation Instructions

**For Next Orchestration Partner Session:**

1. **Initialization:**
   ```bash
   /orchestration .claude/orchestration/meta/session-handoffs/{this-file.md}
````

2. **Immediate Review:**
    - Read "Critical Context for Next Session"
    - Check "Bugs/Issues Discovered" section
    - Review "Next Steps" priority list

3. **Resume Work:**
    - Start with highest priority "Next Steps"
    - Run validation checklist if any code changes made
    - Continue with bug fixes or next tasks

4. **If Bugs Found:**
    - Create bug fix prompt in `.claude/workspace/{feature}/bugfix-prompt.md`
    - Update retrospective with findings
    - Execute fixes systematically

---

## Files to Reference in New Session

**Feature Documentation:**

- `.claude/workspace/{feature}/execution-plan.md`
- `.claude/workspace/{feature}/retrospective.md`

**Agent Prompts:**

- `.claude/workspace/{feature}/agent-prompts/*.md`

**Session Logs:**

- `.claude/workspace/{feature}/agent-logs/*.md`

---

## Token/Context Notes

**Current Session Stats:**

- Approximate token usage: {estimate}
- Conversation length: {number of messages}
- Files read: {count}
- Reason for handoff: {token limit / complexity / refresh}

**For New Session Efficiency:**

- Pre-read these files first: {list critical files}
- Skip reading: {list files that aren't needed}
- Focus on: {specific aspect of work}

---

**Handoff Created By:** Orchestration Partner
**Session Continuation:** Use `/orchestration {this-file}` in new session
**Status:** Ready for continuation

````

HANDOFF FILE CREATION STEPS (DOCUMENTATION ONLY):

1. **Analyze Current Session Context:**
   - Review conversation history for completed work
   - Identify any bugs, issues, or blockers discovered
   - List all files that were modified or created (by user or previous work)
   - Document key decisions made
   - **DO NOT implement fixes - only document what was found**

2. **Fill Template with Specifics:**
   - Replace all {placeholders} with actual context
   - Be specific about file paths and line numbers
   - Include exact error messages if bugs found
   - Prioritize next steps realistically
   - **Document what needs fixing - do not fix it**

3. **Save File (ONLY File You Should Create):**
   - Filename format: `.claude/orchestration/meta/session-handoffs/YYYY-MM-DD-{feature-id}-handoff.md`
   - Use today's date in YYYY-MM-DD format
   - Example: `.claude/orchestration/meta/session-handoffs/2025-10-01-f04-validation-complete.md`
   - **This is the ONLY file you should create or modify**

4. **Confirm Completeness:**
   - Verify all critical context captured
   - Check that next session can resume without asking questions
   - Ensure file paths and references are accurate
   - **Verify you did NOT modify any application code**

5. **Report for Code Review:**
   ```markdown
   ✅ Session handoff file created: `.claude/orchestration/meta/session-handoffs/{filename}.md`

   **Current Status:** {brief summary}
   **Next Steps:** {top 3 priorities for NEXT SESSION to implement}
   **Blockers:** {any issues or decisions needed}

   **To Continue in New Session:**
   Run: `/orchestration .claude/orchestration/meta/session-handoffs/{filename}.md`
````

REMINDER: You are creating DOCUMENTATION of current state, not implementing changes. Leave all implementations for the
next session.

QUALITY CHECKLIST:

- [ ] All completed work documented
- [ ] All bugs/issues captured with file/line references
- [ ] Next steps prioritized clearly
- [ ] Agent execution status complete
- [ ] Files list is accurate
- [ ] Feature insights recorded (for retrospective)
- [ ] New session can resume immediately without questions

---

## Why This Command Exists

**Problem:** Long sessions hit token limits or need context refresh
**Solution:** Structured handoff file enables seamless continuation
**Benefit:** No context loss, no repeated questions, immediate productivity

**Use Cases:**

1. Current session approaching token limit
2. Conversation too long, refresh needed
3. Need to context-switch then return to feature
4. Multiple Claude Code instances working on different aspects

---

## Example Usage

```bash
# Option 1: Explicit feature ID
/handoff f04

# Option 2: Auto-detect from context (recommended)
/handoff

# Both create handoff file documenting:
# - Current work status
# - Bugs/issues found
# - Methodology updates
# - Next steps for continuation
```

**Auto-detection examples:**

- Working on notifications validation → Creates `2025-10-02-notifications-validation.md`
- Updating methodology docs → Creates `2025-10-02-methodology-updates.md`
- Preparing for authentication → Creates `2025-10-02-pre-auth-ready.md`

---

**This command should be used proactively when:**

- Session getting long (>50 messages)
- Token usage high
- About to run complex agent tasks that will consume tokens
- Natural break point (validation complete, bugs documented)

```

## Arguments

**Optional:**
- `feature-id` - The feature being worked on (e.g., "f04", "f05-auth")
  - If provided: Uses this for filename
  - If omitted: Auto-detects from conversation context (see auto-detection rules above)

## Expected Output

A comprehensive markdown handoff file at:
`.claude/orchestration/meta/session-handoffs/YYYY-MM-DD-{feature-id}-handoff.md`

That new session can use with:
`/orchestration .claude/orchestration/meta/session-handoffs/{filename}.md`

---

**Status:** Ready for use
**Documentation:** Self-documenting command
**Template:** Embedded in command expansion
```
