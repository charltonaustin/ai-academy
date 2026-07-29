# Chapter 05: Sub-Agents and the Task Tool

## Overview

How agents use the Task tool to spawn sub-agents for focused exploration and research.

---

## 1. Theory: What Are Sub-Agents?

### The Distinction

**What you do (Engineer-level orchestration):**

```
You launch multiple agents for a feature:
├── Backend agent (separate Claude session)
├── Frontend agent (separate Claude session)
└── Testing agent (separate Claude session)

You coordinate: "Backend agent, then frontend agent"
```

**What agents do internally (Agent-level optimization):**

```
Single agent execution:
├── Main agent (your Claude session)
│   ├── Launches sub-agent: "Explore auth patterns"
│   ├── Launches sub-agent: "Research JWT libraries"
│   └── Implements using sub-agent findings
```

### Key Difference

**Parallel agents (Engineer orchestrates):**

- You launch separate Claude sessions
- Each works on different features/layers
- You coordinate the handoffs

**Sub-agents (Agent optimizes itself):**

- Agent launches Task tool within its own session
- Isolates exploration/research tasks
- Agent coordinates its own work

**This chapter is about sub-agents** (what agents do internally).

---

## 2. Evidence: When Sub-Agents Help

### Scenario 1: Large Codebase Exploration

**Without sub-agent:**

```
Agent task: Implement authentication

Agent reads directly:
├── user.model.ts (2K tokens)
├── auth.service.ts (3K tokens)
├── jwt.middleware.ts (2K tokens)
├── passport.strategy.ts (4K tokens)
├── session.service.ts (3K tokens)
└── Total: 14K tokens accumulated in agent's context

Agent implements: With 14K context already loaded
Risk: Context-heavy, slower responses, less focus
```

**With sub-agent:**

```
Agent task: Implement authentication

Agent launches sub-agent: "Explore existing auth patterns"
Sub-agent reads all files, returns summary (800 tokens)

Agent implements: With 800-token summary
Benefit: Context lean, focused, faster implementation
```

**Result:** Sub-agent approach is slower (sub-agent launch overhead) but higher quality (found existing patterns to
reuse).

### Scenario 2: Research-Heavy Task

**Without sub-agent:**

```
Agent task: Implement an API gateway / BFF layer

Agent explores API gateway documentation (8K tokens)
Agent reads the NestJS REST + interceptors guide (6K tokens)
Agent researches gateway/BFF patterns (5K tokens)
Total: 19K tokens

Agent implements: Buried in research context
```

**With sub-agent:**

```
Agent launches sub-agent: "Research API gateway / BFF best practices for NestJS"
Sub-agent synthesizes research, returns recommendation

Agent implements: With actionable recommendation
```

**Result:** Sub-agent isolates research, agent gets synthesis.

---

## 3. Protocol: How to Use Sub-Agents

### Method 1: Let Claude Decide (Autonomous)

**You don't mention sub-agents at all:**

```
You: "Implement authentication for this NestJS app"

Claude decides:
- Checks codebase size
- Checks task complexity
- May use sub-agents if warranted
```

**Claude's internal decision:**

- Small codebase (<10K lines) → No sub-agent needed
- Large codebase (>50K lines) → May use sub-agent for exploration
- Complex research → May use sub-agent for synthesis

### Method 2: Explicitly Request (Directed)

**You tell Claude to use sub-agents:**

```
You: "Use a sub-agent to explore the existing authentication code
and return a summary of patterns. Then implement new auth feature
using those patterns."

Claude:
1. Launches Task tool (sub-agent)
2. Sub-agent explores auth code
3. Sub-agent returns summary
4. Main agent implements using summary
```

**When to do this:**

- You know codebase is large
- You want focused exploration separate from implementation
- You're managing context strategically

### Method 3: Check Running Sub-Agents

**Use `/agents` command:**

```bash
/agents
```

**Shows:**

```
Running agents:
- Main session (this conversation)
- Sub-agent 1: "Exploring authentication patterns" (in progress)
- Sub-agent 2: "Research completed" (finished)
```

**You can:**

- See what sub-agents are running
- Monitor progress
- Understand what's taking time

---

## 4. Practice: Understanding the Trade-Off

### The Trade-Off

**Slower execution:**

- Each sub-agent launch: 1-3 minutes overhead
- Simple task: 5 min → 10 min (with sub-agent)
- Complex task: 30 min → 40 min (with sub-agent)

**Higher quality:**

- Better codebase pattern discovery
- More thorough research synthesis
- Cleaner agent context (focused on implementation)

### When Sub-Agents Are Worth It

**✅ Good uses:**

- Large brownfield codebases (pattern discovery valuable)
- Research-heavy tasks (synthesis needed)
- Agent's context getting heavy (isolation helps)
- Complex features with exploration phase

**❌ Poor uses:**

- Small greenfield codebases (no patterns to discover)
- Simple straightforward tasks (overhead > benefit)
- Tight deadlines (can't afford slowdown)
- Iterative debugging (handoff friction hurts)

### Example Decision

**Greenfield Day 1 (5K line codebase):**

```
Task: Add login form
Claude decision: NO sub-agents (codebase small, task simple)
Execution: 15 minutes, good quality
```

**Brownfield production (80K line codebase):**

```
Task: Add login form
Claude decision: YES, use sub-agent for auth pattern exploration
Execution: 25 minutes, found 3 existing auth utilities to reuse
Benefit: Saved hours of duplicate work, consistent with codebase
```

---

## 5. Examples: Sub-Agent Usage

### Example 1: Codebase Exploration

**Your request:**

```
Implement user profile editing feature in this large Rails app
```

**Agent's approach:**

```
Agent: "This is a large codebase. I'll launch a sub-agent to explore
existing user model patterns before implementing."

Sub-agent explores:
- User model structure
- Existing update patterns
- Validation rules
- Returns summary

Agent implements:
- Following discovered patterns
- Reusing existing validations
- Consistent with codebase style
```

### Example 2: Research Synthesis

**Your request:**

```
Add real-time notifications using best practices
```

**Agent's approach:**

```
Agent: "I'll research WebSocket vs Server-Sent Events approaches."

Sub-agent researches:
- Reads documentation
- Compares approaches
- Returns recommendation: "Use Server-Sent Events because..."

Agent implements:
- Based on researched recommendation
- Without main context full of docs
```

### Example 3: Explicit Request

**You direct:**

```
Use the Task tool to launch a sub-agent that explores our existing
authentication code and returns a summary of the patterns used.
Then implement OAuth using those same patterns.
```

**Agent executes:**

```
1. Launches sub-agent explicitly (as directed)
2. Sub-agent explores auth code
3. Sub-agent returns: "Your app uses Passport.js with JWT..."
4. Agent implements OAuth following Passport.js pattern
```

---

## Sub-Agents vs Context Management

### These Are Related But Different Concepts

**Sub-agents = A context management technique**

- HOW: Agent spawns focused sub-tasks
- WHEN: During execution (agent decides)
- WHO: Agent manages its own context

**Context management = Broader concept**

- Includes: Sub-agents, focused prompts, session handoffs, breaking tasks down
- Multiple techniques, sub-agents is one of them

**Context management techniques:**

1. **Focused prompts** (You do this)

    - Write specific prompts vs vague prompts
    - "Add login form to /register" vs "make auth work"

2. **Breaking tasks down** (You do this)

    - One big task → Multiple smaller tasks
    - Reduces context per task

3. **Session handoffs** (You do this)

    - Save context, start fresh session
    - Prevents context accumulation

4. **Sub-agents** (Agent does this)
    - Agent spawns focused exploration tasks
    - Keeps agent's main context lean

**See Chapter 07: Context Management** for complete context strategies.

---

## 6. Creating Your Own Specialized Sub-Agents

### When Custom Sub-Agents Make Sense

The Task tool provides many built-in agent types (general-purpose, frontend-developer, backend-architect, etc.), but you
can create your own specialized sub-agents for domain-specific needs.

**Good reasons to create custom sub-agents:**

- **Domain expertise:** Your project has specialized requirements not covered by built-in agents (e.g., "
  payment-processor-integration" agent for complex payment workflows)
- **Repeated patterns:** You find yourself giving the same complex instructions repeatedly (e.g., "
  library-cataloging-specialist" for MARC21 metadata standards)
- **Tool access needs:** Your sub-agent needs specific tool combinations not available in built-in types
- **Company-specific workflows:** Your organization has unique patterns worth codifying (e.g., "compliance-checker"
  agent for regulatory requirements)

**Poor reasons to create custom sub-agents:**

- **One-off tasks:** Simple task that won't be repeated (just use general-purpose agent)
- **Already covered:** Built-in agents already handle this well (don't reinvent)
- **Premature optimization:** Creating agents before understanding patterns (wait until patterns emerge)

### How to Create Custom Sub-Agent Definitions

Custom sub-agents are defined using Claude Code's agent definition file format. These are stored in `.claude/agents/`
directory (or similar project-specific location).

**Agent definition structure:**

```yaml
# .claude/agents/payment-integration-specialist.yaml
name: payment-integration-specialist
description: |
  Specialized agent for integrating payment processors (Stripe, PayPal, etc.)
  with proper error handling, webhook validation, and PCI compliance patterns.

  Use this agent when implementing payment features that require:
  - Secure API key management
  - Webhook signature verification
  - Idempotent payment processing
  - Refund/dispute handling workflows

tools:
  - Write
  - Read
  - Edit
  - Bash
  - Grep
  - Glob

context:
  - Always use environment variables for API keys (never hardcode)
  - Implement webhook signature verification for all webhook endpoints
  - Use idempotency keys for payment operations
  - Log all payment events for audit trails
  - Handle network failures with exponential backoff retry

examples:
  - |
    Example: Stripe integration with webhook validation

    1. Store STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env
    2. Create webhook endpoint with signature verification
    3. Implement idempotent payment processing
    4. Add comprehensive error handling
    5. Log all events to audit table
```

### Example: Creating a Library Cataloging Agent

**Scenario:** Your library management system needs MARC21 and Dublin Core metadata standards throughout.

**Custom agent definition:**

```yaml
# .claude/agents/library-cataloging-specialist.yaml
name: library-cataloging-specialist
description: |
  Expert in library cataloging standards (MARC21, Dublin Core).

  Use when implementing features that involve:
  - Book metadata management
  - Cataloging workflows
  - Metadata format conversions
  - Import/export of library records

tools:
  - Write
  - Read
  - Edit
  - Bash
  - WebFetch  # For fetching Library of Congress standards

expertise:
  - MARC21 field structure and indicators
  - Dublin Core elements (dc:title, dc:creator, etc.)
  - ISBN/ISSN validation
  - Call number systems (Dewey, LC Classification)
  - Authority control patterns

validation:
  - Verify MARC21 records have valid tags (010-999)
  - Ensure required Dublin Core elements present
  - Validate ISBN format (10 or 13 digits with check digit)
  - Check call numbers match chosen system format
```

### Using the Agent-Creator Agent

Claude Code provides an `agent-creator` agent to help design new specialized agents.

**How to use it:**

```
You: "I need an agent that understands library cataloging standards
like MARC21 and Dublin Core for proper metadata management."

[Use Task tool with subagent_type=agent-creator]

Agent-Creator:
1. Analyzes your domain-specific needs
2. Identifies required tools and capabilities
3. Generates agent definition file
4. Explains when to use this agent vs built-in types
5. Provides example invocations
```

**The agent-creator will produce:**

- Complete agent definition file (YAML format)
- Documentation of agent's purpose and capabilities
- Usage examples for your specific domain
- Tool access recommendations
- Validation checklist for the agent type

### Example: Brownfield Company Codebase Agent

**Scenario:** Your company has a large legacy codebase with unique patterns you want agents to follow.

**You create:**

```yaml
# .claude/agents/acme-backend-specialist.yaml
name: acme-backend-specialist
description: |
  Specialized for ACME Corp's backend architecture patterns.

  Understands:
  - Our custom ORM wrapper patterns
  - Internal API versioning conventions
  - Company-specific error handling
  - Legacy database schema quirks

tools:
  - Write
  - Read
  - Edit
  - MultiEdit
  - Bash
  - Grep
  - Glob

conventions:
  - All database queries use AcmeQueryBuilder (not raw SQL)
  - API routes prefixed with /api/v{version}/
  - Errors use AcmeError class with standard codes
  - Legacy tables use snake_case, new tables use camelCase
  - All services extend BaseAcmeService

patterns:
  read_first:
    - src/core/query-builder.ts (ORM wrapper)
    - src/core/base-service.ts (Service patterns)
    - src/core/error-handler.ts (Error patterns)
```

**Usage in your prompts:**

```markdown
## AGENT SELECTION

Use the Task tool with subagent_type=acme-backend-specialist when:

- Implementing new backend services
- Working with database layer
- Need to follow company conventions

This ensures agents discover and follow ACME-specific patterns automatically.
```

### Orchestration Partner + Custom Sub-Agents

Your orchestration partner can automatically select custom sub-agents when analyzing tasks.

**Example workflow:**

```
You: "I need to add Stripe payment processing"

Orchestration Partner analyzes:
- Task involves payment integration
- Custom agent exists: payment-integration-specialist
- Selects specialized agent over general-purpose

Partner creates prompt:
"Use Task tool with subagent_type=payment-integration-specialist
to implement Stripe integration following PCI compliance patterns..."
```

**Result:** Agents automatically apply domain expertise you've codified.

### When to Create vs When to Prompt

**Create custom agent when:**

- ✅ Pattern repeats frequently (3+ times)
- ✅ Complex domain expertise required
- ✅ Team needs consistent approach
- ✅ Onboarding new developers (agent teaches patterns)

**Just write detailed prompt when:**

- ❌ One-off task (won't repeat)
- ❌ Simple straightforward work
- ❌ Pattern still evolving (not stable yet)
- ❌ Built-in agent already sufficient

### Example: Evolution from Prompt to Agent

**Iteration 1 (First time):**

```
You: "Implement Stripe payment with webhook validation,
idempotency keys, error handling, and audit logging"

[Uses general-purpose agent, works fine]
```

**Iteration 2 (Second payment feature):**

```
You: "Implement PayPal payment with [same long instructions]"

[Copy-pasting same requirements, getting tedious]
```

**Iteration 3 (Third time - create agent):**

```
You: "Create payment-integration-specialist agent"

[Use agent-creator to codify patterns]

Now all future payment features:
"Use payment-integration-specialist to add [payment processor]"
[All best practices automatically included]
```

**Benefit:** Captured knowledge, consistent quality, faster execution.

### Best Practices for Custom Agents

**1. Document when to use (vs when not to use):**

```yaml
description: |
  Use this agent when implementing features that require X, Y, Z.

  Do NOT use for:
  - Simple CRUD operations (use general-purpose)
  - Frontend work (use frontend-developer)
```

**2. Include discovery patterns:**

```yaml
context:
  - Always check existing code patterns before implementing
  - Read src/core/payment-base.ts for standard approaches
  - Search for similar integrations: grep -r "PaymentProcessor"
```

**3. Specify validation requirements:**

```yaml
validation:
  - Run: npm test:payments (payment-specific test suite)
  - Verify: Webhook signatures validate correctly
  - Check: Idempotency keys prevent duplicate charges
  - Test: Refund workflow with test cards
```

**4. Provide examples:**

```yaml
examples:
  - |
    Example 1: Adding new payment processor
    1. Extend PaymentProcessorBase class
    2. Implement charge(), refund(), webhook() methods
    3. Add processor config to .env.example
    4. Create integration tests with test API keys
    5. Document in docs/payments/[processor].md
```

---

## Key Takeaways

- [ ] Sub-agents = Agent-level optimization (not engineer orchestration)
- [ ] Agent uses Task tool to spawn sub-agents for exploration/research
- [ ] Trade-off: Slower execution, higher quality (especially large codebases)
- [ ] You can explicitly request, or let Claude decide autonomously
- [ ] Use `/agents` command to see running sub-agents
- [ ] Sub-agents are ONE technique for context management (not the only one)
- [ ] Create custom sub-agents for repeated domain-specific patterns (3+ uses)
- [ ] Use agent-creator to help design specialized agent definitions
- [ ] Custom agents capture knowledge and ensure consistent quality across team
