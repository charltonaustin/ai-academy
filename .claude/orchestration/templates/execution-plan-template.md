# {Feature Name} - Execution Plan

**Date Created:** {YYYY-MM-DD}
**Status:** {Planning / In Progress / Complete}

---

## Feature Requirements

{Detailed description of what needs to be built, as provided by engineer}

**User Story (if applicable):**

- As a {user type}
- I want to {capability}
- So that {benefit}

**Acceptance Criteria:**

- {Specific requirement 1}
- {Specific requirement 2}
- {Specific requirement 3}

---

## Coordination Analysis

**Coordination Level:** [LOW / MEDIUM / HIGH]

**Reasoning:**

- **LOW:** Independent infrastructure tasks (database setup, deployment config)
- **MEDIUM:** Imports existing systems (Dashboard, backend services)
- **HIGH:** Contract-dependent (shared API types + controllers + UI components)

**Selected:** {LEVEL} because {reasoning}

**Field Naming Convention (if HIGH coordination):**

- All API fields (DTOs): camelCase (leadId, budgetMin, firstName)
- Database layer: snake_case (mapped in the models/services)
- Frontend code: camelCase ONLY (matching the shared API types exactly)

---

## Import Dependency Analysis

**Task Exports/Imports:**

**Task A:**

- Exports: {list files/modules Task A creates}
- Used by: {which tasks import from A}

**Task B:**

- Imports: {what Task B needs from Task A}
- Exports: {what Task B creates}
- Used by: {which tasks import from B}

**Task C:**

- Imports: {what Task C needs from previous tasks}
- Exports: {what Task C creates}

**Dependency Chain:**

```
Task A → exports {files} → Task B imports → exports {files} → Task C imports
```

**Execution Order:**

- [ ] **Sequential:** Tasks have import dependencies (A → B → C)
- [ ] **Parallel:** Tasks are independent (A || B || C)

**Selected:** {Sequential / Parallel}

**Reasoning:** {Explain dependency chain or independence}

---

## Integration Strategy

**Integration Ownership:**

For multi-component features, explicit integration responsibility:

**Component A:**

- Creates: {list files}
- Integrates into: {target system/page/component}
- Verification: {how to confirm integration worked}

**Component B:**

- Creates: {list files}
- Integrates into: {target system/page/component}
- Verification: {how to confirm integration worked}

**CRITICAL:** Each agent owns COMPLETE integration (creation + integration + verification).

**Integration Checklist:**

- [ ] Component A integrated into {target}
- [ ] Component B integrated into {target}
- [ ] All integrations verified working
- [ ] No "created but not integrated" failures

---

## Task Breakdown

### Task A: {Task Name}

**Template Used:** {template-name}.md (from `.claude/templates/agent-prompts/`)

**Primary Objectives:**

- {Objective 1: what needs to be accomplished}
- {Objective 2: specific deliverable}
- {Objective 3: integration requirement}

**Deliverables:**

- {Specific file or component 1}
- {Specific file or component 2}
- {Integration verification}

**Integration:**

- Creates: {what gets created}
- Integrates into: {what system/component}
- Verifies: {how integration is confirmed}

**Dependencies:**

- Requires: {what must exist before this task}
- Blocks: {what tasks depend on this completing}

**Estimated Time:** {hours}

---

### Task B: {Task Name}

**Template Used:** {template-name}.md

**Primary Objectives:**

- {Objective 1}
- {Objective 2}
- {Objective 3}

**Deliverables:**

- {Deliverable 1}
- {Deliverable 2}

**Integration:**

- Creates: {files}
- Integrates into: {target}
- Verifies: {confirmation method}

**Dependencies:**

- Requires: {prerequisites}
- Blocks: {dependent tasks}

**Estimated Time:** {hours}

---

### Task C: {Task Name}

{Repeat structure for each task}

---

## Proven Pattern Validation

**Before delivering prompts, validate against proven patterns:**

**Infrastructure-First Check:**

- [ ] Does foundation exist before building on it?
- [ ] If agent needs Dashboard, does Dashboard exist first?
- [ ] If sequential: Does Task A complete before Task B needs it?
- [ ] Is testing framework ready if tests required?

**Functional Completeness Check:**

- [ ] Does prompt cover end-to-end workflow? (creation + integration + verification)
- [ ] Is integration explicitly required? (not assumed)
- [ ] Are deliverables specific? ("Widget + Dashboard import" not just "Widget")
- [ ] Would feature work after fresh clone + setup?

**Integration Validation Check:**

- [ ] Does prompt require agent to verify integration worked?
- [ ] Specific success criteria? ("/dashboard displays widget" not "widget works")
- [ ] Manual testing of integration? ("Open /dashboard, verify widget visible")
- [ ] Browser console check required? (0 errors expected)

**If ANY unchecked → Update prompts before delivering**

---

## Success Criteria (Specific Verification)

**Manual Testing Validation:**

1. **Setup:** {Any required setup steps before testing}
2. **Action:** Open browser/device to {SPECIFIC_URL}
3. **Verify:** {SPECIFIC_ELEMENT} displays {SPECIFIC_BEHAVIOR}
4. **Test:** {SPECIFIC_INTERACTION} results in {SPECIFIC_OUTCOME}
5. **Console:** Check browser console - 0 errors expected

**Integration Verification Checklist:**

- [ ] {Component} integrated into {Target}
- [ ] {Target} displays {Component} correctly at {Location}
- [ ] User can interact with {Component} and see {Behavior}
- [ ] All {Count} components/features working together

**NOT "feature works" - but "user sees X when they do Y"**

**Example:**

- ❌ GENERIC: "Authentication feature works"
- ✅ SPECIFIC: "Opening /login, entering valid credentials, clicking submit redirects to /dashboard with user name
  displayed in header"

---

## Timeline Estimate

**Sequential Execution (if applicable):**

- Task A: {hours}
- Task B: {hours}
- Task C: {hours}
- **Total:** {sum} hours

**Parallel Execution (if applicable):**

- Tasks A/B/C in parallel: {max(task_hours)} hours
- **Time savings:** {sequential - parallel} hours ({percentage}%)

**Selected Approach:** {Sequential / Parallel}
**Estimated Timeline:** {hours} hours
**Rationale:** {Why this approach and timeline}

---

## Key Gotchas to Watch For

**Feature-Specific Gotchas:**

- {Specific gotcha for this feature type}
- {Known issue with this technology stack}
- {Integration challenge to prevent}

**General Gotchas:**

- {Hydration errors if Next.js frontend}
- {TypeScript validation before claiming complete}
- {Manual browser/device testing required}
- {Process cleanup after tests}

---

## Agent Prompt Checklist

**Before launching agents, verify all prompts include:**

- [ ] Session logging requirement (`.claude/workspace/{feature}/agent-logs/{task}-session.md`)
- [ ] 5 validation gates (TypeScript, ESLint, tests, process cleanup, manual testing)
- [ ] Testing requirements (unit + integration, NO MOCKS for integration)
- [ ] Dependency validation (if task has imports)
- [ ] Coordination protocols (if high coordination)
- [ ] Field naming conventions (camelCase for shared API types)
- [ ] Technology stack specifications
- [ ] Quality standards (A+ code)
- [ ] Specific integration verification (not generic "works")
- [ ] Manual testing of integration point

**If ANY missing → Prompt incomplete**

---

## Notes / Additional Context

{Free-form notes about feature:}

- {Related features or systems}
- {Special considerations}
- {Links to documentation}
- {Design decisions to remember}

---

**Template Version:** 1.0
**Created By:** Orchestration Partner
