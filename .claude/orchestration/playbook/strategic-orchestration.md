# Pre-Execution Validation Protocol: Strategic Orchestration Checklist

**Purpose:** Mandatory checklist for orchestration partner before launching ANY agent
**Impact:** Enables efficient delivery with minimal intervention through proactive blocker removal

---

## Why This Protocol Exists

### The Problem Pattern (Reactive)

```
Agent executes → discovers blocker → gets stuck → human intervention → resume → discover next blocker → stuck again
```

**Result:** Extended time, frustration, incomplete features

### The Solution Pattern (Proactive)

```
Orchestration partner validates → removes blockers → launches agent → smooth execution → success
```

**Result:** Efficient delivery, positive morale, feature complete

### The Key Difference

Proactive blocker removal before execution prevents stuck states and enables smooth completion.

---

## The Pre-Execution Validation Checklist

### Phase 1: Context Recovery

**If Continuing Previous Feature:**

- [ ] **Read handoff file** (if session continuation)

  ```bash
  # Check for handoff in .claude/meta/session-handoffs/
  ls -la .claude/meta/session-handoffs/ | grep $(date +%Y-%m-%d)
  ```

- [ ] **Understand previous outcomes:**
    - What was completed successfully?
    - What blockers were encountered?
    - What got the agent stuck?
    - What manual interventions were needed?

- [ ] **Extract action items:**
    - List specific blockers to fix
    - List infrastructure to validate
    - List decisions to make

**If Starting New Feature:**

- [ ] **Read feature requirements clearly**
- [ ] **Identify dependencies** on previous features
- [ ] **Check for similar patterns** in past features (reuse learnings)

---

### Phase 2: Infrastructure Validation

**Before committing to ANY new tooling approach:**

- [ ] **Research tool capabilities:**
    - What does it do?
    - How does it work?
    - What are the alternatives?

- [ ] **Test tool requirements IN PRACTICE:**

  ```markdown
  Don't assume - validate:

  - Does tool actually work on this machine?
  - What needs to be downloaded/installed?
  - How long does setup take?
  - What's the disk space requirement?
  ```

- [ ] **Discover hidden costs:**
    - Download size (MB vs GB)
    - Setup time (minutes vs hours)
    - Learning curve (familiar vs new)
    - Accessibility (all engineers vs subset)

- [ ] **Compare to proven approaches:**

  ```markdown
  Trade-off analysis:

  - What's the proven approach?
  - What's the theoretical improvement?
  - What's the cost difference?
  - What's the value difference?
  - Is improvement worth the cost? (pragmatic decision)
  ```

- [ ] **Make pragmatic decision:**
    - Proven approach if cost high OR time-sensitive
    - Theoretical improvement if validated AND accessible
    - Document decision and reasoning

**Example:**

- Tool research: "Autonomous testing capability!"
- Tool validation: Requires 7GB download (30-60 min setup)
- Comparison: Proven alternative (50MB, 2 min, works reliably)
- Decision: Use proven alternative for now, test new tool later
- **Result:** Avoided setup delays and unknown troubleshooting time

---

### Phase 3: Proactive Blocker Removal

**For each blocker identified in Phase 1:**

- [ ] **Verify file paths:**

  ```bash
  # If agent needs to import from X, verify X exists:
  ls path/to/file.ts
  cat path/to/file.ts | head -20  # Verify exports expected
  ```

- [ ] **Fix connection configurations:**

  ```bash
  # Check network configurations match testing environment
  # Example: localhost/proxy in dev, deployed HTTPS API origin in production
  ```

- [ ] **Start required services:**

  ```bash
  # Backend needed?
  curl http://localhost:3000/leads || npm run dev

  # Database needed?
  docker ps | grep postgres || npm run db:start
  ```

- [ ] **Verify prerequisites:**

  ```bash
  # TypeScript compiling?
  npm run type-check

  # Tests passing?
  npm test

  # Dependencies installed?
  ls node_modules/ || npm install
  ```

- [ ] **Update agent prompt with fixes:**

  ```markdown
  CRITICAL CONTEXT (BLOCKERS REMOVED):

  - Import paths FIXED: {what was fixed}
  - Backend connection FIXED: {what was fixed}
  - Infrastructure VALIDATED: {what was tested}

  YOUR FOCUS:

  - {Clear area of responsibility}
  - {Infrastructure concerns handled}
  ```

---

### Phase 4: Agent Launch with Clear Directive

**Launch agent with:**

- [ ] **Updated prompt** (includes "X is FIXED" context)
- [ ] **Clear focus area** (agent knows what to build)
- [ ] **Blockers removed** (agent won't get stuck)
- [ ] **Testing approach clarified** (proven method specified)

**Agent directive template:**

```markdown
CRITICAL CONTEXT:

- {Blocker 1} FIXED: {explanation}
- {Blocker 2} FIXED: {explanation}
- {Infrastructure} VALIDATED: {what was tested}

YOUR TASK:
Focus on {clear implementation area}. Infrastructure concerns already handled.

Follow the prompt exactly, including all validation gates.
```

---

## Validation: Did the Protocol Work?

### During Execution (Monitor)

**Positive indicators:**

- ✅ Agent makes steady progress (no long stuck periods)
- ✅ Agent focuses on implementation (not debugging infrastructure)
- ✅ Agent doesn't ask for guidance on blockers (already removed)
- ✅ Agent completes validation gates systematically

**Warning indicators:**

- ⚠️ Agent stuck for >15 minutes on same issue
- ⚠️ Agent asking basic questions about infrastructure
- ⚠️ Agent discovering blockers that should have been fixed
- ⚠️ Agent struggling with tooling that should have been validated

### After Completion (Verify)

**Success metrics:**

- ✅ All validation gates passed (TypeScript, ESLint, tests, device/browser testing)
- ✅ Feature complete and working
- ✅ No major blockers discovered during execution
- ✅ Time efficient (proactive overhead < reactive debugging)

**Failure metrics:**

- ❌ Validation gates failed (errors/warnings)
- ❌ Feature incomplete or blocked
- ❌ Multiple blockers discovered during execution
- ❌ Time wasted on infrastructure debugging

---

## Common Blocker Categories

### Category 1: Import Path Issues

**Symptoms:** "Cannot find module", bundler failures
**Proactive fix:** Verify all imported files exist before agent execution

```bash
# Agent will import from X? Verify X exists:
ls src/app/api/leads.service.ts
```

### Category 2: Connection Configuration

**Symptoms:** "Disconnected", "Cannot connect", network errors
**Proactive fix:** Verify configurations match environment

```bash
# Dev uses localhost/proxy; production uses the deployed HTTPS API origin
# Check the HttpClient provider / API base URL, WebSocket connections
```

### Category 3: Service Dependencies

**Symptoms:** "Connection refused", "Service not available"
**Proactive fix:** Start all required services before agent execution

```bash
# Backend needed? Start it:
npm run dev

# Database needed? Start it:
docker ps | grep postgres || npm run db:start
```

### Category 4: Infrastructure Requirements

**Symptoms:** "Tool not found", "Command not available", hidden setup costs
**Proactive fix:** Test infrastructure requirements, discover costs, make pragmatic decisions

```bash
# Don't assume - validate:
xcrun simctl list devices  # iOS simulators available?
# If empty: mobile-mcp won't work, need alternative
```

### Category 5: Environment Mismatches

**Symptoms:** "Works in test but not in dev", "Environment variable missing"
**Proactive fix:** Verify environment matches agent's needs

```bash
# Development database has schema?
npm run db:migrate:fresh

# Environment variables set?
cat .env.local | grep REQUIRED_VAR
```

---

## Protocol Application Guidelines

### When to Use This Protocol

**Always use before:**

- Launching any feature implementation agent
- Continuing a previously blocked feature
- Trying a new tooling approach
- Complex infrastructure setup tasks

**Can skip for:**

- Trivial documentation updates (no agent execution)
- Quick consultations (no implementation)
- Research tasks (no infrastructure dependencies)

---

## Integration with Existing Protocols

### This Protocol Comes BEFORE:

- Coordination protocols (coordination-protocols.md)
- Agent prompt creation (prompt-templates.md)
- Session logging (logging-protocol-integration.md)

### This Protocol Ensures:

- Agents receive clear path (blockers removed)
- Infrastructure validated (tooling works)
- Pragmatic decisions made (proven approaches chosen)
- Smooth execution possible (no stuck states)

### This Protocol Connects to:

- Session handoffs (preserve context across sessions)
- Methodology discoveries (apply learnings to prevent repeated failures)
- Quality standards (all gates passable when blockers removed)

---

## Application Pattern

### Successful Implementation Example

**Challenge:** Previous attempt blocked by import paths + backend connection + infrastructure decisions
**Protocol Applied:**

- Read handoff → identified 3 blockers
- Validated infrastructure → discovered tool had high setup cost
- Fixed blockers proactively → imports verified, backend configured, proven approach chosen
- Launched agent → smooth execution, all gates passed, COMPLETE
  **Result:** Efficient completion vs blocked state

### How to Apply

- Read previous session context → prevent similar blockers
- Validate new infrastructure before committing
- Apply proactive blocker removal systematically

---

## Teaching This Protocol

### Module: "Strategic Orchestration for 100% Success"

**Week 1-2: Learn Strategic Thinking**

- How to read session handoffs for context
- How to identify blockers before execution
- How to validate infrastructure requirements
- How to make pragmatic trade-off decisions

**Practice:**

- Given session handoff → identify blockers
- Given infrastructure research → discover true costs
- Choose: proven approach vs theoretical improvement

**Week 3-4: Apply Proactive Problem-Solving**

- Fix import paths before agent execution
- Configure connections proactively
- Start services before agent needs them
- Verify prerequisites working

**Practice:**

- Given feature requirements → create pre-execution checklist
- Fix all blockers proactively
- Launch agent with "X is FIXED" directive

**Week 5-6: Master Strategic Orchestration**

- Full workflow: Handoff → validate → fix → launch → success
- Recognize when to think strategically vs delegate tactically
- Systematic success through proactive orchestration

---

## The Core Teaching

**"Engineers who master strategic orchestration deliver features systematically. Engineers who only delegate tactically
get stuck reactively."**

**Strategic orchestration means:**

- Read context (handoffs, past failures)
- Validate infrastructure (test, don't assume)
- Remove blockers (fix before execution)
- Clear path (agents focus on value)

**Tactical execution means:**

- Implement features (clear requirements)
- Validate quality (all gates)
- Document decisions (session logs)
- Deliver successfully (gates passed)

**Together:**

- Strategic thinking + tactical doing = systematic success
- Teaching quality + practical application
- **This IS the methodology**

---

## Status

**Protocol Status:** Proven and ready for use
**Application:** Mandatory for all feature agent execution
**Documentation:** Complete with checklists and practical examples
**Teaching Ready:** Can be taught immediately in curriculum

**Implementation Results:**

- Proactive approach: Smooth completion
- Reactive approach: Blocked states and interventions required
- All validation gates passed with proactive protocol

**Ready for:** Integration into standard workflow

---

**Last Updated:** 2025-10-08
**Core Insight:** "Proactive orchestration (strategic) + focused execution (tactical) = systematic success"
