# Pattern Library: Proven AI Agent Orchestration Patterns

**Purpose:** Universal patterns for systematic AI agent coordination and quality delivery

**Usage:** These patterns apply to ANY project using parallel agent orchestration

**Evidence:** All patterns validated through systematic experimentation and proven to prevent common failure modes

---

## Core Orchestration Patterns

### 1. Infrastructure-First Pattern

**Problem:** Agents need working tools before they can build features effectively

**Solution:** Establish all foundational systems BEFORE parallel agents execute

**What Qualifies as Infrastructure:**

- Database setup and migrations (Sequelize ORM)
- Testing framework with example tests (Jest)
- Development scripts (setup, seed, reset, dev)
- Project scaffolding (NestJS backend, Angular frontend)
- Environment configuration
- **MCP Server configuration** (Filesystem, Playwright, Context7)

**How to Apply:**

```
Task 0 (Sequential): Complete infrastructure setup
  ↓
Tasks A, B, C (Parallel): Build features on established foundation
```

**Why It Matters:**

- Demo readiness: Fresh clone → npm install → npm run setup → npm run dev = working app
- Parallel independence: All agents start with complete working environment
- No excuses: Testing framework exists, setup scripts work
- Professional standards: Eliminates "works on my machine" problems

**Extended to Testing:**
Testing framework is infrastructure, not optional. Agents can write tests immediately without "no framework exists"
excuse.

**Extended to MCP Servers:**
MCP (Model Context Protocol) servers extend agent capabilities and must be configured as infrastructure:

**Essential MCP Servers:**

1. **Filesystem MCP** - File operations (read, write, search, directory listing)

    - Why: Agents need to work with code files systematically
    - Setup: Already available in most Claude Code environments

2. **Playwright MCP** - Browser automation and testing

    - Why: Required for validation gate #5 (manual browser testing)
    - Enables: Taking screenshots, clicking buttons, testing full user flows
    - Critical: Without this, agents cannot validate their work in actual browsers

3. **Context7 MCP** - Up-to-date library documentation
    - Why: Prevents outdated patterns and deprecated API usage
    - Provides: Current docs for Sequelize, NestJS, Angular, and other libraries
    - Benefit: Agents reference latest best practices, not training data

**Configuration as Infrastructure:**

- Install and test MCP servers BEFORE feature development
- Verify agents can access each MCP server
- Confirm Playwright can launch browser and take screenshots
- Test Context7 retrieves current documentation

**Why This Matters:**

- Validation gate #5 depends on Playwright MCP (browser testing mandatory)
- Current documentation prevents using deprecated APIs
- Agents work more effectively with extended tool access
- Professional development requires browser validation, not just unit tests

**Advanced MCP Servers (Introduce As Needed):**

4. **[Sequential Thinking MCP](https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking)** -
   Structured problem decomposition

    - When: Complex debugging scenarios, multi-step problems
    - Why: Forces systematic thinking through difficult issues
    - Use case: "AI integration isn't behaving as expected - walk through it step by step"

5. **[Zen MCP](https://github.com/BeehiveInnovations/zen-mcp-server)** - Multi-model consensus

    - When: Important architectural decisions, code review
    - Why: Get second opinions before committing to approaches
    - Use case: "Should we use approach A or B for this feature?"

6. **[Serena MCP](https://github.com/oraios/serena)** - Semantic code navigation and search
    - When: Working with substantial codebases (greenfield Day 3+, brownfield ESSENTIAL)
    - Why: Find symbols, understand existing patterns, navigate code structure
    - Use case: "Find all authentication-related code", "Where is User model defined?"
    - Critical for: Brownfield extension to existing company codebases

**Tiered Introduction Strategy:**

- **Day 1:** Essential MCP (infrastructure foundation)
- **Day 2:** Advanced MCP when complexity increases (Sequential Thinking, Zen)
- **Day 3+:** Brownfield-ready MCP when codebase substantial (Serena)

---

### 2. Strategic Orchestration vs Tactical Execution

**Problem:** Reactive problem discovery during execution leads to stuck agents and blocked progress

**Solution:** Strategic planning BEFORE agent execution, tactical implementation BY agents

**Strategic Phase (Before Agent Launch):**

1. Read session context (previous work, known blockers)
2. Validate infrastructure requirements (test, don't assume)
3. Identify and fix blockers proactively
4. Make pragmatic decisions (proven vs theoretical approaches)
5. Launch agent with cleared path

**Tactical Phase (Agent Execution):**

- Agent implements features (clear requirements)
- Agent validates quality (all gates)
- Agent documents decisions (session logs)
- Agent delivers successfully (gates passed)

**How to Apply:**

- ALWAYS read context before launching agents
- NEVER assume infrastructure works - validate first
- FIX blockers before execution, not during
- CLEAR the path so agents can focus on implementation

**Why It Matters:**

- Proactive orchestration prevents stuck states
- Agents execute smoothly without discovering blockers mid-work
- Time efficient (30 min prep saves 2+ hours of interventions)
- Positive morale (success vs frustration)

---

### 3. Field Naming Convention Locks

**Problem:** Parallel agents using different field names creates systematic integration failures

**Solution:** Lock field naming conventions BEFORE parallel execution begins

**Mandatory Convention:**

- **API Fields (DTOs):** camelCase (leadId, budgetMin, lastContactDate)
- **Database Layer:** snake_case (mapped in the models/services)
- **Frontend Code:** camelCase ONLY (matching the shared API types exactly)
- **Validation:** TypeScript compilation enforces consistency

**How to Apply:**

1. Define field naming convention before parallel agents start
2. Schema agent defines field names as source of truth
3. All other agents import and use exact field names
4. TypeScript type-check catches violations automatically

**Integration Points:**

```markdown
## FIELD NAMING CONVENTION (MANDATORY)

You MUST use these exact field names matching the shared API types:

- leadId (NOT lead_id)
- budgetMin (NOT budget_min)
- createdAt (NOT created_at)

Import schema types and use them directly.
```

**Why It Matters:**

- Prevents systematic mismatches across agent boundaries
- TypeScript catches coordination errors before runtime
- Schema as single source of truth for all agents
- Professional practice: coordination contracts are mandatory

---

### 4. Integration Validation Layer

**Problem:** Individual agents can complete successfully while system integration fails

**Solution:** Validation checkpoint between parallel completion and final delivery

**Mandatory Validation Steps:**

#### 1. TypeScript Compilation

```bash
npm run type-check
```

**Required:** Output shows "✔ No TypeScript errors" (0 errors)

#### 2. ESLint

```bash
npm run lint
```

**Required:** Output shows "✔ No ESLint warnings or errors" (0 warnings)

#### 3. Test Suite

```bash
npm test
```

**Required:** All tests passing

#### 4. Resource Check

```bash
# Verify clean environment
pgrep -f jest || echo "No hanging processes ✅"
```

**Required:** Clean development environment, no resource leaks

#### 5. Manual Browser/Device Testing

**Required:** Feature works in actual browser or device, not just automated tests

**For Web:**

- Start dev server: `npm run dev`
- Open browser: http://localhost:3000 (or configured port)
- Test all implemented features end-to-end
- Check browser console for zero errors
- Verify database operations in development database

**For Mobile:**

- Start development server: `npm start`
- Test in the browser and install as a PWA on a device
- Check browser DevTools console for zero errors
- Verify features work in actual app environment

**Why It Matters:**

- Automated tests validate code logic, not end-to-end workflows
- TypeScript catches type mismatches across agents
- Browser/device testing reveals integration issues tests miss
- Process cleanup prevents RAM exhaustion during development

---

### 5. Two-Tier Testing Strategy

**Problem:** Mock-heavy unit tests hide integration bugs that only appear in production

**Solution:** Unit tests WITH mocks + Integration tests WITHOUT mocks

**Tier 1: Unit Tests (With Mocks)**

- Purpose: Test logic in isolation
- Speed: Fast (<1s per test)
- Coverage: Edge cases, error paths
- Example: "markAsRead throws error if notification not found"

**Tier 2: Integration Tests (NO Mocks)**

- Purpose: Test cross-layer integration
- Speed: Slower (database I/O)
- Coverage: Happy path through full stack
- Example: "Create notification → Verify in DB → Verify WebSocket broadcast"

**Minimum Requirements:**

```yaml
per_task:
  unit_tests: "Multiple (cover edge cases with mocks)"
  integration_tests: "At least 1 (cover happy path, NO MOCKS)"

per_feature:
  e2e_tests: "At least 1 (full flow validation)"
```

**Critical Pattern:**

```typescript
// ❌ WRONG: All mocked (hides type mismatches)
jest.mock('@/lib/services/notification.service');

// ✅ CORRECT: Real database, real services
test('integration: create notification end-to-end', async () => {
  // No mocks - executes actual SQL
  const notification = await notificationService.createAndPublish({...});

  // Verify in real database
  const dbRecord = await Notification.findOne({where: {...}});
  expect(dbRecord).toBeDefined();
});
```

**Why It Matters:**

- Mock-heavy tests pass while production code would crash
- Database types don't match TypeScript assumptions (strings vs Date objects)
- Constraint violations caught silently (invalid UUIDs, null violations)
- Integration tests catch bugs unit tests hide

---

### 6. External Dependency Validation

**Problem:** Agents claim "complete" without validating external APIs/services work in practice

**Solution:** Mandatory disclosure of external dependencies and their configuration status

**Required in Agent Completion:**

```markdown
## EXTERNAL DEPENDENCIES (MANDATORY DISCLOSURE)

### Required Environment Variables

- `OPENAI_API_KEY` - **REQUIRED** - OpenAI API key for feature X
  - Status: ⚠️ NOT CONFIGURED (feature will fail)
  - Testing: ❌ Feature NOT tested with real API
  - Next Steps: Engineer must add to .env.local before feature functional

### Required External Services

- OpenAI API (gpt-4-turbo model)
  - Cost: ~$0.01 per operation
  - Rate Limits: Check OpenAI dashboard
  - Fallback: None implemented (feature will fail without key)

### Validation Status

- [x] Unit tests passing (mocked external calls)
- [x] Integration tests passing (mocked external calls)
- [ ] **E2E test with REAL API** - NOT PERFORMED
- [ ] **Environment variable configured** - NOT VERIFIED

**DEPLOYMENT BLOCKER:** Feature is non-functional without external configuration.
```

**Why It Matters:**

- "Tests passing" ≠ "Feature working"
- External dependencies require explicit validation
- Cost implications must be disclosed
- Deployment blockers identified before claiming complete

---

### 8. Session Logging for Methodology Analysis

**Problem:** Without execution logs, can't analyze what worked or improve methodology

**Solution:** All agents maintain detailed session logs during execution

**Log Location:** `.claude/workspace/[feature]/agent-logs/[agent-name]-session.md`

**Required Logging:**

- Technology stack decisions affecting other agents
- Coordination assumptions and validations
- Integration challenges encountered
- Methodology insights discovered during execution

**Why It Matters:**

- Orchestration partner analyzes execution for validation and debugging
- Retrospectives use real execution examples for learning
- Coordination protocol validation based on actual agent behavior
- Pattern recognition helps improve future features

---

### 9. Import Chain Parallelization Analysis

**Problem:** Assuming tasks can run in parallel without analyzing import dependencies

**Solution:** Map export/import dependencies BEFORE claiming parallel execution possible

**Parallelization Test (ALL Must Be True):**

- [ ] Task X does NOT import from Task Y
- [ ] Task Y does NOT import from Task X
- [ ] Tasks work on different files (no merge conflicts)
- [ ] No shared state/coordination during execution
- [ ] Tasks are truly independent in scope

**If ANY is false → SEQUENTIAL EXECUTION REQUIRED**

**Example: Sequential Required**

```
Task A: REST Backend
    ↓ exports: LOGIN_MUTATION, User type
Task B: Angular Context
    ↓ imports from A, exports: useAuth hook
Task C: UI Components
    ↓ imports from B
```

**No parallelization possible** - each task builds on previous.

**Example: Parallel Possible**

```
Task 0: Infrastructure
    ↓
    ├─ Task A: Database (no imports from B/C)
    ├─ Task B: API Scaffold (no imports from A/C)
    └─ Task C: UI Foundation (no imports from A/B)
```

**Parallelization works** - no import dependencies between tasks.

**Why It Matters:**

- Prevents broken implementations with missing imports
- Sets realistic timeline expectations
- Agents self-validate dependencies before coding

---

### 10. Pre-Completion Validation Gates

**Problem:** Agents claim "complete" before validating all quality requirements

**Solution:** Five mandatory validation gates before claiming completion

**Gate 1: TypeScript (0 errors)**

```bash
npm run type-check
```

**Gate 2: ESLint (0 warnings)**

```bash
npm run lint
```

**Gate 3: Tests (all passing)**

```bash
npm test
```

**Gate 4: Resource Check (clean environment)**

```bash
# Verify clean environment
pgrep -f jest || echo "No hanging processes ✅"
```

**Gate 5: Browser/Device Testing (features work)**

- Web: Open browser, test features, check console
- Mobile: Open device/simulator, test features, check console

**Claiming "COMPLETE" without passing ALL gates = INCOMPLETE TASK**

**Why It Matters:**

- Runtime test success ≠ compilation success
- Automated tests ≠ features actually work
- Process cleanup prevents RAM exhaustion
- Professional standard: validate before claiming done

---

### 11. Git Worktrees for Parallel Work

**Problem:** Need to work on experimental approaches or maintain stable reference while developing risky changes

**Solution:** Git worktrees create separate working directories for different branches, enabling safe experimentation

**When to Use Git Worktrees:**

1. **Experimental Approaches**

    - Try multiple solutions to same problem in parallel
    - Each worktree = different approach
    - Compare results, choose best
    - Zero cost to abandon failed experiments

2. **Brownfield Safety**

    - Keep main worktree stable for reference
    - Experiment in feature worktrees without risk
    - Easy rollback if approach doesn't work

3. **Review While Developing**
    - Review PR in one worktree
    - Continue development in another
    - Don't block progress on review cycles

**How to Apply:**

```bash
# Create worktree for experimental feature
git worktree add ../myapp-experiment experiment-branch

# Work in separate directory
cd ../myapp-experiment
# Orchestrate feature, test safely

# If successful, merge. If not, remove easily
git worktree remove ../myapp-experiment
```

**When NOT to Use:**

- ❌ Short features with file isolation (single worktree sufficient)
- ❌ Simple parallel execution (current patterns work well)
- ✅ Long-running experiments (days/weeks)
- ✅ High-risk changes requiring stable reference
- ✅ Brownfield work where main worktree should stay pristine

**Why It Matters:**

- Safe experimentation without polluting main branch
- Parallel work on different concerns
- Professional practice for exploratory work in company repos

**Course Timing:**

- Days 1-4: Single worktree (learn fundamentals)
- Day 5 (Bonus): Worktrees for advanced scenarios

**See:** Guidebook Appendix A for complete workflows

---

### 12. Stacked PRs for Reviewable Chunks

**Problem:** Large features create massive PRs that are hard to review and slow to merge

**Solution:** Break complex features into small, dependent PRs using git-town

**When to Use Stacked PRs:**

1. **Complex Features**

    - Multi-week features need incremental review
    - Break into logical, reviewable pieces
    - Each PR = single responsibility

2. **Parallel Review**

    - Submit multiple PRs simultaneously
    - Reviewers can approve incrementally
    - Faster feedback cycles

3. **Clean History**
    - Maintain linear commit history
    - Each commit represents complete, reviewable change
    - Professional practice for team collaboration

**How to Apply with git-town:**

```bash
# Install git-town (free, open-source)
brew install git-town

# Create base feature branch
git town hack feature-base
# Orchestrate base functionality
git commit -m "feat: add base"

# Create dependent branch on top
git town append feature-extension
# Orchestrate extension
git commit -m "feat: add extension"

# Sync entire stack with main
git town sync

# Submit PRs (PR #2 marked as depends on PR #1)
```

**Key git-town Commands:**

- `git town hack <branch>`: Create new feature branch from main
- `git town append <branch>`: Create branch on top of current
- `git town sync`: Keep stack synchronized with main
- `git town ship`: Merge and update dependent branches

**When NOT to Use:**

- ❌ Simple features (single PR sufficient)
- ❌ Truly independent features (parallel, not stacked)
- ✅ Multi-week complex features
- ✅ Features requiring incremental review
- ✅ Team environments with review bottlenecks

**Why It Matters:**

- Smaller PRs = faster review cycles
- Incremental approval reduces risk
- Maintains clean, understandable git history
- Professional practice for complex team projects

**Course Timing:**

- Days 1-4: Single-PR workflow (learn fundamentals)
- Day 5 (Bonus): Stacked PRs for company complexity

**See:** Guidebook Appendix B for complete workflows

---

## Coordination Protocols

### Low Coordination (Infrastructure-Independent Tasks)

**When:** Tasks with minimal cross-dependencies

- Database setup
- Deployment configuration
- UI scaffolding

**Coordination Overhead:** Minimal - basic naming conventions only

**Success Pattern:** High efficiency with seamless integration

---

### High Coordination (Schema-Code Integration Tasks)

**When:** Tasks with significant cross-dependencies

- Shared API types + controllers + UI components
- Authentication system across multiple layers
- Data pipeline with multiple transformation stages

**Coordination Overhead:** Systematic coordination architecture required

**Required Mechanisms:**

1. Field naming convention locks (pre-execution)
2. Technology stack specifications (exact versions, import patterns)
3. Cross-agent validation (import schema, use types, never duplicate)
4. Integration validation layer (system-level testing)

**Success Pattern:** Professional quality maintained through systematic coordination

---

## Applying These Patterns

### For Each Feature

**Before Agent Execution (Strategic):**

1. Read session context (previous work, known issues)
2. Validate infrastructure requirements (test, don't assume)
3. Identify coordination level (low vs high)
4. Fix blockers proactively
5. Define field naming conventions (if high coordination)

**During Agent Execution (Tactical):**

1. Agents implement features following specifications
2. Agents follow established conventions and patterns
3. Agents integrate with existing systems
4. Agents validate quality through all five gates

**After Agent Completion (Validation):**

1. Verify all validation gates passed
2. Test features in actual environment (browser/device)
3. Document learnings in feature retrospective
4. Update agent prompts if improvements discovered
