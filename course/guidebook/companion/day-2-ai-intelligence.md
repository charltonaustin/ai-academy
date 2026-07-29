# Day 2: Methodology + AI Intelligence Layer

**Session 02 of 5**

**Today's Goal:** Learn systematic patterns and build complete AI intelligence layer

---

## Methodology Introduction

Today, we will introduce a methodology to orchestrating agents that I found very effective. It will address -

- Infrastructure-First (if setup/foundation was painful)
- 5 Validation Gates (if "am I done?" was unclear)
- Field Naming Locks (if backend/frontend got out of sync)
- Two-Tier Testing (if testing approach was confusing)

Choose how to approach today's AI features:

- **Approach A:** Continue your way (it's working)
- **Approach B:** Try systematic patterns (experiment)
- **Approach C:** Hybrid (pick what helps)

**No wrong answer.**

---

## The Orchestration Partner Pattern

**Yesterday you worked directly with Claude Code.**

**Today we introduce an "orchestration partner"** - but this is NOT magic or a special tool.

**What it actually is:**

- Claude Code instance configured with systematic prompts
- Access to proven patterns documentation (`.claude/` directory)
- Consistent approach to creating agent instructions
- Quality checklist enforcement

### Strategic vs Tactical Agent Separation

Understanding the orchestration partner requires understanding **the separation of strategic thinking from tactical
execution**.

**Orchestration Partner (Strategic Agent):**

- **Plans features** - Analyzes coordination requirements, determines execution strategy (sequential vs parallel)
- **Creates organized workspace** - Execution plans, agent prompts, logs, retrospectives
- **Generates detailed prompts** - Tactical agents receive complete instructions with all protocols
- **Validates completed work** - Reviews against execution plan and agent logs
- **Captures learnings** - Documents what worked/failed in retrospectives for future features
- **Enables session continuity** - Creates handoffs so new sessions continue seamlessly

**Tactical Agents (Execution Agents):**

- **Receive detailed prompts** - Created by orchestration partner, copy-paste ready
- **Focus purely on implementation** - No strategic planning, just execute the instructions
- **Write session logs** - Document decisions and challenges during execution
- **Follow included protocols** - Best practices, validation gates, testing requirements already specified
- **Report completion** - Orchestration partner validates their work

**Why this separation matters:**

When you work directly with Claude Code on a feature, the same agent tries to both:

- Think strategically (what's the best approach?)
- Execute tactically (write the code)

This creates problems:

- ❌ Strategic context lost during implementation
- ❌ Forgets protocols/gates under execution pressure
- ❌ Can't validate its own work objectively
- ❌ No systematic learning between features

**With strategic/tactical separation:**

- ✅ Strategic thinking done once by orchestration partner (comprehensive planning)
- ✅ Tactical agents are MORE effective (detailed instructions, no planning overhead)
- ✅ Objective validation (different session reviews work)
- ✅ Systematic learning captured (retrospectives improve future features)

**Think of it like building a house:**

- **WITHOUT separation:** Architect designs while building, forgets details, can't objectively review their own work
- **WITH separation:** Architect creates detailed blueprints → Construction crew executes → Inspector validates →
  Learnings documented for next house

**The "Rise from the Ashes" Capability:**

Unlike regular Claude Code sessions that start fresh each time, the orchestration partner can **recreate itself** with
complete project context:

**What it recovers:**

- ✅ What's already built (reads workspace/ - a structured directory storing execution plans, agent prompts, session
  logs, and retrospectives for each feature, checks codebase)
- ✅ Conventions used (camelCase, field naming, patterns)
- ✅ What worked (reads retrospectives from completed features)
- ✅ What failed (reads session logs, identifies anti-patterns)
- ✅ Current infrastructure (Docker setup, testing framework, MCP servers)
- ✅ In-progress features (execution plans, blockers identified)

**Think of it as:** Senior engineer who's built this type of feature, in this repository 100 times before

- Knows what coordination issues to prevent (learned from retrospectives)
- Remembers to include validation gates (systematic protocols)
- Applies consistent conventions (reads .env.example, schema patterns)
- Documents decisions systematically (workspace management)

### The Workspace Structure - Where Everything Lives

When you describe a feature to the orchestration partner, it creates an **organized workspace directory** for that
feature. This is where all the planning, prompts, logs, and learnings live.

**Structure created:**

```
.claude/workspace/{feature-slug}/
├── execution-plan.md          # The PRD + strategy document
├── agent-prompts/             # Copy-paste ready prompts
│   ├── task-0-infrastructure.md
│   ├── task-a-backend.md
│   └── task-b-frontend.md
├── agent-logs/                # Tactical agents write here
│   ├── task-0-session.md
│   ├── task-a-session.md
│   └── task-b-session.md
└── retrospective.md           # Post-validation learnings
```

**Let's break down each file:**

**1. `execution-plan.md` - The Feature PRD + Strategy**

Think of this as a comprehensive Product Requirements Document combined with technical execution strategy. It contains:

- **Feature requirements** - What needs to be built (detailed functionality)
- **Coordination analysis** - Low/medium/high complexity assessment
- **Task breakdown** - Each task with clear deliverables
- **Execution strategy** - Sequential vs parallel execution + reasoning
- **Integration strategy** - Who owns each integration point
- **Success criteria** - Specific, measurable outcomes (not "feature works")
- **Timeline estimates** - Realistic time expectations
- **Validation requirements** - How you'll know it's truly complete

**You should read this before running tactical agents.** It's your guide for understanding the complete plan.

**Can you edit it directly?** Yes, OR you can iterate conversationally with the orchestration partner: "I think task B
should happen before task A because..." and it will update the plan.

**2. `agent-prompts/` directory - Copy-Paste Ready Prompts**

These are **NOT in chat history**. They are actual markdown files you open and copy from.

Each prompt contains:

- Complete feature context for that specific task
- All protocols automatically included (5 validation gates, testing requirements, coordination rules)
- Best practices for the tech stack
- Specific deliverables expected
- Where to write the session log
- Success criteria for this task

**Why files instead of chat history?**

- Persistent (don't scroll back through long conversations)
- Version controlled (can see prompt evolution)
- Easy to copy and paste into new Claude Code sessions
- Can be reviewed and refined before running agents

**What if orchestration partner provides prompts in chat?**
Ask it: "Please save these prompts to the agent-prompts directory" and it will create the files.

**3. `agent-logs/` directory - Tactical Agent Session Logs**

When each tactical agent runs, it writes a session log documenting:

- Design decisions made during implementation
- Challenges encountered
- How coordination requirements were handled
- Testing approach taken
- Final validation results

**Who writes these?** The tactical agents (as specified in their prompts).

**Why do these matter?** The orchestration partner reads them during validation to:

- Compare what was planned (execution-plan.md) vs what actually happened (agent-logs)
- Identify where agents deviated from the plan and why
- Catch bugs that tactical agents might have missed
- Document learnings for the retrospective

**4. `retrospective.md` - Post-Validation Learning Document**

Created/updated during `/validate` command. Contains:

- ✅ **What Went Well** - Patterns that worked effectively
- ❌ **What Didn't Go Well** - Bugs found, issues encountered
- 💡 **Key Learnings** - Prevention strategies for future features
- 🎯 **Action Items** - Fixes needed, methodology improvements

**How is this used?**

- Next feature: Orchestration partner automatically reads all previous retrospectives
- Applies learnings: "Based on previous {feature} work, key learning: {insight}"
- Compound learning: Each feature makes the partner smarter

**This is different from session handoff** (explained below).

### What the Orchestration Partner Automatically Includes

One of the biggest values: **You don't have to remember everything.**

When the orchestration partner creates agent prompts, it automatically includes all the protocols and best practices so
tactical agents follow them systematically.

**Automatically included in every prompt:**

1. **Best practices for your tech stack**

    - NestJS patterns, REST conventions, Angular best practices
    - Learned from your codebase conventions (.env.example, shared api-types.ts / DTO patterns)

2. **5 Validation Gates (MANDATORY)**

    - TypeScript: 0 errors (npm run type-check)
    - ESLint: 0 warnings (npm run lint)
    - Tests: All passing (unit WITH mocks + integration WITHOUT mocks)
    - Resource cleanup: No hanging processes (lsof checks)
    - Manual testing: Browser verification (Playwright) OR API testing (curl)

3. **Coordination protocols**

    - Field naming locks (camelCase throughout)
    - Type contracts (shared API types as single source of truth)
    - Integration requirements (who owns each integration point)

4. **Testing requirements**

    - Unit tests: WITH mocks (test logic in isolation, fast)
    - Integration tests: WITHOUT mocks (test cross-layer integration, catch type mismatches)
    - Why both: Mock-heavy tests hide bugs (common AI-generated code gotcha)

5. **Sequential vs parallel execution strategy**

    - Import dependency analysis (does Task B need Task A's exports?)
    - Coordination requirements (low/medium/high complexity)
    - Clear reasoning for execution order

6. **Integration requirements**

    - Explicit ownership (who integrates what)
    - Not assumed (agent must know to integrate, not just create)
    - Success criteria includes integration: "Create Widget + import into Dashboard + verify visible"

7. **Session logging instructions**
    - Where to write the log (`.claude/workspace/{feature}/agent-logs/{task}-session.md`)
    - What to document (design decisions, challenges, coordination handling)
    - Why it matters (orchestration partner uses this during validation)

**Why this matters:**

**WITHOUT orchestration partner:**

- You have to remember: "Did I include validation gates?"
- Tactical agent might forget: "Should I write tests?"
- Inconsistent quality: Sometimes gates checked, sometimes skipped

**WITH orchestration partner:**

- All protocols included automatically
- Tactical agents follow systematic checklist
- Consistent quality across all features

**Think of it as:**

- Orchestration partner = Quality assurance built into every prompt
- You focus on: What feature to build
- Partner ensures: How to build it correctly

**The key difference:**

Regular Claude Code: "What project is this? What patterns do you use?"
Orchestration Partner: "I see you use camelCase, Docker on port 5433, NestJS REST. Last feature (user-auth)
learned: validate JWT_SECRET in .env.example first. Ready to build next feature."

**It's just Claude Code** with:

1. Clear patterns to follow
2. Checklists to enforce quality
3. Documentation of what worked before
4. **Ability to rebuild itself with project knowledge**

### What You Control vs What Partner Provides

**You still decide:**

- ✅ What features to build
- ✅ What order to build them
- ✅ Technical approach and architecture
- ✅ When to accept vs push back on suggestions

**Partner provides:**

- ✅ Prompts for feature agents (with proven patterns for effective agent prompts built-in)
- ✅ Coordination protocol documents
- ✅ Validation gate enforcement
- ✅ Documentation of methodology decisions

**The compound learning effect:**

As you build features, the orchestration partner learns:

- Feature 1: Creates dashboard → Documents patterns in retrospective
- Feature 2: Creates widgets → Reads Feature 1 retrospective, applies learnings
- Feature 3: Creates analytics → Reads Features 1+2, builds on established patterns

**Each new session:** Partner recovers ALL previous knowledge by reading workspace/

### Session Handoff vs Retrospective - Two Different Purposes

The orchestration partner creates two types of documents that serve different purposes:

**Session Handoff - Mid-Feature Continuity**

**Purpose:** Transfer current state to next orchestration partner session (can happen mid-feature)

**When to use:**

```bash
/handoff
```

Use when:

- Session getting long (>50 messages), approaching token limits
- Need context refresh (long conversation, want to start clean)
- Natural break point (validation complete, bugs documented, about to run fixes)
- Switching tasks (need to pause this feature, work on something else)

**What it captures:**

- Current state (what's complete, what's in-progress, what's blocked)
- Blockers identified (what's preventing completion, decisions needed)
- Next steps (what to do when resuming, priority order)
- Conventions discovered (patterns, port configs, field naming used in this feature)
- Files modified (complete list with brief descriptions)

**Location:** `.claude/orchestration/meta/session-handoffs/YYYY-MM-DD-{feature}-handoff.md`

**Next session (even weeks later):**

```bash
/orchestration path/to/handoff.md
```

Partner loads handoff → Recovers exact mid-feature state → Continues seamlessly

**Why this matters:**

- ✅ No "what was I doing?" confusion
- ✅ Partner knows blockers already identified
- ✅ Conventions preserved across sessions
- ✅ Can pause/resume features without context loss
- ✅ Works even weeks later (complete context snapshot)

---

**Retrospective - Post-Feature Learning**

**Purpose:** Capture learnings to improve future features (happens after validation)

**When created:**

```bash
/validate {feature-id}
```

Created/updated automatically during validation process.

**What it captures:**

- ✅ **What Went Well** - Patterns that worked effectively (even if no bugs)
- ❌ **What Didn't Go Well** - Bugs found, issues encountered, root causes
- 💡 **Key Learnings** - Prevention strategies for future features
- 🎯 **Action Items** - Fixes needed, methodology improvements, prompt updates

**Location:** `.claude/workspace/{feature-slug}/retrospective.md`

**How it's used:**

- **Next feature:** Orchestration partner automatically reads ALL previous retrospectives
- **Applies learnings:** "Based on previous {feature} work, key learning: {insight}"
- **Compound intelligence:** Each feature makes partner smarter
- **Prevents repeating mistakes:** If widget integration failed before, partner ensures integration explicit in next
  widget prompt

**Example:**

```markdown
## Feature: Dashboard Widgets

### What Went Well ✅

- Parallel execution worked (3 widgets built simultaneously)
- Each agent owned complete integration (widget + Dashboard import)
- Validation caught bugs before production

### What Didn't Go Well ❌

- Bug: Widget rendered but data not loading (REST call missing)
- Bug: TypeScript passed but runtime error (mock hid type mismatch)
- Integration: Agent created widget files but didn't verify visible on /dashboard

### Key Learnings 💡

- Agents need explicit integration verification in success criteria
- Integration tests (no mocks) catch issues unit tests miss
- Don't assume "file created" means "feature works"

### Action Items 🎯

- Update widget template: Add "verify visible on /dashboard" to success criteria
- Future prompts: Include integration test requirement explicitly
- Methodology improvement: Add "integration verification" to validation gates
```

---

**Key Distinction:**

| Aspect       | Session Handoff                     | Retrospective                             |
|--------------|-------------------------------------|-------------------------------------------|
| **Purpose**  | Continuity                          | Learning                                  |
| **When**     | Mid-feature (anytime)               | Post-validation                           |
| **Audience** | Next orchestration partner session  | Future features                           |
| **Content**  | Current state, blockers, next steps | What worked/failed, learnings, prevention |
| **Use case** | Resume work seamlessly              | Build smarter over time                   |
| **Location** | `.../session-handoffs/`             | `.../workspace/{feature}/`                |

**Together they enable:**

- **Session handoff:** Pause/resume without context loss (short-term continuity)
- **Retrospective:** Build smarter over time (long-term compound learning)

**This is still YOUR code and YOUR decisions.** The partner just helps you apply patterns systematically and learn from
what worked before.

---

### How to Work With Orchestration Partner

**Initialize the partner:**

```bash
# In a Claude Code session:
/orchestration
```

**What this actually does (no magic):**

This command tells Claude Code to read a prompt file at `.claude/commands/orchestration.md`.

**That file is just a prompt** (like any agent prompt you'd write) that instructs Claude Code to:

- Load proven patterns from `.claude/playbook/` directory
- Read coordination protocols and validation gates
- Apply systematic methodology when creating agent prompts
- **Manage `.claude/workspace/`** - reading accumulated knowledge AND writing new feature documentation:
    - **Reads** retrospectives from completed features to apply lessons learned
    - **Writes** new feature directories (`.claude/workspace/{feature-slug}/`)
    - **Creates** execution plans documenting feature strategy and task breakdown
    - **Saves** agent prompts as files for engineers to copy and execute
    - **Tracks** agent logs capturing decisions and challenges during execution
    - **Compiles** retrospectives distilling lessons learned after completion

**You can view the actual prompt:
** [.claude/commands/orchestration.md](../../../.claude/commands/orchestration.md)

**It's completely transparent:**

- Open the file and read it yourself
- See exactly what patterns it loads
- Modify it for your team's conventions
- Create your own version if you want

**The "orchestration partner" is just:**

- Claude Code instance
- Reading this prompt file
- Following the instructions systematically
- Not a special tool or black box

**What you'll see:**

```
Claude Code: "Initialization complete. I'm now your orchestration partner with:
- Infrastructure-first patterns loaded
- 5 validation gates configured
- Coordination protocols ready
- Field naming conventions loaded

How can I help you orchestrate your features?"
```

**How to use it:**

```bash
# Build features:
You: "I want to add a delete lead feature"
You: "I want to make the dashboard UI more modern"
You: "I want to add lead filtering in the dashboard"

# Ask for guidance:
You: "Should I build this feature with one agent or multiple?"

# Ask about parallelization opportunities:
You: "Can the backend API and frontend components be built in parallel, or does one depend on the other?"

# Ask for validation:
You: "Review my agent prompt - what am I missing?"

# Ask for troubleshooting:
You: "Agents succeeded but my manual QA failed - what went wrong?"
```

**Key point:** The partner has access to `.claude/playbook/` and `.claude/methodology/` - it knows proven patterns and
common gotchas.

### Complete Workflow with Orchestration Partner

This is the **full 10-step workflow** from requesting a feature to validated completion with iterative refinement.

#### Step 1: Initialize the Orchestration Partner

```bash
/orchestration
```

**What happens:**

- Partner loads playbook, methodology, templates
- Reads ALL previous retrospectives (compound learning)
- Recovers project context ("rise from the ashes")
- Ready to create strategic plans

**You see:**

```
"I'm your orchestration partner. Project context recovered:
- Tech stack: NestJS + REST + Angular
- Conventions: camelCase throughout, Docker on port 5433
- Previous features: user-auth (learned: validate env vars early)
Ready to build next feature."
```

---

#### Step 2: Describe the Feature & Codebase Investigation

**You:** "I need AI lead summaries feature"

**Partner investigates codebase FIRST:**

- Does lead detail page exist? (searches codebase)
- Current Lead model structure? (reads database schema)
- Existing LLM integration patterns? (checks for AI service)

**Partner asks clarifying questions:**

- "Where should summaries display?" → You: "Lead detail page"
- "Store summaries or generate on-demand?" → You: "Store in database for performance"
- "What data should summary include?" → You: "Lead info + all interactions"

**Partner determines strategy:**

- Backend task: Add summary fields to Lead model, create LLM service
- Frontend task: Display summary on lead detail page, add regenerate button
- Sequential execution (backend → frontend, frontend needs backend API)

---

#### Step 3: Partner Creates Workspace & Execution Plan

**Partner creates:**

```
.claude/workspace/ai-lead-summaries/
├── execution-plan.md
├── agent-prompts/
└── agent-logs/
```

**`execution-plan.md` contains:**

- Feature requirements (detailed spec)
- Coordination analysis (sequential execution, backend first)
- Task breakdown (Task A: Backend, Task B: Frontend)
- Integration strategy (Frontend imports the shared backend API types)
- Success criteria ("Opening /leads/:id displays AI-generated summary persisted in database")

---

#### Step 4: Review & Iterate on Execution Plan

**You read:** `.claude/workspace/ai-lead-summaries/execution-plan.md`

**Iteration examples:**

**Scenario A - You agree:**

```
You: "Looks good, create the agent prompts"
Partner: Proceeds to Step 5
```

**Scenario B - You disagree:**

```
You: "I think we should also add a 'summary quality' rating. Users can thumbs up/down."
Partner: Updates execution-plan.md → Adds Task C: Add rating UI + database field
You: "Perfect, now create prompts"
```

**Scenario C - You have questions:**

```
You: "Why sequential execution? Can't these run in parallel?"
Partner: "Frontend needs the shared backend API types. If run parallel, frontend fails on missing import."
You: "Got it, makes sense. Proceed with prompts."
```

**Key point:** Iterate conversationally until execution plan is exactly what you want.

---

#### Step 5: Partner Creates Agent Prompts

**Partner saves prompts as files:**

- `.claude/workspace/ai-lead-summaries/agent-prompts/task-a-backend.md`
- `.claude/workspace/ai-lead-summaries/agent-prompts/task-b-frontend.md`

**Each prompt automatically includes:**

- ✅ Complete feature context
- ✅ 5 validation gates
- ✅ Testing requirements (unit WITH mocks + integration WITHOUT mocks)
- ✅ Coordination protocols (camelCase, schema contracts)
- ✅ Integration requirements (Frontend imports backend types)
- ✅ Session logging instructions
- ✅ Specific success criteria

---

#### Step 6: Review & Iterate on Agent Prompts

**You open:** `.claude/workspace/ai-lead-summaries/agent-prompts/task-a-backend.md`

**Iteration examples:**

**Scenario A - You agree:**

```
You: "Prompt looks comprehensive, ready to run"
Partner: "Copy prompt, paste into new Claude Code session to execute"
```

**Scenario B - You want changes:**

```
You: "Add requirement: Include timestamp when summary was generated"
Partner: Updates prompt → Adds `summaryGeneratedAt` field requirement
```

**Scenario C - You catch something:**

```
You: "This prompt says to use OpenAI but we use Claude API"
Partner: Updates prompt → Changes LLM provider instructions
```

**Key point:** Prompts are in files, easy to review and refine before running tactical agents.

---

#### Step 7: Execute Tactical Agents

**You:**

1. Open `.claude/workspace/ai-lead-summaries/agent-prompts/task-a-backend.md`
2. Copy the entire prompt
3. Open NEW Claude Code session (tactical agent)
4. Paste prompt → Agent executes

**Tactical agent:**

- Implements backend (adds database fields, creates LLM service, adds REST endpoint)
- Writes session log to `.claude/workspace/ai-lead-summaries/agent-logs/task-a-backend-session.md`
- Runs 5 validation gates
- Reports completion

**Sequential execution:**

- Wait for Task A (backend) to complete
- Then run Task B (frontend) - can safely import backend types now

**Parallel execution (if applicable):**

- Run all prompts simultaneously in different Claude Code sessions
- Only works if no import dependencies between tasks

---

#### Step 8: Validate with Orchestration Partner

**After all tactical agents report complete:**

```bash
/validate ai-lead-summaries
```

**Partner performs comprehensive validation:**

**Phase 1: Check Basic Gates**

- Runs `npm run type-check` (0 errors?)
- Runs `npm run lint` (0 warnings?)
- Runs `npm test` (all passing?)
- Checks for hanging processes (`lsof`)

**Phase 2: Compare Plan vs Reality**

- Reads `execution-plan.md` (what was supposed to be built)
- Reads ALL `agent-logs/*.md` (what tactical agents actually did)
- Identifies gaps: "Plan said X, but logs show agent did Y"

**Phase 3: Code Review**

- Searches for problematic patterns (type assumptions, silent failures, invalid UUIDs, mock-heavy tests)
- Looks for integration issues (files created but not integrated)

**Phase 4: Integration Testing**

- Starts servers (`npm run dev`)
- Tests actual flows (NO MOCKS)
- Verifies database records created
- Checks for errors in server output

**Phase 5: Creates Validation Report**

- Status: PRODUCTION READY / BUGS FOUND / ISSUES
- Bugs found (if any) with file:line references
- Time to fix estimate
- Retrospective updated with findings

---

#### Step 9: Iterate Based on Validation (If Bugs Found)

**Scenario A - Validation passes:**

```
Partner: "✅ Validation complete. Feature is production ready. Retrospective created."
You: Move to next feature
```

**Scenario B - Validation finds bugs:**

```
Partner: "❌ Found 2 bugs:
Bug #1: Summary displays but data not loading (controller/service missing await)
Bug #2: Test passed but runtime fails (mock hid type mismatch)

Created:
- Bug fix prompt: .claude/workspace/ai-lead-summaries/bugfix-prompt.md
- Updated retrospective with findings
```

**Iterative refinement workflow:**

1. **Partner creates NEW bug fix prompts** (in `agent-prompts/` or separate `bugfix-prompt.md`)
2. **You run NEW tactical agent** with bug fix prompt
3. **Agent fixes bugs**, writes updated session log
4. **Run `/validate` AGAIN**
5. **Repeat until validation passes**

**This is the feedback loop:**

- Validation → Bugs found → New prompts → New execution → Validation → ...
- Continue iterating until Partner says "PRODUCTION READY"

---

#### Step 10: Learn for Next Feature (Retrospective)

**Partner creates/updates:**
`.claude/workspace/ai-lead-summaries/retrospective.md`

**Contains:**

- ✅ What worked (parallel execution, integration explicit)
- ❌ What failed (controller bug, mock hid type issue)
- 💡 Learnings (always use await in controllers/services, integration tests catch mocks)
- 🎯 Actions (update prompts: add await reminder, require integration tests)

**How this helps:**

- **Next feature:** Partner automatically reads this retrospective
- **Applies learnings:** "Based on ai-lead-summaries, key learning: await in all async controllers/services"
- **Prevents repeat mistakes:** If bug happened before, partner includes prevention in next prompts

**Compound intelligence:** Each feature makes partner smarter for future features.

---

### The Complete Workflow Summary

**Main Flow (Happy Path):**

```
Step 1: Initialize Partner
   ↓
Step 2: Describe Feature
   ↓  (Partner investigates codebase + asks clarifying questions)
   ↓
Step 3: Create Workspace + Execution Plan
   ↓  (Creates: execution-plan.md, agent-prompts/, agent-logs/)
   ↓
Step 4: Review Execution Plan ◄──────────────┐
   ↓                                          │ ITERATE LOOP #1
   ├─ Not satisfied? Ask partner to revise ───┘ (Refine strategy)
   ↓ Satisfied? Continue
   ↓
Step 5: Partner Creates Agent Prompts
   ↓  (Saves to: agent-prompts/{task-name}.md)
   ↓
Step 6: Review Agent Prompts ◄───────────────┐
   ↓                                          │ ITERATE LOOP #2
   ├─ Not satisfied? Ask partner to update ───┘ (Refine instructions)
   ↓ Satisfied? Continue
   ↓
Step 7: Execute Tactical Agents
   ↓  (Copy prompts → Paste in new Claude Code sessions)
   ↓  (Each agent writes: agent-logs/{task}-session.md)
   ↓
Step 8: Run /validate
   ↓  (Partner reviews: execution-plan.md + agent-logs/)
   ↓  (Comprehensive: gates + code review + integration testing)
   ↓
   ├─── ✅ PRODUCTION READY? ──→ Go to Step 10
   │
   └─── ❌ BUGS FOUND? ──→ Go to Step 9

```

**Bug Fix Feedback Loop (Step 9):**

```
Step 9: Bugs Found
   ↓
   ├─ Partner creates bug fix prompts
   │  (Saved to: agent-prompts/bugfix-{description}.md)
   ↓
   ├─ You run tactical agent with fix prompt
   │  (New Claude Code session)
   ↓
   ├─ Agent writes updated session log
   │  (agent-logs/bugfix-session.md)
   ↓
   └─ Return to Step 8: /validate again ◄─┐
        │                                         │ VALIDATION LOOP
        ├─ Still bugs? ──────────────────────────┘ (Repeat until clean)
        ├─ Production ready? → Continue to Step 10
```

**Learning & Next Feature (Steps 10 & beyond):**

```
Step 10: Retrospective Created
   ↓  (retrospective.md captures: what worked, what failed, learnings)
   ↓
   ↓
NEXT FEATURE:
   ↓
   ├─ /orchestration (new or same session)
   ├─ Partner reads ALL previous retrospectives
   ├─ Applies learnings to new execution plan
   └─ Return to Step 2 (with smarter planning)
```

**Key principles:**

- **Iterate BEFORE execution** (Steps 4 & 6) - Get plan/prompts right first
- **Iterate AFTER validation** (Step 9) - Fix bugs systematically until production ready
- **Learn continuously** (Step 10) - Each feature improves the next
- **Engineer stays in control** - Review, iterate, approve at every stage

### Staying Productive While Agents Work

**The "boredom problem":** Waiting for agents to finish feels unproductive.

You've kicked off an agent to build a feature. It's working. Now what?

- **5-15 minutes of waiting** - Agent is writing code, running tests, fixing errors
- **Nothing for you to do** - Can't review code that doesn't exist yet
- **Context switching temptation** - Check email, browse docs, make a chai latte (but how many chai latte's can one
  really have in a day anyway?)
- **Anxiety about what's being built** - Is the agent making good decisions? Writing quality code?
- **Loss of flow state** - You were engaged, now you're idle, hard to regain momentum

**Common reaction:** Combat boredom by spawning agents without a plan - "Let me just kick off another one while I wait."
This creates:

- **Agent chaos** - Which terminal has what agent? What's each one doing?
- **Collision risk** - Multiple agents modifying the same files simultaneously
- **Integration mystery** - How do these pieces fit together? Who knows.
- **Review paralysis** - Too many changes to understand before merging
- **Hidden debt** - Bugs and tech debt slip through because you can't track it all
- **Quality erosion aka AI Slop** - Low-quality code sneaks in because you're overwhelmed, creating cleanup work later

**Orchestration partner solution:** While agents execute, stay engaged with the orchestration partner:

**Plan the next feature:**

```
You: "While the AI summary agent works, help me plan the activity scoring feature"
Partner: Creates execution plan for next feature while current agents run
```

**Review codebase quality:**

```
You: "What parts of our codebase are tech debt vs solid?"
Partner: Analyzes patterns, identifies improvement opportunities
```

**Discuss architectural decisions:**

```
You: "Should we extract the LLM integration into a shared service?"
Partner: Evaluates trade-offs, recommends approach based on your patterns
```

**Prepare validation strategy:**

```
You: "What integration tests should I write for the AI features?"
Partner: Suggests test scenarios based on execution plan
```

**Why this matters:**

- ✅ **Maintain code ownership** - You stay engaged with what's being built
- ✅ **Catch issues early** - Discuss architecture while agents work, not after
- ✅ **Sequential clarity** - Plan next feature, execute when ready (not parallel chaos)
- ✅ **Quality awareness** - Review and understand changes before they become PRs
- ✅ **Prevent tech debt** - Active oversight vs. blindly accepting AI output

**The result:** You write 5% of the code but maintain 100% understanding and ownership.

---

### Common Questions & Troubleshooting

**Q: "What if the orchestration partner doesn't create workspace files?"**

A: It should create them automatically, but if it doesn't:

```
You: "Please create the workspace structure for this feature at .claude/workspace/ai-lead-summaries/"
```

Partner will create all directories and files.

---

**Q: "What if prompts are provided in chat instead of files?"**

A: Ask partner to save them:

```
You: "Please save these prompts to files in the agent-prompts directory"
```

Partner will write them to `.claude/workspace/{feature}/agent-prompts/{task-name}.md`

---

**Q: "Do I have to use the orchestration partner?"**

A: **No, it's completely optional.**

- Work directly with Claude Code (like Day 1) - totally fine
- Use orchestration partner for complex features only
- Use it for all features (systematic approach)
- Mix and match based on what works for you

**This is a tool, not a requirement.** Use what helps you build effectively.

---

**Q: "Can I edit the execution plan or prompts directly in the files?"**

A: **Yes, absolutely!**

Two approaches:

**Option A - Edit files directly:**

```bash
# Open in your editor
code .claude/workspace/ai-lead-summaries/execution-plan.md
# Make changes
# Save
```

**Option B - Iterate conversationally with partner:**

```
You: "Update the execution plan - add a Task C for user rating feature"
Partner: Updates the file for you
```

Choose whichever you prefer. Files are yours to edit.

---

**Q: "When should I create a session handoff?"**

A: Use `/handoff` when:

- Session getting long (>50 messages)
- Token usage approaching limits
- Natural break point (validation complete, bugs documented)
- Need to pause feature work (switching tasks)
- Want context refresh (start clean session)

Don't wait until you HAVE to - create proactively when convenient.

---

**Q: "What if I disagree with the orchestration partner's strategy?"**

A: **Push back and iterate!**

```
Partner: "I recommend sequential execution: backend → frontend"
You: "Why not parallel? These seem independent."
Partner: "Frontend imports the shared backend API types. If parallel, import fails."
You: "What if we pre-define the shared API types first, then both can work from that?"
Partner: "Great point! Let me update the plan - Task 0: Define schema, then Tasks A & B parallel."
```

The partner is a **collaborator, not a dictator**. Your judgment and experience matter.

---

**Q: "How do I know if validation passed or failed?"**

A: Partner explicitly states status:

**Passed:**

```
✅ Validation complete. Feature is PRODUCTION READY.
- All 5 gates passed
- Integration testing successful
- Retrospective created
```

**Failed:**

```
❌ Validation found 2 bugs:
- Bug #1: controller/service missing await (file:line)
- Bug #2: Mock hid type mismatch (file:line)

Bug fix prompt created: .claude/workspace/{feature}/bugfix-prompt.md
Estimated fix time: 30 minutes
```

Clear status makes next steps obvious.

---

**Q: "Can I run multiple features in parallel with different orchestration partner sessions?"**

A: **Technically yes, but NOT recommended.**

**Problem:** Multiple partners modifying the same workspace simultaneously → conflicts

**Better approach:**

- **One orchestration partner session** for planning/validation
- **Multiple tactical agent sessions** for parallel execution (when independent)

**Example:**

```
Orchestration Partner Session (One):
- Plans Feature A → Creates prompts
- You run 3 tactical agents in parallel (they're independent)
- Validates Feature A when complete
- Plans Feature B → Creates prompts
- Repeat
```

**Sequential orchestration, parallel execution** = best of both worlds.

---

## Advanced Patterns (Optional Deeper Dive)

### Sub-Agents for Large Codebase Exploration

When agents work with large codebases, they can spawn **sub-agents** which have their own context for focused
exploration without bloating the main context.

**The concept:**

An agent (like your tactical agent) can launch the Task tool to spawn a **sub-agent** for focused exploration or
research:

- Agent launches sub-agent: "Explore existing auth patterns in this codebase"
- Sub-agent reads multiple files, discovers patterns, synthesizes findings
- Sub-agent returns summary to main agent
- Main agent implements using the summary

**Why this helps:**

- **Keeps context lean:** Main agent doesn't load 15K tokens of exploration
- **Better pattern discovery:** Sub-agent focuses solely on understanding existing code
- **Cleaner implementation:** Agent implements with summary, not buried in research

**When this is valuable:**

- Large brownfield codebases
- Research-heavy tasks
- Complex pattern discovery

**You can request this explicitly:**

```
You: "Use a sub-agent to explore how interactions are currently implemented,
then add email integration following the same patterns."
```

**Or let Claude decide autonomously** - it may use sub-agents when warranted.

**Learn more:** [Chapter 05: Sub-Agents and the Task Tool](../chapters/05-sub-agents.md)

**Day 5 application:** Sub-agents excel at brownfield exploration (large company codebases)

---

### Custom Slash Commands

You've been using `/orchestration` - this is a **custom slash command**.

**What they are:**

Slash commands are custom prompts stored as markdown files that get triggered by typing `/command-name`:

- Stored in `.claude/commands/` directory
- Contain the full prompt you want executed
- Reusable across all sessions
- Can accept arguments

**Examples in this repository:**

- `/orchestration` - Load orchestration methodology and project context
- `/validate {feature-id}` - Comprehensive validation of completed agent work
- `/handoff` - Create session continuity document

**How they work:**

When you type `/orchestration`, Claude Code:

1. Reads `.claude/commands/orchestration.md`
2. Executes the prompt in that file
3. Returns the result

**It's that simple.** Slash commands are just reusable prompts in files.

**Creating your own:**

1. Create markdown file in `.claude/commands/your-command.md`
2. Write the prompt you want triggered
3. Add front matter with description and arguments (optional)
4. Use it: `/your-command` in any Claude Code session

**Example structure:**

```markdown
---
description: Brief description of what this command does
argument-hint: "[optional-argument]"
---

Your prompt content here. This gets executed when someone types /your-command.

You can reference arguments, load files, execute workflows, etc.
```

**Day 5 application:** Create brownfield-specific commands for your company repos (e.g., `/init-payment-service` loads
payment service patterns)

**Learn more:** [Chapter 06: Custom Slash Commands](../chapters/06-custom-slash-commands.md)

---

## Patterns Available (Use What's Helpful)

### Pattern 1: Infrastructure-First

**If you're experiencing:** Setup friction when another engineer tries to run code, "works on my machine" issues,
uncertainty about what's needed for fresh clone

**This pattern addresses it:**

**Build foundation before features:**

- Setup scripts (npm run setup)
- Testing framework (npm test ready to use)
- Development automation (npm run dev)
- Demo readiness (fresh clone → working app)

**Why this works:**

- You never have to question if the feature is broken or something in your infrastructure was never set up properly
- Running the app to determine if features are complete should be ready to go immediately
- Testing ready from day one (no "we'll add tests later")
- No "I hacked it the other day to work on my machine, but I can't remember how I did it"

**Infrastructure is ready when:**

- [ ] Fresh clone works (git clone → npm install → npm run setup → npm run dev)
- [ ] Tests can be written immediately (framework configured)
- [ ] Database setup automated (no manual SQL required)
- [ ] Environment documented (.env.example provided)

---

### Pattern 2: Coordination Through Convention

**If you're experiencing:** Field naming inconsistencies (backend `lead_id` vs frontend `leadId`), type mismatches
between layers, shared type/endpoint misalignment

**This pattern addresses it:**

**Choose conventions early, enforce systematically:**

**Field Naming Lock:**

- Choose one convention: camelCase throughout (leadId, firstName, createdAt)
- Apply everywhere: database, shared API types, TypeScript, Angular
- No translation layers between frontend/backend

**Shared Types as Contract:**

- The shared DTO/interface types define field names (single source of truth)
- Backend implements exactly what the types define
- Frontend uses exactly what the types define
- TypeScript enforces alignment automatically

**Contract-First Approach:**

- Define types once in the shared types module (`api-types.ts` / DTOs)
- Both backend and frontend import the same types
- Compiler catches mismatches

**Why this works:**

- TypeScript catches coordination issues at compile time (not runtime)
- No ambiguity about field names (the shared types are the truth)
- Integration failures caught early (before browser testing)

**Coordination is solid when:**

- [ ] Field naming convention documented (and followed everywhere)
- [ ] Shared API types exist and are the source of truth
- [ ] Backend + frontend both import those types
- [ ] npm run type-check passes (0 errors)

---

### Pattern 3: The 5 Validation Gates

**If you're experiencing:** Uncertainty about when you're "done", inconsistent testing standards, features that "work"
but break in production

**This pattern addresses it:**

**Mandatory validation before claiming "complete":**

#### Gate 1: TypeScript Compilation

```bash
npm run type-check
```

**Required:** 0 errors

**Why:** Code that compiles ≠ code that works, but code that doesn't compile definitely doesn't work

#### Gate 2: ESLint

```bash
npm run lint
```

**Required:** 0 warnings

**Why:** Consistent code quality, catches common mistakes

#### Gate 3: Tests Passing

```bash
npm test
```

**Required:** All tests passing

**Why:** Validates logic works as expected

**Two-Tier Testing Strategy:**

- **Unit tests:** WITH mocks (test logic in isolation)
- **Integration tests:** WITHOUT mocks (test cross-layer integration)

**Why both:** Mock-heavy tests can hide integration bugs

#### Gate 4: Resource Check

```bash
# Check what's running on common dev ports
lsof -i :3000  # Backend server
lsof -i :3001  # Frontend server
```

**Required:** Clean development environment, no hanging processes

**Why:** Multiple Claude Code instances may start dev servers that don't shut down cleanly

**Common issues:**

- Backend server still running from earlier session
- Frontend dev server from previous session
- Multiple servers competing for same port

**Fix if needed:**

```bash
# See what's using a port
lsof -i :3000

# Kill specific process by PID
kill <PID>

# Or kill by process name
pkill -f "nest start"
```

#### Gate 5: Manual Testing

**CRITICAL:** Automated tests passing ≠ feature actually working

**Two types based on feature:**

**Frontend Manual Testing (use Playwright MCP for browser verification):**

```bash
npm run dev
# Open http://localhost:3000
```

**Test in actual browser:**

1. Open browser to specific URL
2. Navigate through all UI you created
3. Test all forms (submit, validation, error states)
4. Verify data displays correctly
5. Test all user interactions
6. Check browser console: 0 errors (Cmd+Option+J or F12)

**Playwright systematic testing:**

- Navigate to all pages you created
- Fill and submit all forms
- Verify redirects and navigation work
- Check data displays correctly
- Screenshot key states
- Document any errors found

**Common issues caught:**

- Database schema not applied to development database (tests use test DB, browser uses dev DB)
- Client state management broken
- REST API integration failing
- UI rendering issues

**Backend Manual Testing (use curl/API testing):**

**Test with actual API calls:**

```bash
# Example: REST login endpoint
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "password"}'
```

**Verify:**

1. Response status: Expected status (e.g., 200)
2. Response body contains: Expected fields (e.g., token, user.email)
3. Authentication: login returns valid token/session
4. Authorization: protected endpoints reject unauthorized requests
5. Error handling: invalid requests return proper error responses

**Common issues caught:**

- API returns wrong status codes
- Missing fields in response
- Authentication/authorization not working
- Database queries failing
- Error handling broken

### Why All 5 Matter

- TypeScript: 0 errors doesn't mean tests pass (test-related TypeScript errors exist)
- Tests passing doesn't mean browser works (database setup issues caught only in browser)
- Browser working doesn't mean clean environment (resource exhaustion from hanging processes possible)

**All 5 gates = truly complete**

**Feature is complete when:**

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Tests: All passing (unit + integration)
- [ ] Resources: Dev environment clean (no hanging processes)
- [ ] Browser: Features actually work

**If any gate fails:** Feature is NOT complete (fix first, then re-validate)

---

### Pattern 4: Two-Tier Testing Strategy

**If you're experiencing:** Confusion about when to mock vs when to test for real, tests that pass but features that
break

**This pattern addresses it:**

**Unit Tests (WITH mocks):**

- Purpose: Test logic in isolation
- Speed: Fast (<1s per test)
- Example: "User validation rejects invalid email"

**Integration Tests (WITHOUT mocks):**

- Purpose: Test cross-layer integration
- Speed: Slower (database I/O)
- Example: "Create lead → verify in database → retrieve via GET /leads/:id → display in UI"

**Why both are required:**

**Mock-heavy tests can hide bugs. This is a COMMON gotcha with AI generated code:**

**Examples:** Integration tests found critical bugs that mocked tests missed:

- PostgreSQL returns strings (code expected Date objects)
- Invalid UUIDs silently caught (system alerts used incorrect format)

**Minimum requirements per feature:**

- Multiple unit tests (cover edge cases, error paths)
- At least 1 integration test (cover happy path, NO mocks)

---

## Rest of Day: AI Intelligence Features

**Build 3 required AI features in order:**

1. AI Lead Summaries
2. AI Activity Scoring
3. AI Task Recommendations

**If all 3 complete:** Move to Product Manager Agent stretch goal (unlimited work)

---

## Feature 1: AI Lead Summaries (Required)

**What to build:**

An AI-generated summary of each lead that provides a quick overview of who they are and their engagement status.

**Functionality:**

- LLM integration (OpenAI, Claude, or your choice)
- Generate 2-3 sentence summary of lead
- Input: Lead data (name, email, phone, budget, status) + all interactions
- Output: Concise summary describing the lead and their current state
- Display on lead detail page
- "Regenerate Summary" button (updates stored summary)

**Example output:**

```
"John Smith is a high-budget lead ($500k+) who has been actively engaged
over the past 2 weeks with 5 interactions. Last contacted 3 days ago
regarding property options in downtown area."
```

**Persistent storage:**

- Generate summary once → Save to database
- Display stored summary on page load (instant)
- "Regenerate Summary" button → Call LLM → Update database → Show new summary
- Consider auto-regeneration when lead data changes significantly (optional enhancement)

**Run integration test at least once** to catch API key issues, prompt errors, etc.

**Validation checklist:**

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Tests: All passing (unit + integration)
- [ ] Database: `summary` and `summaryGeneratedAt` fields added to Lead model
- [ ] Browser: Summary displays on lead detail page
- [ ] Browser: Regenerate button updates summary
- [ ] Browser: Summary persists after page refresh (not recalculated)

---

## Feature 2: AI Activity Scoring (Required)

**What to build:**

Calculate a 0-100 "activity score" that shows how "hot" a lead is based on recent engagement.

**Functionality:**

- 0-100 score based on: recency, engagement, budget, interactions
- **Persistent storage:**
    - Add `activityScore` INTEGER field to Lead model
    - Add `scoreCalculatedAt` timestamp
    - Save score to database (cache for performance)
- Color-coded badges: red (0-30), yellow (31-70), green (71-100)
- Sort dashboard by score (highest priority leads first)
- "Recalculate Score" button (updates stored score)

```
Inputs:
- Days since last contact (recency)
- Number of interactions in last 30 days (engagement)
- Budget range (higher = more important?)
- Lead status (active > cold > closed)


Total: 0-100
```

**Persistent storage:**

- Calculate score once → Save to database
- Display stored score on dashboard (instant)
- "Recalculate Scores" button → Update all scores → Refresh dashboard
- Consider auto-recalculation when lead data changes (optional enhancement)

**Validation checklist:**

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Unit / Integration Tests: All passing
- [ ] Database: `activityScore` and `scoreCalculatedAt` fields added
- [ ] Browser: Scores display as color-coded badges
- [ ] Browser: Dashboard sorted by score (highest first)
- [ ] Browser: Scores persist after page refresh (not recalculated)
- [ ] Browser: "Recalculate" button updates scores

---

## Feature 3: AI Task Recommendations (Required)

**What to build:**

LLM analyzes lead data and suggests next-step tasks with reasoning.

**Functionality:**

- "Get AI Recommendations" button on lead detail page
- LLM analyzes: lead data + interactions + existing tasks
- Generates: 1-3 suggested next-step tasks with reasoning
- **Persistent storage (REQUIRED):**
    - Extend Task model with `source` field (ENUM: 'manual', 'ai_suggested')
    - Save AI suggestions to database as tasks with source='ai_suggested'
    - Add `aiReasoning` TEXT field (why this task suggested)
- UI shows suggested tasks with reasoning
- "Add to My Tasks" button converts suggestion to manual task (source='manual')
- "Dismiss" button removes AI suggestion

**Example AI output:**

```
Suggested Tasks:
- "Schedule follow-up call"
  Reasoning: Lead went cold after email - phone call may re-engage

- "Send budget options"
  Reasoning: Lead asked about pricing 3 times - ready for proposal

- "Research property comparables"
  Reasoning: Lead interested in specific neighborhood, needs market data
```

**Workflow:**

1. User clicks "Get Recommendations" → Loading state
2. LLM analyzes lead → Generates suggestions
3. **Save suggestions to database as tasks** with `source='ai_suggested'`
4. Display suggestions with "Add to My Tasks" and "Dismiss" buttons
5. User clicks "Add to My Tasks" → Update task: `source='manual'` (accepted)
6. User clicks "Dismiss" → Delete task (rejected)

**Validation checklist:**

- [ ] TypeScript: 0 errors
- [ ] ESLint: 0 warnings
- [ ] Tests: All passing (unit + integration)
- [ ] Database: `source` and `aiReasoning` fields added to Task model
- [ ] Browser: "Get Recommendations" button generates suggestions
- [ ] Browser: Suggestions display with reasoning
- [ ] Browser: "Add to My Tasks" converts suggestion to manual task
- [ ] Browser: "Dismiss" removes suggestion
- [ ] Browser: Suggestions persist after page refresh (stored in database)

---

## External Dependencies

### Required for AI Features

**Environment variables:**

```bash
# .env file
OPENAI_API_KEY=sk-...        # Or Claude API key, etc.

# Optional (for advanced observability):
LANGFUSE_PUBLIC_KEY=pk-...
LANGFUSE_SECRET_KEY=sk-...
LANGFUSE_HOST=https://cloud.langfuse.com
```

---

## Stretch Goals (If All 3 Required Features Complete)

### Product Manager Agent: The "Unlimited Work Generator"

#### What you'll build:

**Phase 1: PM Agent**

An AI agent that analyzes YOUR actual CRM codebase and generates personalized feature suggestions.

**What the PM Agent does:**

1. **Codebase Analysis:**

    - Scans your code to understand what's built
    - Identifies patterns and conventions
    - Maps out current feature set

2. **Competitive Research:**

   Some ideas for what the PM can look for:

    - Web searches for CRM feature comparisons and reviews
    - Analyzes competitor websites and marketing pages
    - Reviews product demo videos and screenshots
    - Reads user reviews of competitor products
    - Examines competitor pricing pages for feature tiers
    - Fetches official documentation (Context7 MCP for HubSpot, Salesforce, Pipedrive)
    - Identifies what competitors have that you don't
    - Notes which features users complain about or request most

3. **Gap Analysis:**

    - Compares your CRM to industry leaders
    - Identifies feature gaps (what's missing)
    - Prioritizes by value and complexity

4. **Feature Roadmap Generation:**
    - Generates 5-10 prioritized features
    - Includes time estimates
    - Saves to `.claude/workspace/pm-analysis/feature-roadmap.md`

**Example PM Agent output:**

```markdown
# CRM Feature Roadmap - Generated by PM Agent

## Current State Analysis

- ✅ Lead management (CRUD)
- ✅ Interaction tracking
- ✅ AI summaries and scoring
- ✅ Task recommendations
- ❌ Email integration (missing)
- ❌ Calendar scheduling (missing)
- ❌ Deal pipeline (missing)
- ❌ Team collaboration (missing)

## Competitive Analysis

HubSpot has: Email tracking, Meeting scheduler, Deal stages, Team inbox
Salesforce has: Opportunity management, Forecasting, Mobile app, Reports
Pipedrive has: Visual pipeline, Activity reminders, Email templates, Goals

## Recommended Features (Priority Order)

### Feature 1: Email Integration (High Priority)

**Why:** Every competitor has this, core CRM functionality
**Time:** 4-6 hours
**Value:** Capture all customer communication automatically
**Implementation:**

- Gmail/Outlook API integration
- Automatically create interactions from emails
- Link emails to leads
- Email templates for common responses

### Feature 2: Visual Deal Pipeline (High Priority)

**Why:** Visual pipeline is standard in modern CRMs
**Time:** 3-4 hours
**Value:** Track deals through stages (Prospect → Qualified → Proposal → Closed)
**Implementation:**

- Drag-and-drop Kanban board
- Deal stages (configurable)
- Move leads between stages
- Pipeline value calculation

### Feature 3: Calendar Integration (Medium Priority)

**Why:** Scheduling is pain point in sales
**Time:** 3-4 hours
**Value:** Book meetings without email ping-pong
**Implementation:**

- Calendar API integration (Google/Outlook)
- Meeting scheduler link (like Calendly)
- Automatic task creation for meetings
- Reminders for upcoming meetings

[... 7 more features ...]
```

#### How to Build Your PM Agent:

This is an open-ended challenge - design your own approach! Here are some ideas to get you started:

**Approach 1: Dedicated Claude Code Subagent**

- Spawn a separate Claude Code instance focused solely on PM work
- Let it run analysis independently while you build features
- Review its recommendations when ready
- Parallel work: you build, PM researches

**Approach 2: Slash Command Pattern**

- Create a custom slash command (like `/orchestration`)
- Store PM analysis prompts in `.claude/commands/pm-agent.md`
- Agent reads your codebase, performs research, generates roadmap
- Reusable across sessions

**Get creative!** There's no single "right" way to build this. The goal is to create a system that works for YOUR
workflow.

**Phase 2: Implement PM-Suggested Features**

- Review PM roadmap
- Choose features based on interest
- Build as many as time allows
- Each feature: full implementation + validation gates

---

## By End of Day 2

**Minimum completion (everyone):**

- [ ] All 3 AI features working (summaries, scoring, recommendations)
- [ ] All AI features have persistent storage (database fields added)
- [ ] Database migrations applied (summary, activityScore, source fields exist)
- [ ] 5 validation gates passing
- [ ] Can demonstrate:
    - AI generates summaries (stored in database, displayed on page)
    - AI calculates scores (color-coded badges, dashboard sorted)
    - AI suggests tasks (with reasoning, can accept/dismiss)

---

**✅ Day 2 complete**

**See full trail:** [Companion overview](README.md)
