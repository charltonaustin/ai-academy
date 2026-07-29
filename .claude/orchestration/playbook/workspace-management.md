# Workspace Management Protocol

**Purpose:** Structured feature delivery with execution planning, agent prompt persistence, debugging capability, and
retrospective learning.

---

## Why Workspace Management Matters

**Without structured workspace:**

- ❌ Prompts lost in chat history
- ❌ No debugging trail when agents fail
- ❌ No context recovery for multi-session features
- ❌ No learning accumulation across features

**With workspace management:**

- ✅ Organized feature directories
- ✅ Persistent execution plans
- ✅ Agent logs for debugging
- ✅ Retrospectives for compound learning
- ✅ Session continuity across days

---

## Directory Structure

```
.claude/workspace/
  {feature-slug}/
    execution-plan.md           # Created by orchestration partner BEFORE agents
    agent-prompts/
      {task-name}.md            # Saved by orchestration partner (persistent prompts)
    agent-logs/
      {task-name}-session.md    # Written by agents DURING execution
    retrospective.md            # Created AFTER feature complete (optional)
```

### File Purposes

**`execution-plan.md`** - Strategic Planning (Before Execution)

- Feature requirements
- Coordination analysis (low/medium/high)
- Import dependency analysis (sequential vs parallel)
- Integration strategy (who owns what)
- Task breakdown
- Proven pattern validation
- Specific success criteria
- Timeline estimate

**`agent-prompts/{task-name}.md`** - Prompt Persistence

- Complete agent prompts saved to files
- Engineers copy from files (not chat history)
- Version controlled (track prompt evolution)
- Reusable for similar features

**`agent-logs/{task-name}-session.md`** - Execution Trail

- Written BY agents during execution
- Technology decisions made
- Coordination validations performed
- Integration challenges encountered
- Pre-completion validation results
- Manual testing outcomes

**`retrospective.md`** - Feature Learning (After Completion)

- What went well (successes, effective patterns)
- What didn't go well (challenges, mistakes)
- Key learnings (insights, gotchas discovered)
- Action items (apply to next feature)

---

## Orchestration Partner Workflow

### Phase 1: Feature Planning (Create Workspace)

**When:** Engineer describes feature need

**Actions:**

1. **Create feature directory structure:**

```bash
mkdir -p .claude/workspace/{feature-slug}/agent-prompts
mkdir -p .claude/workspace/{feature-slug}/agent-logs
```

2. **Create `execution-plan.md`:**

**Template Location:** `.claude/templates/execution-plan-template.md`

Copy template and customize:

```markdown
# {Feature Name} - Execution Plan

**Date Created:** {YYYY-MM-DD}
**Status:** Planning

---

## Feature Requirements

{Engineer's description of what needs to be built}

---

## Coordination Analysis

**Coordination Level:** [LOW / MEDIUM / HIGH]

**Reasoning:**
- LOW: Independent infrastructure tasks (database setup, deployment config)
- MEDIUM: Imports existing systems (Dashboard, backend services)
- HIGH: Contract-dependent (shared API types + controllers + UI components)

**Selected:** {LEVEL} because {reasoning}

---

## Import Dependency Analysis

**Task Exports/Imports:**

- Task A exports: {list files/modules}
- Task B imports: {list dependencies from Task A}
- Task C imports: {list dependencies}

**Execution Order:**
- [ ] **Sequential:** Tasks have import dependencies (A → B → C)
- [ ] **Parallel:** Tasks are independent (A || B || C)

**Selected:** {Sequential/Parallel} because {dependency chain explanation}

---

## Integration Strategy

**Integration Ownership:**

For multi-component features, explicit integration responsibility:

- Component A: Creates {files} + integrates into {target} + verifies visible
- Component B: Creates {files} + integrates into {target} + verifies visible

**Critical:** Each agent owns COMPLETE integration (not just file creation).

---

## Task Breakdown

### Task A: {Task Name}
- **Template Used:** {template-name}.md
- **Primary Objectives:**
  - {Objective 1}
  - {Objective 2}
- **Deliverables:**
  - {Specific output 1}
  - {Specific output 2}
- **Integration:** {What gets integrated where}
- **Dependencies:** {What must exist first}

### Task B: {Task Name}
{repeat structure}

---

## Proven Pattern Validation

Before delivering prompts, validate against proven patterns:

- [ ] **Infrastructure-First:** Does foundation exist before building on it?
- [ ] **Functional Completeness:** Does prompt cover creation + integration + verification?
- [ ] **Integration Validation:** Does prompt require agent to verify integration worked?
- [ ] **Specific Success Criteria:** NOT "feature works" but "opening /X shows Y"

---

## Success Criteria (Specific Verification)

**Manual Testing Validation:**

1. Open browser to {SPECIFIC_URL}
2. Verify {SPECIFIC_ELEMENT} displays {SPECIFIC_BEHAVIOR}
3. Test {SPECIFIC_INTERACTION} results in {SPECIFIC_OUTCOME}
4. Check browser console: 0 errors

**Integration Verification:**
- [ ] {Component} integrated into {Target}
- [ ] {Target} displays {Component} correctly
- [ ] User can see {Component} at {Location}

NOT "feature works" - but "user sees X when they do Y"

---

## Timeline Estimate

**Sequential Execution:**
- Task A: {hours}
- Task B: {hours}
- Total: {sum} hours

**Parallel Execution (if applicable):**
- Tasks A/B/C in parallel: {max(task_hours)} hours
- Time savings: {sequential - parallel} hours ({percentage}%)

**Selected Approach:** {Sequential/Parallel} - {timeline} hours estimated
```

3. **Save agent prompts to files:**
    - Each complete prompt → `.claude/workspace/{feature}/agent-prompts/{task-name}.md`
    - Engineer copies from file, not chat history
    - Persistent, version-controlled

---

### Phase 2: Agent Execution (Use Workspace)

**In every agent prompt, include session logging requirement:**

```markdown
## SESSION LOGGING (MANDATORY)

**Create:** `.claude/workspace/{feature-slug}/agent-logs/{task-name}-session.md`

**Use template from:** `.claude/templates/agent-session-log.md`

**Log throughout execution:**
- Technology stack decisions affecting other agents
- Coordination assumptions and validations
- Integration challenges encountered
- Discoveries and insights
- Pre-completion validation results (TypeScript, ESLint, tests, process cleanup, manual testing)

**Update real-time:** Document decisions as you make them, not at the end.

**Before claiming COMPLETE:** Verify session log is comprehensive.
```

---

### Phase 3: Feature Completion (Retrospective - Optional)

**When:** After feature validated and complete (all 5 gates passed)

**Orchestration partner can create:**
`.claude/workspace/{feature-slug}/retrospective.md`

**Template Location:** `.claude/templates/retrospective-template.md`

**Purpose:**

- Capture what worked well (replicate in future)
- Document what didn't work (avoid repeating)
- Extract learnings (patterns for next feature)
- Create action items (improvements to apply)

Copy template and customize:

```markdown
# {Feature Name} - Retrospective

**Date Completed:** {YYYY-MM-DD}
**Duration:** {actual hours}
**Execution:** {Sequential/Parallel}

---

## What Went Well ✅

**Successes:**
- {Pattern that worked effectively}
- {Good decision that paid off}
- {Coordination that prevented issues}

**Effective Patterns:**
- {Orchestration pattern applied successfully}
- {Technical approach that worked}

---

## What Didn't Go Well ❌

**Challenges:**
- {Issue encountered}
- {Mistake made}
- {Coordination failure}

**Unexpected Issues:**
- {Problem not anticipated in execution plan}
- {Integration challenge discovered}

---

## Key Learnings 💡

**Orchestration Insights:**
- {Pattern discovered about coordination}
- {Learning about sequential vs parallel}
- {Integration strategy insight}

**Technical Discoveries:**
- {Gotcha identified}
- {Technology-specific learning}
- {Testing insight}

**Gotchas to Remember:**
- {Specific mistake to avoid next time}
- {Hidden dependency discovered}

---

## Action Items 🎯

**Apply to Next Feature:**
- [ ] {Pattern to replicate}
- [ ] {Approach to use again}
- [ ] {Gotcha to proactively prevent}

**Improvements:**
- [ ] {Process refinement}
- [ ] {Template update needed}
- [ ] {Documentation gap to fill}

---

## Patterns for Future Reference

**When building similar features:**
- Use {pattern} for {scenario}
- Avoid {anti-pattern} because {reason}
- Remember {gotcha} affects {aspect}
```

---

## Workspace Intelligence (Compound Learning)

### When Orchestration Partner Reads Retrospectives

**Scenario 1: Similar Feature Detected**

Engineer requests feature → Partner searches for similar:

```bash
grep -r "dashboard.*widget" .claude/workspace/*/retrospective.md
```

If found → Partner reads retrospective → Applies learnings to current feature:

```
"Based on previous dashboard widget work (f-03-dashboard-widgets),
key learning: Each widget agent must handle its own integration into
dashboard.component.ts. Previous feature showed integration gaps when agents
only created files without integrating."
```

**Scenario 2: Debugging Stuck State**

Engineer reports agent stuck → Partner reads workspace:

1. `execution-plan.md` - What was supposed to happen?
2. `agent-logs/{task}-session.md` - What actually happened?
3. Identify gap → Suggest solution

**Scenario 3: Explicit Request**

Engineer: "What did we learn from authentication feature?"
→ Partner reads `.claude/workspace/f-05-auth/retrospective.md`
→ Summarizes key learnings
→ Suggests how to apply to current work

### How to Apply Retrospective Learnings

**Always Validate Against Playbook:**

- If retrospective conflicts with playbook → use playbook (validated pattern)
- If retrospective extends playbook → apply learning (repo-specific insight)
- If retrospective is feature-specific → adapt to current context

**Source-Cite Recommendations:**

```
"Experience from {feature-name} shows {pattern}..."
"Previous {feature-type} work discovered {gotcha}..."
"Based on retrospective from {date}, {learning} applies here..."
```

**Never Blindly Apply:**

- Retrospectives are feature-specific (may not transfer)
- Validate relevance to current feature
- Use as guidance, not rigid rules

---

## Benefits of Workspace Management

### For Engineers (During Course)

- ✅ **Organized workflow:** Clear structure, no chaos
- ✅ **Debugging capability:** Agent logs reveal what went wrong
- ✅ **Session continuity:** Resume features across days
- ✅ **Learning capture:** Retrospectives build knowledge

### For Teams (After Course - Company Repos)

- ✅ **Knowledge sharing:** Retrospectives checked in, everyone benefits
- ✅ **Compound learning:** Each feature makes repo smarter
- ✅ **Onboarding faster:** New engineers read retrospectives
- ✅ **Pattern library:** Repo accumulates proven approaches

### For Orchestration Partner

- ✅ **Context recovery:** Read execution plan to continue features
- ✅ **Similar feature intelligence:** Reference previous work
- ✅ **Proactive warnings:** "Previous auth work found this gotcha..."
- ✅ **Better recommendations:** Repo-specific insights, not generic advice

---

## Examples

### Example 1: Dashboard Analytics Widgets (Parallel Execution)

```
.claude/workspace/
  dashboard-analytics-widgets/
    execution-plan.md
      - Coordination: MEDIUM (imports existing Dashboard)
      - Execution: Parallel (3 independent widgets)
      - Integration: Each agent integrates own widget
      - Timeline: 3 hours (parallel)

    agent-prompts/
      conversion-widget.md
      engagement-widget.md
      trend-widget.md

    agent-logs/
      conversion-widget-session.md
      engagement-widget-session.md
      trend-widget-session.md

    retrospective.md
      - What went well: Parallel execution saved 4 hours
      - What didn't go well: Widget positioning conflicts initially
      - Learning: Define grid positions in execution plan next time
```

### Example 2: User Authentication (Sequential Execution)

```
.claude/workspace/
  user-authentication/
    execution-plan.md
      - Coordination: HIGH (shared API types + backend + frontend)
      - Execution: Sequential (import chain: A → B → C)
      - Dependencies: Backend exports LOGIN_MUTATION for frontend
      - Timeline: 9 hours (sequential only)

    agent-prompts/
      backend-auth-service.md
      frontend-auth-context.md
      auth-ui-components.md

    agent-logs/
      backend-auth-service-session.md
      frontend-auth-context-session.md
      auth-ui-components-session.md

    retrospective.md
      - What went well: Import validation prevented parallel attempt
      - What didn't go well: TypeScript errors found after completion (221)
      - Learning: Pre-completion validation MUST include TypeScript check
```

---

## Status

**Protocol Status:** ✅ Complete and ready for implementation

**Applies To:**

- Course (starter-repo) - Engineers learn workspace management
- Production (company repos) - Same system scales to brownfield

**Next Steps:**

1. Orchestration partner uses this protocol automatically
2. Engineers benefit from structured workflow
3. Retrospectives accumulate repo intelligence
4. Compound learning effect across features

---

**Last Updated:** 2025-10-09
**Validated By:** Workspace management system testing
